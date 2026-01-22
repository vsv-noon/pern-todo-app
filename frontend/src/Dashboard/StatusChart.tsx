import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useStatData } from '../hooks/useStatData';

import './style.css';

export type ChartData = {
  name: string;
  value: number;
};

export type StatusChartProps = {
  endpoint: string;
  from: Date;
  to: Date;
};

const COLORS = ['#00C49F', '#FF8042'];

export function TodoStatusChart({ endpoint, from, to }: StatusChartProps) {
  const statusData = useStatData(endpoint, from, to);

  let done: number = 0;
  let active: number = 0;
  let chartData: ChartData[] = [];

  if (statusData) {
    (statusData as { completed: boolean; count: string }[]).map((el) => {
      if (el.completed === true) {
        done = Number(el.count);
      } else {
        active = Number(el.count);
      }
    });
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
