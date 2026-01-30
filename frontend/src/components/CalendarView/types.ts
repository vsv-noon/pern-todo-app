// import type { Value } from "react-calendar/dist/shared/types.js";

// type CalendarValue = Date | [Date, Date];

export type CalendarViewProps = {
  // selectedDate: string | null;
  // dateRange: Date[];
  onSelect: (date: Date) => void;
  counts: Record<string, number>;
  // setDateRange: () => void;
  // setDateRange: Dispatch<SetStateAction<[Date, Date]>>
  // setDateRange: (value: Value, event: MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  setDateRange: (value: Date) => void;
};
