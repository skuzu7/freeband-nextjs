'use client';

// src/components/media/lightbox/LightboxDialog.tsx
// The lightbox: the photo viewer as a modal dialog over the gallery page.
// It is the layout of the intercepted route, so it stays mounted while the
// photographs inside it change — which is what lets it keep the focus, hold
// the page behind it still, and speak each new caption from one live region.
//
//   open     focus goes to the close control; the rest of the page is inert
//            and does not scroll
//   Tab      stays inside
//   Esc      router.back(): the URL returns to the gallery and the slot empties
//   back     the same, by the browser's own button or gesture
//   close    focus goes to the thumbnail of the photograph that was on show,
//            or to whatever opened the lightbox if that thumbnail is not there
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { cycleFocus } from '@/lib/focusTrap';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useInertOutside } from '@/hooks/useInertOutside';
import { DotGrid } from '@/components/brand/DotGrid';
import { Icon } from '@/components/ui/Icon';
import { ViewerHostContext, useViewerHost, type ViewerHost } from './host';

const FOCUSABLE = 'a[href], button:not([disabled])';
const CLOSE = '[data-viewer-control="close"]';

interface LightboxDialogProps {
  /** Names the dialog: which gallery this is. */
  label: string;
  /** The keyboard, described for whoever cannot see the controls. */
  keys: string;
  children: ReactNode;
}

export function LightboxDialog({ label, keys, children }: LightboxDialogProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const keysId = useId();

  // Both before the focus effect below: effects are torn down in this order,
  // and the thumbnail cannot take focus while it is still inert.
  useInertOutside(dialogRef, true);
  useBodyScrollLock(true);

  const host = useMemo<ViewerHost>(
    () => ({
      show: (current) => {
        anchorRef.current = current.anchor;
        setAnnouncement(current.announcement);
      },
      close: () => router.back(),
    }),
    [router],
  );

  /** The thumbnail of the photograph on show, if the page still has it. */
  const currentThumbnail = useCallback(
    () => (anchorRef.current ? document.getElementById(anchorRef.current) : null),
    [],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    (dialog?.querySelector<HTMLElement>(CLOSE) ?? dialog)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        router.back();
        return;
      }
      cycleFocus(event, dialog, FOCUSABLE);
    };
    // Last resort. The router ignores a traversal to a history entry it did
    // not write, which would leave this dialog open over a URL that is no
    // longer a photograph. HistoryKeeper hands the router every entry an
    // in-page anchor makes; if one still got through, load the page the
    // address bar now names.
    const onPopState = (event: PopStateEvent) => {
      if (event.state === null) window.location.reload();
    };
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('popstate', onPopState);
      (currentThumbnail() ?? opener)?.focus();
    };
  }, [router, currentThumbnail]);

  return (
    <ViewerHostContext.Provider value={host}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        aria-describedby={keysId}
        tabIndex={-1}
        className="lightbox"
      >
        <DotGrid fade />
        {children}
        {/* One node for the whole visit: a live region speaks when its own
            text changes, and the viewer inside is replaced at every step. */}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
        <p id={keysId} className="sr-only">
          {keys}
        </p>
      </div>
    </ViewerHostContext.Provider>
  );
}

/** The lightbox's close control. A button, not a link: it dismisses a dialog. */
export function LightboxClose({ label }: { label: string }) {
  const host = useViewerHost();
  return (
    <button
      type="button"
      data-viewer-control="close"
      aria-label={label}
      onClick={() => host?.close()}
      className="viewer-control viewer-close"
    >
      <Icon name="close" className="size-5" />
    </button>
  );
}
