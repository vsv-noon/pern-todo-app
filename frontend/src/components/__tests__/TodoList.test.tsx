import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TodoList } from '../TodoList/TodoList';
import type { Todo } from '../../types/todo';
import * as api from '../../api/api';

const todos: Todo[] = [
  {
    id: 1,
    title: 'Test todo',
    description: '',
    completed: false,
    due_date: '2026-01-10',
    remind_at: null,
    created_at: '',
    updated_at: '',
  },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('TodoList', () => {
  it('renders todos', () => {
    render(<TodoList todos={todos} onEdit={vi.fn()} onUpdate={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('toggles completed', async () => {
    const onUpdate = vi.fn();

    vi.spyOn(api, 'apiFetch').mockResolvedValueOnce({
      ...todos[0],
      completed: true,
    });

    render(<TodoList todos={todos} onEdit={vi.fn()} onUpdate={onUpdate} onDelete={vi.fn()} />);

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ completed: true }));
  });

  it('deletes todo', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(api, 'apiDelete').mockResolvedValueOnce(undefined);

    const onDelete = vi.fn();

    render(<TodoList todos={todos} onEdit={vi.fn()} onUpdate={vi.fn()} onDelete={onDelete} />);

    const deleteBtn = screen.getByText('🗑');
    await userEvent.click(deleteBtn);

    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
