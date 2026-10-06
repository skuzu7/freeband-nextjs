'use client';

// src/components/media/player/Player.tsx
// One clip, with sound.
//
//   server     the HTML is a <video controls preload="none"> over its poster,
//              AV1 first and H.264 after it: without JavaScript the browser's
//              own controls play it
//   hydrated   the native controls give way to the player's (PlayerBar), and
//              the poster on show is the photograph underneath — blur
//              placeholder, modern formats — until the clip starts
//   sound      play() is only ever called from the visitor's click or key.
//              Nothing here autoplays. One clip sounds at a time (audioFocus)
//              and a clip that scrolls out of view pauses and stays paused
//   keyboard   only with the focus inside the player: space or K play/pause,
//              ←/→ 5 s, ↑/↓ volume, M mute, F full screen
//   the wall   while it plays, the clip's loudness is published for the LED
//              wall (meter.ts) and taken back to 0 when it stops
//   error      back to the poster, with a line and the WhatsApp link
//
// The box is the clip's real aspect, so the picture is never cropped, and the
// controls sit under it, never over it.
import { getImageProps } from 'next/image';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type SyntheticEvent,
} from 'react';
import { contact } from '@/data/contact';
import { player as copy } from '@/data/copy/player';
import type { VideoClip } from '@/data/media/videos';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { audioFocus, type AudioMember } from '@/lib/media/audioFocus';
import { setLevel } from '@/lib/media/level';
import { Icon } from '@/components/ui/Icon';
import { PhotoView } from '../PhotoView';
import { enterFullscreen, exitFullscreen, fullscreenMode, isFullscreen, onFullscreenChange } from './fullscreen';
import { createLevelMeter, type LevelMeter } from './meter';
import { PlayerBar } from './PlayerBar';

/** Seconds an arrow key moves the clip. */
const SEEK_STEP = 5;
/** How much of the volume an arrow key moves. */
const VOLUME_STEP = 0.1;
/** Where a clip that was muted at zero comes back to. */
const VOLUME_BACK = 0.5;
/** Less of the picture than this on screen and the clip pauses. */
const MIN_VISIBLE = 0.25;
/** HTMLMediaElement.HAVE_CURRENT_DATA: the video has a frame of its own to show. */
const HAVE_CURRENT_DATA = 2;
/** HTMLMediaElement.HAVE_FUTURE_DATA: enough is buffered to play on from here. */
const HAVE_FUTURE_DATA = 3;
/**
 * A <video poster> is fetched with the page, on screen or not, and once the
 * script is in charge nobody sees it: the photograph under the video is the
 * poster. So it is the image optimiser's rendition of the frame (AVIF or
 * WebP, a few KB) rather than the JPEG itself — enough for a browser without
 * JavaScript. getImageProps answers with the 2× candidate of the width it is
 * given: 320 asks for the 640 px one.
 */
const POSTER_WIDTH = 320;

/** What the player shows of the <video>'s own state. */
interface Media {
  playing: boolean;
  time: number;
  duration: number;
  muted: boolean;
  volume: number;
}

const noSubscription = () => () => {};

/** False on the server and while hydrating, true from then on. */
function useHydrated(): boolean {
  return useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
}

let volumeSettable: boolean | undefined;
/** iOS keeps the volume for the device's own buttons: `volume` reads 1 whatever is written to it. */
function canSetVolume(): boolean {
  if (volumeSettable === undefined) {
    const probe = document.createElement('video');
    try {
      probe.volume = 0.5;
    } catch {
      // Left at 1: not settable.
    }
    volumeSettable = probe.volume === 0.5;
  }
  return volumeSettable;
}

const clamp = (value: number, max = 1) => Math.min(max, Math.max(0, value));

export interface PlayerProps {
  clip: VideoClip;
  /** next/image `sizes` of the poster: how wide the player renders. */
  sizes: string;
  /** The poster's blur placeholder, looked up on the server (src/data/blur.ts). */
  blur?: string;
  /** Id of the element that names the clip on the page; without one the title is the label. */
  labelledBy?: string;
  className?: string;
}

