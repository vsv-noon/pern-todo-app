import type { Request, Response } from 'express';

import * as statsService from '../services/stats.service.js';

export async function getStats(
  req: Request<unknown, unknown, unknown, { type?: string; from?: string; to?: string }>,
  res: Response
) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { type, from, to } = req.query;

  if (!type) return res.status(400).json({ error: 'Stats type required' });

  try {
    const data = await statsService.getStats(
      req.user.userId,
      type as any,
      from ?? null,
      to ?? null
    );

    return res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stats failed' });
  }
}
