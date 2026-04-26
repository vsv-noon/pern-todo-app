import { Request, Response } from 'express';

import * as tasksService from '../services/tasks.service.js';

/**
 * @swagger
 * /api/tasks:
 *    post:
 *      summary: Create a new Task
 *      description: Create a new Task
 *      tags: [Task]
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
export async function createTask(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  // const { title, description, due_date, remind_at, priority } = req.body;

  const data = req.body;

  if (!data.title) {
    return res.status(400).json({ error: 'Title required' });
  }

  try {
    const task = await tasksService.createTaskItem(req.user.userId, data);
    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create task' });
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
export async function updateTask(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await tasksService.updateTaskItem(req.user.userId, Number(id), status);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update task' });
  }
}
