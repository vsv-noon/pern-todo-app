import type { TodoListProps } from "./types";
import type { Todo } from "../../types/todo";
import { apiDelete, apiFetch } from "../../api/api";

import "./TodoList.css";

export function TodoList({ todos, onEdit, onUpdate, onDelete }: TodoListProps) {
  async function toggleCompleted(todo: Todo) {
    const updated = await apiFetch<Todo>(`/todos/${todo.id}`, {
      method: "PATCH",
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
      {todos &&
        todos.map((todo) => (
          <li key={todo.id} className="todoItem">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompleted(todo)}
            />

            <span
              className="title"
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </span>

            <div className="actions">
              <button onClick={() => onEdit(todo)}>✏️</button>
              <button onClick={() => deleteTodo(todo)}>🗑</button>
            </div>
          </li>
        ))}
    </ul>
  );
}
