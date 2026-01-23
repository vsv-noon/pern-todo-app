import type { Request, Response, NextFunction } from 'express';

export function errorMiddleware(err: unknown, req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}
