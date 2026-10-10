import { useState } from 'react';
import { categoriesFor } from '@/domain/categories';
import { toISODate } from '@/domain/dates';
import { parseAmount, pressKeypad } from '@/domain/money';
import type { Entry, EntryType } from '@/domain/types';
import { Tile } from '@/ui/CategoryIcon';
import { Sheet } from '@/ui/Sheet';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

export function AddSheet({
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  initial: Entry | null;
  onClose: () => void;
  onSave: (draft: Omit<Entry, 'id'>, existing?: Entry) => void;
  onDelete: () => void;
}) {
  const [type, setType] = useState<EntryType>(initial?.type ?? 'expense');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '0');
  const [category, setCategory] = useState(initial?.category ?? 'Food');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [date, setDate] = useState(initial?.date ?? toISODate());
  const today = toISODate();
  const value = parseAmount(amount);
  const cats = categoriesFor(type);

  return (
    <Sheet label={initial ? 'Edit expense' : 'Add expense'} onClose={onClose}>
      {!initial ? (
        <div className="seg" style={{ marginTop: 0, marginBottom: 14, background: 'var(--bg)' }}>
          {(['expense', 'income'] as const).map((item) => (
            <button
              key={item}
              className={type === item ? 'on' : ''}
              onClick={() => {
                setType(item);
                setCategory(item === 'income' ? 'Salary' : 'Food');
              }}
            >
              {item === 'income' ? 'Income' : 'Expense'}
            </button>
          ))}
        </div>
      ) : null}

      <div style={{ textAlign: 'center' }}>
        <div className="m">Amount</div>
        <div className="big" style={{ fontSize: 52, marginTop: 6 }}>
          ₹{amount}
        </div>
      </div>

      <div className="cgrid">
        {cats.map((name) => (
          <button
            key={name}
            className={category === name ? 'cc on' : 'cc'}
            onClick={() => setCategory(name)}
            aria-pressed={category === name}
          >
            <Tile category={name} />
            <span>{name}</span>
          </button>
        ))}
      </div>

      <input
        className="note"
        placeholder={type === 'income' ? 'Where is it from?' : 'What was it for?'}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label className="note" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Date</span>
        <input
          type="date"
          max={today}
          value={date}
          onChange={(event) => event.target.value && setDate(event.target.value > today ? today : event.target.value)}
          style={{ background: 'none', border: 0, color: 'inherit', font: 'inherit' }}
        />
      </label>

      <div className="pad">
        {KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setAmount((current) => pressKeypad(current, key))}
            aria-label={key === '⌫' ? 'Delete' : key}
          >
            {key}
          </button>
        ))}
      </div>

      <button
        className="cta"
        disabled={!value}
        onClick={() =>
          onSave(
            {
              type,
              amount: value,
              category,
              title: title.trim() || category,
              date,
            },
            initial ?? undefined,
          )
        }
      >
        {initial ? 'Save changes' : type === 'income' ? 'Add income' : 'Add expense'}
      </button>
      {initial ? (
        <button className="del" onClick={onDelete}>
          Delete {type === 'income' ? 'income' : 'expense'}
        </button>
      ) : null}
    </Sheet>
  );
}
