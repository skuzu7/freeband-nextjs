import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrintLayout } from '../PrintLayout';
import { buildProposta, propostaBlocks, type PropostaBlock } from '@/lib/proposta';
import { defaultOrcamento, type OrcamentoData } from '@/types/orcamento';

// The print layout is a thin renderer over propostaBlocks(): whatever a block
// carries is on the page, and the two hooks src/styles/print.css holds on to
// are where it expects them.

const filled: OrcamentoData = {
  ...defaultOrcamento,
  contratante: 'Clube Náutico',
  dataEvento: '2026-12-31',
  local: 'Araraquara/SP',
  horarioInicio: '22:00',
  horarioFim: '02:00',
  numConvidados: '300',
  cache: '10000',
  entradaPct: '30',
  entradaData: '2026-11-10',
  saldoData: '2026-12-20',
  observacoes: 'Montagem às 14h.\nEnergia trifásica.',
  validade: '2026-10-31',
};

/** Every string a block prints. `kind` names the block and `matrix` is drawn in dots, not written. */
function printed(block: PropostaBlock): string[] {
  const out: string[] = [];
  const walk = (value: unknown, key?: string) => {
    if (key === 'kind' || key === 'matrix') return;
    if (typeof value === 'string') out.push(value);
    else if (Array.isArray(value)) value.forEach((item) => walk(item));
    else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => walk(v, k));
  };
  walk(block);
  return out;
}

describe('proposal print layout', () => {
  it.each([
    ['a filled-in form', filled],
    ['the untouched form', defaultOrcamento],
  ])('prints every string of every block for %s', (_, data) => {
    const { container } = render(<PrintLayout data={data} />);
    const text = container.textContent ?? '';
    const blocks = propostaBlocks(buildProposta(data));
    for (const block of blocks) {
      for (const value of printed(block)) expect(text, `${block.kind}: "${value}"`).toContain(value);
    }
  });

  it('lights the date on the dot matrix only when there is one', () => {
    const lit = render(<PrintLayout data={filled} />);
    expect(lit.container.querySelector('#print-area header [aria-hidden] svg')).not.toBeNull();
    lit.unmount();
    const unlit = render(<PrintLayout data={defaultOrcamento} />);
    expect(unlit.container.querySelector('#print-area header [aria-hidden] svg')).toBeNull();
  });

  it('keeps the two hooks of print.css: the sheet, and its footer last', () => {
    const { container } = render(<PrintLayout data={filled} />);
    const area = container.querySelector('#print-area');
    expect(area).not.toBeNull();
    expect(container.querySelectorAll('.print-footer')).toHaveLength(1);
    expect(area?.lastElementChild).toHaveClass('print-footer');
    expect(area?.firstElementChild?.tagName).toBe('HEADER');
  });
});
