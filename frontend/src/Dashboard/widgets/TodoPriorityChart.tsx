import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useStatData } from '../../hooks/useStatData';

export function TodoPriorityChart({
  endpoint,
  from,
  to,
}: {
  endpoint: string;
  from: string;
  to: string;
}) {
  const pr = useStatData(endpoint, from, to);

  const barColors = ['#1f77b4', '#ff7f0e', '#2ca02c'];

  return (
    <div className="chart-container">
      <ResponsiveContainer width="80%" height={300}>
        <BarChart responsive data={pr} style={{ height: '40vh', aspectRatio: 1.5 }}>
          <XAxis dataKey={'priority'} />

          <Bar
            dataKey="count"
            label={{ position: 'top', fill: 'black' }}
            // barSize={50}
            // style={{ height: '90vh' }}
          >
            {pr?.map((_, index) => (
              <Cell key={index} fill={barColors[index % 20]} />
            ))}
          </Bar>
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
