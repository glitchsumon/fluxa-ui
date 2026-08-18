/* ==========================================================================
   Fluxa UI · Tests · shared environment shims for jsdom
   ========================================================================== */

if (typeof globalThis.requestAnimationFrame !== 'function') {
  globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
}

if (typeof window !== 'undefined') {
  if (typeof window.requestAnimationFrame !== 'function') {
    window.requestAnimationFrame = globalThis.requestAnimationFrame;
    window.cancelAnimationFrame = globalThis.cancelAnimationFrame;
  }
  if (typeof window.matchMedia !== 'function') {
    window.matchMedia = () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {}
    });
  }
  if (typeof window.scrollTo !== 'function') window.scrollTo = () => {};
  if (window.HTMLElement && typeof window.HTMLElement.prototype.scrollIntoView !== 'function') {
    window.HTMLElement.prototype.scrollIntoView = () => {};
  }
}

/* Some Node builds expose a broken global localStorage (empty object). */
if (
  typeof globalThis.localStorage === 'undefined' ||
  typeof globalThis.localStorage.getItem !== 'function'
) {
  const store = new Map();
  const storage = {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(String(key), String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null;
    },
    get length() {
      return store.size;
    }
  };
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
}

/* Reset the DOM + any live regions the components create. */
export function resetDom() {
  document.body.innerHTML = '';
  document.querySelectorAll('[data-fx-live-region]').forEach((el) => el.remove());
  document.querySelectorAll('.fx-toast-region').forEach((el) => el.remove());
}