import { Capacitor } from '@capacitor/core';
import type { Entry, Settings } from '@/domain/types';

export const STORAGE_KEY = 'hush.v1';
export const STORAGE_VERSION = 1 as const;

export interface PersistedState {
  version: typeof STORAGE_VERSION;
  expenses: Entry[];
  incomes: Entry[];
  settings: Settings;
}

export interface StorageAdapter {
  read(): Promise<PersistedState | null>;
  write(state: PersistedState): Promise<void>;
}

const memoryFallback = new Map<string, string>();

function parseState(raw: string | null): PersistedState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PersistedState;
    if (parsed.version !== STORAGE_VERSION) return null;
    if (!Array.isArray(parsed.expenses) || !Array.isArray(parsed.incomes) || !parsed.settings) {
      return null;
    }
    const settings = parsed.settings;
    return {
      version: STORAGE_VERSION,
      expenses: parsed.expenses,
      incomes: parsed.incomes,
      settings: {
        ...settings,
        dailyReminder: settings.dailyReminder !== false,
        budgetAlerts: settings.budgetAlerts !== false,
        weeklySummary: settings.weeklySummary !== false,
      },
    };
  } catch {
    return null;
  }
}

const webAdapter: StorageAdapter = {
  async read() {
    try {
      return parseState(localStorage.getItem(STORAGE_KEY));
    } catch {
      return parseState(memoryFallback.get(STORAGE_KEY) ?? null);
    }
  },
  async write(state) {
    const raw = JSON.stringify(state);
    try {
      localStorage.setItem(STORAGE_KEY, raw);
    } catch {
      memoryFallback.set(STORAGE_KEY, raw);
    }
  },
};

const nativeAdapter: StorageAdapter = {
  async read() {
    const { Preferences } = await import('@capacitor/preferences');
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    return parseState(value ?? null);
  },
  async write(state) {
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(state) });
  },
};

export function createStorage(): StorageAdapter {
  return Capacitor.isNativePlatform() ? nativeAdapter : webAdapter;
}
