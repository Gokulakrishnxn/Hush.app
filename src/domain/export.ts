import { mergeFeed, sumAmounts } from './ledger';
import { endOfMonthISO, parseISODate, startOfMonthISO, toISODate } from './dates';
import type { Entry } from './types';

export type ExportKind = 'month' | 'all' | 'range';

export interface ExportScope {
  kind: ExportKind;
  from?: string;
  to?: string;
}

function csvCell(value: string | number): string {
  const text = String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function csvRow(cells: Array<string | number>): string {
  return cells.map(csvCell).join(',');
}

function formatDay(iso: string): string {
  return parseISODate(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function monthScope(ref = new Date()): ExportScope {
  return {
    kind: 'month',
    from: startOfMonthISO(ref),
    to: endOfMonthISO(ref),
  };
}

export function allTimeScope(): ExportScope {
  return { kind: 'all' };
}

export function rangeScope(from: string, to: string): ExportScope {
  return from <= to ? { kind: 'range', from, to } : { kind: 'range', from: to, to: from };
}

export function entriesForScope(
  expenses: readonly Entry[],
  incomes: readonly Entry[],
  scope: ExportScope,
): Entry[] {
  const feed = mergeFeed(expenses, incomes);
  if (scope.kind === 'all' || !scope.from || !scope.to) return feed;
  return feed.filter((entry) => entry.date >= scope.from! && entry.date <= scope.to!);
}

export function periodCaption(scope: ExportScope): string {
  if (scope.kind === 'all' || !scope.from || !scope.to) return 'All time';
  if (scope.from === scope.to) return formatDay(scope.from);
  return `${formatDay(scope.from)} – ${formatDay(scope.to)}`;
}

export function exportFileName(scope: ExportScope, now = new Date()): string {
  const stamp = toISODate(now);
  if (scope.kind === 'all' || !scope.from || !scope.to) return `Hush-All-${stamp}.csv`;
  if (scope.kind === 'month' && scope.from) return `Hush-${scope.from.slice(0, 7)}.csv`;
  if (scope.from === scope.to) return `Hush-${scope.from}.csv`;
  return `Hush-${scope.from}-to-${scope.to}.csv`;
}

export function buildExportCsv(
  entries: readonly Entry[],
  scope: ExportScope,
  generated = new Date(),
): string {
  const expenses = entries.filter((entry) => entry.type === 'expense');
  const incomes = entries.filter((entry) => entry.type === 'income');
  const spent = sumAmounts(expenses);
  const income = sumAmounts(incomes);
  const generatedLabel = generated.toLocaleString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const lines = [
    csvRow(['Hush']),
    csvRow(['Personal expense and income export']),
    csvRow(['Generated', generatedLabel]),
    csvRow(['Period', periodCaption(scope)]),
    csvRow(['Currency', 'INR (Indian Rupee)']),
    csvRow(['Rows', entries.length]),
    '',
    csvRow(['Date', 'Weekday', 'Type', 'Category', 'Title', 'Amount']),
  ];

  const chronological = [...entries].sort((a, b) => {
    if (a.date === b.date) return a.id - b.id;
    return a.date < b.date ? -1 : 1;
  });

  for (const entry of chronological) {
    const date = parseISODate(entry.date);
    lines.push(
      csvRow([
        entry.date,
        date.toLocaleDateString('en-IN', { weekday: 'long' }),
        entry.type === 'income' ? 'Income' : 'Expense',
        entry.category,
        entry.title,
        entry.amount.toFixed(2),
      ]),
    );
  }

  lines.push('');
  lines.push(csvRow(['Summary', '', '', '', '', '']));
  lines.push(csvRow(['Expenses', expenses.length, '', '', '', spent.toFixed(2)]));
  lines.push(csvRow(['Income', incomes.length, '', '', '', income.toFixed(2)]));
  lines.push(csvRow(['Balance', '', '', '', '', (income - spent).toFixed(2)]));
  lines.push('');
  lines.push(csvRow(['Prepared by Hush. Amounts are INR with two decimal places.']));

  return `\uFEFF${lines.join('\r\n')}\r\n`;
}

export async function saveCsvFile(filename: string, csv: string): Promise<'shared' | 'downloaded'> {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const file = new File([blob], filename, { type: 'text/csv' });

  try {
    if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: filename, text: 'Hush export' });
      return 'shared';
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
}
