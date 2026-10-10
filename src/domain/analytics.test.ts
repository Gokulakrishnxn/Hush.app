import { describe, expect, it } from 'vitest';
import { periodBarRange, periodBars, periodWindow } from './analytics';
import { addDays } from './dates';
import type { Entry } from './types';

function expense(date: string, amount: number, id = amount): Entry {
  return { id, type: 'expense', amount, category: 'Food', title: 'Test', date };
}

describe('periodBars', () => {
  it('builds one bar per day in the last 7 days', () => {
    const end = '2026-10-10';
    const bars = periodBars(
      [expense('2026-10-10', 180), expense('2026-10-08', 640), expense('2026-09-01', 9999)],
      'Week',
      end,
    );
    expect(bars).toHaveLength(7);
    expect(bars[0]?.key).toBe('S');
    expect(bars.at(-1)?.amount).toBe(180);
    expect(bars[4]?.amount).toBe(640);
    expect(bars.every((bar) => bar.amount === 180 || bar.amount === 640 || bar.amount === 0)).toBe(true);
  });

  it('keeps empty days at zero instead of inventing spend', () => {
    const bars = periodBars([expense('2026-10-10', 100)], 'Week', '2026-10-10');
    expect(bars.filter((bar) => bar.amount === 0)).toHaveLength(6);
  });

  it('splits a month into four weeks ending on the selected day', () => {
    const end = '2026-10-10';
    const bars = periodBars(
      [expense(addDays(end, -2), 500), expense(addDays(end, -10), 200), expense(addDays(end, -20), 50)],
      'Month',
      end,
    );
    expect(bars.map((bar) => bar.key)).toEqual(['W1', 'W2', 'W3', 'W4']);
    expect(periodWindow('Month')).toBe(28);
    expect(bars[3]?.amount).toBe(500);
    expect(bars[2]?.amount).toBe(200);
    expect(bars[1]?.amount).toBe(50);
    expect(bars[0]?.amount).toBe(0);
  });
});

describe('periodBarRange', () => {
  it('returns the calendar day for a week bar', () => {
    expect(periodBarRange('Week', '2026-10-10', 6)).toEqual({ start: '2026-10-10', end: '2026-10-10' });
  });
});
