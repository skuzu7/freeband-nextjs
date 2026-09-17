// src/components/ui/Ticker.tsx
// The names as a plain, wrapped list. This is what the LED marquee shows
// under prefers-reduced-motion — it never moves, so there is no second copy
// to loop and no animation to pause.
import { cn } from '@/lib/cn';

interface TickerProps {
  items: string[];
  label: string;
  className?: string;
}

export function Ticker({ items, label, className }: TickerProps) {
  return (
    <div className={cn('ticker', className)} role="region" aria-label={label}>
      <ul className="ticker-track">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-8 whitespace-nowrap text-2xl font-medium tracking-tight text-ink">
            {item}
            <i aria-hidden className="size-1.5 rounded-pill bg-led" />
          </li>
        ))}
      </ul>
    </div>
  );
}
