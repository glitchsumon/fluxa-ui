/* ==========================================================================
   Fluxa UI · Components · Modal
   Open/close modals declaratively or imperatively.
     Fluxa.Modal.open('#confirm')      Fluxa.Modal.close('#confirm')
     <button data-fx-modal="#confirm">Open</button>
   ========================================================================== */

import { qa, on } from '../core/dom.js';
import { openOverlay } from '../core/overlay.js';
import { register } from '../core/registry.js';

const bound = new WeakSet();
const instances = new WeakMap();

function resolve(el) {
  return typeof el === 'string' ? document.querySelector(el) : el;
}

function open(modalEl) {
  const modal = resolve(modalEl);
  if (!modal || modal.getAttribute('data-fx-open') === 'true') return;

  if (!modal.hasAttribute('role')) {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    const title = modal.querySelector('.fx-modal-title') || modal.querySelector('.fx-drawer-title');
    if (title && title.id) {
      modal.setAttribute('aria-labelledby', title.id);
    }
  }

  const instance = openOverlay(modal, {
    announcer: () => modal.getAttribute('aria-label') || 'Dialog opened'
  });
  instances.set(modal, instance);
}

function close(modalEl) {
  const modal = resolve(modalEl);
  if (!modal) return;
  const instance = instances.get(modal);
  if (instance) instance.close();
}

export const Modal = {
  name: 'Modal',
  open,
  close,

  bind(root) {
    qa('[data-fx-modal]', root).forEach((trigger) => {
      if (!trigger || bound.has(trigger)) return;
      bound.add(trigger);
      on(trigger, 'click', () => open(trigger.getAttribute('data-fx-modal')));
    });

    qa('.fx-modal', root).forEach((modal) => {
      if (!modal || bound.has(modal)) return;
      bound.add(modal);
      modal.setAttribute('data-fx-open', 'false');

      qa('.fx-modal-close, [data-fx-modal-close]', modal).forEach((btn) => {
        if (!btn || bound.has(btn)) return;
        bound.add(btn);
        on(btn, 'click', () => close(modal));
      });

      const backdrop = modal.querySelector('.fx-modal-backdrop');
      if (backdrop) {
        on(backdrop, 'click', () => close(modal));
      }
    });
  }
};

register(Modal);