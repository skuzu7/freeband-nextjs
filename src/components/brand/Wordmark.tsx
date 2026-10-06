// src/components/brand/Wordmark.tsx
// The band's own wordmark, drawn as vector from the geometry in
// src/design/wordmark.ts (the construction grid is documented there). Sharp
// at 16px and at 16rem, and it costs no font file. Never set it in a font.
//
// The mark paints in `currentColor`. Set that to `text-red` wherever it stands
// in for the logo. The red belongs to the wordmark and the primary CTA only.
import { useId } from 'react';
import { GLYPHS, WORDMARK, WORDMARK_VIEWBOX } from '@/design/wordmark';

interface WordmarkProps {
  className?: string;
  /**
   * Accessible name. Omit inside an element that already has one (a link with
   * `aria-label`, say) and the mark is hidden from assistive tech instead.
   */
  title?: string;
  /**
   * When true, renders with the authentic extruded red acrylic stage lighting:
   * multi-stop gradient, 3D side extrusion and specular top highlight.
   */
  acrylic?: boolean;
  /**
   * When true, adds a soft ambient stage glow filter around the mark.
   */
  glow?: boolean;
}

/** The eight glyphs, once: every layer of the mark is this same drawing. */
function Glyphs() {
  return GLYPHS.map((glyph, i) => (
    <g key={i} transform={`translate(${glyph.x},0)`}>
      {glyph.circle && <circle cx={WORDMARK.bowl.cx} cy={WORDMARK.bowl.cy} r={WORDMARK.bowl.r} />}
      {glyph.d.map((d, j) => (
        <path key={j} d={d} />
      ))}
    </g>
  ));
}

export function Wordmark({ className = '', title, acrylic = false, glow = false }: WordmarkProps) {
  const reactId = useId();
  const baseId = reactId.replace(/:/g, '');
  const gradId = `wm-grad-${baseId}`;
  const glowId = `wm-glow-${baseId}`;

  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      {title && <title>{title}</title>}
      {/* The acrylic's colours are the red ramp of the tokens, read as CSS
          variables: a presentation attribute cannot hold var(), a style can. */}
      {acrylic && (
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'var(--color-red-400)' }} />
            <stop offset="25%" style={{ stopColor: 'var(--color-red-500)' }} />
            <stop offset="70%" style={{ stopColor: 'var(--color-red-600)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--color-red-800)' }} />
          </linearGradient>
          {glow && (
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodOpacity="0.85" style={{ floodColor: 'var(--color-night-950)' }} />
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodOpacity="0.45" style={{ floodColor: 'var(--color-red-500)' }} />
            </filter>
          )}
        </defs>
      )}

      {/* 3D extrusion underneath when acrylic is active */}
      {acrylic && (
        <g
          fill="none"
          strokeWidth={WORDMARK.stroke}
          strokeLinecap="butt"
          transform={`translate(${WORDMARK.overhang + 1.5}, 2.5)`}
          opacity="0.9"
          style={{ stroke: 'var(--color-red-900)' }}
        >
          <Glyphs />
        </g>
      )}

      {/* Main glyphs face */}
      <g
        fill="none"
        stroke={acrylic ? `url(#${gradId})` : 'currentColor'}
        strokeWidth={WORDMARK.stroke}
        strokeLinecap="butt"
        transform={`translate(${WORDMARK.overhang},0)`}
        filter={acrylic && glow ? `url(#${glowId})` : undefined}
      >
        <Glyphs />
      </g>

      {/* Subtle top specular highlight */}
      {acrylic && (
        <g
          fill="none"
          strokeWidth={2}
          strokeLinecap="butt"
          transform={`translate(${WORDMARK.overhang}, -0.75)`}
          opacity="0.35"
          style={{ stroke: 'var(--color-red-200)' }}
        >
          <Glyphs />
        </g>
      )}
    </svg>
  );
}
