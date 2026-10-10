import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { dayLabel, toISODate } from '@/domain/dates';
import { currentStreak } from '@/domain/streak';
import { budgetsAfterClearing, stepBudget, withoutDate, zeroBudgets } from '@/domain/ledger';
import type { Entry, Settings, Toast } from '@/domain/types';
import { applyAppearance } from '@/ui/appearance';
import { buildSeed } from './seed';
import { createStorage, type PersistedState, type StorageAdapter } from './storage';

interface AppState extends PersistedState {
  ready: boolean;
  toast: Toast | null;
}

type Action =
  | { type: 'hydrate'; state: PersistedState }
  | { type: 'add'; entry: Entry }
  | { type: 'update'; entry: Entry }
  | { type: 'remove'; id: number }
  | { type: 'restore'; entry: Entry }
  | { type: 'settings'; patch: Partial<Settings> }
  | { type: 'budget'; category: string; amount: number }
  | { type: 'toast'; toast: Toast | null }
  | { type: 'ledger'; expenses: Entry[]; incomes: Entry[]; budgets?: Record<string, number> };

export interface Store {
  ready: boolean;
  expenses: Entry[];
  incomes: Entry[];
  settings: Settings;
  toast: Toast | null;
  saveEntry: (draft: Omit<Entry, 'id'>, existing?: Entry) => void;
  deleteEntry: (entry: Entry) => void;
  undoDelete: () => void;
  dismissToast: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  changeBudget: (category: string, delta: number) => void;
  notify: (message: string) => void;
  clearLedger: () => void;
  resetDate: (iso: string) => void;
}

const StoreContext = createContext<Store | null>(null);

function listFor(state: AppState, type: Entry['type']): Entry[] {
  return type === 'income' ? state.incomes : state.expenses;
}

function writeList(state: AppState, type: Entry['type'], list: Entry[]): AppState {
  return type === 'income' ? { ...state, incomes: list } : { ...state, expenses: list };
}

function sortEntries(list: Entry[]): Entry[] {
  return [...list].sort((a, b) => (a.date === b.date ? b.id - a.id : a.date < b.date ? 1 : -1));
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.state, ready: true };
    case 'add':
      return writeList(state, action.entry.type, sortEntries([action.entry, ...listFor(state, action.entry.type)]));
    case 'update':
      return writeList(
        state,
        action.entry.type,
        sortEntries(listFor(state, action.entry.type).map((row) => (row.id === action.entry.id ? action.entry : row))),
      );
    case 'remove':
      return {
        ...state,
        expenses: state.expenses.filter((row) => row.id !== action.id),
        incomes: state.incomes.filter((row) => row.id !== action.id),
      };
    case 'restore':
      return writeList(state, action.entry.type, sortEntries([action.entry, ...listFor(state, action.entry.type)]));
    case 'settings':
      return { ...state, settings: { ...state.settings, ...action.patch } };
    case 'budget':
      return {
        ...state,
        settings: {
          ...state.settings,
          budgets: { ...state.settings.budgets, [action.category]: action.amount },
        },
      };
    case 'toast':
      return { ...state, toast: action.toast };
    case 'ledger':
      return {
        ...state,
        expenses: action.expenses,
        incomes: action.incomes,
        settings: action.budgets ? { ...state.settings, budgets: action.budgets } : state.settings,
      };
    default:
      return state;
  }
}

const empty = buildSeed();

