'use client';

// src/components/orcamento/Form.tsx
// The controlled form. Every change emits a whole OrcamentoData snapshot, so
// the preview and the PDF re-render from the same object. Labels and options
// come from src/data/copy/orcamento.ts.
import type { CSSProperties, ReactNode } from 'react';
import { orcamento } from '@/data/copy/orcamento';
import type { OrcamentoData } from '@/types/orcamento';

interface FormProps {
  data: OrcamentoData;
  onChange: (data: OrcamentoData) => void;
}

const inputClass =
  'transition-quick w-full rounded-sm border border-line bg-surface-high px-3.5 py-2.5 text-base text-ink outline-none placeholder:text-ink-low focus:border-led';
const labelClass = 'label-caps mb-2 block text-ink-muted';
const growWithContent = { fieldSizing: 'content' } as CSSProperties;

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function Form({ data, onChange }: FormProps) {
  const set = (field: keyof OrcamentoData) => (e: { target: { value: string } }) =>
    onChange({ ...data, [field]: e.target.value });
  const f = orcamento.form;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
      <Field id="contratante" label={f.contratante}>
        <input
          id="contratante"
          className={inputClass}
          type="text"
          value={data.contratante}
          onChange={set('contratante')}
          placeholder={f.contratantePlaceholder}
          autoComplete="off"
        />
      </Field>

      <Field id="tipo-evento" label={f.tipoEvento}>
        <select
          id="tipo-evento"
          className={`${inputClass} cursor-pointer`}
          value={data.tipoEvento}
          onChange={set('tipoEvento')}
        >
          <option value="">{f.tipoEventoPlaceholder}</option>
          {f.tiposEvento.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="data-evento" label={f.dataEvento}>
          <input id="data-evento" className={inputClass} type="date" value={data.dataEvento} onChange={set('dataEvento')} />
        </Field>
        <Field id="local-evento" label={f.local}>
          <input
            id="local-evento"
            className={inputClass}
            type="text"
            value={data.local}
            onChange={set('local')}
            placeholder={f.localPlaceholder}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field id="horario-inicio" label={f.inicio}>
          <input id="horario-inicio" className={inputClass} type="time" value={data.horarioInicio} onChange={set('horarioInicio')} />
        </Field>
        <Field id="horario-fim" label={f.fim}>
          <input id="horario-fim" className={inputClass} type="time" value={data.horarioFim} onChange={set('horarioFim')} />
        </Field>
        <Field id="convidados" label={f.convidados}>
          <input
            id="convidados"
            className={inputClass}
            type="number"
            min="0"
            inputMode="numeric"
            value={data.numConvidados}
            onChange={set('numConvidados')}
            placeholder="0"
          />
        </Field>
      </div>

      <Field id="cache" label={f.cache}>
        <input
          id="cache"
          className={inputClass}
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={data.cache}
          onChange={set('cache')}
          placeholder={f.cachePlaceholder}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field id="entrada-pct" label={f.entradaPct}>
          <input
            id="entrada-pct"
            className={inputClass}
            type="number"
            min="0"
            max="100"
            inputMode="numeric"
            value={data.entradaPct}
            onChange={set('entradaPct')}
          />
        </Field>
        <Field id="entrada-data" label={f.entradaData}>
          <input id="entrada-data" className={inputClass} type="date" value={data.entradaData} onChange={set('entradaData')} />
        </Field>
        <Field id="saldo-data" label={f.saldoData}>
          <input id="saldo-data" className={inputClass} type="date" value={data.saldoData} onChange={set('saldoData')} />
        </Field>
      </div>

      <Field id="itens-inclusos" label={f.itensInclusos}>
        <textarea
          id="itens-inclusos"
          className={`${inputClass} min-h-[7rem] leading-relaxed`}
          style={growWithContent}
          value={data.itensInclusos}
          onChange={set('itensInclusos')}
        />
      </Field>

      <Field id="observacoes" label={f.observacoes}>
        <textarea
          id="observacoes"
          className={`${inputClass} min-h-[5rem] leading-relaxed`}
          style={growWithContent}
          value={data.observacoes}
          onChange={set('observacoes')}
        />
      </Field>

      <Field id="validade" label={f.validade}>
        <input id="validade" className={inputClass} type="date" value={data.validade} onChange={set('validade')} />
      </Field>
    </form>
  );
}
