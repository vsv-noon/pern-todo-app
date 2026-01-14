import type { AddTodoModalFormState } from './types';

export const emptyAddTodoModalForm: AddTodoModalFormState = {
  title: '',
  description: '',
  due_date: '',
  remind_at: '',
  priority: 'medium',
};
