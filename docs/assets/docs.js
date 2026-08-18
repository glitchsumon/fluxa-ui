/* ==========================================================================
   Fluxa UI · Documentation site engine
   Renders the shell (topbar, sidebar, footer), wires code copy, preview
   resizing, the command palette and active-navigation highlighting.
   ========================================================================== */

import { Fluxa } from '../../src/js/fluxa.js';
import '../../src/css/fluxa.css';
import './docs.css';

const NAV = [
  {
    title: 'Overview',
    links: [
      { href: 'index.html', label: 'Introduction' },
      { href: 'installation.html', label: 'Installation' },
      { href: 'quickstart.html', label: 'Quick start' }
    ]
  },
  {
    title: 'Foundations',
    links: [
      { href: 'tokens.html', label: 'Design tokens' },
      { href: 'colors.html', label: 'Colors' },
      { href: 'typography.html', label: 'Typography' },
      { href: 'layout.html', label: 'Layout' },
      { href: 'utilities.html', label: 'Utilities' }
    ]
  },
  {
    title: 'Components',
    links: [
      { href: 'components/button.html', label: 'Button' },
      { href: 'components/card.html', label: 'Card' },
      { href: 'components/forms.html', label: 'Forms' },
      { href: 'components/checkbox-radio-switch.html', label: 'Checkbox · Radio · Switch' },
      { href: 'components/badge.html', label: 'Badge · Tag' },
      { href: 'components/avatar.html', label: 'Avatar' },
      { href: 'components/alert.html', label: 'Alert' },
      { href: 'components/table.html', label: 'Table' },
      { href: 'components/list.html', label: 'List · Timeline · Stats' },
      { href: 'components/modal.html', label: 'Modal' },
      { href: 'components/drawer.html', label: 'Drawer' },
      { href: 'components/dropdown.html', label: 'Dropdown · Menu' },
      { href: 'components/tooltip.html', label: 'Tooltip · Popover' },
      { href: 'components/tabs.html', label: 'Tabs' },
      { href: 'components/accordion.html', label: 'Accordion' },
      { href: 'components/breadcrumb.html', label: 'Breadcrumb · Pagination' },
      { href: 'components/progress.html', label: 'Progress · Spinner · Skeleton' },
      { href: 'components/navbar.html', label: 'Navbar · Sidebar' },
      { href: 'components/command.html', label: 'Command palette' },
      { href: 'components/stepper.html', label: 'Stepper' },
      { href: 'components/combobox.html', label: 'Combobox' },
      { href: 'components/toast.html', label: 'Toast' },
      { href: 'components/slider-uploader.html', label: 'Slider · Uploader' }
    ]
  },
  {
    title: 'Guides',
    links: [
      { href: 'accessibility.html', label: 'Accessibility' },
      { href: 'darkmode.html', label: 'Dark mode' },
      { href: 'api.html', label: 'JavaScript API' },
      { href: 'customization.html', label: 'Customization' },
      { href: 'examples/dashboard.html', label: 'Dashboard demo' },
      { href: 'migration.html', label: 'Migration' },
      { href: 'changelog.html', label: 'Changelog' }
    ]
  }
];

const ROOT = document.body.getAttribute('data-root') || './';

function resolve(path) {
  if (/^https?:/.test(path)) return path;
  return ROOT + path;
}

function currentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const withAnchor = path.split('#')[0];
  return withAnchor;
}

/* ------------------------------------------------------------------
   Shell rendering
   ------------------------------------------------------------------ */
function renderTopbar() {
  const topbar = document.getElementById('fx-doc-topbar');
  if (!topbar) return;

  const searchBtn = document.createElement('button');
  searchBtn.className = 'fx-doc-search';
  searchBtn.type = 'button';
  searchBtn.setAttribute('data-fx-command', '');
  searchBtn.setAttribute('aria-label', 'Open command palette');
  searchBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>' +
    '<span class="fx-doc-search-text">Search docs</span>' +
    '<span class="kbd"><kbd class="fx-command-kbd"><kbd>Ctrl</kbd> <kbd>K</kbd></kbd></span>';

  const themeToggle = document.createElement('button');
  themeToggle.className = 'fx-doc-toggle';
  themeToggle.type = 'button';
  themeToggle.setAttribute('data-fx-theme-toggle', '');
  themeToggle.setAttribute('aria-label', 'Toggle theme');
  themeToggle.innerHTML =
    '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>' +
    '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>';

  const navToggle = document.createElement('button');
  navToggle.className = 'fx-doc-toggle fx-doc-nav-toggle';
  navToggle.type = 'button';
  navToggle.setAttribute('data-fx-doc-nav-toggle', '');
  navToggle.setAttribute('aria-label', 'Toggle navigation');
  navToggle.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';

  const brand = document.createElement('a');
  brand.className = 'fx-doc-brand';
  brand.href = resolve('index.html');
  brand.innerHTML =
    '<span class="fx-doc-brand-mark">F</span>' +
    '<span>Fluxa</span><span class="fx-doc-version">v1.0.0</span>';

  const right = document.createElement('div');
  right.className = 'fx-doc-topbar-right';
  right.appendChild(searchBtn);
  right.appendChild(themeToggle);
  right.appendChild(navToggle);

  topbar.appendChild(brand);
  topbar.appendChild(right);
}

