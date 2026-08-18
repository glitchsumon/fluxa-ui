/* ==========================================================================
   Fluxa UI · Tests · Accordion
   ========================================================================== */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Accordion } from '../src/js/components/accordion.js';
import { resetDom } from './setup.js';

function setup() {
  document.body.innerHTML = `
    <div class="fx-accordion" id="acc">
      <div class="fx-accordion-item" data-fx-open>
        <h3><button class="fx-accordion-trigger" type="button" id="a0">One</button></h3>
        <div class="fx-accordion-content"><div class="fx-accordion-content-inner">Body One</div></div>
      </div>
      <div class="fx-accordion-item">
        <h3><button class="fx-accordion-trigger" type="button" id="a1">Two</button></h3>
        <div class="fx-accordion-content"><div class="fx-accordion-content-inner">Body Two</div></div>
      </div>
      <div class="fx-accordion-item">
        <h3><button class="fx-accordion-trigger" type="button" id="a2">Three</button></h3>
        <div class="fx-accordion-content"><div class="fx-accordion-content-inner">Body Three</div></div>
      </div>
    </div>
  `;
  Accordion.bind(document);
}

describe('Accordion', () => {
  beforeEach(setup);
  afterEach(() => resetDom());

  it('syncs aria-expanded from the initial data-fx-open state', () => {
    expect(document.querySelector('#a0').getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('#a1').getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the open item when another is opened (single-open)', () => {
    document.querySelector('#a1').click();
    expect(document.querySelector('#a1').getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('#a0').getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('.fx-accordion-item[data-fx-open]')).toBe(
      document.querySelector('.fx-accordion-item:nth-child(2)')
    );
  });

  it('toggles a single item closed', () => {
    document.querySelector('#a0').click();
    expect(document.querySelector('#a0').getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('.fx-accordion').querySelectorAll('[data-fx-open]').length).toBe(0);
  });

  it('keeps multiple items open when data-fx-multiple is present', () => {
    const acc = document.querySelector('.fx-accordion');
    acc.setAttribute('data-fx-multiple', '');
    document.querySelector('#a1').click();
    document.querySelector('#a2').click();
    expect(document.querySelector('#a0').getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('#a1').getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('#a2').getAttribute('aria-expanded')).toBe('true');
  });

  it('navigates between headers with the arrow keys', () => {
    const first = document.querySelector('#a0');
    first.focus();
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(document.querySelector('#a1'));
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).toBe(first);
  });

  it('exposes a programmatic toggle API and wires aria-controls', () => {
    expect(document.querySelector('#a1').getAttribute('aria-controls')).toBeTruthy();
    Accordion.toggle(document.querySelector('.fx-accordion-item:nth-child(2)'));
    expect(document.querySelector('#a1').getAttribute('aria-expanded')).toBe('true');
  });
});