import { pool } from '../config/db.js';

export type GoalMeasurementsRow = {
  goal_id: number;
  measured_value: number;
  note: string;
  measured_at: Date;
};

export async function createMeasurement(userId: number, data: GoalMeasurementsRow) {
  const { goal_id, measured_value, note, measured_at } = data;

  const result = await pool.query(
    `
    INSERT INTO goal_measurements (goal_id, user_id, measured_value, note, measured_at)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (goal_id, DATE(measured_at)) DO UPDATE SET
      measured_value = EXCLUDED.measured_value,
      note = EXCLUDED.note,
      measured_at = EXCLUDED.measured_at
    RETURNING *
    `,
    [goal_id, userId, measured_value, note, measured_at]
  );

  await pool.query(
    `
    UPDATE goals
    SET current_value = $1
    WHERE id = $2 AND goal_type = 'metric'
    `,
    [measured_value, goal_id]
  );

  return result.rows[0];
}
