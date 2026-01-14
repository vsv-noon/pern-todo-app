import type { Priority, Todo } from "../../types/todo";

export type AddTodoModalProps = {
  isOpen: boolean,
  defaultDate: string;
  existingTitles: string[];
  onClose: () => void;
  onCreated: (todo: Todo) => void;
}

export type AddTodoModalFormState = {
  title: string;
  description: string;
  due_date: string;
  remind_at: string;
  priority: Priority;
}