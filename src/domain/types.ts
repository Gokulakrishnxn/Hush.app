export type EntryType = 'expense' | 'income';

export type Appearance = 'system' | 'light' | 'dark';

export interface Entry {
  id: number;
  type: EntryType;
  amount: number;
  category: string;
  title: string;
  date: string;
}

export interface Settings {
  name: string;
  budgets: Record<string, number>;
  savingsGoal: number;
  appearance: Appearance;
  hideAmounts: boolean;
  dailyReminder: boolean;
  budgetAlerts: boolean;
  weeklySummary: boolean;
}

export interface Toast {
  message: string;
  undo?: Entry;
}

export type Tab = 'home' | 'analytics' | 'budget' | 'profile';

export interface PeriodPoint {
  key: string;
  amount: number;
}

export interface CategoryTotal {
  category: string;
  amount: number;
}

export interface MonthSnapshot {
  spent: number;
  income: number;
  balance: number;
  budget: number;
  left: number;
  today: number;
  projected: number;
  safePerDay: number;
  daysLeft: number;
  budgetUsedPct: number;
}
