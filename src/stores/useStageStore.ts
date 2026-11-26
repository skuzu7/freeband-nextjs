// src/stores/useStageStore.ts
// Estado global compartilhado entre o DOM (HTML SSR + seções + controles HUD) e o
// palco 3D (WebGPU/WebGL2 + câmera CatmullRomCurve3 + iluminação por época).
import { create } from 'zustand';
import type { StageViewMode } from '@/lib/led/wall';

export type StageActId = '01-hero' | '02-caminhao' | '03-blocos' | '04-prova' | '05-contato';

export type StageEraTheme = 'default' | 'anos-50' | 'anos-70' | 'country' | 'cabare';

export type DeviceGpuTier = 1 | 2 | 3;

export interface StageStoreState {
  /** Progresso normalizado do scroll da página (0 no topo, 1 no rodapé). */
  scrollProgress: number;
  /** Velocidade instantânea do scroll normalizada (-1 a +1) vinda do Lenis. */
  scrollVelocity: number;
  /** Ato narrativo ativo na timeline cinematográfica. */
  activeAct: StageActId;
  /** Atmosfera cromática ativa conforme o bloco temático em foco. */
  activeEra: StageEraTheme;
  /** Modo de projeção do painel LED 3D ('auto' | 'matrix' | 'stage'). */
  viewMode: StageViewMode;
  /** Tier de GPU detectado via detect-gpu (1 = Baixo/Fallback, 2 = Médio, 3 = Alto). */
  gpuTier: DeviceGpuTier;
  /** Backend gráfico ativo ('webgpu' | 'webgl2' | 'poster-fallback'). */
  rendererBackend: 'webgpu' | 'webgl2' | 'poster-fallback';
  /** Som ambiente opcional de palco (sempre desligado por padrão). */
  ambientSoundOn: boolean;
  /** Nível RMS do som ao vivo ou sintetizador ambiente (0..1). */
  audioLevel: number;
  /** Coordenadas normalizadas do cursor (-1..+1). */
  pointer: { x: number; y: number; active: boolean };
  /** Progresso de inicialização dos recursos 3D (0..100). */
  preloadProgress: number;
  preloadDone: boolean;

  setScrollTelemetry: (progress: number, velocity?: number) => void;
  setActiveAct: (act: StageActId) => void;
  setActiveEra: (era: StageEraTheme) => void;
  setViewMode: (mode: StageViewMode) => void;
  setGpuCapability: (tier: DeviceGpuTier, backend: 'webgpu' | 'webgl2' | 'poster-fallback') => void;
  setAmbientSoundOn: (on: boolean) => void;
  setAudioLevel: (level: number) => void;
  setPointer: (x: number, y: number, active: boolean) => void;
  setPreload: (progress: number, done: boolean) => void;
}

/**
 * Mapeia o progresso de scroll (0..1) para o ato correspondente do storyboard:
 * - 0.00 – 0.18: 01-hero (Abertura Monumental do Pórtico de LED)
 * - 0.18 – 0.44: 02-caminhao (Engenharia de Estrada & Box-Truss)
 * - 0.44 – 0.68: 03-blocos (Travessia pelas 4 Épocas)
 * - 0.68 – 0.86: 04-prova (Clímax Ao Vivo Reativo ao Áudio)
 * - 0.86 – 1.00: 05-contato (Horizonte de Reserva & Briefing)
 */
export function actForScrollProgress(progress: number): StageActId {
  const p = Math.max(0, Math.min(1, progress));
  if (p < 0.18) return '01-hero';
  if (p < 0.44) return '02-caminhao';
  if (p < 0.68) return '03-blocos';
  if (p < 0.86) return '04-prova';
  return '05-contato';
}

export const useStageStore = create<StageStoreState>((set) => ({
  scrollProgress: 0,
  scrollVelocity: 0,
  activeAct: '01-hero',
  activeEra: 'default',
  viewMode: 'auto',
  gpuTier: 2,
  rendererBackend: 'webgl2',
  ambientSoundOn: false,
  audioLevel: 0,
  pointer: { x: 0, y: 0, active: false },
  preloadProgress: 100,
  preloadDone: true,

  setScrollTelemetry: (progress, velocity = 0) => {
    const clamped = Math.max(0, Math.min(1, progress));
    set({
      scrollProgress: clamped,
      scrollVelocity: Math.max(-1, Math.min(1, velocity)),
      activeAct: actForScrollProgress(clamped),
    });
  },
  setActiveAct: (activeAct) => set({ activeAct }),
  setActiveEra: (activeEra) => set({ activeEra }),
  setViewMode: (viewMode) => set({ viewMode }),
  setGpuCapability: (gpuTier, rendererBackend) => set({ gpuTier, rendererBackend }),
  setAmbientSoundOn: (ambientSoundOn) => set({ ambientSoundOn }),
  setAudioLevel: (audioLevel) => set({ audioLevel: Math.max(0, Math.min(1, audioLevel)) }),
  setPointer: (x, y, active) => set({ pointer: { x, y, active } }),
  setPreload: (preloadProgress, preloadDone) => set({ preloadProgress, preloadDone }),
}));
