interface SectionTitleProps {
  children: React.ReactNode;
  light?: boolean;
  eyebrow?: string;
}

export function SectionTitle({
  children,
  light = false,
  eyebrow,
}: SectionTitleProps) {
  return (
    <div className="mb-10">
      {eyebrow ? (
        <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-gold">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-4xl font-bold uppercase leading-tight tracking-wider text-white md:text-5xl lg:text-6xl">
        {children}
      </h2>
      <div className={`mt-3 h-1 w-20 ${light ? "bg-gold-light" : "bg-gold"}`} />
    </div>
  );
}
