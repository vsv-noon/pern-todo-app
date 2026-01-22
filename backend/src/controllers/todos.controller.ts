import { pool } from '../db.ts';
import type { Request, Response } from 'express';

export async function createTodo(req: Request, res: Response) {
  try {
    const { title, description, due_date, remind_at, priority } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      `
      INSERT INTO todos (title, description, due_date, remind_at, priority) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
      `,
      [title, description, due_date, remind_at, priority],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Server Error' });
  }
}

export async function updateTodo(req: Request, res: Response) {
  try {
    const { title, description, completed, due_date, remind_at, priority } = req.body;
    const { id } = req.params;

    const fields = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(title);
    }

    if (description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(description);
    }

    if (completed !== undefined) {
      fields.push(`completed = $${idx++}`);
      values.push(completed);
    }

    if (due_date !== undefined) {
      fields.push(`due_date = $${idx++}`);
      values.push(due_date);
    }

    if (remind_at !== undefined) {
      fields.push(`remind_at = $${idx++}`);
      values.push(remind_at);
    }

    if (priority !== undefined) {
      fields.push(`priority = $${idx++}`);
      values.push(priority);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    values.push(id);

    const result = await pool.query(
      `
      UPDATE todos
      SET ${fields.join(', ')},
          updated_at = NOW()
      WHERE id = $${idx}
        AND deleted_at IS NULL
      RETURNING *
      `,
      values,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getCalendarCounts(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT 
        due_date::date AS date,
        COUNT(*)::int AS count
      FROM todos
      WHERE deleted_at IS NULL AND completed = FALSE
      GROUP BY due_date::date
    `);

    const map: Record<string, number> = {};

    for (const row of result.rows) {
      map[row.date] = row.count;
    }

    res.json(map);
  } catch (err) {
    console.error('getCalendarCounts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getTitleSuggestions(req: Request, res: Response) {
  try {
    const { query = '' } = req.query;

    if (typeof query === 'string' && query.length < 2) {
      return res.json([]);
    }

    const result = await pool.query(
      `
      SELECT DISTINCT title
      FROM todos
      WHERE deleted_at IS NULL
        AND title ILIKE $1
      ORDER BY title
      LIMIT 10
        `,
      [`%${query}%`],
    );

    res.json(result.rows.map((r) => r.title));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Suggestions failed' });
  }
}

export async function getTodos(req: Request, res: Response) {
  try {
    const { date, search = '', status = 'all' } = req.query;

    const values = [];
    const conditions = [];

    if (date) {
      values.push(date);
      conditions.push(`due_date::date = $${values.length}::date`);
    }

    if (search) {
      values.push(`%${search}%`);
      conditions.push(`
        (title ILIKE $${values.length}
         OR description ILIKE $${values.length})
      `);
    }

    if (status === 'completed') {
      values.push(true);
      conditions.push(`completed = $${values.length}`);
    }

    if (status === 'active') {
      values.push(false);
      conditions.push(`completed = $${values.length}`);
    }

    conditions.push('deleted_at IS NULL');

    const sql = `
      SELECT *
      FROM todos
      WHERE ${conditions.join(' AND ')}
      ORDER BY due_date ASC, created_at ASC
    `;

    // const sql = `
    //   SELECT id, title, description, completed, due_date, remind_at::timestamp
    //   FROM todos
    //   WHERE ${conditions.join(' AND ')}
    //   ORDER BY due_date ASC, created_at ASC
    // `;

    const result = await pool.query(sql, values);

    res.json(result.rows);
  } catch (err) {
    console.error('getTodos error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getDeletedTodos(req: Request, res: Response) {
  try {
    const { q = '' } = req.query;

    const result = await pool.query(
      `
      SELECT * 
      FROM todos
      WHERE deleted_at IS NOT NULL
        AND ($1 = '' OR title ILIKE $1)
      ORDER BY deleted_at DESC
      `,
      [q ? `%${q}%` : ''],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load deleted todos' });
  }
}

export async function deleteTodo(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE todos 
      SET deleted_at = now()
      WHERE id = $1 
      AND deleted_at IS NULL
      RETURNING *
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
}

export async function bulkRestoreTodos(req: Request, res: Response) {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids required' });
    }

    const result = await pool.query(
      `
      UPDATE todos
      SET deleted_at = NULL, updated_at = NOW()
      WHERE id = ANY($1)
      RETURNING id
      `,
      [ids],
    );

    res.json({ restored: result.rows.map((r) => r.id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Bulk restore failed' });
  }
}

export async function bulkHardDeleteTodos(req: Request, res: Response) {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids required' });
    }

    const result = await pool.query(
      `
      DELETE FROM todos
      WHERE id = ANY($1)
      RETURNING id
      `,
      [ids],
    );

    res.json({ deleted: result.rows.map((r) => r.id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Bulk delete failed' });
  }
}
