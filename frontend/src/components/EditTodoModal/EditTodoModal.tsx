import { useEffect, useState } from "react";
import type { EditTodoModalFormState, EditTodoModalProps } from "./types";
import { apiFetch } from "../../api/api";
import type { Priority, Todo } from "../../types/todo";
import { styles } from "./style";
import { validateTodo } from "../../utils/validation";
// import { createPortal } from "react-dom";
import { ModalBase } from "../ModalBase/ModalBase";

export function EditTodoModal({
  todo,
  isOpen,
  onClose,
  onUpdated,
}: EditTodoModalProps) {
  const [form, setForm] = useState<EditTodoModalFormState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !todo) return;

    setForm({
      title: todo.title,
      description: todo.description ?? "",
      due_date: todo.due_date,
      remind_at: todo.remind_at ?? "",
      priority: todo.priority,
      completed: todo.completed,
    });

    setError(null);
  }, [isOpen, todo]);

  // useEffect(() => {
  //   if (!isOpen) return;

  //   function onKeyDown(e: KeyboardEvent) {
  //     if (e.key === "Escape") {
  //       onClose();
  //     }

  //     if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
  //       submit();
  //     }
  //   }

  //   window.addEventListener("keydown", onKeyDown);
  //   return () => window.removeEventListener("keydown", onKeyDown);
  // }, [isOpen, form]);

  // -----------------------------
  // Helpers
  // -----------------------------
  function update<K extends keyof EditTodoModalFormState>(
    key: K,
    value: EditTodoModalFormState[K]
  ) {
    // if (!form) return;
    setForm((prev) => ({ ...prev!, [key]: value }));
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
        method: "PATCH",
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
      setError("Failed to update todo");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen || !form) return null;

  return (
    <ModalBase
      isOpen={true}
      title="✏️ Edit task"
      onClose={onClose}
      onSubmit={submit}
    >
      <div style={{ display: "grid", gap: 8 }}>
        {/* Title */}
        <input
          autoFocus
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />

        {/* Description */}
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        {/* Completed */}
        <label style={styles.row}>
          <input
            type="checkbox"
            checked={form.completed}
            onChange={(e) => update("completed", e.target.checked)}
          />
          Completed
        </label>

        {/* Due date */}
        <label>
          Due date:
          <input
            type="date"
            value={form.due_date}
            onChange={(e) => update("due_date", e.target.value)}
          />
        </label>

        {/* Reminder */}
        <label>
          Reminder:
          <input
            type="datetime-local"
            value={form.remind_at}
            onChange={(e) => update("remind_at", e.target.value)}
          />
        </label>

        {/* Priority */}
        <label>
          Priority:
          <select
            value={form.priority}
            onChange={(e) => update("priority", e.target.value as Priority)}
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
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        <p style={styles.hint}>💡 Ctrl + Enter — save • Esc — close</p>
      </div>
    </ModalBase>
  );
}
