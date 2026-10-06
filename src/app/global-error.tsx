'use client';

// The last resort: an error in the root layout itself. This file replaces the
// layout, so it brings its own <html>, <body> and stylesheet, and it draws
// nothing that could fail a second time — no font loader, no data, no client
// state beyond the retry.
import { useEffect } from 'react';
import { system } from '@/data/copy/system';
import './globals.css';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const copy = system.error;
  return (
    <html lang="pt-BR">
      <body className="bg-surface font-sans text-ink antialiased">
        <title>{copy.title}</title>
        <main className="container-site flex min-h-dvh flex-col justify-center gap-6 py-24">
          <p className="label-caps text-led-text">{copy.label}</p>
          <h1 className="max-w-[22ch] whitespace-pre-line text-5xl font-semibold tracking-display">{copy.headline}</h1>
          <p className="max-w-[60ch] text-lg text-ink-muted">{copy.lead}</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="transition-quick tap rounded-sm bg-red px-5 py-3 text-sm font-medium tracking-wide text-on-red uppercase hover:bg-red-hot"
            >
              {copy.retry}
            </button>
            {/* A full document load: the client router may be what broke. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="transition-quick tap inline-flex items-center rounded-sm border border-line-strong px-5 py-3 text-sm font-medium tracking-wide text-ink uppercase hover:border-led hover:text-led-text"
            >
              {copy.home}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
