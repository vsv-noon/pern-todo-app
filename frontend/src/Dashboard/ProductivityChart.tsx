import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchStats } from '../api/api';

export function ProductivityChart({ from, to }: { from: Date; to: Date }) {
  const [productivity, setProductivity] = useState<{ date: string; count: number }[]>();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStats('productivity', {
          from: from.toLocaleDateString('en-CA'),
          to: to.toLocaleDateString('en-CA'),
        });

        setProductivity(data as { date: string; count: number }[]);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [from, to]);

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={productivity}>
          <XAxis dataKey="date" />
          <YAxis label={{ value: '%', position: 'insideBottom' }} />
          <Line dataKey="productivity" />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
