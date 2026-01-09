import { useState } from "react";
import type { EditTodoModalProps } from "./types";
import { apiFetch } from "../../api";
import type { Todo } from "../../types/todo";
import { styles } from "./style";
import { validateTodo } from "../../utils/validation";

export function EditTodoModal({ todo, onClose, onSave }: EditTodoModalProps) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");
  const [completed, setCompleted] = useState(todo.completed);
  const [dueDate, setDueDate] = useState(todo.due_date);
  const [remindAt, setRemindAt] = useState(
    todo.remind_at
      ? todo.remind_at.slice(0, 16) // for input[type=datetime-local]
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  function localDateTimeToISO(value: string): string {
    const [date, time] = value.split("T");
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);

    const localDate = new Date(year, month - 1, day, hour, minute);
    return localDate.toISOString();
  }

  async function handleSave() {
    setLoading(true);

    const validationError = validateTodo(title, dueDate);

    if (validationError) {
      setValidationError(validationError);
      return;
    }

    const updated = await apiFetch<Todo>(`/todos/${todo.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title,
        description,
        completed,
        due_date: dueDate,
        remind_at: remindAt ? localDateTimeToISO(remindAt) : null,
      }),
    });

    onSave(updated);
    onClose();
    setLoading(false);
  }

  return (
    <>
      {loading && <div>Loading...</div>}
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          {validationError && <p style={{ color: "red" }}>{validationError}</p>}
          <h3>Edit a task</h3>

          <label>
            {"Title"}
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>

          <label>
            {"Description"}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <label style={{ display: "flex", gap: 8 }}>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            {"Completed"}
          </label>

          <label>
            {"Due Date"}
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>
          <label>
            {"Reminder"}
            <input
              type="datetime-local"
              value={remindAt}
              onChange={(e) => setRemindAt(e.target.value)}
            />
          </label>

          <div style={styles.actions}>
            <button onClick={onClose}>{"Cancel"}</button>
            <button onClick={handleSave}>{"Save"}</button>
          </div>
        </div>
      </div>
    </>
  );
}
