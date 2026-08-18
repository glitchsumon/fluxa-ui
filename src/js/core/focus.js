/* ==========================================================================
   Fluxa UI · Core · Focus management
   Focus traps for overlays and helpers to query focusable elements.
   ========================================================================== */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'audio[controls]',
  'video[controls]'
].join(',');

export function getFocusable(root) {
  return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}

export function trapFocus(container) {
  const doc = container.ownerDocument || document;
  const prevActive = doc.activeElement;

  const handleKeydown = (event) => {
    if (event.key !== 'Tab') return;
    const focusables = getFocusable(container);
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = doc.activeElement;

    if (event.shiftKey && (active === first || !container.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !container.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  };

  doc.addEventListener('keydown', handleKeydown, true);
  return {
    restore() {
      doc.removeEventListener('keydown', handleKeydown, true);
      if (prevActive && typeof prevActive.focus === 'function') {
        prevActive.focus();
      }
    }
  };
}