/* ==========================================================================
   Fluxa UI · Components · Toast
   Programmatic + declarative surface notifications.
     Fluxa.Toast.success('Saved')
     <button data-fx-toast data-fx-toast-type="success" ...>
   ========================================================================== */

import { qa, on, create } from '../core/dom.js';
import { register } from '../core/registry.js';
import { announce } from '../core/a11y.js';

const ICONS = {
  success:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  danger:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
  warning:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
};

let region = null;

function ensureRegion() {
  if (region && region.isConnected) return region;
  region = document.body.querySelector('.fx-toast-region');
  if (!region) {
    region = create('div', { class: 'fx-toast-region', 'aria-live': 'polite' });
    document.body.appendChild(region);
  }
  return region;
}

function buildToast({ title, body = '', type = 'success', duration = 4200, onClose }) {
  const el = create('div', { class: `fx-toast fx-toast-${type}`, role: 'status' });

  const icon = create('span', { class: 'fx-toast-icon' });
  icon.innerHTML = ICONS[type] || ICONS.info;

  const content = create('div', { class: 'fx-toast-content' });
  if (title) content.appendChild(create('div', { class: 'fx-toast-title', text: title }));
  if (body) content.appendChild(create('div', { class: 'fx-toast-body', text: body }));

  const close = create('button', {
    class: 'fx-toast-close',
    type: 'button',
    'aria-label': 'Dismiss notification'
  });
  close.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';

  el.appendChild(icon);
  el.appendChild(content);
  el.appendChild(close);
  ensureRegion().appendChild(el);

  function dismiss() {
    if (el.getAttribute('data-fx-leaving')) return;
    el.setAttribute('data-fx-leaving', '');
    el.addEventListener('animationend', () => {
      el.remove();
      if (typeof onClose === 'function') onClose(el);
    });
  }

  let timer = null;
  if (duration > 0) {
    timer = setTimeout(dismiss, duration);
  }

  on(close, 'click', () => {
    clearTimeout(timer);
    dismiss();
  });

  return el;
}

export const Toast = {
  name: 'Toast',

  show({ title, body, type = 'info', duration, onClose } = {}) {
    return buildToast({ title, body: body || '', type, duration, onClose });
  },

  success(title, body, duration) {
    return buildToast({ title, body: body || '', type: 'success', duration });
  },
  danger(title, body, duration) {
    return buildToast({ title, body: body || '', type: 'danger', duration });
  },
  warning(title, body, duration) {
    return buildToast({ title, body: body || '', type: 'warning', duration });
  },
  info(title, body, duration) {
    return buildToast({ title, body: body || '', type: 'info', duration });
  },

  bind(root) {
    qa('[data-fx-toast]', root).forEach((trigger) => {
      if (trigger.dataset.fxToastBound === '') return;
      trigger.dataset.fxToastBound = '';

      on(trigger, 'click', () => {
        const title = trigger.getAttribute('data-fx-toast-title') || trigger.getAttribute('data-fx-toast') || '';
        buildToast({
          title,
          body: trigger.getAttribute('data-fx-toast-body') || '',
          type: trigger.getAttribute('data-fx-toast-type') || 'info',
          duration: Number(trigger.getAttribute('data-fx-toast-duration')) || 4200
        });
        announce(title || 'Notification');
      });
    });
  }
};

register(Toast);