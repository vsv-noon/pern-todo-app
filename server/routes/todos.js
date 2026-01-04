import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Create a new todo
router.post("/", async (req, res) => {
  try {
    const { title, description, due_date } = req.body;

    const result = await pool.query(
      "INSERT INTO todos (title, description, due_date) VALUES ($1, $2, $3) RETURNING *",
      [title, description, due_date]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server Error" });
  }
});

// Get all todos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY due_date");

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

    const result = await pool.query("SELECT * FROM todos WHERE due_date = $1", [
      date,
    ]);

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

    const result = await pool.query(
      `
      UPDATE todos 
      SET title = $1, 
          description = $2, 
          completed = $3,
          due_date = $4,
          remind_at = $5
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
      "DELETE FROM todos WHERE id = $1 RETURNING *",
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
