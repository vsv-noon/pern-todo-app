import { useEffect, useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { Link } from 'react-router-dom';
import TasksList from '../../components/TasksList/TasksList';

import 'react-day-picker/style.css';
import { apiFetch } from '../../services/api/api';

export interface Task {
  id: number;
  title: string;
  status: string;
  due_date: string;
}

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  useEffect(() => {
    async function fetchTasksForMonth(date: Date) {
      const from = format(startOfMonth(date), 'yyyy-MM-dd');
      const to = format(endOfMonth(date), 'yyyy-MM-dd');

      const data = await apiFetch<Task[]>(`/tasks/range?start=${from}&end=${to}`);
      setTasks(data);
    }

    fetchTasksForMonth(month);
  }, [month]);

  const tasksForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];

    return tasks.filter((t) => isSameDay(new Date(t.due_date), selectedDate));
  }, [tasks, selectedDate]);

  const datesWithTasks = useMemo(() => {
    return tasks.map((t) => new Date(t.due_date));
  }, [tasks]);

  return (
    <div>
      <h1>TasksPage</h1>

      <Link to="/task-form">➕ Add new task</Link>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        month={month}
        onMonthChange={setMonth}
        weekStartsOn={1}
        modifiers={{ hasTasks: datesWithTasks }}
        modifiersStyles={{ hasTasks: { backgroundColor: '#dbeafe', borderRadius: '50%' } }}
      />
      <TasksList tasks={tasksForSelectedDay} setTasks={setTasks} />
    </div>
  );
}

export default TasksPage;
