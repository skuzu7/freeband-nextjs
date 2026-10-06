// The player with sound, against the <video> it drives. jsdom has a video
// element that cannot play: play() and pause() are replaced by stand-ins that
// flip `paused` and fire the events a browser would, and are counted.
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { contact } from '@/data/contact';
import { player as copy } from '@/data/copy/player';
import { videos, type VideoClip } from '@/data/media/videos';
import { audioFocus } from '@/lib/media/audioFocus';
import { getLevel, setLevel } from '@/lib/media/level';
import { Player, type PlayerProps } from '../Player';

const clip = videos[0];
const other = videos[1];

/** 0.4, 0.9, 0.4, 0.9 … at 20 samples a second: stretched, that is 0, 1, 0, 1. */
const ENVELOPE = { rate: 20, levels: Array.from({ length: 80 }, (_, i) => 0.4 + (i % 2) * 0.5) };
/** A moment at which that envelope is at its loudest. */
const LOUD_AT = 0.05;

let play: MockInstance<HTMLMediaElement['play']>;
let pause: MockInstance<HTMLMediaElement['pause']>;
let fetchEnvelope: ReturnType<typeof vi.fn>;
let sounding: WeakSet<HTMLMediaElement>;
/** The videos that have data. With preload="none" a real one has none until it is asked to play. */
let loaded: WeakSet<HTMLMediaElement>;
let clocks: WeakMap<HTMLMediaElement, number>;

/** The IntersectionObserver each player creates, with a way to move its target in and out of view. */
class FakeObserver {
  static all: FakeObserver[] = [];
  targets: Element[] = [];
  constructor(private callback: IntersectionObserverCallback) {
    FakeObserver.all.push(this);
  }
  observe(target: Element) {
    this.targets.push(target);
  }
  unobserve() {}
  disconnect() {
    this.targets = [];
  }
  takeRecords() {
    return [];
  }
  show(ratio: number) {
    const entries = this.targets.map(
      (target) => ({ target, isIntersecting: ratio > 0, intersectionRatio: ratio }) as IntersectionObserverEntry,
    );
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

/** Scrolls a player's picture so that `ratio` of it is on screen. */
function scrollTo(root: HTMLElement, ratio: number) {
  const stage = root.querySelector('.player-stage')!;
  act(() => {
    for (const observer of FakeObserver.all) if (observer.targets.includes(stage)) observer.show(ratio);
  });
}

function mount(props: Partial<PlayerProps> = {}) {
  const view = render(<Player clip={clip} sizes="100vw" {...props} />);
  const root = view.container.querySelector<HTMLElement>('.player')!;
  return { ...view, root, video: root.querySelector('video')!, ui: within(root) };
}

/** Two players on one page, as /palco has them. */
function mountPair() {
  const view = render(
    <>
      <Player clip={clip} sizes="50vw" />
      <Player clip={other} sizes="50vw" />
    </>,
  );
  const [a, b] = Array.from(view.container.querySelectorAll<HTMLElement>('.player'));
  const side = (root: HTMLElement, title: string) => ({
    root,
    video: root.querySelector('video')!,
    ui: within(root),
    playButton: () => within(root).getByRole('button', { name: new RegExp(`: ${title}$`) }),
  });
  return { a: side(a, clip.title), b: side(b, other.title) };
}

beforeEach(() => {
  sounding = new WeakSet();
  loaded = new WeakSet();
  clocks = new WeakMap();
  FakeObserver.all = [];
  vi.stubGlobal('IntersectionObserver', FakeObserver);
  fetchEnvelope = vi.fn(async () => ({ ok: true, json: async () => ENVELOPE }));
  vi.stubGlobal('fetch', fetchEnvelope);

  vi.spyOn(HTMLMediaElement.prototype, 'paused', 'get').mockImplementation(function (this: HTMLMediaElement) {
    return !sounding.has(this);
  });
  vi.spyOn(HTMLMediaElement.prototype, 'readyState', 'get').mockImplementation(function (this: HTMLMediaElement) {
    return loaded.has(this) ? 4 : 0;
  });
  vi.spyOn(HTMLMediaElement.prototype, 'currentTime', 'get').mockImplementation(function (this: HTMLMediaElement) {
    return clocks.get(this) ?? 0;
  });
  vi.spyOn(HTMLMediaElement.prototype, 'currentTime', 'set').mockImplementation(function (
    this: HTMLMediaElement,
    value: number,
  ) {
    clocks.set(this, value);
  });
  play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
    sounding.add(this);
    fireEvent.play(this);
    loaded.add(this);
    fireEvent.loadedData(this);
    fireEvent.playing(this);
    return Promise.resolve();
  });
  pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) {
    if (!sounding.has(this)) return;
    sounding.delete(this);
    fireEvent.pause(this);
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  setLevel(0);
});

