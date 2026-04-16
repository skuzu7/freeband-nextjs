// src/components/sections/AtoIII_Palcos.tsx
// PALCO II — Ato III: merge of Artistas + Parceiros.
// Three kinetic marquees with variable rhythm (35s / 90s / 60s) instead of
// four copy-pasted rows. Row 1 = artists in Fraunces italic, row 2 = partners
// in outline mono (the slowest row), row 3 = numbers/metadata in plain mono.
import { artists, partners, bandLineup, release, pageCopy } from '@/data/content';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeadline } from '@/components/ui/SectionHeadline';
import { Marquee } from '@/components/ui/Marquee';

const numberRow = [
  '1969 — hoje',
  `${release.highlights[0]?.value ?? '57+'} anos de estrada`,
  `${bandLineup.total} integrantes no palco`,
  '2 turnês internacionais',
  '7+ estados brasileiros',
  'Full premium tudo nosso',
];

export function AtoIII_Palcos() {
  return (
    <Section
      id="galeria"
      variant="ink-raise"
      pad="xl"
      className="border-y border-border overflow-hidden"
    >
      <Container>
        <SectionHeadline
          eyebrowNumber={pageCopy.atoIII.eyebrowNumber}
          eyebrowLabel={pageCopy.atoIII.eyebrowLabel}
          prefix={pageCopy.atoIII.headlinePrefix}
          emphasis={pageCopy.atoIII.headlineEmphasis}
          suffix={pageCopy.atoIII.headlineSuffix}
          lead={pageCopy.atoIII.lead}
        />
      </Container>

      <div className="marquee-stack reveal-tail mt-[clamp(3rem,6vi,5rem)] flex flex-col gap-6">
        <Marquee
          items={artists}
          speed={35}
          direction="l"
          variant="italic"
          kbdControl
          ariaLabel="Artistas com quem a Freeband já dividiu o palco"
        />
        <Marquee
          items={partners}
          speed={90}
          direction="r"
          variant="outline"
          kbdControl
          ariaLabel="Parceiros, clubes e prefeituras"
        />
        <Marquee
          items={numberRow}
          speed={60}
          direction="l"
          variant="mono"
          kbdControl
          ariaLabel="Números da Freeband"
        />
      </div>

      <Container>
        <div className="mt-[clamp(3rem,5vi,4rem)] flex items-center gap-4 border-t border-border pt-8 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted">
          <span aria-hidden className="inline-block h-px w-10 bg-brand" />
          <span>{pageCopy.atoIII.valuesLine}</span>
        </div>
      </Container>
    </Section>
  );
}
