'use client';

// src/components/media/lightbox/PhotoLink.tsx
// A photograph on a gallery page that opens itself in the viewer. A real link
// to the photograph's own address: a soft navigation is intercepted and opens
// the lightbox over the page, anything else (a new tab, no script, a shared
// URL) lands on the photograph's page.
//
// While its photograph is on show in the lightbox the thumbnail steps aside:
// the box stays, the picture leaves. Two boundaries with one view-transition
// name cannot be mounted together, and handing the name over is what makes
// the photograph travel from the plate into the viewer.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { dropFragment } from '@/lib/gallery/navigate';
import type { PhotoLinkTarget } from '@/lib/gallery/sets';
import { Transition } from '@/components/ui/Transition';
import { PhotoView, type PhotoViewProps } from '../PhotoView';
import { PHOTO_SHARE } from './transitions';

interface PhotoLinkProps extends Omit<PhotoViewProps, 'className'> {
  link: PhotoLinkTarget;
  className?: string;
}

export function PhotoLink({ link, className, photo, ...view }: PhotoLinkProps) {
  const onShow = usePathname() === link.href;
  const ref = useRef<HTMLAnchorElement>(null);

  // Back from the lightbox: the photograph returns to its box and lights up
  // (.photo-returned). Derived while rendering, so it is there on the very
  // frame the picture comes back.
  const [wasOnShow, setWasOnShow] = useState(onShow);
  const [returned, setReturned] = useState(false);
  if (wasOnShow !== onShow) {
    setWasOnShow(onShow);
    setReturned(!onShow);
  }

  // "Voltar ao palco", on a photograph's own page, leads to /palco#<this
  // thumbnail>. The page arrives scrolled to it; the focus arrives on it too,
  // as it does when the lightbox closes, unless something already has it.
  useEffect(() => {
    const unclaimed = document.activeElement === null || document.activeElement === document.body;
    if (unclaimed && window.location.hash === `#${link.anchor}`) ref.current?.focus({ preventScroll: true });
  }, [link.anchor]);

  return (
    <Link
      ref={ref}
      href={link.href}
      scroll={false}
      // Only on a client-side navigation — the one that opens the lightbox.
      onNavigate={dropFragment}
      id={link.anchor}
      aria-label={link.label}
      className={cn('photo-link', className)}
    >
      {onShow ? (
        <span
          aria-hidden
          className="block w-full bg-surface-raise"
          style={{ aspectRatio: photo.aspect.replace('/', ' / ') }}
        />
      ) : (
        <Transition name={link.name} share={PHOTO_SHARE} default="none">
          <PhotoView photo={photo} {...view} className={returned ? 'photo-returned' : undefined} />
        </Transition>
      )}
    </Link>
  );
}
