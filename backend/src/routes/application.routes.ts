import { Router } from 'express';
import {
  createApplication,
  getMyApplications,
  getReceivedApplications,
  updateApplicationStatus,
  withdrawApplication,
  exportApplications
} from '../controllers/application.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { applicationValidation, idValidation } from '../middlewares/validate.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Postulaciones del usuario
router.get('/my', getMyApplications);
router.post('/:opportunityId', applicationValidation, createApplication);
router.delete('/:id/withdraw', idValidation, withdrawApplication);

// Para publicadores
router.get('/received/:opportunityId', authorize('publisher', 'admin'), getReceivedApplications);
router.put('/:id/status', authorize('publisher', 'admin'), idValidation, updateApplicationStatus);
router.get('/export/:opportunityId', authorize('publisher', 'admin'), exportApplications);

export default router;
