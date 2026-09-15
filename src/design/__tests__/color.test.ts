// The colour helpers feed the LED canvases in the browser, where the tokens
// arrive as the oklch() strings the stylesheet declares. Every helper has to
// accept exactly those, and reject anything else loudly rather than quietly.
import { describe, it, expect } from 'vitest';
import { mix, parseColor, toHex, toRgba } from '../color';

describe('parseColor', () => {
  it('reads oklch lightness as a percentage when written as one', () => {
    expect(toHex('oklch(100% 0 0)')).toBe('#ffffff');
    expect(toHex('oklch(0% 0 0)')).toBe('#000000');
  });

  it('reads unitless oklch lightness on the 0..1 scale', () => {
    expect(toHex('oklch(1 0 0)')).toBe('#ffffff');
    expect(toHex('oklch(0.5 0 0)')).toBe(toHex('oklch(50% 0 0)'));
  });

  it('keeps a fractional percentage on the percentage scale', () => {
    expect(toHex('oklch(0.5% 0 0)')).toBe(toHex('oklch(0.005 0 0)'));
  });

  it('accepts hex in both lengths', () => {
    expect(toHex('#fff')).toBe('#ffffff');
    expect(toHex('#4fa3ff')).toBe('#4fa3ff');
  });

  it('rejects any other syntax instead of guessing', () => {
    expect(() => parseColor('rgba(78, 166, 255, 1)')).toThrow(/Unsupported/);
    expect(() => parseColor('red')).toThrow(/Unsupported/);
  });
});

describe('mix', () => {
  it('interpolates between the two oklch tokens the LED canvas reads', () => {
    const dim = 'oklch(30% 0.075 254)';
    const led = 'oklch(70% 0.16 240)';
    expect(mix(dim, led, 0)).toBe(mix(dim, dim, 1));
    expect(mix(dim, led, 1)).toBe(mix(led, led, 0));
    expect(mix(dim, led, 0.5)).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
  });

  it('does not accept its own rgba() output as input', () => {
    const led = toRgba('oklch(70% 0.16 240)');
    expect(led).toMatch(/^rgba\(/);
    expect(() => mix(led, led, 0.5)).toThrow(/Unsupported/);
  });
});
