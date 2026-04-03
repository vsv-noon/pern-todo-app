import { pool } from '../config/db.js';

export type UserRow = {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
  is_activated: boolean;
};

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const res = await pool.query<UserRow>(
    `
    SELECT id, email, password_hash, created_at, is_activated
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  return res.rows[0] || null;
}

export async function findUserById(id: number): Promise<UserRow | null> {
  const res = await pool.query<UserRow>(
    `
    SELECT id, email, password_hash, created_at, is_activated
    FROM users
    WHERE id = $1
    `,
    [id]
  );

  return res.rows[0] ?? null;
}

export async function createUser(params: {
  email: string;
  passwordHash: string;
}): Promise<UserRow> {
  const res = await pool.query<UserRow>(
    `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING *
    `,
    [params.email, params.passwordHash]
  );

  const user = res.rows[0];

  if (!user) {
    throw new Error('FAILED_TO_CREATE_USER');
  }

  return user;
}

export async function updatePassword(userId: string, passwordHash: string) {
  const result = await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
    passwordHash,
    userId,
  ]);

  if (result.rowCount === null) {
    return false;
  }

  return result.rowCount > 0;
}
