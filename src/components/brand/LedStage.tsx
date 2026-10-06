// src/components/brand/LedStage.tsx
// The wall behind every page of the site: a fixed field of unlit dots that
// light answers. The whole thing is a mask (src/styles/led.css) — whatever
// sits inside shows only through the dot grid — so the unlit panel is plain
// server markup and works with no script at all. LedStageDriver adds the
// light: a pool under the pointer, a wash that follows the music, a band
// crossing the wall on every change of route.
import { LedStageDriver } from './LedStageDriver';

export function LedStage() {
  return (
    <div aria-hidden className="led-stage">
      <div className="led-stage-off" />
      <LedStageDriver />
    </div>
  );
}
