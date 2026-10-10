import type { ReactNode } from 'react';

export function Sheet({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label={label}>
        <div className="grab" />
        {children}
      </div>
    </div>
  );
}
