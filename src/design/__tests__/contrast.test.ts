// @vitest-environment node
//
// Every text/background pair the interface actually uses has to clear WCAG AA:
// 4.5:1 for text, 3:1 for UI (borders, icons, focus rings, the red CTA face).
// The LED blue is only allowed to carry text where this test says it can.
import { describe, it, expect } from 'vitest';
import { contrastRatio, toHex } from '../color';
import { resolveColor, themes } from '../tokens';

type Theme = keyof typeof themes;

function ratio(theme: Theme, fg: string, bg: string): number {
  return contrastRatio(resolveColor(fg, theme), resolveColor(bg, theme));
}

const TEXT = 4.5;
const UI = 3;

describe('color math', () => {
  it('converts oklch and hex to the same sRGB hex', () => {
    expect(toHex('#ee3524')).toBe('#ee3524');
    expect(toHex('oklch(100% 0 0)')).toBe('#ffffff');
    expect(toHex('oklch(0% 0 0)')).toBe('#000000');
  });

  it('measures black on white at 21:1', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('composites translucent colors over their background before measuring', () => {
    // 50% white over black is mid grey, nowhere near 21:1.
    expect(contrastRatio('oklch(100% 0 0 / 0.5)', '#000000')).toBeLessThan(8);
  });
});

describe.each(Object.keys(themes) as Theme[])('theme %s', (theme) => {
  it('body text on every surface', () => {
    for (const surface of ['surface', 'surface-raise', 'surface-high']) {
      expect(ratio(theme, 'ink', surface), `ink on ${surface}`).toBeGreaterThanOrEqual(TEXT);
      expect(ratio(theme, 'ink-muted', surface), `ink-muted on ${surface}`).toBeGreaterThanOrEqual(TEXT);
    }
  });

  it('low-emphasis text on the surfaces it is allowed on', () => {
    expect(ratio(theme, 'ink-low', 'surface')).toBeGreaterThanOrEqual(TEXT);
    expect(ratio(theme, 'ink-low', 'surface-raise')).toBeGreaterThanOrEqual(TEXT);
  });

  it('LED blue as text uses the text variant, and clears AA', () => {
    for (const surface of ['surface', 'surface-raise', 'surface-high']) {
      expect(ratio(theme, 'led-text', surface), `led-text on ${surface}`).toBeGreaterThanOrEqual(TEXT);
    }
  });

  it('LED blue as UI accent clears 3:1', () => {
    expect(ratio(theme, 'led', 'surface')).toBeGreaterThanOrEqual(UI);
    expect(ratio(theme, 'led', 'surface-high')).toBeGreaterThanOrEqual(UI);
  });

  it('the red CTA: face against surface, and its label against the face', () => {
    expect(ratio(theme, 'red', 'surface')).toBeGreaterThanOrEqual(UI);
    expect(ratio(theme, 'on-red', 'red')).toBeGreaterThanOrEqual(TEXT);
  });

  it('strong borders are visible', () => {
    expect(ratio(theme, 'line-strong', 'surface')).toBeGreaterThanOrEqual(UI);
  });
});
