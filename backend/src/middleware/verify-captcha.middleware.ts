import { Request, Response, NextFunction } from 'express';

import { verifyTurnstileToken } from '../services/captcha.service.js';

export const verifyCaptcha = async (req: Request, res: Response, next: NextFunction) => {
  const { captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({
      success: false,
      error: ['Captcha token is required'],
    });
  }

  const result = await verifyTurnstileToken(captchaToken);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.errors || ['Invalid captcha'],
    });
  }

  next();
};
