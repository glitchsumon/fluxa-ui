/* ==========================================================================
   Fluxa UI · Core · Accessibility helpers
   Screen-reader live region for status announcements.
   ========================================================================== */

let region = null;

function ensureRegion(doc) {
  if (region) return region;
  region = doc.body.querySelector('[data-fx-live-region]');
  if (region) return region;
  region = doc.createElement('div');
  region.setAttribute('data-fx-live-region', '');
  region.setAttribute('class', 'fx-visually-hidden');
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-atomic', 'true');
  doc.body.appendChild(region);
  return region;
}

export function announce(message, { polite = true, dir } = {}) {
  if (typeof document === 'undefined') return;
  const el = ensureRegion(document);
  el.setAttribute('aria-atomic', 'true');
  el.setAttribute('aria-live', polite ? 'polite' : 'assertive');
  if (dir) el.dir = dir;
  el.textContent = '';
  el.textContent = message;
}

export function focus(_opts) {
  return { announce, focus };
}

export function hasReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}