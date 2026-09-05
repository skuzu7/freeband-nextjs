import { site } from '@/data/copy/site';

/** First focusable thing on the page: jumps past the header to <main>. */
export function SkipLink() {
  return (
    <a
      href="#conteudo"
      className="label-caps sr-only rounded-sm bg-led px-4 py-3 text-night-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
    >
      {site.nav.skipLink}
    </a>
  );
}
