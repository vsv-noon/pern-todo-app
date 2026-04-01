import { Router } from 'express';

import { getStats } from '../controllers/stats.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { activateMiddleware } from '../middleware/activate.middleware.js';

const router = Router();

router.use(authMiddleware);
router.use(activateMiddleware);

router.get('/', getStats);

export default router;
