import jwt from 'jsonwebtoken';

import * as userModel from '../models/user.model.js';
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
  signAccessToken,
  signActivationToken,
  signResetToken,
} from '../utils/jwt.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { ENV } from '../config/env.js';

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

  const activationUrl = `${process.env.APP_URL}/auth/activate/${activationToken}`;

  const sendMailData = {
    email,
    url: activationUrl,
    subject: 'Activation account',
    text: 'To complete your account verification, please click the link',
    linkMessage: 'Activate your account',
  };

  await sendMail(sendMailData);

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

  const expiresAt = ENV.refreshToken.expiresIn;

  await createRefreshToken(user.id, hashToken(refreshTokenStr), expiresAt);

  const accessToken = signAccessToken({ userId: user.id });

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

  const newExpiresAt = ENV.refreshToken.expiresIn;

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

export async function processForgotPassword(email: string) {
  const user = await userModel.findUserByEmail(email);

  if (!user) return false;

  const resetToken = signResetToken({ userId: user.id });
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const sendMailData = {
    email,
    url: resetUrl,
    subject: 'Reset password',
    text: 'To reset password click the link',
    linkMessage: 'Reset your password',
  };

  await sendMail(sendMailData);

  return true;
}

export async function resetUserPassword(token: string, newPassword: string) {
  const decoded = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET as string) as {
    userId: string;
  };

  const passwordHash = await hashPassword(newPassword);

  const isUpdated = await userModel.updatePassword(decoded.userId, passwordHash);

  if (!isUpdated) {
    throw new Error('USER_NOT_FOUND');
  }

  return true;
}
