/* ==========================================================================
   Fluxa UI · Core · Float positioning
   Positions floating elements relative to a trigger with viewport
   flipping + shifting. Supports both absolute and fixed containers.
   ========================================================================== */

import { rect } from './dom.js';

const MARGIN = 8;

function axisOf(placement) {
  if (placement.startsWith('top') || placement.startsWith('bottom')) return 'y';
  return 'x';
}

function primary(placement) {
  const p = placement.split('-')[0];
  if (p === 'auto') return null;
  return p;
}

function idealBox(triggerRect, floatW, floatH, placement, offset) {
  const top = placement.startsWith('top') || placement === 'start' || placement === 'end';
  const mainY = ['top', 'bottom'].includes(primary(placement)) || placement === 'auto';
  const box = { left: 0, top: 0, width: floatW, height: floatH };

  if (mainY) {
    const flip = placement.startsWith('top');
    box.top = flip ? triggerRect.top - floatH - offset : triggerRect.bottom + offset;
    const align = placement.endsWith('-start') ? 'start' : placement.endsWith('-end') ? 'end' : 'center';
    if (align === 'start') box.left = triggerRect.left;
    else if (align === 'end') box.left = triggerRect.right - floatW;
    else box.left = triggerRect.left + triggerRect.width / 2 - floatW / 2;
  } else {
    const flip = placement.startsWith('start') || placement === 'left';
    box.left = flip ? triggerRect.left - floatW - offset : triggerRect.right + offset;
    const align = placement.endsWith('-start') ? 'start' : placement.endsWith('-end') ? 'end' : 'center';
    if (align === 'start') box.top = triggerRect.top;
    else if (align === 'end') box.top = triggerRect.bottom - floatH;
    else box.top = triggerRect.top + triggerRect.height / 2 - floatH / 2;
  }

  return { box, top };
}

function opposite(placement) {
  const p = placement.split('-')[0];
  const map = { top: 'bottom', bottom: 'top', start: 'end', end: 'start', left: 'right', right: 'left' };
  const base = map[p] || p;
  const suffix = placement.includes('-') ? `-${placement.split('-')[1]}` : '';
  return base + suffix;
}

export function computeFloat(triggerEl, floatEl, options = {}) {
  const {
    placement: requested = 'bottom-start',
    offset = 4,
    autoFlip = true,
    autoShift = true,
    strategy = 'absolute'
  } = options;

  const triggerRect = rect(triggerEl);
  const floatW = floatEl.offsetWidth || 0;
  const floatH = floatEl.offsetHeight || 0;

  let placement = requested;
  if (placement === 'auto' || placement.startsWith('auto-')) {
    placement = autoFlip ? 'bottom-start' : 'bottom-start';
  }

  const vw = window.innerWidth || document.documentElement.clientWidth;
  const vh = window.innerHeight || document.documentElement.clientHeight;

  let { box } = idealBox(triggerRect, floatW, floatH, placement, offset);

  if (autoFlip && axisOf(placement) === 'y') {
    const overBottom = box.top + floatH > vh - MARGIN && triggerRect.top > vh / 2;
    const overTop = box.top < MARGIN && triggerRect.bottom < vh / 2;
    if (overBottom || overTop) {
      placement = opposite(placement);
      const result = idealBox(triggerRect, floatW, floatH, placement, offset);
      box = result.box;
    }
  }

  if (autoFlip && axisOf(placement) === 'x') {
    const overRight = box.left + floatW > vw - MARGIN && triggerRect.left > vw / 2;
    const overLeft = box.left < MARGIN && triggerRect.right < vw / 2;
    if (overRight || overLeft) {
      placement = opposite(placement);
      const result = idealBox(triggerRect, floatW, floatH, placement, offset);
      box = result.box;
    }
  }

  if (autoShift) {
    box.left = Math.max(MARGIN, Math.min(box.left, vw - floatW - MARGIN));
    box.top = Math.max(MARGIN, Math.min(box.top, vh - floatH - MARGIN));
  }

  if (strategy === 'absolute' && floatEl.offsetParent) {
    /* Convert viewport coords to the offsetParent's coordinate space */
    const parentRect = rect(floatEl.offsetParent);
    box.left -= parentRect.left;
    box.top -= parentRect.top;
  }

  return { left: box.left, top: box.top, placement };
}

export function applyFloat(triggerEl, floatEl, options = {}) {
  const { left, top, placement } = computeFloat(triggerEl, floatEl, options);
  floatEl.style.left = `${left}px`;
  floatEl.style.top = `${top}px`;
  floatEl.setAttribute('data-placement', placement);
  return { left, top, placement };
}