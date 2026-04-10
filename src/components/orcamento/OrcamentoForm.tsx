"use client";

// src/components/orcamento/OrcamentoForm.tsx
// Controlled form used inside the token-protected /orcamento/[token] route.
// Emits a new OrcamentoData snapshot on every change so the adjacent preview
// and PDF can re-render reactively.
import type { OrcamentoData } from "@/types/orcamento";

interface OrcamentoFormProps {
  data: OrcamentoData;
  onChange: (data: OrcamentoData) => void;
}

const inputClasses =
  "w-full rounded border border-border bg-bg-card px-4 py-3 text-[0.95rem] text-white outline-none transition-colors focus:border-gold";
const labelClasses =
  "mb-1.5 block text-xs uppercase tracking-wider text-text-2";
const fieldClasses = "mb-5";

export function OrcamentoForm({ data, onChange }: OrcamentoFormProps) {
  function set(field: keyof OrcamentoData, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="p-8">
      <h2 className="mb-8 font-display text-2xl font-bold text-gold">
        Dados da Proposta
      </h2>

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
          className={`${inputClasses} cursor-pointer`}
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

      <div className="mb-5 grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Data do Evento</label>
          <input
            className={inputClasses}
            type="date"
            value={data.dataEvento}
            onChange={(e) => set("dataEvento", e.target.value)}
          />
        </div>
        <div>
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

      <div className="mb-5 grid grid-cols-3 gap-4">
        <div>
          <label className={labelClasses}>Início</label>
          <input
            className={inputClasses}
            type="time"
            value={data.horarioInicio}
            onChange={(e) => set("horarioInicio", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>Fim</label>
          <input
            className={inputClasses}
            type="time"
            value={data.horarioFim}
            onChange={(e) => set("horarioFim", e.target.value)}
          />
        </div>
        <div>
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

      <div className="mb-5 grid grid-cols-2 gap-4">
        <div>
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
        <div>
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
          className={`${inputClasses} min-h-[100px] resize-y`}
          value={data.itensInclusos}
          onChange={(e) => set("itensInclusos", e.target.value)}
        />
      </div>

      <div className={fieldClasses}>
        <label className={labelClasses}>Observações</label>
        <textarea
          className={`${inputClasses} min-h-[80px] resize-y`}
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
