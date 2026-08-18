/* ==========================================================================
   Fluxa UI · Components · Tooltip
   Zero-JS-friendly markup via data-fx-tooltip. Appears on hover & focus.
   ========================================================================== */

import { qa, on, create } from '../core/dom.js';
import { applyFloat } from '../core/float.js';
import { register } from '../core/registry.js';
import { hasReducedMotion } from '../core/a11y.js';

const bound = new WeakSet();
const SHOW_DELAY = 80;
const HIDE_DELAY = 60;

function tooltipFor(trigger) {
  let tooltip = document.getElementById(`fx-tooltip-${trigger.dataset.fxTooltipId || ''}`) || null;
  if (!tooltip) {
    tooltip = create('div', {
      class: 'fx-tooltip',
      role: 'tooltip'
    });
    tooltip.textContent = trigger.getAttribute('data-fx-tooltip');
    trigger.dataset.fxTooltipId = trigger.dataset.fxTooltipId || Math.random().toString(36).slice(2, 8);
    tooltip.id = `fx-tooltip-${trigger.dataset.fxTooltipId}`;
  }
  if (!tooltip.isConnected) document.body.appendChild(tooltip);
  return tooltip;
}

function show(trigger) {
  const tooltip = tooltipFor(trigger);
  tooltip.setAttribute('data-fx-open', 'true');
  applyFloat(trigger, tooltip, {
    placement: trigger.getAttribute('data-fx-placement') || 'top',
    offset: 6 + trigger.getAttribute('data-fx-offset') || 6,
    strategy: 'fixed'
  });
}

function hide(trigger) {
  const tooltip = document.getElementById(`fx-tooltip-${trigger.dataset.fxTooltipId || ''}`);
  if (tooltip) tooltip.setAttribute('data-fx-open', 'false');
}

export const Tooltip = {
  name: 'Tooltip',
  express(el, message) {
    el.setAttribute('data-fx-tooltip', message);
    show(el);
  },

  bind(root) {
    qa('[data-fx-tooltip]', root).forEach((trigger) => {
      if (bound.has(trigger)) return;
      bound.add(trigger);

      let showTimer = null;
      let hideTimer = null;

      const clearTimers = () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };

      on(trigger, 'mouseenter', () => {
        clearTimers();
        showTimer = setTimeout(() => show(trigger), hasReducedMotion() ? 0 : SHOW_DELAY);
      });
      on(trigger, 'mouseleave', () => {
        clearTimers();
        hideTimer = setTimeout(() => hide(trigger), hasReducedMotion() ? 0 : HIDE_DELAY);
      });
      on(trigger, 'focus', () => {
        clearTimers();
        show(trigger);
      });
      on(trigger, 'blur', () => {
        clearTimers();
        hide(trigger);
      });
    });
  }
};

register(Tooltip);