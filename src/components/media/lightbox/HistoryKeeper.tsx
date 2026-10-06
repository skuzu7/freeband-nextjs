'use client';

// src/components/media/lightbox/HistoryKeeper.tsx
// Keeps every history entry of the site known to the router, so that "back"
// always closes the lightbox.
//
// The lightbox closes with router.back(). The App Router only acts on a
// history entry it wrote itself: a traversal to any other is ignored (its
// popstate handler returns when `event.state` is empty). A plain in-page
// anchor — the skip link, the index of acts on /palco — is a navigation the
// browser makes on its own, and the entry it leaves has no state. Open a
// photograph from there, press Esc, and the URL would go back while the
// dialog stayed on screen.
//
// So after each of those the entry is handed to the router through the
// documented integration: window.history.replaceState with the same URL. The
// router takes the URL as its own and writes its state into the entry.
// Nothing renders and nothing scrolls.
import { useEffect } from 'react';

export function HistoryKeeper() {
  useEffect(() => {
    const adopt = () => {
      if (window.history.state === null) window.history.replaceState(null, '', window.location.href);
    };
    window.addEventListener('hashchange', adopt);
    return () => window.removeEventListener('hashchange', adopt);
  }, []);
  return null;
}
