import { describe, expect, it } from 'vitest';
import { actForScrollProgress, useStageStore } from '../useStageStore';

describe('useStageStore & actForScrollProgress', () => {
  it('maps scroll progress (0..1) deterministically across the 5 stage acts', () => {
    expect(actForScrollProgress(0)).toBe('01-hero');
    expect(actForScrollProgress(0.15)).toBe('01-hero');
    expect(actForScrollProgress(0.25)).toBe('02-caminhao');
    expect(actForScrollProgress(0.55)).toBe('03-blocos');
    expect(actForScrollProgress(0.75)).toBe('04-prova');
    expect(actForScrollProgress(0.95)).toBe('05-contato');
  });

  it('updates scroll telemetry, era theme, and audio level cleanly in the store', () => {
    const store = useStageStore.getState();
    store.setScrollTelemetry(0.52, 0.3);
    expect(useStageStore.getState().activeAct).toBe('03-blocos');
    expect(useStageStore.getState().scrollProgress).toBeCloseTo(0.52);

    store.setActiveEra('anos-70');
    expect(useStageStore.getState().activeEra).toBe('anos-70');

    store.setAudioLevel(0.68);
    expect(useStageStore.getState().audioLevel).toBeCloseTo(0.68);

    // Reset
    store.setScrollTelemetry(0, 0);
    store.setActiveEra('default');
    store.setAudioLevel(0);
  });
});
