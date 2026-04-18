import Calendar from 'react-calendar';
import type { CalendarProps } from 'react-calendar/src/Calendar.js';
import 'react-calendar/dist/Calendar.css';
import type { CalendarViewProps } from './types';
import './style.css';

// import { LAST_INDEX } from './constants';
import { useState } from 'react';
import { formattedDate } from '../../utils/date';

export function CalendarView({
  onSelect,

  // selectedDate,
  counts,
  // dateRange,
  setDateRange,
}: CalendarViewProps) {
  const [selectRange, setSelectRange] = useState<boolean>(false);

  return (
    <div className="calendar">
      <div className="select-range-checkbox">
        <label htmlFor="range-checkbox">Select Range</label>
        <input
          id="range-checkbox"
          type="checkbox"
          checked={selectRange}
          onChange={() => setSelectRange(!selectRange)}
        />
      </div>
      <Calendar
        // value={new Date(selectedDate)}
        selectRange={selectRange}
        onChange={setDateRange as CalendarProps['onChange']}
        onClickDay={onSelect}
        tileContent={({ date, view }) => {
          if (view !== 'month') return null;

          const key = formattedDate(date);
          // const key = date.toLocaleDateString('en-CA');
          const count = counts[key];

          if (!count) return null;

          return <span className="todo-badge">{count}</span>;
        }}
      />
    </div>
  );
}
