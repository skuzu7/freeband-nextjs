// src/components/orcamento/PrintLayout.tsx
// The proposal as an HTML page: what the preview scales and what print
// outputs. A thin renderer over propostaBlocks() (src/lib/proposta.ts); the
// PDF twin, src/components/pdf/orcamento/OrcamentoPdf.tsx, renders the same
// blocks in the same order, so the two never disagree on a number, a label or
// where a thing sits.
//
// Paper tokens only, so it matches the editor around it — and no dark panel:
// a browser prints without backgrounds unless told otherwise, and type that
// was light on dark would come out light on white. For the same reason the
// dotted rules are drawn (an <svg>, like the date on the dot matrix), not
// painted as a background: they are on the printout either way.
//
// `#print-area` and `.print-footer` are the two hooks src/styles/print.css
// holds on to; the footer is fixed there, so a second page is signed too.
import type { ReactNode } from 'react';
import { buildProposta, propostaBlocks, type PropostaBlock, type PropostaBlockOf } from '@/lib/proposta';
import { dotsPath } from '@/lib/led/svg';
import type { OrcamentoData } from '@/types/orcamento';
import { LedNumber } from '@/components/brand/LedNumber';
import { Wordmark } from '@/components/brand/Wordmark';

interface PrintLayoutProps {
  data: OrcamentoData;
}

// The page is 210mm with 18mm margins: a 174mm column, in CSS pixels. One dot
// every 8px, the site's own .dot-line.
const RULE_WIDTH = (174 * 96) / 25.4;
const RULE_PITCH = 8;
const RULE = dotsPath(Array.from({ length: Math.floor(RULE_WIDTH / RULE_PITCH) }, (_, i) => [i * RULE_PITCH + 1, 1] as const));

