import { useEffect, useState } from 'react';
import type { EditTodoFormState, EditTodoProps } from './types';
import { apiFetch } from '../../api/api';
import type { Priority, Todo } from '../../types/todo';
import { styles } from './style';
import { validateTodo } from '../../utils/validation';
import { Modal } from '../Modal/Modal';

export function EditTodo({ todo, isOpen, onClose, onUpdated }: EditTodoProps) {
  const [form, setForm] = useState<EditTodoFormState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !todo) return;

    setForm({
      title: todo.title,
      description: todo.description ?? '',
      due_date: todo.due_date,
      remind_at: todo.remind_at ?? '',
      priority: todo.priority,
      completed: todo.completed,
    });

    setError(null);
  }, [isOpen, todo]);

  function update<K extends keyof EditTodoFormState>(key: K, value: EditTodoFormState[K]) {
    if (!todo || !form) return null;
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function submit() {
    if (!form || !todo) return;

    const validationError = validateTodo(form.title, form.due_date);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updated = await apiFetch<Todo>(`/todos/${todo.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          completed: form.completed,
          due_date: form.due_date,
          remind_at: form.remind_at || null,
          priority: form.priority,
        }),
      });

      onUpdated(updated);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to update todo');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen || !form) return null;

  return (
    <Modal isOpen={true} onClose={onClose} onConfirm={submit}>
      <div style={{ display: 'grid', gap: 8 }}>
        <div className="modal-header">
          <h3>{'✏️ Edit task'}</h3>
        </div>

        <input autoFocus value={form.title} onChange={(e) => update('title', e.target.value)} />

        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
        />

        <label style={styles.row}>
          <input
            type="checkbox"
            checked={form.completed}
            onChange={(e) => update('completed', e.target.checked)}
          />
          Completed
        </label>

        <label>
          Due date:
          <input
            type="date"
            value={form.due_date}
            onChange={(e) => update('due_date', e.target.value)}
          />
        </label>

        <label>
          Reminder:
          <input
            type="datetime-local"
            value={form.remind_at}
            onChange={(e) => update('remind_at', e.target.value)}
          />
        </label>

        <label>
          Priority:
          <select
            value={form.priority}
            onChange={(e) => update('priority', e.target.value as Priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.actions}>
          <button onClick={onClose}>Cancel</button>
          <button disabled={loading} onClick={submit}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

        <p style={styles.hint}>💡 Ctrl + Enter — save • Esc — close</p>
      </div>
    </Modal>
  );
}
