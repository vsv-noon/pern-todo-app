import { Router } from 'express';

import {
  createTodo,
  deleteTodo,
  getCalendarCounts,
  getTodos,
  restoreTodo,
  updateTodo,
} from '../controllers/todos.controller.js';

import { validate } from '../middleware/validate.js';
import { createTodoSchema, updateTodoSchema } from '../validation/todo.schema.js';

const router = Router();

// Create
router.post('/', validate(createTodoSchema), createTodo);

// Restore
router.patch('/:id/restore', restoreTodo);

// Update
router.patch('/:id', validate(updateTodoSchema), updateTodo);

// Reade
router.get('/calendar-counts', getCalendarCounts);
router.get('/', getTodos);

// Delete
router.delete('/:id', deleteTodo);

export default router;
