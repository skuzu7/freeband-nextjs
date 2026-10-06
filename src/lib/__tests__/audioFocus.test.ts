// @vitest-environment node
//
// One sound at a time: claiming the focus pauses whoever held it, and nothing
// is ever resumed on anyone's behalf.
import { describe, expect, it, vi } from 'vitest';
import { audioFocus, createAudioFocus, type AudioMember } from '../media/audioFocus';

const member = () => ({ pause: vi.fn<() => void>() });

describe('audioFocus', () => {
  it('pauses the member that was sounding when another one claims the focus', () => {
    const focus = createAudioFocus();
    const first = member();
    const second = member();

    focus.claim(first);
    expect(focus.holder()).toBe(first);
    expect(first.pause).not.toHaveBeenCalled();

    focus.claim(second);
    expect(first.pause).toHaveBeenCalledTimes(1);
    expect(second.pause).not.toHaveBeenCalled();
    expect(focus.holder()).toBe(second);
  });

  it('does not pause a member that claims the focus it already holds', () => {
    const focus = createAudioFocus();
    const only = member();
    focus.claim(only);
    focus.claim(only);
    expect(only.pause).not.toHaveBeenCalled();
    expect(focus.holder()).toBe(only);
  });

  it('never resumes anyone: the member that was cut off stays paused when the other one stops', () => {
    const focus = createAudioFocus();
    const first = { pause: vi.fn(), play: vi.fn() };
    const second = member();
    focus.claim(first);
    focus.claim(second);
    expect(focus.release(second)).toBe(true);
    expect(focus.holder()).toBeNull();
    expect(first.play).not.toHaveBeenCalled();
    expect(first.pause).toHaveBeenCalledTimes(1);
  });

  it('tells a member whether it was the one holding the focus when it went quiet', () => {
    const focus = createAudioFocus();
    const first = member();
    const second = member();
    focus.claim(first);
    focus.claim(second);
    // The first was cut off: the sound on the page is the second one's.
    expect(focus.release(first)).toBe(false);
    expect(focus.holder()).toBe(second);
    expect(focus.release(second)).toBe(true);
    expect(focus.release(second)).toBe(false);
  });

  it('does not pause a member that had already gone quiet', () => {
    const focus = createAudioFocus();
    const first = member();
    const second = member();
    focus.claim(first);
    focus.release(first);
    focus.claim(second);
    expect(first.pause).not.toHaveBeenCalled();
  });

  it('has handed the focus over by the time the old holder is paused', () => {
    const focus = createAudioFocus();
    const second = member();
    const released: boolean[] = [];
    const first: AudioMember = {
      // What a player does on its own pause: let go, and zero the level only
      // if it still held the sound.
      pause: () => released.push(focus.release(first)),
    };
    focus.claim(first);
    focus.claim(second);
    expect(released).toEqual([false]);
    expect(focus.holder()).toBe(second);
  });

  it('keeps separate focuses apart, and the page shares one', () => {
    const a = createAudioFocus();
    const b = createAudioFocus();
    const first = member();
    const second = member();
    a.claim(first);
    b.claim(second);
    expect(first.pause).not.toHaveBeenCalled();
    expect(audioFocus.holder()).toBeNull();
  });
});
