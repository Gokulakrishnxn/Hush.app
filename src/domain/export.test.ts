import { describe, expect, it } from 'vitest';
import { daysAgoISO, toISODate } from './dates';
import {
  allTimeScope,
  buildExportCsv,
  entriesForScope,
  exportFileName,
  monthScope,
  periodCaption,
  rangeScope,
} from './export';
import type { Entry } from './types';

const now = new Date(2026, 9, 10);
const rows: Entry[] = [
  { id: 1, type: 'expense', amount: 180, category: 'Food', title: 'Filter coffee', date: toISODate(now) },
  { id: 2, type: 'income', amount: 65000, category: 'Salary', title: 'Pay, monthly', date: daysAgoISO(5, now) },
  { id: 3, type: 'expense', amount: 500, category: 'Food', title: 'Old', date: '2020-01-01' },
];

const expenses = rows.filter((row) => row.type === 'expense');
const incomes = rows.filter((row) => row.type === 'income');

describe('buildExportCsv', () => {
  it('writes a titled sheet with totals and escaped titles', () => {
    const csv = buildExportCsv(rows, allTimeScope(), now);
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('Hush');
    expect(csv).toContain('Currency,INR (Indian Rupee)');
    expect(csv).toContain('"Pay, monthly"');
    expect(csv).toContain('180.00');
    expect(csv).toContain('65000.00');
    expect(csv).toContain('Balance');
    expect(csv).toContain('All time');
  });

  it('writes the chosen date range into the sheet', () => {
    const csv = buildExportCsv(rows, rangeScope('2026-10-01', '2026-10-10'), now);
    expect(csv).toContain('1 Oct 2026 – 10 Oct 2026');
  });
});

describe('entriesForScope', () => {
  it('keeps only the chosen month', () => {
    const ids = entriesForScope(expenses, incomes, monthScope(now)).map((row) => row.id);
    expect(ids).toEqual([1, 2]);
  });

  it('keeps only rows inside a custom range', () => {
    const ids = entriesForScope(expenses, incomes, rangeScope('2026-10-10', '2026-10-10')).map((row) => row.id);
    expect(ids).toEqual([1]);
  });
});

describe('exportFileName', () => {
  it('names a month file after the year and month', () => {
    expect(exportFileName(monthScope(now), now)).toBe('Hush-2026-10.csv');
  });

  it('names a range file after the two dates', () => {
    expect(exportFileName(rangeScope('2026-09-03', '2026-10-10'), now)).toBe('Hush-2026-09-03-to-2026-10-10.csv');
  });
});

describe('periodCaption', () => {
  it('shows a single day when from and to match', () => {
    expect(periodCaption(rangeScope('2026-10-10', '2026-10-10'))).toBe('10 Oct 2026');
  });
});
