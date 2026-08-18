/* ==========================================================================
   Fluxa UI · Components · Dropdown / Context menu / Popover
   Two markup conventions:
     A) container mode <div class="fx-dropdown">trigger + .fx-dropdown-menu</div>
     B) external trigger <button data-fx-dropdown="#menuId">
   ========================================================================== */

import { qa, on } from '../core/dom.js';
import { applyFloat } from '../core/float.js';
import { register } from '../core/registry.js';
import { wireMenuKeyboard, getMenuItems } from '../core/menu-keyboard.js';
import { KEYS } from '../core/keyboard.js';

const bound = new WeakSet();
const openStates = new Map();

function getInitialTrigger(container) {
  return (
    container.querySelector('.fx-dropdown-trigger') ||
    container.querySelector('[data-fx-dropdown-toggle]') ||
    container.querySelector(':scope > button') ||
    container.querySelector('button')
  );
}

function referenceContains(trigger, menu, target) {
  if (trigger && trigger.contains(target)) return true;
  if (menu && menu.contains(target)) return true;
  return false;
}

function closeAll() {
  openStates.forEach((state) => state && state.close());
}

export function openAt(trigger, menu, placement) {
  const existing = openStates.get(menu);
  if (existing) {
    existing.close();
  }

  menu.setAttribute('data-fx-open', 'true');
  menu.style.visibility = '';

  const place = () => {
    applyFloat(trigger, menu, {
      placement: typeof placement === 'string' ? placement : 'bottom-start',
      offset: 6,
      strategy: 'absolute'
    });
  };

  nextPaint(place);

  const cleanup = [];
  cleanup.push(
    on(window, 'resize', () => {
      if (menu.getAttribute('data-fx-open') !== 'true') return;
      place();
    })
  );
  cleanup.push(
    on(window, 'scroll', place, true)
  );

  const close = () => {
    menu.setAttribute('data-fx-open', 'false');
    menu.style.visibility = 'hidden';
    openStates.delete(menu);
    cleanup.forEach((fn) => fn());
  };

  const outside = on(document, 'mousedown', (event) => {
    if (!referenceContains(trigger, menu, event.target)) close();
  });
  cleanup.push(outside);

  const escape = on(document, 'keydown', (event) => {
    if (event.key === KEYS.ESCAPE) {
      event.stopPropagation();
      close();
      if (trigger && document.contains(trigger)) trigger.focus();
    }
  }, true);
  cleanup.push(escape);

  wireMenuKeyboard({
    menu,
    initialFocusItem: getMenuItems(menu)[0],
    onActivate(item) {
      item.click();
      close();
      if (trigger && document.contains(trigger)) trigger.focus();
    }
  });

  openStates.set(menu, { close, menu, open: true });
  return { close };
}

function nextPaint(fn) {
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(fn);
  else setTimeout(fn, 0);
}

function syncContainerState(menu) {
  const container = menu.closest('.fx-dropdown');
  if (container) {
    container.setAttribute('data-fx-open', menu.getAttribute('data-fx-open') === 'true' ? 'true' : 'false');
  }
}

export const Dropdown = {
  name: 'Dropdown',
  open: openAt,
  closeAll,

  bind(root) {
    /* Container mode */
    qa('.fx-dropdown', root).forEach((container) => {
      if (bound.has(container)) return;
      const trigger = getInitialTrigger(container);
      const menu = container.querySelector(MENU_SELECTOR);
      if (!menu || !trigger) return;

      bound.add(container);
      container.setAttribute('data-fx-open', 'false');

      on(trigger, 'click', (event) => {
        event.stopPropagation();
        if (menu.getAttribute('data-fx-open') === 'true') {
          const state = openStates.get(menu);
          if (state) state.close();
          syncContainerState(menu);
          return;
        }
        closeAll();
        openAt(trigger, menu, container.getAttribute('data-fx-placement') || 'bottom-start');
        syncContainerState(menu);
      });
    });

    /* External trigger button */
    qa('[data-fx-dropdown]', root).forEach((trigger) => {
      if (!trigger || !trigger.getAttribute || trigger.closest('.fx-dropdown')) return;
      if (bound.has(trigger)) return;

      const menu = document.querySelector(trigger.getAttribute('data-fx-dropdown'));
      if (!menu) return;

      bound.add(trigger);
      on(trigger, 'click', (event) => {
        event.stopPropagation();
        if (menu.getAttribute('data-fx-open') === 'true') {
          const state = openStates.get(menu);
          if (state) state.close();
          return;
        }
        closeAll();
        openAt(trigger, menu, trigger.getAttribute('data-fx-placement') || 'bottom-end');
      });
    });

    /* Context menu on any element */
    qa('[data-fx-context]', root).forEach((trigger) => {
      if (bound.has(trigger)) return;
      const menu = document.querySelector(trigger.getAttribute('data-fx-context'));
      if (!menu) return;

      bound.add(trigger);
      on(trigger, 'contextmenu', (event) => {
        event.preventDefault();
        closeAll();
        openAt(trigger, menu, 'bottom-start');
        menu.style.position = 'fixed';
        positionAtCursor(event, menu);
      });
    });
  }
};

function positionAtCursor(event, menu) {
  const left = Math.min(event.clientX, window.innerWidth - menu.offsetWidth - 8);
  const top = Math.min(event.clientY, window.innerHeight - menu.offsetHeight - 8);
  menu.style.left = `${Math.max(8, left)}px`;
  menu.style.top = `${Math.max(8, top)}px`;
}

const MENU_SELECTOR = '.fx-dropdown-menu, .fx-menu';

register(Dropdown);