/* ==========================================================================
   Fluxa UI · Tests · Modal
   ========================================================================== */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Modal } from '../src/js/components/modal.js';
import { resetDom } from './setup.js';

function setup() {
  document.body.innerHTML = `
    <button id="open" data-fx-modal="#m">Open</button>
    <div class="fx-modal" id="m">
      <div class="fx-modal-backdrop"></div>
      <div class="fx-modal-panel">
        <h2 id="mt" class="fx-modal-title">Hello</h2>
        <button class="fx-modal-close">Close</button>
      </div>
    </div>
  `;
  Modal.bind(document);
}

describe('Modal', () => {
  beforeEach(setup);
  afterEach(() => resetDom());

  it('opens via a data-fx-modal trigger and wires ARIA', () => {
    document.querySelector('#open').click();
    const modal = document.querySelector('#m');
    expect(modal.getAttribute('data-fx-open')).toBe('true');
    expect(modal.getAttribute('role')).toBe('dialog');
    expect(modal.getAttribute('aria-modal')).toBe('true');
    expect(modal.getAttribute('aria-labelledby')).toBe('mt');
  });

  it('sets data-fx-open to false on a closed modal during bind', () => {
    expect(document.querySelector('#m').getAttribute('data-fx-open')).toBe('false');
  });

  it('focuses the first focusable element inside the panel', () => {
    document.querySelector('#open').click();
    expect(document.activeElement).toBe(document.querySelector('.fx-modal-close'));
  });

  it('closes via the close button', () => {
    document.querySelector('#open').click();
    document.querySelector('.fx-modal-close').click();
    expect(document.querySelector('#m').getAttribute('data-fx-open')).toBe('false');
  });

  it('closes on Escape and restores focus to the trigger', () => {
    const trigger = document.querySelector('#open');
    trigger.focus();
    trigger.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('#m').getAttribute('data-fx-open')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('closes on backdrop click', () => {
    document.querySelector('#open').click();
    document.querySelector('.fx-modal-backdrop').click();
    expect(document.querySelector('#m').getAttribute('data-fx-open')).toBe('false');
  });

  it('only closes the top modal on Escape when stacked', () => {
    const nested = document.createElement('button');
    nested.setAttribute('data-fx-modal', '#inner');
    document.body.appendChild(nested);
    const inner = document.createElement('div');
    inner.className = 'fx-modal';
    inner.id = 'inner';
    inner.innerHTML = '<div class="fx-modal-panel"><div class="fx-modal-title">Inner</div></div>';
    document.body.appendChild(inner);
    Modal.bind(document);

    document.querySelector('#open').click();
    nested.focus();
    nested.click();

    expect(inner.getAttribute('data-fx-open')).toBe('true');
    expect(document.querySelector('#m').getAttribute('data-fx-open')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(inner.getAttribute('data-fx-open')).toBe('false');
    expect(document.querySelector('#m').getAttribute('data-fx-open')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('#m').getAttribute('data-fx-open')).toBe('false');
  });

  it('exposes a programmatic open/close API', () => {
    Modal.open('#m');
    expect(document.querySelector('#m').getAttribute('data-fx-open')).toBe('true');
    Modal.close('#m');
    expect(document.querySelector('#m').getAttribute('data-fx-open')).toBe('false');
  });
});