// src/components/ui/PlayToggle.tsx
// The one control that stops anything moving on its own (WCAG 2.2.2): the
// fold's loop, the running sign. Named after what a press does, so no
// aria-pressed — the two together would announce "play, pressed" over a loop
// that is stopped.
import { cn } from '@/lib/cn';

interface PlayToggleProps {
  paused: boolean;
  onToggle: () => void;
  pauseLabel: string;
  playLabel: string;
  className?: string;
}

export function PlayToggle({ paused, onToggle, pauseLabel, playLabel, className }: PlayToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn('label-caps transition-quick tap inline-flex items-center gap-2.5 py-2 text-ink-muted hover:text-ink', className)}
    >
      <i aria-hidden className={cn('size-1.5 rounded-pill', paused ? 'bg-ink-low' : 'bg-led')} />
      {paused ? playLabel : pauseLabel}
    </button>
  );
}
