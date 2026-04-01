import { Request, Response, NextFunction } from 'express';

import { pool } from '../config/db.js';

export async function activateMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;

    const userRes = await pool.query('SELECT is_activated FROM users WHERE id = $1', [userId]);

    const user = userRes.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.is_activated) {
      return res
        .status(403)
        .json({ message: 'Ваш аккаунт не активирован. Пожалуйста, подтвердите email.' });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Ошибка при проверке активации' });
  }
}
