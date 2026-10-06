// @vitest-environment node
//
// The proposal's view-model as it prints today — the event rows, the total
// and the two payments — and the blocks both renderers (the HTML print layout
// and the PDF) are drawn from.
import { describe, it, expect } from 'vitest';
import { bandInfo } from '@/data/band';
import { contact } from '@/data/contact';
import { orcamento } from '@/data/copy/orcamento';
import { defaultOrcamento } from '@/types/orcamento';
import { buildProposta, formatSchedule, pctLabel, propostaBlocks, type PropostaBlock } from '../proposta';

const doc = orcamento.doc;
// Intl's pt-BR currency format puts a no-break space after "R$"; the
// placeholder "R$ —" from src/lib/format.ts has a plain one.
const NBSP = ' ';

const build = (patch = {}) => buildProposta({ ...defaultOrcamento, ...patch });

describe('buildProposta', () => {
  it('prints the form defaults: the event type, dashes and the default percentage', () => {
    const v = build();
    expect(v.rows.map(([label]) => label)).toEqual([doc.tipoEvento, doc.data, doc.local, doc.horario, doc.convidados]);
    expect(v.rows[0][1]).toBe(defaultOrcamento.tipoEvento);
    expect(v.rows.slice(1).map(([, value]) => value)).toEqual([doc.empty, doc.empty, doc.empty, doc.empty]);
    expect(v.total).toBe(doc.empty);
    expect(v.entradaLabel).toBe(`${doc.entrada} (${Number(defaultOrcamento.entradaPct)}%)`);
    expect(v.entradaValor).toBe('R$ —');
    expect(v.saldoValor).toBe('R$ —');
  });

  it('formats the total and leaves both payments open without a percentage', () => {
    const v = build({ cache: '5000', entradaPct: '' });
    expect(v.total).toBe(`R$${NBSP}5.000,00`);
    expect(v.entradaLabel).toBe(`${doc.entrada} (—)`);
    expect(v.saldoLabel).toBe(`${doc.saldo} (—)`);
    expect(v.entradaValor).toBe('R$ —');
    expect(v.saldoValor).toBe('R$ —');
  });

  it('splits the total by the down-payment percentage', () => {
    const v = build({ cache: '10000', entradaPct: '30' });
    expect(v.entradaLabel).toBe(`${doc.entrada} (30%)`);
    expect(v.saldoLabel).toBe(`${doc.saldo} (70%)`);
    expect(v.entradaValor).toBe(`R$${NBSP}3.000,00`);
    expect(v.saldoValor).toBe(`R$${NBSP}7.000,00`);
  });

  it('prints 0% / 100% when there is no down payment', () => {
    const v = build({ cache: '10000', entradaPct: '0' });
    expect(v.entradaLabel).toBe(`${doc.entrada} (0%)`);
    expect(v.saldoLabel).toBe(`${doc.saldo} (100%)`);
    expect(v.entradaValor).toBe(`R$${NBSP}0,00`);
    expect(v.saldoValor).toBe(`R$${NBSP}10.000,00`);
  });

  it('labels the clamped percentage, not the typed one', () => {
    const v = build({ cache: '10000', entradaPct: '150' });
    expect(v.entradaLabel).toBe(`${doc.entrada} (100%)`);
    expect(v.saldoLabel).toBe(`${doc.saldo} (0%)`);
  });

  it('prints the currency placeholder for a total that is not a number', () => {
    expect(build({ cache: 'abc' }).total).toBe('R$ —');
  });

  it('prints the guest count with its unit', () => {
    expect(build({ numConvidados: '150' }).rows[4][1]).toBe(`150 ${doc.pessoas}`);
  });

  it('prints the event date as dd/mm/yyyy', () => {
    expect(build({ dataEvento: '2026-12-31' }).rows[1][1]).toBe('31/12/2026');
  });

  it('gives the dot matrix the date in digits and blanks, and nothing when there is no real date', () => {
    const v = build({ dataEvento: '2026-12-31' });
    expect(v.dataEvento).toBe('31/12/2026');
    expect(v.dataMatriz).toBe('31 12 2026');
    expect(build().dataMatriz).toBeNull();
    // 31 February is printed as typed (src/lib/format.ts), never lit.
    expect(build({ dataEvento: '2026-02-31' }).dataMatriz).toBeNull();
  });

  it('reads the included items one per line and drops the bullets typed with them', () => {
    expect(build().itens).toHaveLength(5);
    for (const item of build().itens) expect(item).not.toMatch(/^[•\s-]/);
    expect(build({ itensInclusos: '• Banda\n\n- DJ\n  Som  \n•\n' }).itens).toEqual(['Banda', 'DJ', 'Som']);
  });

  it('reads the remarks as paragraphs and the dates as sentences', () => {
    const v = build({ observacoes: 'Um.\n\nDois.', entradaData: '2026-11-10', validade: '2026-10-31' });
    expect(v.observacoes).toEqual(['Um.', 'Dois.']);
    expect(v.entradaPrazo).toBe(`${doc.ate} 10/11/2026`);
    expect(v.saldoPrazo).toBeNull();
    expect(v.validade).toBe(`${doc.validade} 31/10/2026`);
    expect(build().validade).toBeNull();
  });

  it('prints the dash for a client that was not typed', () => {
    expect(build().contratante).toBe(doc.empty);
    expect(build({ contratante: '   ' }).contratante).toBe(doc.empty);
    expect(build({ contratante: 'Clube Náutico' }).contratante).toBe('Clube Náutico');
  });
});

