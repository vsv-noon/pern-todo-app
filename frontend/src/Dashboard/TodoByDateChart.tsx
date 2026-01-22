import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchStats } from '../api/api';
import { useEffect, useState } from 'react';

import './style.css';

export default function TodoByDateChart({ from, to }: { from: Date; to: Date }) {
  const [todosByDate, setTodosByDate] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStats('todosByDate', {
          from: from.toLocaleDateString('en-CA'),
          to: to.toLocaleDateString('en-CA'),
        });

        setTodosByDate(data as { date: string; count: number }[]);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [from, to]);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={todosByDate}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
