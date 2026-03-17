import { pool } from '../config/db.js';

export type GoalsRow = {
  title: string;
  goal_type: string;
  start_date: Date;
  until_date: Date;
  frequency: string;
  target_type: string;
  start_value: number;
  target_value: number;
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
    target_value,
    tasks_count,
  } = data;

  const result = await pool.query(
    `
    INSERT INTO goals (user_id, title, goal_type, start_date, until_date, frequency, target_type, start_value, target_value, tasks_count)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
      target_value,
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