describe('Player — what the server sends', () => {
  it('is a <video> with the browser’s own controls, AV1 first and H.264 after it, and nothing that needs a script', () => {
    const html = renderToString(<Player clip={clip} sizes="100vw" />);
    const page = document.createElement('div');
    page.innerHTML = html;
    const video = page.querySelector('video')!;

    expect(video).toHaveAttribute('controls');
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).not.toHaveAttribute('autoplay');
    expect(video).not.toHaveAttribute('muted');
    expect(video).not.toHaveAttribute('src');
    // The poster is the frame's file by way of the image optimiser, small:
    // a browser fetches it with the page, whether or not anyone gets that far.
    expect(video.getAttribute('poster')).toContain(encodeURIComponent(clip.poster));
    expect(video.getAttribute('poster')).toMatch(/[?&]w=640(&|$)/);

    const sources = Array.from(video.querySelectorAll('source'), (s) => [s.getAttribute('src'), s.getAttribute('type')]);
    expect(sources).toEqual([
      ['/video/vocal-em-primeiro-plano.av1.mp4', 'video/mp4; codecs="av01.0.08M.08, mp4a.40.2"'],
      ['/video/vocal-em-primeiro-plano.mp4', 'video/mp4; codecs="avc1.640028, mp4a.40.2"'],
    ]);

    // The player's own controls arrive with the script, into room already held for them.
    expect(page.querySelectorAll('button, input')).toHaveLength(0);
    expect(page.querySelector('.player-bar')).toBeEmptyDOMElement();
    expect(page.querySelector('.player')).not.toHaveAttribute('data-ready');
    // The poster is also a photograph under the video, with its description.
    expect(page.querySelector('img')).toHaveAttribute('alt', clip.alt);
  });

  it('hands over to its own controls once hydrated, without a mismatch', () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const page = document.createElement('div');
    document.body.append(page);
    page.innerHTML = renderToString(<Player clip={clip} sizes="100vw" />);
    const video = page.querySelector('video')!;
    expect(video).toHaveAttribute('controls');

    render(<Player clip={clip} sizes="100vw" />, { container: page, hydrate: true });

    // The same element, not a new one: a clip already playing would go on playing.
    expect(page.querySelector('video')).toBe(video);
    expect(video).not.toHaveAttribute('controls');
    expect(page.querySelector('.player')).toHaveAttribute('data-ready');
    expect(within(page).getByRole('button', { name: copy.play(clip.title) })).toBeInTheDocument();
    expect(errors).not.toHaveBeenCalled();
    expect(play).not.toHaveBeenCalled();
    page.remove();
  });
});

