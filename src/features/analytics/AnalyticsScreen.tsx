import { useMemo, useState } from 'react';
import {
  inWindow,
  MONTH_LETTERS,
  periodBars,
  periodSplit,
  periodWindow,
  yearSeries,
  type AnalyticsMode,
} from '@/domain/analytics';
import { CATEGORY_STYLES, NAV_ICONS } from '@/domain/categories';
import { shortDate, toISODate } from '@/domain/dates';
import { sumAmounts } from '@/domain/ledger';
import { formatINR } from '@/domain/money';
import type { Entry } from '@/domain/types';
import { Tile } from '@/ui/CategoryIcon';
import { Icon } from '@/ui/Icon';

export function AnalyticsScreen({
  expenses,
  incomes,
  hide,
}: {
  expenses: Entry[];
  incomes: Entry[];
  hide: boolean;
}) {
  const [mode, setMode] = useState<AnalyticsMode>('Week');
  const [end, setEnd] = useState(toISODate());
  const today = toISODate();
  const windowDays = periodWindow(mode);
  const periodExpenses = useMemo(() => inWindow(expenses, end, windowDays), [expenses, end, windowDays]);
  const periodIncomes = useMemo(() => inWindow(incomes, end, windowDays), [incomes, end, windowDays]);
  const bars = useMemo(() => periodBars(periodExpenses, mode, end), [periodExpenses, mode, end]);
  const max = Math.max(...bars.map((bar) => bar.amount), 1);
  const top = bars.findIndex((bar) => bar.amount === max);
  const total = sumAmounts(periodExpenses);
  const income = sumAmounts(periodIncomes);
  const saved = income - total;
  const byCategory = periodSplit(periodExpenses);
  const all = byCategory.reduce((sum, row) => sum + row.amount, 0) || 1;
  const circumference = 2 * Math.PI * 46;
  let offset = 0;
  const segs = byCategory.map((row) => {
    const length = (row.amount / all) * circumference;
    const seg = { category: row.category, length, offset };
    offset += length;
    return seg;
  });
  const year = new Date().getFullYear();
  const months = yearSeries(expenses, incomes, year);
  const ymax = Math.max(...months.map((row) => Math.max(row.expenses, row.income)), 1);
  const ytot = months.reduce((sum, row) => sum + row.expenses, 0);
  const itot = months.reduce((sum, row) => sum + row.income, 0);
  const currentMonth = new Date().getMonth();
  const barWidth = mode === 'Week' ? 30 : 52;
  const gap = (320 - barWidth * bars.length) / (bars.length - 1);
  const ending = end === today;

  return (
    <div className="scroll">
      <div className="top">
        <div className="h1">Analytics</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {end !== today ? (
            <button className="link" onClick={() => setEnd(today)}>
              Today
            </button>
          ) : null}
          <label className="dpick">
            <Icon d={NAV_ICONS.calendar} size={18} />
            <span>{ending ? 'Today' : shortDate(end)}</span>
            <input
              type="date"
              aria-label="Pick end date"
              max={today}
              value={end}
              onChange={(event) => event.target.value && setEnd(event.target.value > today ? today : event.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="seg">
        {(['Week', 'Month'] as const).map((item) => (
          <button key={item} className={mode === item ? 'on' : ''} onClick={() => setMode(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className="big" style={{ fontSize: 40 }}>
        {formatINR(Math.round(total), hide)}
      </div>
      <div className="sub">
        spent{' '}
        {ending
          ? mode === 'Week'
            ? 'in the last 7 days'
            : 'in the last 4 weeks'
          : `${mode === 'Week' ? '7 days' : '4 weeks'} ending ${shortDate(end)}`}
      </div>

      <div className="stats" style={{ marginTop: 18 }}>
        <div>
          <b style={{ color: 'var(--acc)' }}>{formatINR(Math.round(income), hide)}</b>
          <span>Income</span>
        </div>
        <div>
          <b>{formatINR(Math.round(total), hide)}</b>
          <span>Expenses</span>
        </div>
        <div>
          <b style={{ color: saved >= 0 ? 'var(--acc)' : 'var(--warn)' }}>
            {formatINR(Math.round(Math.abs(saved)), hide)}
          </b>
          <span>{saved >= 0 ? 'Saved' : 'Over'}</span>
        </div>
      </div>

      <svg viewBox="0 0 320 170" style={{ width: '100%', marginTop: 22 }}>
        {bars.map((bar, index) => {
          const height = Math.max(4, (bar.amount / max) * 130);
          return (
            <g key={`${bar.key}-${index}`}>
              <rect
                x={index * (barWidth + gap)}
                y={140 - height}
                width={barWidth}
                height={height}
                rx="9"
                fill={index === top ? 'var(--acc)' : 'var(--bar)'}
              />
              <text
                x={index * (barWidth + gap) + barWidth / 2}
                y="162"
                textAnchor="middle"
                fontSize="12"
                fill="var(--mut)"
                fontFamily="Inter"
              >
                {bar.key}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="sec">Spending split</div>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 16px' }}>
        <svg viewBox="0 0 120 120" width="132" height="132" style={{ flex: 'none' }} role="img" aria-label="Spending split by category">
          <g transform="rotate(-90 60 60)">
            <circle cx="60" cy="60" r="46" fill="none" stroke="var(--bar)" strokeWidth="14" opacity=".4" />
            {segs.map((seg) => (
              <circle
                key={seg.category}
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke={CATEGORY_STYLES[seg.category].color}
                strokeWidth="14"
                strokeDasharray={`${Math.max(0, seg.length - 2)} ${circumference}`}
                strokeDashoffset={-seg.offset}
              />
            ))}
          </g>
          <text x="60" y="59" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--ink)" fontFamily="Inter">
            {formatINR(Math.round(total), hide)}
          </text>
          <text x="60" y="73" textAnchor="middle" fontSize="9" fill="var(--mut)" fontFamily="Inter">
            total
          </text>
        </svg>
        <div className="grow">
          {total === 0 ? <div className="m">No spending in this period.</div> : null}
          {byCategory.slice(0, 4).map((row) => (
            <div key={row.category} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 13 }}>
              <i style={{ width: 8, height: 8, borderRadius: 4, background: CATEGORY_STYLES[row.category].color }} />
              <span className="grow">{row.category}</span>
              <b style={{ fontWeight: 600 }}>{Math.round((row.amount / all) * 100)}%</b>
            </div>
          ))}
        </div>
      </div>

      <div className="sec">Income vs expenses</div>
      <div className="card" style={{ padding: '16px 16px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="m" style={{ marginTop: 0 }}>
            {year} net saved
          </span>
          <span className="amt" style={{ fontSize: 20, color: itot >= ytot ? 'var(--acc)' : 'var(--warn)' }}>
            {formatINR(Math.round(itot - ytot), hide)}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--mut)', marginTop: 8, flexWrap: 'wrap' }}>
          <span>
            <i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: 'var(--acc)', marginRight: 6 }} />
            Income {formatINR(Math.round(itot), hide)}
          </span>
          <span>
            <i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: 'var(--bar)', marginRight: 6 }} />
            Expenses {formatINR(Math.round(ytot), hide)}
          </span>
        </div>
        <svg viewBox="0 0 320 150" style={{ width: '100%', marginTop: 10 }} role="img" aria-label="Spending by month this year">
          {months.map((row) => {
            const height = Math.max(3, (row.expenses / ymax) * 110);
            const incomeHeight = Math.max(3, (row.income / ymax) * 110);
            const current = row.month === currentMonth;
            const x = row.month * 26.5 + 1;
            return (
              <g key={row.month}>
                <rect x={x} y={125 - incomeHeight} width="10" height={incomeHeight} rx="4" fill="var(--acc)" />
                <rect x={x + 11} y={125 - height} width="10" height={height} rx="4" fill={current ? 'var(--ink)' : 'var(--bar)'} />
                <text
                  x={x + 10.5}
                  y="145"
                  textAnchor="middle"
                  fontSize="11"
                  fill={current ? 'var(--ink)' : 'var(--mut)'}
                  fontFamily="Inter"
                >
                  {MONTH_LETTERS[row.month]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="sec">By category</div>
      <div className="card">
        {byCategory.map((row) => (
          <div className="row" key={row.category}>
            <Tile category={row.category} />
            <div className="grow">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="t">{row.category}</span>
                <span className="amt">{formatINR(Math.round(row.amount), hide)}</span>
              </div>
              <div className="track">
                <div className="fill" style={{ width: `${(row.amount / all) * 100}%`, background: CATEGORY_STYLES[row.category].color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
