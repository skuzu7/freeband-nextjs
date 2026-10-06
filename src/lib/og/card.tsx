// src/lib/og/card.tsx
// The share card: what a link to the site looks like in WhatsApp, on Instagram
// or in a search result. 1200×630, drawn by next/og (Satori + resvg) from the
// same sources as the site itself — the colour tokens, the wordmark's
// geometry, the Outfit files in public/fonts — so it cannot drift from the
// identity. Each route's opengraph-image.tsx is a thin caller of ogCard().
//
// Satori lays out with flexbox only and hands every <svg> to the rasteriser
// as it is, so the wall of dots and the acrylic mark are plain SVG and the
// rest is flex boxes. A photograph is printed whole: its box is computed from
// the file's own aspect, never the other way round.
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { ImageResponse } from 'next/og';
import { bandInfo } from '@/data/band';
import { site } from '@/data/copy/site';
import { ratioOf, type Photo } from '@/data/media/paths';
import { toHex } from '@/design/color';
import { tokens, type PaletteName } from '@/design/tokens';
import { WORDMARK, wordmarkPaths } from '@/design/wordmark';
import { dotsPath } from '@/lib/led/svg';

/** Every card is the size the networks ask for. */
export const ogSize = { width: 1200, height: 630 };
/** ImageResponse renders PNG and nothing else. */
export const ogContentType = 'image/png';

export interface OgCard {
  /** The route's title, set large. */
  title: string;
  /** One line of support under it. */
  line: string;
  /** A photograph printed whole, at its own aspect, beside the text. */
  photo?: Pick<Photo, 'src' | 'aspect'>;
}

/**
 * The entry of a media collection that prints `src`. Going through the
 * collection, not the bare path, hands the card the aspect the media test
 * checked against the file — and a photograph that left the collection fails
 * the build here instead of leaving a card without its picture.
 */
export function photoBySrc<T extends Photo>(collection: readonly T[], src: string): T {
  const photo = collection.find((p) => p.src === src);
  if (!photo) throw new Error(`ogCard: no photograph "${src}" in the collection`);
  return photo;
}

/** Alt text of a route's card: the title it is shared under, then what its photograph shows. */
export function ogAlt(title: string, photo: Pick<Photo, 'alt'>): string {
  return `${site.seo.titleTemplate.replace(/%s/g, title)}. ${photo.alt}.`;
}

const hex = (name: PaletteName) => toHex(tokens.palette[name]);

const color = {
  ground: hex('night-950'),
  frame: hex('night-800'),
  ink: hex('ink-50'),
  muted: hex('ink-300'),
  led: hex('led-500'),
  redSide: hex('red-900'),
  redShine: hex('red-200'),
};

// ── The wall ───────────────────────────────────────────────────────────────

/** Distance between dots, in px. The card is a whole number of cells. */
const PITCH = 15;
const COLS = ogSize.width / PITCH;
const ROWS = ogSize.height / PITCH;

/** A dot at each brightness the wall has: unlit first, then the ramp up. */
const DOT_LEVELS: { color: string; radius: number }[] = [
  { color: hex('led-900'), radius: 1.5 },
  { color: hex('led-700'), radius: 2 },
  { color: hex('led-700'), radius: 2.7 },
  { color: hex('led-500'), radius: 3.3 },
  { color: hex('led-300'), radius: 3.9 },
  { color: hex('led-200'), radius: 4.5 },
];

/** An ellipse of light on the wall, in px: brightest at the centre, out at the rim. */
interface Pool {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

/** The wall's dots sorted by brightness under `pool`: one path per level. */
function wallLevels(pool: Pool): string[] {
  const dots: [number, number][][] = DOT_LEVELS.map(() => []);
  const top = DOT_LEVELS.length - 1;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const dx = ((col + 0.5) * PITCH - pool.cx) / pool.rx;
      const dy = ((row + 0.5) * PITCH - pool.cy) / pool.ry;
      const t = Math.max(0, 1 - Math.hypot(dx, dy));
      // Smoothstep: the pool has a body and a soft rim, like light on a panel.
      dots[Math.round(t * t * (3 - 2 * t) * top)].push([col, row]);
    }
  }
  return dots.map(dotsPath);
}

function Wall({ pool }: { pool: Pool }) {
  return (
    <svg
      width={ogSize.width}
      height={ogSize.height}
      viewBox={`0 0 ${COLS} ${ROWS}`}
      style={{ position: 'absolute', left: 0, top: 0 }}
    >
      <g fill="none" strokeLinecap="round" transform="translate(0.5 0.5)">
        {wallLevels(pool).map((d, level) =>
          d ? (
            <path
              key={level}
              d={d}
              stroke={DOT_LEVELS[level].color}
              strokeWidth={(DOT_LEVELS[level].radius * 2) / PITCH}
            />
          ) : null,
        )}
      </g>
    </svg>
  );
}

