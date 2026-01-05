import type { TodoListProps } from "./types";
import type { Todo } from "../../types/todo";
import { apiDelete, apiFetch } from "../../api";

export function TodoList({ todos, onEdit, onUpdate, onDelete }: TodoListProps) {
  async function toggleCompleted(todo: Todo) {
    const updated = await apiFetch<Todo>(`/todos/${todo.id}`, {
      method: "PUT",
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

  async function deleteTodo(todo: Todo) {
    if (!window.confirm(`Delete task "${todo.title}"?`)) return;

    await apiDelete(`/todos/${todo.id}`);
    onDelete(todo.id);
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} style={{ marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleCompleted(todo)}
          />

          <>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </span>

            <button onClick={() => onEdit(todo)}>✏️</button>
            <button onClick={() => deleteTodo(todo)}>🗑</button>
          </>
        </li>
      ))}
    </ul>
  );
}
