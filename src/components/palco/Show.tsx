// src/components/palco/Show.tsx
// The four clips, with sound: live cuts from the band's own camera, nothing
// stock. Each one plays in its own player and only when its visitor asks;
// the title and what it shows are printed under it.
import { palco } from '@/data/copy/palco';
import { videos } from '@/data/media/videos';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ClipList } from '@/components/media/player/ClipList';

export function Show() {
  return (
    // "show" is the address the old site's #video anchor is sent to
    // (src/components/site/LegacyAnchors.tsx).
    <Section id="show" labelledBy="show-title" className="border-t border-line">
      <Container>
        <SectionHeader
          id="show-title"
          label={palco.video.label}
          headline={palco.video.headline}
          lead={palco.video.lead}
        />
        <ClipList clips={videos} columns={2} className="mt-10" />
        <p className="mt-8 text-sm text-ink-low">{palco.video.footnote}</p>
      </Container>
    </Section>
  );
}
