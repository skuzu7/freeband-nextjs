// src/lib/led/canvas.ts
// Browser-side measurement the LED canvases share: the device pixel ratio cap
// and the backing-store size a canvas needs to fill its box. It only measures;
// the caller sizes the canvas, so an unchanged box costs no resize (and no
// clear).

/** Device pixel ratio, capped at 2: beyond that the dots only cost more. */
export function cappedDpr(): number {
  return Math.min(2, window.devicePixelRatio || 1);
}

/**
 * The box's CSS size and the backing store it needs at the capped pixel ratio
 * (never below 1×1), with the ratio used.
 */
export function measureCanvasBox(box: Element): { cssW: number; cssH: number; w: number; h: number; dpr: number } {
  const rect = box.getBoundingClientRect();
  const dpr = cappedDpr();
  return {
    cssW: rect.width,
    cssH: rect.height,
    w: Math.max(1, Math.round(rect.width * dpr)),
    h: Math.max(1, Math.round(rect.height * dpr)),
    dpr,
  };
}
