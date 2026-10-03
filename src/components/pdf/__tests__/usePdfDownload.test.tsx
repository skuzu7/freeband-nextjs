// The download hook's state machine: one file per press, presses ignored while
// a file is being built, a failed build that the next press retries, a single
// download on mount with autoStart (never a second one), and the build
// callback of the latest render.
// The PDF toolkit itself is stubbed: pdf() hands back a toBlob() each case
// controls.
import { StrictMode, type ReactElement } from 'react';
import type { DocumentProps } from '@react-pdf/renderer';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { toBlob, pdfMock } = vi.hoisted(() => {
  const toBlob = vi.fn();
  const pdfMock = vi.fn(() => ({ toBlob }));
  return { toBlob, pdfMock };
});
vi.mock('@react-pdf/renderer', () => ({ pdf: pdfMock }));

import { usePdfDownload } from '../usePdfDownload';

// Any element stands in for the document: pdf() is a stub.
const buildFor = (fileName: string) => () => ({
  document: (<div />) as ReactElement<DocumentProps>,
  fileName,
});

// Lets start() through its rAF + setTimeout(0) and the stubbed render.
const settle = () =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(50);
  });

// jsdom implements neither; each case gets stubs, restored afterwards.
const createObjectURL = URL.createObjectURL;
const revokeObjectURL = URL.revokeObjectURL;

// The download attribute of every link the hook clicked.
let downloads: string[] = [];

beforeEach(() => {
  // A rejection set up by one case must not leak into the next: reset the
  // implementation, then put back the default (a real Blob, as in production).
  toBlob.mockReset();
  toBlob.mockResolvedValue(new Blob(['x'], { type: 'application/pdf' }));
  // Calls only: pdf() must keep returning { toBlob }.
  pdfMock.mockClear();
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] });
  URL.createObjectURL = vi.fn(() => 'blob:x');
  URL.revokeObjectURL = vi.fn();
  downloads = [];
  // No navigation in jsdom: record the click instead.
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    downloads.push(this.download);
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  URL.createObjectURL = createObjectURL;
  URL.revokeObjectURL = revokeObjectURL;
});

describe('usePdfDownload', () => {
  it('goes generating → idle and saves one file under its name', async () => {
    const { result } = renderHook(() => usePdfDownload(buildFor('proposta.pdf')));
    expect(result.current.state).toBe('idle');

    act(() => {
      void result.current.start();
    });
    expect(result.current.state).toBe('generating');

    await settle();
    expect(result.current.state).toBe('idle');
    expect(pdfMock).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(downloads).toEqual(['proposta.pdf']);
  });

  it('ignores a second press while the first file is being built', async () => {
    const { result } = renderHook(() => usePdfDownload(buildFor('proposta.pdf')));

    act(() => {
      void result.current.start();
      void result.current.start();
    });
    await settle();

    expect(pdfMock).toHaveBeenCalledTimes(1);
    expect(downloads).toEqual(['proposta.pdf']);
    expect(result.current.state).toBe('idle');
  });

  it('turns a failed build into the error state, and the next press tries again', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    toBlob.mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => usePdfDownload(buildFor('proposta.pdf')));

    act(() => {
      void result.current.start();
    });
    await settle();
    expect(result.current.state).toBe('error');
    expect(consoleError).toHaveBeenCalledWith('[pdf] generation failed', expect.any(Error));
    expect(downloads).toEqual([]);

    act(() => {
      void result.current.start();
    });
    await settle();
    expect(result.current.state).toBe('idle');
    expect(pdfMock).toHaveBeenCalledTimes(2);
    expect(downloads).toEqual(['proposta.pdf']);
  });

  it('with autoStart, starts a single download on mount, under StrictMode too', async () => {
    const { result } = renderHook(() => usePdfDownload(buildFor('proposta.pdf'), { autoStart: true }), {
      wrapper: StrictMode,
    });
    await settle();

    expect(pdfMock).toHaveBeenCalledTimes(1);
    expect(downloads).toEqual(['proposta.pdf']);
    expect(result.current.state).toBe('idle');
  });

  it('with autoStart, never starts a second download when the flag comes back', async () => {
    const { rerender } = renderHook(({ autoStart }) => usePdfDownload(buildFor('proposta.pdf'), { autoStart }), {
      initialProps: { autoStart: true },
    });
    await settle();
    expect(pdfMock).toHaveBeenCalledTimes(1);

    // The first file is done, so nothing is running: only the autoStart
    // guard stands between the re-run effect and a second download.
    rerender({ autoStart: false });
    rerender({ autoStart: true });
    await settle();

    expect(pdfMock).toHaveBeenCalledTimes(1);
    expect(downloads).toEqual(['proposta.pdf']);
  });

  it('uses the build callback of the latest render, not the one from mount', async () => {
    const { result, rerender } = renderHook(({ build }) => usePdfDownload(build), {
      initialProps: { build: buildFor('antes.pdf') },
    });
    rerender({ build: buildFor('depois.pdf') });

    act(() => {
      void result.current.start();
    });
    await settle();

    expect(downloads).toEqual(['depois.pdf']);
    expect(result.current.state).toBe('idle');
  });
});
