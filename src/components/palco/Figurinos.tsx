// src/components/palco/Figurinos.tsx
// Backstage: the wardrobe, one shot per block of the show. Three portraits in
// one plate, so they stay side by side even on a phone; each opens in the
// photo viewer, after the acts in the same set.
import { palco } from '@/data/copy/palco';
import { figurinos } from '@/data/media/figurinos';
import { gallery } from '@/data/media/gallery';
import { linkFor } from '@/lib/gallery/sets';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PlateRow } from '@/components/media/PlateRow';

export function Figurinos() {
  return (
    <Section id="figurinos" labelledBy="figurinos-title">
      <Container className="grid gap-8 md:grid-cols-[1fr_2fr] md:items-start md:gap-12">
        <SectionHeader
          id="figurinos-title"
          size="sub"
          label={palco.figurinos.label}
          headline={palco.figurinos.headline}
          lead={palco.figurinos.lead}
        />
        <PlateRow
          frames={figurinos.map((f) => ({ ...f, link: linkFor(gallery.palco, f.id) }))}
          rowFraction={2 / 3}
        />
      </Container>
    </Section>
  );
}
