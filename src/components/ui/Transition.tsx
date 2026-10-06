// src/components/ui/Transition.tsx
// React's <ViewTransition>, where it exists. The App Router runs on the React
// canary bundled with Next, which exports it; the `react` package on npm (what
// Vitest loads) does not. So this renders the real boundary in the app and a
// plain fragment anywhere else, and no caller has to know which React it got.
//
// A name shared by two boundaries, one leaving and one arriving in the same
// navigation, makes the browser morph one into the other (`share`). `enter`
// and `exit` are for a boundary with no counterpart. Every class named here
// is styled in CSS (::view-transition-group(.class) and friends); under
// prefers-reduced-motion nothing animates (src/styles/motion.css).
import * as React from 'react';
import type { ComponentType, ReactNode } from 'react';

/** One class for every navigation, or one per transition type (`default` required). */
export type TransitionClass = string | ({ default: string } & Record<string, string>);

export interface TransitionProps {
  /** Identity across a navigation: the same name on both sides forms a pair. */
  name?: string;
  /** What every case below falls back to. "none" keeps the boundary still. */
  default?: TransitionClass;
  enter?: TransitionClass;
  exit?: TransitionClass;
  share?: TransitionClass;
  update?: TransitionClass;
  children: ReactNode;
}

const ViewTransition = (React as unknown as { ViewTransition?: ComponentType<TransitionProps> }).ViewTransition;

export function Transition({ children, ...props }: TransitionProps) {
  if (!ViewTransition) return <>{children}</>;
  return <ViewTransition {...props}>{children}</ViewTransition>;
}
