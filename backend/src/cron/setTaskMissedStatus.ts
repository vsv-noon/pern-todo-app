import { pool } from '../config/db.js';

export async function setTaskMissedStatus() {
  try {
    const result = await pool.query(
      `
      UPDATE task_instances
      SET status = 'missed'
      WHERE status = 'pending'
        AND due_date < CURRENT_DATE
      `
    );
    console.log('📊 Status missed saved', result.rowCount);
  } catch (err) {
    console.error('setTaskMissedStatus cron failed', err);
  }
}
