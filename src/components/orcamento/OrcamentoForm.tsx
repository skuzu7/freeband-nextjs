"use client";

import { OrcamentoData } from "@/types/orcamento";

interface Props {
  data: OrcamentoData;
  onChange: (data: OrcamentoData) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "#1A1A1A",
  border: "1px solid #1F1F1F",
  color: "#fff",
  borderRadius: "4px",
  fontSize: "0.95rem",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.375rem",
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#999",
};

const fieldStyle: React.CSSProperties = {
  marginBottom: "1.25rem",
};

export default function OrcamentoForm({ data, onChange }: Props) {
  function set(field: keyof OrcamentoData, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} style={{ padding: "2rem" }}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontFamily: "var(--font-display)",
          color: "var(--color-gold)",
          marginBottom: "2rem",
          fontWeight: 700,
        }}
      >
        Dados da Proposta
      </h2>

      <div style={fieldStyle}>
        <label style={labelStyle}>Nome do Contratante</label>
        <input
          style={inputStyle}
          type="text"
          value={data.contratante}
          onChange={(e) => set("contratante", e.target.value)}
          placeholder="Nome completo"
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Tipo de Evento</label>
        <select
          style={{ ...inputStyle, cursor: "pointer" }}
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <div>
          <label style={labelStyle}>Data do Evento</label>
          <input
            style={inputStyle}
            type="date"
            value={data.dataEvento}
            onChange={(e) => set("dataEvento", e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Local / Cidade</label>
          <input
            style={inputStyle}
            type="text"
            value={data.local}
            onChange={(e) => set("local", e.target.value)}
            placeholder="Cidade, UF"
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <div>
          <label style={labelStyle}>Início</label>
          <input
            style={inputStyle}
            type="time"
            value={data.horarioInicio}
            onChange={(e) => set("horarioInicio", e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Fim</label>
          <input
            style={inputStyle}
            type="time"
            value={data.horarioFim}
            onChange={(e) => set("horarioFim", e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Convidados</label>
          <input
            style={inputStyle}
            type="number"
            value={data.numConvidados}
            onChange={(e) => set("numConvidados", e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Valor do Cachê (R$)</label>
        <input
          style={inputStyle}
          type="number"
          value={data.cache}
          onChange={(e) => set("cache", e.target.value)}
          placeholder="0,00"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <div>
          <label style={labelStyle}>Entrada (%)</label>
          <input
            style={inputStyle}
            type="number"
            min="0"
            max="100"
            value={data.entradaPct}
            onChange={(e) => set("entradaPct", e.target.value)}
            placeholder="50"
          />
        </div>
        <div>
          <label style={labelStyle}>Data da Entrada</label>
          <input
            style={inputStyle}
            type="date"
            value={data.entradaData}
            onChange={(e) => set("entradaData", e.target.value)}
          />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Data do Saldo</label>
        <input
          style={inputStyle}
          type="date"
          value={data.saldoData}
          onChange={(e) => set("saldoData", e.target.value)}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Itens Inclusos</label>
        <textarea
          style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
          value={data.itensInclusos}
          onChange={(e) => set("itensInclusos", e.target.value)}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Observações</label>
        <textarea
          style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
          value={data.observacoes}
          onChange={(e) => set("observacoes", e.target.value)}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Validade da Proposta</label>
        <input
          style={inputStyle}
          type="date"
          value={data.validade}
          onChange={(e) => set("validade", e.target.value)}
        />
      </div>
    </form>
  );
}
