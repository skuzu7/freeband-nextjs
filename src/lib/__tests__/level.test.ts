// @vitest-environment node
//
// The one number the LED wall listens to, and the envelope it is read from.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getLevel, levelAt, onLevel, setLevel } from '../media/level';

afterEach(() => setLevel(0));

describe('setLevel', () => {
  it('tells every listener, and stops telling one that left', () => {
    const a = vi.fn();
    const b = vi.fn();
    const stopA = onLevel(a);
    onLevel(b);
    setLevel(0.5);
    stopA();
    setLevel(0.8);
    expect(a.mock.calls).toEqual([[0.5]]);
    expect(b.mock.calls).toEqual([[0.5], [0.8]]);
    expect(getLevel()).toBe(0.8);
  });

  it('clamps to 0..1 and reads anything that is not a number as silence', () => {
    setLevel(4);
    expect(getLevel()).toBe(1);
    setLevel(-2);
    expect(getLevel()).toBe(0);
    setLevel(0.4);
    setLevel(Number.NaN);
    expect(getLevel()).toBe(0);
  });

  it('does not repeat itself when the level has not moved', () => {
    const listener = vi.fn();
    const stop = onLevel(listener);
    setLevel(0.3);
    setLevel(0.3);
    stop();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe('levelAt', () => {
  const levels = [0, 1, 0.5];

  it('interpolates between the samples around the time asked', () => {
    expect(levelAt(levels, 20, 0)).toBe(0);
    expect(levelAt(levels, 20, 0.025)).toBeCloseTo(0.5, 6);
    expect(levelAt(levels, 20, 0.05)).toBe(1);
    expect(levelAt(levels, 20, 0.075)).toBeCloseTo(0.75, 6);
    expect(levelAt(levels, 20, 0.1)).toBe(0.5);
  });

  it('is silent before the clip, after it, and without an envelope', () => {
    expect(levelAt(levels, 20, -1)).toBe(0);
    expect(levelAt(levels, 20, 5)).toBe(0);
    expect(levelAt([], 20, 0.1)).toBe(0);
    expect(levelAt(levels, 0, 0.1)).toBe(0);
  });
});
