// src/components/palco/Estrutura.tsx
// The rig, mounted at real setups: the receipt for every line the packages
// list. Two landscapes and a portrait in one level row.
import { palco } from '@/data/copy/palco';
import { estrutura } from '@/data/media/estrutura';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { PlateRow } from '@/components/media/PlateRow';

export function Estrutura() {
  return (
    <Section id="estrutura" labelledBy="estrutura-title" className="border-t border-line">
      <Container className="flex flex-col gap-8">
        <header className="max-w-[60ch]">
          <Label as="h2" id="estrutura-title" dot>
            {palco.estrutura.label}
          </Label>
          <p className="mt-4 text-lg text-ink-muted">{palco.estrutura.lead}</p>
        </header>
        <PlateRow frames={estrutura} />
      </Container>
    </Section>
  );
}
