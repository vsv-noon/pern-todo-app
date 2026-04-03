import { Router } from 'express';

import * as authController from '../controllers/auth.controller.js';
import { verifyCaptcha } from '../middleware/verify-captcha.middleware.js';

const router = Router();

router.post('/register', verifyCaptcha, authController.register);
router.post('/login', verifyCaptcha, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.get('/me', authController.me);
router.get('/activate/:token', authController.activateAccount);

export default router;
