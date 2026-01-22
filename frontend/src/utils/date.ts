export function formatDate(date: Date): string {
  // return date.toISOString().split("T")[0];
  // return date.toLocaleDateString('en-CA');

  const now = new Date(date);
  const timezoneOffsetMs = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - timezoneOffsetMs);
  return localDate.toISOString();
}

export function correctTimezone(date: Date): Date {
  const now = new Date(date);
  const timezoneOffsetMs = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - timezoneOffsetMs);
  return localDate;
}

export function formattedDate(d: Date, s: number) {
  return correctTimezone(d).toISOString().slice(0, s);
}

export function getFirstDayOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getLastDayOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
