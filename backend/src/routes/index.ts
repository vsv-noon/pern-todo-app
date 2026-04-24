import { Router } from 'express';

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import statsRoutes from './stats.routes.js';
import tasksRoutes from './tasks.routes.js';
import todoRoutes from './todo.routes.js';
import goalsRoutes from './goals.routes.js';
import measurementsRoutes from './measurements.routes.js';
import measurementTypesRoutes from './measurementTypes.routes.js';
import measurementSessionsRoutes from './measurementSessions.routes.js';
import measurementsAnalytics from './analytics.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/stats', statsRoutes);
router.use('/tasks', tasksRoutes);
router.use('/todos', todoRoutes);
router.use('/goals', goalsRoutes);
router.use('/measurements', measurementsRoutes);
router.use('/measurement-types', measurementTypesRoutes);
router.use('/measurement-sessions', measurementSessionsRoutes);
router.use('/measurements/analytics', measurementsAnalytics);

export default router;
