import { Router } from 'express';
import {
  getFaculties,
  getSchools,
  getAllSchools,
  getSkills,
  getSkillCategories,
  getLanguages,
  getInterests,
  getOpportunityTypes,
  getStatistics,
  searchAll
} from '../controllers/catalog.controller';

const router = Router();

// Todas las rutas de catálogos son públicas
router.get('/faculties', getFaculties);
router.get('/schools', getAllSchools);
router.get('/schools/:facultyId', getSchools);
router.get('/skills', getSkills);
router.get('/skills/categories', getSkillCategories);
router.get('/languages', getLanguages);
router.get('/interests', getInterests);
router.get('/opportunity-types', getOpportunityTypes);
router.get('/statistics', getStatistics);
router.get('/search', searchAll);

export default router;
