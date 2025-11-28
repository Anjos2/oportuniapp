import { Request, Response } from 'express';
import { query } from '../config/database';

export const getFaculties = async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT id, name, code FROM faculties ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener facultades:', error);
    res.status(500).json({ error: 'Error al obtener facultades' });
  }
};

export const getSchools = async (req: Request, res: Response) => {
  try {
    const { facultyId } = req.params;

    const result = await query(
      'SELECT id, name, code FROM schools WHERE faculty_id = $1 ORDER BY name',
      [facultyId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener escuelas:', error);
    res.status(500).json({ error: 'Error al obtener escuelas' });
  }
};

export const getAllSchools = async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT s.id, s.name, s.code, s.faculty_id, f.name as faculty_name
       FROM schools s
       JOIN faculties f ON s.faculty_id = f.id
       ORDER BY f.name, s.name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener escuelas:', error);
    res.status(500).json({ error: 'Error al obtener escuelas' });
  }
};

export const getSkills = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    let queryText = 'SELECT id, name, category FROM skills';
    const params: any[] = [];

    if (category) {
      queryText += ' WHERE category = $1';
      params.push(category);
    }

    queryText += ' ORDER BY category, name';

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener habilidades:', error);
    res.status(500).json({ error: 'Error al obtener habilidades' });
  }
};

export const getSkillCategories = async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT DISTINCT category FROM skills WHERE category IS NOT NULL ORDER BY category'
    );
    res.json(result.rows.map(row => row.category));
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías de habilidades' });
  }
};

export const getLanguages = async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT id, name FROM languages ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener idiomas:', error);
    res.status(500).json({ error: 'Error al obtener idiomas' });
  }
};

export const getInterests = async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT id, name FROM interests ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener intereses:', error);
    res.status(500).json({ error: 'Error al obtener intereses' });
  }
};

export const getOpportunityTypes = async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT id, name, description, icon, color FROM opportunity_types ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tipos:', error);
    res.status(500).json({ error: 'Error al obtener tipos de oportunidad' });
  }
};

export const getStatistics = async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT
        (SELECT COUNT(*) FROM opportunities WHERE status = 'activa') as opportunities_count,
        (SELECT COUNT(*) FROM users WHERE role = 'user') as users_count,
        (SELECT COUNT(*) FROM applications) as applications_count,
        (SELECT COUNT(DISTINCT publisher_id) FROM opportunities) as publishers_count
    `);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

export const searchAll = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || (q as string).length < 2) {
      return res.status(400).json({ error: 'Término de búsqueda muy corto' });
    }

    const searchTerm = `%${q}%`;

    // Buscar en oportunidades
    const opportunities = await query(
      `SELECT id, title, 'opportunity' as type
       FROM opportunities
       WHERE status = 'activa' AND (title ILIKE $1 OR description ILIKE $1)
       LIMIT 5`,
      [searchTerm]
    );

    // Buscar en tipos de oportunidad
    const types = await query(
      `SELECT id, name, 'type' as type
       FROM opportunity_types
       WHERE name ILIKE $1
       LIMIT 3`,
      [searchTerm]
    );

    res.json({
      opportunities: opportunities.rows,
      types: types.rows
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ error: 'Error en búsqueda' });
  }
};
