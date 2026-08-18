/* ==========================================================================
   Fluxa UI · Components · Accordion
   Optional single-open behavior. Height animations collapse smoothly.
   ========================================================================== */

import { qa, on, nextFrame } from '../core/dom.js';
import { register } from '../core/registry.js';
import { KEYS } from '../core/keyboard.js';

const bound = new WeakSet();
const MARGIN = 4; /* px buffer so borders don't clip */

function setHeight(content, open, animate = true) {
  if (!animate) {
    content.style.height = open ? 'auto' : '0px';
    content.style.opacity = open ? '1' : '0';
    return;
  }

  if (open) {
    content.style.height = `${content.scrollHeight + MARGIN}px`;
    content.style.opacity = '1';
    const onTransitionEnd = () => {
      content.style.height = 'auto';
      content.removeEventListener('transitionend', onTransitionEnd);
    };
    content.addEventListener('transitionend', onTransitionEnd, { once: true });
  } else {
    content.style.height = `${content.scrollHeight + MARGIN}px`;
    nextFrame(() => {
      content.style.height = '0px';
      content.style.opacity = '0';
    });
  }
}

function openItem(item, accordion, { multiple = false, animate = true } = {}) {
  const items = Array.from(accordion.querySelectorAll('.fx-accordion-item'));
  const trigger = item.querySelector('.fx-accordion-trigger');
  const content = item.querySelector('.fx-accordion-content');
  if (!trigger || !content) return;

  const willOpen = trigger.getAttribute('aria-expanded') !== 'true';

  if (willOpen && !multiple) {
    items.forEach((other) => {
      if (other === item) return;
      const otherTrigger = other.querySelector('.fx-accordion-trigger');
      const otherContent = other.querySelector('.fx-accordion-content');
      if (otherTrigger && otherContent && otherTrigger.getAttribute('aria-expanded') === 'true') {
        otherTrigger.setAttribute('aria-expanded', 'false');
        other.removeAttribute('data-fx-open');
        setHeight(otherContent, false, animate);
      }
    });
  }

  if (willOpen) {
    item.setAttribute('data-fx-open', '');
    trigger.setAttribute('aria-expanded', 'true');
  } else {
    item.removeAttribute('data-fx-open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  setHeight(content, willOpen, animate);
}

export const Accordion = {
  name: 'Accordion',
  toggle(item) {
    const accordion = item.closest('.fx-accordion');
    if (accordion) openItem(item, accordion, { multiple: accordion.hasAttribute('data-fx-multiple') });
  },

  bind(root) {
    qa('.fx-accordion', root).forEach((accordion) => {
      if (bound.has(accordion)) return;
      bound.add(accordion);

      qa('.fx-accordion-item', accordion).forEach((item) => {
        const trigger = item.querySelector('.fx-accordion-trigger');
        const content = item.querySelector('.fx-accordion-content');
        if (!trigger || !content) return;

        trigger.setAttribute('aria-expanded', item.hasAttribute('data-fx-open') ? 'true' : 'false');
        trigger.setAttribute('aria-controls', content.id || trigger.getAttribute('aria-controls'));
        if (!content.id) content.id = `fx-acc-${Math.random().toString(36).slice(2, 9)}`;

        setHeight(content, trigger.getAttribute('aria-expanded') === 'true', false);

        on(trigger, 'click', () => {
          openItem(item, accordion, { multiple: accordion.hasAttribute('data-fx-multiple') });
        });
      });

      /* ArrowDown/ArrowUp navigation between headers */
      on(accordion, 'keydown', (event) => {
        const triggers = qa('.fx-accordion-trigger', accordion).filter(
          (t) => !t.hasAttribute('disabled')
        );
        const index = triggers.indexOf(document.activeElement);
        if (event.key === KEYS.ARROW_DOWN && index > -1 && index < triggers.length - 1) {
          event.preventDefault();
          triggers[index + 1].focus();
        } else if (event.key === KEYS.ARROW_UP && index > 0) {
          event.preventDefault();
          triggers[index - 1].focus();
        }
      });
    });
  }
};

register(Accordion);