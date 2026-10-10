import type { Toast as ToastModel } from '@/domain/types';

export function Toast({ toast, onUndo }: { toast: ToastModel | null; onUndo: () => void }) {
  if (!toast) return null;
  return (
    <div className="toast">
      {toast.message}
      {toast.undo ? <button onClick={onUndo}>Undo</button> : null}
    </div>
  );
}
