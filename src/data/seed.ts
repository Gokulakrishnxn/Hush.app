import { DEFAULT_BUDGETS } from '@/domain/categories';
import type { Settings } from '@/domain/types';
import type { PersistedState } from './storage';
import { STORAGE_VERSION } from './storage';

export function defaultSettings(): Settings {
  return {
    name: '',
    budgets: Object.fromEntries(Object.keys(DEFAULT_BUDGETS).map((key) => [key, 0])),
    savingsGoal: 50_000,
    appearance: 'system',
    hideAmounts: false,
    dailyReminder: true,
    budgetAlerts: true,
    weeklySummary: true,
  };
}

export function buildSeed(): PersistedState {
  return {
    version: STORAGE_VERSION,
    expenses: [],
    incomes: [],
    settings: defaultSettings(),
  };
}
