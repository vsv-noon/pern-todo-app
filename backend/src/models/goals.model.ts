import { pool } from '../config/db.js';

export type GoalsRow = {
  title: string;
  goal_type: string;
  start_date: Date;
  until_date: Date;
  frequency: string;
  target_type: string;
  start_value: number;
  current_value: number;
  target_value: number;
  unit: string;
  tasks_count: number;
};

export async function createGoal(userId: number, data: GoalsRow) {
  const {
    title,
    goal_type,
    start_date,
    until_date,
    frequency,
    target_type,
    start_value,
    current_value,
    target_value,
    unit,
    tasks_count,
  } = data;

  const result = await pool.query(
    `
    INSERT INTO goals (user_id, title, goal_type, start_date, until_date, frequency, target_type, start_value, current_value, target_value, unit, tasks_count)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
    `,
    [
      userId,
      title,
      goal_type,
      start_date,
      until_date,
      frequency,
      target_type,
      start_value,
      current_value,
      target_value,
      unit,
      tasks_count,
    ]
  );

  return result.rows[0];
}

export async function getGoals(userId: number) {
  const result = await pool.query(
    `
    SELECT * FROM goals
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

export async function getGoalById(userId: number, id: number) {
  const result = await pool.query(
    `
    SELECT g.*,
    CASE
      WHEN g.goal_type = 'metric' THEN json_build_object(
      'type', 'metric',
      'measurements', COALESCE(
        (SELECT json_agg(row_to_json(gm))
        FROM (SELECT goal_id, measured_value, measured_at FROM goal_measurements) gm WHERE gm.goal_id = g.id),
        '[]'::json        
        ),
        'target_value', g.target_value
      )
      END as progress_data
    FROM goals g
    WHERE g.user_id = $1
      AND g.id = $2

    `,
    [userId, id]
  );

  return result.rows[0];
}

export async function deleteGoal(userId: number, id: number) {
  const result = await pool.query(
    `
    DELETE FROM goals
    WHERE user_id = $1
      AND id = $2
    RETURNING 1
    `,
    [userId, id]
  );

  return result.rowCount! > 0;
}

// export async function updateProgress(goalId: number, userId: number, value: GoalsRow) {
//   const result = await pool.query(
//     `
//     UPDATE goals
//     SET current_value = current_value + $1,
//       completed_at = CASE
//         WHEN current_value + $1 >+ target_value
//         THEN NOW()
//         ELSE completed_at
//       END
//     WHERE id = $2 AND user_id = $3
//     RETURNING *
//     `,
//     [value, goalId, userId]
//   );

//   return result.rows[0];
// }
