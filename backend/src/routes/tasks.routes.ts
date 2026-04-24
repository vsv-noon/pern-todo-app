import { Router } from 'express';

import * as tasksController from '../controllers/tasks.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { activateMiddleware } from '../middleware/activate.middleware.js';

const router = Router();

router.use(authMiddleware);
router.use(activateMiddleware);

router.get('/range', tasksController.getTasksRange);

router.post('/', tasksController.createTask);

export default router;
