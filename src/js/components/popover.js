/* ==========================================================================
   Fluxa UI · Components · Popover
   Click-triggered rich panel. Reuses the dropdown float engine.
     <button data-fx-popover="#pop"> … </button>
     <div id="pop" class="fx-popover" data-fx-popover-root> … </div>
   ========================================================================== */

import { qa, on } from '../core/dom.js';
import { applyFloat } from '../core/float.js';
import { register } from '../core/registry.js';
import { KEYS } from '../core/keyboard.js';

const bound = new WeakSet();
const openStates = new Map();

export const Popover = {
  name: 'Popover',

  open(trigger, popoverEl, placement) {
    const previous = openStates.get(popoverEl);
    if (previous) previous.close();

    popoverEl.setAttribute('data-fx-open', 'true');
    applyFloat(trigger, popoverEl, {
      placement: placement || 'bottom-start',
      offset: 8,
      strategy: 'fixed'
    });

    const cleanup = [
      on(window, 'resize', () => {
        if (popoverEl.getAttribute('data-fx-open') === 'true') {
          applyFloat(trigger, popoverEl, {
            placement: placement || 'bottom-start',
            offset: 8,
            strategy: 'fixed'
          });
        }
      })
    ];

    const close = () => {
      popoverEl.setAttribute('data-fx-open', 'false');
      openStates.delete(popoverEl);
      cleanup.forEach((fn) => fn());
    };

    cleanup.push(
      on(document, 'mousedown', (event) => {
        if (!trigger.contains(event.target) && !popoverEl.contains(event.target)) close();
      })
    );
    cleanup.push(
      on(document, 'keydown', (event) => {
        if (event.key === KEYS.ESCAPE) {
          event.stopPropagation();
          close();
          trigger.focus();
        }
      }, true)
    );

    openStates.set(popoverEl, { close });
    return { close };
  },

  closeAll() {
    openStates.forEach((state) => state && state.close());
  },

  bind(root) {
    qa('[data-fx-popover]', root).forEach((trigger) => {
      if (bound.has(trigger)) return;
      const popoverEl = document.querySelector(trigger.getAttribute('data-fx-popover'));
      if (!popoverEl) return;

      bound.add(trigger);
      on(trigger, 'click', (event) => {
        event.stopPropagation();
        if (popoverEl.getAttribute('data-fx-open') === 'true') {
          const state = openStates.get(popoverEl);
          if (state) state.close();
          return;
        }
        this.closeAll();
        this.open(trigger, popoverEl, trigger.getAttribute('data-fx-placement'));
      });
    });

    qa('.fx-popover', root).forEach((popoverEl) => {
      if (bound.has(popoverEl)) return;
      bound.add(popoverEl);
      qa('.fx-popover-close, [data-fx-popover-close]', popoverEl).forEach((btn) => {
        on(btn, 'click', () => {
          popoverEl.setAttribute('data-fx-open', 'false');
          openStates.delete(popoverEl);
        });
      });
    });
  }
};

register(Popover);