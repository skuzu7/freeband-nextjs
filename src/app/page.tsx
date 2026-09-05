'use client';

// TEMPORARY — phase 1 proof page for the design system. Replaced by the real
// home in phase 3.
import { useState } from 'react';
import { tokens, themes } from '@/design/tokens';
import { Wordmark } from '@/components/brand/Wordmark';
import { Logotipo } from '@/components/brand/Logotipo';
import { LedPanel } from '@/components/brand/LedPanel';
import { LedNumber } from '@/components/brand/LedNumber';
import { DotGrid } from '@/components/brand/DotGrid';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Divider } from '@/components/ui/Divider';
import { Prose } from '@/components/ui/Prose';

export default function Proof() {
  const [lit, setLit] = useState(false);
  return (
    <main className="relative">
      <DotGrid fade className="fixed" />
      <Section labelledBy="fold">
        <Container className="flex flex-col gap-8">
          <Label dot>Fase 1 · sistema</Label>
          <h1 id="fold" className="text-5xl font-semibold tracking-display">
            Painel de LED
          </h1>
          <div className="relative">
            <LedPanel source={{ kind: 'wordmark' }} aspect={750 / 127} cols={180} onLit={() => setLit(true)}>
              <Wordmark
                className={`absolute inset-[3%] h-[94%] w-[94%] text-red transition-opacity duration-700 ease-light ${lit ? 'opacity-100' : 'opacity-0'}`}
                title="Freeband"
              />
            </LedPanel>
          </div>
          <div className="flex flex-wrap items-end gap-10">
            <LedNumber value="1969" label="fundada em Jaú/SP" />
            <LedNumber value="11" label="no palco" />
            <LedNumber value="57+" label="anos de estrada" />
          </div>
          <Divider />
          <div className="flex flex-wrap gap-4">
            <Button href="https://wa.me/5516997732749">Pedir orçamento</Button>
            <Button variant="secondary" href="/">
              Ver o palco
            </Button>
            <Button variant="ghost">Cancelar</Button>
            <Button size="lg">Pedir orçamento</Button>
          </div>
          <Logotipo title="Internacional Freeband" />
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col gap-10">
          <Label>Tipo</Label>
          {(Object.keys(tokens.text) as Array<keyof typeof tokens.text>).map((k) => (
            <p key={k} className={`text-${k} leading-none`} style={{ fontSize: `var(--text-${k})` }}>
              <span className="mr-4 text-xs text-ink-low" style={{ fontSize: 'var(--text-xs)' }}>
                {k}
              </span>
              Onze no palco, cinquenta e sete anos de estrada.
            </p>
          ))}
          <Prose>
            <p>
              Fundada em 1969 na cidade de Jaú/SP por um grupo de amigos com uma proposta inovadora para a
              época, a <strong>Internacional Freeband</strong> nasceu para tocar aos finais de semana.
            </p>
            <p>Segundo parágrafo, para medir o espaço entre eles.</p>
          </Prose>
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col gap-6">
          <Label>Paleta</Label>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
            {Object.entries(tokens.palette).map(([name, value]) => (
              <div key={name} className="flex flex-col gap-2">
                <div className="aspect-square border border-line" style={{ background: value }} />
                <span className="text-2xs text-ink-low" style={{ fontSize: 'var(--text-2xs)' }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
          <Label>Semântica</Label>
          <div className="grid gap-3 sm:grid-cols-3">
            {(['dark', 'paper', 'sepia'] as const).map((t) => (
              <div key={t} data-theme={t === 'dark' ? undefined : t} className="bg-surface p-5 text-ink">
                <Label dot className="mb-3">
                  {t}
                </Label>
                <p className="text-ink">ink · {themes[t].ink}</p>
                <p className="text-ink-muted">ink-muted</p>
                <p className="text-ink-low">ink-low</p>
                <p className="text-led-text">led-text</p>
                <div className="mt-3 flex gap-2">
                  <span className="size-6 bg-led" />
                  <span className="size-6 bg-led-dim" />
                  <span className="size-6 bg-red" />
                  <span className="size-6 bg-surface-raise" />
                  <span className="size-6 bg-surface-high" />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button>Primário</Button>
                  <Button variant="secondary">Secundário</Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-6 md:grid-cols-2">
          <div>
            <Label className="mb-3">Texto em LED</Label>
            <LedPanel source={{ kind: 'text', text: '1969' }} aspect={3} cols={90} mode="scatter" className="bg-surface-raise" />
          </div>
          <div>
            <Label className="mb-3">Foto em LED</Label>
            <LedPanel
              source={{ kind: 'image', src: '/images/vocal-dourado-palco.jpeg' }}
              aspect={1.5}
              cols={90}
              className="bg-surface-raise"
            />
          </div>
        </Container>
      </Section>
    </main>
  );
}
