import { Response } from 'express';
import { query, getClient } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const result = await query(
      `SELECT u.id, u.email, u.name, u.phone, u.role, u.faculty_id, u.school_id,
              u.cycle, u.student_code, u.user_status, u.profile_photo, u.cv_url,
              u.bio, u.linkedin_url, u.created_at,
              f.name as faculty_name, s.name as school_name
       FROM users u
       LEFT JOIN faculties f ON u.faculty_id = f.id
       LEFT JOIN schools s ON u.school_id = s.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    // Obtener competencias del usuario
    const skillsResult = await query(
      `SELECT s.id, s.name, s.category, us.level
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1`,
      [req.user.id]
    );

    const languagesResult = await query(
      `SELECT l.id, l.name, ul.level
       FROM user_languages ul
       JOIN languages l ON ul.language_id = l.id
       WHERE ul.user_id = $1`,
      [req.user.id]
    );

    const interestsResult = await query(
      `SELECT i.id, i.name
       FROM user_interests ui
       JOIN interests i ON ui.interest_id = i.id
       WHERE ui.user_id = $1`,
      [req.user.id]
    );

    res.json({
      ...user,
      skills: skillsResult.rows,
      languages: languagesResult.rows,
      interests: interestsResult.rows
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const client = await getClient();

  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    await client.query('BEGIN');

    const {
      name, phone, faculty_id, school_id, cycle, student_code,
      user_status, bio, linkedin_url, skills, languages, interests
    } = req.body;

    // Actualizar datos básicos
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCount++}`);
      updateValues.push(name);
    }
    if (phone !== undefined) {
      updateFields.push(`phone = $${paramCount++}`);
      updateValues.push(phone);
    }
    if (faculty_id !== undefined) {
      updateFields.push(`faculty_id = $${paramCount++}`);
      updateValues.push(faculty_id);
    }
    if (school_id !== undefined) {
      updateFields.push(`school_id = $${paramCount++}`);
      updateValues.push(school_id);
    }
    if (cycle !== undefined) {
      updateFields.push(`cycle = $${paramCount++}`);
      updateValues.push(cycle);
    }
    if (student_code !== undefined) {
      updateFields.push(`student_code = $${paramCount++}`);
      updateValues.push(student_code);
    }
    if (user_status !== undefined) {
      updateFields.push(`user_status = $${paramCount++}`);
      updateValues.push(user_status);
    }
    if (bio !== undefined) {
      updateFields.push(`bio = $${paramCount++}`);
      updateValues.push(bio);
    }
    if (linkedin_url !== undefined) {
      updateFields.push(`linkedin_url = $${paramCount++}`);
      updateValues.push(linkedin_url);
    }

    if (updateFields.length > 0) {
      updateValues.push(req.user.id);
      await client.query(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCount}`,
        updateValues
      );
    }

    // Actualizar habilidades
    if (skills !== undefined) {
      await client.query('DELETE FROM user_skills WHERE user_id = $1', [req.user.id]);
      for (const skill of skills) {
        await client.query(
          'INSERT INTO user_skills (user_id, skill_id, level) VALUES ($1, $2, $3)',
          [req.user.id, skill.id, skill.level || 'intermedio']
        );
      }
    }

    // Actualizar idiomas
    if (languages !== undefined) {
      await client.query('DELETE FROM user_languages WHERE user_id = $1', [req.user.id]);
      for (const language of languages) {
        await client.query(
          'INSERT INTO user_languages (user_id, language_id, level) VALUES ($1, $2, $3)',
          [req.user.id, language.id, language.level || 'intermedio']
        );
      }
    }

    // Actualizar intereses
    if (interests !== undefined) {
      await client.query('DELETE FROM user_interests WHERE user_id = $1', [req.user.id]);
      for (const interest of interests) {
        await client.query(
          'INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)',
          [req.user.id, interest.id || interest]
        );
      }
    }

    await client.query('COMMIT');

    res.json({ message: 'Perfil actualizado exitosamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  } finally {
    client.release();
  }
};

export const uploadPhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    const photoUrl = `/uploads/photos/${req.file.filename}`;

    await query(
      'UPDATE users SET profile_photo = $1 WHERE id = $2',
      [photoUrl, req.user.id]
    );

    res.json({
      message: 'Foto de perfil actualizada',
      photo_url: photoUrl
    });
  } catch (error) {
    console.error('Error al subir foto:', error);
    res.status(500).json({ error: 'Error al subir foto de perfil' });
  }
};

export const uploadCV = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }

    const cvUrl = `/uploads/cvs/${req.file.filename}`;

    await query(
      'UPDATE users SET cv_url = $1 WHERE id = $2',
      [cvUrl, req.user.id]
    );

    res.json({
      message: 'CV subido exitosamente',
      cv_url: cvUrl
    });
  } catch (error) {
    console.error('Error al subir CV:', error);
    res.status(500).json({ error: 'Error al subir CV' });
  }
};

export const getProfileProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const result = await query(
      `SELECT name, phone, faculty_id, school_id, cycle, student_code,
              profile_photo, cv_url, bio, linkedin_url
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    // Contar competencias
    const skillsCount = await query(
      'SELECT COUNT(*) as count FROM user_skills WHERE user_id = $1',
      [req.user.id]
    );
    const languagesCount = await query(
      'SELECT COUNT(*) as count FROM user_languages WHERE user_id = $1',
      [req.user.id]
    );
    const interestsCount = await query(
      'SELECT COUNT(*) as count FROM user_interests WHERE user_id = $1',
      [req.user.id]
    );

    // Calcular progreso
    const fields = [
      { name: 'Nombre completo', completed: !!user.name, weight: 10 },
      { name: 'Teléfono', completed: !!user.phone, weight: 10 },
      { name: 'Facultad', completed: !!user.faculty_id, weight: 10 },
      { name: 'Escuela', completed: !!user.school_id, weight: 10 },
      { name: 'Ciclo', completed: !!user.cycle, weight: 5 },
      { name: 'Código de estudiante', completed: !!user.student_code, weight: 5 },
      { name: 'Foto de perfil', completed: !!user.profile_photo, weight: 10 },
      { name: 'CV', completed: !!user.cv_url, weight: 15 },
      { name: 'Biografía', completed: !!user.bio, weight: 5 },
      { name: 'LinkedIn', completed: !!user.linkedin_url, weight: 5 },
      { name: 'Habilidades (mín. 3)', completed: parseInt(skillsCount.rows[0].count) >= 3, weight: 5 },
      { name: 'Idiomas (mín. 1)', completed: parseInt(languagesCount.rows[0].count) >= 1, weight: 5 },
      { name: 'Intereses (mín. 2)', completed: parseInt(interestsCount.rows[0].count) >= 2, weight: 5 }
    ];

    const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);
    const completedWeight = fields.filter(f => f.completed).reduce((sum, f) => sum + f.weight, 0);
    const progress = Math.round((completedWeight / totalWeight) * 100);

    res.json({
      progress,
      fields,
      missing: fields.filter(f => !f.completed).map(f => f.name)
    });
  } catch (error) {
    console.error('Error al calcular progreso:', error);
    res.status(500).json({ error: 'Error al calcular progreso del perfil' });
  }
};

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT id, title, message, type, link, read, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) as total FROM notifications WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      notifications: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
    });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;

    await query(
      'UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    res.json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    console.error('Error al marcar notificación:', error);
    res.status(500).json({ error: 'Error al marcar notificación' });
  }
};

export const markAllNotificationsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    await query(
      'UPDATE notifications SET read = true WHERE user_id = $1 AND read = false',
      [req.user.id]
    );

    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('Error al marcar notificaciones:', error);
    res.status(500).json({ error: 'Error al marcar notificaciones' });
  }
};
