import { Router } from 'express';

import * as goalsController from '../controllers/goals.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authMiddleware);

router.get('/', goalsController.getGoals);
router.post('/', goalsController.createGoal);
router.delete('/:id', goalsController.deleteGoal);
// router.patch('/:id/progress', goalsController.updateProgress);

export default router;
