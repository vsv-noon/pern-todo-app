import type { Priority, Todo } from '../../types/todo';

export type EditTodoProps = {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (todo: Todo) => void;
};

export type EditTodoFormState = {
  title: string;
  description?: string;
  due_date: string;
  remind_at: string;
  priority: Priority;
  completed: boolean;
};
