import { addDays, isInYear, lastNDays, weekdayLetter } from './dates';
import { sumAmounts, totalsByCategory } from './ledger';
import { EXPENSE_CATEGORIES } from './categories';
import type { CategoryTotal, Entry, PeriodPoint } from './types';

export type AnalyticsMode = 'Week' | 'Month';

export function periodBars(expenses: readonly Entry[], mode: AnalyticsMode, endISO: string): PeriodPoint[] {
  if (mode === 'Week') {
    return lastNDays(endISO, 7).map((date) => ({
      key: weekdayLetter(date),
      amount: sumAmounts(expenses.filter((entry) => entry.date === date)),
    }));
  }

  return [3, 2, 1, 0].map((week) => {
    const weekEnd = addDays(endISO, -(week * 7));
    const weekStart = addDays(weekEnd, -6);
    return {
      key: `W${4 - week}`,
      amount: sumAmounts(
        expenses.filter((entry) => entry.date >= weekStart && entry.date <= weekEnd),
      ),
    };
  });
}

export function periodWindow(mode: AnalyticsMode): number {
  return mode === 'Week' ? 7 : 28;
}

export function inWindow(entries: readonly Entry[], endISO: string, days: number): Entry[] {
  const start = addDays(endISO, -(days - 1));
  return entries.filter((entry) => entry.date >= start && entry.date <= endISO);
}

export function periodSplit(expenses: readonly Entry[]): CategoryTotal[] {
  return totalsByCategory(expenses, EXPENSE_CATEGORIES).filter((row) => row.amount > 0);
}

export function yearSeries(expenses: readonly Entry[], incomes: readonly Entry[], year: number) {
  const months = Array.from({ length: 12 }, (_, month) => ({
    month,
    expenses: 0,
    income: 0,
  }));

  for (const entry of expenses) {
    if (!isInYear(entry.date, year)) continue;
    months[Number(entry.date.slice(5, 7)) - 1].expenses += entry.amount;
  }
  for (const entry of incomes) {
    if (!isInYear(entry.date, year)) continue;
    months[Number(entry.date.slice(5, 7)) - 1].income += entry.amount;
  }

  return months;
}

export const MONTH_LETTERS = 'JFMAMJJASOND';
