// @vitest-environment node
//
// The proposal PDF, rendered in Node with the real fonts: a filled-in form is
// one page, an empty one still renders, and a long list of items runs to a
// second page instead of printing over the footer. The same blocks feed the
// HTML print layout (src/lib/__tests__/proposta.test.ts pins them); this file
// is about the renderer.
//
// To look at what it renders, run it with PDF_OUT_DIR set to a folder: the
// filled-in proposal is written there as proposta-led2.pdf.
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { renderToBuffer } from '@react-pdf/renderer';
import { defaultOrcamento, type OrcamentoData } from '@/types/orcamento';
import { OrcamentoPdf } from '../orcamento/OrcamentoPdf';
import { registerPdfFonts } from '../theme';

const PUBLIC = path.resolve(__dirname, '../../../../public');

// The form's own defaults (event type, percentage, the included items) with
// the rest filled in as a producer would. Nobody here is a real client.
const sample: OrcamentoData = {
  ...defaultOrcamento,
  contratante: 'Marina Souza & Rafael Lima',
  dataEvento: '2027-05-15',
  local: 'Espaço Villa Real — Jaú/SP',
  horarioInicio: '22:00',
  horarioFim: '02:00',
  numConvidados: '300',
  cache: '18000',
  entradaData: '2026-11-10',
  saldoData: '2027-05-08',
  observacoes: 'Montagem a partir das 14h, com acesso para caminhão até a porta do salão.\nPonto de energia trifásico 220 V a até 20 m do palco.',
  validade: '2026-10-31',
};

const pagesOf = (pdf: Buffer) => (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length;

describe('proposal PDF', () => {
  const complaints: string[] = [];

  beforeAll(() => {
    for (const level of ['warn', 'error'] as const) {
      vi.spyOn(console, level).mockImplementation((...args: unknown[]) => {
        complaints.push(`${level}: ${args.map(String).join(' ')}`);
      });
    }
    // A plain path: Node's fetch has no file://, and react-pdf reads a path
    // from disk (see portfolio.test.tsx).
    registerPdfFonts(PUBLIC);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('is one page when the form is filled in', async () => {
    const pdf = await renderToBuffer(<OrcamentoPdf data={sample} />);
    const out = process.env.PDF_OUT_DIR;
    if (out) {
      mkdirSync(out, { recursive: true });
      writeFileSync(path.join(out, 'proposta-led2.pdf'), pdf);
    }
    expect(pagesOf(pdf)).toBe(1);
  }, 60_000);

  it('renders the untouched form: dashes, no date on the matrix', async () => {
    expect(pagesOf(await renderToBuffer(<OrcamentoPdf data={defaultOrcamento} />))).toBe(1);
  }, 60_000);

  it('runs a long proposal to a second page', async () => {
    const itensInclusos = Array.from({ length: 30 }, (_, i) => `• Item ${i + 1} do contrato`).join('\n');
    expect(pagesOf(await renderToBuffer(<OrcamentoPdf data={{ ...sample, itensInclusos }} />))).toBe(2);
  }, 60_000);

  it('renders without a complaint from react-pdf', () => {
    expect(complaints).toEqual([]);
  });
});
