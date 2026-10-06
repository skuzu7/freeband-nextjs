// src/lib/media/audioFocus.ts
// One sound at a time. Whatever is about to make sound claims the focus and
// whoever held it is paused; nothing is ever resumed on anyone's behalf — a
// clip that was cut off stays quiet until its visitor presses play again.
// Pure: a member is anything with a pause(), so this file knows no DOM.

export interface AudioMember {
  /** Stop making sound: another member has claimed the focus. */
  pause(): void;
}

export interface AudioFocus {
  /** `member` is about to make sound. Whoever was making it is paused. */
  claim(member: AudioMember): void;
  /**
   * `member` went quiet. True when it was the one holding the focus — the
   * page is silent now — and false when someone else had already taken it.
   */
  release(member: AudioMember): boolean;
  /** Who is making sound right now, if anyone. */
  holder(): AudioMember | null;
}

export function createAudioFocus(): AudioFocus {
  let current: AudioMember | null = null;
  return {
    claim(member) {
      const previous = current;
      // Handed over before the pause: a member that releases from inside its
      // own pause() finds it no longer holds anything.
      current = member;
      if (previous && previous !== member) previous.pause();
    },
    release(member) {
      if (current !== member) return false;
      current = null;
      return true;
    },
    holder: () => current,
  };
}

/** The page's one focus: every player with sound shares it. */
export const audioFocus = createAudioFocus();
