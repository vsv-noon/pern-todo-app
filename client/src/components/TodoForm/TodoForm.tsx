import { useState } from "react";
import { apiFetch } from "../../api";
import type { TodoFormProps } from "./types";

export function TodoForm({ refresh }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  async function submit() {
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
      <button onClick={submit}>Add</button>
    </div>
  );
}
