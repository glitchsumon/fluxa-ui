/* ==========================================================================
   Fluxa UI · Core · Overlay wiring
   Shared behavior for focus-trapped surfaces: modals, drawers, popovers.
   Handles Escape, scroll lock, focus trap and focus restoration.
   ========================================================================== */

import { trapFocus } from './focus.js';
import { lockScroll } from './scroll.js';
import { announce } from './a11y.js';

const stack = [];

export function openOverlay(panel, { scrollLock = true, announcer = () => {} } = {}) {
  const doc = panel.ownerDocument || document;
  const prevActive = doc.activeElement;

  let trap = null;
  let unlock = null;
  let closed = false;

  if (scrollLock) unlock = lockScroll();
  trap = trapFocus(panel);

  panel.setAttribute('data-fx-open', 'true');
  announce(announcer() || panel.getAttribute('aria-label') || 'Dialog opened');

  const handleKeydown = (event) => {
    if (event.key !== 'Escape') return;
    const top = stack[stack.length - 1];
    if (top && top.panel === panel) {
      event.preventDefault();
      close();
    }
  };

  doc.addEventListener('keydown', handleKeydown, true);

  const focusTarget =
    panel.querySelector('[data-fx-autofocus]') ||
    panel.querySelector(
      'input:not([type="hidden"]), textarea, select, [tabindex]:not([tabindex="-1"]), button, a[href]'
    );
  if (focusTarget) focusTarget.focus();

  close.panel = panel;

  const entry = { panel, close };
  stack.push(entry);
  panel.dispatchEvent(new CustomEvent('fx:opened', { bubbles: true }));

  function close() {
    if (closed) return;
    closed = true;

    const index = stack.indexOf(entry);
    if (index > -1) stack.splice(index, 1);

    doc.removeEventListener('keydown', handleKeydown, true);
    if (trap) trap.restore();
    if (unlock) unlock();
    panel.setAttribute('data-fx-open', 'false');
    if (prevActive && doc.contains(prevActive)) {
      prevActive.focus();
    }
    announce(panel.getAttribute('aria-label') || 'Dialog closed');
    panel.dispatchEvent(new CustomEvent('fx:closed', { bubbles: true }));
  }

  /* Escape key handled by the stack — this listener mainly prevents
     the event from bubbling into other global handlers. */
  panel.addEventListener('fx:close', (event) => {
    event.preventDefault();
    close();
  });

  return { close };
}

export function getTopOverlay() {
  return stack[stack.length - 1] || null;
}