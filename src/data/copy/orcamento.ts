// src/data/copy/orcamento.ts
// /orcamento — the proposal editor and the proposal itself (print + PDF).

/** A file name a browser will save without complaint, whatever was typed. */
function safeFileName(name: string): string {
  return name
    .replace(/[\\/:*?"<>|\p{Cc}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

export const orcamento = {
  seo: { title: 'Gerador de proposta' },
  header: {
    brand: 'Internacional Freeband',
    title: 'Gerador de proposta',
    back: 'Voltar ao site',
    logout: 'Sair',
  },
  form: {
    step: '01 · Formulário',
    title: 'Dados da proposta',
    contratante: 'Nome do Contratante',
    contratantePlaceholder: 'Nome completo',
    tipoEvento: 'Tipo de Evento',
    tipoEventoPlaceholder: 'Selecione...',
    tiposEvento: ['Casamento', 'Formatura', 'Evento Corporativo', 'Festa Premium', 'Show Municipal', 'Outro'],
    dataEvento: 'Data do Evento',
    local: 'Local / Cidade',
    localPlaceholder: 'Cidade, UF',
    inicio: 'Início',
    fim: 'Fim',
    convidados: 'Convidados',
    convidadosPlaceholder: '0',
    cache: 'Valor do Cachê (R$)',
    cachePlaceholder: '0,00',
    entradaPct: 'Entrada (%)',
    entradaData: 'Data da Entrada',
    saldoData: 'Data do Saldo',
    itensInclusos: 'Itens Inclusos',
    observacoes: 'Observações',
    validade: 'Validade da Proposta',
    // Inline validation, read by screen readers through aria-describedby.
    invalidPct: 'Use um valor entre 0 e 100.',
    invalidAmount: 'Use um valor igual ou maior que zero.',
    // What the form starts with.
    defaults: {
      tipoEvento: 'Casamento',
      entradaPct: '50',
      itensInclusos: `• Banda completa com músicos profissionais
• Sistema de som de alta potência
• Iluminação profissional com moving heads
• Logística e transporte próprio
• Equipamento de backup`,
    },
    // The draft is kept in the browser between visits.
    draftRestored: 'Rascunho anterior recuperado.',
    clearDraft: 'Limpar formulário',
    unsavedWarning: 'A proposta não foi salva. Sair mesmo assim?',
  },
  preview: {
    step: '02 · Preview A4',
    label: 'Preview A4',
    print: 'Imprimir',
    generate: 'Gerar PDF',
    generating: 'Gerando...',
    download: 'Baixar PDF',
    pageBreak: 'Fim da página 1 — o restante sai na página 2',
    fileName: (contratante: string) => `Proposta-Freeband-${safeFileName(contratante) || 'cliente'}.pdf`,
    docTitle: (contratante: string) => `Proposta - ${contratante || 'Freeband'}`,
  },
  // The proposal document, shared by the HTML print layout and the PDF.
  doc: {
    kicker: 'Proposta Comercial',
    since: (year: number) => `Desde ${year}`,
    para: 'Proposta para',
    tipoEvento: 'Tipo de Evento',
    data: 'Data',
    local: 'Local',
    horario: 'Horário',
    horarioJoin: 'às',
    convidados: 'Convidados',
    pessoas: 'pessoas',
    investimento: 'Investimento',
    valorTotal: 'Valor Total',
    pagamento: 'Condições de Pagamento',
    entrada: 'Entrada',
    saldo: 'Saldo',
    ate: 'até',
    itens: 'Itens Inclusos',
    observacoes: 'Observações',
    validade: 'Proposta válida até',
    cnpj: 'CNPJ',
    empty: '—',
  },
};
