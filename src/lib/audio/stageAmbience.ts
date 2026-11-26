// src/lib/audio/stageAmbience.ts
// Sintetizador procedural Web Audio API para o som ambiente de palco (Zero 404).
// Desligado por padrão (WCAG 1.4.2): só inicia mediante clique explícito do usuário
// no botão "Som Ambiente" do console do Hero, modulando também o envelope de nível do LED.
import { setLevel } from '@/lib/media/level';
import { useStageStore } from '@/stores/useStageStore';

export interface StageAmbienceController {
  start: () => void;
  stop: () => void;
  isRunning: () => boolean;
}

export function createStageAmbience(): StageAmbienceController {
  let ctx: AudioContext | null = null;
  let running = false;
  let rafId = 0;
  let masterGain: GainNode | null = null;
  let analyser: AnalyserNode | null = null;
  let oscs: OscillatorNode[] = [];

  const sampleLoop = () => {
    if (!running || !analyser) return;
    const buf = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(buf);
    let sumSq = 0;
    for (let i = 0; i < buf.length; i++) {
      const centered = (buf[i] - 128) / 128;
      sumSq += centered * centered;
    }
    const rms = Math.min(1, Math.sqrt(sumSq / buf.length) * 3.8 + 0.18 * Math.sin(performance.now() * 0.004));
    const clamped = Math.max(0.12, Math.min(0.85, rms));
    setLevel(clamped);
    useStageStore.getState().setAudioLevel(clamped);
    rafId = window.requestAnimationFrame(sampleLoop);
  };

  const start = () => {
    if (running || typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    ctx = new AudioCtx();
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 0.8);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(340, ctx.currentTime);

    analyser = ctx.createAnalyser();
    analyser.fftSize = 128;

    // Acorde grave cinematográfico de abertura de palco (Dó2, Sol2, Ré3, Mi3)
    const freqs = [65.41, 98.0, 146.83, 164.81];
    oscs = freqs.map((f, i) => {
      const osc = ctx!.createOscillator();
      osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(f, ctx!.currentTime);
      osc.detune.setValueAtTime((i - 1.5) * 6, ctx!.currentTime);
      osc.connect(filter);
      osc.start();
      return osc;
    });

    filter.connect(masterGain);
    masterGain.connect(analyser);
    analyser.connect(ctx.destination);

    running = true;
    useStageStore.getState().setAmbientSoundOn(true);
    rafId = window.requestAnimationFrame(sampleLoop);
  };

  const stop = () => {
    if (!running) return;
    running = false;
    window.cancelAnimationFrame(rafId);
    oscs.forEach((o) => {
      try {
        o.stop();
        o.disconnect();
      } catch {
        // ignore already stopped oscillator
      }
    });
    oscs = [];
    if (ctx) {
      ctx.close().catch(() => {});
      ctx = null;
    }
    setLevel(0);
    useStageStore.getState().setAudioLevel(0);
    useStageStore.getState().setAmbientSoundOn(false);
  };

  return {
    start,
    stop,
    isRunning: () => running,
  };
}
