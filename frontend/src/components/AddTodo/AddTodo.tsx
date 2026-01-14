import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../api/api';
import type { AddTodoProps, AddTodoFormState } from './types';
import { validateTodo } from '../../utils/validation';
import type { Priority, Todo } from '../../types/todo';
import { emptyAddTodoModalForm } from './constants';
import { Modal } from '../Modal/Modal';

import { styles } from './style';

export function AddTodo({ isOpen, defaultDate, existingTitles, onClose, onCreated }: AddTodoProps) {
  const [form, setForm] = useState<AddTodoFormState>({
    ...emptyAddTodoModalForm,
    due_date: defaultDate,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

  function selectSuggestion(value: string) {
    updateField('title', value);
    setActiveIndex(-1);
    setIsSuggestionOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const value = suggestions[activeIndex];
      if (value) {
        selectSuggestion(value);
      }
    }

    if (e.key === 'Escape') {
      setIsSuggestionOpen(false);
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setForm({
        ...emptyAddTodoModalForm,
        due_date: '',
      });
      setError(null);
    }
  }, [defaultDate, isOpen]);

  const suggestions = useMemo(() => {
    if (!form.title.trim()) return [];

    const q = form.title.toLowerCase();

    return existingTitles.filter((t) => t.toLowerCase().includes(q)).slice(0, 5);
  }, [form.title, existingTitles]);

  useEffect(() => {
    if (suggestions.length > 0 && suggestions[0] !== form.title) {
      setIsSuggestionOpen(true);
      setActiveIndex(0);
    } else {
      setIsSuggestionOpen(false);
    }
  }, [suggestions, form.title]);

  function updateField<K extends keyof AddTodoFormState>(key: K, value: AddTodoFormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit() {
    const validationError = validateTodo(form.title, form.due_date);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const created = await apiFetch<Todo>('/todos', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          due_date: form.due_date,
          remind_at: form.remind_at || null,
        }),
      });

      onCreated(created);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to create todo');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} onConfirm={handleSubmit}>
      <div style={{ display: 'grid', gap: 8 }}>
        <div className="modal-header">
          <h3>{'➕ New task'}</h3>
        </div>
        <div style={styles.field}>
          <input
            type="text"
            autoFocus
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Title"
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setIsSuggestionOpen(false), 150)}
            // list="title-suggestion"
          />
          {/* <datalist id="title-suggestion">
            {suggestions.map((s, id) => (
              <option key={id} value={s} />
            ))}
          </datalist> */}
          {isSuggestionOpen && suggestions.length > 0 && (
            <ul style={styles.suggestions}>
              {suggestions.map((s, id) => (
                <li
                  key={id}
                  onMouseDown={() => selectSuggestion(s)}
                  onMouseEnter={() => setActiveIndex(id)}
                  style={{
                    ...styles.suggestionItem,
                    background: id === activeIndex ? '#e3f2fd' : 'white',
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
        />

        <label>
          Due date:
          <input
            type="date"
            value={form.due_date}
            onChange={(e) => updateField('due_date', e.target.value)}
          />
        </label>

        <label>
          Reminder:
          <input
            type="datetime-local"
            value={form.remind_at}
            onChange={(e) => updateField('remind_at', e.target.value)}
          />
        </label>

        <label>
          Priority:
          <select
            value={form.priority}
            onChange={(e) => updateField('priority', e.target.value as Priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.actions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>{loading ? 'Creating...' : 'Add'}</button>
        </div>

        <p style={styles.hint}>💡 Ctrl + Enter — create • Esc — close</p>
      </div>
    </Modal>
  );
}
