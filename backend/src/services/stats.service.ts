import {
  getPriority,
  getProductivity,
  getStatus,
  getStreak,
  getTasksByDate,
} from '../models/stats.model.js';

export type StatsType = 'priority' | 'productivity' | 'status' | 'streak' | 'tasksByDate';

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

    case 'tasksByDate':
      return getTasksByDate(from, to, userId);

    default:
      throw new Error(`Unknown stats type${type}`);
  }
}
