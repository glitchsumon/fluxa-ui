/* ==========================================================================
   Fluxa UI · Tests · Tooltip
   ========================================================================== */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Tooltip } from '../src/js/components/tooltip.js';
import { resetDom } from './setup.js';

function setup() {
  document.body.innerHTML = `
    <button id="tip" data-fx-tooltip="Save changes" data-fx-placement="top">Save</button>
  `;
  Tooltip.bind(document);
}

describe('Tooltip', () => {
  beforeEach(setup);
  afterEach(() => resetDom());

  it('shows a tooltip on focus', () => {
    const trigger = document.querySelector('#tip');
    trigger.focus();
    const tooltip = document.querySelector('.fx-tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip.getAttribute('role')).toBe('tooltip');
    expect(tooltip.textContent).toBe('Save changes');
    expect(tooltip.getAttribute('data-fx-open')).toBe('true');
  });

  it('hides the tooltip on blur', () => {
    const trigger = document.querySelector('#tip');
    trigger.focus();
    const tooltip = document.querySelector('.fx-tooltip');
    trigger.blur();
    expect(tooltip.getAttribute('data-fx-open')).toBe('false');
  });

  it('reuses the same tooltip element across show/hide', () => {
    const trigger = document.querySelector('#tip');
    trigger.focus();
    const first = document.querySelector('.fx-tooltip');
    trigger.blur();
    trigger.focus();
    expect(document.querySelectorAll('.fx-tooltip').length).toBe(1);
    expect(document.querySelector('.fx-tooltip')).toBe(first);
  });

  it('shows immediately via the express API', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Go';
    document.body.appendChild(trigger);
    Tooltip.express(trigger, 'Fetching…');
    const tooltip = document.querySelector('.fx-tooltip');
    expect(tooltip.textContent).toBe('Fetching…');
    expect(tooltip.getAttribute('data-fx-open')).toBe('true');
  });
});