describe('Player — controls', () => {
  it('names the group after the clip and every control after what it does', () => {
    const { ui, root, video } = mount();

    expect(screen.getByRole('group', { name: clip.title })).toBe(root);
    expect(root).toHaveAccessibleDescription(copy.keys);
    expect(video).toHaveAttribute('aria-label', clip.title);
    expect(video).not.toHaveAttribute('controls');

    const playButton = ui.getByRole('button', { name: copy.play(clip.title) });
    expect(playButton).not.toHaveAttribute('aria-pressed');
    expect(playButton).toHaveAttribute('aria-keyshortcuts', 'K');

    const timeline = ui.getByRole('slider', { name: copy.seek });
    expect(timeline).toHaveAttribute('type', 'range');
    expect(timeline).toHaveAttribute('aria-valuetext', '0:00 de 0:27');

    expect(ui.getByRole('button', { name: copy.mute })).toHaveAttribute('aria-keyshortcuts', 'M');
    expect(ui.getByRole('slider', { name: copy.volume })).toHaveAttribute('aria-valuetext', '100%');
    // No track, no subtitles button; jsdom has no Fullscreen API, so no full-screen button either.
    expect(ui.queryByRole('button', { name: copy.captionsOn })).toBeNull();
    expect(ui.queryByRole('button', { name: copy.fullscreen })).toBeNull();
    for (const control of ui.getAllByRole('button')) expect(control).toHaveAccessibleName();
    for (const control of ui.getAllByRole('slider')) expect(control).toHaveAccessibleName();
  });

  it('is named by the title printed beside it when the page has one', () => {
    const { container } = render(
      <figure>
        <Player clip={clip} sizes="100vw" labelledBy="titulo" />
        <figcaption id="titulo">{clip.title}</figcaption>
      </figure>,
    );
    const root = container.querySelector('.player')!;
    expect(root).toHaveAttribute('aria-labelledby', 'titulo');
    expect(root).not.toHaveAttribute('aria-label');
    expect(screen.getByRole('group', { name: clip.title })).toBe(root);
  });

  it('shows the subtitles button only on a clip that has a track', () => {
    const subtitled: VideoClip = {
      ...clip,
      tracks: [{ src: '/video/legendas.vtt', kind: 'subtitles', srcLang: 'pt-BR', label: 'Português' }],
    };
    const { ui, video } = mount({ clip: subtitled });

    const track = video.querySelector('track')!;
    expect(track).toHaveAttribute('src', '/video/legendas.vtt');
    expect(track).toHaveAttribute('kind', 'subtitles');
    expect(track).toHaveAttribute('srclang', 'pt-BR');
    expect(track).toHaveAttribute('label', 'Português');

    const button = ui.getByRole('button', { name: copy.captionsOn });
    fireEvent.click(button);
    expect(button).toHaveAccessibleName(copy.captionsOff);
    fireEvent.click(button);
    expect(button).toHaveAccessibleName(copy.captionsOn);
  });

  it('follows the clip on the timeline and moves it when the timeline is moved', () => {
    const { ui, video } = mount();
    const timeline = ui.getByRole('slider', { name: copy.seek });

    video.currentTime = 5.4;
    fireEvent.timeUpdate(video);
    expect(timeline).toHaveAttribute('aria-valuetext', '0:05 de 0:27');
    expect(timeline).toHaveValue('5.4');

    fireEvent.change(timeline, { target: { value: '12' } });
    expect(video.currentTime).toBe(12);
    expect(timeline).toHaveAttribute('aria-valuetext', '0:12 de 0:27');
  });

  it('mutes, unmutes and sets the volume', () => {
    const { ui, video } = mount();
    const mute = ui.getByRole('button', { name: copy.mute });
    const volume = ui.getByRole('slider', { name: copy.volume });

    fireEvent.click(mute);
    expect(video.muted).toBe(true);
    expect(mute).toHaveAccessibleName(copy.unmute);
    expect(volume).toHaveAttribute('aria-valuetext', '0%');

    fireEvent.click(mute);
    expect(video.muted).toBe(false);
    expect(mute).toHaveAccessibleName(copy.mute);

    fireEvent.change(volume, { target: { value: '0.4' } });
    expect(video.volume).toBeCloseTo(0.4, 6);
    expect(volume).toHaveAttribute('aria-valuetext', '40%');

    // All the way down is silence; coming back from it is audible again.
    fireEvent.change(volume, { target: { value: '0' } });
    expect(mute).toHaveAccessibleName(copy.unmute);
    fireEvent.click(mute);
    expect(video.muted).toBe(false);
    expect(video.volume).toBeGreaterThan(0);
  });
});

