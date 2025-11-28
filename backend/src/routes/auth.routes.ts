import { Router } from 'express';
import { register, login, getMe, forgotPassword, changePassword } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { registerValidation, loginValidation } from '../middlewares/validate.middleware';

const router = Router();

// Rutas públicas
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPassword);

// Rutas protegidas
router.get('/me', authenticate, getMe);
router.post('/change-password', authenticate, changePassword);

export default router;
