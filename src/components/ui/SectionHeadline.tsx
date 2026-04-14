import { Eyebrow } from '@/components/ui/Eyebrow';

interface SectionHeadlineProps {
  eyebrowNumber?: string;
  eyebrowLabel: string;
  eyebrowTone?: 'brand' | 'mono' | 'outline';
  prefix?: string;
  emphasis: string;
  suffix?: string;
  lead?: string;
  size?: 'lg' | 'xl';
}

const SIZE_FONT: Record<NonNullable<SectionHeadlineProps['size']>, string> = {
  lg: 'var(--text-5xl)',
  xl: 'var(--text-6xl)',
};

export function SectionHeadline({
  eyebrowNumber,
  eyebrowLabel,
  eyebrowTone = 'brand',
  prefix = '',
  emphasis,
  suffix = '',
  lead,
  size = 'lg',
}: SectionHeadlineProps) {
  return (
    <>
      <Eyebrow number={eyebrowNumber} tone={eyebrowTone}>
        {eyebrowLabel}
      </Eyebrow>
      <h2
        className="reveal-lead mt-6 font-display -tracking-[0.02em] text-balance max-w-3xl"
        style={{ fontSize: SIZE_FONT[size], lineHeight: 0.92 }}
      >
        {prefix}
        <span className="serif-italic text-brand">{emphasis}</span>
        {suffix}
      </h2>
      {lead && (
        <p
          className="reveal-mid mt-6 max-w-[54ch] text-text-muted"
          style={{ fontSize: 'var(--text-base)' }}
        >
          {lead}
        </p>
      )}
    </>
  );
}
