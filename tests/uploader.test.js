/* ==========================================================================
   Fluxa UI · Tests · Uploader & Slider
   ========================================================================== */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Uploader, Slider } from '../src/js/components/uploader.js';
import { resetDom } from './setup.js';

describe('Uploader', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="fx-uploader-wrap" id="wrap">
        <div class="fx-uploader" tabindex="0" role="button" aria-label="Upload files">
          <div class="fx-uploader-title">Drop files here</div>
        </div>
        <input type="file" class="fx-sr-only" id="file" />
        <div class="fx-uploader-filelist"></div>
      </div>
    `;
    Uploader.bind(document);
  });
  afterEach(() => resetDom());

  it('adds files from a drop event', () => {
    const file = new File(['hello fluxa'], 'notes.md', { type: 'text/markdown' });
    const event = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'dataTransfer', { value: { files: [file] } });
    document.querySelector('.fx-uploader').dispatchEvent(event);

    const row = document.querySelector('.fx-uploader-file');
    expect(row).toBeTruthy();
    expect(document.querySelector('.fx-uploader-file-name').textContent).toBe('notes.md');
    expect(document.querySelector('.fx-uploader-file-size').textContent).toBe('11 B');
  });

  it('removes a file row from its remove button', () => {
    const file = new File(['a'], 'small.txt');
    const event = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'dataTransfer', { value: { files: [file] } });
    document.querySelector('.fx-uploader').dispatchEvent(event);
    document.querySelector('.fx-uploader-file').querySelector('.fx-uploader-file-remove').click();
    expect(document.querySelector('.fx-uploader-file')).toBeNull();
  });

  it('tracks the dragging state', () => {
    const zone = document.querySelector('.fx-uploader');
    zone.dispatchEvent(new Event('dragenter', { bubbles: true, cancelable: true }));
    expect(zone.getAttribute('data-dragging')).toBe('true');
    zone.dispatchEvent(new Event('dragleave', { bubbles: true, cancelable: true }));
    expect(zone.getAttribute('data-dragging')).toBe('false');
  });

  it('activates the file input on Enter', () => {
    const zone = document.querySelector('.fx-uploader');
    const input = document.querySelector('#file');
    const spy = vi.spyOn(input, 'click').mockImplementation(() => {});
    zone.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(spy).toHaveBeenCalled();
  });
});

describe('Slider', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <label for="range">Volume</label>
      <input type="range" class="fx-slider" id="range" min="0" max="100" value="30"
             data-fx-slider-display="disp" data-fx-slider-format="{value}%" />
      <output id="disp"></output>
    `;
    Slider.bind(document);
  });
  afterEach(() => resetDom());

  it('lays out the initial value', () => {
    const slider = document.querySelector('#range');
    expect(slider.style.getPropertyValue('--fx-slider-fill')).toBe('30%');
    expect(document.querySelector('#disp').textContent).toBe('30%');
  });

  it('syncs the fill and display on input', () => {
    const slider = document.querySelector('#range');
    slider.value = '75';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    expect(slider.style.getPropertyValue('--fx-slider-fill')).toBe('75%');
    expect(document.querySelector('#disp').textContent).toBe('75%');
  });
});