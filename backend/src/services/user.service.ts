import { findUserByEmail, findUserById, type UserRow } from '../models/user.model.js';

export async function getUserById(id: number): Promise<UserRow | null> {
  return findUserById(id);
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  return findUserByEmail(email);
}
