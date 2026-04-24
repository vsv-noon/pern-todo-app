import type { Request, Response } from 'express';

import * as todoService from '../services/todo.service.js';

/**
 * @swagger
 * /api/tasks:
 *    post:
 *      summary: Create a new Task
 *      description: Create a new Task
 *      tags: [Tasks]
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
 *                title: New Task
 *                description: New Task
 *                due_date: 2026-01-01
 *                priority: high
 *      responses:
 *        201:
 *          description: Task created successfully
 */
export async function createTodo(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { title, description, due_date, remind_at, priority } = req.body;

  if (!title || !due_date) {
    return res.status(400).json({ error: 'Title and due_date required' });
  }

  try {
    const task = await todoService.createTodoItem(req.user.userId, {
      title,
      description,
      due_date,
      remind_at,
      priority,
    });
    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create task' });
  }
}

/**@swagger
 * /api/tasks/{id}:
 *  patch:
 *    summary: Partially update a Task
 *    description: Update specific fields of a task
 *    tags: [Tasks]
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
 *        description: Task updated successfully
 *      404:
 *        description: Task not found
 */
export async function updateTodo(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;
  const updates = req.body;

  try {
    const task = await todoService.updateTodoItem(req.user.userId, Number(id), updates);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update task' });
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
 * /api/tasks:
 *  get:
 *    summary: Retrieve a list of tasks
 *    security:
 *      - bearerAuth: []
 *    tags: [Tasks]
 *    description: Returns an array of tasks objects from the database.
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
    const tasks = await todoService.getTodoList(req.user.userId, filters);

    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
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
    const tasks = await todoService.getDeletedTodoList(req.user.userId, query ?? undefined);
    return res.json(tasks);
  } catch (err) {
    console.error('Failed to fetch deleted tasks', err);
    return res.status(500).json({ error: 'Failed to fetch deleted tasks' });
  }
}

/**
 * @swagger
 * /api/tasks/{id}:
 *  delete:
 *    summary: Delete a task item
 *    tags: [Tasks]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: The task ID
 *    responses:
 *      204:
 *        description: Task deleted successfully
 *      404:
 *        description: Task not found
 */
export async function deleteTodo(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;

  try {
    const deleted = await todoService.deleteTodoItem(req.user.userId, Number(id));
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error('Failed to delete task', err);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
}

/**
 * @swagger
 * /api/tasks/bulk-restore:
 *  post:
 *    summary: Restore multiple tasks
 *    description: Deletes multiple task items based on an array of IDs.
 *    tags: [Tasks]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              ids:
 *                type: number
 *              description: The ID of the task to restore
 *            example: {ids: [1, 2, 3]}
 *    responses:
 *      200:
 *        description: Tasks restored successfully
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
 * /api/tasks/bulk-delete:
 *  post:
 *    summary: Delete multiple tasks
 *    description: Deletes multiple task items based on an array of IDs.
 *    tags: [Tasks]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              ids:
 *                type: number
 *              description: The ID of the task to delete
 *            example: {ids: [1, 2, 3]}
 *    responses:
 *      200:
 *        description: Tasks deleted successfully
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
