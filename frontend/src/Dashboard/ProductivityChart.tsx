import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStatData } from '../hooks/useStatData';

export function ProductivityChart({
  endpoint,
  from,
  to,
}: {
  endpoint: string;
  from: Date;
  to: Date;
}) {
  const productivity = useStatData(endpoint, from, to);

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
