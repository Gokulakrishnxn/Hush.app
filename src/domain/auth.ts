import type { Account, AuthProvider, Session } from './types';

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export function nameFromEmail(email: string): string {
  const local = normalizeEmail(email).split('@')[0] ?? '';
  const cleaned = local.replace(/[._-]+/g, ' ').trim();
  if (!cleaned) return 'There';
  return cleaned.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function hashSecret(value: string, salt: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${salt}:${value}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function newSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function sessionFrom(account: Account): Session {
  return {
    accountId: account.id,
    email: account.email,
    name: account.name,
    provider: account.provider,
  };
}

export function findAccount(accounts: readonly Account[], email: string): Account | undefined {
  const needle = normalizeEmail(email);
  return accounts.find((account) => account.email === needle);
}

export async function createEmailAccount(
  accounts: readonly Account[],
  input: { name: string; email: string; password: string },
): Promise<Account> {
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) throw new Error('Enter a valid email address.');
  if (input.password.length < 8) throw new Error('Use at least 8 characters for your password.');
  if (findAccount(accounts, email)) throw new Error('That email already has an account. Log in instead.');
  const name = input.name.trim() || nameFromEmail(email);
  const salt = newSalt();
  const passwordHash = await hashSecret(input.password, salt);
  return {
    id: `acc-${Date.now()}`,
    email,
    name,
    provider: 'email',
    salt,
    passwordHash,
  };
}

export async function verifyEmailLogin(
  accounts: readonly Account[],
  input: { email: string; password: string },
): Promise<Account> {
  const account = findAccount(accounts, input.email);
  if (!account || account.provider !== 'email' || !account.salt || !account.passwordHash) {
    throw new Error('Email or password is not right.');
  }
  const next = await hashSecret(input.password, account.salt);
  if (next !== account.passwordHash) throw new Error('Email or password is not right.');
  return account;
}

export function upsertGoogleAccount(
  accounts: readonly Account[],
  input: { email: string; name?: string },
): { account: Account; accounts: Account[] } {
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) throw new Error('Enter the Google email you use.');
  const existing = findAccount(accounts, email);
  if (existing) {
    const account = {
      ...existing,
      name: input.name?.trim() || existing.name,
      provider: existing.provider === 'email' ? existing.provider : ('google' as AuthProvider),
    };
    return {
      account,
      accounts: accounts.map((row) => (row.id === account.id ? account : row)),
    };
  }
  const account: Account = {
    id: `acc-${Date.now()}`,
    email,
    name: input.name?.trim() || nameFromEmail(email),
    provider: 'google',
  };
  return { account, accounts: [...accounts, account] };
}
