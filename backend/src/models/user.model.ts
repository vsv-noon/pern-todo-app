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

  return res.rows[0] ?? null;
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
    RETURNING id, email, password_hash, created_at
    `,
    [params.email, params.passwordHash]
  );

  return res.rows[0];
}
