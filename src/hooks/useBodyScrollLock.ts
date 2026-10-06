// src/hooks/useBodyScrollLock.ts
// Stops the page behind a dialog from scrolling, and puts back whatever the
// body's overflow was before.
import { useEffect } from 'react';

export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}