/** One row of the panel, lit under the letterhead and unlit between the parts. */
function DotRule({ lit = false }: { lit?: boolean }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={`0 0 ${RULE_WIDTH} 2`}
      className={`block h-auto w-full ${lit ? 'text-led' : 'text-led-dim'}`}
    >
      <path d={RULE} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

const sectionGap = 'mb-[27px]';
// The document's caps at a fixed size, the PDF's own (7.5pt): the site's
// .label-caps is fluid, and a printout must not depend on how wide the window
// was when someone pressed Print.
const caps = 'text-[0.64rem] leading-[1.4] tracking-[0.2em] uppercase';
const label = `${caps} font-semibold text-led-text`;
const micro = `${caps} text-ink-muted`;
const small = 'text-[0.6rem] leading-[1.4] tracking-[0.17em] uppercase';

/** A section's name in LED caps over an unlit rule. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={sectionGap}>
      <h2 className={label}>{title}</h2>
      <div className="mt-[7px] mb-3">
        <DotRule />
      </div>
      {children}
    </section>
  );
}

function Header({ block }: { block: PropostaBlockOf<'header'> }) {
  const { date } = block;
  return (
    <header className="mb-[29px]">
      <div className="flex items-end justify-between gap-8">
        <div>
          <p className={label}>{block.kicker}</p>
          <p className={`${caps} mt-4 mb-1.5 font-semibold text-ink`}>{block.brandLine}</p>
          <Wordmark className="block h-[34px] w-auto text-red" title={block.name} />
        </div>
        <div className="flex flex-col items-end">
          <p className={micro}>{date.label}</p>
          <div className="mt-2.5">
            {date.matrix ? (
              // The label above already says the date in words.
              <span aria-hidden>
                <LedNumber value={date.matrix} matrixClassName="h-[37px]" animate={false} />
              </span>
            ) : (
              <p className="text-[1.85rem] leading-[1.15] font-semibold text-ink-muted">{date.text}</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5">
        <DotRule lit />
      </div>
    </header>
  );
}

function Client({ block }: { block: PropostaBlockOf<'client'> }) {
  return (
    <section className={sectionGap}>
      <h2 className={micro}>{block.label}</h2>
      <p className="mt-[5px] text-[2rem] leading-[1.15] font-semibold tracking-tight text-ink">{block.name}</p>
    </section>
  );
}

function Facts({ block }: { block: PropostaBlockOf<'facts'> }) {
  return (
    <section className={sectionGap}>
      <DotRule />
      <dl className="grid grid-cols-2 gap-x-4 gap-y-[15px] pt-4 pb-[15px]">
        {block.rows.map((row) => (
          <div key={row.label}>
            <dt className={micro}>{row.label}</dt>
            <dd className="mt-[3px] text-[0.875rem] leading-[1.45] text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
      <DotRule />
    </section>
  );
}

function Total({ block }: { block: PropostaBlockOf<'total'> }) {
  return (
    <section className="mb-5">
      <h2 className={label}>{block.title}</h2>
      <div className="flex items-end justify-between gap-6">
        <span className="mb-[7px] text-[0.875rem] leading-[1.45] text-ink-muted">{block.label}</span>
        <span className="text-[2.5rem] leading-[1.1] font-semibold tracking-tight text-ink">{block.value}</span>
      </div>
    </section>
  );
}

function Payments({ block }: { block: PropostaBlockOf<'payments'> }) {
  return (
    <Section title={block.title}>
      <div className="grid grid-cols-2 gap-3">
        {block.parts.map((part) => (
          <div key={part.label} className="border border-line bg-surface-raise px-[18px] py-[15px]">
            <div className={micro}>{part.label}</div>
            <div className="mt-1 text-[1.35rem] leading-[1.2] font-semibold tracking-tight text-ink">{part.value}</div>
            {part.due && <div className="mt-px text-[0.72rem] leading-[1.4] text-ink-muted">{part.due}</div>}
          </div>
        ))}
      </div>
    </Section>
  );
}

function List({ block }: { block: PropostaBlockOf<'list'> }) {
  return (
    <Section title={block.title}>
      <ul className="flex flex-col gap-[5px]">
        {block.items.map((item, i) => (
          <li key={`${i}-${item}`} className="flex items-start gap-2.5 text-[0.83rem] leading-[1.35] text-ink">
            {/* A drawn dot, like the rules: a background-coloured one is not printed. */}
            <svg aria-hidden focusable="false" viewBox="0 0 2 2" className="mt-[0.45em] size-[4.5px] shrink-0 text-led">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Paragraphs({ block }: { block: PropostaBlockOf<'text'> }) {
  return (
    <Section title={block.title}>
      <div className="flex flex-col gap-[5px]">
        {block.paragraphs.map((paragraph, i) => (
          <p key={`${i}-${paragraph.slice(0, 24)}`} className="text-[0.83rem] leading-[1.45] text-ink">
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
}

function Footer({ block }: { block: PropostaBlockOf<'footer'> }) {
  return (
    <footer className="print-footer mt-auto text-ink-muted">
      <DotRule />
      <div className={`${small} mt-3 flex items-end justify-between gap-6`}>
        <div className="flex flex-col gap-[3px]">
          {block.terms.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <span className="tracking-normal normal-case">{block.links}</span>
        </div>
        <div className="flex flex-col gap-[3px] text-right">
          {block.signature.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <span className="text-ink">{block.phone}</span>
        </div>
      </div>
    </footer>
  );
}

function Block({ block }: { block: PropostaBlock }) {
  switch (block.kind) {
    case 'header':
      return <Header block={block} />;
    case 'client':
      return <Client block={block} />;
    case 'facts':
      return <Facts block={block} />;
    case 'total':
      return <Total block={block} />;
    case 'payments':
      return <Payments block={block} />;
    case 'list':
      return <List block={block} />;
    case 'text':
      return <Paragraphs block={block} />;
    case 'footer':
      return <Footer block={block} />;
  }
}

export function PrintLayout({ data }: PrintLayoutProps) {
  const blocks = propostaBlocks(buildProposta(data));
  return (
    <div id="print-area" className="flex min-h-[297mm] w-[210mm] max-w-full flex-col bg-surface-high p-[18mm] text-ink">
      {blocks.map((block) => (
        <Block key={block.kind} block={block} />
      ))}
    </div>
  );
}
