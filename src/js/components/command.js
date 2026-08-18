/* ==========================================================================
   Fluxa UI · Components · Command palette
   CTRL/CMD+K fuzzy-searchable command menu. Fully data-driven.
     Fluxa.Command.open({ groups: [{ label, items: [{id, label, hint, action}] }] })
   ========================================================================== */

import { qa, on, create } from '../core/dom.js';
import { openOverlay } from '../core/overlay.js';
import { register } from '../core/registry.js';
import { KEYS } from '../core/keyboard.js';

let dialog = null;
let instance = null;
let itemsCache = [];

const DEFAULT_GROUPS = [
  {
    label: 'Actions',
    items: [
      {
        label: 'Toggle theme',
        hint: 'Ctrl K',
        action: () => {
          const root = document.documentElement;
          const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          root.setAttribute('data-theme', next);
        }
      },
      {
        label: 'Print page',
        hint: '',
        action: () => window.print()
      }
    ]
  }
];

function build(items) {
  const body = create('div', { class: 'fx-command', 'data-fx-open': 'true' });
  const backdrop = create('div', { class: 'fx-command-backdrop' });

  const dialogEl = create('div', {
    class: 'fx-command-dialog',
    role: 'dialog',
    'aria-label': 'Command palette'
  });

  const inputWrap = create('div', { class: 'fx-command-input-wrap' });
  const icon = create('span', { class: 'fx-command-search-icon' });
  icon.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>';
  const input = create('input', {
    class: 'fx-command-input',
    type: 'text',
    placeholder: 'Search commands…',
    autocomplete: 'off',
    spellcheck: 'false'
  });
  inputWrap.appendChild(icon);
  inputWrap.appendChild(input);

  const escape = create('kbd', { class: 'fx-command-escape', text: 'ESC' });
  inputWrap.appendChild(escape);

  const empty = create('div', {
    class: 'fx-command-empty',
    text: 'No matching commands.'
  });
  empty.style.display = 'none';

  const list = create('div', { class: 'fx-command-list' });

  const footer = create('div', { class: 'fx-command-footer' });
  footer.innerHTML =
    '<span class="fx-command-kbd"><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span class="fx-command-kbd"><kbd>↵</kbd> select</span>';

  dialogEl.appendChild(inputWrap);
  dialogEl.appendChild(empty);
  dialogEl.appendChild(list);
  dialogEl.appendChild(footer);
  body.appendChild(backdrop);
  body.appendChild(dialogEl);

  function currentItems() {
    return Array.from(list.querySelectorAll('.fx-command-item'));
  }

  function highlightIndex(index) {
    const itemsList = currentItems();
    itemsList.forEach((el, i) => {
      if (i === index) el.setAttribute('data-highlighted', '');
      else el.removeAttribute('data-highlighted');
    });
    const target = itemsList[index];
    if (target) {
      target.scrollIntoView({ block: 'nearest' });
      if (document.activeElement === input) input.setAttribute('aria-activedescendant', target.id || '');
    }
  }

  function render(filter) {
    list.innerHTML = '';
    itemsCache = [];
    const query = (filter || '').toLowerCase().trim();
    let visibleCount = 0;

    items.groups.forEach((group) => {
      const matched = group.items.filter((item) => {
        const haystack = `${item.label} ${item.keywords || ''} ${item.hint || ''}`.toLowerCase();
        return !query || haystack.includes(query);
      });
      if (matched.length === 0) return;

      const label = create('div', { class: 'fx-command-group-label', text: group.label });
      list.appendChild(label);

      matched.forEach((item) => {
        const id = `fx-command-item-${visibleCount}`;
        const row = create('button', {
          class: 'fx-command-item',
          id,
          type: 'button',
          role: 'option'
        });
        row.dataset.index = String(visibleCount);

        if (item.icon) {
          const ic = create('span', { class: 'fx-command-item-icon' });
          ic.innerHTML = item.icon;
          row.appendChild(ic);
        }
        row.appendChild(create('span', { class: 'fx-command-item-label', text: item.label }));
        if (item.hint) {
          row.appendChild(create('span', { class: 'fx-command-item-shortcut', text: item.hint }));
        }
        row.addEventListener('click', () => {
          executeItem(item);
        });

        list.appendChild(row);
        itemsCache.push(item);
        visibleCount += 1;
      });
    });

    empty.style.display = visibleCount === 0 ? '' : 'none';
    list.style.display = visibleCount === 0 ? 'none' : '';
    highlightIndex(0);
  }

  function executeItem(item) {
    const action = item.action;
    Command.close();
    if (action) action();
  }

  on(input, 'input', () => render(input.value));
  on(input, 'keydown', (event) => {
    const list = currentItems();
    const current = list.findIndex((el) => el.getAttribute('data-highlighted') === '');
    let next = current;

    if (event.key === KEYS.ARROW_DOWN) {
      event.preventDefault();
      next = current + 1;
      if (next >= list.length) next = 0;
      highlightIndex(next);
    } else if (event.key === KEYS.ARROW_UP) {
      event.preventDefault();
      next = current - 1;
      if (next < 0) next = list.length - 1;
      highlightIndex(next);
    } else if (event.key === KEYS.ENTER) {
      event.preventDefault();
      const target = list[next] || list[0];
      if (target) target.click();
    } else if (event.key === KEYS.HOME) {
      event.preventDefault();
      highlightIndex(0);
    } else if (event.key === KEYS.END) {
      event.preventDefault();
      highlightIndex(list.length - 1);
    }
  });

  body.addEventListener('mousedown', (event) => {
    if (event.target === backdrop) close();
  });

  render('');

  return { dialog: body, dialogEl, input, render };
}

export const Command = {
  name: 'Command',

  open(config = {}) {
    if (instance) return instance;
    const items = {
      groups: config.groups || DEFAULT_GROUPS
    };
    const built = build(items);
    dialog = built.dialog;
    document.body.appendChild(dialog);
    instance = openOverlay(dialog, { scrollLock: true });
    built.input.focus();
    return instance;
  },

  close() {
    if (!instance) return;
    instance.close();
    instance = null;
    if (dialog) {
      dialog.remove();
      dialog = null;
    }
  },

  toggle(config) {
    if (instance) this.close();
    else this.open(config);
  },

  bind(root) {
    qa('[data-fx-command]', root).forEach((trigger) => {
      if (trigger.dataset.fxCommandBound === '') return;
      trigger.dataset.fxCommandBound = '';
      on(trigger, 'click', () => {
        const groups = trigger.getAttribute('data-fx-command-groups');
        if (groups) {
          try {
            this.open({ groups: JSON.parse(groups) });
            return;
          } catch {
            /* fall through to default */
          }
        }
        this.open();
      });
    });

    /* Global Cmd/Ctrl + K */
    on(document, 'keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        this.toggle();
      }
    });
  }
};

register(Command);