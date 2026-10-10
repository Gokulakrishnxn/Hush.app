import { describe, expect, it } from 'vitest';
import {
  budgetsAfterClearing,
  mergeFeed,
  monthSnapshot,
  searchFeed,
  stepBudget,
  withoutDate,
  zeroBudgets,
} from './ledger';
import type { Entry } from './types';

const expense = (partial: Partial<Entry> & Pick<Entry, 'id' | 'amount' | 'date'>): Entry => ({
  type: 'expense',
  category: 'Food',
  title: 'Coffee',
  ...partial,
});

describe('monthSnapshot', () => {
  it('sums the current month and ignores other months', () => {
    const now = new Date(2026, 9, 10);
    const snap = monthSnapshot(
      [
        expense({ id: 1, amount: 180, date: '2026-10-10' }),
        expense({ id: 2, amount: 500, date: '2026-09-30' }),
      ],
      [{ id: 3, type: 'income', amount: 65000, category: 'Salary', title: 'Salary', date: '2026-10-05' }],
      { Food: 5000 },
      now,
    );

    expect(snap.spent).toBe(180);
    expect(snap.income).toBe(65000);
    expect(snap.today).toBe(180);
    expect(snap.left).toBe(4820);
  });
});

describe('mergeFeed', () => {
  it('puts the newest date first', () => {
    const feed = mergeFeed(
      [expense({ id: 1, amount: 10, date: '2026-10-08' })],
      [{ id: 2, type: 'income', amount: 20, category: 'Salary', title: 'Pay', date: '2026-10-10' }],
    );
    expect(feed.map((row) => row.id)).toEqual([2, 1]);
  });
});

describe('searchFeed', () => {
  it('matches title or category', () => {
    const rows = [
      expense({ id: 1, amount: 10, date: '2026-10-10', title: 'Filter coffee', category: 'Food' }),
    ];
    expect(searchFeed(rows, 'coffee')).toHaveLength(1);
    expect(searchFeed(rows, 'travel')).toHaveLength(0);
  });
});

describe('stepBudget', () => {
  it('never drops below 500', () => {
    expect(stepBudget(500, -500)).toBe(500);
    expect(stepBudget(1000, 500)).toBe(1500);
  });
});

describe('withoutDate', () => {
  it('clears only that calendar day', () => {
    const rows = [
      expense({ id: 1, amount: 10, date: '2026-10-10' }),
      expense({ id: 2, amount: 20, date: '2026-10-09' }),
    ];
    expect(withoutDate(rows, '2026-10-10').map((row) => row.id)).toEqual([2]);
  });
});

describe('budgetsAfterClearing', () => {
  const budgets = { Food: 5000, Rent: 14000 };

  it('keeps limits when the month still has spend', () => {
    const remaining = [expense({ id: 2, amount: 20, date: '2026-10-09' })];
    expect(budgetsAfterClearing(remaining, budgets, new Date(2026, 9, 10))).toBe(budgets);
  });

  it('zeros leftover budget when the month is empty', () => {
    expect(budgetsAfterClearing([], budgets, new Date(2026, 9, 10))).toEqual({ Food: 0, Rent: 0 });
    const snap = monthSnapshot([], [], zeroBudgets(budgets), new Date(2026, 9, 10));
    expect(snap.left).toBe(0);
    expect(snap.safePerDay).toBe(0);
  });
});
