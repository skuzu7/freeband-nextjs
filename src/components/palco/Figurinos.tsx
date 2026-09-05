// src/components/palco/Figurinos.tsx
// Backstage: the wardrobe, one shot per block of the show. Three portraits in
// one plate, so they stay side by side even on a phone.
import { palco } from '@/data/copy/palco';
import { figurinos } from '@/data/media/figurinos';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { PlateRow } from '@/components/media/PlateRow';

export function Figurinos() {
  return (
    <Section id="figurinos" labelledBy="figurinos-title">
      <Container className="grid gap-8 md:grid-cols-[1fr_2fr] md:items-start md:gap-12">
        <header>
          <Label as="h2" id="figurinos-title" dot>
            {palco.figurinos.label}
          </Label>
          <p className="mt-4 max-w-[40ch] text-lg text-ink-muted">{palco.figurinos.lead}</p>
        </header>
        <PlateRow frames={figurinos} rowFraction={2 / 3} />
      </Container>
    </Section>
  );
}
