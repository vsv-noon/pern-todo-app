import { Response } from 'express';

export const REFRESH_COOKIE_NAME = 'refreshToken';

export function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    // path: '/auth/refresh',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    // path: '/auth/refresh',
  });
}
