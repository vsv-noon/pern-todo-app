import { pool } from '../config/db.js';
import * as model from '../models/goals.model.js';
import { createTodo } from '../models/todo.model.js';
import { generateTasks } from '../utils/generateTasks.js';

// export async function completedTodoImpact(userId: number) {
//   const goals = await model.getGoals(userId);

//   for (const goal of goals) {
//     await model.updateProgress(goal.id, userId, 1);
//   }
// }

export async function createNewGoal(
  userId: number,
  data: {
    title: string;
    goal_type: string;
    start_date: Date;
    until_date: Date;
    frequency: string;
    start_value: number;
    target_value: number;
    target_type: string;
    tasks_count: number;
  }
) {
  return model.createGoal(userId, data);
}

export async function createGoalWithTodos(
  userId: number,
  data: {
    title: string;
    goal_type: string;
    start_date: Date;
    until_date: Date;
    frequency: string;
    start_value: number;
    target_value: number;
    target_type: string;
    tasks_count: number;
  }
) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const goal = await model.createGoal(userId, data);

    const tasks = generateTasks(goal);

    for (const task of tasks) {
      const d: { goal_id: number; title: string; due_date: Date } = {
        goal_id: goal.id,
        title: task.title,
        due_date: task.due_date,
      };

      await createTodo(userId, d);
    }

    await client.query('COMMIT');
    return goal;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function getGoalsList(userId: number) {
  return model.getGoals(userId);
}

export async function deleteGoalById(userId: number, id: number) {
  return model.deleteGoal(userId, id);
}
