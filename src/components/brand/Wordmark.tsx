// src/components/brand/Wordmark.tsx
// The band's own wordmark, redrawn as vector.
//
// Source: a photograph of the band's stage backdrop — "freeband" in extruded
// red acrylic, a geometric monoline lowercase. Measuring that photograph gives
// the entire construction grid, and every glyph below is rebuilt on it out of
// circles, quarter-arcs and straight stems, which is how the original was
// drawn in the first place. Vector, so it stays sharp at 16px and at 16rem,
// and it costs no font file.
//
//   baseline        y = 200
//   x-height top    y = 100   (round letters are exactly one x-height wide)
//   ascender top    y =  73
//   stroke          19        (half-stroke 9.5 — every centreline is inset by it)
//   bowl            centreline r = 40.5 about (·, 150)
//   letterspacing   10
//
// Butt caps give the flat terminals for free: a stroke ends exactly on its
// endpoint, so a stem drawn to y=200 sits precisely on the baseline.
//
// The mark paints in `currentColor`. Set that to `text-red` wherever it stands
// in for the logo. The red belongs to the wordmark and the primary CTA only.
//
// GLYPHS is exported so the LED panel can light the same geometry in dots and
// the PDF can draw it with react-pdf's Svg/Path/Circle.

export interface Glyph {
  /** Advance origin on the 742-unit line. */
  x: number;
  /** Advance width. */
  w: number;
  /** SVG path data, drawn as a 19-unit stroke with butt caps. */
  d: string[];
  /** Whether the glyph carries the one-x-height bowl at (50, 150). */
  circle?: boolean;
}

/** The eight glyphs, in order, each with its own advance width. */
export const GLYPHS: Glyph[] = [
  // f — stem, then a quarter-arc hook to the ascender, plus the crossbar that
  // overhangs on the left exactly as it does on the backdrop.
  { x: 0, w: 44, d: ['M 9.5 200 L 9.5 117 A 34.5 34.5 0 0 1 44 82.5', 'M -8 109.5 L 40 109.5'] },
  // r — stem and shoulder.
  { x: 54, w: 41, d: ['M 9.5 200 L 9.5 141 A 31.5 31.5 0 0 1 41 109.5'] },
  // e — ring open at the lower right, bar just above centre.
  { x: 105, w: 100, d: ['M 90.3 153.5 A 40.5 40.5 0 1 0 73.2 183.2', 'M 10.1 143 L 89.9 143'] },
  { x: 215, w: 100, d: ['M 90.3 153.5 A 40.5 40.5 0 1 0 73.2 183.2', 'M 10.1 143 L 89.9 143'] },
  // b — ascending stem tangent to the bowl.
  { x: 325, w: 100, d: ['M 9.5 73 L 9.5 200'], circle: true },
  // a — bowl with a stem to the x-height only.
  { x: 435, w: 100, d: ['M 90.5 100 L 90.5 200'], circle: true },
  // n — stem, half-circle arch, stem.
  { x: 545, w: 87, d: ['M 9.5 200 L 9.5 143.5 A 34 34 0 0 1 77.5 143.5 L 77.5 200'] },
  // d — mirror of b.
  { x: 642, w: 100, d: ['M 90.5 73 L 90.5 200'], circle: true },
];

/** The construction grid, for anything that redraws the mark elsewhere. */
export const WORDMARK = {
  /** Left overhang of the f crossbar, folded into the viewBox so x starts at 0. */
  overhang: 8,
  stroke: 19,
  bowl: { cx: 50, cy: 150, r: 40.5 },
  viewBox: { x: 0, y: 73, width: 742 + 8, height: 127 },
} as const;

const VIEWBOX = `${WORDMARK.viewBox.x} ${WORDMARK.viewBox.y} ${WORDMARK.viewBox.width} ${WORDMARK.viewBox.height}`;

interface WordmarkProps {
  className?: string;
  /**
   * Accessible name. Omit inside an element that already has one (a link with
   * `aria-label`, say) and the mark is hidden from assistive tech instead.
   */
  title?: string;
}

export function Wordmark({ className = '', title }: WordmarkProps) {
  return (
    <svg
      viewBox={VIEWBOX}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      {title && <title>{title}</title>}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={WORDMARK.stroke}
        strokeLinecap="butt"
        transform={`translate(${WORDMARK.overhang},0)`}
      >
        {GLYPHS.map((glyph, i) => (
          <g key={i} transform={`translate(${glyph.x},0)`}>
            {glyph.circle && (
              <circle cx={WORDMARK.bowl.cx} cy={WORDMARK.bowl.cy} r={WORDMARK.bowl.r} />
            )}
            {glyph.d.map((d, j) => (
              <path key={j} d={d} />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}
