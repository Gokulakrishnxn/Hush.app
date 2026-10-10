import { useState } from 'react';
import { CATEGORY_STYLES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/domain/categories';
import { inCalendarMonth, monthSnapshot, totalsByCategory } from '@/domain/ledger';
import { formatINR } from '@/domain/money';
import { isSameCalendarMonth, monthName, monthYear, parseISODate, toISODate } from '@/domain/dates';
import type { Entry } from '@/domain/types';
import { DateChip } from '@/ui/DateChip';
import { Tile } from '@/ui/CategoryIcon';
import { TransactionRow } from '@/ui/TransactionRow';

export function BudgetScreen({
  expenses,
  incomes,
  budgets,
  hide,
  onBudget,
  onEdit,
}: {
  expenses: Entry[];
  incomes: Entry[];
  budgets: Record<string, number>;
  hide: boolean;
  onBudget: (category: string, delta: number) => void;
  onEdit: (entry: Entry) => void;
}) {
  const [view, setView] = useState<'Expenses' | 'Income'>('Expenses');
  const [open, setOpen] = useState<string | null>(null);
  const today = toISODate();
  const [cursor, setCursor] = useState(today);
  const ref = parseISODate(cursor);
  const live = isSameCalendarMonth(ref);
  const snap = monthSnapshot(expenses, incomes, budgets, ref);
  const onTrack = snap.budget - snap.projected >= 0;
  const monthExpenses = inCalendarMonth(expenses, ref);
  const monthIncomes = inCalendarMonth(incomes, ref);
  const monthLabel = live ? 'This month' : monthYear(ref);

  const header = (
    <div className="top">
      <div className="h1">Budget</div>
      <div className="date-tools">
        {!live ? (
          <button className="link" onClick={() => setCursor(today)}>
            This month
          </button>
        ) : null}
        <DateChip
          value={cursor}
          max={today}
          label={monthLabel}
          ariaLabel="Pick a month"
          onChange={setCursor}
        />
      </div>
    </div>
  );

  const switcher = (
    <div className="seg">
      {(['Expenses', 'Income'] as const).map((item) => (
        <button key={item} className={view === item ? 'on' : ''} onClick={() => setView(item)}>
          {item}
        </button>
      ))}
    </div>
  );

  if (view === 'Income') {
    const rate = snap.income ? Math.round((snap.balance / snap.income) * 100) : 0;
    const sources = totalsByCategory(monthIncomes, INCOME_CATEGORIES).filter((row) => row.amount > 0);
    const empty = <div className="m empty">No income yet. Tap + and choose Income.</div>;

    return (
      <div className="scroll">
        {header}
        {switcher}
        <div className="card lift" style={{ marginTop: 20, padding: '20px 16px' }}>
          <div className="m" style={{ marginTop: 0 }}>
            Income {live ? 'this month' : `in ${monthName(ref)}`}
          </div>
          <div className="big" style={{ fontSize: 40, color: 'var(--acc)' }}>
            {formatINR(snap.income, hide)}
          </div>
          <div className="track" style={{ height: 10, marginTop: 16 }}>
            <div
              className="fill"
              style={{
                width: `${Math.min(100, snap.income ? (snap.spent / snap.income) * 100 : 0)}%`,
                background: snap.balance < 0 ? 'var(--warn)' : 'var(--ink)',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13 }}>
            <span className="m" style={{ marginTop: 0 }}>
              Spent {formatINR(Math.round(snap.spent), hide)}
            </span>
            <span style={{ fontWeight: 600, color: snap.balance < 0 ? 'var(--warn)' : 'var(--acc)' }}>
              {snap.balance < 0
                ? `Over by ${formatINR(Math.round(-snap.balance), hide)}`
                : `Saved ${formatINR(Math.round(snap.balance), hide)} · ${rate}%`}
            </span>
          </div>
        </div>
        <div className="sec">Sources</div>
        <div className="card">
          {sources.length
            ? sources.map((row) => (
                <div className="row" key={row.category}>
                  <Tile category={row.category} />
                  <div className="grow">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="t">{row.category}</span>
                      <span className="amt">{formatINR(row.amount, hide)}</span>
                    </div>
                    <div className="track">
                      <div
                        className="fill"
                        style={{
                          width: `${(row.amount / Math.max(1, snap.income)) * 100}%`,
                          background: CATEGORY_STYLES[row.category].color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            : empty}
        </div>
        <div className="sec">Income entries</div>
        <div className="card">
          {monthIncomes.length
            ? monthIncomes.map((entry) => <TransactionRow key={entry.id} entry={entry} hide={hide} onOpen={onEdit} />)
            : empty}
        </div>
      </div>
    );
  }

  const projectionCopy = live
    ? onTrack
      ? `On track. You should finish ${formatINR(Math.round(snap.budget - snap.projected), hide)} under budget.`
      : `At this pace you will go ${formatINR(Math.round(snap.projected - snap.budget), hide)} over. Trim a category below.`
    : snap.left >= 0
      ? `You finished ${formatINR(Math.round(snap.left), hide)} under budget.`
      : `You went ${formatINR(Math.round(-snap.left), hide)} over budget.`;

  return (
    <div className="scroll">
      {header}
      {switcher}
      <div className="sub">
        {formatINR(snap.budget, hide)} a month, split by what matters to you
      </div>
      <div className="card lift" style={{ marginTop: 24, padding: '18px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="m" style={{ marginTop: 0 }}>
            {live ? 'Projected by month end' : `Spent in ${monthName(ref)}`}
          </span>
          <span className="amt" style={{ fontSize: 22, color: (live ? onTrack : snap.left >= 0) ? 'var(--ink)' : 'var(--warn)' }}>
            {formatINR(Math.round(live ? snap.projected : snap.spent), hide)}
          </span>
        </div>
        <div className="track" style={{ height: 10 }}>
          <div
            className="fill"
            style={{
              width: `${Math.min(100, (snap.spent / Math.max(1, snap.budget)) * 100)}%`,
              background: (live ? onTrack : snap.left >= 0) ? 'var(--ink)' : 'var(--warn)',
            }}
          />
        </div>
        <div className="m" style={{ color: (live ? onTrack : snap.left >= 0) ? 'var(--acc)' : 'var(--warn)', fontWeight: 500 }}>
          {projectionCopy}
        </div>
      </div>
      <div className="sec">Categories</div>
      <div className="m" style={{ margin: '-6px 0 12px' }}>
        Tap a category to change its limit.
      </div>
      <div className="card">
        {EXPENSE_CATEGORIES.map((category) => {
          const spent = monthExpenses
            .filter((entry) => entry.category === category)
            .reduce((total, entry) => total + entry.amount, 0);
          const limit = budgets[category] ?? 500;
          const over = spent > limit;
          const expanded = open === category;
          return (
            <div className="row" key={category} style={{ flexWrap: 'wrap' }}>
              <button
                className="grow press"
                style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}
                onClick={() => setOpen(expanded ? null : category)}
                aria-expanded={expanded}
              >
                <Tile category={category} />
                <div className="grow">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="t">{category}</span>
                    <span className="m" style={{ marginTop: 0, color: over ? 'var(--warn)' : 'var(--mut)' }}>
                      {formatINR(Math.round(spent), hide)} of {formatINR(limit, hide)}
                    </span>
                  </div>
                  <div className="track">
                    <div
                      className="fill"
                      style={{
                        width: `${Math.min(100, (spent / limit) * 100)}%`,
                        background: over ? 'var(--warn)' : CATEGORY_STYLES[category].color,
                      }}
                    />
                  </div>
                </div>
              </button>
              {expanded ? (
                <div className="step">
                  <span>Monthly limit</span>
                  <div>
                    <button aria-label="Decrease limit" onClick={() => onBudget(category, -500)}>
                      −
                    </button>
                    <b>{formatINR(limit, hide)}</b>
                    <button aria-label="Increase limit" onClick={() => onBudget(category, 500)}>
                      +
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
