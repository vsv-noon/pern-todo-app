import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';
import { fetchStats } from '../api/api';

import './style.css';

export type ChartData = {
  name: string;
  value: number;
};

export type StatusChartProps = {
  from: Date;
  to: Date;
};

const COLORS = ['#00C49F', '#FF8042'];

export function TodoStatusChart({ from, to }: StatusChartProps) {
  const fromStr = from.toLocaleDateString('en-CA');
  const toStr = to.toLocaleDateString('en-CA') ?? fromStr;
  const [status, setStatus] = useState<{ completed: boolean; count: string }[]>();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStats('status', {
          from: fromStr,
          to: toStr,
        });

        setStatus(data as { completed: boolean; count: string }[]);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [fromStr, toStr]);

  let chartData: ChartData[] = [];

  if (status) {
    const done = Number(status[1].count);
    const active = Number(status[0].count);

    chartData = [
      { name: 'Completed', value: done },
      { name: 'Active', value: active },
    ];
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} dataKey="value" outerRadius={90} label>
            {chartData?.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
