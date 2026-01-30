import { getFirstDayOfMonth, getLastDayOfMonth } from '../utils/date';

export interface DashboardFilters {
  from: string;
  to: string;
  status?: string;
  project?: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DatePoint {
  date: string;
  count: number;
}

interface DashboardProps {
  value: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
}

export function DashboardFilters({ value, onChange }: DashboardProps) {
  const resetValue = {
    from: getFirstDayOfMonth(),
    to: getLastDayOfMonth(),
    status: undefined,
  };

  return (
    <div>
      <div>
        <div>
          <label>from</label>
          <input
            type="date"
            value={value.from}
            onChange={(e) => onChange({ ...value, from: e.target.value })}
          />
        </div>
        <div>
          <label>to</label>
          <input
            type="date"
            value={value.to}
            onChange={(e) => {
              onChange({ ...value, to: e.target.value });
              // console.log(new Date(e.target.value))
            }}
          />
        </div>
        <div>
          <label>Status</label>
          <select value={value.status || ''} onChange={() => onChange(resetValue)}>
            <option value="">All</option>
            <option value="completed">Completed</option>
            <option value="active">Active</option>
            <option value="pending">In progress</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <button
          // onClick={() => onChange({ from: '2026-01-01', to: '2026-01-20', status: undefined })}
          onClick={() => onChange(resetValue)}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
