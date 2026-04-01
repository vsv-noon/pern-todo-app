import { sendMail } from '../config/mailer.js';
import {
  createRefreshToken,
  findValidRefreshToken,
  revokeAllUserToken,
  revokeRefreshToken,
} from '../models/refreshToken.model.js';
import { createUser, findUserByEmail } from '../models/user.model.js';
import {
  generateRefreshToken,
  hashToken,
  REFRESH_TOKEN_EXPIRES_IN,
  signAccessToken,
  signActivationToken,
} from '../utils/jwt.js';
import { comparePassword, hashPassword } from '../utils/password.js';

interface LoginResponse {
  user: { id: number; email: string; isActivated: boolean };
  accessToken: string;
  refreshToken: string;
}

export async function register(email: string, password: string): Promise<LoginResponse> {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('User already exists');
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ email, passwordHash });

  const refreshTokenStr = generateRefreshToken();

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await createRefreshToken(user.id, hashToken(refreshTokenStr), expiresAt);

  const accessToken = signAccessToken({ userId: user.id });

  const activationToken = signActivationToken({ userId: user.id });

  await sendMail(email, activationToken);

  return {
    user: { id: user.id, email: user.email, isActivated: user.is_activated },
    accessToken,
    refreshToken: refreshTokenStr,
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const validPassword = await comparePassword(password, user.password_hash);
  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  const refreshTokenStr = generateRefreshToken();

  // const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const expiresAt = REFRESH_TOKEN_EXPIRES_IN;

  // await createRefreshToken(user.id, refreshTokenStr, expiresAt);
  await createRefreshToken(user.id, hashToken(refreshTokenStr), expiresAt);

  const accessToken = signAccessToken({ userId: user.id });

  const activationToken = signActivationToken({ userId: user.id });

  await sendMail(email, activationToken);

  console.log(activationToken);

  return {
    user: { id: user.id, email: user.email, isActivated: user.is_activated },
    accessToken,
    refreshToken: refreshTokenStr,
  };
}

export async function refreshTokens(
  refreshTokenStr: string
): Promise<{ accessToken: string; refreshToken: string }> {
  // Проверяем валидность refresh токена
  const refreshToken = await findValidRefreshToken(hashToken(refreshTokenStr));
  if (!refreshToken) {
    throw new Error('Invalid or expired refresh token');
  }

  // Генерируем новый access токен
  const accessToken = signAccessToken({ userId: refreshToken.user_id });

  // Опционально: ротация refresh токена (новый токен)
  const newRefreshToken = generateRefreshToken();

  // const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const newExpiresAt = REFRESH_TOKEN_EXPIRES_IN;

  await createRefreshToken(refreshToken.user_id, hashToken(newRefreshToken), newExpiresAt);
  await revokeRefreshToken(refreshTokenStr); // отзываем старый

  return {
    accessToken,
    refreshToken: newRefreshToken, // возвращаем новый refresh токен
  };
}

export async function logout(refreshTokenStr: string): Promise<void> {
  await revokeRefreshToken(hashToken(refreshTokenStr));
}

export async function logoutAll(user_id: number): Promise<void> {
  await revokeAllUserToken(user_id);
}
