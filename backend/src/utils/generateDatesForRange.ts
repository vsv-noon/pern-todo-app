export function generateDatesForRange(recurrence: any, start: Date, end: Date): Date[] {
  const dates: Date[] = [];

  const current = new Date(start) < new Date() ? new Date() : new Date(start);

  while (current <= end) {
    const day = current.getDay();
    const date = current.getDate();

    if (recurrence.type === 'daily') {
      dates.push(new Date(current));
    }

    if (recurrence.type === 'weekly' && recurrence.days_of_week?.includes(day)) {
      dates.push(new Date(current));
    }

    if (recurrence.type === 'monthly' && recurrence.day_of_month === date) {
      dates.push(new Date(current));
    }

    current.setDate(current.getDate() + 1);
  }

  return dates;
}
