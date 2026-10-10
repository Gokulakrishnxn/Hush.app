import { NAV_ICONS } from '@/domain/categories';
import { clampPastISO } from '@/domain/dates';
import { Icon } from './Icon';

export function DateChip({
  value,
  min,
  max,
  label,
  ariaLabel,
  onChange,
}: {
  value: string;
  min?: string;
  max: string;
  label: string;
  ariaLabel: string;
  onChange: (iso: string) => void;
}) {
  return (
    <label className="dpick">
      <Icon d={NAV_ICONS.calendar} size={18} />
      <span>{label}</span>
      <input
        type="date"
        aria-label={ariaLabel}
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          if (!event.target.value) return;
          let next = clampPastISO(event.target.value, max);
          if (min && next < min) next = min;
          onChange(next);
        }}
      />
    </label>
  );
}
