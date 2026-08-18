/* ==========================================================================
   Fluxa UI · Tests · Navbar & Sidebar
   ========================================================================== */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Navbar, Sidebar } from '../src/js/components/navbar.js';
import { resetDom } from './setup.js';

describe('Navbar', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <nav class="fx-navbar">
        <div class="fx-navbar-brand">Fluxa</div>
        <button class="fx-navbar-toggle" aria-label="Menu">☰</button>
        <div class="fx-navbar-nav" id="nav-list">
          <a class="fx-navbar-link" href="#">Home</a>
          <a class="fx-navbar-link" href="#">Docs</a>
        </div>
      </nav>
    `;
    Navbar.bind(document);
  });
  afterEach(() => resetDom());

  it('sets initial ARIA state on the toggle', () => {
    const toggle = document.querySelector('.fx-navbar-toggle');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-controls')).toBe('nav-list');
  });

  it('toggles the mobile nav on click', () => {
    const toggle = document.querySelector('.fx-navbar-toggle');
    const nav = document.querySelector('.fx-navbar-nav');
    toggle.click();
    expect(nav.classList.contains('open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    expect(nav.classList.contains('open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes on Escape and returns focus to the toggle', () => {
    const toggle = document.querySelector('.fx-navbar-toggle');
    toggle.click();
    expect(document.querySelector('.fx-navbar-nav').classList.contains('open')).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('.fx-navbar-nav').classList.contains('open')).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it('closes when a nav link is chosen', () => {
    document.querySelector('.fx-navbar-toggle').click();
    document.querySelector('.fx-navbar-link').click();
    expect(document.querySelector('.fx-navbar-nav').classList.contains('open')).toBe(false);
    expect(document.querySelector('.fx-navbar-toggle').getAttribute('aria-expanded')).toBe('false');
  });
});

describe('Sidebar', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="fx-sidebar-context">
        <div class="fx-sidebar" id="rail">
          <div class="fx-sidebar-head">
            <a class="fx-sidebar-link" href="#">Overview</a>
          </div>
        </div>
      </div>
      <button data-fx-sidebar-toggle="#rail">Open rail</button>
    `;
    Sidebar.bind(document);
  });
  afterEach(() => resetDom());

  it('opens the sidebar and creates a backdrop', () => {
    const toggle = document.querySelector('[data-fx-sidebar-toggle]');
    toggle.click();
    const sidebar = document.querySelector('#rail');
    expect(sidebar.getAttribute('data-fx-open')).toBe('true');
    const backdrop = document.querySelector('.fx-sidebar-context .fx-sidebar-backdrop');
    expect(backdrop).toBeTruthy();
    expect(backdrop.style.opacity).toBe('1');
    expect(backdrop.style.pointerEvents).toBe('auto');
  });

  it('toggles closed and restores focus', () => {
    const toggle = document.querySelector('[data-fx-sidebar-toggle]');
    toggle.focus();
    toggle.click();
    toggle.click();
    expect(document.querySelector('#rail').getAttribute('data-fx-open')).toBe('false');
    expect(document.querySelector('.fx-sidebar-backdrop').style.pointerEvents).toBe('none');
    expect(document.activeElement).toBe(toggle);
  });

  it('closes on backdrop click and on Escape', () => {
    const toggle = document.querySelector('[data-fx-sidebar-toggle]');
    toggle.click();
    document.querySelector('.fx-sidebar-backdrop').click();
    expect(document.querySelector('#rail').getAttribute('data-fx-open')).toBe('false');

    toggle.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('#rail').getAttribute('data-fx-open')).toBe('false');
  });
});