import { Modal } from '../Modal/Modal';
import { useTodoForm } from '../../features/todos/useTodoForm';
import { TodoForm } from '../../features/todos/TodoForm';
import { createTodo } from '../../features/todos/services/todoService';
import type { AddTodoModalProps } from './types';

export function AddTodoModal({ isOpen, onClose, onCreated }: AddTodoModalProps) {
  const { form, update, validate, error } = useTodoForm({
    title: '',
    description: '',
    due_date: '',
    remind_at: '',
    priority: 'medium',
  });

  async function submit() {
    if (!validate()) return;

    const todo = await createTodo({ ...form, remind_at: form.remind_at || null });
    onCreated(todo);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} onConfirm={submit}>
      <TodoForm
        todoFormTitle="➕ New task"
        form={form}
        update={update}
        error={error}
        submitLabel="Create"
        onSubmit={submit}
        onClose={onClose}
      />
    </Modal>
  );
}
