import { useState, type FormEvent } from 'react';

function cleanName(value: string): string {
  return value.trim().replace(/\s+/g, ' ').slice(0, 30);
}

export function NameGate({ onSave }: { onSave: (name: string) => void }) {
  const [name, setName] = useState('');
  const ready = cleanName(name).length > 0;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = cleanName(name);
    if (!next) return;
    onSave(next);
  };

  return (
    <div className="name-gate">
      <div className="name-gate-copy">
        <div className="h1">What should we call you?</div>
        <div className="sub">Just a name. It stays on this phone.</div>
      </div>
      <form className="name-gate-form" onSubmit={submit}>
        <label className="name-gate-field">
          <span>Your name</span>
          <input
            className="note"
            autoFocus
            autoComplete="name"
            autoCapitalize="words"
            maxLength={30}
            value={name}
            aria-label="Your name"
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <button className="cta" type="submit" disabled={!ready}>
          Continue
        </button>
      </form>
    </div>
  );
}
