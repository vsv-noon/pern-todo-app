import { Router } from 'express';
import { getStats } from '../controllers/stats.controller.js';
// import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// router.use(authMiddleware);
router.get('/', getStats);

export default router;
