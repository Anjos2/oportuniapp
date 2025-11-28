import { Response } from 'express';
import { query } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    // KPIs principales
    const kpis = await query(`
      SELECT
        (SELECT COUNT(*) FROM opportunities WHERE status = 'activa') as active_opportunities,
        (SELECT COUNT(*) FROM applications WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_applications,
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'user' AND created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users,
        (SELECT COUNT(*) FROM reports WHERE status = 'pendiente') as pending_reports,
        (SELECT COUNT(*) FROM external_accounts WHERE status = 'pendiente') as pending_accounts
    `);

    // Oportunidades por tipo
    const byType = await query(`
      SELECT ot.name, ot.color, COUNT(o.id) as count
      FROM opportunity_types ot
      LEFT JOIN opportunities o ON o.type_id = ot.id AND o.status = 'activa'
      GROUP BY ot.id, ot.name, ot.color
      ORDER BY count DESC
    `);

    // Postulaciones por mes (últimos 6 meses)
    const monthlyTrend = await query(`
      SELECT
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COUNT(*) as applications,
        COUNT(DISTINCT user_id) as unique_users
      FROM applications
      WHERE created_at >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month
    `);

    // Postulaciones por facultad
    const byFaculty = await query(`
      SELECT f.code, f.name, COUNT(a.id) as count
      FROM faculties f
      LEFT JOIN users u ON u.faculty_id = f.id
      LEFT JOIN applications a ON a.user_id = u.id AND a.created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY f.id, f.code, f.name
      ORDER BY count DESC
      LIMIT 10
    `);

    // Oportunidades recientes
    const recentOpportunities = await query(`
      SELECT o.id, o.title, o.status, o.created_at, o.applications_count,
             ot.name as type_name, u.name as publisher_name
      FROM opportunities o
      JOIN opportunity_types ot ON o.type_id = ot.id
      JOIN users u ON o.publisher_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    // Reportes recientes
    const recentReports = await query(`
      SELECT r.id, r.reason, r.status, r.created_at,
             o.title as opportunity_title, u.name as reporter_name
      FROM reports r
      JOIN opportunities o ON r.opportunity_id = o.id
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
      LIMIT 5
    `);

    res.json({
      kpis: kpis.rows[0],
      charts: {
        byType: byType.rows,
        monthlyTrend: monthlyTrend.rows,
        byFaculty: byFaculty.rows
      },
      recentOpportunities: recentOpportunities.rows,
      recentReports: recentReports.rows
    });
  } catch (error) {
    console.error('Error al obtener dashboard:', error);
    res.status(500).json({ error: 'Error al obtener dashboard' });
  }
};

export const getAdminPublications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const { status, type, search } = req.query;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      whereClause += ` AND o.status = $${paramCount++}`;
      params.push(status);
    }

    if (type) {
      whereClause += ` AND o.type_id = $${paramCount++}`;
      params.push(type);
    }

    if (search) {
      whereClause += ` AND (o.title ILIKE $${paramCount} OR o.organization_name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    const result = await query(
      `SELECT o.id, o.title, o.status, o.views_count, o.applications_count,
              o.is_featured, o.created_at,
              ot.name as type_name, ot.color as type_color,
              u.name as publisher_name, u.email as publisher_email
       FROM opportunities o
       JOIN opportunity_types ot ON o.type_id = ot.id
       JOIN users u ON o.publisher_id = u.id
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT $${paramCount++} OFFSET $${paramCount}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM opportunities o ${whereClause}`,
      params
    );

    res.json({
      publications: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
    });
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
};

export const updatePublicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { id } = req.params;
    const { status, rejection_reason, is_featured } = req.body;

    // Verificar que existe
    const checkResult = await query(
      'SELECT id, publisher_id, title FROM opportunities WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    const updateFields: string[] = [];
    const updateParams: any[] = [];
    let paramCount = 1;

    if (status !== undefined) {
      updateFields.push(`status = $${paramCount++}`);
      updateParams.push(status);
    }

    if (rejection_reason !== undefined) {
      updateFields.push(`rejection_reason = $${paramCount++}`);
      updateParams.push(rejection_reason);
    }

    if (is_featured !== undefined) {
      updateFields.push(`is_featured = $${paramCount++}`);
      updateParams.push(is_featured);
    }

    if (status) {
      updateFields.push(`reviewed_by = $${paramCount++}`);
      updateParams.push(req.user.id);
      updateFields.push(`reviewed_at = CURRENT_TIMESTAMP`);
    }

    updateParams.push(id);

    await query(
      `UPDATE opportunities SET ${updateFields.join(', ')} WHERE id = $${paramCount}`,
      updateParams
    );

    // Notificar al publicador
    const opportunity = checkResult.rows[0];
    let notificationMessage = '';

    if (status === 'activa') {
      notificationMessage = `Tu publicación "${opportunity.title}" ha sido aprobada y está visible`;
    } else if (status === 'rechazada') {
      notificationMessage = `Tu publicación "${opportunity.title}" ha sido rechazada. Razón: ${rejection_reason || 'No especificada'}`;
    }

    if (notificationMessage) {
      await query(
        `INSERT INTO notifications (user_id, title, message, type, link)
         VALUES ($1, 'Actualización de publicación', $2, $3, '/my-publications')`,
        [
          opportunity.publisher_id,
          notificationMessage,
          status === 'activa' ? 'success' : 'warning'
        ]
      );
    }

    // Registrar en audit log
    await query(
      `INSERT INTO audit_log (user_id, action, entity, entity_id, new_values)
       VALUES ($1, 'admin_update', 'opportunities', $2, $3)`,
      [req.user.id, id, JSON.stringify({ status, is_featured })]
    );

    res.json({ message: 'Publicación actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar publicación:', error);
    res.status(500).json({ error: 'Error al actualizar publicación' });
  }
};

export const deletePublication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { id } = req.params;

    await query('DELETE FROM opportunities WHERE id = $1', [id]);

    res.json({ message: 'Publicación eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar publicación:', error);
    res.status(500).json({ error: 'Error al eliminar publicación' });
  }
};

