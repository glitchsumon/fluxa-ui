/* ==========================================================================
   Fluxa UI · Components · Combobox / Autocomplete
   Filterable single/multiple selection from an attached option list.
   ========================================================================== */

import { qa, on } from '../core/dom.js';
import { register } from '../core/registry.js';
import { KEYS, cycleIndex } from '../core/keyboard.js';

const bound = new WeakSet();

function getOptions(combo) {
  const list = combo.querySelector('.fx-menu');
  return list
    ? Array.from(list.querySelectorAll('[role="option"]')).filter(
        (el) => !el.hasAttribute('disabled')
      )
    : [];
}

function getList(combo) {
  return combo.querySelector('.fx-menu');
}

function highlight(combo, option) {
  getOptions(combo).forEach((el) => el.removeAttribute('data-highlighted'));
  if (option) option.setAttribute('data-highlighted', '');
  const input = combo.querySelector('[data-fx-combobox-input]');
  if (input && option) input.setAttribute('aria-activedescendant', option.id || '');
}

function filterOptions(combo) {
  const input = combo.querySelector('[data-fx-combobox-input]');
  const query = (input ? input.value : '').toLowerCase().trim();
  getOptions(combo).forEach((option) => {
    const text = option.textContent.toLowerCase();
    option.hidden = !!query && !text.includes(query);
  });
  highlight(combo, getOptions(combo).find((el) => !el.hidden));
}

function open(combo) {
  const list = getList(combo);
  const input = combo.querySelector('[data-fx-combobox-input]');
  if (!list || !input) return;
  combo.setAttribute('data-fx-open', 'true');
  input.setAttribute('aria-expanded', 'true');
  filterOptions(combo);
}

function close(combo) {
  const list = getList(combo);
  const input = combo.querySelector('[data-fx-combobox-input]');
  combo.setAttribute('data-fx-open', 'false');
  if (input) input.setAttribute('aria-expanded', 'false');
  if (list) getOptions(combo).forEach((el) => el.removeAttribute('data-highlighted'));
}

function select(combo, option) {
  const input = combo.querySelector('[data-fx-combobox-input]');
  const value = option.getAttribute('data-value') || option.textContent.trim();

  if (combo.hasAttribute('data-fx-multiple')) {
    /* tag-style multi select */
    const tag = option.getAttribute('data-value');
    const wrapper = combo.querySelector('.fx-combobox-tags');
    if (wrapper && !combo.querySelector(`[data-tag="${tag}"]`)) {
      const chip = document.createElement('span');
      chip.className = 'fx-tag';
      chip.dataset.tag = tag;
      chip.textContent = option.textContent.trim();
      const remove = document.createElement('button');
      remove.className = 'fx-tag-remove';
      remove.type = 'button';
      remove.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
      remove.setAttribute('aria-label', `Remove ${chip.textContent}`);
      remove.addEventListener('click', () => chip.remove());
      chip.appendChild(remove);
      wrapper.appendChild(chip);
    }
    if (input) input.value = '';
  } else {
    if (input) input.value = value;
    close(combo);
  }

  option.setAttribute('aria-selected', 'true');
  combo.dispatchEvent(new CustomEvent('fx:select', { bubbles: true, detail: { value } }));
  combo.dispatchEvent(new CustomEvent('change', { bubbles: true }));
}

export const Combobox = {
  name: 'Combobox',

  bind(root) {
    qa('.fx-combobox', root).forEach((combo) => {
      if (bound.has(combo)) return;
      bound.add(combo);

      const input = combo.querySelector('[data-fx-combobox-input]');
      const chevron = combo.querySelector('.fx-combobox-chevron');
      const list = getList(combo);

      if (!input) return;

      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-expanded', 'false');
      if (list) input.setAttribute('aria-controls', list.id || '');

      on(input, 'click', () => {
        if (combo.getAttribute('data-fx-open') === 'true') close(combo);
        else open(combo);
      });

      on(input, 'input', () => {
        if (combo.getAttribute('data-fx-open') !== 'true') open(combo);
        filterOptions(combo);
      });

      on(input, 'keydown', (event) => {
        const options = getOptions(combo);
        if (!options.length) return;

        if (event.key === KEYS.ARROW_DOWN || event.key === KEYS.ARROW_UP) {
          event.preventDefault();
          if (combo.getAttribute('data-fx-open') !== 'true') {
            open(combo);
            return;
          }
          const visible = options.filter((el) => !el.hidden);
          const highlighted = visible.findIndex((el) => el.getAttribute('data-highlighted') === '');
          const dir = event.key === KEYS.ARROW_DOWN ? 1 : -1;
          const next = cycleIndex(visible, highlighted, dir);
          const target = visible[next];
          highlight(combo, target);
          if (target) input.setAttribute('aria-activedescendant', target.id || '');
        } else if (event.key === KEYS.ENTER) {
          event.preventDefault();
          const visible = options.filter((el) => !el.hidden);
          const target = visible.find((el) => el.getAttribute('data-highlighted') === '') || visible[0];
          if (target) select(combo, target);
        } else if (event.key === KEYS.ESCAPE) {
          close(combo);
        }
      });

      if (chevron) {
        on(chevron, 'click', () => {
          if (combo.getAttribute('data-fx-open') === 'true') close(combo);
          else {
            open(combo);
            input.focus();
          }
        });
      }

      /* clicking an option */
      getOptions(combo).forEach((option) => {
        on(option, 'mousedown', (event) => event.preventDefault());
        on(option, 'click', () => select(combo, option));
      });

      /* outside click */
      on(document, 'mousedown', (event) => {
        if (!combo.contains(event.target) && combo.getAttribute('data-fx-open') === 'true') {
          close(combo);
        }
      });
    });
  }
};

register(Combobox);