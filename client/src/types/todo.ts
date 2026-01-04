export interface Todo {
  id: number;
  title: string;
  description: string | null;
  due_date: string;       // YYYY-MM-DD
  remind_at: string | null; // ISO string
  completed: boolean;
  created_at: string;    // ISO (UTC)
  updated_at: string;    // ISO (UTC)
}





