import type { Request, Response } from 'express';

import * as userService from '../services/user.service.js';

export async function getProfile(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await userService.getUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    id: user.id,
    email: user.email,
    createdAt: user.created_at,
    isActivated: user.is_activated,
  });
}
