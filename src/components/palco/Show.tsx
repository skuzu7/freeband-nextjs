// src/components/palco/Show.tsx
// The four reels with their single pause control. Silent clips from the
// band's own camera; nothing here is stock.
import { palco } from '@/data/copy/palco';
import { reels } from '@/data/media/reels';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { ReelGroup } from '@/components/media/ReelGroup';

export function Show() {
  return (
    <Section id="show" labelledBy="show-title" className="border-t border-line">
      <Container>
        <header className="max-w-[60ch]">
          <Label dot>{palco.video.label}</Label>
          <h2 id="show-title" className="mt-4 text-4xl font-semibold tracking-display text-ink">
            {palco.video.headline}
          </h2>
          <p className="mt-5 text-lg text-ink-muted">{palco.video.lead}</p>
        </header>
        <ReelGroup
          className="mt-8"
          reels={reels}
          columns={4}
          pauseLabel={palco.video.pauseLabel}
          playLabel={palco.video.playLabel}
        />
        <p className="mt-4 text-sm text-ink-low">{palco.video.footnote}</p>
      </Container>
    </Section>
  );
}
