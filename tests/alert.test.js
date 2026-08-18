/* ==========================================================================
   Fluxa UI · Tests · Alert
   ========================================================================== */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Alert } from '../src/js/components/alert.js';
import { resetDom } from './setup.js';

function setup() {
  document.body.innerHTML = `
    <div class="fx-alert" id="a">
      <div class="fx-alert-content">
        <div class="fx-alert-title">Heads up</div>
      </div>
      <button class="fx-alert-dismiss">×</button>
    </div>
  `;
  Alert.bind(document);
}

describe('Alert', () => {
  beforeEach(setup);
  afterEach(() => resetDom());

  it('dismisses on calling the button and fires fx:dismissed', () => {
    const fired = vi.fn();
    document.querySelector('#a').addEventListener('fx:dismissed', fired);
    document.querySelector('.fx-alert-dismiss').click();
    expect(document.querySelector('#a').getAttribute('data-fx-leaving')).toBe('');
    document.querySelector('#a').dispatchEvent(new Event('transitionend'));
    expect(document.querySelector('#a')).toBeNull();
    expect(fired).toHaveBeenCalledTimes(1);
  });

  it('supports the data-fx-alert-close hook', () => {
    document.body.innerHTML = `
      <div class="fx-alert" id="b">
        <button data-fx-alert-close>Dismiss</button>
      </div>
    `;
    Alert.bind(document);
    document.querySelector('#b button').click();
    expect(document.querySelector('#b').getAttribute('data-fx-leaving')).toBe('');
  });

  it('safely ignores triggers with no enclosing alert', () => {
    expect(() => Alert.dismiss(document.createElement('button'))).not.toThrow();
  });
});