describe('Player — sound', () => {
  it('never plays on its own: not on arrival, not when it scrolls into view', async () => {
    const { root, video } = mount();
    scrollTo(root, 1);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(play).not.toHaveBeenCalled();
    expect(video).not.toHaveAttribute('autoplay');
    expect(video.autoplay).toBe(false);
    expect(video.muted).toBe(false);
    // Nothing of the clip is fetched before it is asked for, its envelope included.
    expect(video).toHaveAttribute('preload', 'none');
    expect(fetchEnvelope).not.toHaveBeenCalled();
    expect(root).toHaveAttribute('data-state', 'idle');
  });

  it('plays, with sound, on the visitor’s click, and pauses on the next one', () => {
    const { ui, root, video } = mount();
    const button = ui.getByRole('button', { name: copy.play(clip.title) });

    fireEvent.click(button);
    expect(play).toHaveBeenCalledTimes(1);
    expect(play.mock.contexts[0]).toBe(video);
    expect(video.muted).toBe(false);
    expect(button).toHaveAccessibleName(copy.pause(clip.title));
    expect(root).toHaveAttribute('data-state', 'playing');

    fireEvent.click(button);
    expect(pause).toHaveBeenCalledTimes(1);
    expect(button).toHaveAccessibleName(copy.play(clip.title));
    expect(root).toHaveAttribute('data-state', 'paused');
  });

  it('keeps the poster on show until the video has a frame of its own', () => {
    // A slow network: the clip is asked for and nothing has arrived yet.
    play.mockImplementation(function (this: HTMLMediaElement) {
      sounding.add(this);
      fireEvent.play(this);
      return Promise.resolve();
    });
    const { ui, root, video } = mount();
    expect(root).not.toHaveAttribute('data-started');

    fireEvent.click(ui.getByRole('button', { name: copy.play(clip.title) }));
    expect(root).toHaveAttribute('data-state', 'playing');
    expect(root).toHaveAttribute('data-waiting');
    expect(ui.getByRole('status')).toHaveTextContent(copy.loading);
    // Still the photograph: the video is not shown before it has something to show.
    expect(root).not.toHaveAttribute('data-started');

    loaded.add(video);
    fireEvent.loadedData(video);
    fireEvent.playing(video);
    expect(root).toHaveAttribute('data-started');
    expect(root).not.toHaveAttribute('data-waiting');
    expect(ui.getByRole('status')).toBeEmptyDOMElement();
  });

  it('takes a click on the picture as play and pause, and brings the keyboard with it', () => {
    const { ui, video } = mount();
    fireEvent.click(video);
    expect(play).toHaveBeenCalledTimes(1);
    expect(ui.getByRole('button', { name: copy.pause(clip.title) })).toHaveFocus();
    fireEvent.click(video);
    expect(pause).toHaveBeenCalledTimes(1);
  });

  it('lets one clip sound at a time: playing the second pauses the first, and nothing resumes it', () => {
    const { a, b } = mountPair();

    fireEvent.click(a.playButton());
    expect(a.root).toHaveAttribute('data-state', 'playing');

    fireEvent.click(b.playButton());
    expect(pause).toHaveBeenCalledTimes(1);
    expect(pause.mock.contexts[0]).toBe(a.video);
    expect(a.video.paused).toBe(true);
    expect(a.root).toHaveAttribute('data-state', 'paused');
    expect(a.playButton()).toHaveAccessibleName(copy.play(clip.title));
    expect(b.root).toHaveAttribute('data-state', 'playing');

    // The second one stops: the first stays where it was left.
    fireEvent.click(b.playButton());
    expect(a.video.paused).toBe(true);
    expect(play.mock.contexts).toEqual([a.video, b.video]);
  });

  it('pauses when it scrolls out of view and does not start again when it comes back', () => {
    const { ui, root, video } = mount();
    fireEvent.click(ui.getByRole('button', { name: copy.play(clip.title) }));
    scrollTo(root, 1);
    expect(video.paused).toBe(false);

    scrollTo(root, 0.1);
    expect(pause).toHaveBeenCalledTimes(1);
    expect(root).toHaveAttribute('data-state', 'paused');

    scrollTo(root, 1);
    expect(play).toHaveBeenCalledTimes(1);
    expect(video.paused).toBe(true);
  });
});

