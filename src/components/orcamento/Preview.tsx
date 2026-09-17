'use client';

// src/components/orcamento/Preview.tsx
// The A4 page scaled to its column, plus Print and Gerar PDF. The sheet keeps
// its real height: a proposal that runs past one page grows here exactly as
// it will in print and in the PDF, with a mark where the first page ends.
// The PDF toolkit sits behind OrcamentoDownloadButton and a client-only
// dynamic import, so it never enters the SSR module graph.
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { orcamento } from '@/data/copy/orcamento';
import type { OrcamentoData } from '@/types/orcamento';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { PrintLayout } from './PrintLayout';

const OrcamentoDownloadButton = dynamic(
  () => import('@/components/pdf/orcamento/OrcamentoDownloadButton').then((m) => m.OrcamentoDownloadButton),
  {
    ssr: false,
    loading: () => <Button disabled>{orcamento.preview.generating}</Button>,
  },
);

interface PreviewProps {
  data: OrcamentoData;
  onPrint: () => void;
}

/** One A4 page in CSS pixels: 297mm at 96dpi. */
const PAGE_HEIGHT_PX = (297 * 96) / 25.4;
/**
 * How far past a page boundary the sheet may run before it counts as another
 * page. The sheet's minimum height is exactly one page and layout rounds by a
 * few pixels, so without this the empty form would already show a break.
 */
const PAGE_SLACK_PX = 8;
/** How long the form may keep typing before the PDF is rebuilt. */
const PDF_DEBOUNCE_MS = 400;

// 210mm wide document, scaled down to the container's width; at 1 when the
// column is wider than the page. Until measured, the spacer is one page tall
// and the sheet scales by the same CSS rule.
const initialScale = 'min(1, calc(100cqw / 210mm))';
const initialSpacerStyle = { height: `calc(297mm * ${initialScale})` } as CSSProperties;
const initialSheetStyle = { transform: `scale(${initialScale})`, transformOrigin: 'top left' } as CSSProperties;

/** The value, settled: it follows `value` only after it stops changing. */
function useDebounced<T>(value: T, delayMs: number): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setSettled(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);
  return settled;
}

export function Preview({ data, onPrint }: PreviewProps) {
  const [pdfRequested, setPdfRequested] = useState(false);
  const pdfData = useDebounced(data, PDF_DEBOUNCE_MS);
  const frameRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; height: number; pages: number } | null>(null);

  // The transform does not take part in layout, so a spacer is sized by hand
  // from the sheet's real (unscaled) box whenever either side changes. The
  // sheet itself never gets an explicit height: measuring an element whose
  // height you just wrote is a loop that shrinks it to nothing.
  useEffect(() => {
    const frame = frameRef.current;
    const sheet = sheetRef.current;
    if (!frame || !sheet || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      const width = sheet.offsetWidth;
      const height = sheet.offsetHeight;
      if (!width || !height) return;
      const scale = Math.min(1, frame.clientWidth / width);
      setFit({ scale, height: height * scale, pages: Math.max(1, Math.ceil((height - PAGE_SLACK_PX) / PAGE_HEIGHT_PX)) });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    ro.observe(sheet);
    measure();
    return () => ro.disconnect();
  }, []);

  const spacerStyle: CSSProperties = fit ? { height: `${fit.height}px` } : initialSpacerStyle;
  const sheetStyle: CSSProperties = fit
    ? { transform: `scale(${fit.scale})`, transformOrigin: 'top left' }
    : initialSheetStyle;

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Label dot>{orcamento.preview.step}</Label>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onPrint}>
            {orcamento.preview.print}
          </Button>
          {pdfRequested ? (
            <OrcamentoDownloadButton data={pdfData} />
          ) : (
            <Button onClick={() => setPdfRequested(true)}>{orcamento.preview.generate}</Button>
          )}
        </div>
      </div>

      <div
        ref={frameRef}
        className="print-unclip overflow-hidden border border-line bg-surface-high shadow-[0_24px_60px_-28px_oklch(20%_0.03_262/0.45)]"
        style={{ containerType: 'inline-size' }}
      >
        <div className="print-scale-reset" style={spacerStyle}>
          <div ref={sheetRef} className="print-scale-reset relative w-[210mm] max-w-none" style={sheetStyle}>
            <PrintLayout data={data} />
            {fit && fit.pages > 1 && (
              <div
                aria-hidden
                className="no-print pointer-events-none absolute inset-x-0 flex items-center gap-3 px-[18mm]"
                style={{ top: `${PAGE_HEIGHT_PX}px`, transform: 'translateY(-50%)' }}
              >
                <span className="h-px flex-1 border-t border-dashed border-line-strong" />
                <span className="label-caps bg-surface-high px-2 text-ink-low">{orcamento.preview.pageBreak}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {fit && fit.pages > 1 && <p className="sr-only">{orcamento.preview.pageBreak}</p>}
    </div>
  );
}
