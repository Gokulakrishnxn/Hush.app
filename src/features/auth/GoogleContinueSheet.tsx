import { useState, type FormEvent } from 'react';
import { useStore } from '@/data/StoreProvider';
import { isValidEmail } from '@/domain/auth';
import { Sheet } from '@/ui/Sheet';
import { GoogleMark } from './GoogleButton';

export function GoogleContinueSheet({ onClose }: { onClose: () => void }) {
  const store = useStore();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError('Enter the Google email you use.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await store.signInWithGoogle({ email });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not continue with Google.');
      setBusy(false);
    }
  };

  return (
    <Sheet label="Continue with Google" onClose={onClose}>
      <div className="g-sheet-brand">
        <GoogleMark />
        <span>Google</span>
      </div>
      <div className="h1" style={{ fontSize: 28, marginTop: 18 }}>
        Continue with Google
      </div>
      <p className="sub">
        Use the Google email on this phone. Hush remembers it here and does not send it anywhere.
      </p>
      <form onSubmit={(event) => void submit(event)}>
        <label className="auth-field">
          <span>Google email</span>
          <input
            className="note"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoFocus
          />
        </label>
        {error ? <div className="auth-error">{error}</div> : null}
        <button className="cta" type="submit" disabled={busy || !email.trim()}>
          {busy ? 'Signing in…' : 'Continue'}
        </button>
      </form>
    </Sheet>
  );
}
