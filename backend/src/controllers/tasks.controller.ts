import { Request, Response } from 'express';

import * as tasksService from '../services/tasks.service.js';

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
export async function createTask(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  // const { title, description, due_date, remind_at, priority } = req.body;

  const data = req.body;

  if (!data.title) {
    return res.status(400).json({ error: 'Title required' });
  }

  try {
    const todo = await tasksService.createTaskItem(req.user.userId, data);
    return res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create todo' });
  }
}

export async function getTasksRange(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = req.user.userId;
  const { start, end } = req.query as { start: string; end: string };

  try {
    const result = await tasksService.getTasksRangeService(userId, start, end);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}
