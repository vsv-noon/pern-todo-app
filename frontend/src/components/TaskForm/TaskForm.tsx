import React, { useState } from 'react';
import { apiFetch } from '../../services/api/api';
import { useNavigate } from 'react-router-dom';
// import { createTodo } from '../../services/api/todos.api';

type RecurrenceType = 'daily' | 'weekly' | 'monthly';

interface RecurrenceForm {
  type: RecurrenceType;
  interval: number;
  daysOfWeek: number[];
  dayOfMonth: number;
  startDate: string;
  endDate?: string;
}

interface TaskFormState {
  title: string;
  description: string;
  goalId?: number;
  isRecurring: boolean;
  dueDate?: string;
  recurrence: RecurrenceForm;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function TaskForm() {
  const [form, setForm] = useState<TaskFormState>({
    title: '',
    description: '',
    goalId: undefined,

    isRecurring: false,
    dueDate: '',

    recurrence: {
      type: 'daily',
      interval: 1,
      daysOfWeek: [],
      dayOfMonth: 1,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
    },
  });

  const navigate = useNavigate();

  const update = (patch: Partial<TaskFormState>) => setForm((prev) => ({ ...prev, ...patch }));

  const updateRecurrence = (patch: Partial<RecurrenceForm>) =>
    setForm((prev) => ({ ...prev, recurrence: { ...prev.recurrence, ...patch } }));

  const toggleDay = (dayIndex: number) => {
    const exists = form.recurrence.daysOfWeek.includes(dayIndex);

    updateRecurrence({
      daysOfWeek: exists
        ? form.recurrence.daysOfWeek.filter((d) => d !== dayIndex)
        : [...form.recurrence.daysOfWeek, dayIndex],
    });
  };

  // const handleSubmit = async () => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = form.isRecurring
      ? {
          title: form.title,
          description: form.description,
          goalId: form.goalId,
          isRecurring: form.isRecurring,
          recurrence: form.recurrence,
        }
      : {
          title: form.title,
          description: form.description,
          goalId: form.goalId,
          dueDate: form.dueDate,
        };

    await apiFetch('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // await createTodo(payload);

    alert('Created!');
    navigate('/tasks');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Create Task Form</h2>

      <input
        type="text"
        value={form.title}
        onChange={(e) => update({ title: e.target.value })}
        placeholder="Title"
      />

      <textarea
        value={form.description}
        onChange={(e) => update({ description: e.target.value })}
        placeholder="Description"
      />

      <label>
        <input
          type="checkbox"
          checked={form.isRecurring}
          onChange={(e) => update({ isRecurring: e.target.checked })}
        />
      </label>

      {!form.isRecurring && (
        <div>
          <label>Due date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => update({ dueDate: e.target.value })}
          />
        </div>
      )}

      {form.isRecurring && (
        <div style={{ border: '1px solid #ccc', padding: 10 }}>
          <h4>Recurrence</h4>

          <select
            value={form.recurrence.type}
            onChange={(e) => updateRecurrence({ type: e.target.value as RecurrenceType })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <input
            type="number"
            min={1}
            value={form.recurrence.interval}
            onChange={(e) => updateRecurrence({ interval: Number(e.target.value) })}
          />

          {form.recurrence.type === 'weekly' && (
            <div>
              {days.map((d, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => toggleDay(i)}
                  style={{
                    margin: 2,
                    background: form.recurrence.daysOfWeek.includes(i) ? 'black' : 'white',
                    color: form.recurrence.daysOfWeek.includes(i) ? 'white' : 'black',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          )}

          {form.recurrence.type === 'monthly' && (
            <input
              type="number"
              min={1}
              max={31}
              placeholder="Day of month"
              value={form.recurrence.dayOfMonth || ''}
              onChange={(e) => updateRecurrence({ dayOfMonth: Number(e.target.value) })}
            />
          )}

          <div>
            <label>Start</label>
            <input
              type="date"
              value={form.recurrence.startDate}
              onChange={(e) => updateRecurrence({ startDate: e.target.value })}
            />
          </div>

          <div>
            <label>End</label>
            <input
              type="date"
              value={form.recurrence.endDate || ''}
              onChange={(e) => updateRecurrence({ endDate: e.target.value })}
            />
          </div>
        </div>
      )}

      <button type="submit">Create</button>
    </form>
  );
}

export default TaskForm;
