import type { FilterProps } from './types';

export function Filters({ search, status, onSearchChange, onStatusChange }: FilterProps) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}
