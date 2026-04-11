interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "ink" | "ink-raise" | "transparent";
}

const VARIANT_BG: Record<NonNullable<SectionProps["variant"]>, string> = {
  ink: "bg-bg",
  "ink-raise": "bg-bg-raise",
  transparent: "",
};

export function Section({
  id,
  children,
  className = "",
  variant = "ink",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative py-[clamp(5rem,10vi,10rem)] ${VARIANT_BG[variant]} ${className}`}
    >
      {children}
    </section>
  );
}
