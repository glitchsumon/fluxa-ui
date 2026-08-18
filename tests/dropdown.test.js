/* ==========================================================================
   Fluxa UI · Tests · Dropdown / context menu
   ========================================================================== */

import { describe, it, expect, afterEach } from 'vitest';
import { Dropdown } from '../src/js/components/dropdown.js';
import { resetDom } from './setup.js';

describe('Dropdown', () => {
  afterEach(() => resetDom());

  it('opens/closes a menu in container mode on trigger click', () => {
    document.body.innerHTML = `
      <div class="fx-dropdown">
        <button class="fx-dropdown-trigger">Menu</button>
        <div class="fx-dropdown-menu fx-menu">
          <button class="fx-menu-item" data-value="a">A</button>
          <button class="fx-menu-item" data-value="b">B</button>
        </div>
      </div>
    `;
    Dropdown.bind(document);
    const trigger = document.querySelector('.fx-dropdown-trigger');
    const menu = document.querySelector('.fx-dropdown-menu');

    expect(document.querySelector('.fx-dropdown').getAttribute('data-fx-open')).toBe('false');

    trigger.click();
    expect(menu.getAttribute('data-fx-open')).toBe('true');
    expect(document.querySelector('.fx-dropdown').getAttribute('data-fx-open')).toBe('true');

    trigger.click();
    expect(menu.getAttribute('data-fx-open')).toBe('false');
    expect(document.querySelector('.fx-dropdown').getAttribute('data-fx-open')).toBe('false');
  });

  it('closes on Escape and returns focus to the trigger', () => {
    document.body.innerHTML = `
      <div class="fx-dropdown">
        <button class="fx-dropdown-trigger">Menu</button>
        <div class="fx-dropdown-menu fx-menu">
          <button class="fx-menu-item">A</button>
        </div>
      </div>
    `;
    Dropdown.bind(document);
    const trigger = document.querySelector('.fx-dropdown-trigger');
    const menu = document.querySelector('.fx-dropdown-menu');

    trigger.click();
    expect(menu.getAttribute('data-fx-open')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(menu.getAttribute('data-fx-open')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('closes when clicking outside the trigger and menu', () => {
    document.body.innerHTML = `
      <div class="fx-dropdown">
        <button class="fx-dropdown-trigger">Menu</button>
        <div class="fx-dropdown-menu fx-menu">
          <button class="fx-menu-item">A</button>
        </div>
      </div>
      <button id="outside">Outside</button>
    `;
    Dropdown.bind(document);
    const trigger = document.querySelector('.fx-dropdown-trigger');
    const menu = document.querySelector('.fx-dropdown-menu');

    trigger.click();
    expect(menu.getAttribute('data-fx-open')).toBe('true');

    document.querySelector('#outside').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(menu.getAttribute('data-fx-open')).toBe('false');
  });

  it('stays open when clicking inside the menu', () => {
    document.body.innerHTML = `
      <div class="fx-dropdown">
        <button class="fx-dropdown-trigger">Menu</button>
        <div class="fx-dropdown-menu fx-menu">
          <button class="fx-menu-item">A</button>
        </div>
      </div>
    `;
    Dropdown.bind(document);
    const trigger = document.querySelector('.fx-dropdown-trigger');
    const menu = document.querySelector('.fx-dropdown-menu');

    trigger.click();
    menu.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(menu.getAttribute('data-fx-open')).toBe('true');
  });

  it('opens an external menu via data-fx-dropdown', () => {
    document.body.innerHTML = `
      <button id="ext" data-fx-dropdown="#menu">Open</button>
      <div id="menu" class="fx-menu">
        <button class="fx-menu-item">A</button>
      </div>
    `;
    Dropdown.bind(document);
    document.querySelector('#ext').click();
    expect(document.querySelector('#menu').getAttribute('data-fx-open')).toBe('true');
  });

  it('opens a context menu on right-click at the cursor', () => {
    document.body.innerHTML = `
      <div id="target" data-fx-context="#ctx">Right-click me</div>
      <div id="ctx" class="fx-menu">
        <button class="fx-menu-item">Inspect</button>
      </div>
    `;
    Dropdown.bind(document);
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 40, clientY: 60 });
    document.querySelector('#target').dispatchEvent(event);
    const menu = document.querySelector('#ctx');
    expect(menu.getAttribute('data-fx-open')).toBe('true');
    expect(menu.style.position).toBe('fixed');
  });
});