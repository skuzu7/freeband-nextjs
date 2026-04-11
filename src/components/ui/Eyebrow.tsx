interface EyebrowProps {
  children: React.ReactNode;
  number?: string;
  tone?: "brand" | "mono" | "outline";
  className?: string;
}

const TONE_LABEL: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  brand: "eyebrow text-text-muted",
  mono: "font-mono text-[0.62rem] uppercase tracking-[0.32em] text-text-muted",
  outline:
    "font-mono text-[0.62rem] uppercase tracking-[0.32em] text-transparent [-webkit-text-stroke:1px_var(--color-border-strong)]",
};

const TONE_BAR: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  brand: "bg-brand",
  mono: "bg-brand",
  outline: "bg-border-strong",
};

export function Eyebrow({
  children,
  number,
  tone = "brand",
  className = "",
}: EyebrowProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        aria-hidden
        className={`inline-block h-px w-8 ${TONE_BAR[tone]}`}
      />
      {number && (
        <span className="font-mono text-[0.7rem] text-brand tabular-nums">
          {number}
        </span>
      )}
      <span className={TONE_LABEL[tone]}>{children}</span>
    </div>
  );
}
