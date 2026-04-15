// src/components/sections/AtoII_Galeria.tsx
// PALCO II — Ato II: curated cinematic masonry.
// Replaces the pattern-cycled 24-image GRID_PATTERN with an intentional
// 13-image editorial masonry. Each tile has a scene-aware grade-* class,
// explicit masonry span, aspect, parallax intensity and optional crop.
// Lightbox open/close routed through useViewTransition so the transition
// only fires when the decoded image is ready (avoids empty-snapshot jank).
'use client';

import { useCallback, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { curatedGallery } from '@/data/images';
import { pageCopy } from '@/data/content';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeadline } from '@/components/ui/SectionHeadline';
import { CinematicImage } from '@/components/ui/CinematicImage';
import { useViewTransition } from '@/lib/useViewTransition';

export function AtoII_Galeria() {
  const [index, setIndex] = useState(-1);
  const slides = curatedGallery.map((img) => ({ src: img.src, alt: img.alt }));
  const withVT = useViewTransition();

  const open = useCallback(
    (i: number) => {
      withVT(() => setIndex(i));
    },
    [withVT],
  );

  const close = useCallback(() => {
    withVT(() => setIndex(-1));
  }, [withVT]);

  return (
    <Section id="historia" variant="ink" pad="xl" className="overflow-hidden">
      <Container>
        <SectionHeadline
          eyebrowNumber={pageCopy.atoII.eyebrowNumber}
          eyebrowLabel={pageCopy.atoII.eyebrowLabel}
          prefix={pageCopy.atoII.headlinePrefix}
          emphasis={pageCopy.atoII.headlineEmphasis}
          suffix={pageCopy.atoII.headlineSuffix}
          lead={pageCopy.atoII.lead}
        />
      </Container>

      <div className="masonry-12 mt-[clamp(3rem,6vi,5rem)]">
        {curatedGallery.map((img, i) => (
          <button
            key={`${img.src}-${i}`}
            type="button"
            onClick={() => open(i)}
            data-span={img.span}
            data-row={img.rowSpan ?? undefined}
            className="reveal-mid group relative block w-full overflow-hidden bg-bg-raise"
            style={{ ['--i' as string]: i % 3 } as React.CSSProperties}
            aria-label={`Abrir ${img.alt}`}
          >
            <CinematicImage
              src={img.src}
              alt={img.alt}
              grade={img.grade}
              parallax={img.parallax}
              crop={img.crop ?? 'center'}
              aspect={img.aspect}
              fill
              sizes="(min-width: 1024px) 55vw, (min-width: 768px) 70vw, 100vw"
              quality={90}
              wrapperClassName="transition-[transform,filter] duration-[900ms] ease-[var(--ease-drift)] group-hover:scale-[1.03] grayscale group-hover:grayscale-0 chromatic-hover"
            />
            {/* Overlay — only covers the image on hover to reveal metadata */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/75 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="line-clamp-1 max-w-[75%] text-text">{img.alt}</span>
              <span className="text-brand">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border" />
          </button>
        ))}
      </div>

      <Lightbox open={index >= 0} close={close} index={index} slides={slides} />
    </Section>
  );
}
