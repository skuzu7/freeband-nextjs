// @vitest-environment node
//
// The one number the LED wall listens to, and the envelope it is read from.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { videos } from '@/data/media/videos';
import { getLevel, levelAt, onLevel, setLevel, stretchLevels } from '../media/level';

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

describe('stretchLevels', () => {
  /** 0.40, 0.41 … 0.90: the narrow band a mastered clip sits in. */
  const compressed = Array.from({ length: 51 }, (_, i) => 0.4 + i * 0.01);
  const at = (sorted: number[], p: number) => sorted[Math.round((sorted.length - 1) * p)];

  it('takes the 5th percentile to 0 and the 95th to 1', () => {
    const out = stretchLevels(compressed, { gamma: 1 });
    expect(out).toHaveLength(compressed.length);
    // 5% and 95% of the way through 0.40..0.90 are 0.425 and 0.875.
    expect(out[0]).toBe(0);
    expect(out[2]).toBe(0);
    expect(out[3]).toBeCloseTo((0.43 - 0.425) / 0.45, 6);
    expect(out[25]).toBeCloseTo(0.5, 6);
    expect(out[47]).toBeCloseTo((0.87 - 0.425) / 0.45, 6);
    expect(out[48]).toBe(1);
    expect(out[50]).toBe(1);
  });

  it('keeps the order of the samples: louder in, louder out', () => {
    const out = stretchLevels(compressed);
    for (let i = 1; i < out.length; i += 1) expect(out[i]).toBeGreaterThanOrEqual(out[i - 1]);
  });

  it('bends the middle down with gamma, so the peaks stand out', () => {
    expect(stretchLevels(compressed, { gamma: 1 })[25]).toBeCloseTo(0.5, 6);
    expect(stretchLevels(compressed, { gamma: 2 })[25]).toBeCloseTo(0.25, 6);
    // The default sits between the two.
    const bent = stretchLevels(compressed)[25];
    expect(bent).toBeGreaterThan(0.25);
    expect(bent).toBeLessThan(0.5);
    // A gamma that is no exponent at all is read as none.
    expect(stretchLevels(compressed, { gamma: 0 })[25]).toBeCloseTo(0.5, 6);
    expect(stretchLevels(compressed, { gamma: Number.NaN })[25]).toBeCloseTo(0.5, 6);
  });

  it('is not thrown by one silent sample or one crash: the scale is the percentiles, not the extremes', () => {
    const withOutliers = [0, ...compressed, 1];
    const out = stretchLevels(withOutliers, { gamma: 1 });
    expect(out[0]).toBe(0);
    expect(out[out.length - 1]).toBe(1);
    // The middle of the band still lands in the middle of the scale.
    expect(out[26]).toBeCloseTo(0.5, 1);
  });

  it('takes other percentiles when asked, in either order', () => {
    const out = stretchLevels(compressed, { low: 0, high: 1, gamma: 1 });
    expect(out[0]).toBe(0);
    expect(out[50]).toBeCloseTo(1, 6);
    expect(out[10]).toBeCloseTo(0.2, 6);
    expect(stretchLevels(compressed, { low: 1, high: 0, gamma: 1 })).toEqual(out);
  });

  it('returns a new list and leaves the envelope it was given alone', () => {
    const before = [...compressed];
    const out = stretchLevels(compressed);
    expect(out).not.toBe(compressed);
    expect(compressed).toEqual(before);
  });

  it('has nothing to stretch in an envelope without range, and nothing at all in an empty one', () => {
    expect(stretchLevels([])).toEqual([]);
    expect(stretchLevels([0.6, 0.6, 0.6])).toEqual([0.6, 0.6, 0.6]);
    expect(stretchLevels([0, 0, 0])).toEqual([0, 0, 0]);
    expect(stretchLevels([0.7])).toEqual([0.7]);
  });

  it('reads a sample that is not a number as silence and clamps the rest to 0..1', () => {
    const out = stretchLevels([Number.NaN, 0.2, 0.5, 0.8, Number.POSITIVE_INFINITY, 4, -1], { low: 0, high: 1, gamma: 1 });
    expect(out).toEqual([0, 0.2, 0.5, 0.8, 0, 1, 0]);
    for (const v of stretchLevels([Number.NaN, 0.41, 0.6, 0.88, 7])) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it("opens up the real clips: the middle 90% of each envelope goes from a narrow band to the whole scale", () => {
    for (const clip of videos) {
      const file = path.resolve(__dirname, '../../../public', clip.levels.replace(/^\//, ''));
      const { levels } = JSON.parse(readFileSync(file, 'utf8')) as { levels: number[] };
      const raw = [...levels].sort((a, b) => a - b);
      const out = stretchLevels(levels);
      const stretched = [...out].sort((a, b) => a - b);

      // As encoded, 90% of the clip moves within about half the scale.
      expect(at(raw, 0.95) - at(raw, 0.05), `${clip.id} raw`).toBeLessThan(0.55);
      // Stretched, the same 90% covers practically all of it.
      expect(at(stretched, 0.05), `${clip.id} floor`).toBeLessThan(0.05);
      expect(at(stretched, 0.95), `${clip.id} ceiling`).toBeGreaterThan(0.95);
      // And the wall rests low between the peaks instead of glowing evenly.
      expect(at(stretched, 0.5), `${clip.id} median`).toBeLessThan(0.5);
      expect(out).toHaveLength(levels.length);
    }
  });
});
