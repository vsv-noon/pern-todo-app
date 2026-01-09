import { Router } from "express";

import {
  createTodo,
  deleteTodo,
  getAllTodos,
  getTodoByDate,
  restoreTodo,
  updateTodo,
} from "../controllers/todos.controller.js";

import { validate } from "../middleware/validate.js";
import {
  createTodoSchema,
  updateTodoSchema,
} from "../validation/todo.schema.js";

const router = Router();

// Create
router.post("/", validate(createTodoSchema), createTodo);

// Restore
router.patch("/:id/restore", restoreTodo);

// Update
router.patch("/:id", validate(updateTodoSchema), updateTodo);

// Reade
router.get("/", getAllTodos);

router.get("date/:date", getTodoByDate);

// Delete
router.delete("/:id", deleteTodo);

export default router;
