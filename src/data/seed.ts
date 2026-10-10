import { DEFAULT_BUDGETS } from '@/domain/categories';
import { daysAgoISO } from '@/domain/dates';
import type { Entry, Settings } from '@/domain/types';
import type { PersistedState } from './storage';
import { STORAGE_VERSION } from './storage';

const EXPENSE_SEED: Array<[number, string, string, number]> = [
  [0, 'Filter coffee', 'Food', 180],
  [0, 'Metro card recharge', 'Transport', 60],
  [0, 'Groceries', 'Groceries', 640],
  [1, 'Dinner with Arjun', 'Food', 1450],
  [1, 'Auto home', 'Transport', 320],
  [2, 'Pharmacy', 'Health', 460],
  [2, 'Kurta', 'Shopping', 1299],
  [3, 'Movie tickets', 'Fun', 540],
  [3, 'Weekly groceries', 'Groceries', 1850],
  [4, 'Lunch', 'Food', 290],
  [4, 'Stationery', 'Other', 350],
  [5, 'Broadband bill', 'Bills', 799],
  [5, 'Mutual fund SIP', 'Invest', 3000],
  [6, 'Gym membership', 'Health', 1500],
  [8, 'Online course', 'Education', 499],
  [8, 'Books', 'Fun', 650],
  [9, 'Home loan EMI', 'EMI', 7500],
  [10, 'Weekly groceries', 'Groceries', 2100],
  [9, 'House rent', 'Rent', 12000],
  [12, 'Petrol', 'Transport', 1200],
];

const INCOME_SEED: Array<[number, string, string, number]> = [
  [5, 'Monthly salary', 'Salary', 65000],
  [9, 'Website project', 'Freelance', 12000],
  [2, 'Savings interest', 'Interest', 860],
  [7, 'Mutual fund dividend', 'Investment', 2400],
];

export function defaultSettings(): Settings {
  return {
    name: 'Gokulakrishnan',
    budgets: { ...DEFAULT_BUDGETS },
    savingsGoal: 50_000,
    appearance: 'system',
    hideAmounts: false,
    dailyReminder: true,
    budgetAlerts: true,
    weeklySummary: true,
  };
}

export function buildSeed(now = new Date()): PersistedState {
  const expenses: Entry[] = EXPENSE_SEED.map(([days, title, category, amount], index) => ({
    id: index + 1,
    type: 'expense',
    title,
    category,
    amount,
    date: daysAgoISO(days, now),
  }));

  const incomes: Entry[] = INCOME_SEED.map(([days, title, category, amount], index) => ({
    id: 1000 + index,
    type: 'income',
    title,
    category,
    amount,
    date: daysAgoISO(days, now),
  }));

  return {
    version: STORAGE_VERSION,
    expenses,
    incomes,
    settings: defaultSettings(),
    accounts: [],
    session: null,
  };
}
