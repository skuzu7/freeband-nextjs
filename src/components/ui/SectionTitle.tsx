interface SectionTitleProps {
  children: React.ReactNode;
  eyebrow?: string;
  centered?: boolean;
}

export function SectionTitle({
  children,
  eyebrow,
  centered = false,
}: SectionTitleProps) {
  return (
    <div className={`mb-16 ${centered ? "text-center flex flex-col items-center" : "text-left"}`}>
      {eyebrow && (
        <p className="text-gold text-[0.65rem] font-bold uppercase tracking-[0.4em] mb-4">
          <span className="flex items-center gap-3">
            {!centered && <span className="h-[1px] w-8 bg-gold/40" />}
            {eyebrow}
            {centered && <span className="h-[1px] w-8 bg-gold/40" />}
          </span>
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight">
        {children}
      </h2>
      <div className="mt-6 flex items-center gap-2">
        <div className="h-1 w-12 bg-gold" />
        <div className="h-1 w-1 bg-gold rotate-45" />
      </div>
    </div>
  );
}
