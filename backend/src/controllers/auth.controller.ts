import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Verificar si el email ya existe
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario
    const result = await query(
      `INSERT INTO users (email, password_hash, name, role, status)
       VALUES ($1, $2, $3, 'user', 'active')
       RETURNING id, email, name, role, created_at`,
      [email.toLowerCase(), passwordHash, name]
    );

    const user = result.rows[0];

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Crear notificación de bienvenida
    await query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Bienvenido a OportUNI', 'Tu cuenta ha sido creada exitosamente. Completa tu perfil para recibir mejores recomendaciones.', 'info')`,
      [user.id]
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const result = await query(
      `SELECT id, email, password_hash, name, role, status, profile_photo
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificar estado
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Tu cuenta está suspendida o inactiva' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Registrar en audit log
    await query(
      `INSERT INTO audit_log (user_id, action, entity, entity_id)
       VALUES ($1, 'login', 'users', $1)`,
      [user.id]
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile_photo: user.profile_photo
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
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

    // Obtener habilidades
    const skillsResult = await query(
      `SELECT s.id, s.name, us.level
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1`,
      [req.user.id]
    );

    // Obtener idiomas
    const languagesResult = await query(
      `SELECT l.id, l.name, ul.level
       FROM user_languages ul
       JOIN languages l ON ul.language_id = l.id
       WHERE ul.user_id = $1`,
      [req.user.id]
    );

    // Obtener intereses
    const interestsResult = await query(
      `SELECT i.id, i.name
       FROM user_interests ui
       JOIN interests i ON ui.interest_id = i.id
       WHERE ui.user_id = $1`,
      [req.user.id]
    );

    // Contar notificaciones no leídas
    const notificationsResult = await query(
      'SELECT COUNT(*) as unread FROM notifications WHERE user_id = $1 AND read = false',
      [req.user.id]
    );

    res.json({
      ...user,
      skills: skillsResult.rows,
      languages: languagesResult.rows,
      interests: interestsResult.rows,
      unread_notifications: parseInt(notificationsResult.rows[0].unread)
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener información del usuario' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const result = await query('SELECT id, name FROM users WHERE email = $1', [email.toLowerCase()]);

    // Por seguridad, siempre respondemos igual
    res.json({
      message: 'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña'
    });

    // TODO: Implementar envío de correo con token de recuperación
    if (result.rows.length > 0) {
      console.log(`Solicitud de recuperación de contraseña para: ${email}`);
    }
  } catch (error) {
    console.error('Error en forgot password:', error);
    res.status(500).json({ error: 'Error al procesar solicitud' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { currentPassword, newPassword } = req.body;

    // Obtener contraseña actual
    const result = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña
    await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [newPasswordHash, req.user.id]
    );

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
};
