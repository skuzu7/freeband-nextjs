'use client';

// src/components/brand/LedSign.tsx
// The running sign: the names pass in LED blue behind a fixed grid of dots,
// the way text crosses a real panel — the dots stay put, the light moves.
// The names are real text in the HTML (one list read by assistive tech, a
// second copy hidden from it to close the loop); the dots are a CSS cover.
// Under reduced motion the sign is a plain wrapped list and the control goes.
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { PlayToggle } from '@/components/ui/PlayToggle';

interface LedSignProps {
  items: string[];
  /** Accessible name of the region. */
  label: string;
  pauseLabel: string;
  playLabel: string;
  className?: string;
}

export function LedSign({ items, label, pauseLabel, playLabel, className }: LedSignProps) {
  const [paused, setPaused] = useState(false);

  const track = (hidden: boolean) => (
    <ul className="ticker-track" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="whitespace-nowrap">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="led-sign">
        <div className="ticker" role="region" aria-label={label} data-paused={paused ? '' : undefined}>
          {track(false)}
          {track(true)}
        </div>
      </div>
      <PlayToggle
        paused={paused}
        onToggle={() => setPaused((p) => !p)}
        pauseLabel={pauseLabel}
        playLabel={playLabel}
        className="self-start motion-reduce:hidden"
      />
    </div>
  );
}
