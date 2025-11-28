import { Response } from 'express';
import { query } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { opportunityId } = req.params;
    const { cover_letter } = req.body;

    // Verificar que la oportunidad existe y está activa
    const oppResult = await query(
      `SELECT id, title, publisher_id, status, external_url
       FROM opportunities WHERE id = $1`,
      [opportunityId]
    );

    if (oppResult.rows.length === 0) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' });
    }

    const opportunity = oppResult.rows[0];

    if (opportunity.status !== 'activa') {
      return res.status(400).json({ error: 'La oportunidad no está disponible para postulaciones' });
    }

    // Verificar si ya postuló
    const existingApp = await query(
      'SELECT id FROM applications WHERE user_id = $1 AND opportunity_id = $2',
      [req.user.id, opportunityId]
    );

    if (existingApp.rows.length > 0) {
      return res.status(400).json({ error: 'Ya has postulado a esta oportunidad' });
    }

    // No permitir postular a sus propias oportunidades
    if (opportunity.publisher_id === req.user.id) {
      return res.status(400).json({ error: 'No puedes postular a tus propias publicaciones' });
    }

    // Crear postulación
    const result = await query(
      `INSERT INTO applications (user_id, opportunity_id, cover_letter, status)
       VALUES ($1, $2, $3, 'pendiente')
       RETURNING id`,
      [req.user.id, opportunityId, cover_letter]
    );

    // Notificar al publicador
    await query(
      `INSERT INTO notifications (user_id, title, message, type, link)
       VALUES ($1, 'Nueva postulación', $2, 'application', $3)`,
      [
        opportunity.publisher_id,
        `${req.user.name} ha postulado a "${opportunity.title}"`,
        `/my-publications/${opportunityId}/applications`
      ]
    );

    res.status(201).json({
      message: 'Postulación enviada exitosamente',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error al crear postulación:', error);
    res.status(500).json({ error: 'Error al crear postulación' });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;

    let whereClause = 'WHERE a.user_id = $1';
    const params: any[] = [req.user.id];
    let paramCount = 2;

    if (status) {
      whereClause += ` AND a.status = $${paramCount++}`;
      params.push(status);
    }

    const result = await query(
      `SELECT a.id, a.status, a.cover_letter, a.created_at, a.updated_at,
              o.id as opportunity_id, o.title, o.organization_name, o.modality,
              o.application_deadline, o.image_url, o.status as opportunity_status,
              ot.name as type_name, ot.color as type_color
       FROM applications a
       JOIN opportunities o ON a.opportunity_id = o.id
       JOIN opportunity_types ot ON o.type_id = ot.id
       ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT $${paramCount++} OFFSET $${paramCount}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM applications a ${whereClause}`,
      params
    );

    // Estadísticas por estado
    const statsResult = await query(
      `SELECT status, COUNT(*) as count
       FROM applications
       WHERE user_id = $1
       GROUP BY status`,
      [req.user.id]
    );

    const stats = {
      total: 0,
      pendiente: 0,
      en_revision: 0,
      preseleccionado: 0,
      aceptado: 0,
      rechazado: 0
    };

    statsResult.rows.forEach(row => {
      stats[row.status as keyof typeof stats] = parseInt(row.count);
      stats.total += parseInt(row.count);
    });

    res.json({
      applications: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit),
      stats
    });
  } catch (error) {
    console.error('Error al obtener postulaciones:', error);
    res.status(500).json({ error: 'Error al obtener postulaciones' });
  }
};

