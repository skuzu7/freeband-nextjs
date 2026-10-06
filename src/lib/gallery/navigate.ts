// src/lib/gallery/navigate.ts
// The two things the viewer has to ask of the browser itself rather than of
// the router. Kept apart so that each has one place and one explanation.

const FOCUS_KEY = 'freeband:viewer-focus';
/** A remembered control is only good for the page load that follows it. */
const FOCUS_TTL_MS = 8000;

/**
 * Go to another photograph's own page with a real page load, replacing the
 * current history entry.
 *
 * A soft navigation cannot do this. Every client-side navigation to a
 * photograph's address from inside the site is intercepted and rendered in the
 * lightbox slot — including one that starts on a photograph's own page, where
 * it would open the lightbox over that page. A document load is never
 * intercepted, and the pages are static, so it is also cheap.
 */
export function loadPhotoPage(href: string, focus?: string | null): void {
  try {
    if (focus) sessionStorage.setItem(FOCUS_KEY, JSON.stringify({ focus, at: Date.now() }));
    else sessionStorage.removeItem(FOCUS_KEY);
  } catch {
    // Storage is unavailable (private mode): the focus simply starts at the top.
  }
  window.location.replace(href);
}

/** The control that had the focus before the page load that brought us here, once. */
export function takeRememberedFocus(): string | null {
  try {
    const raw = sessionStorage.getItem(FOCUS_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(FOCUS_KEY);
    const { focus, at } = JSON.parse(raw) as { focus?: unknown; at?: unknown };
    if (typeof focus !== 'string' || typeof at !== 'number') return null;
    return Date.now() - at < FOCUS_TTL_MS ? focus : null;
  } catch {
    return null;
  }
}

/**
 * Take the fragment off the current address, in place, before the lightbox
 * opens over the page.
 *
 * The lightbox closes by going back in history. Going back to an address with
 * a fragment makes the browser act on the fragment again: it scrolls to its
 * target and takes the focus away from wherever it was put. The page must be
 * found exactly as it was left, with the focus on the thumbnail — so the
 * entry the lightbox will return to carries no fragment. The scroll position
 * is the browser's to restore, and it does.
 */
export function dropFragment(): void {
  const { pathname, search, hash } = window.location;
  if (hash) window.history.replaceState(null, '', pathname + search);
}
