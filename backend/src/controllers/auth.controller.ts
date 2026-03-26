import type { Request, Response } from 'express';
import type { TurnstileServerValidationResponse } from '@marsidev/react-turnstile';

import * as authService from '../services/auth.service.js';

const verifyEndpoint = process.env.VERIFY_ENDPOINT || '';
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';

export async function register(req: Request, res: Response) {
  const { email, password, token } = req.body as {
    email?: string;
    password?: string;
    token: string;
  };

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!token) {
    return res.status(400).json({ success: false, error: ['No token'] });
  }

  const formData = new URLSearchParams({
    secret: TURNSTILE_SECRET,
    response: token,
  });

  try {
    const verify = await fetch(verifyEndpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });

    const data = (await verify.json()) as TurnstileServerValidationResponse;

    if (data.success) {
      const result = await authService.register(email, password);

      if (!result) {
        return res.status(401).json({ success: false, error: ['Invalid credentials'] });
      }

      return res.status(201).json({
        success: true,
        message: 'Verification OK',
        user: { id: result.user.id, email: result.user.email },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, error: data['error-codes'] || ['Verification failed'] });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }

  // try {
  //   const result = await authService.register(email, password);
  //   return res.status(201).json(result);
  // } catch (err) {
  //   return res.status(400).json({ error: (err as Error).message });
  // }
}

export async function login(req: Request, res: Response) {
  const { email, password, token } = req.body as {
    email?: string;
    password?: string;
    token: string;
  };

  if (!email || !password) {
    return res.status(400).json({ success: false, error: ['Email and password are required'] });
  }

  if (!token) {
    return res.status(400).json({ success: false, error: ['No token'] });
  }

  const formData = new URLSearchParams({
    secret: TURNSTILE_SECRET,
    response: token,
  });

  try {
    const verify = await fetch(verifyEndpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });

    const data = (await verify.json()) as TurnstileServerValidationResponse;

    if (data.success) {
      const result = await authService.login(email, password);

      if (!result) {
        return res.status(401).json({ success: false, error: ['Invalid credentials'] });
      }

      return res.status(200).json({
        success: true,
        message: 'Verification OK',
        user: { id: result.user.id, email: result.user.email },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, error: data['error-codes'] || ['Verification failed'] });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

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
