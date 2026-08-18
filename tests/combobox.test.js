/* ==========================================================================
   Fluxa UI · Tests · Combobox
   ========================================================================== */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Combobox } from '../src/js/components/combobox.js';
import { resetDom } from './setup.js';

function setup() {
  document.body.innerHTML = `
    <div class="fx-combobox" id="combo">
      <div class="fx-combobox-input-wrap">
        <input data-fx-combobox-input id="cb-input" placeholder="Pick an engineer…" />
        <button type="button" class="fx-combobox-chevron" aria-label="Toggle options">↓</button>
      </div>
      <div class="fx-menu" id="cb-list">
        <button type="button" class="fx-menu-item" role="option" data-value="ada" id="opt-ada">Ada Lovelace</button>
        <button type="button" class="fx-menu-item" role="option" data-value="grace" id="opt-grace">Grace Hopper</button>
        <button type="button" class="fx-menu-item" role="option" data-value="margaret" id="opt-margaret" disabled>Margaret Hamilton</button>
      </div>
    </div>
  `;
  Combobox.bind(document);
}

describe('Combobox', () => {
  beforeEach(setup);
  afterEach(() => resetDom());

  it('wires ARIA on the input', () => {
    const input = document.querySelector('#cb-input');
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-controls')).toBe('cb-list');
  });

  it('opens/closes on input click', () => {
    const combo = document.querySelector('#combo');
    const input = document.querySelector('#cb-input');
    input.click();
    expect(combo.getAttribute('data-fx-open')).toBe('true');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    input.click();
    expect(combo.getAttribute('data-fx-open')).toBe('false');
  });

  it('opens from the chevron and filters options', () => {
    document.querySelector('.fx-combobox-chevron').click();
    const input = document.querySelector('#cb-input');
    input.value = 'hopper';
    input.dispatchEvent(new Event('input'));
    expect(document.querySelector('#opt-ada').hidden).toBe(true);
    expect(document.querySelector('#opt-grace').hidden).toBe(false);
    expect(document.querySelector('#opt-grace').getAttribute('data-highlighted')).toBe('');
  });

  it('selects the highlighted option on Enter and fires fx:select', () => {
    const combo = document.querySelector('#combo');
    const input = document.querySelector('#cb-input');
    const onSelect = vi.fn();
    combo.addEventListener('fx:select', onSelect);

    input.click();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(input.value).toBe('grace');
    expect(combo.getAttribute('data-fx-open')).toBe('false');
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: 'grace' } }));
  });

  it('closes on Escape', () => {
    const combo = document.querySelector('#combo');
    document.querySelector('#cb-input').click();
    expect(combo.getAttribute('data-fx-open')).toBe('true');
    document.querySelector('#cb-input').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(combo.getAttribute('data-fx-open')).toBe('false');
  });

  it('adds tags instead of closing in multiple mode', () => {
    const combo = document.querySelector('#combo');
    combo.setAttribute('data-fx-multiple', '');
    const wrapper = document.createElement('div');
    wrapper.className = 'fx-combobox-tags';
    combo.appendChild(wrapper);

    const input = document.querySelector('#cb-input');
    input.click();
    document.querySelector('#opt-ada').click();

    expect(combo.getAttribute('data-fx-open')).toBe('true');
    const chip = document.querySelector('.fx-combobox-tags .fx-tag');
    expect(chip).toBeTruthy();
    expect(chip.dataset.tag).toBe('ada');
    expect(input.value).toBe('');

    chip.querySelector('.fx-tag-remove').click();
    expect(document.querySelector('.fx-combobox-tags .fx-tag')).toBeNull();
  });
});