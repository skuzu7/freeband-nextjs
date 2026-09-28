'use client';

// src/components/pdf/usePdfDownload.ts
// One click, one file. The document is rendered to a Blob when asked for and
// saved straight away, instead of PDFDownloadLink's two steps (build, then
// click the link it becomes). Everything here is client-only, like the rest
// of src/components/pdf/.
import { pdf, type DocumentProps } from '@react-pdf/renderer';
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';

export type PdfDownloadState = 'idle' | 'generating' | 'error';

/** Hands a Blob to the browser as a download under the given name. */
function save(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Some browsers read the URL after click() returns; let them finish first.
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/**
 * `start()` renders the document the callback returns and downloads it.
 * The callback is read at click time, so the file always carries what is on
 * screen then. With `autoStart`, the first run begins on mount: the button
 * that loaded this module was the producer's click.
 */
export function usePdfDownload(
  build: () => { document: ReactElement<DocumentProps>; fileName: string },
  { autoStart = false }: { autoStart?: boolean } = {},
) {
  const [state, setState] = useState<PdfDownloadState>('idle');
  const buildRef = useRef(build);
  useEffect(() => {
    buildRef.current = build;
  });
  const running = useRef(false);

  const start = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    setState('generating');
    try {
      // Laying the pages out holds the main thread for a moment: let the
      // "Gerando…" state paint first, or the button looks dead until it ends.
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
      const { document: doc, fileName } = buildRef.current();
      save(await pdf(doc).toBlob(), fileName);
      setState('idle');
    } catch (error) {
      console.error('[pdf] generation failed', error);
      setState('error');
    } finally {
      running.current = false;
    }
  }, []);

  const autoStarted = useRef(false);
  useEffect(() => {
    if (!autoStart || autoStarted.current) return;
    autoStarted.current = true;
    void start();
  }, [autoStart, start]);

  return { state, start };
}
