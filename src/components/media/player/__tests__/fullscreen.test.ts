// Full screen across the engines: the standard API on the container, the
// prefixed one Safari answered to for years, and the iPhone, which only hands
// the screen to the <video> itself. Each engine is a hand-built document here;
// none of this has run on a real iPhone.
import { describe, expect, it, vi } from 'vitest';
import { enterFullscreen, exitFullscreen, fullscreenMode, isFullscreen, onFullscreenChange } from '../fullscreen';

/** A document as one engine presents it. */
function engine({
  enabled,
  prefixedEnabled,
  request,
  prefixedRequest,
  videoOnly,
}: {
  enabled?: boolean;
  prefixedEnabled?: boolean;
  request?: boolean;
  prefixedRequest?: boolean;
  videoOnly?: boolean;
}): Document {
  class Video {}
  if (videoOnly) (Video.prototype as { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen = () => {};
  return {
    fullscreenEnabled: enabled,
    webkitFullscreenEnabled: prefixedEnabled,
    documentElement: {
      requestFullscreen: request ? () => Promise.resolve() : undefined,
      webkitRequestFullscreen: prefixedRequest ? () => {} : undefined,
    },
    defaultView: { HTMLVideoElement: Video },
  } as unknown as Document;
}

describe('fullscreenMode', () => {
  it('takes the whole player where the Fullscreen API is there, prefixed or not', () => {
    expect(fullscreenMode(engine({ enabled: true, request: true }))).toBe('element');
    expect(fullscreenMode(engine({ prefixedEnabled: true, prefixedRequest: true }))).toBe('element');
    // A desktop Safari has both: the container wins, so the player keeps its controls.
    expect(fullscreenMode(engine({ enabled: true, request: true, videoOnly: true }))).toBe('element');
  });

  it('falls back to the video alone on an iPhone', () => {
    expect(fullscreenMode(engine({ videoOnly: true }))).toBe('video');
    // The API exists but the page may not use it (an iframe without permission).
    expect(fullscreenMode(engine({ enabled: false, request: true, videoOnly: true }))).toBe('video');
  });

  it('offers nothing where there is nothing', () => {
    expect(fullscreenMode(engine({}))).toBeNull();
    expect(fullscreenMode(engine({ enabled: false, request: true }))).toBeNull();
    // jsdom itself: no Fullscreen API.
    expect(fullscreenMode()).toBeNull();
  });
});

describe('entering and leaving', () => {
  const root = () => document.createElement('div');
  const video = () => document.createElement('video');

  it('asks for the container in element mode, through whichever method exists', () => {
    const standard = Object.assign(root(), { requestFullscreen: vi.fn(() => Promise.resolve()) });
    expect(enterFullscreen(standard, video(), 'element')).toBe(true);
    expect(standard.requestFullscreen).toHaveBeenCalledTimes(1);

    const prefixed = Object.assign(root(), { webkitRequestFullscreen: vi.fn() });
    expect(enterFullscreen(prefixed, video(), 'element')).toBe(true);
    expect(prefixed.webkitRequestFullscreen).toHaveBeenCalledTimes(1);

    expect(enterFullscreen(root(), video(), 'element')).toBe(false);
    expect(enterFullscreen(root(), video(), null)).toBe(false);
  });

  it('swallows a refusal instead of leaving a rejected promise behind', async () => {
    const refused = Object.assign(root(), { requestFullscreen: vi.fn(() => Promise.reject(new Error('denied'))) });
    expect(enterFullscreen(refused, video(), 'element')).toBe(true);
    await Promise.resolve();
  });

  it('asks the video itself in video mode, and says so when the video is not ready', () => {
    const ready = Object.assign(video(), { webkitEnterFullscreen: vi.fn() });
    expect(enterFullscreen(root(), ready, 'video')).toBe(true);
    expect(ready.webkitEnterFullscreen).toHaveBeenCalledTimes(1);

    // An iPhone before the metadata: InvalidStateError.
    const early = Object.assign(video(), {
      webkitEnterFullscreen: vi.fn(() => {
        throw new DOMException('not ready', 'InvalidStateError');
      }),
    });
    expect(enterFullscreen(root(), early, 'video')).toBe(false);
    expect(enterFullscreen(root(), video(), 'video')).toBe(false);
  });

  it('knows whether this player has the screen', () => {
    const mine = root();
    const clip = video();
    const doc = (element: Element | null, prefixed?: Element | null) =>
      ({ fullscreenElement: element, webkitFullscreenElement: prefixed }) as unknown as Document;

    expect(isFullscreen(mine, clip, doc(null))).toBe(false);
    expect(isFullscreen(mine, clip, doc(mine))).toBe(true);
    expect(isFullscreen(mine, clip, doc(root()))).toBe(false);
    expect(isFullscreen(mine, clip, doc(undefined as unknown as null, mine))).toBe(true);
    expect(isFullscreen(mine, Object.assign(video(), { webkitDisplayingFullscreen: true }), doc(null))).toBe(true);
  });

  it('leaves by the way it came in', () => {
    const standard = { exitFullscreen: vi.fn(() => Promise.resolve()) } as unknown as Document;
    exitFullscreen(video(), standard);
    expect(standard.exitFullscreen).toHaveBeenCalledTimes(1);

    const prefixed = { webkitExitFullscreen: vi.fn() };
    exitFullscreen(video(), prefixed as unknown as Document);
    expect(prefixed.webkitExitFullscreen).toHaveBeenCalledTimes(1);

    const native = Object.assign(video(), { webkitDisplayingFullscreen: true, webkitExitFullscreen: vi.fn() });
    exitFullscreen(native, standard);
    expect(native.webkitExitFullscreen).toHaveBeenCalledTimes(1);
    expect(standard.exitFullscreen).toHaveBeenCalledTimes(1);
  });

  it('reports every way the screen can change hands, and stops when told', () => {
    const clip = video();
    const changed = vi.fn();
    const stop = onFullscreenChange(clip, changed);
    document.dispatchEvent(new Event('fullscreenchange'));
    document.dispatchEvent(new Event('webkitfullscreenchange'));
    clip.dispatchEvent(new Event('webkitbeginfullscreen'));
    clip.dispatchEvent(new Event('webkitendfullscreen'));
    expect(changed).toHaveBeenCalledTimes(4);
    stop();
    document.dispatchEvent(new Event('fullscreenchange'));
    clip.dispatchEvent(new Event('webkitendfullscreen'));
    expect(changed).toHaveBeenCalledTimes(4);
  });
});
