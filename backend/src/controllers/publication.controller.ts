import { Response } from 'express';
import { query } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getMyPublications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;

    let whereClause = 'WHERE o.publisher_id = $1';
    const params: any[] = [req.user.id];
    let paramCount = 2;

    if (status) {
      whereClause += ` AND o.status = $${paramCount++}`;
      params.push(status);
    }

    const result = await query(
      `SELECT o.id, o.title, o.description, o.modality, o.location, o.organization_name,
              o.application_deadline, o.status, o.views_count, o.applications_count,
              o.is_featured, o.created_at, o.updated_at,
              ot.name as type_name, ot.color as type_color
       FROM opportunities o
       JOIN opportunity_types ot ON o.type_id = ot.id
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT $${paramCount++} OFFSET $${paramCount}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM opportunities o ${whereClause}`,
      params
    );

    // Estadísticas por estado
    const statsResult = await query(
      `SELECT status, COUNT(*) as count
       FROM opportunities
       WHERE publisher_id = $1
       GROUP BY status`,
      [req.user.id]
    );

    const stats: Record<string, number> = {
      total: 0,
      borrador: 0,
      pendiente: 0,
      activa: 0,
      pausada: 0,
      finalizada: 0,
      rechazada: 0
    };

    statsResult.rows.forEach(row => {
      stats[row.status] = parseInt(row.count);
      stats.total += parseInt(row.count);
    });

    res.json({
      publications: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit),
      stats
    });
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
};

export const getPublicationById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;

    const result = await query(
      `SELECT o.*, ot.name as type_name, ot.color as type_color,
              f.name as target_faculty_name, s.name as target_school_name
       FROM opportunities o
       JOIN opportunity_types ot ON o.type_id = ot.id
       LEFT JOIN faculties f ON o.target_faculty_id = f.id
       LEFT JOIN schools s ON o.target_school_id = s.id
       WHERE o.id = $1 AND o.publisher_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener publicación:', error);
    res.status(500).json({ error: 'Error al obtener publicación' });
  }
};

export const getPublicationApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;

    // Verificar propiedad
    const oppResult = await query(
      'SELECT id, title FROM opportunities WHERE id = $1 AND publisher_id = $2',
      [id, req.user.id]
    );

    if (oppResult.rows.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    let whereClause = 'WHERE a.opportunity_id = $1';
    const params: any[] = [id];
    let paramCount = 2;

    if (status) {
      whereClause += ` AND a.status = $${paramCount++}`;
      params.push(status);
    }

    const result = await query(
      `SELECT a.id, a.status, a.cover_letter, a.publisher_notes, a.created_at,
              u.id as user_id, u.name, u.email, u.phone, u.profile_photo, u.cv_url,
              u.cycle, u.student_code,
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
      `SELECT COUNT(*) as total FROM applications a ${whereClause}`,
      params
    );

    res.json({
      opportunity: oppResult.rows[0],
      applications: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
    });
  } catch (error) {
    console.error('Error al obtener postulaciones:', error);
    res.status(500).json({ error: 'Error al obtener postulaciones' });
  }
};

export const updatePublicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Verificar propiedad y estado actual
    const checkResult = await query(
      'SELECT status FROM opportunities WHERE id = $1 AND publisher_id = $2',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    const currentStatus = checkResult.rows[0].status;

    // Validar transiciones permitidas para el publicador
    const validTransitions: Record<string, string[]> = {
      'borrador': ['pendiente'],
      'activa': ['pausada', 'finalizada'],
      'pausada': ['activa', 'finalizada'],
      'pendiente': ['borrador'],
      'finalizada': [],
      'rechazada': ['borrador']
    };

    if (!validTransitions[currentStatus]?.includes(status)) {
      return res.status(400).json({
        error: `No se puede cambiar de "${currentStatus}" a "${status}"`
      });
    }

    await query(
      'UPDATE opportunities SET status = $1 WHERE id = $2',
      [status, id]
    );

    res.json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

export const duplicatePublication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;

    // Obtener la publicación original
    const result = await query(
      `SELECT type_id, title, description, requirements, documents_required, benefits,
              modality, location, area, organization_name, external_url, visibility,
              target_faculty_id, target_school_id
       FROM opportunities
       WHERE id = $1 AND publisher_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    const original = result.rows[0];

    // Crear copia
    const newResult = await query(
      `INSERT INTO opportunities (
        type_id, title, description, requirements, documents_required, benefits,
        modality, location, area, publisher_id, publisher_name, organization_name,
        external_url, visibility, target_faculty_id, target_school_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'borrador')
      RETURNING id`,
      [
        original.type_id,
        `${original.title} (copia)`,
        original.description,
        original.requirements,
        original.documents_required,
        original.benefits,
        original.modality,
        original.location,
        original.area,
        req.user.id,
        req.user.name,
        original.organization_name,
        original.external_url,
        original.visibility,
        original.target_faculty_id,
        original.target_school_id
      ]
    );

    res.status(201).json({
      message: 'Publicación duplicada exitosamente',
      id: newResult.rows[0].id
    });
  } catch (error) {
    console.error('Error al duplicar publicación:', error);
    res.status(500).json({ error: 'Error al duplicar publicación' });
  }
};

export const getPublicationStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;

    // Verificar propiedad
    const checkResult = await query(
      'SELECT id, views_count FROM opportunities WHERE id = $1 AND publisher_id = $2',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    // Estadísticas de postulaciones
    const appStats = await query(
      `SELECT status, COUNT(*) as count
       FROM applications
       WHERE opportunity_id = $1
       GROUP BY status`,
      [id]
    );

    // Postulaciones por día (últimos 30 días)
    const dailyApps = await query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM applications
       WHERE opportunity_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [id]
    );

    // Postulantes por facultad
    const byFaculty = await query(
      `SELECT f.name as faculty, COUNT(*) as count
       FROM applications a
       JOIN users u ON a.user_id = u.id
       LEFT JOIN faculties f ON u.faculty_id = f.id
       WHERE a.opportunity_id = $1
       GROUP BY f.name
       ORDER BY count DESC
       LIMIT 5`,
      [id]
    );

    const stats: Record<string, number> = {
      total: 0,
      pendiente: 0,
      en_revision: 0,
      preseleccionado: 0,
      aceptado: 0,
      rechazado: 0
    };

    appStats.rows.forEach(row => {
      stats[row.status] = parseInt(row.count);
      stats.total += parseInt(row.count);
    });

    res.json({
      views: checkResult.rows[0].views_count,
      applications: stats,
      dailyApplications: dailyApps.rows,
      byFaculty: byFaculty.rows
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};
