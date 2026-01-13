import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../api/api";
import type { AddTodoModalProps, AddTodoModalFormState } from "./types";
import { validateTodo } from "../../utils/validation";
import type { Priority, Todo } from "../../types/todo";
import { emptyAddTodoModalForm } from "./constants";
import { ModalBase } from "../ModalBase/ModalBase";

import { styles } from "./style";

export function AddTodoModal({
  isOpen,
  defaultDate,
  existingTitles,
  onClose,
  onCreated,
}: AddTodoModalProps) {
  const [form, setForm] = useState<AddTodoModalFormState>({
    ...emptyAddTodoModalForm,
    due_date: defaultDate,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (!isOpen) return;

  //   function onKeyDown(e: KeyboardEvent) {
  //     if (e.key === "Escape") {
  //       onClose();
  //     }

  //     if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
  //       handleSubmit();
  //     }
  //   }

  //   window.addEventListener("keydown", onKeyDown);

  //   return () => window.removeEventListener("keydown", onKeyDown);
  // }, [isOpen, form]);

  useEffect(() => {
    if (isOpen) {
      setForm({
        ...emptyAddTodoModalForm,
        due_date: defaultDate,
      });
      setError(null);
    }
  }, [defaultDate, isOpen]);

  const suggestions = useMemo(() => {
    if (!form.title.trim()) return [];

    const q = form.title.toLowerCase();

    return existingTitles
      .filter((t) => t.toLowerCase().includes(q))
      .slice(0, 5);
  }, [form.title, existingTitles]);

  function updateField<K extends keyof AddTodoModalFormState>(
    key: K,
    value: AddTodoModalFormState[K]
  ) {
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

      const created = await apiFetch<Todo>("/todos", {
        method: "POST",
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
      setError("Failed to create todo");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <ModalBase
      isOpen={isOpen}
      title="➕ New task"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div style={{ display: "grid", gap: 8 }}>
        <div style={styles.field}>
          <input
            autoFocus
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Title"
            // list="title-suggestion"
          />
          {/* <datalist id="title-suggestion">
            {suggestions.map((s, id) => (
              <option key={id} value={s} />
            ))}
          </datalist> */}
          {suggestions.length > 0 && (
            <ul style={styles.suggestions}>
              {suggestions.map((s, id) => (
                <li key={id} onClick={() => updateField("title", s)}>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />

        <label>
          Due date:
          <input
            type="date"
            value={form.due_date}
            onChange={(e) => updateField("due_date", e.target.value)}
          />
        </label>

        <label>
          Reminder:
          <input
            type="datetime-local"
            value={form.remind_at}
            onChange={(e) => updateField("remind_at", e.target.value)}
          />
        </label>

        <label>
          Priority:
          <select
            value={form.priority}
            onChange={(e) =>
              updateField("priority", e.target.value as Priority)
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.actions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>
            {loading ? "Creating..." : "Add"}
          </button>
        </div>

        <p style={styles.hint}>💡 Ctrl + Enter — create • Esc — close</p>
      </div>
    </ModalBase>
  );
}
