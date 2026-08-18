/* ==========================================================================
   Fluxa UI · Tests · Drawer
   ========================================================================== */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Drawer } from '../src/js/components/drawer.js';
import { resetDom } from './setup.js';

function setup() {
  document.body.innerHTML = `
    <button id="open" data-fx-drawer="#d">Open</button>
    <div class="fx-drawer fx-drawer-right" id="d">
      <div class="fx-drawer-backdrop"></div>
      <div class="fx-drawer-panel">
        <h2 id="dt" class="fx-drawer-title">Settings</h2>
        <button class="fx-drawer-close">Close</button>
      </div>
    </div>
  `;
  Drawer.bind(document);
}

describe('Drawer', () => {
  beforeEach(setup);
  afterEach(() => resetDom());

  it('opens via a data-fx-drawer trigger and wires ARIA', () => {
    document.querySelector('#open').click();
    const drawer = document.querySelector('#d');
    expect(drawer.getAttribute('data-fx-open')).toBe('true');
    expect(drawer.getAttribute('role')).toBe('dialog');
    expect(drawer.getAttribute('aria-modal')).toBe('true');
    expect(drawer.getAttribute('aria-labelledby')).toBe('dt');
  });

  it('closes via the close button', () => {
    document.querySelector('#open').click();
    document.querySelector('.fx-drawer-close').click();
    expect(document.querySelector('#d').getAttribute('data-fx-open')).toBe('false');
  });

  it('closes on Escape and restores focus to the trigger', () => {
    const trigger = document.querySelector('#open');
    trigger.focus();
    trigger.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('#d').getAttribute('data-fx-open')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('closes on backdrop click', () => {
    document.querySelector('#open').click();
    document.querySelector('.fx-drawer-backdrop').click();
    expect(document.querySelector('#d').getAttribute('data-fx-open')).toBe('false');
  });

  it('exposes a programmatic open/close API', () => {
    Drawer.open('#d');
    expect(document.querySelector('#d').getAttribute('data-fx-open')).toBe('true');
    Drawer.close('#d');
    expect(document.querySelector('#d').getAttribute('data-fx-open')).toBe('false');
  });

  it('ignores opening an already-open drawer', () => {
    Drawer.open('#d');
    Drawer.open('#d');
    expect(document.querySelector('#d').getAttribute('data-fx-open')).toBe('true');
  });
});