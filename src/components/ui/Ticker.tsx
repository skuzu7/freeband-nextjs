// src/components/ui/Ticker.tsx
// A running line of names. The second copy makes the loop seamless and is
// hidden from assistive tech; under reduced motion the track stops and wraps
// into a plain list.
import { cn } from '@/lib/cn';

interface TickerProps {
  items: string[];
  label: string;
  className?: string;
}

export function Ticker({ items, label, className }: TickerProps) {
  const track = (hidden: boolean) => (
    <ul className="ticker-track" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-8 whitespace-nowrap text-2xl font-medium tracking-tight text-ink">
          {item}
          <i aria-hidden className="size-1.5 rounded-pill bg-led" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn('ticker', className)} role="region" aria-label={label}>
      {track(false)}
      {track(true)}
    </div>
  );
}
