import { Request, Response } from 'express';
import { query } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getOpportunities = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = (page - 1) * limit;

    const { type, modality, search, sort, faculty_id } = req.query;

    let whereClause = "WHERE o.status = 'activa'";
    const params: any[] = [];
    let paramCount = 1;

    if (type) {
      whereClause += ` AND o.type_id = $${paramCount++}`;
      params.push(type);
    }

    if (modality) {
      whereClause += ` AND o.modality = $${paramCount++}`;
      params.push(modality);
    }

    if (search) {
      whereClause += ` AND (o.title ILIKE $${paramCount} OR o.description ILIKE $${paramCount} OR o.organization_name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (faculty_id) {
      whereClause += ` AND (o.visibility = 'publico' OR o.target_faculty_id = $${paramCount++})`;
      params.push(faculty_id);
    }

    let orderClause = 'ORDER BY o.is_featured DESC, o.created_at DESC';
    if (sort === 'recent') {
      orderClause = 'ORDER BY o.created_at DESC';
    } else if (sort === 'deadline') {
      orderClause = 'ORDER BY o.application_deadline ASC NULLS LAST';
    } else if (sort === 'popular') {
      orderClause = 'ORDER BY o.views_count DESC';
    }

    const countResult = await query(
      `SELECT COUNT(*) as total FROM opportunities o ${whereClause}`,
      params
    );

    params.push(limit, offset);
    const result = await query(
      `SELECT o.id, o.title, o.description, o.modality, o.location, o.organization_name,
              o.start_date, o.end_date, o.application_deadline, o.image_url,
              o.views_count, o.applications_count, o.is_featured, o.created_at,
              ot.name as type_name, ot.color as type_color, ot.icon as type_icon
       FROM opportunities o
       JOIN opportunity_types ot ON o.type_id = ot.id
       ${whereClause}
       ${orderClause}
       LIMIT $${paramCount++} OFFSET $${paramCount}`,
      params
    );

    res.json({
      opportunities: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
    });
  } catch (error) {
    console.error('Error al obtener oportunidades:', error);
    res.status(500).json({ error: 'Error al obtener oportunidades' });
  }
};

export const getOpportunityById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT o.*, ot.name as type_name, ot.color as type_color, ot.icon as type_icon,
              u.name as publisher_user_name, u.email as publisher_email,
              f.name as target_faculty_name, s.name as target_school_name
       FROM opportunities o
       JOIN opportunity_types ot ON o.type_id = ot.id
       JOIN users u ON o.publisher_id = u.id
       LEFT JOIN faculties f ON o.target_faculty_id = f.id
       LEFT JOIN schools s ON o.target_school_id = s.id
       WHERE o.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' });
    }

    const opportunity = result.rows[0];

    // Incrementar contador de vistas
    await query(
      'UPDATE opportunities SET views_count = views_count + 1 WHERE id = $1',
      [id]
    );

    // Verificar si el usuario ha guardado/postulado
    let isSaved = false;
    let hasApplied = false;
    let applicationStatus = null;

    if (req.user) {
      const savedResult = await query(
        'SELECT 1 FROM saved_opportunities WHERE user_id = $1 AND opportunity_id = $2',
        [req.user.id, id]
      );
      isSaved = savedResult.rows.length > 0;

      const appliedResult = await query(
        'SELECT status FROM applications WHERE user_id = $1 AND opportunity_id = $2',
        [req.user.id, id]
      );
      hasApplied = appliedResult.rows.length > 0;
      if (hasApplied) {
        applicationStatus = appliedResult.rows[0].status;
      }
    }

    res.json({
      ...opportunity,
      is_saved: isSaved,
      has_applied: hasApplied,
      application_status: applicationStatus
    });
  } catch (error) {
    console.error('Error al obtener oportunidad:', error);
    res.status(500).json({ error: 'Error al obtener oportunidad' });
  }
};

export const getFeaturedOpportunities = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;

    const result = await query(
      `SELECT o.id, o.title, o.description, o.modality, o.location, o.organization_name,
              o.application_deadline, o.image_url, o.is_featured,
              ot.name as type_name, ot.color as type_color, ot.icon as type_icon
       FROM opportunities o
       JOIN opportunity_types ot ON o.type_id = ot.id
       WHERE o.status = 'activa' AND o.is_featured = true
       ORDER BY o.created_at DESC
       LIMIT $1`,
      [limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener destacadas:', error);
    res.status(500).json({ error: 'Error al obtener oportunidades destacadas' });
  }
};

export const getSimilarOpportunities = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 4;

    // Obtener tipo de la oportunidad actual
    const currentResult = await query(
      'SELECT type_id FROM opportunities WHERE id = $1',
      [id]
    );

    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' });
    }

    const typeId = currentResult.rows[0].type_id;

    const result = await query(
      `SELECT o.id, o.title, o.description, o.modality, o.organization_name,
              o.application_deadline, o.image_url,
              ot.name as type_name, ot.color as type_color
       FROM opportunities o
       JOIN opportunity_types ot ON o.type_id = ot.id
       WHERE o.status = 'activa' AND o.type_id = $1 AND o.id != $2
       ORDER BY o.created_at DESC
       LIMIT $3`,
      [typeId, id, limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener similares:', error);
    res.status(500).json({ error: 'Error al obtener oportunidades similares' });
  }
};

export const createOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const {
      type_id, title, description, requirements, documents_required, benefits,
      start_date, end_date, application_deadline, modality, location, area,
      organization_name, external_url, visibility, target_faculty_id,
      target_school_id, status
    } = req.body;

    const attachmentUrl = req.file ? `/uploads/attachments/${req.file.filename}` : null;

    const result = await query(
      `INSERT INTO opportunities (
        type_id, title, description, requirements, documents_required, benefits,
        start_date, end_date, application_deadline, modality, location, area,
        publisher_id, publisher_name, organization_name, external_url, attachment_url,
        visibility, target_faculty_id, target_school_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING id`,
      [
        type_id, title, description, requirements, documents_required, benefits,
        start_date || null, end_date || null, application_deadline || null,
        modality, location, area, req.user.id, req.user.name, organization_name,
        external_url, attachmentUrl, visibility || 'publico',
        target_faculty_id || null, target_school_id || null,
        status || 'pendiente'
      ]
    );

    // Registrar en audit log
    await query(
      `INSERT INTO audit_log (user_id, action, entity, entity_id)
       VALUES ($1, 'create', 'opportunities', $2)`,
      [req.user.id, result.rows[0].id]
    );

    res.status(201).json({
      message: 'Oportunidad creada exitosamente',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error al crear oportunidad:', error);
    res.status(500).json({ error: 'Error al crear oportunidad' });
  }
};

export const updateOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;

    // Verificar propiedad
    const checkResult = await query(
      'SELECT publisher_id, status FROM opportunities WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' });
    }

    if (checkResult.rows[0].publisher_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para editar esta oportunidad' });
    }

    const {
      type_id, title, description, requirements, documents_required, benefits,
      start_date, end_date, application_deadline, modality, location, area,
      organization_name, external_url, visibility, target_faculty_id,
      target_school_id, status
    } = req.body;

    const attachmentUrl = req.file ? `/uploads/attachments/${req.file.filename}` : undefined;

    let updateQuery = `UPDATE opportunities SET
      type_id = COALESCE($1, type_id),
      title = COALESCE($2, title),
      description = COALESCE($3, description),
      requirements = COALESCE($4, requirements),
      documents_required = COALESCE($5, documents_required),
      benefits = COALESCE($6, benefits),
      start_date = COALESCE($7, start_date),
      end_date = COALESCE($8, end_date),
      application_deadline = COALESCE($9, application_deadline),
      modality = COALESCE($10, modality),
      location = COALESCE($11, location),
      area = COALESCE($12, area),
      organization_name = COALESCE($13, organization_name),
      external_url = COALESCE($14, external_url),
      visibility = COALESCE($15, visibility),
      target_faculty_id = $16,
      target_school_id = $17,
      status = COALESCE($18, status)`;

    const params = [
      type_id, title, description, requirements, documents_required, benefits,
      start_date, end_date, application_deadline, modality, location, area,
      organization_name, external_url, visibility, target_faculty_id || null,
      target_school_id || null, status
    ];

    if (attachmentUrl) {
      updateQuery += `, attachment_url = $19 WHERE id = $20`;
      params.push(attachmentUrl, id);
    } else {
      updateQuery += ` WHERE id = $19`;
      params.push(id);
    }

    await query(updateQuery, params);

    res.json({ message: 'Oportunidad actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar oportunidad:', error);
    res.status(500).json({ error: 'Error al actualizar oportunidad' });
  }
};

export const deleteOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;

    // Verificar propiedad
    const checkResult = await query(
      'SELECT publisher_id FROM opportunities WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' });
    }

    if (checkResult.rows[0].publisher_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para eliminar esta oportunidad' });
    }

    await query('DELETE FROM opportunities WHERE id = $1', [id]);

    res.json({ message: 'Oportunidad eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar oportunidad:', error);
    res.status(500).json({ error: 'Error al eliminar oportunidad' });
  }
};

export const saveOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;

    // Verificar que existe
    const checkResult = await query(
      'SELECT id FROM opportunities WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' });
    }

    // Verificar si ya está guardada
    const savedResult = await query(
      'SELECT 1 FROM saved_opportunities WHERE user_id = $1 AND opportunity_id = $2',
      [req.user.id, id]
    );

    if (savedResult.rows.length > 0) {
      return res.status(400).json({ error: 'La oportunidad ya está guardada' });
    }

    await query(
      'INSERT INTO saved_opportunities (user_id, opportunity_id) VALUES ($1, $2)',
      [req.user.id, id]
    );

    res.json({ message: 'Oportunidad guardada exitosamente' });
  } catch (error) {
    console.error('Error al guardar oportunidad:', error);
    res.status(500).json({ error: 'Error al guardar oportunidad' });
  }
};

export const unsaveOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;

    await query(
      'DELETE FROM saved_opportunities WHERE user_id = $1 AND opportunity_id = $2',
      [req.user.id, id]
    );

    res.json({ message: 'Oportunidad removida de guardados' });
  } catch (error) {
    console.error('Error al remover oportunidad guardada:', error);
    res.status(500).json({ error: 'Error al remover oportunidad guardada' });
  }
};

export const getSavedOpportunities = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT o.id, o.title, o.description, o.modality, o.location, o.organization_name,
              o.application_deadline, o.image_url, o.status,
              ot.name as type_name, ot.color as type_color,
              so.created_at as saved_at
       FROM saved_opportunities so
       JOIN opportunities o ON so.opportunity_id = o.id
       JOIN opportunity_types ot ON o.type_id = ot.id
       WHERE so.user_id = $1
       ORDER BY so.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) as total FROM saved_opportunities WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      opportunities: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
    });
  } catch (error) {
    console.error('Error al obtener guardadas:', error);
    res.status(500).json({ error: 'Error al obtener oportunidades guardadas' });
  }
};
