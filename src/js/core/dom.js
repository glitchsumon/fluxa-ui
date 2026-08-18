/* ==========================================================================
   Fluxa UI · Core · DOM helpers
   Small, dependency-free query and event utilities.
   ========================================================================== */

const doc = typeof document !== 'undefined' ? document : null;

export function q(selector, context = doc) {
  return context ? context.querySelector(selector) : null;
}

export function qa(selector, context = doc) {
  return context ? Array.from(context.querySelectorAll(selector)) : [];
}

export function on(el, event, handler, options) {
  if (!el) return () => {};
  el.addEventListener(event, handler, options);
  return () => el.removeEventListener(event, handler, options);
}

export function off(el, event, handler) {
  if (el) el.removeEventListener(event, handler);
}

export function debounce(fn, wait = 120) {
  let timer;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

export function nextFrame(fn) {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(fn);
  } else {
    setTimeout(fn, 0);
  }
}

export function isVisible(el) {
  if (!el) return false;
  if (el.hasAttribute('hidden')) return false;
  const style = getComputedStyle(el);
  return !(style.display === 'none' || style.visibility === 'hidden');
}

export function create(tag, attrs = {}, children = []) {
  const el = doc.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') el.className = value;
    else if (key === 'text') el.textContent = value;
    else if (key === 'html') el.innerHTML = value;
    else if (key.startsWith('on')) el.addEventListener(key.slice(2), value);
    else el.setAttribute(key, value);
  });
  children.forEach((child) => {
    if (child instanceof Element) el.appendChild(child);
    else el.appendChild(doc.createTextNode(String(child)));
  });
  return el;
}

export function isInputLike(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

export function rect(el) {
  const r = el.getBoundingClientRect();
  return {
    top: r.top,
    left: r.left,
    width: r.width,
    height: r.height,
    bottom: r.bottom,
    right: r.right
  };
}