import { activitySpan, mergeFeed } from '@/domain/ledger';
import { shortDate } from '@/domain/dates';
import type { Entry } from '@/domain/types';
import { Sheet } from '@/ui/Sheet';

export function ManageDataSheet({
  expenses,
  incomes,
  onClose,
}: {
  expenses: Entry[];
  incomes: Entry[];
  onClose: () => void;
}) {
  const span = activitySpan(mergeFeed(expenses, incomes));
  const range = span.first && span.last
    ? span.first === span.last
      ? shortDate(span.first)
      : `${shortDate(span.first)} – ${shortDate(span.last)}`
    : 'No activity yet';

  return (
    <Sheet label="Manage data" onClose={onClose}>
      <div className="h1" style={{ fontSize: 28 }}>
        Manage data
      </div>
      <p className="info-lead">Your ledger stays on this phone. Export a copy before you delete or reset.</p>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="row">
          <div className="grow t">Currency</div>
          <div className="m">INR (₹)</div>
        </div>
        <div className="row">
          <div className="grow t">Expenses</div>
          <div className="m">{expenses.length}</div>
        </div>
        <div className="row">
          <div className="grow t">Income</div>
          <div className="m">{incomes.length}</div>
        </div>
        <div className="row">
          <div className="grow t">Activity</div>
          <div className="m">{range}</div>
        </div>
      </div>

      <button className="cta" style={{ background: 'var(--ink)', color: 'var(--bg)', marginTop: 22 }} onClick={onClose}>
        Done
      </button>
    </Sheet>
  );
}
