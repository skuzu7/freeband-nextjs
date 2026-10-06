// src/components/media/lightbox/transitions.ts
// The viewer's navigations, as view-transition vocabulary. A step from one
// photograph to the next carries a type (Link `transitionTypes`, or
// `router.replace(href, { transitionTypes })`); opening carries none.
import type { TransitionClass } from '@/components/ui/Transition';

export const STEP_NEXT = 'photo-next';
export const STEP_PREV = 'photo-prev';
export type StepType = typeof STEP_NEXT | typeof STEP_PREV;

/**
 * Thumbnail ↔ viewer, the same on both sides of the pair. Opening, the
 * photograph travels from the plate into the viewer (class `photo`, styled in
 * src/styles/motion.css). While stepping it must not: the thumbnails under
 * the lightbox change hands too, and nobody should see them fly.
 *
 * Two things React decides, and this file does not fight:
 *   - a boundary only gets `enter`/`exit` when no DOM node sits above it in
 *     the tree being mounted, which the photograph inside the viewer never
 *     is. So the photograph arriving on a step is animated in plain CSS
 *     (.viewer-photo[data-enter], src/styles/gallery.css), not here;
 *   - going back in history is rendered at once, without a view transition,
 *     so closing the lightbox does not play the journey in reverse. The
 *     thumbnail lights up again instead (.photo-returned).
 */
export const PHOTO_SHARE: TransitionClass = { default: 'photo', [STEP_NEXT]: 'none', [STEP_PREV]: 'none' };
