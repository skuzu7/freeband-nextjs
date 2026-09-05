// src/design/color.ts
// Colour arithmetic shared by the contrast test, the LED canvas and the PDF
// theme: parse an oklch()/hex token, convert it to sRGB, measure WCAG
// contrast. Pure functions, no DOM.

export interface Rgba {
  /** 0..1 linear-light sRGB components. */
  r: number;
  g: number;
  b: number;
  /** 0..1 */
  alpha: number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function parseAlpha(raw: string | undefined): number {
  if (raw === undefined) return 1;
  const t = raw.trim();
  if (t.endsWith('%')) return clamp01(Number(t.slice(0, -1)) / 100);
  return clamp01(Number(t));
}

/** oklch(L% C H [/ a]) → linear sRGB. Out-of-gamut values are clipped. */
function oklchToLinear(input: string): Rgba {
  const m = /^oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+%?))?\s*\)$/i.exec(
    input.trim(),
  );
  if (!m) throw new Error(`Not an oklch() color: ${input}`);
  const L = Number(m[1]) / (m[1].includes('.') && Number(m[1]) <= 1 ? 1 : 100);
  const C = Number(m[2]);
  const H = (Number(m[3]) * Math.PI) / 180;
  const a = C * Math.cos(H);
  const b = C * Math.sin(H);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const mm = m_ ** 3;
  const s = s_ ** 3;

  return {
    r: clamp01(4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s),
    g: clamp01(-1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s),
    b: clamp01(-0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s),
    alpha: parseAlpha(m[4]),
  };
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  return clamp01(v);
}

function hexToLinear(input: string): Rgba {
  let hex = input.trim().slice(1);
  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split('')
      .map((ch) => ch + ch)
      .join('');
  }
  if (hex.length !== 6 && hex.length !== 8) throw new Error(`Not a hex color: ${input}`);
  const n = (i: number) => parseInt(hex.slice(i, i + 2), 16) / 255;
  return {
    r: srgbToLinear(n(0)),
    g: srgbToLinear(n(2)),
    b: srgbToLinear(n(4)),
    alpha: hex.length === 8 ? n(6) : 1,
  };
}

/** Parses `#rgb[a]`, `#rrggbb[aa]` or `oklch(...)` into linear sRGB. */
export function parseColor(input: string): Rgba {
  const t = input.trim();
  if (t.startsWith('#')) return hexToLinear(t);
  if (t.toLowerCase().startsWith('oklch(')) return oklchToLinear(t);
  throw new Error(`Unsupported color syntax: ${input}`);
}

/**
 * Alpha-composites `fg` over an opaque `bg` the way a browser does it: in
 * gamma-encoded sRGB, not linear light. Blending in linear space would make
 * translucent borders look far brighter than they render.
 */
export function composite(fg: Rgba, bg: Rgba): Rgba {
  const a = fg.alpha;
  const blend = (f: number, b: number) =>
    srgbToLinear(linearToSrgb(f) * a + linearToSrgb(b) * (1 - a));
  return { r: blend(fg.r, bg.r), g: blend(fg.g, bg.g), b: blend(fg.b, bg.b), alpha: 1 };
}

/** WCAG relative luminance of an opaque colour. */
export function luminance(c: Rgba): number {
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

/**
 * WCAG contrast ratio between a foreground (possibly translucent) and an
 * opaque background. Translucent foregrounds are composited first.
 */
export function contrastRatio(fg: string, bg: string): number {
  const back = parseColor(bg);
  const front = composite(parseColor(fg), back);
  const l1 = luminance(front);
  const l2 = luminance(back);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** `#rrggbb` for an opaque colour (alpha dropped). */
export function toHex(input: string): string {
  const c = parseColor(input);
  const h = (v: number) =>
    Math.round(linearToSrgb(v) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${h(c.r)}${h(c.g)}${h(c.b)}`;
}

/** `rgba(r, g, b, a)` string a canvas 2D context accepts everywhere. */
export function toRgba(input: string, alphaOverride?: number): string {
  const c = parseColor(input);
  const n = (v: number) => Math.round(linearToSrgb(v) * 255);
  return `rgba(${n(c.r)}, ${n(c.g)}, ${n(c.b)}, ${alphaOverride ?? c.alpha})`;
}

/** Linear interpolation between two colours in linear-light sRGB. */
export function mix(a: string, b: string, t: number): string {
  const ca = parseColor(a);
  const cb = parseColor(b);
  const k = clamp01(t);
  const n = (x: number, y: number) => Math.round(linearToSrgb(x + (y - x) * k) * 255);
  return `rgb(${n(ca.r, cb.r)}, ${n(ca.g, cb.g)}, ${n(ca.b, cb.b)})`;
}
