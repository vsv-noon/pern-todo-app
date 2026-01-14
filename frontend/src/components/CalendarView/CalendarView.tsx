import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import type { CalendarProps } from './types';
import './style.css';
import { formatDate } from '../../utils/date';

export function CalendarView({
  onSelect,

  // selectedDate,
  counts,
}: CalendarProps) {
  return (
    <Calendar
      // value={new Date(selectedDate)}
      onClickDay={onSelect}
      tileContent={({ date, view }) => {
        if (view !== 'month') return null;

        const key = formatDate(date);
        const count = counts[key];

        if (!count) return null;

        return <span className="todo-badge">{count}</span>;
      }}
    />
  );
}
