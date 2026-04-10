interface SectionTitleProps {
  children: React.ReactNode;
  light?: boolean;
}

export function SectionTitle({ children, light = false }: SectionTitleProps) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 700,
          color: "var(--color-white)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          lineHeight: 1.1,
        }}
      >
        {children}
      </h2>
      <div
        style={{
          width: "80px",
          height: "4px",
          backgroundColor: light
            ? "var(--color-gold-light)"
            : "var(--color-gold)",
          marginTop: "12px",
        }}
      />
    </div>
  );
}
