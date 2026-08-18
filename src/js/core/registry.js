/* ==========================================================================
   Fluxa UI · Core · Component registry
   Declarative auto-initialization: scanning the DOM for data-fx-* hooks.
   ========================================================================== */

const components = [];

export function register(component) {
  if (component && typeof component.bind === 'function' && !components.includes(component)) {
    components.push(component);
  }
}

export function init(root = document) {
  if (!root || typeof root.querySelectorAll !== 'function') return;
  components.forEach((component) => {
    try {
      component.bind(root);
    } catch (err) {
      // Fail loudly in development, silently degrade in production
      if (typeof window !== 'undefined' && window.__FX_DEBUG__) {
        console.error(`[Fluxa] ${component.name || 'component'} failed to init:`, err);
      }
    }
  });
  return root;
}

export function getComponents() {
  return components.slice();
}