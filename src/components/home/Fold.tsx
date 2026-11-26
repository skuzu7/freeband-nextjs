// src/components/home/Fold.tsx
// Block 1 — Cinematographic editorial hero: stage film behind a measured
// contrast scrim, red acrylic wordmark, clear statement, ONE primary CTA
// leading directly to the 30s Briefing + ONE quiet watch link, and a clean
// hairline-divided proof strip.
import Image from 'next/image';
import { blurMap } from '@/data/blur';
import { fold } from '@/data/copy/home';
import { heroMedia } from '@/data/media/hero';
import { BrandLine } from '@/components/brand/BrandLine';
import { LedNumber } from '@/components/brand/LedNumber';
import { LedWordmark } from '@/components/brand/LedWordmark';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { Label } from '@/components/ui/Label';
import { HeroLoop } from './HeroLoop';

/** The numbers switch on once the wordmark has, one after the other. */
const PROOF_DELAY_MS = 1100;
const PROOF_STEP_MS = 140;

interface FoldProps {
  /** Years since the founding, counted on the server so the HTML and the hydrated tree agree. */
  yearsActive: number;
}

export function Fold({ yearsActive }: FoldProps) {
  return (
    <section
      id="fold-hero"
      aria-labelledby="fold-title"
      className="relative isolate flex min-h-[calc(100svh-3.5rem)] flex-col justify-end overflow-hidden md:min-h-[min(calc(100svh-var(--nav-h)),52rem)]"
    >
      <HeroLoop
        video={heroMedia.video}
        pauseLabel={fold.backdropPause}
        playLabel={fold.backdropPlay}
        stageModeLabel={fold.stageModeLabel}
        stageModes={fold.stageModes}
      >
        <Image
          src={heroMedia.poster}
          alt={heroMedia.alt}
          fill
          preload
          sizes="100vw"
          quality={75}
          placeholder="blur"
          blurDataURL={blurMap[heroMedia.poster]}
          className="object-cover"
          data-backdrop
        />
      </HeroLoop>

      <Container className="relative z-10 flex flex-col gap-5 pt-20 pb-7 md:gap-7 md:pt-28 md:pb-9">
        <Label className="text-ink/90 drop-shadow-[0_1px_12px_rgba(4,5,10,0.95)]">{fold.badge}</Label>

        <h1 id="fold-title" className="sr-only">
          {fold.title}
        </h1>

        <div className="flex w-full max-w-[min(100%,60rem)] flex-col gap-2">
          <BrandLine rule size="lg" />
          <LedWordmark label={fold.wordmarkLabel} />
        </div>

        <div className="grid gap-6 md:grid-cols-[1.25fr_auto] md:items-end md:gap-10">
          <div className="max-w-[54ch]">
            <p className="text-[clamp(1.75rem,3.4vw,3.15rem)] leading-[1.08] font-semibold tracking-tight text-balance text-ink">
              {fold.kicker(yearsActive)}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base md:text-lg">{fold.lead}</p>
          </div>

          {/* Focal anchor: 1 clear primary CTA + 1 quiet secondary action */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center md:flex-col md:items-end lg:flex-row">
            <div data-magnetic className="w-full sm:w-auto">
              <Button size="lg" href="#contato" className="w-full whitespace-nowrap sm:w-auto">
                Montar briefing em 30s
              </Button>
            </div>
            <Button
              variant="ghost"
              size="lg"
              href="#prova"
              className="w-full gap-2.5 px-2 whitespace-nowrap text-ink hover:text-led-text sm:w-auto"
            >
              <Icon name="play" className="size-4 text-led" />
              <span>Assistir ao show ao vivo</span>
            </Button>
          </div>
        </div>
      </Container>

      {/* Hairline-divided editorial proof strip — 2x2 on phones & portrait tablets, 4-across on lg+ */}
      <Container className="relative z-10 border-t border-line/80 py-4 md:py-5">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
          {fold.proof.map((item, i) => (
            <li
              key={item.label}
              className="flex items-center lg:px-6 lg:first:pl-0 lg:last:pr-0"
            >
              <LedNumber
                value={item.value}
                label={item.label}
                matrixClassName="h-5 sm:h-6 md:h-7"
                delayMs={PROOF_DELAY_MS + i * PROOF_STEP_MS}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
