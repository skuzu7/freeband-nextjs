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
      aria-labelledby="fold-title"
      className="relative isolate flex min-h-[calc(100svh-var(--nav-h))] flex-col justify-end overflow-hidden"
    >
      <HeroLoop
        video={heroMedia.video}
        pauseLabel={fold.backdropPause}
        playLabel={fold.backdropPlay}
        stageModeLabel={fold.stageModeLabel}
        stageModes={fold.stageModes}
      >
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
      <Container className="relative z-10 flex flex-col gap-6 pt-24 pb-6 md:gap-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Label dot>{fold.badge}</Label>
          <nav
            aria-label="Capítulos da página"
            className="hidden items-center gap-1 border border-line bg-surface/75 px-2 backdrop-blur-md lg:inline-flex"
          >
            {[
              { href: '#caminhao', num: '01', label: 'Estrutura' },
              { href: '#blocos', num: '02', label: 'Blocos' },
              { href: '#prova', num: '03', label: 'Ao Vivo' },
              { href: '#contato', num: '04', label: 'Briefing 30s' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="label-caps transition-quick tap inline-flex items-center gap-1.5 px-2.5 text-2xs text-ink-muted hover:text-led-text"
              >
                <span className="text-led">{item.num}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <h1 id="fold-title" className="sr-only">
          {fold.title}
        </h1>
        <div className="flex w-full max-w-[min(100%,66rem)] flex-col gap-2.5">
          <BrandLine rule size="lg" />
          <LedWordmark label={fold.wordmarkLabel} />
        </div>
        <div className="grid gap-6 md:grid-cols-[1.15fr_1fr] md:items-end">
          <div>
            <p className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">{fold.kicker(yearsActive)}</p>
            <p className="mt-3 max-w-[54ch] text-base text-ink-muted md:text-lg">{fold.lead}</p>
          </div>
          {/* Stacked and full-width on phones, side by side from 40rem. */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap md:justify-end">
            <WhatsAppCta size="lg" className="w-full sm:w-auto">
              {fold.ctaPrimary}
            </WhatsAppCta>
            <Button variant="secondary" size="lg" href="#contato" className="w-full border-led/50 bg-surface/75 backdrop-blur-sm sm:w-auto">
              Briefing em 30s
            </Button>
            <Button variant="secondary" size="lg" href="/palco" className="w-full bg-surface/75 backdrop-blur-sm sm:w-auto">
              {fold.ctaSecondary}
            </Button>
            <Button variant="ghost" size="lg" href="/palco#show" className="w-full gap-3 px-0 sm:w-auto">
              <Icon name="play" className="size-4 text-led" />
              {fold.ctaWatch}
            </Button>
          </div>
        </div>
      </Container>
      <Container className="relative z-10 border-t border-line/80 py-4">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {fold.proof.map((item, i) => (
            <li
              key={item.label}
              className="transition-quick relative overflow-hidden border border-line bg-surface/80 p-3.5 backdrop-blur-md hover:border-led/60"
            >
              <span aria-hidden className="mb-2 block h-0.5 w-8 bg-led/80" />
              <LedNumber
                value={item.value}
                label={item.label}
                matrixClassName="h-6 md:h-7"
                delayMs={PROOF_DELAY_MS + i * PROOF_STEP_MS}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
