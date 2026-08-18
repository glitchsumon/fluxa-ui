/* ==========================================================================
   Fluxa UI · Components · Theme (dark mode)
   Supports light / dark / system with persistence and live toggling.
     Fluxa.Theme.set('dark')    Fluxa.Theme.toggle()
     <button data-fx-theme-toggle> … </button>
   ========================================================================== */

import { qa, on } from '../core/dom.js';
import { register } from '../core/registry.js';

const STORAGE_KEY = 'fx-theme';

function readSystem() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolve(theme) {
  return theme === 'system' ? readSystem() : theme || readSystem();
}

function apply(theme, announceTo) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  qa('[data-fx-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', resolve(theme) === 'dark' ? 'true' : 'false');
  });
  if (announceTo) announceTo.textContent = theme;
  document.dispatchEvent(new CustomEvent('fx:theme', { detail: { theme } }));
}

export const Theme = {
  name: 'Theme',

  get() {
    return document.documentElement.getAttribute('data-theme') || 'system';
  },

  set(theme) {
    const t = theme === 'dark' || theme === 'light' ? theme : 'system';
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* private mode — ignore */
    }
    apply(t);
    return t;
  },

  toggle() {
    const next = resolve(this.get()) === 'dark' ? 'light' : 'dark';
    this.set(next);
    return next;
  },

  init() {
    let saved = 'system';
    try {
      saved = localStorage.getItem(STORAGE_KEY) || 'system';
    } catch {
      /* ignore */
    }
    apply(saved);

    /* live sync when using system preference */
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => {
        if (this.get() === 'system') apply('system');
      };
      if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
      else if (typeof mq.addListener === 'function') mq.addListener(onChange);
    }
  },

  bind(root) {
    qa('[data-fx-theme-toggle]', root).forEach((btn) => {
      if (btn.dataset.fxThemeBound === '') return;
      btn.dataset.fxThemeBound = '';
      btn.setAttribute('role', 'button');
      on(btn, 'click', () => this.toggle());
    });
  }
};

register(Theme);