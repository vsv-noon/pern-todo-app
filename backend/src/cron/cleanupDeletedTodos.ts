import { pool } from '../config/db.js';

export async function cleanupDeletedTodos() {
  try {
    const result = await pool.query(
      `
      DELETE FROM todos
      WHERE deleted_at IS NOT NULL
        AND deleted_at < NOW() - INTERVAL '30 days'
      `,
    );

    console.log(`🧹 Auto cleanup: ${result.rowCount} todos deleted`);
  } catch (err) {
    console.error('❌ Cleanup job failed', err);
  }
}
