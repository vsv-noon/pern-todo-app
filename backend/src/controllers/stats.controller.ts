import type { Request, Response } from 'express';
import {
  getProductivity,
  getStatus,
  getStreak,
  getTodosByDate,
} from '../services/stats.service.ts';

export async function getStats(
  req: Request<unknown, unknown, unknown, { type?: string; from?: string; to?: string }>,
  res: Response,
) {
  try {
    const { type, from, to } = req.query;

    const fromStr = from ?? null;
    const toStr = to ?? null;

    switch (type) {
      case 'productivity':
        return res.json(await getProductivity(fromStr, toStr));

      case 'status':
        return res.json(await getStatus(fromStr, toStr));

      case 'streak':
        return res.json(await getStreak());

      case 'todosByDate':
        return res.json(await getTodosByDate(fromStr, toStr));

      default:
        return res.status(400).json({ error: 'Unknown stats type' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stats failed' });
  }
}
