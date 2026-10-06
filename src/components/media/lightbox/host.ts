'use client';

// src/components/media/lightbox/host.ts
// What the viewer can ask of whatever holds it. Inside the lightbox that is
// the dialog (LightboxDialog): it outlives every step from one photograph to
// the next, so it owns the live region and knows which thumbnail to hand the
// focus back to. On a photograph's own page there is no host.
import { createContext, useContext } from 'react';

export interface ViewerHost {
  /** The photograph now on show: its thumbnail's id and what to say about it. */
  show: (current: { anchor: string; announcement: string }) => void;
  /** Leave the viewer and go back to the gallery underneath. */
  close: () => void;
}

export const ViewerHostContext = createContext<ViewerHost | null>(null);

/** The dialog around this viewer, or null on a photograph's own page. */
export function useViewerHost(): ViewerHost | null {
  return useContext(ViewerHostContext);
}
