import { PoolClient } from 'pg';

export async function createTask(
  client: PoolClient,
  userId: number,
  data: {
    title: string;
    description?: string;
    // dueDate: Date;
    // remindAt?: string;
    // priority?: number;
    goalId?: number;
    isRecurring: boolean;
  }
) {
  const result = await client.query(
    `
      INSERT INTO tasks (user_id, title, description, goal_id, is_recurring)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
    [
      userId,
      data.title,
      data.description,
      // data.dueDate,
      // data.remindAt,
      // data.priority,
      data.goalId,
      data.isRecurring,
    ]
  );

  return result.rows[0];
}

export async function createTaskRecurrence(
  client: PoolClient,
  taskId: number,
  data: {
    type: string;
    interval: number;
    daysOfWeek: number[];
    dayOfMonth: number;
    startDate: Date;
    endDate: Date;
  }
) {
  const result = await client.query(
    `
    INSERT INTO task_recurrence (
      task_id,
      type,
      interval,
      days_of_week,
      day_of_month,
      start_date,
      end_date
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [
      taskId,
      data.type,
      data.interval,
      data.daysOfWeek,
      data.dayOfMonth,
      data.startDate,
      data.endDate,
    ]
  );

  return result.rows[0];
}

export async function createTaskInstance(
  client: PoolClient,
  userId: number,
  taskId: number,
  dueDate: Date
) {
  await client.query(
    `
    INSERT INTO task_instances (user_id, task_id, due_date)
    VALUES ($1, $2, $3)
    `,
    [userId, taskId, dueDate]
  );
}

export async function createInstances(
  client: PoolClient,
  userId: number,
  taskId: number,
  dates: Date[]
) {
  for (const d of dates) {
    await client.query(
      `
      INSERT INTO task_instances (user_id, task_id, due_date)
      VALUES ($1, $2, $3)
      ON CONFLICT (task_id, due_date) DO NOTHING
      `,
      [userId, taskId, d.toISOString().slice(0, 10)]
    );
  }
}

export async function getRecurringTasks(client: PoolClient, userId: number) {
  const result = await client.query(
    `
          SELECT t.id, tr.*
          FROM tasks t
          JOIN task_recurrence tr ON tr.task_id = t.id
          WHERE t.user_id = $1
          `,
    [userId]
  );

  return result;
}

export async function getRangeInstances(
  client: PoolClient,
  userId: number,
  start: string,
  end: string
) {
  const result = await client.query(
    `
          SELECT ti.*, t.title
          FROM task_instances ti
          JOIN tasks t ON t.id = ti.task_id
          WHERE t.user_id = $1
            AND ti.due_date BETWEEN $2 AND $3
          ORDER BY ti.due_date
          `,
    [userId, start, end]
  );

  return result.rows;
}
