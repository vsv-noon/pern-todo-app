import { Router } from 'express';
import authRoutes from './auth.routes.js';
import todosRoutes from './todos.routes.js';
import statsRoutes from './stats.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/todos', todosRoutes);
router.use('/stats', statsRoutes);

export default router;
