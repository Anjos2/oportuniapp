import { Router } from 'express';
import {
  createReport,
  getReports,
  updateReportStatus,
  getReportDetails
} from '../controllers/report.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { reportValidation, idValidation } from '../middlewares/validate.middleware';

const router = Router();

// Crear reporte (usuarios autenticados)
router.post('/', authenticate, reportValidation, createReport);

// Rutas de administrador
router.get('/', authenticate, authorize('admin'), getReports);
router.get('/:id', authenticate, authorize('admin'), idValidation, getReportDetails);
router.put('/:id/status', authenticate, authorize('admin'), idValidation, updateReportStatus);

export default router;
