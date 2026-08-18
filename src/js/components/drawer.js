/* ==========================================================================
   Fluxa UI · Components · Drawer
   Slide-in side panels controlled by data-fx-drawer triggers.
   ========================================================================== */

import { qa, on } from '../core/dom.js';
import { openOverlay } from '../core/overlay.js';
import { register } from '../core/registry.js';

const bound = new WeakSet();
const instances = new WeakMap();

function resolve(el) {
  return typeof el === 'string' ? document.querySelector(el) : el;
}

function open(drawerEl) {
  const drawer = resolve(drawerEl);
  if (!drawer || drawer.getAttribute('data-fx-open') === 'true') return;

  if (!drawer.hasAttribute('role')) {
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    const title = drawer.querySelector('.fx-drawer-title') || drawer.querySelector('.fx-modal-title');
    if (title && title.id) drawer.setAttribute('aria-labelledby', title.id);
  }

  const instance = openOverlay(drawer, { scrollLock: true });
  instances.set(drawer, instance);
}

function close(drawerEl) {
  const drawer = resolve(drawerEl);
  if (!drawer) return;
  const instance = instances.get(drawer);
  if (instance) instance.close();
}

export const Drawer = {
  name: 'Drawer',
  open,
  close,

  bind(root) {
    qa('[data-fx-drawer]', root).forEach((trigger) => {
      if (!trigger || bound.has(trigger)) return;
      bound.add(trigger);
      on(trigger, 'click', () => open(trigger.getAttribute('data-fx-drawer')));
    });

    qa('.fx-drawer', root).forEach((drawer) => {
      if (!drawer || bound.has(drawer)) return;
      bound.add(drawer);
      drawer.setAttribute('data-fx-open', 'false');

      qa('.fx-drawer-close, [data-fx-drawer-close]', drawer).forEach((btn) => {
        if (!btn || bound.has(btn)) return;
        bound.add(btn);
        on(btn, 'click', () => close(drawer));
      });

      const backdrop = drawer.querySelector('.fx-drawer-backdrop');
      if (backdrop) {
        on(backdrop, 'click', () => close(drawer));
      }
    });
  }
};

register(Drawer);