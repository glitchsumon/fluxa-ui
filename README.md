# Fluxa UI

A complete, original, accessible **vanilla** UI component framework. HTML + modern
CSS + a tiny dependency-free JavaScript core. No build tools required to use it —
write semantic markup, drop in `fluxa.css` and `fluxa.js`, and components come to
life.

**Design language: Structured Motion.** Interfaces stay calm and stable at rest;
interaction brings them alive with directional, purposeful animation. The signature
is *Edge Motion*: focus, hover and activation travel along container edges — a
traveling underline for tabs, an edge-glow for cards, boundary-shifting borders for
buttons — instead of full background sweeps.

- Zero runtime dependencies
- ~15 kB gzipped CSS, ~12 kB gzipped JS
- Dark mode out of the box (`data-theme`, system-aware)
- Keyboard-first and screen-reader friendly throughout

## Installation

```bash
npm install fluxa-ui
```

## Quick start

With a bundler (Vite, webpack, Rollup…):

```js
import 'fluxa-ui/dist/fluxa-ui.css';
import { Fluxa } from 'fluxa-ui';

Fluxa.init(document);
```

Without a build step — link the files straight from `node_modules`:

```html
<link rel="stylesheet" href="/node_modules/fluxa-ui/dist/fluxa-ui.css" />
<script type="module" src="/node_modules/fluxa-ui/dist/fluxa.js"></script>

<button class="fx-btn fx-btn-primary">Save changes</button>
```

Or from a CDN (jsDelivr, served from the GitHub repo):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/glitchsumon/fluxa-ui@main/dist/fluxa-ui.css" />
<script type="module" src="https://cdn.jsdelivr.net/gh/glitchsumon/fluxa-ui@main/dist/fluxa.js"></script>
```

That's it — no configuration. Components are wired declaratively from your markup
(see [JavaScript](#javascript)). For the full guide, components and a working
dashboard demo, open the live docs:
<https://glitchsumon.github.io/fluxa-ui/>.

### Development (working on Fluxa itself)

```bash
npm install
npm run dev          # docs dev server
npm run docs         # production build of the docs site
npm run preview      # preview the built docs
```

## Components

```text
Layout          Grid · Container · Spacer
Essentials      Button · Card · Forms · Badge · Tag · Avatar
Overlays        Modal · Drawer · Tooltip · Popover · Toast · Command palette
Navigation      Navbar · Sidebar · Dropdown · Context menu · Breadcrumb
Data            Table · List · Stat · Timeline
Feedback        Alert · Progress · Spinner · Skeleton
Interactive     Tabs · Accordion · Stepper · Combobox · Uploader · Slider
```

## JavaScript

Component behaviour is wired **declaratively**. Most components need no JS at all —
data attributes trigger everything:

```html
<button data-fx-modal="#confirm">Delete</button>

<div class="fx-modal" id="confirm" aria-label="Confirm deletion">
  <div class="fx-modal-backdrop"></div>
  <div class="fx-modal-panel">
    <div class="fx-modal-body">This cannot be undone.</div>
    <div class="fx-modal-footer">
      <button class="fx-btn" data-fx-modal-close>Cancel</button>
      <button class="fx-btn fx-btn-danger" data-fx-modal-close>Delete</button>
    </div>
  </div>
</div>
```

A programmatic API is also available via the `Fluxa` namespace (`VERSION`, `Fluxa.Modal`,
`Fluxa.Toast`, `Fluxa.Command`, etc.) for complex workflows:

```js
Fluxa.toast.success('Saved', 'Your changes are live');
Fluxa.command.open({
  groups: [
    { label: 'Files', items: [{ label: 'New file', keywords: 'create', action: () => {} }] }
  ]
});
```

## Development

```bash
npm install
npm run dev          # docs dev server
npm run build        # library build → dist/
npm test             # vitest + jsdom test suite
npm run lint         # eslint on src/ and tests/
npm run docs         # docs production build → docs-dist/
```

Requires Node 18+. The library itself runs in any evergreen browser; no polyfills
are bundled.

## Accessibility

Every interactive component is keyboard operable and exposes correct ARIA
semantics — roving tabindex for tabs, `aria-expanded`/`aria-controls` for accordions,
focus trapping and focus restoration for overlays, live-region announcements for
toasts and dialogs, plus `prefers-reduced-motion` support that collapses
animation to opacity-only fades.

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Uses `color-mix()`,
`:has()` and other modern CSS; see the browser baseline for your target.

## License

MIT