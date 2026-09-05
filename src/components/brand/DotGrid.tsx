// src/components/brand/DotGrid.tsx
// The unlit panel as a background texture: CSS only, no JS, low opacity.
// Absolutely positioned — the parent decides the bounds.
import { cn } from '@/lib/cn';

interface DotGridProps {
  className?: string;
  /** Fade the field out towards the edges so it reads as a surface, not a tile. */
  fade?: boolean;
}

export function DotGrid({ className, fade = false }: DotGridProps) {
  return (
    <div
      aria-hidden
      className={cn('dot-grid pointer-events-none absolute inset-0 -z-10', className)}
      style={
        fade
          ? {
              maskImage: 'radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 100%)',
            }
          : undefined
      }
    />
  );
}
