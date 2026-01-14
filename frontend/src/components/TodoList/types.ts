import type { Todo } from '../../types/todo';

export interface TodoListProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: number) => void;
}
