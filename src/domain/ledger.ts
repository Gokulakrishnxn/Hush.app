import { daysInMonth, daysLeftInMonth, isInMonth, toISODate } from './dates';
import type { CategoryTotal, Entry, MonthSnapshot } from './types';

export function sumAmounts(entries: readonly Entry[]): number {
  return entries.reduce((total, entry) => total + entry.amount, 0);
}

export function inCalendarMonth(entries: readonly Entry[], ref = new Date()): Entry[] {
  return entries.filter((entry) => isInMonth(entry.date, ref));
}

export function totalBudget(budgets: Record<string, number>): number {
  return Object.values(budgets).reduce((total, value) => total + value, 0);
}

export function monthSnapshot(
  expenses: readonly Entry[],
  incomes: readonly Entry[],
  budgets: Record<string, number>,
  now = new Date(),
): MonthSnapshot {
  const monthExpenses = inCalendarMonth(expenses, now);
  const monthIncomes = inCalendarMonth(incomes, now);
  const spent = sumAmounts(monthExpenses);
  const income = sumAmounts(monthIncomes);
  const budget = Math.max(1, totalBudget(budgets));
  const left = totalBudget(budgets) - spent;
  const todayISO = toISODate(now);
  const today = sumAmounts(monthExpenses.filter((entry) => entry.date === todayISO));
  const projected = (spent / Math.max(1, now.getDate())) * daysInMonth(now);
  const daysLeft = daysLeftInMonth(now);

  return {
    spent,
    income,
    balance: income - spent,
    budget: totalBudget(budgets),
    left,
    today,
    projected,
    safePerDay: Math.max(0, left / daysLeft),
    daysLeft,
    budgetUsedPct: Math.min(100, (spent / budget) * 100),
  };
}

export function totalsByCategory(
  entries: readonly Entry[],
  categories: readonly string[],
): CategoryTotal[] {
  return categories
    .map((category) => ({
      category,
      amount: sumAmounts(entries.filter((entry) => entry.category === category)),
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function mergeFeed(expenses: readonly Entry[], incomes: readonly Entry[]): Entry[] {
  return [...expenses, ...incomes].sort((a, b) => {
    if (a.date === b.date) return b.id - a.id;
    return a.date < b.date ? 1 : -1;
  });
}

export function searchFeed(entries: readonly Entry[], query: string): Entry[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...entries];
  return entries.filter((entry) =>
    `${entry.title} ${entry.category}`.toLowerCase().includes(needle),
  );
}

export function stepBudget(current: number, delta: number, minimum = 500): number {
  return Math.max(minimum, current + delta);
}

export function stepGoal(current: number, delta: number, minimum = 5000): number {
  return Math.max(minimum, current + delta);
}

export function savedTowardGoal(expenses: readonly Entry[], incomes: readonly Entry[]): number {
  return Math.max(0, sumAmounts(incomes) - sumAmounts(expenses));
}

export function entriesOnDate(entries: readonly Entry[], iso: string): Entry[] {
  return entries.filter((entry) => entry.date === iso);
}

export function withoutDate(entries: readonly Entry[], iso: string): Entry[] {
  return entries.filter((entry) => entry.date !== iso);
}

export function zeroBudgets(budgets: Record<string, number>): Record<string, number> {
  return Object.fromEntries(Object.keys(budgets).map((key) => [key, 0]));
}

export function budgetsAfterClearing(
  remainingExpenses: readonly Entry[],
  budgets: Record<string, number>,
  now = new Date(),
): Record<string, number> {
  if (inCalendarMonth(remainingExpenses, now).length > 0) return budgets;
  return zeroBudgets(budgets);
}

export function activitySpan(entries: readonly Entry[]): { first?: string; last?: string } {
  if (!entries.length) return {};
  const dates = entries.map((entry) => entry.date).sort();
  return { first: dates[0], last: dates[dates.length - 1] };
}
