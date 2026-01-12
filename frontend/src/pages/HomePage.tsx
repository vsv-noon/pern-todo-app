import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../api/api";
import type { Todo } from "../types/todo";
import { requestNotificationPermission } from "../hooks/useNotifications";
import { useReminders } from "../hooks/useReminders";
import { CalendarView } from "../components/CalendarView/CalendarView";
import { AddTodoModal } from "../components/AddTodoModal/AddTodoModal";
import { TodoList } from "../components/TodoList/TodoList";
import { EditTodoModal } from "../components/EditTodoModal/EditTodoModal";
import { Filters } from "../components/Filters/Filters";
import { formatDate } from "../utils/date";

export default function HomePage() {
  const [params, setParams] = useSearchParams();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [search, setSearch] = useState(params.get("search") ?? "");
  const [status, setStatus] = useState(params.get("status") ?? "all");

  const [selectedDate, setSelectedDate] = useState(
    params.get("date") ?? formatDate(new Date())
  );

  const [calendarCounts, setCalendarCounts] = useState<Record<string, number>>(
    {}
  );

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [isModalOpen, setModalOpen] = useState(false);

  const loadTodos = useCallback(
    async function () {
      try {
        setLoading(true);

        const data = await apiFetch<Todo[]>(
          `/todos?date=${selectedDate}&search=${search}&status=${status}`
        );

        setTodos(data);
      } catch (err) {
        console.error("Failed to load todos", err);
      } finally {
        setLoading(false);
      }
    },
    [selectedDate, search, status]
  );

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    apiFetch<Record<string, number>>("/todos/calendar-counts")
      .then(setCalendarCounts)
      .catch(console.error);
  }, [todos]);

  useEffect(() => {
    setParams({
      date: selectedDate,
      search,
      status,
    });
  }, [selectedDate, search, status, setParams]);

  // useEffect(() => {
  //   apiFetch<Todo[]>(
  //     `/todos?date${selectedDate}&search=${search}&status=${status}`
  //   ).then(setTodos);
  // }, [selectedDate, search, status]);

  function handleDateSelect(date: Date) {
    setSelectedDate(formatDate(date));
  }

  function handleUpdateTodo(updated: Todo) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === updated.id ? updated : todo))
    );
  }

  function handleDeleteTodo(id: number) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function handleCreated(todo: Todo) {
    setTodos((prev) => [...prev, todo]);
  }

  const existingTitles = useMemo(() => todos.map((t) => t.title), [todos]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useReminders(todos);

  return (
    <>
      <h1>PERN ToDo Calendar</h1>
      <CalendarView
        onSelect={handleDateSelect}
        selectedDate={selectedDate}
        counts={calendarCounts}
      />
      <button onClick={() => setModalOpen(true)}>➕ Add task</button>
      <AddTodoModal
        isOpen={isModalOpen}
        defaultDate={selectedDate}
        existingTitles={existingTitles}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
      <Filters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />
      {loading && <div>Loading...</div>}
      {
        <div>
          {selectedDate && (
            <div style={{ marginBottom: 8 }}>
              <strong>Tasks for {selectedDate}</strong>
              <button
                style={{ marginLeft: 8 }}
                onClick={() => (
                  setSelectedDate(""), setSearch(""), setStatus("all")
                )}
              >
                Show all tasks
              </button>
            </div>
          )}
          <TodoList
            todos={todos}
            onEdit={setEditingTodo}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        </div>
      }
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
