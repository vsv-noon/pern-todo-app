import { apiFetch } from './client';

export type Goal = {
  id?: number;
  title: string;
  target_type: 'count' | 'date';
  current_value?: number;
  target_value: number;
  frequency: 'daily' | 'weekly' | 'monthly';
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
