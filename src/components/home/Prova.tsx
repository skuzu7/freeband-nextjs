// src/components/home/Prova.tsx
// Block 4 — Proof: live video clips (swipeable on mobile with SnapDots),
// live-stage photographs, archival flyers, and the LED marquee of shared stages.
import { artists } from '@/data/band';
import { contact } from '@/data/contact';
import { prova } from '@/data/copy/home';
import { stageFrames } from '@/data/media/frames';
import { gallery } from '@/data/media/gallery';
import { linkFor } from '@/lib/gallery/sets';
import { posters } from '@/data/media/posters';
import { videos } from '@/data/media/videos';
import { LedSign } from '@/components/brand/LedSign';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SnapDots } from '@/components/ui/SnapDots';
import { PlateRow } from '@/components/media/PlateRow';
import { ClipList } from '@/components/media/player/ClipList';

const HOME_STAGE_ROW_1_IDS = ['palco-asas', 'bateria-neon', 'palco-banda'] as const;
const HOME_STAGE_ROW_2_IDS = ['nautico-quatro-vozes', 'nautico-bloco-circo', 'nautico-palco-luzes'] as const;
const CLIPS_ROW_ID = 'prova-clips-row';

function pickStageRow(ids: readonly string[]) {
  return ids
    .map((id) => stageFrames.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
    .map((f) => ({
      ...f,
      link: linkFor(gallery.palco, f.id),
    }));
}

export function Prova() {
  const homeClips = videos.slice(0, 3);
  const stageRow1 = pickStageRow(HOME_STAGE_ROW_1_IDS);
  const stageRow2 = pickStageRow(HOME_STAGE_ROW_2_IDS);

  const homePosters = posters
    .filter((p) => p.home)
    .map((p) => ({
      ...p,
      caption: `${p.town} · ${p.event} · ${p.when}`,
      link: linkFor(gallery.arquivo, p.id),
    }));

  return (
    <Section id="prova" labelledBy="prova-title" className="border-t border-line">
      <Container className="flex flex-col gap-16 md:gap-20">
        <div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeader id="prova-title" label={prova.label} headline={prova.headline} lead={prova.videoLead} />
            <div className="flex items-center justify-between gap-4 md:mb-1">
              <span className="text-xs text-ink-low md:text-right">Áudio ao vivo · Sem playback</span>
              <SnapDots
                rowId={CLIPS_ROW_ID}
                count={homeClips.length}
                label="Vídeo ao vivo"
                className="md:hidden"
              />
            </div>
          </div>

          <ClipList clips={homeClips} columns={3} carouselId={CLIPS_ROW_ID} className="rise mt-8" />

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <p className="text-sm text-ink-low">{prova.videoFootnote}</p>
            <Button variant="secondary" href="/palco">
              {prova.palcoCta} →
            </Button>
          </div>
        </div>

        <div className="rise border-t border-line pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <Label>{prova.stagePhotosLabel}</Label>
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tap transition-quick inline-flex items-center gap-1.5 text-xs font-medium text-led-text hover:text-ink"
            >
              <span>{contact.instagram}</span>
              <span aria-hidden>↗</span>
            </a>
          </div>
          <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-ink-muted md:text-lg">{prova.stagePhotosLead}</p>
          <div className="mt-8 flex flex-col gap-4">
            <PlateRow frames={stageRow1} led />
            <PlateRow frames={stageRow2} led />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line/70 pt-6">
            <Button variant="secondary" href="/palco">
              {prova.palcoCta} (33 fotos) →
            </Button>
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tap transition-quick inline-flex items-center gap-1.5 text-sm text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink"
            >
              <span>{prova.instagramCta}</span>
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        <div className="rise border-t border-line pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <Label>{prova.arquivoLabel}</Label>
            <span className="text-xs text-ink-low">Acervo histórico de cartazes</span>
          </div>
          <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-ink-muted md:text-lg">{prova.arquivoLead}</p>
          <PlateRow frames={homePosters} className="mt-8" led />
          <Button variant="secondary" href="/arquivo" className="mt-8">
            {prova.arquivoCta}
          </Button>
        </div>

        <div className="rise border-t border-line pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <Label>{prova.namesLabel}</Label>
            <span className="text-xs tabular-nums text-ink-low">{artists.length} artistas consagrados</span>
          </div>
          <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-ink-muted md:text-lg">{prova.namesLead}</p>
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
