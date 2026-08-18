/* ==========================================================================
   Fluxa UI · Core · Menu keyboard navigation
   Arrow keys, Home/End and Enter activation for menulik surfaces.
   ========================================================================== */

import { on } from './dom.js';
import { cycleIndex, KEYS } from './keyboard.js';

export function getMenuItems(menu) {
  return Array.from(
    menu.querySelectorAll('[role="menuitem"], [role="option"], .fx-menu-item, .fx-command-item')
  ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true');
}

export function highlightItem(item, menu) {
  getMenuItems(menu).forEach((el) => el.removeAttribute('data-highlighted'));
  if (item) item.setAttribute('data-highlighted', '');
}

export function wireMenuKeyboard({
  menu,
  onActivate,
  shouldActivateOnEnter = true,
  initialFocusItem = null
}) {
  const handlers = {
    [KEYS.ARROW_DOWN]: (event, item, index) => {
      event.preventDefault();
      const next = cycleIndex(getMenuItems(menu), index, 1);
      menuItems()[next]?.focus();
    },
    [KEYS.ARROW_UP]: (event, item, index) => {
      event.preventDefault();
      const next = cycleIndex(getMenuItems(menu), index, -1);
      menuItems()[next]?.focus();
    },
    [KEYS.HOME]: (event) => {
      event.preventDefault();
      menuItems()[0]?.focus();
    },
    [KEYS.END]: (event) => {
      event.preventDefault();
      menuItems()[menuItems().length - 1]?.focus();
    },
    [KEYS.ENTER]: (event, item) => {
      if (shouldActivateOnEnter) {
        event.preventDefault();
        if (typeof onActivate === 'function') onActivate(item);
      }
    }
  };

  function menuItems() {
    return getMenuItems(menu);
  }

  const cleanup = on(menu, 'keydown', (event) => {
    const current = getMenuItems(menu);
    const index = current.indexOf(document.activeElement);
    const handler = handlers[event.key];
    if (!handler) return;
    if (event.key === KEYS.ENTER) {
      const item = current.find((el) => el === document.activeElement);
      if (item) handler(event, item);
      return;
    }
    handler(event, document.activeElement, index);
  });

  if (initialFocusItem) initialFocusItem.focus();

  return { menuItems, cleanup };
}