// ── The mark ───────────────────────────────────────────────────────────────

/** Room kept around the mark's box for its shadow and extrusion, in wordmark units. */
const MARK_MARGIN = 16;

/**
 * The eight glyphs once, shifted by (dx, dy): every layer of the acrylic is
 * this drawing. A plain function, not a component — Satori accepts only
 * intrinsic elements inside an <svg>.
 */
function glyphs(dx = 0, dy = 0) {
  return wordmarkPaths().map((glyph, i) => (
    <g key={i} transform={`translate(${glyph.x + dx} ${dy})`}>
      {glyph.d.map((d, j) => (
        <path key={j} d={d} />
      ))}
    </g>
  ));
}

/**
 * The wordmark as the backdrop's red acrylic, `width` px wide: a shadow that
 * lifts it off the lit wall, the extruded side, the face under light from
 * above, and the specular line. The same layers as components/brand/Wordmark,
 * with the gradient in user space so one ramp runs down the whole sign.
 */
function Acrylic({ width }: { width: number }) {
  const { viewBox, stroke } = WORDMARK;
  const scale = width / viewBox.width;
  const height = viewBox.height * scale;
  const box = {
    x: viewBox.x - MARK_MARGIN,
    y: viewBox.y - MARK_MARGIN,
    width: viewBox.width + 2 * MARK_MARGIN,
    height: viewBox.height + 2 * MARK_MARGIN,
  };
  return (
    <div style={{ display: 'flex', position: 'relative', width, height }}>
      <svg
        width={box.width * scale}
        height={box.height * scale}
        viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
        style={{ position: 'absolute', left: -MARK_MARGIN * scale, top: -MARK_MARGIN * scale }}
      >
        <defs>
          <linearGradient
            id="acrylic"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1={viewBox.y}
            x2="0"
            y2={viewBox.y + viewBox.height}
          >
            <stop offset="0" stopColor={hex('red-400')} />
            <stop offset="0.25" stopColor={hex('red-500')} />
            <stop offset="0.7" stopColor={hex('red-600')} />
            <stop offset="1" stopColor={hex('red-800')} />
          </linearGradient>
        </defs>
        <g fill="none" strokeLinejoin="round">
          <g stroke={color.ground} strokeWidth={stroke + 18} strokeLinecap="round" opacity="0.45">
            {glyphs()}
          </g>
          <g stroke={color.ground} strokeWidth={stroke + 8} strokeLinecap="round" opacity="0.6">
            {glyphs(0, 2)}
          </g>
          <g stroke={color.redSide} strokeWidth={stroke} strokeLinecap="butt" opacity="0.9">
            {glyphs(1.5, 2.5)}
          </g>
          <g stroke="url(#acrylic)" strokeWidth={stroke} strokeLinecap="butt">
            {glyphs()}
          </g>
          <g stroke={color.redShine} strokeWidth="2" strokeLinecap="butt" opacity="0.35">
            {glyphs(0, -0.75)}
          </g>
        </g>
      </svg>
    </div>
  );
}

/** "INTERNACIONAL" in caps, trailed by one row of the panel. */
function BrandLine({ size, rule }: { size: number; rule: number }) {
  const step = 8;
  const dots = Array.from({ length: Math.floor(rule / step) }, (_, i): [number, number] => [i * step + 2, 2]);
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          fontSize: size,
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: size * 0.18,
          textTransform: 'uppercase',
          color: color.muted,
        }}
      >
        {bandInfo.brandLine}
      </div>
      <svg width={rule} height="4" viewBox={`0 0 ${rule} 4`} style={{ marginLeft: size * 0.5 }}>
        <path d={dotsPath(dots)} fill="none" stroke={color.led} strokeWidth="2.4" strokeLinecap="round" opacity="0.75" />
      </svg>
    </div>
  );
}

// ── The files ──────────────────────────────────────────────────────────────

const PUBLIC_DIR = join(process.cwd(), 'public');

const FONT_FILES = [
  { file: 'Outfit-Regular.ttf', weight: 400 },
  { file: 'Outfit-SemiBold.ttf', weight: 600 },
  { file: 'Outfit-Bold.ttf', weight: 700 },
] as const;

async function readFonts() {
  return Promise.all(
    FONT_FILES.map(async ({ file, weight }) => ({
      name: 'Outfit',
      data: await readFile(join(PUBLIC_DIR, 'fonts', file)),
      weight,
      style: 'normal' as const,
    })),
  );
}

// Read once per process: the files do not depend on the request.
let fonts: ReturnType<typeof readFonts> | undefined;

const MIME: Record<string, string> = { '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png' };

