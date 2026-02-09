import { Router } from 'express';

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import statsRoutes from './stats.routes.js';
// import todosRoutes from './todos.routes.js';
import todoRoutes from './todo.routes.js';
import goalsRoutes from './goals.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/stats', statsRoutes);
// router.use('/todos', todosRoutes);
router.use('/todos', todoRoutes);
router.use('/goals', goalsRoutes);

export default router;
