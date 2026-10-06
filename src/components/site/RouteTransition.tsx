// src/components/site/RouteTransition.tsx
// One route leaving and the next arriving. Wraps the content of each public
// page — in the page, not the layout: a layout persists across navigations,
// so a boundary there would never enter or exit.
//
// The routes are peers, so there is no direction to slide in: the old page
// dims out quickly, the new one comes in on the light curve
// (::view-transition-*(.route) in src/styles/motion.css). Anything else that
// happens inside a page (a filter, a photograph opening) leaves this boundary
// still — `default="none"` — and the header and the lit dot under the current
// route are named apart in Nav, so they hold while the content changes.
import type { ReactNode } from 'react';
import { Transition } from '@/components/ui/Transition';

export function RouteTransition({ children }: { children: ReactNode }) {
  return (
    <Transition enter="route" exit="route" default="none">
      {children}
    </Transition>
  );
}
