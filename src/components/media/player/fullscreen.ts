// src/components/media/player/fullscreen.ts
// Full screen, with the prefixes Safari still answers to and the one platform
// that only hands the screen to the <video> itself: the iPhone.
//
//   element   the whole player goes full screen and keeps its own controls
//             (Fullscreen API on the container, prefixed or not)
//   video     only the <video> can (webkitEnterFullscreen); the system's
//             player takes over, with the system's controls
//   null      neither: the player shows no full-screen button

type PrefixedDocument = Document & {
  webkitFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type PrefixedElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

type PrefixedVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
};

export type FullscreenMode = 'element' | 'video' | null;

/** A promise that fails (the browser refused) is nobody's error to report. */
function settle(result: Promise<void> | void): void {
  if (result && typeof result.catch === 'function') result.catch(() => {});
}

/** What this browser can do, asked of the document: no player has to exist yet. */
export function fullscreenMode(doc: Document = document): FullscreenMode {
  const prefixed = doc as PrefixedDocument;
  const anyElement = doc.documentElement as PrefixedElement;
  const canRequest =
    typeof anyElement.requestFullscreen === 'function' || typeof anyElement.webkitRequestFullscreen === 'function';
  if (canRequest && (prefixed.fullscreenEnabled || prefixed.webkitFullscreenEnabled)) return 'element';
  const view = doc.defaultView as (Window & typeof globalThis) | null;
  if (view?.HTMLVideoElement && 'webkitEnterFullscreen' in view.HTMLVideoElement.prototype) return 'video';
  return null;
}

/** Whether this player — its container or, on an iPhone, its video — has the screen. */
export function isFullscreen(root: HTMLElement, video: HTMLVideoElement, doc: Document = document): boolean {
  const prefixed = doc as PrefixedDocument;
  const element = prefixed.fullscreenElement ?? prefixed.webkitFullscreenElement ?? null;
  return element === root || (video as PrefixedVideo).webkitDisplayingFullscreen === true;
}

/**
 * Asks for the screen. False when it could not even ask: an iPhone refuses
 * until the video knows its own dimensions, and the caller can try again once
 * the metadata is in.
 */
export function enterFullscreen(root: HTMLElement, video: HTMLVideoElement, mode: FullscreenMode): boolean {
  try {
    if (mode === 'element') {
      const prefixed = root as PrefixedElement;
      if (typeof root.requestFullscreen === 'function') settle(root.requestFullscreen());
      else if (prefixed.webkitRequestFullscreen) settle(prefixed.webkitRequestFullscreen());
      else return false;
      return true;
    }
    if (mode === 'video') {
      const prefixed = video as PrefixedVideo;
      if (!prefixed.webkitEnterFullscreen) return false;
      prefixed.webkitEnterFullscreen();
      return true;
    }
  } catch {
    // InvalidStateError on an iPhone before the metadata, or a refusal.
  }
  return false;
}

export function exitFullscreen(video: HTMLVideoElement, doc: Document = document): void {
  const prefixed = doc as PrefixedDocument;
  try {
    if ((video as PrefixedVideo).webkitDisplayingFullscreen) (video as PrefixedVideo).webkitExitFullscreen?.();
    else if (typeof doc.exitFullscreen === 'function') settle(doc.exitFullscreen());
    else if (prefixed.webkitExitFullscreen) settle(prefixed.webkitExitFullscreen());
  } catch {
    // Already out.
  }
}

/** Calls `onChange` whenever the screen is taken or given back; returns the unsubscribe. */
export function onFullscreenChange(video: HTMLVideoElement, onChange: () => void, doc: Document = document): () => void {
  const documentEvents = ['fullscreenchange', 'webkitfullscreenchange'];
  const videoEvents = ['webkitbeginfullscreen', 'webkitendfullscreen'];
  for (const type of documentEvents) doc.addEventListener(type, onChange);
  for (const type of videoEvents) video.addEventListener(type, onChange);
  return () => {
    for (const type of documentEvents) doc.removeEventListener(type, onChange);
    for (const type of videoEvents) video.removeEventListener(type, onChange);
  };
}
