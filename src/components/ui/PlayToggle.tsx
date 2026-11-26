// src/components/ui/PlayToggle.tsx
// The one control that stops anything moving on its own (WCAG 2.2.2): the
// fold's loop, the running sign. Named after what a press does, so no
// aria-pressed — the two together would announce "play, pressed" over a loop
// that is stopped.
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

interface PlayToggleProps {
  paused: boolean;
  onToggle: () => void;
  pauseLabel: string;
  playLabel: string;
  compactMobile?: boolean;
  className?: string;
}

export function PlayToggle({
  paused,
  onToggle,
  pauseLabel,
  playLabel,
  compactMobile = false,
  className,
}: PlayToggleProps) {
  const label = paused ? playLabel : pauseLabel;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'label-caps transition-quick tap inline-flex items-center justify-center gap-2 py-2 text-ink-muted hover:text-ink',
        className,
      )}
    >
      <Icon name={paused ? 'play' : 'pause'} className={cn('size-3.5', paused ? 'text-ink-muted' : 'text-led')} />
      <span className={compactMobile ? 'sr-only sm:not-sr-only' : undefined}>{label}</span>
    </button>
  );
}