function caretSvg() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M6 9l6 6 6-6');
  svg.appendChild(path);
  svg.classList.add('fx-doc-nav-caret');
  return svg;
}

function renderSidebar() {
  const sidebar = document.getElementById('fx-doc-sidebar');
  if (!sidebar) return;

  const page = currentPage();
  const activeGroup = NAV.find((group) => group.links.some((link) => link.href === page));
  const initialOpen = activeGroup ? activeGroup.title : NAV[0].title;

  NAV.forEach((group, index) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'fx-doc-nav-group';

    const head = document.createElement('button');
    head.className = 'fx-doc-nav-head';
    head.type = 'button';
    head.setAttribute('aria-expanded', group.title === initialOpen ? 'true' : 'false');
    head.setAttribute('aria-controls', `fx-doc-nav-list-${index}`);

    const title = document.createElement('span');
    title.className = 'fx-doc-nav-title';
    title.textContent = group.title;
    head.appendChild(title);
    head.appendChild(caretSvg());

    const list = document.createElement('div');
    list.className = 'fx-doc-nav-list';
    list.id = `fx-doc-nav-list-${index}`;
    if (group.title !== initialOpen) list.hidden = true;

    group.links.forEach((link) => {
      const a = document.createElement('a');
      a.className = 'fx-doc-nav-link';
      a.href = resolve(link.href);
      a.textContent = link.label;
      if (link.href === page) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
      list.appendChild(a);
    });

    head.addEventListener('click', () => {
      const opening = list.hidden;
      sidebar.querySelectorAll('.fx-doc-nav-list').forEach((l) => {
        l.hidden = true;
        const h = sidebar.querySelector(`[aria-controls="${l.id}"]`);
        if (h) h.setAttribute('aria-expanded', 'false');
      });
      if (opening) {
        list.hidden = false;
        head.setAttribute('aria-expanded', 'true');
      }
    });

    groupEl.appendChild(head);
    groupEl.appendChild(list);
    sidebar.appendChild(groupEl);
  });

  sidebar.setAttribute('aria-label', 'Documentation');
}

function renderBackdrop() {
  const backdrop = document.createElement('div');
  backdrop.className = 'fx-doc-sidebar-backdrop';
  backdrop.id = 'fx-doc-sidebar-backdrop';
  document.body.appendChild(backdrop);
}

function wireMobileNav() {
  const toggle = document.querySelector('[data-fx-doc-nav-toggle]');
  const sidebar = document.getElementById('fx-doc-sidebar');
  const backdrop = document.getElementById('fx-doc-sidebar-backdrop');
  if (!toggle || !sidebar) return;

  const close = () => {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    backdrop.classList.toggle('show', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  backdrop.addEventListener('click', close);
  sidebar.addEventListener('click', (event) => {
    if (event.target.closest('.fx-doc-nav-link')) close();
  });
}

/* ------------------------------------------------------------------
   Command palette items — all docs pages
   ------------------------------------------------------------------ */
function buildCommandGroups() {
  const navItems = [];
  NAV.forEach((group) => {
    group.links.forEach((link) => {
      navItems.push({
        label: link.label,
        hint: group.title,
        action: () => {
          window.location.href = resolve(link.href);
        }
      });
    });
  });

  return [
    {
      label: 'Navigate',
      items: navItems
    },
    {
      label: 'Actions',
      items: [
        {
          label: 'Toggle theme',
          hint: 'Dark / light',
          action: () => Fluxa.Theme.toggle()
        },
        {
          label: 'Copy current URL',
          hint: 'Share',
          action: () => {
            navigator.clipboard?.writeText(window.location.href);
            Fluxa.Toast.info('Copied', 'Current page URL copied to clipboard.');
          }
        }
      ]
    }
  ];
}

function wireCommandPalette() {
  document.querySelectorAll('[data-fx-command]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      Fluxa.Command.open({ groups: buildCommandGroups() });
    });
  });
}

