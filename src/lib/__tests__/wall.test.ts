// The WebGL wall cannot run under jsdom; what can be pinned here is that it
// fails closed — no context, no wall, and the caller keeps the poster — and
// the two pure helpers around it.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createLedWall, hexToRgb, resolveForScroll, type WallPalette } from '../led/wall';

const PALETTE: WallPalette = { dim: [0, 0, 0.2], led: [0, 0.5, 1], hot: [0.8, 0.9, 1], ground: [0, 0, 0] };

afterEach(() => vi.restoreAllMocks());

describe('createLedWall', () => {
  it('returns null where there is no WebGL2', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    expect(createLedWall(document.createElement('canvas'), PALETTE)).toBeNull();
  });

  it('returns null when asking for the context throws', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(createLedWall(document.createElement('canvas'), PALETTE)).toBeNull();
  });
});

describe('hexToRgb', () => {
  it('reads #rrggbb as three floats', () => {
    expect(hexToRgb('#ff0080')).toEqual([1, 0, 128 / 255]);
    expect(hexToRgb(' #FFFFFF ')).toEqual([1, 1, 1]);
  });

  it('answers black for anything else', () => {
    expect(hexToRgb('oklch(70% 0.16 240)')).toEqual([0, 0, 0]);
    expect(hexToRgb('#fff')).toEqual([0, 0, 0]);
  });
});

describe('resolveForScroll', () => {
  it('holds the picture at the top and is all dots once the fold has left', () => {
    expect(resolveForScroll(0)).toBe(1);
    expect(resolveForScroll(0.05)).toBe(1);
    expect(resolveForScroll(0.9)).toBe(0);
    expect(resolveForScroll(3)).toBe(0);
  });

  it('only ever breaks further into dots as the page scrolls on', () => {
    let previous = 1;
    for (let p = 0; p <= 1; p += 0.05) {
      const value = resolveForScroll(p);
      expect(value).toBeLessThanOrEqual(previous + 1e-9);
      expect(value).toBeGreaterThanOrEqual(0);
      previous = value;
    }
  });
});
