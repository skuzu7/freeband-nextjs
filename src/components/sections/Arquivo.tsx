'use client';

// src/components/sections/Arquivo.tsx
// The gig-poster archive — the section no competitor can reproduce.
// Features category filters, authentic stamps, and full-screen lightbox inspection.
import { useState, useMemo } from 'react';
import { posters, PosterCategory } from '@/data/images';
import { pageCopy } from '@/data/content';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeadline } from '@/components/ui/SectionHeadline';
import { CinematicImage } from '@/components/ui/CinematicImage';
import { LightboxModal, LightboxItem } from '@/components/ui/LightboxModal';
import { Landmark, Calendar, MapPin, Search } from 'lucide-react';
import { cn } from '@/lib/cn';

// Short labels wrap as whole units on a phone; the per-category count is the
// credential — it tells the buyer how much real archive sits behind each one.
const categories: { key: PosterCategory; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'municipal', label: 'Prefeituras' },
  { key: 'clube', label: 'Clubes' },
  { key: 'reveillon', label: 'Réveillons' },
];

const countFor = (key: PosterCategory) =>
  key === 'todos'
    ? posters.length
    : posters.filter((p) => p.category === key || (key === 'municipal' && p.municipal)).length;

export function Arquivo() {
  const copy = pageCopy.arquivo;
  const [activeCategory, setActiveCategory] = useState<PosterCategory>('todos');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPosters = useMemo(() => {
    if (activeCategory === 'todos') return posters;
    return posters.filter((p) => p.category === activeCategory || (activeCategory === 'municipal' && p.municipal));
  }, [activeCategory]);

  const lightboxItems: LightboxItem[] = useMemo(() => {
    return filteredPosters.map((p) => ({
      src: p.src,
      alt: p.alt,
      caption: `${p.event} · ${p.town} (${p.when})`,
      venue: p.venue,
      when: p.when,
    }));
  }, [filteredPosters]);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  return (
    <Section id="arquivo" variant="ink-raise" pad="xl">
      <Container>
        <SectionHeadline
          eyebrowNumber={copy.eyebrowNumber}
          eyebrowLabel={copy.eyebrowLabel}
          prefix={copy.headlinePrefix}
          emphasis={copy.headlineEmphasis}
          suffix={copy.headlineSuffix}
          lead={copy.lead}
        />

        {/* Archive index — each pill carries its category's count */}
        <div
          role="group"
          aria-label="Filtrar o acervo de cartazes por tipo de evento"
          className="mt-[clamp(2.5rem,5vi,3.5rem)] flex flex-wrap items-center gap-2 border-y border-border py-4"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              aria-pressed={activeCategory === cat.key}
              className={cn(
                'inline-flex min-h-9 items-baseline gap-2 whitespace-nowrap px-4 py-2 font-mono text-[0.64rem] uppercase tracking-[0.22em] transition-all cursor-pointer',
                activeCategory === cat.key
                  ? 'bg-brand font-bold text-void-950'
                  : 'border border-border bg-bg-raise/50 text-text-muted hover:border-brand/50 hover:text-text',
              )}
            >
              {cat.label}
              <span
                className={cn(
                  'text-[0.58rem] tabular-nums',
                  activeCategory === cat.key ? 'text-void-950/70' : 'text-brand',
                )}
              >
                {String(countFor(cat.key)).padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>

        {/* Poster Wall */}
        <ul className="poster-wall mt-8">
          {filteredPosters.map((poster, i) => (
            <li
              key={poster.src}
              onClick={() => handleOpenLightbox(i)}
              className="poster-card reveal-mid group flex flex-col cursor-pointer bg-bg-raise p-4 ring-1 ring-border transition-all duration-300 hover:ring-brand/60"
              style={{ ['--i' as string]: i % 4 } as React.CSSProperties}
            >
              <div className="poster-frame relative aspect-[4/3] w-full overflow-hidden bg-bg-high">
                <CinematicImage
                  src={poster.src}
                  alt={poster.alt}
                  grade="poster"
                  aspect="4/3"
                  fit="contain"
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                  wrapperClassName="h-full w-full"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-void-950/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 border border-brand bg-void-950/90 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-widest text-brand">
                    <Search className="h-3 w-3" />
                    Ampliar cartaz
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-1 flex-col justify-between gap-3 border-t border-border pt-4">
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3
                      className="font-display -tracking-[0.02em] text-text group-hover:text-brand transition-colors"
                      style={{ fontSize: 'var(--text-lg)', lineHeight: 1.1 }}
                    >
                      {poster.town}
                    </h3>
                    <span className="shrink-0 font-mono text-[0.7rem] tabular-nums text-brand flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {poster.when}
                    </span>
                  </div>

                  <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-text-muted">
                    {poster.event}
                  </p>

                  {poster.venue && (
                    <p className="mt-2 text-[0.78rem] leading-[1.5] text-text-low text-pretty flex items-start gap-1.5">
                      <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-brand/70" />
                      <span>{poster.venue}</span>
                    </p>
                  )}
                </div>

                {poster.municipal && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1.5 border border-brand/40 bg-brand/10 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-brand">
                      <Landmark className="h-3 w-3" />
                      {copy.municipalNote}
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-[clamp(2.5rem,4vi,3.5rem)] flex items-center gap-4 border-t border-border pt-8 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
          <span aria-hidden className="inline-block h-px w-10 bg-brand" />
          {copy.footnote}
        </p>
      </Container>

      {/* Lightbox Modal */}
      <LightboxModal
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onSelectIndex={(idx) => setLightboxIndex(idx)}
      />
    </Section>
  );
}
