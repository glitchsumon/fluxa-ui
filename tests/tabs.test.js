/* ==========================================================================
   Fluxa UI · Tests · Tabs
   ========================================================================== */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Tabs } from '../src/js/components/tabs.js';
import { resetDom } from './setup.js';

function setup() {
  document.body.innerHTML = `
    <div class="fx-tabs">
      <div class="fx-tablist" role="tablist" aria-label="Manage project">
        <button class="fx-tab" role="tab" id="t0" aria-controls="p0" aria-selected="true">Overview</button>
        <button class="fx-tab" role="tab" id="t1" aria-controls="p1" aria-selected="false" tabindex="-1">Activity</button>
        <button class="fx-tab" role="tab" id="t2" aria-controls="p2" aria-selected="false" tabindex="-1">Settings</button>
      </div>
      <div class="fx-tabpanel" role="tabpanel" id="p0" aria-labelledby="t0">Panel One</div>
      <div class="fx-tabpanel" role="tabpanel" id="p1" aria-labelledby="t1" hidden>Panel Two</div>
      <div class="fx-tabpanel" role="tabpanel" id="p2" aria-labelledby="t2" hidden>Panel Three</div>
    </div>
  `;
  Tabs.bind(document);
}

describe('Tabs', () => {
  beforeEach(setup);
  afterEach(() => resetDom());

  it('keeps the declared active tab selected and panels hidden accordingly', () => {
    expect(document.querySelector('#t0').getAttribute('aria-selected')).toBe('true');
    expect(document.querySelector('#p0').hidden).toBe(false);
    expect(document.querySelector('#p1').hidden).toBe(true);
    expect(document.querySelector('#p2').hidden).toBe(true);
  });

  it('activates a tab on click and reveals its panel', () => {
    const tab = document.querySelector('#t1');
    tab.click();
    expect(tab.getAttribute('aria-selected')).toBe('true');
    expect(tab.classList.contains('is-active')).toBe(true);
    expect(document.querySelector('#p1').hidden).toBe(false);
    expect(document.querySelector('#p0').hidden).toBe(true);
  });

  it('moves focus and selection with the right arrow key', () => {
    const first = document.querySelector('#t0');
    first.focus();
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(document.querySelector('#t1'));
    expect(document.querySelector('#t1').getAttribute('aria-selected')).toBe('true');
  });

  it('wraps selection past the last tab', () => {
    const last = document.querySelector('#t2');
    last.focus();
    last.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.querySelector('#t0').getAttribute('aria-selected')).toBe('true');
  });

  it('jumps to home and end', () => {
    const middle = document.querySelector('#t1');
    middle.focus();
    middle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(document.querySelector('#t0').getAttribute('aria-selected')).toBe('true');
    middle.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(document.querySelector('#t2').getAttribute('aria-selected')).toBe('true');
  });

  it('activates a tab programmatically through the API', () => {
    Tabs.activate(document.querySelector('.fx-tablist'), 2);
    expect(document.querySelector('#t2').getAttribute('aria-selected')).toBe('true');
    expect(document.querySelector('#p2').hidden).toBe(false);
  });
});