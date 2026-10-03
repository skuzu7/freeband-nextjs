// The editor's draft as it behaves today: what a stored value reads back as,
// and what writing leaves in this browser's storage.
import { beforeEach, describe, expect, it } from 'vitest';
import { ORCAMENTO_FIELDS, defaultOrcamento } from '@/types/orcamento';
import { DRAFT_KEY, isDefault, parseOrcamento, readDraft, writeDraft } from '../orcamentoDraft';

beforeEach(() => window.localStorage.clear());

describe('parseOrcamento', () => {
  it('refuses anything that is not an object', () => {
    for (const raw of [null, undefined, 42, 'x', true]) expect(parseOrcamento(raw)).toBeNull();
  });

  it('reads an empty object, or an array, as a fresh copy of the defaults', () => {
    for (const raw of [[], {}]) {
      const data = parseOrcamento(raw);
      expect(data).toEqual(defaultOrcamento);
      expect(data).not.toBe(defaultOrcamento);
    }
  });

  it('completes a partial draft with the defaults', () => {
    expect(parseOrcamento({ contratante: 'Prefeitura de Jaú', cache: '5000' })).toEqual({
      ...defaultOrcamento,
      contratante: 'Prefeitura de Jaú',
      cache: '5000',
    });
  });

  it('ignores a field that is not a string', () => {
    expect(parseOrcamento({ cache: 5000, numConvidados: null })).toEqual(defaultOrcamento);
  });

  it('drops keys the form does not have', () => {
    const data = parseOrcamento({ contratante: 'Clube Náutico', token: 'x' });
    expect(data).toEqual({ ...defaultOrcamento, contratante: 'Clube Náutico' });
    expect(data).not.toHaveProperty('token');
  });
});

describe('isDefault', () => {
  it('is true for the starting proposal and false once a field changes', () => {
    expect(isDefault(defaultOrcamento)).toBe(true);
    expect(isDefault({ ...defaultOrcamento, contratante: 'Prefeitura de Jaú' })).toBe(false);
  });

  it('checks the same fields the draft is read from', () => {
    expect([...ORCAMENTO_FIELDS].sort()).toEqual(Object.keys(defaultOrcamento).sort());
  });
});

describe('readDraft / writeDraft', () => {
  it('reads nothing back when there is no usable draft', () => {
    expect(readDraft()).toBeNull();
    for (const stored of ['', 'null', '{not json']) {
      window.localStorage.setItem(DRAFT_KEY, stored);
      expect(readDraft()).toBeNull();
    }
  });

  it('writes the draft as JSON under the key and reads it back', () => {
    const data = { ...defaultOrcamento, contratante: 'Prefeitura de Jaú', cache: '15000' };
    writeDraft(data);
    expect(window.localStorage.getItem(DRAFT_KEY)).toBe(JSON.stringify(data));
    expect(readDraft()).toEqual(data);
  });

  it('removes the draft when given null', () => {
    writeDraft({ ...defaultOrcamento, contratante: 'Prefeitura de Jaú' });
    writeDraft(null);
    expect(window.localStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it('keeps the key that drafts already saved in browsers live under', () => {
    expect(DRAFT_KEY).toBe('freeband_orcamento_draft');
  });
});
