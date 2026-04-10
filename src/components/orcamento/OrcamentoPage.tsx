"use client";

import { useState } from "react";
import { OrcamentoForm } from "./OrcamentoForm";
import OrcamentoPreview from "./OrcamentoPreview";
import { OrcamentoData, defaultOrcamento } from "@/types/orcamento";

export default function OrcamentoPage() {
  const [data, setData] = useState<OrcamentoData>(defaultOrcamento);

  function handlePrint() {
    window.print();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        color: "var(--color-white)",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--color-border)",
          padding: "1.5rem 2rem",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--color-text-2)",
            }}
          >
            Internacional Freeband
          </div>
          <div
            style={{
              fontSize: "1.25rem",
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontWeight: 700,
            }}
          >
            Gerador de Proposta
          </div>
        </div>
        <a
          href="/"
          style={{
            fontSize: "0.8rem",
            color: "var(--color-text-2)",
            textDecoration: "none",
          }}
        >
          ← Voltar ao site
        </a>
      </div>

      {/* Split layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
          minHeight: "calc(100vh - 80px)",
        }}
        className="orcamento-grid"
      >
        {/* Form side */}
        <div
          style={{
            borderRight: "1px solid var(--color-border)",
            overflowY: "auto",
            maxHeight: "calc(100vh - 80px)",
          }}
        >
          <OrcamentoForm data={data} onChange={setData} />
        </div>

        {/* Preview side */}
        <div
          style={{
            padding: "2rem",
            overflowY: "auto",
            maxHeight: "calc(100vh - 80px)",
            background: "var(--color-bg-2)",
          }}
        >
          <OrcamentoPreview data={data} onPrint={handlePrint} />
        </div>
      </div>
    </div>
  );
}