/** A file under public/ as a data URL: the rasteriser has no network to fetch it from. */
async function dataUrl(src: string): Promise<string> {
  const mime = MIME[extname(src).toLowerCase()];
  if (!mime) throw new Error(`ogCard: unsupported image type "${src}"`);
  const file = await readFile(join(PUBLIC_DIR, src));
  return `data:${mime};base64,${file.toString('base64')}`;
}

// ── The two layouts ────────────────────────────────────────────────────────

const PAD_X = 64;
const PAD_Y = 56;

/**
 * How much of the card a photograph may cover, in px². Measured on these
 * cards: a photograph costs about 2.8 bytes per pixel in the PNG next/og
 * renders (it renders nothing but PNG), and everything else on the card some
 * 60 KB in all — so the photograph's area is what decides the file's weight.
 * An area, not a width: a portrait and a landscape then carry the same
 * weight on the card.
 */
const PHOTO_AREA = 72_000;

/**
 * Heaviest PNG a card may be; src/lib/og/__tests__/card.test.tsx renders
 * every route against it. Most of the band's links travel by WhatsApp, whose
 * documentation asks for an og:image "under 600KB"
 * (developers.facebook.com/documentation/business-messaging/whatsapp/link-previews).
 * Half of that is the margin chosen here: third-party reports, not verified
 * by us, say previews start to fail well before the documented limit.
 */
export const CARD_BYTES_MAX = 300_000;

/** The box of ratio `ratio` (w/h) that covers `area` px²: the photograph whole, never cropped to fit. */
export function fitWhole(ratio: number, area: number): { width: number; height: number } {
  const width = Math.round(Math.sqrt(area * ratio));
  return { width, height: Math.round(width / ratio) };
}

const titleStyle = {
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: tokens.tracking.display,
  color: color.ink,
} as const;

const lineStyle = { fontWeight: 400, lineHeight: 1.22, color: color.muted } as const;

/** No photograph: the name itself is the picture, lit by the wall behind it. */
function Hero({ title, line }: OgCard) {
  const markWidth = ogSize.width - 2 * PAD_X;
  const markHeight = (markWidth * WORDMARK.viewBox.height) / WORDMARK.viewBox.width;
  const markTop = PAD_Y + 24 + 30;
  return (
    <>
      <Wall pool={{ cx: PAD_X + markWidth / 2, cy: markTop + markHeight / 2, rx: markWidth * 0.66, ry: markHeight * 1.5 }} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: ogSize.width,
          height: ogSize.height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: `${PAD_Y}px ${PAD_X}px`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <BrandLine size={24} rule={markWidth - 258} />
          <div style={{ display: 'flex', marginTop: 30 }}>
            <Acrylic width={markWidth} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...titleStyle, fontSize: 62 }}>{title}</div>
          <div style={{ ...lineStyle, fontSize: 31, marginTop: 18 }}>{line}</div>
        </div>
      </div>
    </>
  );
}

/** Text on the left, the photograph whole on the right, the wall lit around it. */
function Split({ title, line, photo, src }: OgCard & { photo: Pick<Photo, 'src' | 'aspect'>; src: string }) {
  const frame = fitWhole(ratioOf(photo.aspect), PHOTO_AREA);
  const photoLeft = ogSize.width - PAD_X - frame.width;
  return (
    <>
      <Wall
        pool={{
          cx: photoLeft + frame.width / 2,
          cy: ogSize.height / 2,
          rx: frame.width / 2 + 250,
          ry: frame.height / 2 + 210,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: ogSize.width,
          height: ogSize.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${PAD_Y}px ${PAD_X}px`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            width: photoLeft - PAD_X - 48,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <BrandLine size={22} rule={172} />
            <div style={{ display: 'flex', marginTop: 24 }}>
              <Acrylic width={420} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ ...titleStyle, fontSize: 104 }}>{title}</div>
            <div style={{ ...lineStyle, fontSize: 32, marginTop: 20 }}>{line}</div>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- Satori draws this <img> into a PNG; the route exports the alt text. */}
        <img src={src} width={frame.width} height={frame.height} style={{ border: `1px solid ${color.frame}` }} />
      </div>
    </>
  );
}

/** The card for one route, as the Response an opengraph-image.tsx returns. */
export async function ogCard(card: OgCard): Promise<ImageResponse> {
  fonts ??= readFonts();
  const [fontData, src] = await Promise.all([fonts, card.photo ? dataUrl(card.photo.src) : undefined]);
  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: ogSize.width,
          height: ogSize.height,
          backgroundColor: color.ground,
          fontFamily: 'Outfit',
        }}
      >
        {card.photo && src ? <Split {...card} photo={card.photo} src={src} /> : <Hero {...card} />}
      </div>
    ),
    { ...ogSize, fonts: fontData },
  );
}