describe('formatSchedule', () => {
  const cases: ReadonlyArray<readonly [string, string, string]> = [
    ['', '', doc.empty],
    ['20:00', '', `20:00 ${doc.horarioJoin} ${doc.empty}`],
    ['', '23:00', `${doc.empty} ${doc.horarioJoin} 23:00`],
    ['20:00', '23:00', `20:00 ${doc.horarioJoin} 23:00`],
  ];

  it('prints whichever end of the evening is known, and one dash for neither', () => {
    for (const [inicio, fim, expected] of cases) expect(formatSchedule(inicio, fim)).toBe(expected);
  });

  it('is what the schedule row prints', () => {
    for (const [inicio, fim, expected] of cases) {
      expect(build({ horarioInicio: inicio, horarioFim: fim }).rows[3][1]).toBe(expected);
    }
  });
});

describe('pctLabel', () => {
  it('prints a dash when the percentage is unknown', () => {
    expect(pctLabel(doc.entrada, null)).toMatch(/\(—\)$/);
  });
});

describe('propostaBlocks', () => {
  const blocks = (patch = {}) => propostaBlocks(build(patch));
  const kinds = (list: PropostaBlock[]) => list.map((block) => block.kind);
  const pick = <K extends PropostaBlock['kind']>(list: PropostaBlock[], kind: K) => {
    const block = list.find((b): b is Extract<PropostaBlock, { kind: K }> => b.kind === kind);
    if (!block) throw new Error(`no ${kind} block`);
    return block;
  };

  const filled = {
    contratante: 'Clube Náutico',
    dataEvento: '2026-12-31',
    local: 'Araraquara/SP',
    cache: '10000',
    entradaPct: '30',
    entradaData: '2026-11-10',
    observacoes: 'Montagem às 14h.',
    validade: '2026-10-31',
  };

  it('lays the document out in print order, one block of each kind', () => {
    expect(kinds(blocks(filled))).toEqual(['header', 'client', 'facts', 'total', 'payments', 'list', 'text', 'footer']);
  });

  it('leaves no title behind for an empty list or no remarks', () => {
    expect(kinds(blocks({ itensInclusos: '', observacoes: '' }))).toEqual(['header', 'client', 'facts', 'total', 'payments', 'footer']);
    expect(kinds(blocks({ itensInclusos: ' \n ' }))).not.toContain('list');
  });

  it('prints the numbers buildProposta computed, untouched', () => {
    const view = build(filled);
    const list = propostaBlocks(view);
    expect(pick(list, 'total').value).toBe(view.total);
    expect(pick(list, 'payments').parts).toEqual([
      { label: view.entradaLabel, value: view.entradaValor, due: `${doc.ate} 10/11/2026` },
      { label: view.saldoLabel, value: view.saldoValor, due: null },
    ]);
    expect(pick(list, 'client').name).toBe('Clube Náutico');
  });

  it('puts the date in the letterhead — lit, and spelled out beside its name — and the rest in the facts', () => {
    const list = blocks(filled);
    expect(pick(list, 'header').date).toEqual({ label: `${doc.dataEvento} · 31/12/2026`, matrix: '31 12 2026', text: '31/12/2026' });
    expect(pick(list, 'facts').rows.map((row) => row.label)).toEqual([doc.tipoEvento, doc.local, doc.horario, doc.convidados]);
  });

  it('prints the dash as type when there is no date to light', () => {
    expect(pick(blocks(), 'header').date).toEqual({ label: doc.dataEvento, matrix: null, text: doc.empty });
  });

  it('signs every page with the terms and the band', () => {
    const footer = pick(blocks(filled), 'footer');
    expect(footer.terms).toEqual([`${doc.validade} 31/10/2026`, `${doc.cnpj} ${bandInfo.cnpj}`]);
    expect(footer.signature.join(' ')).toContain(bandInfo.name);
    expect(footer.phone).toBe(contact.phone);
    // Without a validity date the line is gone, not a dangling "válida até".
    expect(pick(blocks(), 'footer').terms).toEqual([`${doc.cnpj} ${bandInfo.cnpj}`]);
  });
});
