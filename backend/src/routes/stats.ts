import { Router } from 'express';
import { getStats } from '../controllers/stats.controller.ts';

const router = Router();

router.get('/', getStats);

export default router;
