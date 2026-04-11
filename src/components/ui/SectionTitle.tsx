import { Eyebrow } from "./Eyebrow";

interface SectionTitleProps {
  children: React.ReactNode;
  eyebrow?: string;
  number?: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionTitle({
  children,
  eyebrow,
  number,
  subtitle,
  centered = false,
}: SectionTitleProps) {
  return (
    <header
      className={`mb-[clamp(2.5rem,5vi,4.5rem)] flex flex-col gap-6 ${
        centered ? "items-center text-center" : "items-start text-left"
      }`}
    >
      {eyebrow && <Eyebrow number={number}>{eyebrow}</Eyebrow>}
      <h2
        className="font-display leading-[0.92] -tracking-[0.02em] text-balance"
        style={{ fontSize: "var(--text-5xl)" }}
      >
        {children}
      </h2>
      {subtitle && (
        <p
          className={`max-w-[52ch] text-text-muted ${
            centered ? "text-center" : ""
          }`}
          style={{ fontSize: "var(--text-base)" }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
