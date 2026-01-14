import { pool } from '../db.js';

export async function createTodo(req, res) {
  try {
    const { title, description, due_date, remind_at } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      `
      INSERT INTO todos (title, description, due_date, remind_at) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
      `,
      [title, description, due_date, remind_at],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Server Error' });
  }
}

export async function restoreTodo(req, res) {
  try {
    const { id } = req.params;

    const { rows, rowCount } = await pool.query(
      `
      UPDATE todos
      SET deleted_at = NULL
      WHERE id = $1
      AND deleted_at IS NOT NULL
      RETURNING *
      `,
      [id],
    );

    if (rowCount === 0) {
      return res.sendStatus(404);
    }

    if (Number.isNaN(id)) {
      return res.sendStatus(400);
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Server Error' });
  }
}

export async function updateTodo(req, res) {
  try {
    const { title, description, completed, due_date, remind_at } = req.body;
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

export async function getCalendarCounts(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        due_date::date AS date,
        COUNT(*)::int AS count
      FROM todos
      WHERE deleted_at IS NULL
      GROUP BY due_date::date
    `);

    const map = {};

    for (const row of result.rows) {
      map[row.date] = row.count;
    }

    res.json(map);
  } catch (err) {
    console.error('getCalendarCounts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getTodos(req, res) {
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

    const result = await pool.query(sql, values);

    res.json(result.rows);
  } catch (err) {
    console.error('getTodos error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteTodo(req, res) {
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
