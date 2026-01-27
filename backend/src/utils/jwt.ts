import crypto from 'crypto';

import jwt, { Secret } from 'jsonwebtoken';

import { env } from '../config/env.js';

export type JwtPayload = {
  userId: number;
};

const ACCESS_TOKEN_EXPIRES_IN = '15m';
export const REFRESH_TOKEN_EXPIRES_IN = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
// const REFRESH_TOKEN_EXPIRES_IN = '7d';
// export const REFRESH_TOKEN_EXPIRES_IN = new Date(Date.now() + 5 * 60 * 1000);

// const signOptions: SignOptions = {
//   // expiresIn: env.JWT_EXPIRES_IN,
//   expiresIn: '10m',
// };

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET as Secret, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET as Secret) as JwtPayload;
  } catch {
    return null;
  }
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
