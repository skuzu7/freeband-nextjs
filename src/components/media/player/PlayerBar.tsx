// src/components/media/player/PlayerBar.tsx
// The player's own controls, in the order they are read and reached: the
// timeline, play/pause, the clock, sound, subtitles, full screen. Pure
// presentation — the state is the <video>'s, held by Player.
//
// Every control is one thumb wide and tall (the `tap` utility; the two ranges
// through .player-range) and named after what a press does.
import type { ComponentProps, CSSProperties } from 'react';
import { player as copy } from '@/data/copy/player';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { formatClock } from './clock';

const BUTTON =
  'tap inline-flex flex-none cursor-pointer items-center justify-center rounded-sm text-ink-muted transition-quick hover:text-led-text';

interface RangeProps extends Omit<ComponentProps<'input'>, 'type' | 'className'> {
  /** How much of the track is lit, 0..1. */
  fill: number;
  className?: string;
}

/**
 * A native range, so the keyboard, the pointer and the screen reader get the
 * real thing; the row of dots under it is drawn by the wrapper (player.css).
 */
function Range({ fill, className, ...input }: RangeProps) {
  return (
    <span className={cn('player-track', className)} style={{ '--p': fill } as CSSProperties}>
      <input type="range" className="player-range" {...input} />
    </span>
  );
}

export interface PlayerBarProps {
  title: string;
  playing: boolean;
  /** Seconds. */
  time: number;
  duration: number;
  /** Muted, or turned all the way down. */
  silent: boolean;
  /** What the volume slider shows, 0..1: 0 while muted. */
  volume: number;
  /** False where the volume belongs to the device's own buttons (iOS). */
  volumeAdjustable: boolean;
  /** Whether subtitles are showing; null on a clip without a track. */
  captions: boolean | null;
  /** Whether the player has the screen; null where the browser cannot give it. */
  fullscreen: boolean | null;
  onToggle: () => void;
  onSeek: (time: number) => void;
  onMute: () => void;
  onVolume: (volume: number) => void;
  onCaptions: () => void;
  onFullscreen: () => void;
}

export function PlayerBar({
  title,
  playing,
  time,
  duration,
  silent,
  volume,
  volumeAdjustable,
  captions,
  fullscreen,
  onToggle,
  onSeek,
  onMute,
  onVolume,
  onCaptions,
  onFullscreen,
}: PlayerBarProps) {
  const position = Math.min(Math.max(0, time), duration);
  const clock = formatClock(position);
  const total = formatClock(duration);

  return (
    <>
      <Range
        className="player-seek"
        fill={duration > 0 ? position / duration : 0}
        min={0}
        max={duration}
        step="any"
        value={position}
        aria-label={copy.seek}
        aria-valuetext={copy.position(clock, total)}
        data-player-control="seek"
        onChange={(event) => onSeek(Number(event.currentTarget.value))}
      />
      <button
        type="button"
        className={BUTTON}
        aria-label={playing ? copy.pause(title) : copy.play(title)}
        aria-keyshortcuts="K"
        data-player-control="play"
        onClick={onToggle}
      >
        <Icon name={playing ? 'pause' : 'play'} />
      </button>
      {/* The timeline already says this to a screen reader. */}
      <span aria-hidden className="px-2 text-xs tabular-nums whitespace-nowrap text-ink-muted">
        {clock} / {total}
      </span>
      <button
        type="button"
        className={cn(BUTTON, 'ml-auto')}
        aria-label={silent ? copy.unmute : copy.mute}
        aria-keyshortcuts="M"
        data-player-control="mute"
        onClick={onMute}
      >
        <Icon name={silent ? 'mute' : 'volume'} />
      </button>
      {volumeAdjustable && (
        <Range
          className="player-volume"
          fill={volume}
          min={0}
          max={1}
          step={0.05}
          value={volume}
          aria-label={copy.volume}
          aria-valuetext={copy.volumeValue(Math.round(volume * 100))}
          data-player-control="volume"
          onChange={(event) => onVolume(Number(event.currentTarget.value))}
        />
      )}
      {captions !== null && (
        <button
          type="button"
          className={cn(BUTTON, 'label-caps', captions && 'text-led-text')}
          aria-label={captions ? copy.captionsOff : copy.captionsOn}
          data-player-control="captions"
          onClick={onCaptions}
        >
          {copy.captionsLabel}
        </button>
      )}
      {fullscreen !== null && (
        <button
          type="button"
          className={BUTTON}
          aria-label={fullscreen ? copy.exitFullscreen : copy.fullscreen}
          aria-keyshortcuts="F"
          data-player-control="fullscreen"
          onClick={onFullscreen}
        >
          <Icon name="fullscreen" />
        </button>
      )}
    </>
  );
}
