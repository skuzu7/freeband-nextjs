// src/components/historia/Release.tsx
// The release in full and the band's own manifesto, verbatim, beside the
// golden-sequin portrait that bridges the classic era and today's show.
import { paragraphsOf, release } from '@/data/band';
import { historia } from '@/data/copy/historia';
import { retratoPaete } from '@/data/media/frames';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Prose } from '@/components/ui/Prose';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Photo } from '@/components/media/Photo';

export function Release() {
  return (
    <Section id="release" labelledBy="release-title" className="border-t border-line">
      <Container className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <SectionHeader id="release-title" label={historia.release.label} headline={historia.release.headline} />
          <Prose className="mt-8">
            {paragraphsOf(release.full).map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </Prose>
        </div>

        <aside className="flex flex-col gap-10 lg:pt-28">
          <Photo photo={retratoPaete} sizes="(min-width: 1408px) 620px, (min-width: 1024px) 45vw, 100vw" led />
          <blockquote className="m-0 border-l-2 border-led pl-6">
            <Label>{historia.manifestoLabel}</Label>
            <Prose className="mt-4 text-ink">
              {paragraphsOf(release.manifesto).map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </Prose>
          </blockquote>
          <div className="border-t border-line pt-6">
            <p className="text-2xl font-semibold tracking-tight text-ink">{release.slogan}</p>
            <p className="label-caps mt-3 text-ink-low">
              {release.sloganFootnote} · {historia.valuesLine}
            </p>
          </div>
        </aside>
      </Container>
    </Section>
  );
}
