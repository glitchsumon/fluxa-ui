/* ==========================================================================
   Fluxa UI · Core · Keyboard
   Normalized key handling and key constants.
   ========================================================================== */

export const KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  DELETE: 'Delete',
  BACKSPACE: 'Backspace'
};

export function isKey(event, key) {
  return event.key === key;
}

export function isEscape(event) {
  return event.key === KEYS.ESCAPE;
}

export function isEnterOrSpace(event) {
  return event.key === KEYS.ENTER || event.key === KEYS.SPACE;
}

export function isModifierOnly(event) {
  return event.ctrlKey || event.metaKey || event.altKey;
}

export function isPrintable(key) {
  return key.length === 1;
}

/* cycle currently focused index within a collection, honoring enabled items */
export function cycleIndex(items, current, direction) {
  if (items.length === 0) return -1;
  let index = current + direction;
  index = (index + items.length) % items.length;
  let guard = items.length;
  while (guard-- > 0) {
    const item = items[index];
    if (item && !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true') {
      return index;
    }
    index = (index + direction + items.length) % items.length;
  }
  return current;
}