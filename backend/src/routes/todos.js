import { Router } from 'express';

import {
  createTodo,
  getCalendarCounts,
  getTitleSuggestions,
  getTodos,
  getDeletedTodos,
  restoreTodo,
  updateTodo,
  deleteTodo,
  hardDeleteTodo,
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
router.get('/suggestions', getTitleSuggestions);
router.get('/', getTodos);
router.get('/deleted', getDeletedTodos);

// Soft delete
router.delete('/:id', deleteTodo);

// Hard delete
router.delete('/:id/hard', hardDeleteTodo);

export default router;
