import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import type { Todo } from '../types/todo';

export function TodoPriorityChart({ todos }: { todos: Todo[] }) {
  const data = ['low', 'medium', 'high'].map((p) => ({
    priority: p,
    count: todos.filter((t) => t.priority === p).length,
  }));

  return (
    <div className="chart-container">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey={'priority'} />
          <XAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
