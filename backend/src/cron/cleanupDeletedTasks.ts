import { pool } from '../config/db.js';

export async function cleanupDeletedTasks() {
  try {
    const result = await pool.query(
      `
      DELETE FROM tasks
      WHERE deleted_at IS NOT NULL
        AND deleted_at < NOW() - INTERVAL '30 days'
      `
    );

    console.log(`🧹 Auto cleanup: ${result.rowCount} tasks deleted`);
  } catch (err) {
    console.error('❌ Cleanup job failed', err);
  }
}
