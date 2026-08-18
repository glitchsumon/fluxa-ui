/* ==========================================================================
   Fluxa UI · Components · Navbar (mobile collapse) & Sidebar (rail)
   ========================================================================== */

import { qa, on } from '../core/dom.js';
import { register } from '../core/registry.js';
import { KEYS } from '../core/keyboard.js';

const bound = new WeakSet();

/* ------------------------------------------------------------------
   Navbar — toggles the mobile nav list
   ------------------------------------------------------------------ */
export const Navbar = {
  name: 'Navbar',

  bind(root) {
    qa('.fx-navbar', root).forEach((navbar) => {
      if (bound.has(navbar)) return;
      bound.add(navbar);

      const toggle = navbar.querySelector('.fx-navbar-toggle');
      const nav = navbar.querySelector('.fx-navbar-nav');
      if (!toggle || !nav) return;

      toggle.setAttribute('aria-expanded', 'false');
      if (!nav.id) nav.id = `fx-nav-${Math.random().toString(36).slice(2, 8)}`;
      toggle.setAttribute('aria-controls', nav.id);

      on(toggle, 'click', () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });

      /* close on Escape */
      on(document, 'keydown', (event) => {
        if (event.key === KEYS.ESCAPE && nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      });

      /* close when a link is chosen */
      qa('.fx-navbar-link', nav).forEach((link) => {
        on(link, 'click', () => {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    });
  }
};

/* ------------------------------------------------------------------
   Sidebar — mobile overlay toggle
   ------------------------------------------------------------------ */
export const Sidebar = {
  name: 'Sidebar',

  bind(root) {
    qa('.fx-sidebar', root).forEach((sidebar) => {
      if (bound.has(sidebar)) return;
      bound.add(sidebar);

      const context = sidebar.closest('.fx-sidebar-context') || sidebar.parentElement;
      const toggles = qa('[data-fx-sidebar-toggle]', root).filter((el) => {
        const target = el.getAttribute('data-fx-sidebar-toggle');
        return !target || target === `#${sidebar.id}`;
      });

      toggles.forEach((toggle) => {
        if (bound.has(toggle)) return;
        bound.add(toggle);

        const backdrop = createBackdrop(context);
        let prevFocus = null;

        on(toggle, 'click', () => {
          const open = sidebar.getAttribute('data-fx-open') !== 'true';
          sidebar.setAttribute('data-fx-open', String(open));
          if (open) {
            prevFocus = document.activeElement;
            backdrop.style.pointerEvents = 'auto';
            backdrop.style.opacity = '1';
          } else {
            backdrop.style.opacity = '0';
            backdrop.style.pointerEvents = 'none';
            if (prevFocus && document.contains(prevFocus)) prevFocus.focus();
          }
        });

        on(backdrop, 'click', () => {
          sidebar.setAttribute('data-fx-open', 'false');
          backdrop.style.opacity = '0';
          backdrop.style.pointerEvents = 'none';
        });

        on(document, 'keydown', (event) => {
          if (event.key === KEYS.ESCAPE && sidebar.getAttribute('data-fx-open') === 'true') {
            sidebar.setAttribute('data-fx-open', 'false');
            backdrop.style.opacity = '0';
            backdrop.style.pointerEvents = 'none';
            if (prevFocus && document.contains(prevFocus)) prevFocus.focus();
          }
        });
      });
    });
  }
};

function createBackdrop(context) {
  let backdrop = context.querySelector('.fx-sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'fx-sidebar-backdrop';
    context.appendChild(backdrop);
  }
  return backdrop;
}

register(Navbar);
register(Sidebar);