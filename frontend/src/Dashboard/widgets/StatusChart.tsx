import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useStatData } from '../../hooks/useStatData';

import './style.css';

export type ChartData = {
  name: string;
  value: number;
};

export type StatusChartProps = {
  endpoint: string;
  from: string;
  to: string;
};

const COLORS = ['#00C49F', '#FF8042'];

export function TodoStatusChart({ endpoint, from, to }: StatusChartProps) {
  const statusData = useStatData(endpoint, from, to);

  const data = statusData?.map((item) => ({
    name: item.completed === true ? 'completed' : 'active',
    value: Number(item.count),
  }));

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={90} label>
            {data?.map((_, i) => (
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
