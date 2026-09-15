// The LED palette is built from tokens read off the DOM. A token the mixer
// cannot parse must fall back, never throw: the panel sits inside a render
// effect, where an exception takes the page down with it.
import { describe, it, expect, afterEach, vi } from 'vitest';
import { buildPalette, FALLBACK_DIM, FALLBACK_LED, readColorVar, readLedColors } from '../led/palette';
import { mix } from '@/design/color';

function stubComputedStyle(vars: Record<string, string>) {
  vi.spyOn(window, 'getComputedStyle').mockImplementation(
    () => ({ getPropertyValue: (name: string) => vars[name] ?? '' }) as unknown as CSSStyleDeclaration,
  );
}

afterEach(() => vi.restoreAllMocks());

describe('readColorVar', () => {
  it('returns the oklch token exactly as the browser computed it', () => {
    stubComputedStyle({ '--color-led': ' oklch(70% 0.16 240) ' });
    expect(readColorVar(document.body, '--color-led', FALLBACK_LED)).toBe('oklch(70% 0.16 240)');
  });

  it('falls back on an empty or unparseable value', () => {
    stubComputedStyle({ '--color-led': 'rgb(1, 2, 3)' });
    expect(readColorVar(document.body, '--color-led', FALLBACK_LED)).toBe(FALLBACK_LED);
    expect(readColorVar(document.body, '--color-led-dim', FALLBACK_DIM)).toBe(FALLBACK_DIM);
  });

  it('reads both sign colours', () => {
    stubComputedStyle({ '--color-led': 'oklch(70% 0.16 240)', '--color-led-dim': 'oklch(30% 0.075 254)' });
    expect(readLedColors(document.body)).toEqual({ led: 'oklch(70% 0.16 240)', dim: 'oklch(30% 0.075 254)' });
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

  it('never throws: an rgba() input drops to the hex fallbacks', () => {
    const palette = buildPalette('rgba(15, 46, 82, 1)', 'rgba(2, 169, 247, 1)', 4);
    expect(palette).toEqual(buildPalette(FALLBACK_DIM, FALLBACK_LED, 4));
  });
});
