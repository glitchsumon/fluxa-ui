/* ==========================================================================
   Fluxa UI · Core · Scroll lock
   Prevents background page scroll while an overlay/drawer is open.
   ========================================================================== */

let locks = 0;
const states = new Map();

function readScrollbarWidth() {
  if (typeof document === 'undefined') return 0;
  const el = document.createElement('div');
  el.style.cssText = 'width:100px;height:100px;overflow:scroll;position:absolute;opacity:0';
  document.body.appendChild(el);
  const width = el.offsetWidth - el.clientWidth;
  document.body.removeChild(el);
  return width;
}

const NO_SCROLL = { overflow: 'hidden' };

export function lockScroll(root = document.body) {
  if (typeof document === 'undefined') return () => {};
  if (!root || root === document.body) {
    locks += 1;
    if (locks === 1) {
      const scrollbar = readScrollbarWidth();
      if (scrollbar) {
        document.body.style.paddingRight = `${scrollbar}px`;
      }
      document.body.classList.add('fx-scroll-lock');
    }
    return () => unlockScroll();
  }
  states.set(root, root.style.overflow);
  Object.assign(root.style, NO_SCROLL);
  return () => {
    const prev = states.get(root);
    root.style.overflow = prev || '';
    states.delete(root);
  };
}

export function unlockScroll(root = document.body) {
  if (!root || root === document.body) {
    locks = Math.max(0, locks - 1);
    if (locks === 0) {
      document.body.classList.remove('fx-scroll-lock');
      document.body.style.paddingRight = '';
    }
    return;
  }
  const prev = states.get(root);
  root.style.overflow = prev || '';
  states.delete(root);
}

export function isLocked() {
  return locks > 0 || (document.body && document.body.classList.contains('fx-scroll-lock'));
}