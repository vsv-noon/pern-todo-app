import type { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';

export async function register(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await authService.register(email, password);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await authService.login(email, password);
    return res.json(result);
  } catch (err) {
    return res.status(401).json({ error: (err as Error).message });
  }
}

export async function me(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.json({ userId: req.user.userId });
}
