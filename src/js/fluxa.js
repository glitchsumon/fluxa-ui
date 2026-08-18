/* ==========================================================================
   Fluxa UI · fluxa.js
   Aggregates core utilities and all components into a single namespace.
   ========================================================================== */

import './core/dom.js';
import './core/keyboard.js';
import './core/focus.js';
import './core/scroll.js';
import './core/a11y.js';
import './core/float.js';
import './core/overlay.js';
import './core/menu-keyboard.js';
import './core/registry.js';

import { Modal } from './components/modal.js';
import { Drawer } from './components/drawer.js';
import { Dropdown } from './components/dropdown.js';
import { Alert } from './components/alert.js';
import { Tooltip } from './components/tooltip.js';
import { Tabs } from './components/tabs.js';
import { Accordion } from './components/accordion.js';
import { Toast } from './components/toast.js';
import { Command } from './components/command.js';
import { Combobox } from './components/combobox.js';
import { Navbar, Sidebar } from './components/navbar.js';
import { Uploader, Slider } from './components/uploader.js';
import { Theme } from './components/theme.js';
import { Popover } from './components/popover.js';

import { init, register, getComponents } from './core/registry.js';
import { announce } from './core/a11y.js';
import { lockScroll, unlockScroll } from './core/scroll.js';

export const VERSION = '1.0.0';

export const Fluxa = {
  version: VERSION,

  Modal,
  Drawer,
  Dropdown,
  Alert,
  Tooltip,
  Tabs,
  Accordion,
  Toast,
  Command,
  Combobox,
  Popover,
  Navbar,
  Sidebar,
  Uploader,
  Slider,
  Theme,

  /** Re-scan a subtree for declarative components */
  init(root) {
    return init(root);
  },

  register,
  getComponents,

  announce,
  lockScroll,
  unlockScroll,

  /* Escape hatch to read a single DOM node */
  $: (selector, context) => context.querySelector(selector),
  $$: (selector, context) => Array.from(context.querySelectorAll(selector))
};

/* ------------------------------------------------------------------
   Auto-initialize once the document is ready.
   ------------------------------------------------------------------ */
if (typeof document !== 'undefined') {
  const boot = () => {
    Theme.init();
    Fluxa.init(document);
    document.dispatchEvent(new CustomEvent('fx:ready', { detail: { Fluxa } }));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}

export default Fluxa;