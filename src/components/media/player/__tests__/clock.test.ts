// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { player as copy } from '@/data/copy/player';
import { formatClock } from '../clock';

describe('formatClock', () => {
  it('writes a position as min:seg, whole seconds rounded down', () => {
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(5.4)).toBe('0:05');
    expect(formatClock(9.99)).toBe('0:09');
    expect(formatClock(27.3)).toBe('0:27');
    expect(formatClock(60)).toBe('1:00');
    expect(formatClock(83)).toBe('1:23');
    expect(formatClock(600)).toBe('10:00');
  });

  it('reads anything that is not a moment in the clip as its start', () => {
    expect(formatClock(-3)).toBe('0:00');
    expect(formatClock(Number.NaN)).toBe('0:00');
    expect(formatClock(Number.POSITIVE_INFINITY)).toBe('0:00');
  });

  it('is what the timeline says aloud: "min:seg de min:seg"', () => {
    expect(copy.position(formatClock(5.4), formatClock(27.3))).toBe('0:05 de 0:27');
  });
});
