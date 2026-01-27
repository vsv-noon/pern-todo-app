import { getProductivity, getStatus, getStreak, getTodosByDate } from '../models/stats.model.js';

export type StatsType = 'productivity' | 'status' | 'streak' | 'todosByDate';

export async function getStats(
  userId: number,
  type: StatsType,
  from: string | null,
  to: string | null
): Promise<unknown> {
  switch (type) {
    case 'productivity':
      return getProductivity(from, to);

    case 'status':
      return getStatus(from, to);

    case 'streak':
      return getStreak();

    case 'todosByDate':
      return getTodosByDate(from, to);

    default:
      throw new Error(`Unknown stats type${type}`);
  }
}
