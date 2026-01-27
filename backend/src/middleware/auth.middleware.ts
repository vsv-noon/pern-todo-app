import type { Request, Response, NextFunction } from 'express';

import { verifyAccessToken } from '../utils/jwt.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.slice(7);

    try {
      const payload = verifyAccessToken(token);
      req.user = payload;
      return next();
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
}
