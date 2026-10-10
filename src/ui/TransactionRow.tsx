import { dayLabel } from '@/domain/dates';
import { formatINR } from '@/domain/money';
import type { Entry } from '@/domain/types';
import { Tile } from './CategoryIcon';

export function TransactionRow({
  entry,
  hide,
  onOpen,
}: {
  entry: Entry;
  hide: boolean;
  onOpen: (entry: Entry) => void;
}) {
  return (
    <button className="row tx" onClick={() => onOpen(entry)}>
      <Tile category={entry.category} />
      <div className="grow">
        <div className="t">{entry.title}</div>
        <div className="m">
          {dayLabel(entry.date)} · {entry.category}
        </div>
      </div>
      <div className={entry.type === 'income' ? 'amt pos' : 'amt'}>{formatINR(entry.amount, hide)}</div>
    </button>
  );
}
