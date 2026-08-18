/* ==========================================================================
   Fluxa UI · Tests · Theme
   ========================================================================== */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Theme } from '../src/js/components/theme.js';
import { resetDom } from './setup.js';

describe('Theme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.body.innerHTML = `<button data-fx-theme-toggle>Theme</button>`;
  });
  afterEach(() => {
    Theme.bind(document);
    resetDom();
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  it('applies the incoming data-theme attribute', () => {
    Theme.set('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('defaults any non-light/dark value to system', () => {
    const result = Theme.set('octarine');
    expect(result).toBe('system');
    expect(document.documentElement.getAttribute('data-theme')).toBe('system');
  });

  it('persists the choice and returns it from get()', () => {
    Theme.set('dark');
    expect(localStorage.getItem('fx-theme')).toBe('dark');
    expect(Theme.get()).toBe('dark');
  });

  it('toggles between dark and light', () => {
    expect(Theme.toggle()).toBe('dark');
    expect(Theme.toggle()).toBe('light');
    expect(Theme.toggle()).toBe('dark');
  });

  it('fires an fx:theme event on change', () => {
    const onTheme = vi.fn();
    document.addEventListener('fx:theme', onTheme);
    Theme.set('dark');
    expect(onTheme).toHaveBeenCalledWith(expect.objectContaining({ detail: { theme: 'dark' } }));
    document.removeEventListener('fx:theme', onTheme);
  });

  it('wires data-fx-theme-toggle buttons and reflects aria-pressed', () => {
    Theme.bind(document);
    expect(Theme.get()).not.toBe('dark');
    document.querySelector('[data-fx-theme-toggle]').click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.querySelector('[data-fx-theme-toggle]').getAttribute('aria-pressed')).toBe('true');
  });
});