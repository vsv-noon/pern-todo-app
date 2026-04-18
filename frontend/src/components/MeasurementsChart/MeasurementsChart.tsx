import { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api/api';
import {
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import './style.css';

export interface ApiResponse {
  target: string;
  result: number[];
}

type MeasurementPoint = {
  date: string;
  value: number;
};

type Target = {
  target_value: number;
};

type AnalyticsResponse = {
  target: Target | null;
  result: Record<string, MeasurementPoint[]>;
};

type ChartDataPoint = {
  date: number;
  [key: string]: string | number | undefined;
};

const chartConfig = {
  'blood_pressure_systolic,blood_pressure_diastolic,pulse': [
    { key: 'blood_pressure_systolic', color: '#ff4d4f', name: 'Systolic' },
    { key: 'blood_pressure_diastolic', color: '#1890ff', name: 'Diastolic' },
    { key: 'pulse', color: '#52c41a', name: 'Pulse' },
  ],
  weight: [{ key: 'weight', color: '#722ed1', name: 'Weight' }],
  chest: [{ key: 'chest', color: '#722ed1', name: 'Chest' }],
  waist: [{ key: 'waist', color: '#722ed1', name: 'Waist' }],
  abdominal: [{ key: 'abdominal', color: '#722ed1', name: 'Abdominal' }],
  hips: [{ key: 'hips', color: '#722ed1', name: 'Hips' }],
};

const measurementType = [
  {
    label: 'Blood Pressure',
    value: 'blood_pressure_systolic,blood_pressure_diastolic,pulse',
  },
  { label: 'Weight', value: 'weight' },
  { label: 'Chest', value: 'chest' },
  { label: 'Waist', value: 'waist' },
  { label: 'Abdominal', value: 'abdominal' },
  { label: 'Hips', value: 'hips' },
];

function MeasurementsChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [targetValue, setTargetValue] = useState<Target | null>(null);
  const [selectorType, setSelectorType] = useState<string>('weight');

  const from = '2009-01-01';
  const to = '2027-01-01';

  const lines = chartConfig[selectorType as keyof typeof chartConfig] || [];

  useEffect(() => {
    async function load() {
      const { target, result } = await apiFetch<AnalyticsResponse>(
        `/measurements/analytics?types=${selectorType}&from=${from}&to=${to}`,
      );

      const map: Record<string, ChartDataPoint> = {};

      for (const typeKey in result) {
        result[typeKey].forEach((point) => {
          if (!map[point.date]) {
            map[point.date] = { date: new Date(point.date).getTime() };
          }

          map[point.date][typeKey] = point.value;
        });
      }

      setData(Object.values(map));
      setTargetValue(target);
    }
    load();
  }, [selectorType]);

  function customChartFormatter(item: Date) {
    return new Date(item).toLocaleString('en-CA', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  return (
    <div className="rechartContainer">
      <h4>Measurements chart</h4>

      <select
        className="rechartsSelector"
        value={selectorType}
        onChange={(e) => setSelectorType(e.target.value)}
      >
        {measurementType.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis
            type="number"
            scale="time"
            dataKey="date"
            domain={['auto', 'auto']}
            tickFormatter={customChartFormatter}
            padding={{ left: 0, right: 10 }}
          />
          <YAxis type="number" domain={['dataMin - 5', 'dataMax + 5']} />

          <Tooltip labelFormatter={(label) => customChartFormatter(label)} itemSorter={() => 1} />

          <Legend />
          {lines.map((line, i) => (
            <Line
              key={i}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              name={line.name}
              // dot={false}
            />
          ))}

          {targetValue && (
            <ReferenceLine y={targetValue.target_value} stroke="red" strokeDasharray="3 3">
              <Label value={targetValue.target_value} position="bottom" />
            </ReferenceLine>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MeasurementsChart;
