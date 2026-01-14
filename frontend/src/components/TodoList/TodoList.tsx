import { useState } from 'react';
import { apiDelete, apiFetch } from '../../api/api';
import type { TodoListProps } from './types';
import type { Todo } from '../../types/todo';
import { ConfirmationDialog } from '../ConfirmationDialog/ConfirmationDialog';

import './TodoList.css';

export function TodoList({ todos, onEdit, onUpdate, onDelete }: TodoListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Todo | null>(null);

  async function toggleCompleted(todo: Todo) {
    const updated = await apiFetch<Todo>(`/todos/${todo.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: todo.title,
        description: todo.description,
        completed: !todo.completed,
        due_date: todo.due_date,
        reminder_at: todo.remind_at,
      }),
    });

    onUpdate(updated);
  }

  function handleDeleteClick(todo: Todo) {
    setItemToDelete(todo);
    setIsModalOpen(true);
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
    setIsModalOpen(false);
    setItemToDelete(null);
  }

  return (
    <>
      <ul>
        {todos &&
          todos.map((todo) => (
            <li key={todo.id} className="todoItem">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleCompleted(todo)}
              />

              <span
                className="title"
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                }}
              >
                {todo.title}
              </span>
              <span>{todo.due_date}</span>

              <div className="actions">
                <button onClick={() => onEdit(todo)}>✏️</button>

                <button onClick={() => handleDeleteClick(todo)}>🗑</button>
              </div>
            </li>
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
