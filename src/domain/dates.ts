const DAY_MS = 86_400_000;

export function toISODate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(iso: string, days: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function daysAgoISO(days: number, now = new Date()): string {
  return toISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - days));
}

export function calendarDaysBetween(from: string, to: string): number {
  return Math.round((parseISODate(to).getTime() - parseISODate(from).getTime()) / DAY_MS);
}

export function isInMonth(iso: string, ref = new Date()): boolean {
  const date = parseISODate(iso);
  return date.getMonth() === ref.getMonth() && date.getFullYear() === ref.getFullYear();
}

export function isInYear(iso: string, year: number): boolean {
  return parseISODate(iso).getFullYear() === year;
}

export function daysInMonth(now = new Date()): number {
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

export function daysLeftInMonth(now = new Date()): number {
  return Math.max(1, daysInMonth(now) - now.getDate() + 1);
}

export function dayLabel(iso: string, today = toISODate()): string {
  const diff = calendarDaysBetween(iso, today);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return parseISODate(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function shortDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function monthName(now = new Date()): string {
  return now.toLocaleString('en-IN', { month: 'long' });
}

export function monthYear(now = new Date()): string {
  return now.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
}

export function isSameCalendarMonth(a: Date, b = new Date()): boolean {
  return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

export function weekdayLetter(iso: string): string {
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][parseISODate(iso).getDay()];
}

export function greeting(now = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function lastNDays(endISO: string, count: number): string[] {
  return Array.from({ length: count }, (_, index) => addDays(endISO, -(count - 1 - index)));
}

export function clampPastISO(iso: string, today = toISODate()): string {
  return iso > today ? today : iso;
}

export function startOfMonthISO(ref = new Date()): string {
  return toISODate(new Date(ref.getFullYear(), ref.getMonth(), 1));
}

export function endOfMonthISO(ref = new Date()): string {
  return toISODate(new Date(ref.getFullYear(), ref.getMonth() + 1, 0));
}
