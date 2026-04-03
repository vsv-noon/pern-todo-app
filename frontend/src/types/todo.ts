export type Priority = 'low' | 'medium' | 'high';

export type Todo = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string; // YYYY-MM-DD
  remind_at: Date | null; // ISO string
  priority: Priority;
  goal_id: number;
  created_at: string; // ISO (UTC)
  updated_at: string; // ISO (UTC)
};

export type User = {
  id: number;
  email: string;
  isActivated: boolean;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

export type TodoCounts = {
  [date: string]: number;
};

export type StatsType = 'todosByDate' | 'productivity' | 'status' | 'streak';
