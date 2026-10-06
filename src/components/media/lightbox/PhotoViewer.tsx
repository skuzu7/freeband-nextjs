// src/components/media/lightbox/PhotoViewer.tsx
// One photograph out of a gallery set, whole, with its caption, its place in
// the set and the ways on: previous, next, out. The same figure is the page
// at /palco/foto/<id> and the content of the lightbox over /palco — the only
// difference is the way out (a link back to the gallery, or the dialog's
// close) and the rank of the heading.
//
// A Server Component: everything here works as plain HTML and links. The
// stage inside is ViewerGestures, which adds zoom, swipe, keys and sharing.
//
// Stepping differs by mode for one reason. In the lightbox the neighbours are
// router links (replace, no scroll): the navigation is intercepted and the
// dialog stays put. On a photograph's own page they are plain anchors: a
// router navigation from there would be intercepted too and open the lightbox
// over the page, so the step is a page load (ViewerGestures makes it replace
// the history entry; without script it is an ordinary link).
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { blurMap } from '@/data/blur';
import { gallery, type GalleryKey } from '@/data/media/gallery';
import { ratioOf } from '@/data/media/paths';
import { anchorFor, backHrefFor, hrefFor, naturalSize, positionOf, transitionNameFor } from '@/lib/gallery/sets';
import { Icon } from '@/components/ui/Icon';
import { Label } from '@/components/ui/Label';
import { LightboxClose } from './LightboxDialog';
import { ViewerGestures } from './ViewerGestures';
import { STEP_NEXT, STEP_PREV } from './transitions';

interface PhotoViewerProps {
  set: GalleryKey;
  id: string;
  /** A page of its own, or the lightbox over the gallery. */
  mode: 'page' | 'modal';
}

export function PhotoViewer({ set: key, id, mode }: PhotoViewerProps) {
  const set = gallery[key];
  const position = positionOf(set, id);
  if (!position) notFound();

  const { item, index, total, prev, next, first, last } = position;
  const { labels } = set;
  const counter = labels.counter(index + 1, total);
  const hrefs = {
    self: hrefFor(set, item.id),
    prev: hrefFor(set, prev.id),
    next: hrefFor(set, next.id),
    first: hrefFor(set, first.id),
    last: hrefFor(set, last.id),
    back: backHrefFor(set, item.id),
  };
  // The box never grows past the file: a 400×300 flyer is shown at 400×300.
  const frame = {
    '--viewer-ratio': ratioOf(item.aspect).toFixed(4),
    '--viewer-natural': `${naturalSize(item.aspect).width}px`,
  } as CSSProperties;
  const Heading = mode === 'page' ? 'h1' : 'h2';
  const neighbours = [next, prev]
    .filter((n, i, all) => n.id !== item.id && all.findIndex((o) => o.id === n.id) === i)
    .map((n) => ({ src: n.src, aspect: n.aspect }));

  return (
    <figure className="viewer" data-mode={mode} style={frame}>
      <p className="viewer-count label-caps tabular-nums text-ink-low">{counter}</p>

      <ViewerGestures
        photo={{ src: item.src, alt: item.alt, aspect: item.aspect }}
        blur={blurMap[item.src]}
        mode={mode}
        name={transitionNameFor(set, item.id)}
        anchor={anchorFor(set, item.id)}
        announcement={[counter, item.caption, item.meta].filter(Boolean).join('. ')}
        title={item.caption}
        hrefs={hrefs}
        neighbours={neighbours}
        labels={{
          zoomIn: labels.zoomIn,
          zoomOut: labels.zoomOut,
          share: labels.share,
          copied: labels.copied,
          shareFailed: labels.shareFailed,
        }}
      />

      {mode === 'modal' ? (
        <LightboxClose label={labels.close} />
      ) : (
        <Link href={hrefs.back} data-viewer-control="close" className="viewer-back label-caps tap">
          <Icon name="chevron-left" className="size-4" />
          {labels.back}
        </Link>
      )}

      {total > 1 && (
        <div className="viewer-steps">
          {mode === 'modal' ? (
            <>
              <Link
                href={hrefs.prev}
                replace
                scroll={false}
                rel="prev"
                transitionTypes={[STEP_PREV]}
                data-viewer-control="prev"
                aria-label={labels.prev}
                className="viewer-control"
              >
                <Icon name="chevron-left" className="size-5" />
              </Link>
              <Link
                href={hrefs.next}
                replace
                scroll={false}
                rel="next"
                transitionTypes={[STEP_NEXT]}
                data-viewer-control="next"
                aria-label={labels.next}
                className="viewer-control"
              >
                <Icon name="chevron-right" className="size-5" />
              </Link>
            </>
          ) : (
            <>
              <a
                href={hrefs.prev}
                rel="prev"
                data-viewer-control="prev"
                data-viewer-step
                aria-label={labels.prev}
                className="viewer-control"
              >
                <Icon name="chevron-left" className="size-5" />
              </a>
              <a
                href={hrefs.next}
                rel="next"
                data-viewer-control="next"
                data-viewer-step
                aria-label={labels.next}
                className="viewer-control"
              >
                <Icon name="chevron-right" className="size-5" />
              </a>
            </>
          )}
        </div>
      )}

      <figcaption className="viewer-caption">
        <Heading className="text-lg font-semibold text-ink">{item.caption}</Heading>
        {item.meta && <p className="mt-1 text-sm text-ink-muted">{item.meta}</p>}
        {item.note && <Label className="mt-2">{item.note}</Label>}
      </figcaption>
    </figure>
  );
}
