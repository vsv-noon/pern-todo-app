import { createUser, findUserByEmail } from '../models/user.model.js';
import { signToken } from '../utils/jwt.js';
import { comparePassword, hashPassword } from '../utils/password.js';

export async function register(email: string, password: string) {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('User already exists');
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ email, passwordHash });
  const token = signToken({ userId: user.id });

  return {
    user: { id: user.id, email: user.email },
    accessToken: token,
  };
}

export async function login(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const ok = await comparePassword(password, user.password_hash);
  if (!ok) {
    throw new Error('Invalid credentials');
  }

  const token = signToken({ userId: user.id });

  return {
    user: { id: user.id, email: user.email },
    accessToken: token,
  };
}
