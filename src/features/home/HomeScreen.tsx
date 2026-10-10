import { useState } from 'react';
import { CATEGORY_STYLES, EXPENSE_CATEGORIES, NAV_ICONS } from '@/domain/categories';
import { greeting, monthName } from '@/domain/dates';
import { inCalendarMonth, mergeFeed, monthSnapshot, searchFeed, totalsByCategory } from '@/domain/ledger';
import { formatINR } from '@/domain/money';
import { currentStreak } from '@/domain/streak';
import type { Entry } from '@/domain/types';
import { Tile } from '@/ui/CategoryIcon';
import { Icon } from '@/ui/Icon';
import { TransactionRow } from '@/ui/TransactionRow';

export function HomeScreen({
  expenses,
  incomes,
  budgets,
  name,
  hide,
  onOpen,
  onStreak,
}: {
  expenses: Entry[];
  incomes: Entry[];
  budgets: Record<string, number>;
  name: string;
  hide: boolean;
  onOpen: (entry: Entry) => void;
  onStreak: () => void;
}) {
  const snap = monthSnapshot(expenses, incomes, budgets);
  const [all, setAll] = useState(false);
  const [query, setQuery] = useState('');
  const feed = mergeFeed(expenses, incomes);
  const list = all ? searchFeed(feed, query) : feed.slice(0, 6);
  const streak = currentStreak(expenses.map((entry) => entry.date));
  const byCategory = totalsByCategory(inCalendarMonth(expenses), EXPENSE_CATEGORIES);
  const over = snap.left < 0;

  return (
    <div className="scroll">
      <div className="top">
        <div>
          <div className="m" style={{ marginTop: 0, fontSize: 15 }}>
            {greeting()}
          </div>
          <div className="t" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em' }}>
            {name || 'there'}
          </div>
        </div>
        <button className="spill" onClick={onStreak} aria-label="View your streak">
          <Icon d={NAV_ICONS.flame} size={18} color="#F0792B" />
          {streak}
        </button>
      </div>

      <div className="hero">
        <div className="hrow">
          <div>
            <div className="lbl">{monthName()} spending</div>
            <div className="big">{formatINR(Math.round(snap.spent), hide)}</div>
            <div className="pill">
              {snap.daysLeft} days left · {formatINR(snap.budget, hide)} budget
            </div>
          </div>
          <svg
            width="96"
            height="96"
            viewBox="0 0 96 96"
            role="img"
            aria-label={`${Math.round(snap.budgetUsedPct)}% of budget used`}
          >
            <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(128,128,128,.3)" strokeWidth="8" />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke={over ? 'var(--warn)' : 'var(--bg)'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${snap.budgetUsedPct * 2.5133} 251.33`}
              transform="rotate(-90 48 48)"
            />
            <text
              x="48"
              y="53"
              textAnchor="middle"
              fontSize="20"
              fontWeight="600"
              fill="currentColor"
              fontFamily="Inter"
            >
              {Math.round(snap.budgetUsedPct)}%
            </text>
          </svg>
        </div>
        <div className="mix">
          {byCategory
            .filter((row) => row.amount > 0)
            .map((row) => (
              <i key={row.category} style={{ flex: row.amount, background: CATEGORY_STYLES[row.category].color }} />
            ))}
        </div>
        <div className="hfoot">
          <div>
            <span>{over ? 'Over' : 'Left'}</span>
            <b>{formatINR(Math.abs(Math.round(snap.left)), hide)}</b>
          </div>
          <div>
            <span>Today</span>
            <b>{formatINR(snap.today, hide)}</b>
          </div>
          <div>
            <span>Safe per day</span>
            <b>{formatINR(Math.round(snap.safePerDay), hide)}</b>
          </div>
        </div>
      </div>

      <div className="stats">
        <div>
          <b style={{ color: 'var(--acc)' }}>{formatINR(Math.round(snap.income), hide)}</b>
          <span>Income</span>
        </div>
        <div>
          <b>{formatINR(Math.round(snap.spent), hide)}</b>
          <span>Expenses</span>
        </div>
        <div>
          <b style={{ color: snap.balance >= 0 ? 'var(--ink)' : 'var(--warn)' }}>
            {formatINR(Math.round(snap.balance), hide)}
          </b>
          <span>Balance</span>
        </div>
      </div>

      <div className="sechead">
        <div className="sec">Categories</div>
      </div>
      <div className="strip">
        {byCategory.map((row) => (
          <div className="sc" key={row.category}>
            <Tile category={row.category} size={26} />
            <b>{row.category}</b>
            <span>{formatINR(Math.round(row.amount), hide)}</span>
          </div>
        ))}
      </div>

      <div className="sechead" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="sec">{all ? 'All expenses' : 'Recent'}</div>
        <button
          className="link"
          onClick={() => {
            setAll((value) => !value);
            setQuery('');
          }}
        >
          {all ? 'Show less' : 'See all'}
        </button>
      </div>
      {all ? (
        <input
          className="note"
          style={{ marginTop: 0, marginBottom: 12 }}
          placeholder="Search expenses"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      ) : null}
      <div className="card">
        {list.length ? (
          list.map((entry) => <TransactionRow key={entry.id} entry={entry} hide={hide} onOpen={onOpen} />)
        ) : (
          <div className="m empty">No expenses match your search.</div>
        )}
      </div>
    </div>
  );
}
