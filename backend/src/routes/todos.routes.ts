import { Router } from 'express';

import {
  createTodo,
  getCalendarCounts,
  getTitleSuggestions,
  getTodos,
  getDeletedTodos,
  updateTodo,
  deleteTodo,
  bulkRestoreTodos,
  bulkHardDeleteTodos,
} from '../controllers/todos.controller.js';

import { validate } from '../middleware/validate.js';
import { createTodoSchema, updateTodoSchema } from '../validation/todo.schema.js';

const router = Router();

// Create
router.post('/', validate(createTodoSchema), createTodo);

// Update
router.patch('/:id', validate(updateTodoSchema), updateTodo);

// Reade
router.get('/calendar-counts', getCalendarCounts);
router.get('/suggestions', getTitleSuggestions);
router.get('/', getTodos);
router.get('/deleted', getDeletedTodos);

// Soft delete
router.delete('/:id', deleteTodo);

// bulk restore / delete
router.patch('/restore/bulk', bulkRestoreTodos);
router.delete('/hard/bulk', bulkHardDeleteTodos);

export default router;
