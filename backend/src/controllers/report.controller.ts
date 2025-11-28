import { Response } from 'express';
import { query } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { opportunity_id, reason, comment } = req.body;

    // Verificar que la oportunidad existe
    const oppResult = await query(
      'SELECT id, title, publisher_id FROM opportunities WHERE id = $1',
      [opportunity_id]
    );

    if (oppResult.rows.length === 0) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' });
    }

    // No permitir reportar sus propias publicaciones
    if (oppResult.rows[0].publisher_id === req.user.id) {
      return res.status(400).json({ error: 'No puedes reportar tus propias publicaciones' });
    }

    // Verificar si ya reportó esta publicación
    const existingReport = await query(
      'SELECT id FROM reports WHERE opportunity_id = $1 AND user_id = $2',
      [opportunity_id, req.user.id]
    );

    if (existingReport.rows.length > 0) {
      return res.status(400).json({ error: 'Ya has reportado esta publicación' });
    }

    const result = await query(
      `INSERT INTO reports (opportunity_id, user_id, reason, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [opportunity_id, req.user.id, reason, comment]
    );

    // Notificar a administradores (aquí simplemente registramos)
    console.log(`Nuevo reporte creado: ${result.rows[0].id}`);

    res.status(201).json({
      message: 'Reporte enviado exitosamente',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error al crear reporte:', error);
    res.status(500).json({ error: 'Error al crear reporte' });
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
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
      whereClause = `WHERE r.status = $${paramCount++}`;
      params.push(status);
    }

    const result = await query(
      `SELECT r.id, r.reason, r.comment, r.status, r.admin_notes, r.created_at,
              o.id as opportunity_id, o.title as opportunity_title, o.status as opportunity_status,
              u.id as reporter_id, u.name as reporter_name, u.email as reporter_email,
              pu.name as publisher_name
       FROM reports r
       JOIN opportunities o ON r.opportunity_id = o.id
       JOIN users u ON r.user_id = u.id
       JOIN users pu ON o.publisher_id = pu.id
       ${whereClause}
       ORDER BY r.created_at DESC
       LIMIT $${paramCount++} OFFSET $${paramCount}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM reports r ${whereClause}`,
      params
    );

    // Estadísticas
    const statsResult = await query(
      `SELECT status, COUNT(*) as count FROM reports GROUP BY status`
    );

    const stats: Record<string, number> = {
      total: 0,
      pendiente: 0,
      revisado: 0,
      accion_tomada: 0,
      descartado: 0
    };

    statsResult.rows.forEach(row => {
      stats[row.status] = parseInt(row.count);
      stats.total += parseInt(row.count);
    });

    res.json({
      reports: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit),
      stats
    });
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
};

export const updateReportStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { id } = req.params;
    const { status, admin_notes, action } = req.body;

    // Verificar que el reporte existe
    const reportResult = await query(
      `SELECT r.id, r.opportunity_id, o.status as opportunity_status
       FROM reports r
       JOIN opportunities o ON r.opportunity_id = o.id
       WHERE r.id = $1`,
      [id]
    );

    if (reportResult.rows.length === 0) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    const report = reportResult.rows[0];

    // Actualizar reporte
    await query(
      `UPDATE reports SET status = $1, admin_notes = $2, resolved_by = $3, resolved_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [status, admin_notes, req.user.id, id]
    );

    // Si se toma acción, actualizar la oportunidad
    if (action === 'suspend' && status === 'accion_tomada') {
      await query(
        'UPDATE opportunities SET status = $1 WHERE id = $2',
        ['rechazada', report.opportunity_id]
      );
    }

    // Registrar en audit log
    await query(
      `INSERT INTO audit_log (user_id, action, entity, entity_id, new_values)
       VALUES ($1, 'resolve_report', 'reports', $2, $3)`,
      [req.user.id, id, JSON.stringify({ status, action })]
    );

    res.json({ message: 'Reporte actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    res.status(500).json({ error: 'Error al actualizar reporte' });
  }
};

export const getReportDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { id } = req.params;

    const result = await query(
      `SELECT r.*,
              o.id as opportunity_id, o.title, o.description, o.status as opportunity_status,
              o.publisher_id, o.created_at as opportunity_created_at,
              u.name as reporter_name, u.email as reporter_email,
              pu.name as publisher_name, pu.email as publisher_email,
              ru.name as resolver_name
       FROM reports r
       JOIN opportunities o ON r.opportunity_id = o.id
       JOIN users u ON r.user_id = u.id
       JOIN users pu ON o.publisher_id = pu.id
       LEFT JOIN users ru ON r.resolved_by = ru.id
       WHERE r.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    // Obtener otros reportes de la misma oportunidad
    const relatedReports = await query(
      `SELECT r.id, r.reason, r.status, r.created_at, u.name as reporter_name
       FROM reports r
       JOIN users u ON r.user_id = u.id
       WHERE r.opportunity_id = $1 AND r.id != $2
       ORDER BY r.created_at DESC`,
      [result.rows[0].opportunity_id, id]
    );

    res.json({
      ...result.rows[0],
      related_reports: relatedReports.rows
    });
  } catch (error) {
    console.error('Error al obtener detalle del reporte:', error);
    res.status(500).json({ error: 'Error al obtener detalle del reporte' });
  }
};
