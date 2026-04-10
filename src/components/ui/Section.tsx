interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, children, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative py-20 md:py-28 lg:py-32 ${className}`}
    >
      {children}
    </section>
  );
}
