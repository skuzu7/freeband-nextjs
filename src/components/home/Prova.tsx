// src/components/home/Prova.tsx
// Block 4 — proof: three reels, four flyers, and the names the band has
// shared a stage with running across a LED sign. Each part links to the page
// that holds the rest.
import { artists } from '@/data/band';
import { prova } from '@/data/copy/home';
import { posters } from '@/data/media/posters';
import { reels } from '@/data/media/reels';
import { LedMarquee } from '@/components/brand/LedMarquee';
import { LedText } from '@/components/brand/LedText';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { PlateRow } from '@/components/media/PlateRow';
import { ReelGroup } from '@/components/media/ReelGroup';

// The four flyers with enough resolution to run at this size.
const HOME_POSTERS = ['Barra Bonita', 'Paranapanema', 'Jaú', 'Céu Azul'];

export function Prova() {
  const homeReels = reels.slice(0, 3);
  const homePosters = posters
    .filter((p) => HOME_POSTERS.includes(p.town))
    .map((p) => ({ ...p, caption: `${p.town} · ${p.event} · ${p.when}` }));

  return (
    <Section id="prova" labelledBy="prova-title" className="border-t border-line">
      <Container className="flex flex-col gap-20">
        <div>
          <header className="max-w-[60ch]">
            <Label dot>{prova.label}</Label>
            <div className="mt-4">
              <LedText id="prova-title" text={prova.headline} className="text-4xl font-semibold tracking-display text-ink" />
            </div>
            <p className="rise mt-5 text-lg text-ink-muted">{prova.videoLead}</p>
          </header>
          <ReelGroup
            className="rise mt-8"
            reels={homeReels}
            pauseLabel={prova.pauseLabel}
            playLabel={prova.playLabel}
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-ink-low">{prova.videoFootnote}</p>
            <Button variant="ghost" href="/palco" className="px-0">
              {prova.palcoCta} →
            </Button>
          </div>
        </div>

        <div className="rise">
          <Label>{prova.arquivoLabel}</Label>
          <p className="mt-4 max-w-[60ch] text-lg text-ink-muted">{prova.arquivoLead}</p>
          <PlateRow frames={homePosters} className="mt-8" led />
          <Button variant="secondary" href="/arquivo" className="mt-8">
            {prova.arquivoCta}
          </Button>
        </div>

        <div className="rise">
          <Label>{prova.namesLabel}</Label>
          <p className="mt-4 max-w-[60ch] text-lg text-ink-muted">{prova.namesLead}</p>
          <LedMarquee
            items={artists}
            label={prova.namesLabel}
            pauseLabel={prova.namesPause}
            playLabel={prova.namesPlay}
            className="mt-8"
          />
        </div>
      </Container>
    </Section>
  );
}
