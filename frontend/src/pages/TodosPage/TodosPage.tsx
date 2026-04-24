import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../../services/api/api';
import type { Todo } from '../../types/todo';
import { requestNotificationPermission } from '../../hooks/useNotifications';
import { useReminders } from '../../hooks/useReminders';
import { CalendarView } from '../../components/CalendarView/CalendarView';
import { TodoList } from '../../components/TodoList/TodoList';
import { Filters } from '../../components/Filters/Filters';
import { formattedDate, getFirstDayOfMonth, getLastDayOfMonth } from '../../utils/date';
import { AddTodoModal } from '../../components/AddTodoModal/AddTodoModal';
import { EditTodoModal } from '../../components/EditTodoModal/EditTodoModal';
import Loader from '../../components/Loader/Loader';
import { useDebounce } from '../../hooks/useDebounce';
// import { LAST_INDEX } from '../constants';
import { TodoStatusChart } from '../../Dashboard/widgets/StatusChart';

import './style.css';

// type CalendarValue = Date | [Date, Date];
type CalendarValue = string | [string, string];

export default function TodosPage() {
  const [params, setParams] = useSearchParams();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState(params.get('search') ?? '');
  const [status, setStatus] = useState(params.get('status') ?? 'active');
  const [selectedDate, setSelectedDate] = useState(
    params.get('date') ?? new Date().toLocaleDateString('en-CA'),
  );
  const [dateRange, setDateRange] = useState<CalendarValue>([
    getFirstDayOfMonth(),
    getLastDayOfMonth(),
  ]);
  const [calendarCounts, setCalendarCounts] = useState<Record<string, number>>({});
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const debouncedValue = useDebounce(search, 300);

  const loadTodos = useCallback(
    async function () {
      try {
        setLoading(true);

        const data = await apiFetch<Todo[]>(
          `/todos?date=${selectedDate}&search=${debouncedValue}&status=${status}`,
        );

        // const data = await getTodos({date: selectedDate, search, status});

        setTodos(data);
      } catch (err) {
        console.error('Failed to load todos', err);
      } finally {
        setLoading(false);
      }
    },
    [selectedDate, debouncedValue, status],
  );

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    apiFetch<Record<string, number>>('/todos/calendar-counts')
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

  function handleDateRange(date: Date) {
    setDateRange(formattedDate(date));
  }

  function handleDateSelect(date: Date) {
    setSelectedDate(formattedDate(date));
  }

  function handleUpdateTodo(updated: Todo) {
    setTodos((prev) => prev.map((todo) => (todo.id === updated.id ? updated : todo)));
  }

  function handleDeleteTodo(id: number) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function handleCreated(todo: Todo) {
    setTodos((prev) => [...prev, todo]);
  }

  function searchTodos(value: string) {
    setSearch(value);
    setStatus('all');
    setSelectedDate('');
  }

  async function handleReorder(updated: Todo[]) {
    setTodos(updated);
  }

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useReminders(todos);

  return (
    <div className="tasksPage">
      <h1>PERN ToDo Calendar</h1>
      <div className="control">
        <button onClick={() => setModalOpen(true)}>➕ Add task</button>

        <AddTodoModal
          isOpen={isModalOpen}
          defaultDate={selectedDate}
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
        />
        <EditTodoModal
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
          onUpdated={handleUpdateTodo}
        />
        <Filters
          search={search}
          status={status}
          // onSearchChange={setSearch}
          onSearchChange={(e) => searchTodos(e)}
          onStatusChange={setStatus}
        />
      </div>
      <div className="calendar-charts-block">
        <CalendarView
          // dateRange={dateRange}
          setDateRange={handleDateRange}
          onSelect={handleDateSelect}
          // selectedDate={selectedDate}
          counts={calendarCounts}
        />

        <TodoStatusChart
          endpoint="status"
          from={Array.isArray(dateRange) ? dateRange[0] : dateRange}
          to={Array.isArray(dateRange) ? dateRange[1] : dateRange}
        />
      </div>

      {loading && <Loader />}
      {
        <div>
          {selectedDate && (
            <div style={{ marginBottom: 8 }}>
              <strong>Tasks for {selectedDate}</strong>
              <button
                style={{ marginLeft: 8 }}
                onClick={() => (setSelectedDate(''), setSearch(''), setStatus('all'))}
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
            onReorder={handleReorder}
          />
        </div>
      }
    </div>
  );
}
