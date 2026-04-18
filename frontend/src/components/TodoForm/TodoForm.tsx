import type { TodoFormProps } from './types';
import type { Priority } from '../../types/todo';
import { useEffect, useState } from 'react';
import { fetchTitleSuggestions } from '../../services/api/todos.api';

// import { styles } from './styles';
import './styles.css';
import { useDebounce } from '../../hooks/useDebounce';
import { getSystemLocalFormat } from '../../utils/date';

export function TodoForm({
  todoFormTitle,
  form,
  update,
  error,
  submitLabel,
  onSubmit,
  onClose,
  showCompleted,
}: TodoFormProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);

  const debouncedValue = useDebounce(form.title, 300);

  // useEffect(() => {
  //   const id = setTimeout(async () => {
  //     const data = await fetchTitleSuggestions(form.title);

  //     if (form.title.length < 2 || form.title === data[0]) {
  //       setSuggestions([]);
  //       return;
  //     }

  //     setSuggestions(data);
  //     setOpen(true);
  //   }, 300);

  //   return () => clearTimeout(id);
  // }, [form.title]);

  useEffect(() => {
    async function load() {
      const data = await fetchTitleSuggestions(debouncedValue);

      if (debouncedValue.length < 2 || debouncedValue === data[0]) {
        setSuggestions([]);
        return;
      }

      setSuggestions(data);
      setOpen(true);
    }

    load();
  }, [debouncedValue]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    }

    if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  function selectSuggestion(value: string) {
    update('title', value);
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      update('remind_at', getSystemLocalFormat(date));
    }
  };

  return (
    <div className="todo-form">
      <div className="modal-header">
        <h3>{todoFormTitle}</h3>
      </div>
      <div>
        <div className="field">
          <input
            className="input-title"
            type="text"
            autoFocus
            placeholder="Title"
            value={form.title}
            onChange={(e) => {
              update('title', e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
          {open && suggestions.length > 0 && (
            <ul className="autocomplete">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className={i === activeIndex ? 'active' : ''}
                  onMouseDown={() => selectSuggestion(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => update('description', e.target.value)}
      />
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
          // onChange={(e) => update('remind_at', e.target.value)}
          onChange={handleTimeChange}
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
      {showCompleted && (
        <label>
          Complete:
          <input
            type="checkbox"
            checked={!!form.completed}
            onChange={(e) => update('completed', e.target.checked)}
          />
        </label>
      )}
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button onClick={onClose}>Cancel</button>
        <button onClick={onSubmit}>{submitLabel}</button>
      </div>
      <p className="hint">💡 Ctrl + Enter — create • Esc — close</p>
    </div>
  );
}
