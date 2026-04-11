"use client";

// Controlled form used inside the token-protected /orcamento/[token] route.
// Emits a new OrcamentoData snapshot on every change so the adjacent preview
// and PDF can re-render reactively. Paper-themed.
import type { OrcamentoData } from "@/types/orcamento";

interface OrcamentoFormProps {
  data: OrcamentoData;
  onChange: (data: OrcamentoData) => void;
}

const inputClasses =
  "w-full border border-border bg-bg-high px-4 py-3 text-[0.95rem] text-text outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-brand)_22%,transparent)]";
const labelClasses =
  "mb-2 block font-mono text-[0.62rem] uppercase tracking-[0.25em] text-text-muted";
const fieldClasses = "mb-6 flex flex-col";

export function OrcamentoForm({ data, onChange }: OrcamentoFormProps) {
  function set(field: keyof OrcamentoData, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="p-[clamp(1.5rem,3vi,3rem)]"
    >
      <header className="mb-10 flex flex-col gap-3 border-b border-border pb-6">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-brand">
          01 · Formulário
        </span>
        <h2
          className="font-display -tracking-[0.02em] text-text"
          style={{ fontSize: "var(--text-3xl)", lineHeight: 0.95 }}
        >
          Dados da <span className="serif-italic text-brand">proposta</span>
        </h2>
      </header>

      <div className={fieldClasses}>
        <label className={labelClasses}>Nome do Contratante</label>
        <input
          className={inputClasses}
          type="text"
          value={data.contratante}
          onChange={(e) => set("contratante", e.target.value)}
          placeholder="Nome completo"
        />
      </div>

      <div className={fieldClasses}>
        <label className={labelClasses}>Tipo de Evento</label>
        <select
          className={`${inputClasses} cursor-pointer appearance-none`}
          value={data.tipoEvento}
          onChange={(e) => set("tipoEvento", e.target.value)}
        >
          <option value="">Selecione...</option>
          <option>Casamento</option>
          <option>Formatura</option>
          <option>Evento Corporativo</option>
          <option>Festa Premium</option>
          <option>Show Municipal</option>
          <option>Outro</option>
        </select>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className={labelClasses}>Data do Evento</label>
          <input
            className={inputClasses}
            type="date"
            value={data.dataEvento}
            onChange={(e) => set("dataEvento", e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClasses}>Local / Cidade</label>
          <input
            className={inputClasses}
            type="text"
            value={data.local}
            onChange={(e) => set("local", e.target.value)}
            placeholder="Cidade, UF"
          />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col">
          <label className={labelClasses}>Início</label>
          <input
            className={inputClasses}
            type="time"
            value={data.horarioInicio}
            onChange={(e) => set("horarioInicio", e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClasses}>Fim</label>
          <input
            className={inputClasses}
            type="time"
            value={data.horarioFim}
            onChange={(e) => set("horarioFim", e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClasses}>Convidados</label>
          <input
            className={inputClasses}
            type="number"
            value={data.numConvidados}
            onChange={(e) => set("numConvidados", e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className={fieldClasses}>
        <label className={labelClasses}>Valor do Cachê (R$)</label>
        <input
          className={inputClasses}
          type="number"
          value={data.cache}
          onChange={(e) => set("cache", e.target.value)}
          placeholder="0,00"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className={labelClasses}>Entrada (%)</label>
          <input
            className={inputClasses}
            type="number"
            min="0"
            max="100"
            value={data.entradaPct}
            onChange={(e) => set("entradaPct", e.target.value)}
            placeholder="50"
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClasses}>Data da Entrada</label>
          <input
            className={inputClasses}
            type="date"
            value={data.entradaData}
            onChange={(e) => set("entradaData", e.target.value)}
          />
        </div>
      </div>

      <div className={fieldClasses}>
        <label className={labelClasses}>Data do Saldo</label>
        <input
          className={inputClasses}
          type="date"
          value={data.saldoData}
          onChange={(e) => set("saldoData", e.target.value)}
        />
      </div>

      <div className={fieldClasses}>
        <label className={labelClasses}>Itens Inclusos</label>
        <textarea
          className={`${inputClasses} min-h-[100px]`}
          style={{ fieldSizing: "content" } as React.CSSProperties}
          value={data.itensInclusos}
          onChange={(e) => set("itensInclusos", e.target.value)}
        />
      </div>

      <div className={fieldClasses}>
        <label className={labelClasses}>Observações</label>
        <textarea
          className={`${inputClasses} min-h-[80px]`}
          style={{ fieldSizing: "content" } as React.CSSProperties}
          value={data.observacoes}
          onChange={(e) => set("observacoes", e.target.value)}
        />
      </div>

      <div className={fieldClasses}>
        <label className={labelClasses}>Validade da Proposta</label>
        <input
          className={inputClasses}
          type="date"
          value={data.validade}
          onChange={(e) => set("validade", e.target.value)}
        />
      </div>
    </form>
  );
}
