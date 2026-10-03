// src/types/orcamento.ts
import { orcamento } from '@/data/copy/orcamento';

export interface OrcamentoData {
  contratante: string;
  tipoEvento: string;
  dataEvento: string;
  local: string;
  horarioInicio: string;
  horarioFim: string;
  numConvidados: string;
  cache: string;
  entradaPct: string;
  entradaData: string;
  saldoData: string;
  itensInclusos: string;
  observacoes: string;
  validade: string;
}

export const ORCAMENTO_FIELDS: ReadonlyArray<keyof OrcamentoData> = [
  'contratante',
  'tipoEvento',
  'dataEvento',
  'local',
  'horarioInicio',
  'horarioFim',
  'numConvidados',
  'cache',
  'entradaPct',
  'entradaData',
  'saldoData',
  'itensInclusos',
  'observacoes',
  'validade',
];

// The starting proposal. The strings a producer sees live in the copy file
// with everything else the editor says.
export const defaultOrcamento: OrcamentoData = {
  contratante: '',
  tipoEvento: orcamento.form.defaults.tipoEvento,
  dataEvento: '',
  local: '',
  horarioInicio: '',
  horarioFim: '',
  numConvidados: '',
  cache: '',
  entradaPct: orcamento.form.defaults.entradaPct,
  entradaData: '',
  saldoData: '',
  itensInclusos: orcamento.form.defaults.itensInclusos,
  observacoes: '',
  validade: '',
};
