import { OrcamentoData } from "@/types/orcamento";
import {
  formatCurrency,
  formatDate,
  calcEntrada,
  calcSaldo,
} from "@/lib/format";

interface Props {
  data: OrcamentoData;
}

export default function PrintLayout({ data }: Props) {
  const entradaStr = calcEntrada(data.cache, data.entradaPct);
  const saldoStr = calcSaldo(data.cache, data.entradaPct);
  const hasCache = data.cache !== "";
  const hasEntrada = hasCache && data.entradaPct !== "";

  return (
    <div
      id="print-area"
      style={{
        background: "#fff",
        color: "#1a1a1a",
        fontFamily: "Georgia, serif",
        padding: "40px",
        minHeight: "297mm",
        width: "210mm",
        maxWidth: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "3px solid #C9A84C",
          paddingBottom: "24px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#888",
                marginBottom: "4px",
              }}
            >
              Proposta Comercial
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.1,
              }}
            >
              Internacional
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#C9A84C",
                lineHeight: 1.1,
              }}
            >
              Freeband
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: "12px", color: "#666" }}>
            <div>Desde 1969</div>
            <div>Trabiju, SP</div>
            <div style={{ marginTop: "4px", color: "#C9A84C" }}>
              (16) 99171-2996
            </div>
          </div>
        </div>
      </div>

      {/* Contratante */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#888",
            marginBottom: "4px",
          }}
        >
          Proposta para
        </div>
        <div style={{ fontSize: "22px", fontWeight: 600, color: "#1a1a1a" }}>
          {data.contratante || "—"}
        </div>
      </div>

      {/* Event info grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          background: "#f9f7f2",
          border: "1px solid #e8e0ce",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        {[
          ["Tipo de Evento", data.tipoEvento || "—"],
          ["Data", data.dataEvento ? formatDate(data.dataEvento) : "—"],
          ["Local", data.local || "—"],
          [
            "Horário",
            data.horarioInicio && data.horarioFim
              ? `${data.horarioInicio} às ${data.horarioFim}`
              : "—",
          ],
          [
            "Convidados",
            data.numConvidados ? `${data.numConvidados} pessoas` : "—",
          ],
        ].map(([label, value]) => (
          <div key={label}>
            <div
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#888",
                marginBottom: "2px",
              }}
            >
              {label}
            </div>
            <div style={{ fontSize: "14px", fontWeight: 500 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Investment */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#C9A84C",
            borderBottom: "1px solid #e8e0ce",
            paddingBottom: "8px",
            marginBottom: "16px",
            fontWeight: 600,
          }}
        >
          Investimento
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <span style={{ fontSize: "14px", color: "#444" }}>Valor Total</span>
          <span style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a" }}>
            {hasCache ? formatCurrency(data.cache) : "—"}
          </span>
        </div>
      </div>

      {/* Payment conditions */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#C9A84C",
            borderBottom: "1px solid #e8e0ce",
            paddingBottom: "8px",
            marginBottom: "16px",
            fontWeight: 600,
          }}
        >
          Condições de Pagamento
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <div
            style={{
              background: "#f9f7f2",
              padding: "12px",
              border: "1px solid #e8e0ce",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                color: "#888",
                marginBottom: "4px",
              }}
            >
              Entrada ({data.entradaPct || 0}%)
            </div>
            <div style={{ fontSize: "18px", fontWeight: 700 }}>
              {hasEntrada ? entradaStr : "—"}
            </div>
            {data.entradaData && (
              <div
                style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}
              >
                até {formatDate(data.entradaData)}
              </div>
            )}
          </div>
          <div
            style={{
              background: "#f9f7f2",
              padding: "12px",
              border: "1px solid #e8e0ce",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                color: "#888",
                marginBottom: "4px",
              }}
            >
              Saldo ({data.entradaPct ? 100 - Number(data.entradaPct) : 0}%)
            </div>
            <div style={{ fontSize: "18px", fontWeight: 700 }}>
              {hasEntrada ? saldoStr : "—"}
            </div>
            {data.saldoData && (
              <div
                style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}
              >
                até {formatDate(data.saldoData)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Itens inclusos */}
      {data.itensInclusos && (
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#C9A84C",
              borderBottom: "1px solid #e8e0ce",
              paddingBottom: "8px",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            Itens Inclusos
          </div>
          <div
            style={{
              fontSize: "13px",
              lineHeight: 1.8,
              color: "#333",
              whiteSpace: "pre-line",
            }}
          >
            {data.itensInclusos}
          </div>
        </div>
      )}

      {/* Observações */}
      {data.observacoes && (
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#C9A84C",
              borderBottom: "1px solid #e8e0ce",
              paddingBottom: "8px",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            Observações
          </div>
          <div
            style={{
              fontSize: "13px",
              lineHeight: 1.8,
              color: "#333",
              whiteSpace: "pre-line",
            }}
          >
            {data.observacoes}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          borderTop: "2px solid #C9A84C",
          paddingTop: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontSize: "11px",
          color: "#888",
        }}
      >
        <div>
          {data.validade && (
            <span>Proposta válida até {formatDate(data.validade)}</span>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div>Internacional Freeband</div>
          <div style={{ color: "#C9A84C" }}>(16) 99171-2996</div>
        </div>
      </div>
    </div>
  );
}
