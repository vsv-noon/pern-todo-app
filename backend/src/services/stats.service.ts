import {
  getPriority,
  getProductivity,
  getStatus,
  getStreak,
  getTodosByDate,
} from '../models/stats.model.js';

export type StatsType = 'priority' | 'productivity' | 'status' | 'streak' | 'todosByDate';

export async function getStats(
  type: StatsType,
  from: string | null,
  to: string | null,
  userId: number
): Promise<unknown> {
  switch (type) {
    case 'priority':
      return getPriority(from, to, userId);

    case 'productivity':
      return getProductivity(from, to, userId);

    case 'status':
      return getStatus(from, to, userId);

    case 'streak':
      return getStreak();

    case 'todosByDate':
      return getTodosByDate(from, to, userId);

    default:
      throw new Error(`Unknown stats type${type}`);
  }
}
