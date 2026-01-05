import { Router } from "express";
// import { pool } from "../src/db.js";
import { pool } from "../db.js";

const router = Router();

// Create a new todo
router.post("/", async (req, res) => {
  try {
    const { title, description, due_date, remind_at } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const result = await pool.query(
      `
      INSERT INTO todos (title, description, due_date, remind_at) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
      `,
      [title, description, due_date, remind_at]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server Error" });
  }
});

// Get all todos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM todos 
      ORDER BY due_date
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server Error" });
  }
});

// Get todo by date
router.get("/date/:date", async (req, res) => {
  try {
    const { date } = req.params;

    const result = await pool.query(
      `
      SELECT * FROM todos 
      WHERE due_date = $1
      `,
      [date]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server Error" });
  }
});

// Update a todo
router.put("/:id", async (req, res) => {
  try {
    const { title, description, completed, due_date, remind_at } = req.body;

    if (
      title === undefined &&
      completed === undefined &&
      due_date === undefined
    ) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const result = await pool.query(
      `
      UPDATE todos 
      SET title = COALESCE($1, title), 
          description = COALESCE($2, description), 
          completed = COALESCE($3, completed),
          due_date = COALESCE($4, due_date),
          remind_at = COALESCE($5, remind_at)
      WHERE id = $6
      RETURNING *
      `,
      [title, description, completed, due_date, remind_at, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server Error" });
  }
});

// Delete a todo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM todos 
      WHERE id = $1 
      RETURNING *
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

export default router;
