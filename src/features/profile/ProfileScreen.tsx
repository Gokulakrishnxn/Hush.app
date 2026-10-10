import { useState } from 'react';
import { formatINR } from '@/domain/money';
import { savedTowardGoal, stepGoal } from '@/domain/ledger';
import { currentStreak } from '@/domain/streak';
import { resolvedAppearance } from '@/ui/appearance';
import { Toggle } from '@/ui/Toggle';
import type { Entry, Settings } from '@/domain/types';

export function ProfileScreen({
  expenses,
  incomes,
  settings,
  onSettings,
}: {
  expenses: Entry[];
  incomes: Entry[];
  settings: Settings;
  onSettings: (patch: Partial<Settings>) => void;
}) {
  const [reminder, setReminder] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [weekly, setWeekly] = useState(true);
  const [editing, setEditing] = useState(false);
  const saved = savedTowardGoal(expenses, incomes);
  const progress = Math.min(100, (saved / settings.savingsGoal) * 100);
  const dark = resolvedAppearance(settings.appearance) === 'dark';

  return (
    <div className="scroll">
      <div className="h1">Profile</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24 }}>
        <div className="av">{(settings.name || 'G')[0].toUpperCase()}</div>
        <div className="grow">
          {editing ? (
            <input
              autoFocus
              className="note"
              style={{ marginTop: 0, padding: '8px 12px', fontSize: 18, fontWeight: 600 }}
              value={settings.name}
              maxLength={30}
              aria-label="Your name"
              onChange={(event) => onSettings({ name: event.target.value })}
              onBlur={() => setEditing(false)}
              onKeyDown={(event) => event.key === 'Enter' && setEditing(false)}
            />
          ) : (
            <div className="t" style={{ fontSize: 20, fontWeight: 600 }}>
              {settings.name || 'Add your name'}
            </div>
          )}
          <div className="m">Hush member</div>
        </div>
        <button className="link" onClick={() => setEditing((value) => !value)}>
          {editing ? 'Done' : 'Edit'}
        </button>
      </div>

      <div className="stats" style={{ marginTop: 22 }}>
        <div>
          <b>{expenses.length}</b>
          <span>Expenses</span>
        </div>
        <div>
          <b>{currentStreak(expenses.map((entry) => entry.date))}</b>
          <span>Day streak</span>
        </div>
        <div>
          <b>{new Set(expenses.map((entry) => entry.category)).size}</b>
          <span>Categories</span>
        </div>
      </div>

      <div className="sec">Savings goal</div>
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="m" style={{ marginTop: 0 }}>
            Saved so far
          </span>
          <span className="amt" style={{ fontSize: 20 }}>
            {formatINR(Math.round(saved), settings.hideAmounts)}
          </span>
        </div>
        <div className="track" style={{ height: 10 }}>
          <div className="fill" style={{ width: `${progress}%`, background: 'var(--acc)' }} />
        </div>
        <div className="step">
          <span>Goal</span>
          <div>
            <button
              aria-label="Lower goal"
              onClick={() => onSettings({ savingsGoal: stepGoal(settings.savingsGoal, -5000) })}
            >
              −
            </button>
            <b>{formatINR(settings.savingsGoal, settings.hideAmounts)}</b>
            <button
              aria-label="Raise goal"
              onClick={() => onSettings({ savingsGoal: stepGoal(settings.savingsGoal, 5000) })}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="sec">Preferences</div>
      <div className="card">
        <Toggle label="Daily reminder" on={reminder} onChange={setReminder} />
        <Toggle label="Budget alerts" on={alerts} onChange={setAlerts} />
        <Toggle label="Weekly summary" on={weekly} onChange={setWeekly} />
        <Toggle
          label="Hide amounts"
          on={settings.hideAmounts}
          onChange={(hideAmounts) => onSettings({ hideAmounts })}
        />
        <Toggle
          label="Dark appearance"
          on={dark}
          onChange={(next) => onSettings({ appearance: next ? 'dark' : 'light' })}
        />
      </div>

      <div className="sec">Data</div>
      <div className="card">
        <div className="row">
          <div className="grow t">Currency</div>
          <div className="m">INR (₹)</div>
        </div>
        <div className="row">
          <div className="grow t">Export expenses</div>
          <div className="m">CSV</div>
        </div>
        <div className="row">
          <div className="grow t">Backup</div>
          <div className="m">Google Drive</div>
        </div>
      </div>

      <div className="sec">About</div>
      <div className="card">
        <div className="row">
          <div className="grow t">Help and feedback</div>
          <div className="m">›</div>
        </div>
        <div className="row">
          <div className="grow t">Privacy policy</div>
          <div className="m">›</div>
        </div>
        <div className="row">
          <div className="grow t">Version</div>
          <div className="m">1.0.0</div>
        </div>
      </div>
    </div>
  );
}
