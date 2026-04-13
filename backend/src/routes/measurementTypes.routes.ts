import { Router } from 'express';

import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  createMeasurementTypeController,
  deleteMeasurementTypeController,
  getMeasurementTypesController,
  updateMeasurementTypeController,
} from '../controllers/measurementTypes.controller.js';

const router = Router();

router.get('/', authMiddleware, getMeasurementTypesController);
router.post('/', authMiddleware, createMeasurementTypeController);
router.patch('/:id', authMiddleware, updateMeasurementTypeController);
router.delete('/:id', authMiddleware, deleteMeasurementTypeController);

export default router;
