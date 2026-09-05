// src/components/historia/Nomes.tsx
// The names the band has shared a stage with, and the clubs and promoters
// that keep booking it. A plain list here — the home has the running ticker.
import { artists, partners } from '@/data/band';
import { historia } from '@/data/copy/historia';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';

export function Nomes() {
  return (
    <Section id="nomes" labelledBy="nomes-title" className="border-t border-line">
      <Container className="grid gap-12 md:grid-cols-[2fr_1fr] md:gap-16">
        <div>
          <Label as="h2" id="nomes-title" dot>
            {historia.names.label}
          </Label>
          <p className="mt-4 max-w-[60ch] text-lg text-ink-muted">{historia.names.lead}</p>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {artists.map((name) => (
              <li key={name} className="flex items-center gap-8 text-2xl font-medium tracking-tight text-ink">
                {name}
                <i aria-hidden className="size-1.5 rounded-pill bg-led-dim" />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Label>{historia.names.partnersLabel}</Label>
          <ul className="mt-5 flex flex-col gap-2.5">
            {partners.map((name) => (
              <li key={name} className="flex gap-3 text-ink-muted">
                <i aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-pill bg-led" />
                {name}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
