import { useState, type FormEvent } from 'react';
import { useStore } from '@/data/StoreProvider';
import { GoogleButton } from './GoogleButton';
import { GoogleContinueSheet } from './GoogleContinueSheet';

type View = 'welcome' | 'login' | 'signup';

export function AuthGate() {
  const [view, setView] = useState<View>('welcome');
  const [googleOpen, setGoogleOpen] = useState(false);

  return (
    <>
      <div key={view} className="screen-enter">
        {view === 'welcome' ? (
          <WelcomeScreen onLogin={() => setView('login')} onSignup={() => setView('signup')} onGoogle={() => setGoogleOpen(true)} />
        ) : null}
        {view === 'login' ? (
          <LoginScreen onBack={() => setView('welcome')} onSignup={() => setView('signup')} onGoogle={() => setGoogleOpen(true)} />
        ) : null}
        {view === 'signup' ? (
          <SignupScreen onBack={() => setView('welcome')} onLogin={() => setView('login')} onGoogle={() => setGoogleOpen(true)} />
        ) : null}
      </div>
      {googleOpen ? <GoogleContinueSheet onClose={() => setGoogleOpen(false)} /> : null}
    </>
  );
}

function WelcomeScreen({
  onLogin,
  onSignup,
  onGoogle,
}: {
  onLogin: () => void;
  onSignup: () => void;
  onGoogle: () => void;
}) {
  return (
    <div className="auth">
      <div className="auth-hero">
        <div className="h1">Hush</div>
        <p className="sub">A quiet place for what you spend and earn.</p>
      </div>
      <div className="auth-actions">
        <button className="cta" type="button" onClick={onSignup}>
          Create account
        </button>
        <button className="cta ghost" type="button" onClick={onLogin}>
          Log in
        </button>
        <div className="auth-or">or</div>
        <GoogleButton onClick={onGoogle} />
      </div>
    </div>
  );
}

function LoginScreen({
  onBack,
  onSignup,
  onGoogle,
}: {
  onBack: () => void;
  onSignup: () => void;
  onGoogle: () => void;
}) {
  const store = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await store.signIn({ email, password });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not log in.');
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <button className="auth-back" type="button" onClick={onBack}>
        ← Welcome
      </button>
      <div className="h1">Log in</div>
      <p className="sub">Welcome back. Your ledger stays on this phone.</p>
      <form className="auth-form" onSubmit={(event) => void submit(event)}>
        <label className="auth-field">
          <span>Email</span>
          <input
            className="note"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoFocus
          />
        </label>
        <div className="auth-field">
          <span>Password</span>
          <div className="auth-pass">
            <input
              className="note"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
              aria-label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type="button" className="auth-pass-toggle" onClick={() => setShow((value) => !value)}>
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        {error ? <div className="auth-error">{error}</div> : null}
        <button className="cta" type="submit" disabled={busy || !email.trim() || !password}>
          {busy ? 'Signing in…' : 'Log in'}
        </button>
      </form>
      <div className="auth-or">or</div>
      <GoogleButton onClick={onGoogle} disabled={busy} />
      <p className="auth-switch">
        New to Hush?{' '}
        <button className="link" type="button" onClick={onSignup}>
          Create an account
        </button>
      </p>
    </div>
  );
}

function SignupScreen({
  onBack,
  onLogin,
  onGoogle,
}: {
  onBack: () => void;
  onLogin: () => void;
  onGoogle: () => void;
}) {
  const store = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await store.signUp({ name, email, password });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not create your account.');
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <button className="auth-back" type="button" onClick={onBack}>
        ← Welcome
      </button>
      <div className="h1">Create account</div>
      <p className="sub">A name, an email, and a password. That is all Hush needs.</p>
      <form className="auth-form" onSubmit={(event) => void submit(event)}>
        <label className="auth-field">
          <span>Name</span>
          <input
            className="note"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            maxLength={30}
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
          />
        </label>
        <label className="auth-field">
          <span>Email</span>
          <input
            className="note"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <div className="auth-field">
          <span>Password</span>
          <div className="auth-pass">
            <input
              className="note"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type="button" className="auth-pass-toggle" onClick={() => setShow((value) => !value)}>
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        {error ? <div className="auth-error">{error}</div> : null}
        <button className="cta" type="submit" disabled={busy || !email.trim() || password.length < 8}>
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <div className="auth-or">or</div>
      <GoogleButton onClick={onGoogle} disabled={busy} />
      <p className="auth-switch">
        Already have an account?{' '}
        <button className="link" type="button" onClick={onLogin}>
          Log in
        </button>
      </p>
    </div>
  );
}
