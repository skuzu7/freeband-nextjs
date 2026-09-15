// The LED palette is built from tokens read off the DOM. A token the mixer
// cannot parse must fall back, never throw: the panel sits inside a render
// effect, where an exception takes the page down with it. jsdom has no
// canvas, so the browser-side resolver returns null here and the fallbacks
// are what an unreadable token yields.
import { describe, it, expect, afterEach, vi } from 'vitest';
import { buildPalette, FALLBACK_DIM, FALLBACK_LED, readColorVar, readLedColors, resolveColor } from '../led/palette';
import { mix, toHex } from '@/design/color';
import { tokens } from '@/design/tokens';

function stubComputedStyle(vars: Record<string, string>) {
  vi.spyOn(window, 'getComputedStyle').mockImplementation(
    () => ({ getPropertyValue: (name: string) => vars[name] ?? '' }) as unknown as CSSStyleDeclaration,
  );
}

afterEach(() => vi.restoreAllMocks());

describe('fallbacks', () => {
  it('are the sRGB of the led-500 and led-900 tokens', () => {
    expect(FALLBACK_LED).toBe(toHex(tokens.palette['led-500']));
    expect(FALLBACK_DIM).toBe(toHex(tokens.palette['led-900']));
  });
});

describe('readColorVar', () => {
  it('returns a parseable token as the browser computed it', () => {
    stubComputedStyle({ '--color-led': ' oklch(70% 0.16 240) ', '--color-led-dim': '#0f2e52' });
    expect(readColorVar(document.body, '--color-led', FALLBACK_LED)).toBe('oklch(70% 0.16 240)');
    expect(readColorVar(document.body, '--color-led-dim', FALLBACK_DIM)).toBe('#0f2e52');
    expect(readLedColors(document.body)).toEqual({ led: 'oklch(70% 0.16 240)', dim: '#0f2e52' });
  });

  it('accepts the rgb() form a canvas or getComputedStyle hands back', () => {
    stubComputedStyle({ '--color-led': 'rgb(2, 169, 247)' });
    expect(readColorVar(document.body, '--color-led', FALLBACK_LED)).toBe('rgb(2, 169, 247)');
  });

  it('falls back on an empty value, or one that cannot be resolved without a canvas', () => {
    stubComputedStyle({ '--color-led': 'lab(64.9622% -15.7836 -49.8049)' });
    expect(resolveColor('lab(64.9622% -15.7836 -49.8049)')).toBeNull();
    expect(readColorVar(document.body, '--color-led', FALLBACK_LED)).toBe(FALLBACK_LED);
    expect(readColorVar(document.body, '--color-led-dim', FALLBACK_DIM)).toBe(FALLBACK_DIM);
  });
});

describe('buildPalette', () => {
  it('ramps from dim to lit over the requested number of levels', () => {
    const dim = 'oklch(30% 0.075 254)';
    const led = 'oklch(70% 0.16 240)';
    const palette = buildPalette(dim, led, 16);
    expect(palette).toHaveLength(16);
    expect(palette[0]).toBe(mix(dim, led, 0));
    expect(palette[15]).toBe(mix(dim, led, 1));
  });

  it('never throws: an unreadable input drops to the hex fallbacks', () => {
    const palette = buildPalette('lab(18% -0.46 -25.7)', 'lab(65% -15.8 -49.8)', 4);
    expect(palette).toEqual(buildPalette(FALLBACK_DIM, FALLBACK_LED, 4));
  });
});
