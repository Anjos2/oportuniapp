import { Router } from 'express';
import {
  getMyPublications,
  getPublicationById,
  getPublicationApplications,
  updatePublicationStatus,
  duplicatePublication,
  getPublicationStats
} from '../controllers/publication.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { idValidation } from '../middlewares/validate.middleware';

const router = Router();

// Todas las rutas requieren autenticación y rol de publicador
router.use(authenticate);
router.use(authorize('publisher', 'admin'));

router.get('/', getMyPublications);
router.get('/:id', idValidation, getPublicationById);
router.get('/:id/applications', idValidation, getPublicationApplications);
router.get('/:id/stats', idValidation, getPublicationStats);
router.put('/:id/status', idValidation, updatePublicationStatus);
router.post('/:id/duplicate', idValidation, duplicatePublication);

export default router;
