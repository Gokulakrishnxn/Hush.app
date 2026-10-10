import { Sheet } from '@/ui/Sheet';

export function ConfirmSheet({
  title,
  body,
  action,
  onConfirm,
  onClose,
}: {
  title: string;
  body: string;
  action: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Sheet label={title} onClose={onClose}>
      <div className="h1" style={{ fontSize: 28 }}>
        {title}
      </div>
      <p className="info-lead">{body}</p>
      <button
        className="cta"
        style={{ background: 'var(--warn)', marginTop: 22 }}
        onClick={() => {
          onConfirm();
          onClose();
        }}
      >
        {action}
      </button>
      <button className="cta" style={{ background: 'var(--ink)', color: 'var(--bg)' }} onClick={onClose}>
        Keep data
      </button>
    </Sheet>
  );
}
