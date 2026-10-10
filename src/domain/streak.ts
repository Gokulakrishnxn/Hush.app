import { addDays, calendarDaysBetween, toISODate } from './dates';

const MILESTONES = [3, 7, 14, 30, 60, 100];

export function uniqueDates(dates: string[]): Set<string> {
  return new Set(dates);
}

export function currentStreak(expenseDates: string[], today = toISODate()): number {
  const logged = uniqueDates(expenseDates);
  let cursor = logged.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (logged.has(cursor)) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

export function bestStreak(expenseDates: string[]): number {
  const days = [...uniqueDates(expenseDates)].sort();
  if (days.length === 0) return 0;
  let best = 0;
  let run = 0;
  let previous: string | null = null;
  for (const day of days) {
    run = previous && calendarDaysBetween(previous, day) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    previous = day;
  }
  return best;
}

export function nextMilestone(streak: number): number {
  return MILESTONES.find((mark) => mark > streak) ?? streak + 30;
}

export function weekDots(expenseDates: string[], today = toISODate()) {
  const logged = uniqueDates(expenseDates);
  return [6, 5, 4, 3, 2, 1, 0].map((offset) => {
    const date = addDays(today, -offset);
    return {
      date,
      offset,
      on: logged.has(date),
      letter: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(
        Number(date.slice(0, 4)),
        Number(date.slice(5, 7)) - 1,
        Number(date.slice(8, 10)),
      ).getDay()],
    };
  });
}
