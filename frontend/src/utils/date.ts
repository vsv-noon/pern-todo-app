export function formatDate(date: Date): string {
  // return date.toISOString().split("T")[0];
  // return date.toLocaleDateString('en-CA');

  const now = new Date(date);
  const timezoneOffsetMs = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - timezoneOffsetMs);
  return localDate.toISOString();
}

// export function correctTimezone(date: Date): Date {
//   const now = new Date(date);
//   const timezoneOffsetMs = now.getTimezoneOffset() * 60000;
//   const localDate = new Date(now.getTime() - timezoneOffsetMs);
//   return localDate;
// }

// export function formattedDate(d: Date, s: number) {
//   return correctTimezone(d).toISOString().slice(0, s);
// }

export function formattedDate(d: Date) {
  return d.toLocaleDateString('en-CA');
}

export function getFirstDayOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-CA');
}

export function getLastDayOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-CA');
}

export function getSystemLocalFormat(date: Date) {
  const now = new Date(date);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
