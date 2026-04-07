import { pool } from '../config/db.js';
import { ENV } from '../config/env.js';

export type RefreshTokenRow = {
  id: number;
  user_id: number;
  token: string;
  created_at: Date;
  revoked_at: Date | null;
};

export async function createRefreshToken(
  userId: number,
  token: string
): Promise<RefreshTokenRow | undefined> {
  const expiresAt = new Date(Date.now() + ENV.REFRESH_TOKEN_EXPIRES_AT);
  // const expiresAt = ENV.refreshToken.expiresIn;
  // const expiresAt = new Date();
  // expiresAt.setDate(expiresAt.getDate() + ENV.REFRESH_TOKEN_EXPIRES_AT);

  const result = await pool.query<RefreshTokenRow>(
    `
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [userId, token, expiresAt]
  );
  return result.rows[0];
}

export async function findValidRefreshToken(token: string): Promise<RefreshTokenRow | null> {
  const result = await pool.query<RefreshTokenRow>(
    `
    SELECT * FROM refresh_tokens
    WHERE token = $1
      AND expires_at > NOW()
      AND revoked_at IS NULL
    `,
    [token]
  );
  return result.rows[0] ?? null;
}

export async function revokeRefreshToken(token: string): Promise<boolean> {
  const result = await pool.query(
    `
    UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE token = $1
      AND expires_at > NOW()
      AND revoked_at IS NULL
    RETURNING 1
    `,
    [token]
  );
  return result.rowCount! > 0;
}

export async function revokeAllUserToken(userId: number): Promise<number> {
  const result = await pool.query(
    `
    UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE user_id = $1
      AND revoked_at IS NULL
    RETURNING 1
    `,
    [userId]
  );
  return result.rowCount || 0;
}