export function Player({ clip, sizes, blur, labelledBy, className }: PlayerProps) {
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  const mode = useSyncExternalStore(noSubscription, fullscreenMode, () => null);
  const volumeAdjustable = useSyncExternalStore(noSubscription, canSetVolume, () => true);
  const keysId = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const meterRef = useRef<LevelMeter | null>(null);
  /** An iPhone asked for the screen before the video knew its size. */
  const wantsScreen = useRef(false);
  /** This clip, as the page's audio focus knows it. */
  const [member] = useState<AudioMember>(() => ({ pause: () => videoRef.current?.pause() }));

  const [media, setMedia] = useState<Media>({
    playing: false,
    time: 0,
    duration: clip.duration,
    muted: false,
    volume: 1,
  });
  /** The video has a frame of its own: from here on it is the picture, not the poster under it. */
  const [started, setStarted] = useState(false);
  /** Asked to play and not there yet. */
  const [waiting, setWaiting] = useState(false);
  const [failed, setFailed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [captions, setCaptions] = useState(false);

  const [width, height] = clip.aspect.split('/').map(Number);
  const ratio = width / height;
  const poster = useMemo(
    () =>
      getImageProps({
        src: clip.poster,
        alt: '',
        width: POSTER_WIDTH,
        height: Math.round(POSTER_WIDTH / ratio),
      }).props.src,
    [clip.poster, ratio],
  );

  // ---------- the wall and the one sound ----------

  /** This clip is the one sounding: any other goes quiet, the wall listens to this one. */
  const sound = () => {
    audioFocus.claim(member);
    // A wall that pulses is motion: under reduced motion nothing is published.
    if (reduced) return;
    meterRef.current ??= createLevelMeter(clip.levels, () => {
      const video = videoRef.current;
      return video ? { time: video.currentTime, audible: !video.muted && video.volume > 0 } : null;
    });
    meterRef.current.start();
  };

  /** This clip went quiet. The level goes with it only if no other clip has taken over. */
  const quiet = useCallback(() => {
    meterRef.current?.stop();
    if (audioFocus.release(member)) setLevel(0);
  }, [member]);

  // Leaving the page (a route change unmounts the player) is going quiet too.
  useEffect(() => quiet, [quiet]);

  // The preference can change while a clip plays: the wall stops there and then.
  useEffect(() => {
    if (!reduced) return;
    meterRef.current?.stop();
    if (audioFocus.holder() === member) setLevel(0);
  }, [reduced, member]);

  // ---------- the <video>'s state, read back from it ----------

  const sync = () => {
    const video = videoRef.current;
    if (!video) return;
    const next: Media = {
      playing: !video.paused && !video.ended,
      time: video.currentTime,
      duration: Number.isFinite(video.duration) && video.duration > 0 ? video.duration : clip.duration,
      muted: video.muted,
      volume: video.volume,
    };
    // Started by the browser's own controls before this component was
    // listening (or by the system's player on an iPhone): the same rules hold.
    if (next.playing && audioFocus.holder() !== member) sound();
    if (video.readyState >= HAVE_CURRENT_DATA) setStarted(true);
    setMedia((previous) =>
      (Object.keys(next) as (keyof Media)[]).some((key) => previous[key] !== next[key]) ? next : previous,
    );
  };

  const fail = () => {
    setFailed(true);
    setWaiting(false);
    quiet();
  };

  // ---------- what a visitor can ask for ----------

  /** Only ever reached from a click or a key press: this is where the sound starts. */
  const play = () => {
    const video = videoRef.current;
    if (!video || failed) return;
    // Claimed before play(): the clip that was sounding stops within this
    // same gesture, not a frame later.
    sound();
    if (video.readyState < HAVE_FUTURE_DATA) setWaiting(true);
    let begun: Promise<void> | undefined;
    try {
      begun = video.play();
    } catch {
      fail();
      return;
    }
    begun?.catch((error: unknown) => {
      // AbortError is a pause that arrived first; NotAllowedError a browser
      // that wants another gesture. Only a clip with no playable source is an
      // error worth telling the visitor about.
      if ((error as { name?: string } | null)?.name === 'NotSupportedError') fail();
      else if (video.paused) {
        setWaiting(false);
        quiet();
      }
    });
  };

  const toggle = () => {
    const video = videoRef.current;
    if (!video || failed) return;
    if (video.paused || video.ended) play();
    else video.pause();
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    const end = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : clip.duration;
    video.currentTime = clamp(time, end);
    sync();
  };

  const setVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    const volume = Math.round(clamp(value) * 100) / 100;
    video.volume = volume;
    if (volume > 0) video.muted = false;
    sync();
  };

  const nudgeVolume = (delta: number) => {
    const video = videoRef.current;
    if (video) setVolume((video.muted ? 0 : video.volume) + delta);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted || video.volume === 0) {
      video.muted = false;
      if (video.volume === 0) video.volume = VOLUME_BACK;
    } else {
      video.muted = true;
    }
    sync();
  };

  const toggleCaptions = () => {
    const next = !captions;
    const tracks = videoRef.current?.textTracks;
    if (tracks) for (let i = 0; i < tracks.length; i += 1) tracks[i].mode = next && i === 0 ? 'showing' : 'disabled';
    setCaptions(next);
  };

  const toggleFullscreen = () => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video || !mode) return;
    if (isFullscreen(root, video)) {
      exitFullscreen(video);
      return;
    }
    if (!enterFullscreen(root, video, mode) && mode === 'video') {
      // An iPhone hands the screen to a <video> only once it knows the
      // picture's size: start the clip and go when the metadata is in.
      wantsScreen.current = true;
      play();
    }
  };

  // ---------- events ----------

  const onMetadata = () => {
    sync();
    const root = rootRef.current;
    const video = videoRef.current;
    if (!wantsScreen.current || !root || !video) return;
    wantsScreen.current = false;
    enterFullscreen(root, video, 'video');
  };

  const onSourceError = (event: SyntheticEvent<HTMLSourceElement>) => {
    // Every source the browser cannot use reports here; the clip is lost only
    // when the last of them has.
    const last = videoRef.current?.querySelector('source:last-of-type');
    if (event.currentTarget === last) fail();
  };

  const onStageClick = () => {
    toggle();
    // The keyboard follows the pointer: space, the arrows, M and F work from here on.
    rootRef.current?.querySelector<HTMLElement>('[data-player-control="play"]')?.focus({ preventScroll: true });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement;
    const onVolume = target.dataset.playerControl === 'volume';
    const arrow = event.key.startsWith('Arrow');
    // Held down, an arrow keeps moving; a toggle must not flicker.
    if (event.repeat && !arrow) return;
    switch (event.key) {
      case ' ':
        // A button under the focus answers its own space bar.
        if (target instanceof HTMLButtonElement || target instanceof HTMLAnchorElement) return;
        toggle();
        break;
      case 'k':
      case 'K':
        toggle();
        break;
      case 'ArrowLeft':
        if (onVolume) nudgeVolume(-VOLUME_STEP);
        else seekTo((videoRef.current?.currentTime ?? 0) - SEEK_STEP);
        break;
      case 'ArrowRight':
        if (onVolume) nudgeVolume(VOLUME_STEP);
        else seekTo((videoRef.current?.currentTime ?? 0) + SEEK_STEP);
        break;
      case 'ArrowUp':
        nudgeVolume(VOLUME_STEP);
        break;
      case 'ArrowDown':
        nudgeVolume(-VOLUME_STEP);
        break;
      case 'm':
      case 'M':
        toggleMute();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  // Out of sight, out of earshot — and it stays that way: scrolling back does
  // not start the clip again.
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!root || !stage || !video || typeof IntersectionObserver === 'undefined') return;
    const views = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        const inView = entry.isIntersecting && entry.intersectionRatio >= MIN_VISIBLE;
        if (!inView && !video.paused && !isFullscreen(root, video)) video.pause();
      },
      { threshold: [0, MIN_VISIBLE] },
    );
    views.observe(stage);
    return () => views.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;
    return onFullscreenChange(video, () => setFullscreen(isFullscreen(root, video)));
  }, []);

  const state = failed ? 'error' : media.playing ? 'playing' : started ? 'paused' : 'idle';
  const live = hydrated && !failed;
  const silent = media.muted || media.volume === 0;

  return (
    <div
      ref={rootRef}
      role="group"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : clip.title}
      aria-describedby={live ? keysId : undefined}
      className={cn('player', className)}
      style={{ '--player-ratio': ratio } as CSSProperties}
      data-state={state}
      data-ready={hydrated ? '' : undefined}
      data-started={started ? '' : undefined}
      data-waiting={waiting && !failed ? '' : undefined}
      data-fullscreen={fullscreen ? '' : undefined}
      onKeyDown={live ? onKeyDown : undefined}
    >
      <div ref={stageRef} className="player-stage">
        <PhotoView photo={{ src: clip.poster, alt: clip.alt, aspect: clip.aspect }} sizes={sizes} blur={blur} />
        <video
          ref={videoRef}
          className="player-video"
          controls={!hydrated}
          playsInline
          preload="none"
          poster={poster}
          aria-label={clip.title}
          onClick={live ? onStageClick : undefined}
          onPlay={() => {
            sound();
            sync();
          }}
          onLoadedData={sync}
          onPlaying={() => {
            setWaiting(false);
            sync();
          }}
          onWaiting={() => setWaiting(true)}
          onCanPlay={() => setWaiting(false)}
          onPause={() => {
            quiet();
            setWaiting(false);
            sync();
          }}
          onEnded={() => {
            quiet();
            sync();
          }}
          onTimeUpdate={sync}
          onSeeked={sync}
          onDurationChange={sync}
          onLoadedMetadata={onMetadata}
          onVolumeChange={sync}
          onError={(event) => {
            // React bubbles `error` up its own tree, though the browser does
            // not: a <source> that was merely skipped must not count as the
            // video failing.
            if (event.target === event.currentTarget) fail();
          }}
        >
          {clip.sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} onError={onSourceError} />
          ))}
          {clip.tracks?.map((track) => (
            <track key={track.src} kind={track.kind} src={track.src} srcLang={track.srcLang} label={track.label} />
          ))}
        </video>
        {live && (
          <span aria-hidden className="player-cue">
            <Icon name="play" className="player-cue-play size-7" />
            <span className="player-cue-wait">
              <i />
              <i />
              <i />
            </span>
          </span>
        )}
      </div>
      {/* Always in the HTML, at its final height: the controls arriving after
          hydration must not push the page down. */}
      <div className="player-bar">
        {failed ? (
          <p role="alert" className="px-3 py-2 text-sm text-ink-muted">
            {copy.error}{' '}
            <a
              href={contact.whatsappQuoteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-led-text underline underline-offset-4 transition-quick hover:text-ink"
            >
              {copy.errorCta}
            </a>
          </p>
        ) : (
          hydrated && (
            <PlayerBar
              title={clip.title}
              playing={media.playing}
              time={media.time}
              duration={media.duration}
              silent={silent}
              volume={media.muted ? 0 : media.volume}
              volumeAdjustable={volumeAdjustable}
              captions={clip.tracks?.length ? captions : null}
              fullscreen={mode ? fullscreen : null}
              onToggle={toggle}
              onSeek={seekTo}
              onMute={toggleMute}
              onVolume={setVolume}
              onCaptions={toggleCaptions}
              onFullscreen={toggleFullscreen}
            />
          )
        )}
      </div>
      {live && (
        <>
          <p id={keysId} className="sr-only">
            {copy.keys}
          </p>
          <p role="status" className="sr-only">
            {waiting ? copy.loading : ''}
          </p>
        </>
      )}
    </div>
  );
}
