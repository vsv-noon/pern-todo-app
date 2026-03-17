import { apiFetch } from './client';

export type Goal = {
  // id: number;
  title: string;
  goal_type: string;
  start_date: string;
  target_type: 'count' | 'date';
  start_value?: number | null;
  target_value: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  tasks_count: number;
  until_date: string;
  completed_at?: string | null;
};

export async function fetchGoals(): Promise<Goal[]> {
  return apiFetch('/goals');
}

export async function createGoal(data: Goal) {
  return apiFetch('/goals', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
