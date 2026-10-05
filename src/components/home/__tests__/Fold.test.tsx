// The fold's pause control against the loop it governs. jsdom has no canvas,
// so the LED panel fails open and the fold renders as it would once lit; its
// video element exists but cannot play, so play() and pause() are stubbed and
// counted.
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Fold } from '../Fold';
import { fold } from '@/data/copy/home';
import { heroMedia } from '@/data/media/hero';

let play: MockInstance<HTMLMediaElement['play']>;
let pause: MockInstance<HTMLMediaElement['pause']>;

beforeEach(() => {
  // Without requestIdleCallback the loop attaches on a timer.
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
  pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  // What jsdom answers anyway, minus the "not implemented" it prints each time.
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Fold', () => {
  it('names the backdrop control after what a press does, with no pressed state to contradict it', () => {
    const { container } = render(<Fold yearsActive={57} />);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(container.querySelector('video')).toHaveAttribute('src', heroMedia.video);
    expect(play).toHaveBeenCalledTimes(1);

    const control = screen.getByRole('button', { name: fold.backdropPause });
    expect(control).not.toHaveAttribute('aria-pressed');

    fireEvent.click(control);
    expect(pause).toHaveBeenCalledTimes(1);
    expect(control).toHaveAccessibleName(fold.backdropPlay);
    expect(control).not.toHaveAttribute('aria-pressed');

    fireEvent.click(control);
    expect(play).toHaveBeenCalledTimes(2);
    expect(control).toHaveAccessibleName(fold.backdropPause);
    expect(control).not.toHaveAttribute('aria-pressed');
  });
});
