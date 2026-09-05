'use client';

// src/components/brand/LedText.tsx
// A headline that comes on as a LED sign and dissolves into type. The real
// heading is always in the DOM (screen readers, search, no-JS); a panel the
// exact size of its box lights the same words in dots, then hands over.
// The raster copies the line breaks the browser actually produced — explicit
// "\n" in the copy or wrapping on a narrow screen — so the two always match.
import { useLayoutEffect, useRef, useState } from 'react';
import type { ElementType } from 'react';
import { cn } from '@/lib/cn';
import { LedPanel } from './LedPanel';

interface LedTextProps {
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
  /** Dot columns across the heading's width; rows follow its height. */
  cols?: number;
  /** Font weight the raster uses — match the heading's. */
  weight?: number;
  /** Tracking as a fraction of the font size — match the heading's. */
  tracking?: number;
}

interface Measure {
  aspect: number;
  /** The heading's words, grouped into the lines the browser laid out. */
  lines: string;
}

/** Reads the rendered line breaks by locating each word's box. */
function measureLines(el: HTMLElement): string {
  const node = el.firstChild;
  if (!node || node.nodeType !== Node.TEXT_NODE) return el.textContent ?? '';
  const content = node.textContent ?? '';
  const lines: string[][] = [];
  let lastTop: number | null = null;
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    const range = document.createRange();
    range.setStart(node, m.index);
    range.setEnd(node, m.index + m[0].length);
    const rect = range.getClientRects()[0];
    const top: number = rect ? Math.round(rect.top) : (lastTop ?? 0);
    if (lastTop === null || Math.abs(top - lastTop) > 2) {
      lines.push([]);
      lastTop = top;
    }
    lines[lines.length - 1].push(m[0]);
  }
  return lines.map((words) => words.join(' ')).join('\n');
}

export function LedText({
  text,
  as: Tag = 'h2',
  id,
  className,
  cols = 150,
  weight = 600,
  tracking = -0.035,
}: LedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [measure, setMeasure] = useState<Measure | null>(null);
  const [lit, setLit] = useState(false);

  // Measured before first paint, so the heading is never visible for a frame
  // before the panel covers it; re-measured on resize.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setMeasure({ aspect: width / height, lines: measureLines(el) });
    };
    run();
    const ro = new ResizeObserver(run);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const hidden = measure !== null && !lit;

  return (
    <span className="relative block">
      <Tag
        ref={ref}
        id={id}
        className={cn(
          'block whitespace-pre-line transition-opacity duration-700 ease-light',
          hidden ? 'opacity-0' : 'opacity-100',
          className,
        )}
      >
        {text}
      </Tag>
      {measure !== null && (
        <LedPanel
          source={{ kind: 'text', text: measure.lines, weight, align: 'left', tracking }}
          aspect={measure.aspect}
          cols={cols}
          field={false}
          dimDots={false}
          fadeWhenLit
          onLit={() => setLit(true)}
          className="pointer-events-none absolute inset-0"
        />
      )}
    </span>
  );
}
