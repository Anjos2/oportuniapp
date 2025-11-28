import { Router } from 'express';
import {
  getDashboard,
  getAdminPublications,
  updatePublicationStatus,
  deletePublication,
  getExternalAccounts,
  createExternalAccount,
  updateExternalAccountStatus,
  getUsers,
  getAuditLog
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { idValidation } from '../middlewares/validate.middleware';

const router = Router();

// Todas las rutas requieren autenticación y rol de admin
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Gestión de publicaciones
router.get('/publications', getAdminPublications);
router.put('/publications/:id/status', idValidation, updatePublicationStatus);
router.delete('/publications/:id', idValidation, deletePublication);

// Gestión de cuentas externas
router.get('/external-accounts', getExternalAccounts);
router.post('/external-accounts', createExternalAccount);
router.put('/external-accounts/:id/status', idValidation, updateExternalAccountStatus);

// Gestión de usuarios
router.get('/users', getUsers);

// Registro de auditoría
router.get('/audit-log', getAuditLog);

export default router;
