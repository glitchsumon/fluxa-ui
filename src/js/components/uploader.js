/* ==========================================================================
   Fluxa UI · Components · Uploader & Slider
   Drag-and-drop files with preview list · Range slider value sync.
   ========================================================================== */

import { qa, on, create } from '../core/dom.js';
import { register } from '../core/registry.js';

const bound = new WeakSet();

function formatSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${units[i]}`;
}

export const Uploader = {
  name: 'Uploader',

  bind(root) {
    qa('.fx-uploader-wrap', root).forEach((wrap) => {
      if (bound.has(wrap)) return;
      bound.add(wrap);

      const zone = wrap.querySelector('.fx-uploader');
      const input = wrap.querySelector('input[type="file"]');
      const list = wrap.querySelector('.fx-uploader-filelist');
      if (!zone || !input) return;

      const addFiles = (files) => {
        if (!list) return;
        Array.from(files).forEach((file) => {
          const row = create('div', { class: 'fx-uploader-file' });
          const icon = create('span', { class: 'fx-uploader-file-icon' });
          icon.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>';
          const name = create('span', { class: 'fx-uploader-file-name', text: file.name });
          const size = create('span', { class: 'fx-uploader-file-size', text: formatSize(file.size) });
          const remove = create('button', {
            class: 'fx-uploader-file-remove',
            type: 'button',
            'aria-label': `Remove ${file.name}`
          });
          remove.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
          remove.addEventListener('click', () => row.remove());
          row.appendChild(icon);
          row.appendChild(name);
          row.appendChild(size);
          row.appendChild(remove);
          list.appendChild(row);
        });
      };

      on(zone, 'click', () => input.click());

      on(zone, 'keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          input.click();
        }
      });

      on(input, 'change', () => {
        addFiles(input.files);
        input.value = '';
      });

      ['dragenter', 'dragover'].forEach((type) => {
        on(zone, type, (event) => {
          event.preventDefault();
          zone.setAttribute('data-dragging', 'true');
        });
      });

      ['dragleave', 'drop'].forEach((type) => {
        on(zone, type, (event) => {
          event.preventDefault();
          zone.setAttribute('data-dragging', 'false');
        });
      });

      on(zone, 'drop', (event) => {
        addFiles(event.dataTransfer ? event.dataTransfer.files : []);
      });
    });
  }
};

export const Slider = {
  name: 'Slider',

  bind(root) {
    qa('.fx-slider', root).forEach((slider) => {
      if (bound.has(slider)) return;
      bound.add(slider);

      const update = () => {
        const min = Number(slider.min || 0);
        const max = Number(slider.max || 100);
        const value = Number(slider.value);
        const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
        slider.style.setProperty('--fx-slider-fill', `${pct}%`);
        const display = document.getElementById(
          slider.getAttribute('data-fx-slider-display') || ''
        );
        if (display) {
          display.textContent = slider.getAttribute('data-fx-slider-format')
            ? slider.getAttribute('data-fx-slider-format').replace('{value}', String(value))
            : String(value);
        }
      };

      update();
      on(slider, 'input', update);
      on(slider, 'change', update);
    });
  }
};

register(Uploader);
register(Slider);