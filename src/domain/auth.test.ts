import { describe, expect, it } from 'vitest';
import {
  createEmailAccount,
  isValidEmail,
  nameFromEmail,
  normalizeEmail,
  upsertGoogleAccount,
  verifyEmailLogin,
} from './auth';

describe('email helpers', () => {
  it('normalises and validates', () => {
    expect(normalizeEmail('  Ada@Hush.app ')).toBe('ada@hush.app');
    expect(isValidEmail('ada@hush.app')).toBe(true);
    expect(isValidEmail('nope')).toBe(false);
  });

  it('builds a name from the local part', () => {
    expect(nameFromEmail('gokul.krishnan@gmail.com')).toBe('Gokul Krishnan');
  });
});

describe('upsertGoogleAccount', () => {
  it('creates a Google account from an email', () => {
    const { account } = upsertGoogleAccount([], { email: 'gokul@gmail.com' });
    expect(account.provider).toBe('google');
    expect(account.email).toBe('gokul@gmail.com');
  });
});

describe('email accounts', () => {
  it('creates and verifies a password', async () => {
    const account = await createEmailAccount([], {
      name: 'Ada',
      email: 'ada@hush.app',
      password: 'quietpass',
    });
    expect(account.provider).toBe('email');
    const same = await verifyEmailLogin([account], { email: 'ada@hush.app', password: 'quietpass' });
    expect(same.id).toBe(account.id);
    await expect(verifyEmailLogin([account], { email: 'ada@hush.app', password: 'wrongpass' })).rejects.toThrow(
      'Email or password is not right.',
    );
  });

  it('rejects a short password and a duplicate email', async () => {
    const first = await createEmailAccount([], {
      name: 'Ada',
      email: 'ada@hush.app',
      password: 'quietpass',
    });
    await expect(
      createEmailAccount([], { name: 'Ada', email: 'ada@hush.app', password: 'short' }),
    ).rejects.toThrow('Use at least 8 characters');
    await expect(
      createEmailAccount([first], { name: 'Ada', email: 'ada@hush.app', password: 'quietpass' }),
    ).rejects.toThrow('already has an account');
  });
});
