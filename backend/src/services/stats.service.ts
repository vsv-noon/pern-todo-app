import { pool } from '../config/db.js';

export type TodoRow = {
  date: string;
  count: number;
};

export async function getProductivity(from: string | null, to: string | null) {
  const result = await pool.query(
    `
    SELECT
      date,
      completed_count,
      created_count,
      productivity
    FROM daily_metrics
    WHERE ($1::date IS NULL OR date >= $1)
      AND ($2::date IS NULL OR date <= $2)
    ORDER BY date
    `,
    [from || null, to || null],
  );

  return result.rows;
}

export async function getStatus(from: string | null, to: string | null): Promise<TodoRow[]> {
  const result = await pool.query<TodoRow>(
    `
    SELECT
      completed, COUNT(*)
    FROM todos
    WHERE deleted_at IS NULL
      AND ($1::date IS NULL OR due_date >= $1)
      AND ($2::date IS NULL OR due_date <= $2)
    GROUP BY completed;
    `,
    [from || null, to || null],
  );

  return result.rows;
}

export async function getStreak() {
  const result = await pool.query(
    `
    WITH days AS (
      SELECT date
      FROM daily_metrics
      WHERE completed_count > 0
      ORDER BY date DESC
    ),
    seq AS (
      SELECT
        date,
        date - INTERVAL '1 day' * row_number() OVER () AS grp
      FROM days
    )
      SELECT COUNT(*) AS streak
      FROM seq
      GROUP BY grp
      ORDER BY streak DESC
      LIMIT 1;
    `,
  );

  return { streak: Number(result.rows[0]?.streak || 0) };
}

export async function getTodosByDate(from: string | null, to: string | null): Promise<TodoRow[]> {
  const result = await pool.query<TodoRow>(
    `
    SELECT
      due_date::date AS date,
      COUNT(*) AS count
    FROM todos
    WHERE deleted_at IS NULL
      AND ($1::date IS NULL OR due_date >= $1)
      AND ($2::date IS NULL OR due_date <= $2)
    GROUP BY date
    ORDER BY date
    `,
    [from, to],
  );

  return result.rows;
}
