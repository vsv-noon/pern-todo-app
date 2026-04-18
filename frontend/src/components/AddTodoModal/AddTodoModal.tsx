import { Modal } from '../Modal/Modal';
import { useTodoForm } from '../../hooks/useTodoForm';
import { TodoForm } from '../TodoForm/TodoForm';
import { createTodo } from '../../services/api/todos.api';
import type { AddTodoModalProps } from './types';
import { useEffect } from 'react';
import { initialForm } from './constants';

export function AddTodoModal({ isOpen, onClose, onCreated }: AddTodoModalProps) {
  const { form, update, validate, error, reset } = useTodoForm(initialForm);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  async function submit() {
    if (!validate()) return;

    const dto = {
      ...form,
      remind_at: new Date(form.remind_at).toISOString() || null,
    };

    const todo = await createTodo(dto);
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
