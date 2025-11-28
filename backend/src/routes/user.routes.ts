import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  uploadPhoto,
  uploadCV,
  getProfileProgress,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadPhoto as uploadPhotoMiddleware, uploadCV as uploadCVMiddleware } from '../config/multer';
import { profileValidation } from '../middlewares/validate.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', profileValidation, updateProfile);
router.post('/upload-photo', uploadPhotoMiddleware, uploadPhoto);
router.post('/upload-cv', uploadCVMiddleware, uploadCV);
router.get('/profile-progress', getProfileProgress);

// Notificaciones
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.put('/notifications/read-all', markAllNotificationsRead);

export default router;
