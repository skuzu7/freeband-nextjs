// src/lib/useReducedMotion.ts
// prefers-reduced-motion as a React value. useSyncExternalStore, so it is
// false on the server and during hydration and flips without a setState in
// an effect. Anything that moves checks this; CSS covers the rest.
import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  if (typeof matchMedia === 'undefined') return () => {};
  const mq = matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function snapshot(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia(QUERY).matches;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
