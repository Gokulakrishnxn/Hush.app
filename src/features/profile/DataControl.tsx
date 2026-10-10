import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '@/data/StoreProvider';
import { dayLabel, toISODate } from '@/domain/dates';
import { entriesOnDate, totalBudget } from '@/domain/ledger';
import { NAV_ICONS } from '@/domain/categories';
import type { Entry } from '@/domain/types';
import { DateChip } from '@/ui/DateChip';
import { Icon } from '@/ui/Icon';
import { ConfirmSheet } from './ConfirmSheet';
import { ExportSheet } from './ExportSheet';
import { ManageDataSheet } from './ManageDataSheet';

type Panel = 'manage' | 'export' | 'delete' | 'reset' | null;

export function DataControl({ expenses, incomes }: { expenses: Entry[]; incomes: Entry[] }) {
  const store = useStore();
  const today = toISODate();
  const sheetsHost = typeof document !== 'undefined' ? document.querySelector('.device') : null;
  const [open, setOpen] = useState(false);
  const [resetDay, setResetDay] = useState(today);
  const [panel, setPanel] = useState<Panel>(null);
  const dayRows = entriesOnDate(expenses, resetDay).length + entriesOnDate(incomes, resetDay).length;
  const resetLabel = dayLabel(resetDay);

  const askDelete = () => {
    if (!expenses.length && !incomes.length && totalBudget(store.settings.budgets) <= 0) {
      store.notify('Nothing to delete');
      return;
    }
    setPanel('delete');
  };

  const askReset = () => {
    if (!dayRows) {
      store.notify(`Nothing to reset on ${resetLabel.toLowerCase()}`);
      return;
    }
    setPanel('reset');
  };

  return (
    <>
      <div className="card data-control">
        <button
          className="row tx"
          aria-expanded={open}
          aria-controls="data-control-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <div className="grow">
            <div className="t">Data control</div>
            <div className="m">Manage, export, delete or reset</div>
          </div>
          <span className={`data-chevron${open ? ' open' : ''}`}>
            <Icon d={NAV_ICONS.chevron} size={18} color="var(--mut)" />
          </span>
        </button>

        {open ? (
          <div id="data-control-menu">
            <button className="row tx" onClick={() => setPanel('manage')}>
              <div className="grow t">Manage data</div>
              <div className="m">›</div>
            </button>
            <button className="row tx" onClick={() => setPanel('export')}>
              <div className="grow">
                <div className="t">Export data</div>
                <div className="m">Spreadsheet for Excel or Sheets</div>
              </div>
              <div className="m">›</div>
            </button>
            <button className="row tx" onClick={askDelete}>
              <div className="grow">
                <div className="t">Delete data</div>
                <div className="m">Remove activity and leftover budget</div>
              </div>
              <div className="m">›</div>
            </button>
            <div className="row reset-row">
              <button className="tx grow" onClick={askReset}>
                <div className="t">Reset data</div>
                <div className="m">Clear entries on {resetLabel.toLowerCase()}</div>
              </button>
              <DateChip
                value={resetDay}
                max={today}
                label={resetLabel}
                ariaLabel="Day to reset"
                onChange={setResetDay}
              />
            </div>
          </div>
        ) : null}
      </div>

      {sheetsHost
        ? createPortal(
            <>
              {panel === 'manage' ? (
                <ManageDataSheet expenses={expenses} incomes={incomes} onClose={() => setPanel(null)} />
              ) : null}
              {panel === 'export' ? <ExportSheet onClose={() => setPanel(null)} /> : null}
              {panel === 'delete' ? (
                <ConfirmSheet
                  title="Delete data"
                  body="This removes every expense and income, and clears leftover budget so Left and Safe per day go back to zero. Sign-in and preferences stay. This cannot be undone."
                  action="Delete all data"
                  onConfirm={store.clearLedger}
                  onClose={() => setPanel(null)}
                />
              ) : null}
              {panel === 'reset' ? (
                <ConfirmSheet
                  title="Reset data"
                  body={`This clears every entry on ${resetLabel}. Other days stay. If nothing is left this month, leftover budget is cleared too so Left and Safe per day go back to zero.`}
                  action={`Reset ${resetLabel}`}
                  onConfirm={() => store.resetDate(resetDay)}
                  onClose={() => setPanel(null)}
                />
              ) : null}
            </>,
            sheetsHost,
          )
        : null}
    </>
  );
}
