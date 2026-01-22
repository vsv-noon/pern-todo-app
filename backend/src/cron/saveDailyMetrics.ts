import { pool } from '../db.ts';

export async function saveDailyMetrics() {
  try {
    const result = await pool.query(`
      WITH stats AS (
        SELECT
          CURRENT_DATE AS date,
          COUNT(*) FILTER (WHERE completed) AS completed_count,
          COUNT(*) AS created_count
        FROM todos
        WHERE created_at::date = CURRENT_DATE
      )
      INSERT INTO daily_metrics (date, completed_count, created_count, productivity)
      SELECT
        date,
        completed_count,
        created_count,
        CASE
          WHEN created_count = 0 THEN 0
          ELSE ROUND((completed_count::float / created_count) * 100)
        END
      FROM stats
      ON CONFLICT (date) DO UPDATE SET
        completed_count = EXCLUDED.completed_count,
        created_count = EXCLUDED.created_count,
        productivity = EXCLUDED.productivity
    `);

    console.log('📊 Daily metrics saved');
  } catch (e) {
    console.error('Metrics cron failed', e);
  }
}
