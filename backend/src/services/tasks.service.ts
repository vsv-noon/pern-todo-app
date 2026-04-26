import { pool } from '../config/db.js';
import { generateDatesForRange } from '../utils/generateDatesForRange.js';
import * as tasksModel from '../models/tasks.model.js';

export async function createTaskItem(
  userId: number,
  data: {
    title: string;
    description?: string;
    dueDate: Date;
    remind_at?: string;
    priority?: number;
    isRecurring: boolean;
    recurrence: {
      type: string;
      interval: number;
      daysOfWeek: number[];
      dayOfMonth: number;
      startDate: Date;
      endDate: Date;
    };
  }
) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await tasksModel.createTask(client, userId, data);

    if (data.isRecurring) {
      await tasksModel.createTaskRecurrence(client, result.id, data.recurrence);
    } else {
      await tasksModel.createTaskInstance(client, userId, result.id, data.dueDate);
    }

    await client.query('COMMIT');

    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getTasksRangeService(userId: number, start: string, end: string) {
  const client = await pool.connect();

  try {
    client.query('BEGIN');

    const { rows: recurringTasks } = await tasksModel.getRecurringTasks(client, userId);

    for (const task of recurringTasks) {
      const dates = generateDatesForRange(task, new Date(start as string), new Date(end as string));
      await tasksModel.createInstances(client, userId, task.task_id, dates);
    }

    const result = await tasksModel.getRangeInstances(client, userId, start, end);

    await client.query('COMMIT');

    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function updateTaskItem(userId: number, id: number, status: string) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await tasksModel.updateTask(client, status, id, userId);

    await client.query('COMMIT');

    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
