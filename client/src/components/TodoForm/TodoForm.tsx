import { useState } from "react";
import { apiFetch } from "../../api";
import type { TodoFormProps } from "./types";
import { validateTodo } from "../../utils/validation";

export function TodoForm({ refresh }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit() {
    const validationError = validateTodo(title, date);

    if (validationError) {
      setValidationError(validationError);
      return;
    }

    await apiFetch("/todos", {
      method: "POST",
      body: JSON.stringify({
        title,
        due_date: date,
        remind_at: date,
      }),
    });

    setTitle("");
    refresh();
  }

  return (
    <>
      {validationError && <p style={{ color: "red" }}>{validationError}</p>}
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={handleSubmit}>Add</button>
      </div>
    </>
  );
}
