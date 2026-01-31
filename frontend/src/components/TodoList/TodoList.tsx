import { useState } from 'react';
import { apiDelete, apiFetch } from '../../api/client';
import type { TodoListProps } from './types';
import type { Todo } from '../../types/todo';
import { ConfirmationDialog } from '../ConfirmationDialog/ConfirmationDialog';

import './TodoList.css';
import { SortableTodoItem } from '../SortableTodoItem/SortableTodoItem';

export function TodoList({ todos, onEdit, onUpdate, onDelete }: TodoListProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Todo | null>(null);

  async function toggleCompleted(todo: Todo) {
    const updated = await apiFetch<Todo>(`/todos/${todo.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: !todo.completed }),
    });

    onUpdate(updated);
  }

  // async function toggleCompleted(todo: Todo) {
  //   const updated = await apiFetch<Todo>(`/todos/${todo.id}`, {
  //     method: 'PATCH',
  //     body: JSON.stringify({ completed: !todo.completed }),
  //     body: JSON.stringify({
  //       title: todo.title,
  //       description: todo.description,
  //       completed: !todo.completed,
  //       due_date: todo.due_date,
  //       remind_at: todo.remind_at,
  //     }),
  //   });

  //   onUpdate(updated);
  // }

  function handleDeleteClick(todo: Todo) {
    setItemToDelete(todo);
    setModalOpen(true);
  }

  async function handleConfirmDelete(todo: Todo | null) {
    if (todo) {
      console.log(`Deleting item with ID: ${todo.id}`);
      await apiDelete(`/todos/${todo.id}`);
      onDelete(todo.id);
    }
    setItemToDelete(null);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setItemToDelete(null);
  }

  return (
    <>
      <ul>
        {todos &&
          todos.map((todo) => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              onEdit={() => onEdit(todo)}
              onUpdate={() => toggleCompleted(todo)}
              onDelete={() => handleDeleteClick(todo)}
            />
          ))}
      </ul>
      <ConfirmationDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Are you sure?"
        message={`Do you really want to delete task "${itemToDelete?.title}"`}
        onConfirm={() => handleConfirmDelete(itemToDelete)}
      />
    </>
  );
}
