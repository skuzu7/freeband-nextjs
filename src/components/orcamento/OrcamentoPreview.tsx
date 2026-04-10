import PrintLayout from "./PrintLayout";
import { OrcamentoData } from "@/types/orcamento";

interface Props {
  data: OrcamentoData;
  onPrint: () => void;
}

export default function OrcamentoPreview({ data, onPrint }: Props) {
  return (
    <div style={{ position: "sticky", top: "2rem" }}>
      {/* Print button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={onPrint}
          style={{
            padding: "0.75rem 2rem",
            background: "var(--color-gold)",
            color: "#000",
            fontWeight: 700,
            fontSize: "0.9rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
            borderRadius: "2px",
          }}
        >
          Baixar PDF
        </button>
      </div>

      {/* Preview container */}
      <div
        style={{
          border: "1px solid var(--color-border)",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            transformOrigin: "top left",
            transform: "scale(0.85)",
            width: "117.6%",
          }}
        >
          <PrintLayout data={data} />
        </div>
      </div>
    </div>
  );
}
