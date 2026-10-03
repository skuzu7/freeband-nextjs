// The 5×7 matrix is plain data and arithmetic, so the layout is checked on the
// returned dots — nothing is rendered.
import { describe, it, expect } from 'vitest';
import { ledDots } from '../led/matrix';

describe('ledDots', () => {
  it('lays "1969" out as four 5×7 cells with one blank column between them', () => {
    const { width, rows, dots } = ledDots('1969');
    expect(width).toBe(23);
    expect(rows).toBe(7);
    expect(dots).toHaveLength(140);
  });

  it('lights 10 dots for "1"', () => {
    const { dots } = ledDots('1');
    expect(dots.filter((d) => d.on)).toHaveLength(10);
  });

  it('numbers the lit dots in emission order and marks unlit ones with -1', () => {
    const { dots } = ledDots('1969');
    const lit = dots.filter((d) => d.on);
    expect(lit.map((d) => d.i)).toEqual(lit.map((_, n) => n));
    expect(dots.filter((d) => !d.on).every((d) => d.i === -1)).toBe(true);
  });

  it('starts the second character at x = 6', () => {
    const { dots } = ledDots('19');
    const second = dots.slice(35);
    expect(second).toHaveLength(35);
    expect(Math.min(...second.map((d) => d.x))).toBe(6);
    expect(second[0]).toMatchObject({ x: 6, y: 0 });
  });

  it('renders an unknown character as a blank cell', () => {
    const unknown = ledDots('x');
    expect(unknown).toEqual(ledDots(' '));
    expect(unknown.dots.every((d) => !d.on)).toBe(true);
  });
});
