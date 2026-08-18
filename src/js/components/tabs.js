/* ==========================================================================
   Fluxa UI · Components · Tabs
   ARIA tabs pattern: keyboard arrows, Home/End, roving tabindex.
   ========================================================================== */

import { qa, on } from '../core/dom.js';
import { register } from '../core/registry.js';
import { KEYS, cycleIndex } from '../core/keyboard.js';

const bound = new WeakSet();

function activate(tab, tabs) {
  const current = tabs.tablist.querySelector('.fx-tab[aria-selected="true"]');
  if (current) {
    current.setAttribute('aria-selected', 'false');
    current.tabIndex = -1;
    current.classList.remove('is-active');
  }
  tab.setAttribute('aria-selected', 'true');
  tab.tabIndex = 0;
  tab.classList.add('is-active');

  /* reveal matching panel */
  const targetId = tab.getAttribute('aria-controls');
  qa('[role="tabpanel"]', tabs.root).forEach((panel) => {
    panel.hidden = panel.getAttribute('id') !== targetId;
  });
}

function selectTab(tablist, index) {
  const tabs = Array.from(tablist.querySelectorAll('.fx-tab'));
  const target = tabs[index];
  if (target && !target.hasAttribute('disabled')) {
    activate(target, { root: tablist.parentElement, tablist });
    target.focus();
  }
}

export const Tabs = {
  name: 'Tabs',

  activate(tablist, index) {
    selectTab(tablist, index);
  },

  bind(root) {
    qa('.fx-tabs', root).forEach((tabs) => {
      if (bound.has(tabs)) return;
      bound.add(tabs);

      const tablist = tabs.querySelector('.fx-tablist') || tabs;
      const tabEls = Array.from(tablist.querySelectorAll('.fx-tab'));

      tabEls.forEach((tab) => {
        on(tab, 'click', () => {
          activate(tab, { root: tabs, tablist });
        });

        if (tab.getAttribute('aria-selected')) return;

        const isActive =
          tab.classList.contains('is-active') ||
          (tab.hasAttribute('aria-controls') &&
            document.getElementById(tab.getAttribute('aria-controls'))?.hidden === false);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.setAttribute('role', 'tab');
        tab.tabIndex = isActive ? 0 : -1;
      });

      /* panels */
      qa('[role="tabpanel"]', tabs).forEach((panel) => {
        const tab = tabEls.find((t) => t.getAttribute('aria-controls') === panel.id);
        const selected = tab && tab.getAttribute('aria-selected') === 'true';
        panel.hidden = !selected;
      });

      /* roving keyboard nav */
      on(tablist, 'keydown', (event) => {
        const tabsInList = Array.from(tablist.querySelectorAll('.fx-tab'));
        const current = tabsInList.indexOf(document.activeElement);
        let next = -1;

        if (event.key === KEYS.ARROW_RIGHT || event.key === KEYS.ARROW_DOWN) {
          next = cycleIndex(tabsInList, current === -1 ? -1 : current, 1);
        } else if (event.key === KEYS.ARROW_LEFT || event.key === KEYS.ARROW_UP) {
          next = cycleIndex(tabsInList, current === -1 ? 0 : current, -1);
        } else if (event.key === KEYS.HOME) {
          next = 0;
        } else if (event.key === KEYS.END) {
          next = tabsInList.length - 1;
        }

        if (next > -1) {
          event.preventDefault();
          selectTab(tablist, next);
        }
      });
    });
  }
};

register(Tabs);