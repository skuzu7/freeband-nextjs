interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'ink' | 'ink-raise' | 'ink-deep' | 'mesh' | 'transparent';
  pad?: 'lg' | 'xl' | 'hero';
}

const VARIANT_BG: Record<NonNullable<SectionProps['variant']>, string> = {
  ink: 'bg-bg',
  'ink-raise': 'bg-bg-raise',
  'ink-deep': 'bg-bg-high',
  mesh: 'mesh-bg',
  transparent: '',
};

const PAD_Y: Record<NonNullable<SectionProps['pad']>, string> = {
  lg: 'py-[clamp(4rem,8vi,8rem)]',
  xl: 'py-[clamp(6rem,12vi,12rem)]',
  hero: 'py-[clamp(7rem,14vi,14rem)]',
};

export function Section({
  id,
  children,
  className = '',
  variant = 'ink',
  pad = 'lg',
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative ${PAD_Y[pad]} ${VARIANT_BG[variant]} ${variant !== 'transparent' ? 'section-glow-top' : ''} ${className}`}
    >
      {children}
    </section>
  );
}
