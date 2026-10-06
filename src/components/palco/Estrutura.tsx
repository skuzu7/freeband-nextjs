// src/components/palco/Estrutura.tsx
// The rig, mounted at real setups: the receipt for every line the packages
// list. Two landscapes and a portrait in one level row; each opens in the
// photo viewer, closing the set that starts with the acts.
import { palco } from '@/data/copy/palco';
import { estrutura } from '@/data/media/estrutura';
import { gallery } from '@/data/media/gallery';
import { linkFor } from '@/lib/gallery/sets';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PlateRow } from '@/components/media/PlateRow';

export function Estrutura() {
  return (
    <Section id="estrutura" labelledBy="estrutura-title" className="border-t border-line">
      <Container className="flex flex-col gap-8">
        <SectionHeader
          id="estrutura-title"
          size="sub"
          label={palco.estrutura.label}
          headline={palco.estrutura.headline}
          lead={palco.estrutura.lead}
        />
        <PlateRow frames={estrutura.map((f) => ({ ...f, link: linkFor(gallery.palco, f.id) }))} />
      </Container>
    </Section>
  );
}
