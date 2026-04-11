// src/components/ui/CinematicImage.tsx
// Server-safe wrapper around next/image that applies:
//   - one scene-aware grade-* class (filter chain defined in globals.css)
//   - optional scroll-driven parallax translate (capped at ±24px via CSS)
//   - aspect ratio + object-position crop overrides
//
// Respects next.config.ts:images.qualities: [75, 90] by enforcing quality=90
// at the type level.
import Image, { type ImageProps } from "next/image";

export type ImageGrade =
  | "vintage"
  | "stage"
  | "warm"
  | "cool"
  | "neon"
  | "cinema"
  | "mono"
  | "scrub";

export type Parallax = "none" | "soft" | "strong";

// Force quality to the allowed values only (75 | 90) — TS prevents anything else.
type Quality = 75 | 90;

interface CinematicImageProps
  extends Omit<ImageProps, "quality" | "className" | "style"> {
  grade: ImageGrade;
  parallax?: Parallax;
  aspect?: string;
  crop?: string;
  quality?: Quality;
  wrapperClassName?: string;
  imgClassName?: string;
}

export function CinematicImage({
  grade,
  parallax = "none",
  aspect,
  crop = "center",
  quality = 90,
  wrapperClassName = "",
  imgClassName = "",
  alt,
  ...imgProps
}: CinematicImageProps) {
  const gradeClass = `grade-${grade}`;
  const parallaxClass =
    parallax === "none" ? "" : parallax === "soft" ? "parallax-soft" : "parallax-strong";

  const wrapperStyle: React.CSSProperties = {};
  if (aspect) wrapperStyle.aspectRatio = aspect;

  return (
    <div
      className={`relative overflow-hidden ${parallaxClass} ${wrapperClassName}`.trim()}
      style={wrapperStyle}
    >
      <Image
        {...imgProps}
        alt={alt}
        quality={quality}
        className={`object-cover ${gradeClass} ${imgClassName}`.trim()}
        style={{ objectPosition: crop }}
      />
    </div>
  );
}
