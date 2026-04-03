import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import * as authService from '../services/auth.service.js';
import { pool } from '../config/db.js';

export async function register(req: Request, res: Response) {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authService.register(email, password);
    console.log(result);

    if (!result) {
      return res.status(409).json({ success: false, error: ['User already exists'] });
    }

    return res.status(201).json({
      success: true,
      message: 'Verification OK',
      user: { id: result.user.id, email: result.user.email, isActivated: result.user.isActivated },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    console.error('Register Error: ', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, error: ['Email and password are required'] });
    }

    const result = await authService.login(email, password);

    if (!result) {
      return res.status(401).json({ success: false, error: ['Invalid credentials'] });
    }

    return res.status(200).json({
      success: true,
      message: 'Verification OK',
      user: {
        id: result.user.id,
        email: result.user.email,
        isActivated: result.user.isActivated,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: (err as Error).message });
    // return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// export async function me(req: Request, res: Response) {
//   if (!req.user) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const userId = req.user.userId;
//   const user = await findUserById(userId);

//   return res.json({
//     userId: user?.id,
//     email: user?.email,
//     isActivated: user?.is_activated,
//   });
// }

export async function me(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.json({ userId: req.user.userId });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    const tokens = await authService.refreshTokens(refreshToken);
    return res.json(tokens);
  } catch (err) {
    return res.status(401).json({ error: (err as Error).message });
  }
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    await authService.logout(refreshToken);
    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}

export async function activateAccount(req: Request, res: Response) {
  try {
    const { token } = req.params;
    const secret = process.env.JWT_ACTIVATION_SECRET;

    if (!token || !secret) {
      return res.status(400).json({ message: 'Invalid request or server config' });
    }
    // Token verification
    const userData = jwt.verify(token as string, secret as string) as { userId: number };

    if (!userData) {
      return res.status(400).json({ message: 'Некорректная ссылка активации' });
    }

    // Find user
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userData.userId]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    // Refresh status
    await pool.query('UPDATE users SET is_activated = true WHERE id = $1', [userData.userId]);

    // Redirect to LoginPage
    return res.redirect(`${process.env.CLIENT_URL}/login?status=success`);
    // return res.redirect(`http://localhost/register`);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Link expired or invalid' });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    await authService.processForgotPassword(email);

    return res
      .status(200)
      .json({ message: 'Если email существует, инструкции по сбросу будут отправлены' });
  } catch (err) {
    console.error('Forgot Password Error: ', err);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Токен и новый пароль обязательны' });
    }

    await authService.resetUserPassword(token, newPassword);

    return res.status(200).json({ message: 'Пароль успешно изменен. Теперь вы можете войти' });
  } catch (err) {
    const typedError = err as Error;

    if (typedError.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Срок действия ссылки истек' });
    }
    if (typedError.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Неверный токен восстановления' });
    }
    if (typedError.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ message: 'User not found' });
    }

    console.error('Reset Password Error: ', err);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}
