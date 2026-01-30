import { useState } from 'react';
import { DashboardFilters } from './DashboardFilters';
import { ProductivityChart } from './widgets/ProductivityChart';
import { TodoStatusChart } from './widgets/StatusChart';
import TodoByDateChart from './widgets/TodoByDateChart';
import { TodoPriorityChart } from './widgets/TodoPriorityChart';
import { getFirstDayOfMonth, getLastDayOfMonth } from '../utils/date';

export default function DashboardPage() {
  // const [filters, setFilters] = useState({
  //   from: '2026-01-01',
  //   to: '2026-01-31',
  // });
  const [filters, setFilters] = useState({
    from: getFirstDayOfMonth(),
    to: getLastDayOfMonth(),
  });

  // console.log(filters.to);
  return (
    <div>
      <h1>Аналитика задач</h1>
      <p>Обзор выполнения задач за период</p>
      <DashboardFilters value={filters} onChange={setFilters} />

      <TodoStatusChart endpoint="status" from={filters.from} to={filters.to} />
      {/* <TodoByDateChart filters={filters} /> */}
      <TodoPriorityChart endpoint="priority" from={filters.from} to={filters.to} />
      <ProductivityChart endpoint="productivity" from={filters.from} to={filters.to} />

      <TodoByDateChart endpoint="todosByDate" from={filters.from} to={filters.to} />
    </div>
  );
}
