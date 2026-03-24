import { apiFetch } from './client';

export type Measurements = {
  measured_value: number;
  measured_at: string;
};

export type ProgressData = {
  measurements: Measurements[];
};

export type Goal = {
  id?: number;
  title: string;
  goal_type: 'metric' | 'counter';
  start_date: string;
  target_type: 'count' | 'date';
  start_value?: number | null;
  current_value: number;
  target_value: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  tasks_count: number;
  until_date: string;
  completed_at?: string | null;
  progress_data?: ProgressData;
};

export async function fetchGoals(): Promise<Goal[]> {
  return apiFetch('/goals');
}

export async function fetchGoalById(id: number): Promise<Goal> {
  return await apiFetch(`/goals/${id}`);
}

export async function createGoal(data: Goal) {
  return apiFetch('/goals', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateGoal(id: number, data: Goal): Promise<Goal> {
  return apiFetch(`/goals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
