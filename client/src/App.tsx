import { useCallback, useEffect, useMemo, useState } from "react";

import { CalendarView } from "./components/CalendarView/CalendarView";
import { TodoForm } from "./components/TodoForm/TodoForm";
import { TodoList } from "./components/TodoList/TodoList";
import { apiFetch } from "./api";
import type { Todo } from "./types/todo";
import { EditTodoModal } from "./components/EditTodoModal/EditTodoModal";
import { requestNotificationPermission } from "./hooks/useNotifications";
import { useReminders } from "./hooks/useReminders";

function App() {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const dateWithTodos = useMemo(() => {
    return new Set(allTodos.map((todo) => todo.due_date));
  }, [allTodos]);

  const todosCountByDate = useMemo(() => {
    const map = new Map<string, number>();

    for (const todo of allTodos) {
      map.set(todo.due_date, (map.get(todo.due_date) ?? 0) + 1);
    }

    return map;
  }, [allTodos]);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);

      const data = await apiFetch<Todo[]>("/todos");
      setAllTodos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const visibleTodos = useMemo(() => {
    if (!selectedDate) return allTodos;

    return allTodos.filter((todo) => todo.due_date === selectedDate);
  }, [allTodos, selectedDate]);

  const handleDateSelect = useCallback((date: Date) => {
    const d = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
    setSelectedDate(d);
  }, []);

  const handleUpdateTodo = useCallback((updated: Todo) => {
    setAllTodos((prev) =>
      prev.map((todo) => (todo.id === updated.id ? updated : todo))
    );
  }, []);

  const handleDeleteTodo = useCallback((id: number) => {
    setAllTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useReminders(allTodos);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>PERN ToDo Calendar</h1>
          <CalendarView
            onSelect={handleDateSelect}
            selectedDate={selectedDate}
            dateWithTodos={dateWithTodos}
            todosCountByDate={todosCountByDate}
          />
          <TodoForm refresh={loadAll} />
          {selectedDate && (
            <div style={{ marginBottom: 8 }}>
              <strong>Tasks for {selectedDate}</strong>
              <button
                style={{ marginLeft: 8 }}
                onClick={() => setSelectedDate(null)}
              >
                Show all tasks
              </button>
            </div>
          )}
          <TodoList
            todos={visibleTodos}
            onEdit={setEditingTodo}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        </div>
      )}
      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
          onSave={handleUpdateTodo}
        />
      )}
    </>
  );
}

export default App;
