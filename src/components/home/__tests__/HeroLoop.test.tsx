// The fold's pause control against the loop it governs. jsdom has no WebGL, so
// the wall fails closed and the loop is what is left; its video element exists
// but cannot play, so play() and pause() are stubbed and counted.
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { HeroLoop } from '../HeroLoop';

const VIDEO = '/video/hero-loop.mp4';
const PAUSE = 'Pausar o vídeo de fundo';
const PLAY = 'Reproduzir o vídeo de fundo';

let play: MockInstance<HTMLMediaElement['play']>;
let pause: MockInstance<HTMLMediaElement['pause']>;

function renderLoop() {
  return render(
    <HeroLoop video={VIDEO} pauseLabel={PAUSE} playLabel={PLAY}>
      {/* eslint-disable-next-line @next/next/no-img-element -- stands in for the server's next/image */}
      <img data-backdrop alt="Palco" src="/video/hero-loop.jpg" />
    </HeroLoop>,
  );
}

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

describe('HeroLoop', () => {
  it('keeps the poster the server sent and attaches the loop only once the page is idle', () => {
    const { container } = renderLoop();
    expect(screen.getByAltText('Palco')).toBeInTheDocument();
    expect(container.querySelector('video')).not.toHaveAttribute('src');
    expect(play).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(container.querySelector('video')).toHaveAttribute('src', VIDEO);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('names the backdrop control after what a press does, with no pressed state to contradict it', () => {
    renderLoop();
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    const control = screen.getByRole('button', { name: PAUSE });
    expect(control).not.toHaveAttribute('aria-pressed');

    fireEvent.click(control);
    expect(pause).toHaveBeenCalledTimes(1);
    expect(control).toHaveAccessibleName(PLAY);
    expect(control).not.toHaveAttribute('aria-pressed');

    fireEvent.click(control);
    expect(play).toHaveBeenCalledTimes(2);
    expect(control).toHaveAccessibleName(PAUSE);
    expect(control).not.toHaveAttribute('aria-pressed');
  });

  it('leaves the wall transparent when there is no WebGL2, so the poster shows', () => {
    const { container } = renderLoop();
    expect(container.querySelector('canvas')).not.toHaveAttribute('data-live');
  });

  it('never autoplays with sound: the loop is muted and hidden from assistive tech', () => {
    const { container } = renderLoop();
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute('aria-hidden', 'true');
  });
});
