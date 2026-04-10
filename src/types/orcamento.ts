// src/types/orcamento.ts
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

export const defaultOrcamento: OrcamentoData = {
  contratante: "",
  tipoEvento: "Casamento",
  dataEvento: "",
  local: "",
  horarioInicio: "",
  horarioFim: "",
  numConvidados: "",
  cache: "",
  entradaPct: "50",
  entradaData: "",
  saldoData: "",
  itensInclusos: `• Banda completa com músicos profissionais
• Sistema de som de alta potência
• Iluminação profissional com moving heads
• Logística e transporte próprio
• Equipamento de backup`,
  observacoes: "",
  validade: "",
};
