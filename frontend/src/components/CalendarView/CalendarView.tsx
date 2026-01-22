import Calendar from 'react-calendar';
import type { CalendarProps } from 'react-calendar/src/Calendar.js';
import 'react-calendar/dist/Calendar.css';
import type { CalendarViewProps } from './types';
import './style.css';
import { formattedDate } from '../../utils/date';
import { LAST_INDEX } from './constants';
import { useState } from 'react';

export function CalendarView({
  onSelect,

  // selectedDate,
  counts,
  // dateRange,
  setDateRange,
}: CalendarViewProps) {
  const [selectRange, setSelectRange] = useState<boolean>(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={selectRange}
          onChange={() => setSelectRange(!selectRange)}
        />
        Select Range
      </label>
      <Calendar
        // value={new Date(selectedDate)}
        selectRange={selectRange}
        onChange={setDateRange as CalendarProps['onChange']}
        onClickDay={onSelect}
        tileContent={({ date, view }) => {
          if (view !== 'month') return null;

          const key = formattedDate(date, LAST_INDEX);
          const count = counts[key];

          if (!count) return null;

          return <span className="todo-badge">{count}</span>;
        }}
      />
    </>
  );
}
