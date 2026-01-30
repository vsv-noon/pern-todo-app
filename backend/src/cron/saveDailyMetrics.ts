import { pool } from '../config/db.js';

export async function saveDailyMetrics() {
  try {
    const result = await pool.query(
      `
      WITH stats AS (
        SELECT
          user_id,
          CURRENT_DATE AS date,
          COUNT(*) FILTER (WHERE completed) AS completed_count,
          COUNT(*) AS created_count
        FROM todos
        WHERE created_at::date = CURRENT_DATE
          AND deleted_at IS NULL
        GROUP BY user_id  
      )
      INSERT INTO daily_metrics (
        user_id,
        date, 
        completed_count, 
        created_count, 
        productivity
      )
      SELECT
        user_id,
        date,
        completed_count,
        created_count,
        CASE
          WHEN created_count = 0 THEN 0
          ELSE ROUND((completed_count::float / created_count) * 100)
        END
      FROM stats
      ON CONFLICT (user_id, date) DO UPDATE SET
        completed_count = EXCLUDED.completed_count,
        created_count = EXCLUDED.created_count,
        productivity = EXCLUDED.productivity
    `
    );

    console.log('📊 Daily metrics saved', result.rowCount);
  } catch (err) {
    console.error('Metrics cron failed', err);
  }
}
