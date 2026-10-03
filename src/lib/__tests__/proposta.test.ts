// @vitest-environment node
//
// The proposal's view-model as it prints today: the event rows, the total and
// the two payments that the HTML print layout and the PDF both render.
import { describe, it, expect } from 'vitest';
import { orcamento } from '@/data/copy/orcamento';
import { defaultOrcamento } from '@/types/orcamento';
import { buildProposta, formatSchedule, pctLabel } from '../proposta';

const doc = orcamento.doc;
// Intl's pt-BR currency format puts a no-break space after "R$"; the
// placeholder "R$ —" from src/lib/format.ts has a plain one.
const NBSP = '\u00a0';

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
