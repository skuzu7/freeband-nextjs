// The canvas helpers only read the device pixel ratio and the box's rect, so
// both are stubbed: the backing store must cover the box at the capped ratio.
import { describe, it, expect, afterEach, vi } from 'vitest';
import { cappedDpr, measureCanvasBox } from '../led/canvas';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('cappedDpr', () => {
  it('falls back to 1 when the ratio is missing or zero', () => {
    vi.stubGlobal('devicePixelRatio', 0);
    expect(cappedDpr()).toBe(1);
    vi.stubGlobal('devicePixelRatio', undefined);
    expect(cappedDpr()).toBe(1);
  });

  it('keeps the ratio up to 2 and caps it there', () => {
    vi.stubGlobal('devicePixelRatio', 1.5);
    expect(cappedDpr()).toBe(1.5);
    vi.stubGlobal('devicePixelRatio', 3);
    expect(cappedDpr()).toBe(2);
  });
});

describe('measureCanvasBox', () => {
  it('returns the CSS size and the rounded backing store at the capped ratio', () => {
    vi.stubGlobal('devicePixelRatio', 2);
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 100.4, height: 50.2 } as DOMRect);
    expect(measureCanvasBox(el)).toEqual({ cssW: 100.4, cssH: 50.2, w: 201, h: 100, dpr: 2 });
  });

  it('never sizes the backing store below 1×1', () => {
    vi.stubGlobal('devicePixelRatio', 2);
    // jsdom lays nothing out, so every box measures 0×0.
    expect(measureCanvasBox(document.createElement('div'))).toMatchObject({ cssW: 0, cssH: 0, w: 1, h: 1 });
  });
});
