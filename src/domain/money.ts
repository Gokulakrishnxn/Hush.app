const CURRENCY = '₹';

export function formatINR(amount: number, hide = false): string {
  if (hide) return `${CURRENCY}••••`;
  return (
    CURRENCY +
    amount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  );
}

export function clampAmount(raw: string): string {
  if (raw === '.' || raw === '') return raw;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return '0';
  return raw;
}

export function parseAmount(raw: string): number {
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value * 100) / 100;
}

export function pressKeypad(current: string, key: string): string {
  if (key === '⌫') return current.length > 1 ? current.slice(0, -1) : '0';
  if (key === '.') return current.includes('.') ? current : `${current}.`;
  if (current === '0') return key;
  if (current.includes('.') && (current.split('.')[1]?.length ?? 0) >= 2) {
    return current;
  }
  if (current.replace('.', '').length >= 8) return current;
  return current + key;
}
