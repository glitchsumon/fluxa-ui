/* ==========================================================================
   Fluxa UI · Tests · Command palette
   ========================================================================== */

import { describe, it, expect, afterEach } from 'vitest';
import { Command } from '../src/js/components/command.js';
import { resetDom } from './setup.js';

function groups() {
  return [
    {
      label: 'Files',
      items: [
        { id: 'new', label: 'New file', keywords: 'create', action: () => (window.__ran = 'new') },
        { id: 'open', label: 'Open file', keywords: 'load', action: () => (window.__ran = 'open') }
      ]
    },
    {
      label: 'Theme',
      items: [{ id: 'toggle', label: 'Toggle theme', keywords: 'dark light', action: () => (window.__ran = 'theme') }]
    }
  ];
}

describe('Command', () => {
  afterEach(() => {
    Command.close();
    resetDom();
    delete window.__ran;
  });

  it('opens a dialog with rendered groups', () => {
    Command.open({ groups: groups() });
    expect(document.querySelector('.fx-command[data-fx-open="true"]')).toBeTruthy();
    expect(document.querySelectorAll('.fx-command-group-label').length).toBe(2);
    expect(document.querySelectorAll('.fx-command-item').length).toBe(3);
    expect(document.activeElement).toBe(document.querySelector('.fx-command-input'));
  });

  it('filters items by query and shows an empty state', () => {
    Command.open({ groups: groups() });
    const input = document.querySelector('.fx-command-input');
    input.value = 'open';
    input.dispatchEvent(new Event('input'));
    expect(document.querySelectorAll('.fx-command-item').length).toBe(1);
    expect(document.querySelector('.fx-command-item-label').textContent).toBe('Open file');

    input.value = 'zzzz';
    input.dispatchEvent(new Event('input'));
    expect(document.querySelectorAll('.fx-command-item').length).toBe(0);
    expect(document.querySelector('.fx-command-empty').style.display).not.toBe('none');
  });

  it('executes the highlighted action on Enter and closes', () => {
    Command.open({ groups: groups() });
    // highlight moves to the second row
    const input = document.querySelector('.fx-command-input');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(window.__ran).toBe('open');
    expect(document.querySelector('.fx-command')).toBeNull();
  });

  it('closes programmatically and keeps document clean', () => {
    Command.open({ groups: groups() });
    expect(document.querySelector('.fx-command')).toBeTruthy();
    Command.close();
    expect(document.querySelector('.fx-command')).toBeNull();
  });

  it('toggles open/closed', () => {
    Command.toggle({ groups: groups() });
    expect(document.querySelector('.fx-command')).toBeTruthy();
    Command.toggle();
    expect(document.querySelector('.fx-command')).toBeNull();
  });

  it('runs the default action set when opened without config', () => {
    const instance = Command.open();
    expect(instance).toBeTruthy();
    expect(document.querySelector('.fx-command-item-label').textContent).toBe('Toggle theme');
    Command.close();
  });
});