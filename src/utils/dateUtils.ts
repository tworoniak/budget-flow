/**
 * Parses a YYYY-MM-DD string as a local-time Date.
 * new Date("2026-05-01") is treated as UTC midnight, which rolls back one day
 * in negative-offset timezones. This function avoids that by using the Date
 * constructor with explicit year/month/day arguments (always local time).
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}
