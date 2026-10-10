import { describe, expect, it } from 'vitest';
import { formatINR, parseAmount, pressKeypad } from './money';

describe('formatINR', () => {
  it('groups digits the Indian way', () => {
    expect(formatINR(124000)).toBe('₹1,24,000');
  });

  it('hides amounts on request', () => {
    expect(formatINR(180, true)).toBe('₹••••');
  });
});

describe('keypad', () => {
  it('replaces a leading zero', () => {
    expect(pressKeypad('0', '1')).toBe('1');
  });

  it('keeps two decimal places', () => {
    expect(pressKeypad('12.3', '4')).toBe('12.34');
    expect(pressKeypad('12.34', '5')).toBe('12.34');
  });

  it('parses a usable amount', () => {
    expect(parseAmount('0')).toBe(0);
    expect(parseAmount('180.5')).toBe(180.5);
  });
});
