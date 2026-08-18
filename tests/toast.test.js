/* ==========================================================================
   Fluxa UI · Tests · Toast
   ========================================================================== */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Toast } from '../src/js/components/toast.js';
import { resetDom } from './setup.js';

describe('Toast', () => {
  beforeEach(() => Toast);
  afterEach(() => resetDom());

  it('renders a toast into a live region', () => {
    Toast.show({ title: 'Saved', type: 'success' });
    expect(document.querySelector('.fx-toast-region')).toBeTruthy();
    expect(document.querySelector('.fx-toast-region').getAttribute('aria-live')).toBe('polite');
    expect(document.querySelector('.fx-toast .fx-toast-title').textContent).toBe('Saved');
    expect(document.querySelector('.fx-toast').className).toContain('fx-toast-success');
  });

  it('includes optional body and role=status', () => {
    const el = Toast.success('Hello', 'This is the body');
    expect(el.getAttribute('role')).toBe('status');
    expect(document.querySelector('.fx-toast-body').textContent).toBe('This is the body');
  });

  it('dismisses on close click and reuses the region', () => {
    Toast.show({ title: 'A', type: 'info' });
    Toast.show({ title: 'B', type: 'info' });
    const region = document.querySelector('.fx-toast-region');
    const toasts = region.querySelectorAll('.fx-toast');
    expect(toasts.length).toBe(2);

    const first = toasts[0];
    first.querySelector('.fx-toast-close').click();
    expect(first.getAttribute('data-fx-leaving')).toBe('');
    first.dispatchEvent(new Event('animationend'));
    expect(region.querySelectorAll('.fx-toast').length).toBe(1);
  });

  it('fires onClose when dismissed', () => {
    const onClose = vi.fn();
    const el = Toast.show({ title: 'X', type: 'info', onClose });
    el.querySelector('.fx-toast-close').click();
    el.dispatchEvent(new Event('animationend'));
    expect(onClose).toHaveBeenCalledWith(el);
  });

  it('auto-dismisses after the duration', () => {
    vi.useFakeTimers();
    try {
      const el = Toast.show({ title: 'Timer', type: 'info', duration: 120 });
      expect(el.getAttribute('data-fx-leaving')).toBeNull();
      vi.advanceTimersByTime(121);
      expect(el.getAttribute('data-fx-leaving')).toBe('');
    } finally {
      vi.useRealTimers();
    }
  });

  it('supports declarative data-fx-toast triggers', () => {
    document.body.innerHTML = `
      <button data-fx-toast="Updated" data-fx-toast-type="success">Notify</button>
    `;
    Toast.bind(document);
    document.querySelector('button').click();
    expect(document.querySelector('.fx-toast-title').textContent).toBe('Updated');
    expect(document.querySelector('.fx-toast').className).toContain('fx-toast-success');
  });
});