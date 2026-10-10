import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import type { Appearance } from '@/domain/types';

export function resolvedAppearance(appearance: Appearance): 'light' | 'dark' {
  if (appearance !== 'system') return appearance;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyAppearance(appearance: Appearance) {
  const resolved = resolvedAppearance(appearance);
  const root = document.documentElement;
  if (appearance === 'system') delete root.dataset.theme;
  else root.dataset.theme = appearance;

  const themeColor = resolved === 'dark' ? '#0B0B0D' : '#F2F2F4';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);

  if (!Capacitor.isNativePlatform()) return;
  void StatusBar.setStyle({ style: resolved === 'dark' ? Style.Dark : Style.Light });
  void StatusBar.setBackgroundColor({ color: themeColor });
}