export const getReceivedApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { opportunityId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;
    const search = req.query.search as string;

    // Verificar propiedad de la oportunidad
    const oppResult = await query(
      'SELECT publisher_id FROM opportunities WHERE id = $1',
      [opportunityId]
    );

    if (oppResult.rows.length === 0) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' });
    }

    if (oppResult.rows[0].publisher_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes acceso a estas postulaciones' });
    }

    let whereClause = 'WHERE a.opportunity_id = $1';
    const params: any[] = [opportunityId];
    let paramCount = 2;

    if (status) {
      whereClause += ` AND a.status = $${paramCount++}`;
      params.push(status);
    }

    if (search) {
      whereClause += ` AND (u.name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    const result = await query(
      `SELECT a.id, a.status, a.cover_letter, a.notes, a.publisher_notes,
              a.created_at, a.updated_at,
              u.id as user_id, u.name, u.email, u.phone, u.profile_photo, u.cv_url,
              u.cycle, u.student_code, u.user_status,
              f.name as faculty_name, s.name as school_name
       FROM applications a
       JOIN users u ON a.user_id = u.id
       LEFT JOIN faculties f ON u.faculty_id = f.id
       LEFT JOIN schools s ON u.school_id = s.id
       ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT $${paramCount++} OFFSET $${paramCount}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM applications a
       JOIN users u ON a.user_id = u.id
       ${whereClause}`,
      params
    );

    // Estadísticas
    const statsResult = await query(
      `SELECT status, COUNT(*) as count
       FROM applications
       WHERE opportunity_id = $1
       GROUP BY status`,
      [opportunityId]
    );

    const stats: Record<string, number> = {};
    statsResult.rows.forEach(row => {
      stats[row.status] = parseInt(row.count);
    });

    res.json({
      applications: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit),
      stats
    });
  } catch (error) {
    console.error('Error al obtener postulaciones:', error);
    res.status(500).json({ error: 'Error al obtener postulaciones' });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;
    const { status, publisher_notes } = req.body;

    // Verificar la aplicación y propiedad de la oportunidad
    const appResult = await query(
      `SELECT a.id, a.user_id, a.status as current_status, o.publisher_id, o.title
       FROM applications a
       JOIN opportunities o ON a.opportunity_id = o.id
       WHERE a.id = $1`,
      [id]
    );

    if (appResult.rows.length === 0) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }

    const application = appResult.rows[0];

    if (application.publisher_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para modificar esta postulación' });
    }

    // Validar transición de estado
    const validTransitions: Record<string, string[]> = {
      'pendiente': ['en_revision', 'rechazado'],
      'en_revision': ['preseleccionado', 'rechazado'],
      'preseleccionado': ['aceptado', 'rechazado'],
      'aceptado': [],
      'rechazado': []
    };

    if (!validTransitions[application.current_status]?.includes(status)) {
      return res.status(400).json({
        error: `No se puede cambiar de "${application.current_status}" a "${status}"`
      });
    }

    await query(
      `UPDATE applications SET status = $1, publisher_notes = COALESCE($2, publisher_notes), reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [status, publisher_notes, id]
    );

    // Notificar al postulante
    const statusMessages: Record<string, string> = {
      'en_revision': 'Tu postulación está siendo revisada',
      'preseleccionado': '¡Felicitaciones! Has sido preseleccionado',
      'aceptado': '¡Felicitaciones! Tu postulación ha sido aceptada',
      'rechazado': 'Tu postulación no ha sido seleccionada'
    };

    await query(
      `INSERT INTO notifications (user_id, title, message, type, link)
       VALUES ($1, 'Actualización de postulación', $2, $3, '/my-applications')`,
      [
        application.user_id,
        `${statusMessages[status]} para "${application.title}"`,
        status === 'aceptado' || status === 'preseleccionado' ? 'success' : 'info'
      ]
    );

    res.json({ message: 'Estado de postulación actualizado' });
  } catch (error) {
    console.error('Error al actualizar postulación:', error);
    res.status(500).json({ error: 'Error al actualizar postulación' });
  }
};

export const withdrawApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;

    const result = await query(
      `UPDATE applications SET status = 'retirado'
       WHERE id = $1 AND user_id = $2 AND status IN ('pendiente', 'en_revision')
       RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Postulación no encontrada o no se puede retirar'
      });
    }

    res.json({ message: 'Postulación retirada exitosamente' });
  } catch (error) {
    console.error('Error al retirar postulación:', error);
    res.status(500).json({ error: 'Error al retirar postulación' });
  }
};

export const exportApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { opportunityId } = req.params;

    // Verificar propiedad
    const oppResult = await query(
      'SELECT publisher_id, title FROM opportunities WHERE id = $1',
      [opportunityId]
    );

    if (oppResult.rows.length === 0) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' });
    }

    if (oppResult.rows[0].publisher_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes acceso a estos datos' });
    }

    const result = await query(
      `SELECT u.name, u.email, u.phone, u.student_code, u.cycle,
              f.name as faculty, s.name as school,
              a.status, a.created_at, a.cover_letter
       FROM applications a
       JOIN users u ON a.user_id = u.id
       LEFT JOIN faculties f ON u.faculty_id = f.id
       LEFT JOIN schools s ON u.school_id = s.id
       WHERE a.opportunity_id = $1
       ORDER BY a.created_at ASC`,
      [opportunityId]
    );

    // Generar CSV
    const headers = ['Nombre', 'Email', 'Teléfono', 'Código', 'Ciclo', 'Facultad', 'Escuela', 'Estado', 'Fecha', 'Carta'];
    const rows = result.rows.map(row => [
      row.name,
      row.email,
      row.phone || '',
      row.student_code || '',
      row.cycle || '',
      row.faculty || '',
      row.school || '',
      row.status,
      new Date(row.created_at).toLocaleDateString('es-PE'),
      (row.cover_letter || '').replace(/[\n\r,]/g, ' ')
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=postulaciones_${opportunityId}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Error al exportar postulaciones:', error);
    res.status(500).json({ error: 'Error al exportar postulaciones' });
  }
};
