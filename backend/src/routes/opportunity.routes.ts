import { Router } from 'express';
import {
  getOpportunities,
  getOpportunityById,
  getFeaturedOpportunities,
  getSimilarOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  saveOpportunity,
  unsaveOpportunity,
  getSavedOpportunities
} from '../controllers/opportunity.controller';
import { authenticate, optionalAuth, authorize } from '../middlewares/auth.middleware';
import { uploadAttachment } from '../config/multer';
import { opportunityValidation, idValidation } from '../middlewares/validate.middleware';

const router = Router();

// Rutas públicas
router.get('/', getOpportunities);
router.get('/featured', getFeaturedOpportunities);
router.get('/saved', authenticate, getSavedOpportunities);
router.get('/:id', optionalAuth, idValidation, getOpportunityById);
router.get('/:id/similar', idValidation, getSimilarOpportunities);

// Rutas protegidas
router.post('/', authenticate, authorize('publisher', 'admin'), uploadAttachment, opportunityValidation, createOpportunity);
router.put('/:id', authenticate, authorize('publisher', 'admin'), uploadAttachment, idValidation, updateOpportunity);
router.delete('/:id', authenticate, authorize('publisher', 'admin'), idValidation, deleteOpportunity);

// Guardar/Desguardar oportunidades
router.post('/:id/save', authenticate, idValidation, saveOpportunity);
router.delete('/:id/save', authenticate, idValidation, unsaveOpportunity);

export default router;
