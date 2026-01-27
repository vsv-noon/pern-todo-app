import { pool } from '../config/db.js';

export async function cleanupExpiresTokens() {
  try {
    const result = await pool.query(
      `
      DELETE FROM refresh_tokens
      WHERE expires_at < NOW()
        OR revoked_at IS NOT NULL
      `
    );

    console.log(`🧹 Auto cleanup: ${result.rowCount} expired/revoked tokens deleted`);
  } catch (err) {
    console.error('❌ Cleanup job failed', err);
  }
}