describe('Player — keyboard', () => {
  it('answers no key while the focus is somewhere else on the page', () => {
    const { video } = mount();
    video.currentTime = 10;
    for (const key of [' ', 'k', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'm', 'f']) {
      fireEvent.keyDown(document.body, { key });
      fireEvent.keyDown(document, { key });
      fireEvent.keyDown(window, { key });
    }
    expect(play).not.toHaveBeenCalled();
    expect(video.currentTime).toBe(10);
    expect(video.muted).toBe(false);
    expect(video.volume).toBe(1);
  });

  it('plays and pauses with K and with the space bar', () => {
    const { ui } = mount();
    const timeline = ui.getByRole('slider', { name: copy.seek });
    timeline.focus();

    fireEvent.keyDown(timeline, { key: 'k' });
    expect(play).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(timeline, { key: 'K' });
    expect(pause).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(timeline, { key: ' ' });
    expect(play).toHaveBeenCalledTimes(2);
    // Held down, the key must not flicker between the two.
    fireEvent.keyDown(timeline, { key: 'k', repeat: true });
    expect(pause).toHaveBeenCalledTimes(1);
  });

  it('leaves the space bar to the button under the focus', () => {
    const { ui } = mount();
    const mute = ui.getByRole('button', { name: copy.mute });
    mute.focus();
    // Not prevented: the browser turns it into the button's own click.
    expect(fireEvent.keyDown(mute, { key: ' ' })).toBe(true);
    expect(play).not.toHaveBeenCalled();
    // K is not a key a button owns.
    fireEvent.keyDown(mute, { key: 'k' });
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('moves 5 seconds with the side arrows, inside the clip', () => {
    const { ui, video } = mount();
    const button = ui.getByRole('button', { name: copy.play(clip.title) });
    button.focus();
    video.currentTime = 10;

    expect(fireEvent.keyDown(button, { key: 'ArrowRight' })).toBe(false);
    expect(video.currentTime).toBe(15);
    fireEvent.keyDown(button, { key: 'ArrowLeft' });
    fireEvent.keyDown(button, { key: 'ArrowLeft' });
    expect(video.currentTime).toBe(5);
    fireEvent.keyDown(button, { key: 'ArrowLeft' });
    fireEvent.keyDown(button, { key: 'ArrowLeft' });
    expect(video.currentTime).toBe(0);

    video.currentTime = 25;
    fireEvent.keyDown(button, { key: 'ArrowRight' });
    expect(video.currentTime).toBe(clip.duration);
    expect(ui.getByRole('slider', { name: copy.seek })).toHaveAttribute('aria-valuetext', '0:27 de 0:27');
  });

  it('sets the volume with the up and down arrows, mutes with M', () => {
    const { ui, video } = mount();
    const timeline = ui.getByRole('slider', { name: copy.seek });
    timeline.focus();

    fireEvent.keyDown(timeline, { key: 'ArrowDown' });
    fireEvent.keyDown(timeline, { key: 'ArrowDown' });
    expect(video.volume).toBeCloseTo(0.8, 6);
    fireEvent.keyDown(timeline, { key: 'ArrowUp' });
    expect(video.volume).toBeCloseTo(0.9, 6);
    for (let i = 0; i < 4; i += 1) fireEvent.keyDown(timeline, { key: 'ArrowUp' });
    expect(video.volume).toBe(1);
    // The timeline itself did not move.
    expect(video.currentTime).toBe(0);

    fireEvent.keyDown(timeline, { key: 'm' });
    expect(video.muted).toBe(true);
    fireEvent.keyDown(timeline, { key: 'M' });
    expect(video.muted).toBe(false);
  });

  it('gives the volume slider its own side arrows', () => {
    const { ui, video } = mount();
    const volume = ui.getByRole('slider', { name: copy.volume });
    volume.focus();
    video.currentTime = 10;
    fireEvent.keyDown(volume, { key: 'ArrowLeft' });
    expect(video.volume).toBeCloseTo(0.9, 6);
    fireEvent.keyDown(volume, { key: 'ArrowRight' });
    expect(video.volume).toBe(1);
    expect(video.currentTime).toBe(10);
  });

  it('keeps out of the browser’s own shortcuts', () => {
    const { ui, video } = mount();
    const timeline = ui.getByRole('slider', { name: copy.seek });
    timeline.focus();
    expect(fireEvent.keyDown(timeline, { key: 'f', ctrlKey: true })).toBe(true);
    expect(fireEvent.keyDown(timeline, { key: 'k', metaKey: true })).toBe(true);
    expect(fireEvent.keyDown(timeline, { key: 'ArrowLeft', altKey: true })).toBe(true);
    expect(fireEvent.keyDown(timeline, { key: 'Tab' })).toBe(true);
    expect(play).not.toHaveBeenCalled();
    expect(video.currentTime).toBe(0);
  });

  it('reaches only the player that holds the focus', () => {
    const { a, b } = mountPair();
    b.video.currentTime = 10;
    a.playButton().focus();
    fireEvent.keyDown(a.playButton(), { key: 'k' });
    fireEvent.keyDown(a.playButton(), { key: 'm' });
    fireEvent.keyDown(a.playButton(), { key: 'ArrowRight' });

    expect(play.mock.contexts).toEqual([a.video]);
    expect(a.video.muted).toBe(true);
    expect(a.video.currentTime).toBe(5);
    expect(b.video.muted).toBe(false);
    expect(b.video.currentTime).toBe(10);
    expect(b.root).toHaveAttribute('data-state', 'idle');
  });
});

describe('Player — full screen', () => {
  const request = vi.fn(() => Promise.resolve());
  const exit = vi.fn(() => Promise.resolve());

  beforeEach(() => {
    request.mockClear();
    exit.mockClear();
    Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, value: true });
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, writable: true, value: null });
    Object.defineProperty(document, 'exitFullscreen', { configurable: true, value: exit });
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', { configurable: true, value: request });
  });

  afterEach(() => {
    for (const key of ['fullscreenEnabled', 'fullscreenElement', 'exitFullscreen'] as const) {
      Reflect.deleteProperty(document, key);
    }
    Reflect.deleteProperty(HTMLElement.prototype, 'requestFullscreen');
  });

  it('takes the whole player to full screen, by its button and by F, and names the way back', () => {
    const { ui, root } = mount();
    const button = ui.getByRole('button', { name: copy.fullscreen });
    expect(button).toHaveAttribute('aria-keyshortcuts', 'F');

    fireEvent.click(button);
    expect(request).toHaveBeenCalledTimes(1);
    // The container, so the player's own controls come along.
    expect(request.mock.contexts[0]).toBe(root);

    act(() => {
      (document as { fullscreenElement: Element | null }).fullscreenElement = root;
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    expect(button).toHaveAccessibleName(copy.exitFullscreen);
    expect(root).toHaveAttribute('data-fullscreen');

    button.focus();
    fireEvent.keyDown(button, { key: 'f' });
    expect(exit).toHaveBeenCalledTimes(1);

    act(() => {
      (document as { fullscreenElement: Element | null }).fullscreenElement = null;
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    expect(button).toHaveAccessibleName(copy.fullscreen);
    expect(root).not.toHaveAttribute('data-fullscreen');
  });

  it('does not pause for leaving the page’s flow while it has the screen', () => {
    const { ui, root, video } = mount();
    fireEvent.click(ui.getByRole('button', { name: copy.play(clip.title) }));
    (document as { fullscreenElement: Element | null }).fullscreenElement = root;
    scrollTo(root, 0);
    expect(video.paused).toBe(false);
    expect(pause).not.toHaveBeenCalled();
  });
});

describe('Player — the level the LED wall listens to', () => {
  it('publishes the clip’s level while it plays and takes it back to zero on pause', async () => {
    const { ui, video } = mount();
    const button = ui.getByRole('button', { name: copy.play(clip.title) });
    video.currentTime = LOUD_AT;
    expect(getLevel()).toBe(0);

    fireEvent.click(button);
    expect(fetchEnvelope).toHaveBeenCalledTimes(1);
    expect(fetchEnvelope).toHaveBeenCalledWith(clip.levels);
    await waitFor(() => expect(getLevel()).toBeGreaterThan(0.9));

    fireEvent.click(button);
    expect(getLevel()).toBe(0);
    // And it stays there: nothing is left running.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60));
    });
    expect(getLevel()).toBe(0);
  });

  it('takes it back to zero when the clip ends, and when the player leaves the page', async () => {
    const first = mount();
    first.video.currentTime = LOUD_AT;
    fireEvent.click(first.ui.getByRole('button', { name: copy.play(clip.title) }));
    await waitFor(() => expect(getLevel()).toBeGreaterThan(0.9));
    sounding.delete(first.video);
    fireEvent.ended(first.video);
    expect(getLevel()).toBe(0);
    expect(audioFocus.holder()).toBeNull();

    fireEvent.click(first.ui.getByRole('button', { name: copy.play(clip.title) }));
    await waitFor(() => expect(getLevel()).toBeGreaterThan(0.9));
    first.unmount();
    expect(getLevel()).toBe(0);
    expect(audioFocus.holder()).toBeNull();
  });

  it('is silent for a muted clip', async () => {
    const { ui, video } = mount();
    video.currentTime = LOUD_AT;
    fireEvent.click(ui.getByRole('button', { name: copy.play(clip.title) }));
    await waitFor(() => expect(getLevel()).toBeGreaterThan(0.9));
    fireEvent.click(ui.getByRole('button', { name: copy.mute }));
    await waitFor(() => expect(getLevel()).toBe(0));
    fireEvent.click(ui.getByRole('button', { name: copy.unmute }));
    await waitFor(() => expect(getLevel()).toBeGreaterThan(0.9));
  });

  it('hands the level from one clip to the next without dropping it when the first is cut off', async () => {
    const { a, b } = mountPair();
    a.video.currentTime = LOUD_AT;
    b.video.currentTime = LOUD_AT;
    fireEvent.click(a.playButton());
    await waitFor(() => expect(getLevel()).toBeGreaterThan(0.9));

    const seen: number[] = [];
    const { onLevel } = await import('@/lib/media/level');
    const stop = onLevel((level) => seen.push(level));
    fireEvent.click(b.playButton());
    await waitFor(() => expect(fetchEnvelope).toHaveBeenCalledWith(other.levels));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60));
    });
    stop();
    // The first clip's pause did not zero a level that was already the second one's.
    expect(seen).not.toContain(0);
    expect(getLevel()).toBeGreaterThan(0.9);

    fireEvent.click(b.playButton());
    expect(getLevel()).toBe(0);
  });

  it('publishes nothing under reduced motion: the wall does not pulse, the clip still plays', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }));
    const { ui, video } = mount();
    video.currentTime = LOUD_AT;
    fireEvent.click(ui.getByRole('button', { name: copy.play(clip.title) }));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60));
    });
    expect(play).toHaveBeenCalledTimes(1);
    expect(fetchEnvelope).not.toHaveBeenCalled();
    expect(getLevel()).toBe(0);
  });
});

