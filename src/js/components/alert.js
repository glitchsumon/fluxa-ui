/* ==========================================================================
   Fluxa UI · Components · Alert
   Dismissible alerts: wire .fx-alert-dismiss / [data-fx-alert-close] buttons.
   ========================================================================== */

import { qa, on } from '../core/dom.js';
import { register } from '../core/registry.js';

const bound = new WeakSet();

export const Alert = {
  name: 'Alert',

  dismiss(trigger) {
    const alert = trigger.closest('.fx-alert');
    if (!alert || alert.getAttribute('data-fx-leaving')) return;
    alert.setAttribute('data-fx-leaving', '');
    alert.addEventListener(
      'transitionend',
      () => {
        alert.remove();
        alert.dispatchEvent(new CustomEvent('fx:dismissed', { bubbles: true }));
      },
      { once: true }
    );
    setTimeout(() => {
      if (alert.isConnected) {
        alert.remove();
        alert.dispatchEvent(new CustomEvent('fx:dismissed', { bubbles: true }));
      }
    }, 350);
  },

  bind(root) {
    qa('.fx-alert', root).forEach((alert) => {
      if (bound.has(alert)) return;
      bound.add(alert);
      qa('.fx-alert-dismiss, [data-fx-alert-close]', alert).forEach((btn) => {
        on(btn, 'click', () => this.dismiss(btn));
      });
    });
  }
};

register(Alert);