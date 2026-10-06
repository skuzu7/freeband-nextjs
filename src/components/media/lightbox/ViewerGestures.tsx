'use client';

// src/components/media/lightbox/ViewerGestures.tsx
// The viewer made live. PhotoViewer already printed the whole photograph, its
// caption and the links around it on the server; this adds what needs a
// browser: pinch, pan, double tap, swipe and drag-to-close on the photograph,
// the keyboard, the zoom and share controls, and warming the neighbours.
//
// Every rule about a gesture lives in src/lib/gallery/gesture.ts, pure. Here
// pointer events go in and a transform comes out, written to the element in
// requestAnimationFrame — a finger moving never re-renders React. React state
// holds only what changes a handful of times: whether the photograph is
// zoomed, and the `sizes` the image asks the browser for.
import { getImageProps } from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DragEvent, PointerEvent as ReactPointerEvent } from 'react';
import type { Photo as PhotoData } from '@/data/media/paths';
import {
  KEY_ZOOM_STEP,
  initialGesture,
  isZoomed,
  maxScale,
  present,
  reduceGesture,
  type GestureBounds,
  type GestureEvent,
  type GestureIntent,
  type GestureResult,
  type GestureState,
} from '@/lib/gallery/gesture';
import { loadPhotoPage, takeRememberedFocus } from '@/lib/gallery/navigate';
import { naturalSize, viewerSizes, zoomedSizes } from '@/lib/gallery/sets';
import { Icon } from '@/components/ui/Icon';
import { Transition } from '@/components/ui/Transition';
import { PhotoView } from '../PhotoView';
import { useViewerHost } from './host';
import { PHOTO_SHARE, STEP_NEXT, STEP_PREV, type StepType } from './transitions';

export interface ViewerHrefs {
  self: string;
  prev: string;
  next: string;
  first: string;
  last: string;
  /** The gallery page, at this photograph's thumbnail. */
  back: string;
}

export interface ViewerToolLabels {
  zoomIn: string;
  zoomOut: string;
  share: string;
  copied: string;
  shareFailed: string;
}

interface ViewerGesturesProps {
  photo: PhotoData;
  /** Blur placeholder, looked up on the server. */
  blur?: string;
  /** A page of its own, or the lightbox over the gallery. */
  mode: 'page' | 'modal';
  /** View-transition name shared with the thumbnail. */
  name: string;
  /** DOM id of the thumbnail on the gallery page. */
  anchor: string;
  /** What a screen reader hears when this photograph comes on. */
  announcement: string;
  /** Title handed to the share sheet. */
  title: string;
  hrefs: ViewerHrefs;
  /** The photographs one step away, fetched once this one is on screen. */
  neighbours: Pick<PhotoData, 'src' | 'aspect'>[];
  labels: ViewerToolLabels;
}

const NO_BOUNDS: GestureBounds = {
  stage: { width: 0, height: 0 },
  fit: { width: 0, height: 0 },
  natural: { width: 0, height: 0 },
  dismissible: false,
};

interface ZoomUi {
  /** The file has more pixels than its box: zooming shows something. */
  available: boolean;
  zoomed: boolean;
  atMax: boolean;
}
const NO_ZOOM: ZoomUi = { available: false, zoomed: false, atMax: false };

/** How long the "link copied" note stays, in ms. */
const NOTICE_MS = 2600;
/** Wait this long after the last zoom before asking for a larger file. */
const SIZES_DELAY_MS = 160;
/** How long a photograph that was swiped away waits for its replacement. */
const LEAVE_TIMEOUT_MS = 5000;

// The control that had the focus when a step replaced the viewer under it.
// Each photograph is a new route segment, so the focused link is unmounted
// with the old one; the next viewer hands the focus to the same control. (On
// a photograph's own page the step is a page load, and the same thing is
// carried across it by loadPhotoPage / takeRememberedFocus.)
let lastControl: string | null = null;

// The direction of the step that is bringing the next viewer in, so that its
// photograph can arrive from that side (.viewer-photo[data-enter]). Set when a
// step is asked for, read once by the viewer that mounts because of it.
let arrivingFrom: StepType | null = null;

/** The viewer control that holds the focus right now, by name. */
function focusedControl(): string | null {
  return document.activeElement?.closest('[data-viewer-control]')?.getAttribute('data-viewer-control') ?? null;
}

