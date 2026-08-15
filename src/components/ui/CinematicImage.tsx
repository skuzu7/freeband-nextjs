// src/components/ui/CinematicImage.tsx
// Server-safe wrapper around next/image that applies one archive grade plus
// aspect-ratio and object-position control.
//
// The grade set is deliberately small — it matches the three kinds of picture
// the archive actually holds (see src/data/images.ts). The previous version
// carried eight scene grades and a scroll-driven parallax; nothing on the page
// used them, and several actively fought the photographs.
//
// Respects next.config.ts:images.qualities: [75, 90] at the type level;
// defaults to 75 — pass quality={90} only where the extra weight is earned.
//
// Every string src found in the generated blurMap automatically gets a
// blur-up placeholder (run scripts/generate-blur.mjs after adding images).
//
// Usage:
//   <CinematicImage src="…" alt="…" grade="live" aspect="3/2" fill />
// The wrapper div owns the aspect ratio; the next/image `fill` covers it.
import Image, { type ImageProps } from "next/image";
import { blurMap } from "@/data/blur";

export type ImageGrade =
  /** Stage photography — full colour, contrast lifted a touch. */
  | "live"
  /** Event flyers — printed artefacts, never filtered. */
  | "poster"
  /** Pre-digital band shots — graded warm. */
  | "vintage";

// Force quality to the allowed values only (75 | 90) — TS prevents anything else.
type Quality = 75 | 90;

interface CinematicImageProps
  extends Omit<ImageProps, "quality" | "className" | "style"> {
  grade: ImageGrade;
  aspect?: string;
  crop?: string;
  fit?: "cover" | "contain";
  quality?: Quality;
  wrapperClassName?: string;
  imgClassName?: string;
}

export function CinematicImage({
  grade,
  aspect,
  crop = "center",
  fit = "cover",
  quality = 75,
  wrapperClassName = "",
  imgClassName = "",
  alt,
  ...imgProps
}: CinematicImageProps) {
  const wrapperStyle: React.CSSProperties = {};
  if (aspect) wrapperStyle.aspectRatio = aspect;

  const blur =
    typeof imgProps.src === "string" && blurMap[imgProps.src]
      ? ({ placeholder: "blur", blurDataURL: blurMap[imgProps.src] } as const)
      : undefined;

  return (
    <div
      className={`relative block h-full w-full overflow-hidden ${wrapperClassName}`.trim()}
      style={wrapperStyle}
    >
      <Image
        {...blur}
        {...imgProps}
        alt={alt}
        quality={quality}
        className={`${fit === "cover" ? "object-cover" : "object-contain"} grade-${grade} ${imgClassName}`.trim()}
        style={{ objectPosition: crop }}
      />
    </div>
  );
}
