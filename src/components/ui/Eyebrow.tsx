interface EyebrowProps {
  children: React.ReactNode;
  number?: string;
  className?: string;
}

export function Eyebrow({ children, number, className = "" }: EyebrowProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        aria-hidden
        className="inline-block h-px w-8 bg-brand"
      />
      {number && (
        <span className="font-mono text-[0.7rem] text-brand tabular-nums">
          {number}
        </span>
      )}
      <span className="eyebrow text-text-muted">{children}</span>
    </div>
  );
}
