interface KineticWordProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Renders a word with Fraunces variable-font axes (`wght`, `opsz`, `SOFT`)
 * animated via scroll-driven CSS. Server component — no hydration, no JS.
 * Animation fallback: static render in browsers without scroll-driven
 * animations or variable font support.
 */
export function KineticWord({ children, className = "" }: KineticWordProps) {
  return (
    <span
      className={`text-kinetic block text-brand ${className}`}
      style={{ fontSize: "var(--text-hero)" }}
    >
      {children}
    </span>
  );
}
