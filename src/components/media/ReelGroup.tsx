'use client';

// src/components/media/ReelGroup.tsx
// A set of reels with ONE pause control (WCAG 2.2.2: anything that moves for
// more than five seconds needs a way to stop it). Reduced-motion users start
// paused; the button still lets them play.
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/lib/useReducedMotion';
import type { Reel as ReelData } from '@/data/media/reels';
import { Reel } from './Reel';

interface ReelGroupProps {
  reels: ReelData[];
  pauseLabel: string;
  playLabel: string;
  className?: string;
  columns?: 3 | 4;
}

export function ReelGroup({ reels, pauseLabel, playLabel, className, columns = 3 }: ReelGroupProps) {
  const reduced = useReducedMotion();
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const paused = userPaused ?? reduced;

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <div className="flex justify-end">
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setUserPaused(!paused)}
          className="label-caps transition-quick inline-flex items-center gap-2.5 py-2 text-ink-muted hover:text-ink"
        >
          <i aria-hidden className={cn('size-1.5 rounded-pill', paused ? 'bg-ink-low' : 'bg-led')} />
          {paused ? playLabel : pauseLabel}
        </button>
      </div>
      <div className={cn('grid gap-4', columns === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3')}>
        {reels.map((reel) => (
          <Reel key={reel.src} reel={reel} active={!paused} />
        ))}
      </div>
    </div>
  );
}
