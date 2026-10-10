import { useMemo, useState } from 'react';
import { useStore } from '@/data/StoreProvider';
import { isSameCalendarMonth, monthYear, parseISODate, shortDate, toISODate } from '@/domain/dates';
import {
  allTimeScope,
  buildExportCsv,
  entriesForScope,
  exportFileName,
  monthScope,
  periodCaption,
  rangeScope,
  saveCsvFile,
  type ExportKind,
  type ExportScope,
} from '@/domain/export';
import { formatINR } from '@/domain/money';
import { sumAmounts } from '@/domain/ledger';
import { DateChip } from '@/ui/DateChip';
import { Sheet } from '@/ui/Sheet';

const KINDS: Array<{ id: ExportKind; label: string }> = [
  { id: 'month', label: 'Month' },
  { id: 'all', label: 'All time' },
  { id: 'range', label: 'Range' },
];

export function ExportSheet({ onClose }: { onClose: () => void }) {
  const store = useStore();
  const today = toISODate();
  const [scope, setScope] = useState<ExportScope>(() => monthScope());
  const [busy, setBusy] = useState(false);
  const hide = store.settings.hideAmounts;
  const from = scope.from ?? today;
  const to = scope.to ?? today;
  const monthRef = parseISODate(from);
  const liveMonth = isSameCalendarMonth(monthRef);

  const rows = useMemo(
    () => entriesForScope(store.expenses, store.incomes, scope),
    [store.expenses, store.incomes, scope],
  );
  const expenses = rows.filter((row) => row.type === 'expense');
  const incomes = rows.filter((row) => row.type === 'income');
  const spent = sumAmounts(expenses);
  const income = sumAmounts(incomes);
  const preview = [...rows]
    .sort((a, b) => (a.date === b.date ? b.id - a.id : a.date < b.date ? 1 : -1))
    .slice(0, 5);

  const setKind = (kind: ExportKind) => {
    if (kind === 'month') setScope(monthScope());
    else if (kind === 'all') setScope(allTimeScope());
    else setScope(rangeScope(monthScope().from ?? today, today));
  };

  const save = async () => {
    if (!rows.length || busy) return;
    setBusy(true);
    try {
      const csv = buildExportCsv(rows, scope);
      const mode = await saveCsvFile(exportFileName(scope), csv);
      store.notify(mode === 'shared' ? 'Spreadsheet ready to share' : 'CSV saved');
      onClose();
    } catch {
      store.notify('Could not export. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet label="Export CSV" onClose={onClose}>
      <div className="h1" style={{ fontSize: 28 }}>
        Export
      </div>
      <div className="sub">A clean spreadsheet of your Hush activity, ready for Excel or Sheets.</div>

      <div className="seg" style={{ marginTop: 18 }}>
        {KINDS.map((item) => (
          <button
            key={item.id}
            className={scope.kind === item.id ? 'on' : ''}
            onClick={() => setKind(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {scope.kind === 'month' ? (
        <div className="export-dates">
          <DateChip
            value={from}
            max={today}
            label={liveMonth ? 'This month' : monthYear(monthRef)}
            ariaLabel="Pick a month to export"
            onChange={(iso) => setScope(monthScope(parseISODate(iso)))}
          />
        </div>
      ) : null}

      {scope.kind === 'range' ? (
        <div className="export-dates">
          <div className="export-date">
            <span className="export-date-label">From</span>
            <DateChip
              value={from}
              max={to}
              label={shortDate(from)}
              ariaLabel="Export from date"
              onChange={(iso) => setScope(rangeScope(iso, to))}
            />
          </div>
          <div className="export-date">
            <span className="export-date-label">To</span>
            <DateChip
              value={to}
              min={from}
              max={today}
              label={to === today ? 'Today' : shortDate(to)}
              ariaLabel="Export to date"
              onChange={(iso) => setScope(rangeScope(from, iso))}
            />
          </div>
        </div>
      ) : null}

      <div className="export-meta">{periodCaption(scope)}</div>

      <div className="stats" style={{ marginTop: 14 }}>
        <div>
          <b>{expenses.length}</b>
          <span>Expenses</span>
        </div>
        <div>
          <b>{incomes.length}</b>
          <span>Income</span>
        </div>
        <div>
          <b style={{ color: income >= spent ? 'var(--acc)' : 'var(--warn)' }}>
            {formatINR(Math.round(income - spent), hide)}
          </b>
          <span>Balance</span>
        </div>
      </div>

      <div className="sec" style={{ marginTop: 26 }}>
        Preview
      </div>
      <div className="card export-sheet">
        <div className="export-head">
          <span>Date</span>
          <span>Title</span>
          <span>Amount</span>
        </div>
        {preview.length ? (
          preview.map((row) => (
            <div className="export-row" key={row.id}>
              <span>{row.date.slice(8)}/{row.date.slice(5, 7)}</span>
              <span className="nt">{row.title}</span>
              <span className={row.type === 'income' ? 'pos' : undefined}>{formatINR(row.amount, hide)}</span>
            </div>
          ))
        ) : (
          <div className="m empty">Nothing to export in this period.</div>
        )}
        {rows.length > preview.length ? (
          <div className="export-more">+{rows.length - preview.length} more rows in the file</div>
        ) : null}
      </div>

      <button className="cta" disabled={!rows.length || busy} onClick={() => void save()}>
        {busy ? 'Preparing…' : 'Save CSV spreadsheet'}
      </button>
      <div className="m" style={{ textAlign: 'center', marginTop: 10 }}>
        Includes date, type, category, title and amount. INR, two decimals.
      </div>
    </Sheet>
  );
}
