'use client';

// src/components/sections/Palco.tsx
// The live photography, full colour, whole.
// Features category filtering, native aspect preservation, and full-screen lightbox.
import { useState, useMemo } from 'react';
import { stageFrames, framesSizes, figurinos, StageCategory } from '@/data/images';
import { bandLineup, pageCopy } from '@/data/content';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeadline } from '@/components/ui/SectionHeadline';
import { CinematicImage } from '@/components/ui/CinematicImage';
import { LightboxModal, LightboxItem } from '@/components/ui/LightboxModal';
import { Maximize2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

const categories: { key: StageCategory; label: string }[] = [
  { key: 'todos', label: 'Todos os Momentos' },
  { key: 'vocais', label: 'Vocais & Guitarras' },
  { key: 'blocos', label: 'Blocos Temáticos' },
  { key: 'efeitos', label: 'Luz & Efeitos LED' },
];

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="mt-3 flex items-center justify-between gap-3 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
      <div className="flex items-center gap-2">
        <span aria-hidden className="inline-block h-px w-5 bg-brand" />
        <span>{children}</span>
      </div>
      <span className="opacity-0 transition-opacity group-hover:opacity-100 text-brand">
        <Maximize2 className="h-3.5 w-3.5" />
      </span>
    </figcaption>
  );
}

export function Palco() {
  const copy = pageCopy.palco;
  const [activeCategory, setActiveCategory] = useState<StageCategory>('todos');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredFrames = useMemo(() => {
    if (activeCategory === 'todos') return stageFrames;
    return stageFrames.filter((f) => f.category === activeCategory);
  }, [activeCategory]);

  const lead = stageFrames.find((f) => f.weight === 'lead')!;
  const beats = useMemo(() => {
    if (activeCategory === 'todos') {
      return stageFrames.filter((f) => f.weight === 'beat');
    }
    return filteredFrames;
  }, [activeCategory, filteredFrames]);

  const lightboxItems: LightboxItem[] = useMemo(() => {
    return (activeCategory === 'todos' ? stageFrames : filteredFrames).map((f) => ({
      src: f.src,
      alt: f.alt,
      caption: f.caption,
      category: f.category,
    }));
  }, [activeCategory, filteredFrames]);

  const handleOpenLightbox = (src: string) => {
    const idx = lightboxItems.findIndex((item) => item.src === src);
    if (idx !== -1) setLightboxIndex(idx);
  };

  return (
    <Section id="palco" variant="ink" pad="xl">
      <Container>
        <SectionHeadline
          eyebrowNumber={copy.eyebrowNumber}
          eyebrowLabel={copy.eyebrowLabel}
          prefix={copy.headlinePrefix}
          emphasis={copy.headlineEmphasis}
          suffix={copy.headlineSuffix}
          lead={copy.lead}
        />

        {/* Who is actually on the stage: 11 integrantes */}
        <div className="mt-[clamp(2.5rem,5vi,3.5rem)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Eyebrow tone="mono">{copy.lineupEyebrow}</Eyebrow>
            <span className="inline-flex items-center gap-2 border border-brand/30 bg-bg-raise/60 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-widest text-brand backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-brand" />
              100% Ao Vivo
            </span>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-7">
            {bandLineup.roles.map((item) => (
              <div key={item.role} className="flex flex-col gap-1.5 border-t border-border pt-3">
                <dt className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-text-muted">
                  {item.role}
                </dt>
                <dd
                  className="font-display font-semibold -tracking-[0.03em] text-text tabular-nums"
                  style={{ fontSize: 'var(--text-2xl)', lineHeight: 1 }}
                >
                  {String(item.count).padStart(2, '0')}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Interactive Filter Pills */}
        <div className="mt-[clamp(3rem,6vi,4.5rem)] flex flex-wrap items-center gap-2.5 border-y border-border py-4">
          <span className="mr-2 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
            Filtrar acervo:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                'min-h-9 px-4 py-2 font-mono text-[0.64rem] uppercase tracking-[0.22em] transition-all cursor-pointer',
                activeCategory === cat.key
                  ? 'bg-brand text-void-950 font-bold glow-gold-soft'
                  : 'border border-border bg-bg-raise/50 text-text-muted hover:border-brand/50 hover:text-text',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photography Grid */}
        <div className="mt-8 flex flex-col gap-[clamp(1.5rem,3vi,2.5rem)]">
          {/* Lead Photo (displayed when "todos" is active) */}
          {activeCategory === 'todos' && (
            <figure
              className="group relative cursor-pointer reveal-mid"
              onClick={() => handleOpenLightbox(lead.src)}
            >
              <div className="overflow-hidden">
                <CinematicImage
                  src={lead.src}
                  alt={lead.alt}
                  grade="live"
                  aspect={lead.aspect}
                  fill
                  sizes={framesSizes(1)}
                  quality={90}
                  wrapperClassName="ring-1 ring-inset ring-border transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </div>
              <Caption>{lead.caption}</Caption>
            </figure>
          )}

          {/* Masonry Columns */}
          <div className="columns-1 gap-[clamp(1.5rem,3vi,2.5rem)] sm:columns-2 lg:columns-3">
            {beats.map((frame, i) => {
              const [w, h] = frame.aspect.split('/').map(Number);
              return (
                <figure
                  key={frame.id || frame.src}
                  onClick={() => handleOpenLightbox(frame.src)}
                  className="group relative cursor-pointer reveal-mid mb-[clamp(1.5rem,3vi,2.5rem)] break-inside-avoid"
                  style={{ ['--i' as string]: i % 3 } as React.CSSProperties}
                >
                  <div className="overflow-hidden">
                    <CinematicImage
                      src={frame.src}
                      alt={frame.alt}
                      grade="live"
                      width={w}
                      height={h}
                      sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 100vw"
                      quality={90}
                      imgClassName="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                      wrapperClassName="ring-1 ring-inset ring-border"
                    />
                  </div>
                  <Caption>{frame.caption}</Caption>
                </figure>
              );
            })}
          </div>
        </div>

        {/* Wardrobe (Figurinos) Backstage */}
        <div className="mt-[clamp(3.5rem,7vi,6rem)] border-t border-border pt-[clamp(2.5rem,4vi,3.5rem)]">
          <Eyebrow tone="mono">{copy.figurinosEyebrow}</Eyebrow>
          <p className="mt-4 max-w-[54ch] text-text-muted" style={{ fontSize: 'var(--text-base)' }}>
            {copy.figurinosLead}
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-[clamp(0.75rem,2vi,1.5rem)] sm:grid-cols-3">
            {figurinos.map((shot, i) => (
              <li
                key={shot.src}
                className="group cursor-pointer reveal-mid"
                onClick={() => handleOpenLightbox(shot.src)}
                style={{ ['--i' as string]: i } as React.CSSProperties}
              >
                <figure>
                  <div className="overflow-hidden">
                    <CinematicImage
                      src={shot.src}
                      alt={shot.alt}
                      grade="live"
                      aspect="3/4"
                      fill
                      sizes="(min-width: 768px) 30vw, 100vw"
                      quality={90}
                      wrapperClassName="ring-1 ring-inset ring-border transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <Caption>{shot.caption}</Caption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
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
