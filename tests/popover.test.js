/* ==========================================================================
   Fluxa UI · Tests · Popover
   ========================================================================== */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Popover } from '../src/js/components/popover.js';
import { resetDom } from './setup.js';

function setup() {
  document.body.innerHTML = `
    <button id="trig" data-fx-popover="#pop">More</button>
    <div id="pop" class="fx-popover">
      <div class="fx-popover-header">
        <div class="fx-popover-title">Menu</div>
        <button class="fx-popover-close" aria-label="Close">×</button>
      </div>
      <div class="fx-popover-body">Body content</div>
    </div>
  `;
  Popover.bind(document);
}

describe('Popover', () => {
  beforeEach(setup);
  afterEach(() => resetDom());

  it('opens on trigger click', () => {
    document.querySelector('#trig').click();
    expect(document.querySelector('#pop').getAttribute('data-fx-open')).toBe('true');
  });

  it('closes when the trigger is clicked again', () => {
    const trigger = document.querySelector('#trig');
    trigger.click();
    trigger.click();
    expect(document.querySelector('#pop').getAttribute('data-fx-open')).toBe('false');
  });

  it('closes on Escape and restores focus to the trigger', () => {
    const trigger = document.querySelector('#trig');
    trigger.focus();
    trigger.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('#pop').getAttribute('data-fx-open')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('closes on outside mousedown but stays open when clicking inside', () => {
    const trigger = document.querySelector('#trig');
    trigger.click();
    trigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(document.querySelector('#pop').getAttribute('data-fx-open')).toBe('true');

    const elsewhere = document.createElement('button');
    elsewhere.id = 'elsewhere';
    document.body.appendChild(elsewhere);
    elsewhere.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(document.querySelector('#pop').getAttribute('data-fx-open')).toBe('false');
  });

  it('closes from the .fx-popover-close button', () => {
    document.querySelector('#trig').click();
    document.querySelector('.fx-popover-close').click();
    expect(document.querySelector('#pop').getAttribute('data-fx-open')).toBe('false');
  });

  it('exposes a programmatic open/close API', () => {
    const trigger = document.querySelector('#trig');
    const popover = document.querySelector('#pop');
    const handle = Popover.open(trigger, popover, 'bottom-start');
    expect(popover.getAttribute('data-fx-open')).toBe('true');
    handle.close();
    expect(popover.getAttribute('data-fx-open')).toBe('false');
  });
});