export const getExternalAccounts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;

    let whereClause = '';
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      whereClause = `WHERE status = $${paramCount++}`;
      params.push(status);
    }

    const result = await query(
      `SELECT ea.*, u.email as linked_user_email
       FROM external_accounts ea
       LEFT JOIN users u ON ea.user_id = u.id
       ${whereClause}
       ORDER BY ea.created_at DESC
       LIMIT $${paramCount++} OFFSET $${paramCount}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM external_accounts ${whereClause}`,
      params
    );

    // Estadísticas
    const statsResult = await query(
      `SELECT status, COUNT(*) as count FROM external_accounts GROUP BY status`
    );

    const stats: Record<string, number> = {};
    statsResult.rows.forEach(row => {
      stats[row.status] = parseInt(row.count);
    });

    res.json({
      accounts: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit),
      stats
    });
  } catch (error) {
    console.error('Error al obtener cuentas externas:', error);
    res.status(500).json({ error: 'Error al obtener cuentas externas' });
  }
};

export const createExternalAccount = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const {
      organization_name, ruc, representative_name, email, phone,
      entity_type, description, website
    } = req.body;

    // Verificar si el email ya existe
    const existingEmail = await query(
      'SELECT id FROM external_accounts WHERE email = $1',
      [email]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe una cuenta con este email' });
    }

    const result = await query(
      `INSERT INTO external_accounts (
        organization_name, ruc, representative_name, email, phone,
        entity_type, description, website, status, approved_by, approved_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'aprobada', $9, CURRENT_TIMESTAMP)
      RETURNING id`,
      [
        organization_name, ruc, representative_name, email, phone,
        entity_type, description, website, req.user.id
      ]
    );

    res.status(201).json({
      message: 'Cuenta externa creada exitosamente',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error al crear cuenta externa:', error);
    res.status(500).json({ error: 'Error al crear cuenta externa' });
  }
};

export const updateExternalAccountStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { id } = req.params;
    const { status, rejection_reason } = req.body;

    // Verificar que existe
    const checkResult = await query(
      'SELECT id, email, organization_name FROM external_accounts WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cuenta externa no encontrada' });
    }

    await query(
      `UPDATE external_accounts SET
        status = $1,
        rejection_reason = $2,
        approved_by = $3,
        approved_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [status, rejection_reason, req.user.id, id]
    );

    // Si se aprueba, crear usuario publisher
    if (status === 'aprobada') {
      const account = checkResult.rows[0];

      // Generar contraseña temporal
      const tempPassword = Math.random().toString(36).slice(-8);

      // Aquí normalmente enviarías un email con las credenciales
      console.log(`Cuenta aprobada: ${account.email}, Contraseña temporal: ${tempPassword}`);
    }

    res.json({ message: 'Estado de cuenta actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar cuenta externa:', error);
    res.status(500).json({ error: 'Error al actualizar cuenta externa' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const { role, search } = req.query;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (role) {
      whereClause += ` AND u.role = $${paramCount++}`;
      params.push(role);
    }

    if (search) {
      whereClause += ` AND (u.name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    const result = await query(
      `SELECT u.id, u.email, u.name, u.role, u.status, u.profile_photo,
              u.created_at, f.name as faculty_name,
              (SELECT COUNT(*) FROM applications WHERE user_id = u.id) as applications_count
       FROM users u
       LEFT JOIN faculties f ON u.faculty_id = f.id
       ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT $${paramCount++} OFFSET $${paramCount}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM users u ${whereClause}`,
      params
    );

    res.json({
      users: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const getAuditLog = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT al.*, u.name as user_name, u.email as user_email
       FROM audit_log al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) as total FROM audit_log');

    res.json({
      logs: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
    });
  } catch (error) {
    console.error('Error al obtener audit log:', error);
    res.status(500).json({ error: 'Error al obtener registro de auditoría' });
  }
};
