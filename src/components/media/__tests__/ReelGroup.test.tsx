import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ReelGroup } from '../ReelGroup';
import type { Reel as ReelData } from '@/data/media/reels';

// A clip needs a video element that plays and an observer; jsdom has neither,
// and neither is what these cases are about. Each one is replaced by a marker
// carrying the `active` the group handed it.
vi.mock('../Reel', () => ({
  Reel: ({ active }: { active: boolean }) => <div data-active={active} />,
}));

const PAUSE = 'Pausar os vídeos';
const PLAY = 'Reproduzir os vídeos';

const reel = (name: string): ReelData => ({
  src: `/video/${name}.mp4`,
  poster: `/video/${name}.jpg`,
  alt: `Trecho ${name}`,
  caption: name,
  tag: 'Vozes',
  aspect: '16/9',
});
const reels = [reel('um'), reel('dois')];

function mount() {
  const { container } = render(<ReelGroup reels={reels} pauseLabel={PAUSE} playLabel={PLAY} />);
  return {
    control: screen.getByRole('button'),
    /** The `active` each clip is getting right now, in order. */
    active: () => Array.from(container.querySelectorAll('[data-active]'), (el) => el.getAttribute('data-active')),
  };
}

afterEach(() => vi.unstubAllGlobals());

describe('ReelGroup', () => {
  it('names its one control after what a press does, with no pressed state to contradict it', () => {
    const { control, active } = mount();
    expect(control).toHaveAccessibleName(PAUSE);
    expect(control).not.toHaveAttribute('aria-pressed');
    expect(active()).toEqual(['true', 'true']);

    fireEvent.click(control);
    expect(control).toHaveAccessibleName(PLAY);
    expect(control).not.toHaveAttribute('aria-pressed');
    expect(active()).toEqual(['false', 'false']);

    fireEvent.click(control);
    expect(control).toHaveAccessibleName(PAUSE);
    expect(control).not.toHaveAttribute('aria-pressed');
    expect(active()).toEqual(['true', 'true']);
  });

  it('starts paused under reduced motion and still offers to play', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }));
    const { control, active } = mount();
    expect(control).toHaveAccessibleName(PLAY);
    expect(control).not.toHaveAttribute('aria-pressed');
    expect(active()).toEqual(['false', 'false']);

    fireEvent.click(control);
    expect(control).toHaveAccessibleName(PAUSE);
    expect(control).not.toHaveAttribute('aria-pressed');
    expect(active()).toEqual(['true', 'true']);
  });
});
