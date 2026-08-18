# Changelog

All notable changes to Fluxa UI are documented here.

## [1.0.0] - 2026-08-19

### Added
- **Design language: Structured Motion** — stable-at-rest surfaces with directional,
  edge-based motion on interaction (Edge Motion hover/accent system).
- **Core foundation** — token system (`src/css/core/tokens.css`), reset, typography,
  layout, utilities, dark mode (`data-theme` + system preference, dedicated dark
  surfaces without `filter: invert()`).
- **Components (CSS)** — button, card, forms (input/select/textarea/checkbox/radio/
  switch + validation), badge, tag, avatar (+ group/presence), alert, table (+ strip/
  compact/selected rows), list, stat, timeline, modal, drawer, dropdown, tooltip,
  popover, tabs (+ pills/lined/vertical), accordion, breadcrumb, progress, spinner,
  skeleton, navbar, sidebar, stepper, combobox, toast, command palette, uploader,
  slider. All prefixed `fx-`.
- **Components (JS)** — modal, drawer, dropdown/context-menu, popover, tooltip,
  tabs, accordion, toast, command palette, combobox, navbar, uploader, alert, theme.
  Declarative `data-fx-*` wiring plus a programmatic `Fluxa` namespace API.
- **Core JS utilities** — DOM helpers, keyboard constants/cycling, focus trap,
  scroll lock, ARIA live-region announcements, float positioning with viewport
  flip/shift, overlay stack for nested/focus-trapped surfaces, menu keyboard nav,
  declarative component registry.
- **Documentation site** — engine, guide pages, 22 component pages and a dashboard
  demo (`docs/`), all backed by the real component API.
- **Package outputs** — `dist/fluxa.css`, `dist/fluxa.js` (ESM), `dist/fluxa.umd.cjs`.
- **Tests** — vitest + jsdom suites for Modal, Drawer, Dropdown, Tabs, Accordion,
  Toast, Command and Alert (47 tests).

### Fixed
- `Dropdown.closeAll`/`Popover.closeAll` crashed at runtime — they called
  `WeakMap.forEach`/`clear`, which do not exist. Open states now use a `Map`
  (`WeakMap` is not iterable), so opening a second dropdown correctly closes the
  first.
- `Tabs` ignored click/keyboard wiring for tabs that already declared
  `aria-selected`, leaving documented/demo tabs non-clickable. Click handlers and
  roving tabindex are now always wired.
- `Toast.show()` discarded the `onClose` callback; it is now forwarded to the
  rendered toast.
- Command palette crashed when selecting a command from the filtered list
  (bare `close()` referenced an undefined identifier); it now closes via
  `Command.close()` before running the action.
- Closed modals and drawers no longer block page interactions (`visibility`
  hidden/visible driven by `data-fx-open`).
- External/context menus are hidden (`visibility`) when closed instead of staying
  stacked on top of the page.
- Kbd/keystroke styling, `.fx-list-item-icon`, accordion chevron rotation for
  `[data-fx-open]`, and Enter/Space activation for uploader dropzones added to match
  documentation.

### Changed
- Docs rewritten to match the actual component API (initial doc pages used invented
  class names); verified against library CSS/JS.
- Overlay open now announces into the live region alongside the existing close
  announcement.
- Lint-hygiene: unused imports/params and bare `catch (_)` blocks cleaned up across
  `src/`.