export function StoreProvider({
  children,
  storage = createStorage(),
}: {
  children: ReactNode;
  storage?: StorageAdapter;
}) {
  const [state, dispatch] = useReducer(reducer, {
    ...empty,
    expenses: [],
    incomes: [],
    ready: false,
    toast: null,
  });
  const toastTimer = useRef<number>(0);
  const persistable = useRef<PersistedState>(empty);

  persistable.current = {
    version: state.version,
    expenses: state.expenses,
    incomes: state.incomes,
    settings: state.settings,
  };

  useEffect(() => {
    let cancelled = false;
    storage.read().then((saved) => {
      if (cancelled) return;
      const next = saved ?? buildSeed();
      applyAppearance(next.settings.appearance);
      dispatch({ type: 'hydrate', state: next });
      if (!saved) void storage.write(next);
    });
    return () => {
      cancelled = true;
    };
  }, [storage]);

  useEffect(() => {
    if (!state.ready) return;
    applyAppearance(state.settings.appearance);
    void storage.write(persistable.current);
  }, [state.ready, state.expenses, state.incomes, state.settings, storage]);

  const showToast = useCallback((toast: Toast) => {
    dispatch({ type: 'toast', toast });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => dispatch({ type: 'toast', toast: null }), 3500);
  }, []);

  const saveEntry = useCallback(
    (draft: Omit<Entry, 'id'>, existing?: Entry) => {
      if (existing) {
        dispatch({ type: 'update', entry: { ...existing, ...draft, id: existing.id } });
        showToast({ message: draft.type === 'income' ? 'Income updated' : 'Expense updated' });
        return;
      }

      const entry = { ...draft, id: Date.now() };
      dispatch({ type: 'add', entry });

      if (entry.type === 'income') {
        showToast({ message: 'Income added' });
        return;
      }

      const nextDates = [entry.date, ...state.expenses.map((row) => row.date)];
      const previous = currentStreak(state.expenses.map((row) => row.date));
      const next = currentStreak(nextDates);
      showToast({
        message:
          entry.date === toISODate() && next > previous
            ? `${next}-day streak! Keep it going.`
            : 'Expense added',
      });
    },
    [showToast, state.expenses],
  );

  const deleteEntry = useCallback(
    (entry: Entry) => {
      dispatch({ type: 'remove', id: entry.id });
      showToast({
        message: entry.type === 'income' ? 'Income deleted' : 'Expense deleted',
        undo: entry,
      });
    },
    [showToast],
  );

  const undoDelete = useCallback(() => {
    if (!state.toast?.undo) return;
    dispatch({ type: 'restore', entry: state.toast.undo });
    dispatch({ type: 'toast', toast: null });
    window.clearTimeout(toastTimer.current);
  }, [state.toast]);

  const dismissToast = useCallback(() => dispatch({ type: 'toast', toast: null }), []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    dispatch({ type: 'settings', patch });
  }, []);

  const notify = useCallback((message: string) => {
    showToast({ message });
  }, [showToast]);

  const clearLedger = useCallback(() => {
    dispatch({
      type: 'ledger',
      expenses: [],
      incomes: [],
      budgets: zeroBudgets(state.settings.budgets),
    });
    showToast({ message: 'All money data deleted' });
  }, [showToast, state.settings.budgets]);

  const resetDate = useCallback(
    (iso: string) => {
      const expenses = withoutDate(state.expenses, iso);
      const incomes = withoutDate(state.incomes, iso);
      dispatch({
        type: 'ledger',
        expenses,
        incomes,
        budgets: budgetsAfterClearing(expenses, state.settings.budgets),
      });
      showToast({ message: `${dayLabel(iso)} reset` });
    },
    [showToast, state.expenses, state.incomes, state.settings.budgets],
  );

  const changeBudget = useCallback(
    (category: string, delta: number) => {
      const current = state.settings.budgets[category] ?? 500;
      dispatch({ type: 'budget', category, amount: stepBudget(current, delta) });
    },
    [state.settings.budgets],
  );

  const value = useMemo<Store>(
    () => ({
      ready: state.ready,
      expenses: state.expenses,
      incomes: state.incomes,
      settings: state.settings,
      toast: state.toast,
      saveEntry,
      deleteEntry,
      undoDelete,
      dismissToast,
      updateSettings,
      changeBudget,
      notify,
      clearLedger,
      resetDate,
    }),
    [
      state.ready,
      state.expenses,
      state.incomes,
      state.settings,
      state.toast,
      saveEntry,
      deleteEntry,
      undoDelete,
      dismissToast,
      updateSettings,
      changeBudget,
      notify,
      clearLedger,
      resetDate,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}
