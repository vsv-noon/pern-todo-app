import { PoolClient } from 'pg';

import { pool } from '../config/db.js';

export type TodoRow = {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  completed: boolean;
  due_date: Date;
  remind_at?: Date;
  priority?: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type TodoCountByDateRow = {
  date: string;
  count: number;
};

export type TitleSuggestionRow = {
  title: string;
};

export interface ReorderItem {
  id: number;
  position: number;
}

export async function createTodo(
  userId: number,
  data: {
    title: string;
    description?: string;
    due_date: Date;
    remind_at?: string;
    priority?: number;
    goal_id?: number;
  }
): Promise<TodoRow> {
  const result = await pool.query(
    `
      INSERT INTO todos (user_id, title, description, due_date, remind_at, priority, goal_id)
      VALUES ($1, $2, $3, $4::date, $5::timestamptz, $6, $7)
      RETURNING *
      `,
    [
      userId,
      data.title,
      data.description,
      data.due_date,
      data.remind_at,
      data.priority,
      data.goal_id,
    ]
  );

  return result.rows[0];
}

export async function updateTodo(
  userId: number,
  id: number,
  updates: Partial<{
    title: string;
    description?: string;
    due_date: string;
    remind_at?: string;
    priority?: number;
    goal_id?: number;
  }>
): Promise<TodoRow | null> {
  const fields = Object.entries(updates)
    .map(([key, _], idx) => `${key} = $${idx + 2}`)
    .join(', ');

  const result = await pool.query(
    `
      UPDATE todos
      SET ${fields}, updated_at = NOW()
      WHERE id = $1
        AND user_id = $${Object.keys(updates).length + 2}
        AND deleted_at IS NULL
      RETURNING *
      `,
    [id, ...Object.values(updates), userId]
  );

  return result.rows[0] || null;
}

export async function updateTodoPosition(client: PoolClient, item: ReorderItem, userId: number) {
  const result = await client.query(
    `
    UPDATE todos
    SET position = $1
    WHERE id = $2
      AND user_id = $3
      AND deleted_at IS NULL
    `,
    [item.position, item.id, userId]
  );

  return result.rows[0];
}

export async function getTodoById(userId: number, id: number): Promise<TodoRow | null> {
  const result = await pool.query<TodoRow>(
    `
    SELECT * FROM todos
    WHERE id = $1
      AND user_id = $2
      AND deleted_at IS NULL
    `,
    [id, userId]
  );

  return result.rows[0] ?? null;
}

export async function getTodos(
  userId: number,
  filters: {
    date?: string;
    search?: string;
    status?: 'all' | 'completed' | 'active';
  }
): Promise<TodoRow[]> {
  const values = [];
  const conditions = ['deleted_at IS NULL'];

  values.push(userId);
  conditions.push(`user_id = $${values.length}`);

  if (filters.date) {
    values.push(filters.date);
    conditions.push(`due_date::date = $${values.length}`);
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`);
  }

  if (filters.status === 'completed') {
    values.push(true);
    conditions.push(`completed = $${values.length}`);
  } else if (filters.status === 'active') {
    values.push(false);
    conditions.push(`completed = $${values.length}`);
  }

  const result = await pool.query(
    `
      SELECT * FROM todos
      WHERE ${conditions.join(' AND ')}
      ORDER BY position ASC, due_date ASC, created_at ASC
    `,
    values
  );

  return result.rows;
}

// export async function getCalendarCounts(userId: number): Promise<TodoCountByDateRow[]> {
//   const result = await pool.query<TodoCountByDateRow>(
//     `
//       SELECT
//         due_date::date AS date,
//         COUNT(*)::int AS count
//       FROM todos
//       WHERE user_id = $1
//         AND deleted_at IS NULL
//         AND completed = FALSE
//       GROUP BY due_date::date
//     `,
//     [userId]
//   );

//   return result.rows;
// }

export async function getCalendarCounts(userId: number): Promise<TodoCountByDateRow[]> {
  const result = await pool.query<TodoCountByDateRow>(
    `
      SELECT
        due_date::date AS date,
        COUNT(*)::int AS count
      FROM task_instances
      WHERE user_id = $1
      
      GROUP BY due_date::date
    `,
    [userId]
  );

  return result.rows;
}

export async function getTitleSuggestions(
  userId: number,
  query: string
): Promise<TitleSuggestionRow[]> {
  if (query.length < 2) return [];

  const result = await pool.query<TitleSuggestionRow>(
    `
      SELECT DISTINCT title
      FROM todos
      WHERE user_id = $1
        AND deleted_at IS NULL
        AND title ILIKE $2
      ORDER BY title
      LIMIT 10
        `,
    [userId, `%${query}%`]
  );

  return result.rows;
}

export async function getDeletedTodos(userId: number, search?: string): Promise<TodoRow[]> {
  const values = [];
  const conditions = ['deleted_at IS NOT NULL'];

  values.push(userId);
  conditions.push(`user_id = $${values.length}`);

  if (search) {
    values.push(`%${search}%`);
    conditions.push('title ILIKE $' + values.length);
  }

  const result = await pool.query<TodoRow>(
    `
      SELECT *
      FROM todos
      WHERE ${conditions.join(' AND ')}
      ORDER BY deleted_at DESC
      `,
    values
  );

  return result.rows;
}

export async function softDeleteTodo(userId: number, id: number): Promise<boolean> {
  const result = await pool.query(
    `
      UPDATE todos
      SET deleted_at = now()
      WHERE id = $1
        AND user_id = $2
        AND deleted_at IS NULL
      RETURNING 1
      `,
    [id, userId]
  );

  return result.rowCount! > 0;
}

export async function bulkRestoreTodos(userId: number, ids: number[]): Promise<number[]> {
  const result = await pool.query(
    `
      UPDATE todos
      SET deleted_at = NULL, updated_at = NOW()
      WHERE id = ANY($1)
        AND user_id = $2
      RETURNING id
      `,
    [ids, userId]
  );

  return result.rows.map((r) => r.id);
}

export async function bulkHardDeleteTodos(userId: number, ids: number[]): Promise<number[]> {
  const result = await pool.query(
    `
      DELETE FROM todos
      WHERE id = ANY($1)
        AND user_id = $2
      RETURNING id
      `,
    [ids, userId]
  );

  return result.rows.map((r) => r.id);
}
