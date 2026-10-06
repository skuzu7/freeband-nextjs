// src/components/home/Fold.tsx
// Block 1. Everything here is in the HTML the server sends: the stage poster
// (the page's LCP), the wordmark lit in dots and then in red acrylic, the
// pitch, the two ways in and the four numbers. HeroLoop is the one island:
// it adds the loop, the pause control and the WebGL wall over the poster.
import Image from 'next/image';
import { blurMap } from '@/data/blur';
import { fold } from '@/data/copy/home';
import { heroMedia } from '@/data/media/hero';
import { BrandLine } from '@/components/brand/BrandLine';
import { LedNumber } from '@/components/brand/LedNumber';
import { LedWordmark } from '@/components/brand/LedWordmark';
import { WhatsAppCta } from '@/components/site/WhatsAppCta';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
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
      aria-labelledby="fold-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      <HeroLoop video={heroMedia.video} pauseLabel={fold.backdropPause} playLabel={fold.backdropPlay}>
        {/* The one photograph on the site that IS allowed to bleed: it is the
            stage as backdrop, under a scrim, not a picture on display. The
            `data-backdrop` flag exempts it from the smoke test's crop audit. */}
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
      <Container className="relative z-10 flex flex-col gap-8 pt-32 pb-10 md:gap-10">
        <Label dot>{fold.badge}</Label>
        <h1 id="fold-title" className="sr-only">
          {fold.title}
        </h1>
        <div className="flex w-full max-w-[min(100%,66rem)] flex-col gap-3">
          <BrandLine rule size="lg" />
          <LedWordmark label={fold.wordmarkLabel} />
        </div>
        <div className="grid gap-8 md:grid-cols-[1.25fr_1fr] md:items-end">
          <div>
            <p className="text-3xl font-semibold tracking-tight text-ink">{fold.kicker(yearsActive)}</p>
            <p className="mt-4 max-w-[52ch] text-lg text-ink-muted">{fold.lead}</p>
          </div>
          {/* Stacked and full-width on phones, side by side from 40rem. */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap md:justify-end">
            <WhatsAppCta size="lg" className="w-full sm:w-auto">
              {fold.ctaPrimary}
            </WhatsAppCta>
            <Button variant="secondary" size="lg" href="/palco" className="w-full sm:w-auto">
              {fold.ctaSecondary}
            </Button>
          </div>
        </div>
      </Container>
      <Container className="relative z-10 border-t border-line py-6">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
          {fold.proof.map((item, i) => (
            <li key={item.label}>
              <LedNumber
                value={item.value}
                label={item.label}
                matrixClassName="h-7 md:h-8"
                delayMs={PROOF_DELAY_MS + i * PROOF_STEP_MS}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
