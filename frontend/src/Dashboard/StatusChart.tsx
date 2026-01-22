import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useStatData } from '../hooks/useStatData';

import './style.css';
// import { useEffect, useState } from 'react';
// import { fetchStats } from '../api/api';

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

  // const [statusData, setStatusData] = useState<{ completed: boolean; count: string }[]>();

  // useEffect(() => {
  //   async function load() {
  //     try {
  //       const fromStr = from.toLocaleDateString('en-CA');
  //       const toStr = (to ?? from).toLocaleDateString('en-CA');
  //       const data = await fetchStats('status', {
  //         from: fromStr,
  //         to: toStr,
  //       });

  //       setStatusData(data as { completed: boolean; count: string }[]);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }

  //   load();
  // }, [from, to]);

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

  // if (status) {
  //   // console.log(status.length)
  //   // console.log(status)
  //   const done = Number(status[1]?.count);
  //   const active = Number(status[0]?.count ?? 0);

  // }

  // if (!from) return null;

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