/* ------------------------------------------------------------------
   Code blocks — copy + tiny syntax highlight
   ------------------------------------------------------------------ */
function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return text.replace(/[&<>"']/g, (c) => map[c]);
}

function highlight(text) {
  let out = '';
  const lines = text.split('\n');
  lines.forEach((line) => {
    let hl = escapeHtml(line);

    hl = hl.replace(
      /(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)/g,
      (m, tag, name) => `<span class="fx-tok-tag">${tag}${name}</span>`
    );
    hl = hl.replace(/([a-zA-Z-]+)(=)(&quot;|&quot;)([^&]*?)(&quot;)/g, (m, attr, eq, q1, val, q2) => {
      const value = val.replace(/&quot;/g, '&quot;');
      return `<span class="fx-tok-attr">${attr}</span>${eq}<span class="fx-tok-str">${q1}${value}${q2}</span>`;
    });
    hl = hl.replace(
      /(&lt;!--)([\s\S]*?)(--&gt;)/g,
      '<span class="fx-tok-com">$1$2$3</span>'
    );
    hl = hl.replace(
      /(#(?:[0-9a-fA-F]{3}){1,2}\b|[0-9]+\.?[0-9]*(?:rem|px|em|%|s|ms)?)/g,
      '<span class="fx-tok-num">$1</span>'
    );

    out += `${hl}\n`;
  });
  return out;
}

function wireCodeBlocks() {
  document.querySelectorAll('.fx-doc-code pre code').forEach((codeEl) => {
    if (codeEl.dataset.docCodeBound) return;
    codeEl.dataset.docCodeBound = '1';

    const raw = codeEl.textContent;
    codeEl.innerHTML = highlight(raw);

    const block = codeEl.closest('.fx-doc-code');
    const header = block.querySelector('.fx-doc-code-header');
    if (header) {
      const copy = document.createElement('button');
      copy.className = 'fx-doc-copy';
      copy.type = 'button';
      copy.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>' +
        '<span>Copy</span>';
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(raw);
        } catch (_) {
          const ta = document.createElement('textarea');
          ta.value = raw;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        const label = copy.querySelector('span');
        label.textContent = 'Copied';
        setTimeout(() => (label.textContent = 'Copy'), 1600);
      });
      header.appendChild(copy);
    }
  });
}

/* ------------------------------------------------------------------
   Preview resizing
   ------------------------------------------------------------------ */
function wirePreviewResize() {
  document.querySelectorAll('.fx-doc-block').forEach((block) => {
    const tools = block.querySelector('.fx-doc-preview-tools');
    const preview = block.querySelector('.fx-doc-preview');
    if (!tools || !preview) return;

    const modes = [
      { key: 'desktop', label: 'Desktop', class: '' },
      { key: 'tablet', label: 'Tablet', class: 'is-tablet' },
      { key: 'phone', label: 'Phone', class: 'is-phone' }
    ];

    modes.forEach((mode) => {
      const btn = document.createElement('button');
      btn.className = 'fx-doc-preview-tool';
      btn.type = 'button';
      btn.title = mode.label;
      btn.textContent = mode.label;
      btn.setAttribute('aria-label', `Preview at ${mode.label} width`);
      btn.addEventListener('click', () => {
        preview.classList.remove('is-phone', 'is-tablet');
        if (mode.class) preview.classList.add(mode.class);
        tools.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
      tools.appendChild(btn);
    });
  });
}

/* ------------------------------------------------------------------
   Inline interactive run buttons
   ------------------------------------------------------------------ */
function wireDemoTriggers() {
  document.querySelectorAll('[data-fx-demo]').forEach((btn) => {
    const type = btn.getAttribute('data-fx-demo');
    if (type === 'toast') {
      btn.addEventListener('click', () => {
        const variant = btn.getAttribute('data-fx-demo-variant') || 'info';
        const title = btn.getAttribute('data-fx-demo-title') || 'Notification';
        const body = btn.getAttribute('data-fx-demo-body') || 'This toast was triggered from the documentation.';
        Fluxa.Toast[variant](title, body);
      });
    }
  });
}

/* ------------------------------------------------------------------
   Boot
   ------------------------------------------------------------------ */
function boot() {
  renderTopbar();
  renderSidebar();
  renderBackdrop();
  wireMobileNav();
  wireCommandPalette();
  wireCodeBlocks();
  wirePreviewResize();
  wireDemoTriggers();

  Fluxa.Theme.init();
  Fluxa.init(document);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}