describe('Player — a clip that cannot play', () => {
  const alertOf = (root: HTMLElement) => within(root).getByRole('alert');

  it('goes back to the poster with a line and the WhatsApp link when the last source fails', async () => {
    const { ui, root, video } = mount();
    video.currentTime = LOUD_AT;
    fireEvent.click(ui.getByRole('button', { name: copy.play(clip.title) }));
    await waitFor(() => expect(getLevel()).toBeGreaterThan(0.9));
    const [av1, h264] = Array.from(video.querySelectorAll('source'));

    // A browser without AV1 reports the first source and moves on to the next: not an error.
    fireEvent.error(av1);
    expect(root).toHaveAttribute('data-state', 'playing');
    expect(ui.queryByRole('alert')).toBeNull();

    fireEvent.error(h264);
    expect(root).toHaveAttribute('data-state', 'error');
    expect(alertOf(root)).toHaveTextContent(copy.error);
    const link = within(alertOf(root)).getByRole('link', { name: copy.errorCta });
    expect(link).toHaveAttribute('href', contact.whatsappQuoteLink);
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');

    // The poster is what is left; the controls of a clip that cannot play are gone.
    expect(ui.getByAltText(clip.alt)).toBeInTheDocument();
    expect(ui.queryByRole('button')).toBeNull();
    expect(ui.queryByRole('slider')).toBeNull();
    expect(root).not.toHaveAccessibleDescription();
    // And it no longer holds the sound or the wall.
    expect(getLevel()).toBe(0);
    expect(audioFocus.holder()).toBeNull();

    // No key brings it back to life.
    fireEvent.keyDown(root, { key: 'k' });
    fireEvent.click(video);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('does the same for an error of the video itself', () => {
    const { root, video } = mount();
    fireEvent.error(video);
    expect(root).toHaveAttribute('data-state', 'error');
    expect(alertOf(root)).toHaveTextContent(copy.error);
  });

  it('does the same when play() finds no source it can use', async () => {
    play.mockImplementation(() => Promise.reject(new DOMException('no supported source', 'NotSupportedError')));
    const { ui, root } = mount();
    fireEvent.click(ui.getByRole('button', { name: copy.play(clip.title) }));
    await waitFor(() => expect(root).toHaveAttribute('data-state', 'error'));
    expect(alertOf(root)).toHaveTextContent(copy.error);
    expect(audioFocus.holder()).toBeNull();
  });

  it('does not call a play() that was merely interrupted an error', async () => {
    play.mockImplementation(() => Promise.reject(new DOMException('interrupted by pause', 'AbortError')));
    const { ui, root } = mount();
    fireEvent.click(ui.getByRole('button', { name: copy.play(clip.title) }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(root).toHaveAttribute('data-state', 'idle');
    expect(ui.queryByRole('alert')).toBeNull();
    expect(root).not.toHaveAttribute('data-waiting');
    expect(audioFocus.holder()).toBeNull();
  });
});