function isTyping(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

export function ViewerGestures({
  photo,
  blur,
  mode,
  name,
  anchor,
  announcement,
  title,
  hrefs,
  neighbours,
  labels,
}: ViewerGesturesProps) {
  const router = useRouter();
  const host = useViewerHost();
  const stageRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<GestureState>(initialGesture);
  const boundsRef = useRef<GestureBounds>(NO_BOUNDS);
  const frameRef = useRef(0);
  const requestedWidthRef = useRef(0);
  const sizesTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Which side this photograph arrives from, if a step brought it here.
  const [enter] = useState(() => arrivingFrom);
  const [zoom, setZoom] = useState<ZoomUi>(NO_ZOOM);
  const [sizes, setSizes] = useState(() => viewerSizes(photo.aspect));
  const [notice, setNotice] = useState('');

  const dismissible = mode === 'modal';
  const single = hrefs.next === hrefs.self;

  // ---- drawing: the machine's state → the element's transform -------------

  const paint = useCallback(() => {
    frameRef.current = 0;
    const el = photoRef.current;
    const stage = stageRef.current;
    if (!el || !stage) return;
    const p = present(gestureRef.current, boundsRef.current);
    const atRest = p.x === 0 && p.y === 0 && p.scale === 1;
    el.style.transform = atRest ? '' : `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px) scale(${p.scale.toFixed(4)})`;
    el.toggleAttribute('data-dragging', p.dragging);
    if (p.leaving === 'next' || p.leaving === 'prev') el.setAttribute('data-leaving', p.leaving);
    else el.removeAttribute('data-leaving');
    // Dragging down dims the lightbox, so the page shows through as it lets go.
    stage.closest<HTMLElement>('.lightbox')?.style.setProperty('--lightbox-dim', p.dismiss.toFixed(3));
  }, []);

  // ---- leaving: another photograph, or out ---------------------------------

  const step = useCallback(
    (href: string, type: StepType) => {
      if (href === hrefs.self) return;
      // In the lightbox the router steps, intercepted, under the same dialog.
      // On the page it must be a page load (see loadPhotoPage).
      if (mode === 'modal') {
        arrivingFrom = type;
        router.replace(href, { scroll: false, transitionTypes: [type] });
      } else loadPhotoPage(href, focusedControl());
    },
    [router, hrefs.self, mode],
  );

  const close = useCallback(() => {
    if (host) host.close();
    else router.push(hrefs.back);
  }, [host, router, hrefs.back]);

  const act = useCallback(
    (intent: GestureIntent) => {
      if (intent === 'next') step(hrefs.next, STEP_NEXT);
      else if (intent === 'prev') step(hrefs.prev, STEP_PREV);
      else close();
    },
    [step, close, hrefs.next, hrefs.prev],
  );

  // ---- the machine ---------------------------------------------------------

  const dispatch = useCallback(
    (event: GestureEvent): GestureResult => {
      const bounds = boundsRef.current;
      let result = reduceGesture(gestureRef.current, event, bounds);
      // A set of one has nowhere to step to: the photograph comes back.
      if (single && (result.intent === 'next' || result.intent === 'prev')) {
        result = { state: reduceGesture(result.state, { type: 'reset' }, bounds).state };
      }
      const { state } = result;
      gestureRef.current = state;
      if (!frameRef.current) frameRef.current = requestAnimationFrame(paint);

      const max = maxScale(bounds);
      const next: ZoomUi = { available: max > 1, zoomed: isZoomed(state), atMax: state.view.scale >= max - 0.001 };
      setZoom((prev) =>
        prev.available === next.available && prev.zoomed === next.zoomed && prev.atMax === next.atMax ? prev : next,
      );

      // Magnified past what was asked for: ask for a larger file, once the
      // zoom has settled. Only ever grows, and never beyond the file itself.
      const width = bounds.fit.width * state.view.scale;
      if (next.zoomed && state.pointers.length === 0 && width > requestedWidthRef.current * 1.05) {
        clearTimeout(sizesTimerRef.current);
        sizesTimerRef.current = setTimeout(() => {
          requestedWidthRef.current = width;
          setSizes(zoomedSizes(photo.aspect, width));
        }, SIZES_DELAY_MS);
      }

      if (result.intent) {
        act(result.intent);
        // The photograph is on its way out and a new viewer normally replaces
        // this one. If nothing has by then (the network, a failed route),
        // bring it back rather than leave an empty stage.
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = setTimeout(() => {
          gestureRef.current = reduceGesture(gestureRef.current, { type: 'reset' }, boundsRef.current).state;
          paint();
        }, LEAVE_TIMEOUT_MS);
      }
      return result;
    },
    [paint, act, single, photo.aspect],
  );

  // ---- geometry: the stage, the photograph at 1×, the file -----------------

  useEffect(() => {
    const stage = stageRef.current;
    const el = photoRef.current;
    if (!stage || !el || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      boundsRef.current = {
        stage: { width: stage.clientWidth, height: stage.clientHeight },
        // offsetWidth ignores the transform: this is the photograph at 1×.
        fit: { width: el.offsetWidth, height: el.offsetHeight },
        natural: naturalSize(photo.aspect),
        dismissible,
      };
      dispatch({ type: 'resize' });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(el);
    return () => observer.disconnect();
  }, [dispatch, dismissible, photo.aspect]);

  useEffect(
    () => () => {
      cancelAnimationFrame(frameRef.current);
      clearTimeout(sizesTimerRef.current);
      clearTimeout(noticeTimerRef.current);
      clearTimeout(leaveTimerRef.current);
    },
    [],
  );

  // ---- pointers ------------------------------------------------------------

  /** A pointer position measured from the centre of the stage. */
  const fromCentre = useCallback((event: { clientX: number; clientY: number }) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2 };
  }, []);

  const tracked = (id: number) => gestureRef.current.pointers.some((p) => p.id === id);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    // A primary pointer opens a new gesture. Anything the machine still holds
    // never got its "up" (the browser took the touch for a scroll): let it go.
    if (event.isPrimary) {
      for (const stale of gestureRef.current.pointers) dispatch({ type: 'cancel', id: stale.id });
    }
    // Capture: the gesture keeps arriving here when the finger leaves the stage.
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      // The pointer is already gone; the gesture simply will not start.
    }
    dispatch({ type: 'down', id: event.pointerId, ...fromCentre(event), time: event.timeStamp });
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!tracked(event.pointerId)) return;
    dispatch({ type: 'move', id: event.pointerId, ...fromCentre(event), time: event.timeStamp });
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!tracked(event.pointerId)) return;
    dispatch({ type: 'up', id: event.pointerId, ...fromCentre(event), time: event.timeStamp });
  };
  // Cancelled, or the capture lost mid-gesture: either way the pointer is gone.
  // (After an ordinary "up" the capture is released too, and nothing is tracked.)
  const onPointerGone = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!tracked(event.pointerId)) return;
    dispatch({ type: 'cancel', id: event.pointerId });
  };
  // A mouse drag on an <img> would otherwise start the browser's own drag.
  const onDragStart = (event: DragEvent<HTMLDivElement>) => event.preventDefault();

  // The wheel listener must be able to cancel the browser's page zoom, which
  // React's passive onWheel cannot.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (event: WheelEvent) => {
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1;
      const result = dispatch({
        type: 'wheel',
        ...fromCentre(event),
        deltaX: event.deltaX * unit,
        deltaY: event.deltaY * unit,
        ctrl: event.ctrlKey || event.metaKey,
      });
      if (result.handled) event.preventDefault();
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [dispatch, fromCentre]);

  // ---- keyboard ------------------------------------------------------------

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Ctrl + "+" is the browser's zoom, Alt + ← its back: leave them alone.
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || isTyping(event.target)) return;
      switch (event.key) {
        case 'ArrowRight':
          step(hrefs.next, STEP_NEXT);
          break;
        case 'ArrowLeft':
          step(hrefs.prev, STEP_PREV);
          break;
        case 'Home':
          step(hrefs.first, STEP_PREV);
          break;
        case 'End':
          step(hrefs.last, STEP_NEXT);
          break;
        case '+':
        case '=':
          dispatch({ type: 'zoom', factor: KEY_ZOOM_STEP });
          break;
        case '-':
          dispatch({ type: 'zoom', factor: 1 / KEY_ZOOM_STEP });
          break;
        case '0':
          dispatch({ type: 'reset' });
          break;
        case 'Escape':
          // In the lightbox the dialog owns Escape.
          if (host) return;
          close();
          break;
        default:
          return;
      }
      event.preventDefault();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [dispatch, step, close, host, hrefs.next, hrefs.prev, hrefs.first, hrefs.last]);

  // ---- focus and speech across a step --------------------------------------

  useEffect(() => {
    const figure = stageRef.current?.closest('figure');
    const lost = document.activeElement === null || document.activeElement === document.body;
    const remembered = mode === 'page' ? takeRememberedFocus() : lastControl;
    if (remembered && lost) {
      figure?.querySelector<HTMLElement>(`[data-viewer-control="${remembered}"]`)?.focus({ preventScroll: true });
    }
    const onFocusIn = (event: FocusEvent) => {
      const control = event.target instanceof Element ? event.target.closest('[data-viewer-control]') : null;
      lastControl = control?.getAttribute('data-viewer-control') ?? null;
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, [mode]);

  // On the page the neighbours are plain anchors (PhotoViewer). A plain click
  // on one still steps without leaving a history entry behind; a modified
  // click (new tab, new window) is the browser's.
  useEffect(() => {
    if (mode !== 'page') return;
    const figure = stageRef.current?.closest('figure');
    if (!figure) return;
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-viewer-step]') : null;
      if (!anchor) return;
      event.preventDefault();
      loadPhotoPage(anchor.href, anchor.getAttribute('data-viewer-control'));
    };
    figure.addEventListener('click', onClick);
    return () => figure.removeEventListener('click', onClick);
  }, [mode]);

  useEffect(() => {
    host?.show({ anchor, announcement });
  }, [host, anchor, announcement]);

  // In the lightbox the neighbours are router links (PhotoViewer): a click on
  // one is a step too, and says which way. This viewer has arrived; whatever
  // direction brought it is spent.
  useEffect(() => {
    arrivingFrom = null;
    const figure = mode === 'modal' ? stageRef.current?.closest('figure') : null;
    const onClick = (event: MouseEvent) => {
      const control = event.target instanceof Element ? event.target.closest('a[data-viewer-control]') : null;
      const name = control?.getAttribute('data-viewer-control');
      if (name === 'next') arrivingFrom = STEP_NEXT;
      else if (name === 'prev') arrivingFrom = STEP_PREV;
    };
    figure?.addEventListener('click', onClick);
    return () => {
      figure?.removeEventListener('click', onClick);
      // A step that was asked for and never arrived (the lightbox was closed
      // first) must not colour the next photograph to open.
      arrivingFrom = null;
    };
  }, [mode]);

  // ---- the neighbours, once this photograph has decoded --------------------

  useEffect(() => {
    const img = photoRef.current?.querySelector('img');
    if (!img || neighbours.length === 0) return;
    let cancelled = false;
    // Held until unmount so the fetches are not collected before they finish.
    const warmed: HTMLImageElement[] = [];
    const warm = () => {
      if (cancelled) return;
      for (const neighbour of neighbours) {
        // The same props the neighbour's own viewer will render with, so the
        // browser picks — and caches — the same candidate.
        const { props } = getImageProps({
          src: neighbour.src,
          alt: '',
          fill: true,
          sizes: viewerSizes(neighbour.aspect),
          quality: 90,
        });
        const image = new window.Image();
        image.decoding = 'async';
        if (props.sizes) image.sizes = props.sizes;
        if (props.srcSet) image.srcset = props.srcSet;
        image.src = props.src;
        warmed.push(image);
      }
    };
    const decoded = () => {
      const pending = typeof img.decode === 'function' ? img.decode() : Promise.resolve();
      pending.then(warm, warm);
    };
    if (img.complete && img.naturalWidth > 0) decoded();
    else img.addEventListener('load', decoded, { once: true });
    return () => {
      cancelled = true;
      img.removeEventListener('load', decoded);
      warmed.length = 0;
    };
  }, [neighbours]);

  // ---- share ---------------------------------------------------------------

  const say = (text: string) => {
    setNotice(text);
    clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => setNotice(''), NOTICE_MS);
  };

  const share = async () => {
    const url = new URL(hrefs.self, window.location.origin).href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        // Dismissing the sheet is an answer, not a failure.
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      say(labels.copied);
    } catch {
      say(labels.shareFailed);
    }
  };

  return (
    <>
      <div className="viewer-tools">
        <span role="status" className="viewer-notice label-caps">
          {notice}
        </span>
        {zoom.available && (
          <>
            {/* aria-disabled, not disabled: a control that goes dead while it
                holds the focus would drop the keyboard out of the dialog. */}
            <button
              type="button"
              data-viewer-control="zoom-out"
              aria-label={labels.zoomOut}
              aria-disabled={!zoom.zoomed}
              onClick={() => dispatch({ type: 'zoom', factor: 1 / KEY_ZOOM_STEP })}
              className="viewer-control"
            >
              <Icon name="zoom-out" className="size-5" />
            </button>
            <button
              type="button"
              data-viewer-control="zoom-in"
              aria-label={labels.zoomIn}
              aria-disabled={zoom.atMax}
              onClick={() => dispatch({ type: 'zoom', factor: KEY_ZOOM_STEP })}
              className="viewer-control"
            >
              <Icon name="zoom-in" className="size-5" />
            </button>
          </>
        )}
        <button
          type="button"
          data-viewer-control="share"
          aria-label={labels.share}
          onClick={share}
          className="viewer-control"
        >
          <Icon name="share" className="size-5" />
        </button>
      </div>

      <div
        ref={stageRef}
        className="viewer-stage"
        data-zoomable={zoom.available || undefined}
        data-zoomed={zoom.zoomed || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerGone}
        onLostPointerCapture={onPointerGone}
        onDragStart={onDragStart}
      >
        <div ref={photoRef} className="viewer-photo" data-enter={enter ?? undefined}>
          <Transition name={name} share={PHOTO_SHARE} default="none">
            <PhotoView
              photo={photo}
              sizes={sizes}
              blur={blur}
              preload={mode === 'page'}
              eager={mode === 'modal'}
              quality={90}
            />
          </Transition>
        </div>
      </div>
    </>
  );
}
