// src/components/home/Prova.tsx
// Block 4 — proof: three clips with sound, four flyers, and the names the band has
// shared a stage with running across a LED sign. Each part links to the page
// that holds the rest.
import { artists } from '@/data/band';
import { prova } from '@/data/copy/home';
import { posters } from '@/data/media/posters';
import { videos } from '@/data/media/videos';
import { LedSign } from '@/components/brand/LedSign';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PlateRow } from '@/components/media/PlateRow';
import { ClipList } from '@/components/media/player/ClipList';

export function Prova() {
  // Three of the four clips; /palco has them all.
  const homeClips = videos.slice(0, 3);
  // The flyers flagged for the home in posters.ts: the ones with enough
  // resolution to run at this size.
  const homePosters = posters
    .filter((p) => p.home)
    .map((p) => ({ ...p, caption: `${p.town} · ${p.event} · ${p.when}` }));

  return (
    <Section id="prova" labelledBy="prova-title" className="border-t border-line">
      <Container className="flex flex-col gap-20">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader id="prova-title" label={prova.label} headline={prova.headline} lead={prova.videoLead} />
            <div className="border border-led/35 bg-surface-raise/80 px-3.5 py-2 backdrop-blur-sm">
              <span className="label-caps text-2xs text-led-text">Áudio ao vivo · Reativo ao Painel LED</span>
            </div>
          </div>
          <ClipList clips={homeClips} columns={3} className="rise mt-8" />
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <p className="text-sm text-ink-low">{prova.videoFootnote}</p>
            <Button variant="secondary" href="/palco">
              {prova.palcoCta} →
            </Button>
          </div>
        </div>

        <div className="rise border border-line bg-surface-raise/50 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Label dot>{prova.arquivoLabel}</Label>
            <span className="label-caps text-2xs text-ink-low">Registro Histórico Verificado</span>
          </div>
          <p className="mt-4 max-w-[60ch] text-lg text-ink-muted">{prova.arquivoLead}</p>
          <PlateRow frames={homePosters} className="mt-8" led />
          <Button variant="secondary" href="/arquivo" className="mt-8">
            {prova.arquivoCta}
          </Button>
        </div>

        <div className="rise border border-line bg-surface/85 p-6 backdrop-blur-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Label dot>{prova.namesLabel}</Label>
            <span className="label-caps text-2xs text-led-text">15 Consagrados da Música</span>
          </div>
          <p className="mt-4 max-w-[60ch] text-lg text-ink-muted">{prova.namesLead}</p>
          <LedSign
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
