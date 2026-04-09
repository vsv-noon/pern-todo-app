import type { Request, Response } from 'express';

import * as todoService from '../services/todo.service.js';

/**
 * @swagger
 * /api/todos:
 *    post:
 *      summary: Create a new Todo
 *      description: Create a new Todo
 *      tags: [Todos]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                titLe: {type: string}
 *                description: {type: string}
 *                due_date: {type: string}
 *                remind_at: {type: string}
 *                priority: {type: string}
 *              example:
 *                title: New Todo
 *                description: New Todo
 *                due_date: 2026-01-01
 *                priority: high
 *      responses:
 *        201:
 *          description: Todo created successfully
 */
export async function createTodo(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { title, description, due_date, remind_at, priority } = req.body;

  if (!title || !due_date) {
    return res.status(400).json({ error: 'Title and due_date required' });
  }

  try {
    const todo = await todoService.createTodoItem(req.user.userId, {
      title,
      description,
      due_date,
      remind_at,
      priority,
    });
    return res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create todo' });
  }
}

/**@swagger
 * /api/todos/{id}:
 *  patch:
 *    summary: Partially update a Todo
 *    description: Update specific fields of a todo
 *    tags: [Todos]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: The Title ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                example: "New title"
 *              description:
 *                type: string
 *                example: "New description"
 *              due_date:
 *                type: string
 *                example: "2026-02-02"
 *              priority:
 *                type: string
 *                example: "medium"
 *    responses:
 *      200:
 *        description: Todo updated successfully
 *      404:
 *        description: Todo not found
 */
export async function updateTodo(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;
  const updates = req.body;

  try {
    const todo = await todoService.updateTodoItem(req.user.userId, Number(id), updates);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    return res.json(todo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update todo' });
  }
}

export async function reorderTodos(req: Request, res: Response) {
  const userId = req.user?.userId;
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Items must be array' });
  }

  if (!userId) return;

  try {
    await todoService.reorderTodosService(items, userId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Reorder failed' });
  }
}

/**
 * @swagger
 * /api/todos:
 *  get:
 *    summary: Retrieve a list of todos
 *    security:
 *      - bearerAuth: []
 *    tags: [Todos]
 *    description: Returns an array of todos objects from the database.
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: A successful response with a list of users.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                  task:
 *                    type: string
 *                  completed:
 *                    type: boolean
 */
export async function getTodos(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { date, search, status } = req.query as {
    date?: string;
    search?: string;
    status?: 'all' | 'completed' | 'active';
  };

  const filters: {
    date?: string;
    search?: string;
    status: 'all' | 'completed' | 'active';
  } = { status: 'all' };

  if (date) filters.date = date;
  if (search) filters.search = search;
  if (status && status !== 'all') filters.status = status;

  try {
    const todos = await todoService.getTodoList(req.user.userId, filters);

    return res.json(todos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch todos' });
  }
}

export async function getCalendarCounts(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const counts = await todoService.getCalendarTodoCounts(req.user.userId);
    return res.json(counts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch calendar counts' });
  }
}

export async function getTitleSuggestions(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { query } = req.query as { query?: string };

  try {
    const suggestions = await todoService.getTodoSuggestions(req.user.userId, query ?? '');
    return res.json(suggestions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
}

export async function getDeletedTodos(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { query } = req.query as { query?: string };

  try {
    const todos = await todoService.getDeletedTodoList(req.user.userId, query ?? undefined);
    return res.json(todos);
  } catch (err) {
    console.error('Failed to fetch deleted todos', err);
    return res.status(500).json({ error: 'Failed to fetch deleted todos' });
  }
}

/**
 * @swagger
 * /api/todos/{id}:
 *  delete:
 *    summary: Delete a todo item
 *    tags: [Todos]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: The todo ID
 *    responses:
 *      204:
 *        description: Todo deleted successfully
 *      404:
 *        description: Todo not found
 */
export async function deleteTodo(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;

  try {
    const deleted = await todoService.deleteTodoItem(req.user.userId, Number(id));
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error('Failed to delete todo', err);
    return res.status(500).json({ error: 'Failed to delete todo' });
  }
}

/**
 * @swagger
 * /api/todos/bulk-restore:
 *  post:
 *    summary: Restore multiple todos
 *    description: Deletes multiple todo items based on an array of IDs.
 *    tags: [Todos]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              ids:
 *                type: number
 *              description: The ID of the todo to restore
 *            example: {ids: [1, 2, 3]}
 *    responses:
 *      200:
 *        description: Todos restored successfully
 *      400:
 *        description: Invalid ID supplied
 */
export async function bulkRestoreTodos(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { ids } = req.body as { ids: number[] };

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids array required' });
  }

  try {
    const restored = await todoService.restoreDeletedTodos(req.user.userId, ids);
    return res.json({ restored });
  } catch (err) {
    console.error('Bulk restore failed', err);
    return res.status(500).json({ error: 'Bulk restore failed' });
  }
}

/**
 * @swagger
 * /api/todos/bulk-delete:
 *  post:
 *    summary: Delete multiple todos
 *    description: Deletes multiple todo items based on an array of IDs.
 *    tags: [Todos]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              ids:
 *                type: number
 *              description: The ID of the todo to delete
 *            example: {ids: [1, 2, 3]}
 *    responses:
 *      200:
 *        description: Todos deleted successfully
 *      400:
 *        description: Invalid ID supplied
 */
export async function bulkHardRDeleteTodos(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { ids } = req.body as { ids: number[] };

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids array required' });
  }

  try {
    const deleted = await todoService.hardDeleteTodos(req.user.userId, ids);
    return res.json({ deleted });
  } catch (err) {
    console.error('Bulk delete failed', err);
    return res.status(500).json({ error: 'Bulk delete failed' });
  }
}
