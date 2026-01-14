export type Priority = 'low' | 'medium' | 'high';

export type Todo = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string; // YYYY-MM-DD
  remind_at: string | null; // ISO string
  priority: Priority;

  created_at: string; // ISO (UTC)
  updated_at: string; // ISO (UTC)
};
