'use client';

// src/components/media/Lightbox.tsx
// A full-screen viewer for one photograph out of a set. Opens on the item the
// caller points at; arrow keys walk the set (wrapping), Escape closes, focus
// stays inside while open and goes back to whatever opened it afterwards.
// The picture keeps its own aspect ratio and fits the viewport both ways.
import { useEffect, useId, useRef } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { ratioOf, type Photo as PhotoData } from '@/data/media/paths';
import { DotGrid } from '@/components/brand/DotGrid';
import { Photo } from './Photo';

export interface LightboxItem extends PhotoData {
  title: string;
  meta?: string;
}

export interface LightboxLabels {
  close: string;
  prev: string;
  next: string;
  counter: (index: number, total: number) => string;
}

interface LightboxProps {
  items: LightboxItem[];
  /** Index of the open item; null keeps the lightbox closed. */
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
  labels: LightboxLabels;
}

const FOCUSABLE = 'button:not([disabled])';

const controlClass =
  'transition-quick inline-flex size-11 items-center justify-center rounded-pill border border-line-strong bg-surface/70 text-ink hover:border-led hover:text-led-text';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export function Lightbox({ items, index, onClose, onChange, labels }: LightboxProps) {
  const open = index !== null && items.length > 0;
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // The key handler reads through this ref so the effect below runs only on
  // open/close, never on every step through the set.
  const stateRef = useRef({ index, total: items.length, onClose, onChange });
  useEffect(() => {
    stateRef.current = { index, total: items.length, onClose, onChange };
  });

  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      const { index: current, total, onClose: close, onChange: change } = stateRef.current;
      if (current === null) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        change((current + 1) % total);
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        change((current - 1 + total) % total);
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusables = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      openerRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;
  const item = items[index];
  const total = items.length;
  const ratio = ratioOf(item.aspect);
  // The picture is measured against the room the flex row actually leaves it,
  // in container units, so the real chrome decides: a caption that wraps to a
  // second line on a phone takes its space from the picture instead of pushing
  // it off the screen, and no constant stands in for the bars' height.
  //
  // Only the height is set — the width follows from the file's own ratio and
  // is never wider than the room, so nothing clamps it. Setting height and
  // max-width together would over-constrain the box: the browser drops the
  // ratio, and object-cover starts cropping the flyer.
  const frameStyle: CSSProperties = {
    aspectRatio: String(ratio),
    height: `min(100cqh, calc(100cqw / ${ratio.toFixed(4)}))`,
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 isolate flex flex-col bg-surface/95 backdrop-blur-sm"
    >
      <DotGrid fade />
      <div className="flex h-16 shrink-0 items-center justify-between px-[var(--pad-inline)]">
        <span className="label-caps tabular-nums text-ink-low">{labels.counter(index + 1, total)}</span>
        <button
          ref={closeRef}
          type="button"
          aria-label={labels.close}
          onClick={onClose}
          className={cn(controlClass, '-mr-2')}
        >
          <Icon d="M6 6l12 12M18 6L6 18" />
        </button>
      </div>

      {/* A size container, so the frame above can measure itself against the
          room left between the two bars rather than against the viewport. */}
      <div
        className="flex min-h-0 flex-1 items-center justify-center px-[var(--pad-inline)]"
        style={{ containerType: 'size' }}
      >
        <div style={frameStyle}>
          {/* The frame is capped by height, so on a desktop it is well short
              of the viewport's width; asking for 100vw fetched the 1920
              variant for a ~960px box. */}
          <Photo photo={item} sizes="(min-width: 48rem) 80vw, 100vw" quality={90} className="h-full" />
        </div>
      </div>

      {/* Caption and the two steppers share one bar, so nothing ever sits on
          top of the picture — on a phone the flyer's own text stays legible. */}
      <div className="flex shrink-0 items-center justify-between gap-6 px-[var(--pad-inline)] py-5">
        {/* Arrow keys change the flyer while the dialog stays open, so the
            new caption is announced rather than silently swapped. */}
        <div className="min-w-0" aria-live="polite">
          <h2 id={titleId} className="text-lg font-semibold text-ink">
            {item.title}
          </h2>
          {item.meta && <p className="mt-1 text-sm text-ink-muted">{item.meta}</p>}
        </div>
        {total > 1 && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label={labels.prev}
              onClick={() => onChange((index - 1 + total) % total)}
              className={controlClass}
            >
              <Icon d="M15 5l-7 7 7 7" />
            </button>
            <button
              type="button"
              aria-label={labels.next}
              onClick={() => onChange((index + 1) % total)}
              className={controlClass}
            >
              <Icon d="M9 5l7 7-7 7" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
