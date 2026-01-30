import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStatData } from '../../hooks/useStatData';

import './style.css';

export default function TodoByDateChart({
  endpoint,
  from,
  to,
}: {
  endpoint: string;
  from: string;
  to: string;
}) {
  const data = useStatData(endpoint, from, to);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
