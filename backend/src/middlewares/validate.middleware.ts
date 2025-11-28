import { Request, Response, NextFunction } from 'express';
import { validationResult, body, param, query as queryValidator } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: errors.array().map(err => ({
        field: (err as any).path || (err as any).param,
        message: err.msg
      }))
    });
  }
  next();
};

// Validaciones de autenticación
export const registerValidation = [
  body('email')
    .isEmail().withMessage('Email inválido')
    .matches(/@uni\.pe$/i).withMessage('Debe usar un correo institucional @uni.pe'),
  body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('El nombre debe tener entre 2 y 200 caracteres'),
  validate
];

export const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  validate
];

// Validaciones de perfil
export const profileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 200 }),
  body('phone').optional().matches(/^[0-9+\-\s()]+$/).withMessage('Teléfono inválido'),
  body('faculty_id').optional().isInt({ min: 1 }),
  body('school_id').optional().isInt({ min: 1 }),
  body('cycle').optional().isInt({ min: 1, max: 10 }),
  body('student_code').optional().matches(/^[0-9]{8}[A-Z]$/i).withMessage('Código de estudiante inválido'),
  body('bio').optional().isLength({ max: 1000 }),
  body('linkedin_url').optional().isURL().withMessage('URL de LinkedIn inválida'),
  validate
];

// Validaciones de oportunidad
export const opportunityValidation = [
  body('type_id').isInt({ min: 1 }).withMessage('Tipo de oportunidad requerido'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 300 }).withMessage('El título debe tener entre 5 y 300 caracteres'),
  body('description')
    .trim()
    .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres'),
  body('modality')
    .isIn(['presencial', 'virtual', 'hibrido']).withMessage('Modalidad inválida'),
  body('start_date').optional().isISO8601().withMessage('Fecha de inicio inválida'),
  body('end_date').optional().isISO8601().withMessage('Fecha de fin inválida'),
  body('application_deadline').optional().isISO8601().withMessage('Fecha límite inválida'),
  body('visibility')
    .optional()
    .isIn(['publico', 'facultad', 'escuela']).withMessage('Visibilidad inválida'),
  validate
];

// Validaciones de reporte
export const reportValidation = [
  body('opportunity_id').isInt({ min: 1 }).withMessage('ID de oportunidad requerido'),
  body('reason')
    .isIn(['contenido_inapropiado', 'informacion_falsa', 'spam', 'discriminacion', 'otro'])
    .withMessage('Razón de reporte inválida'),
  body('comment').optional().isLength({ max: 1000 }),
  validate
];

// Validaciones de aplicación
export const applicationValidation = [
  body('cover_letter').optional().isLength({ max: 2000 }),
  validate
];

// Validaciones de paginación
export const paginationValidation = [
  queryValidator('page').optional().isInt({ min: 1 }),
  queryValidator('limit').optional().isInt({ min: 1, max: 50 }),
  validate
];

// Validación de ID
export const idValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  validate
];
