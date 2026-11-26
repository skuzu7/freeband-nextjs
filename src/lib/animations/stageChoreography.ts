// src/lib/animations/stageChoreography.ts
// Orquestração de scroll suave (Lenis) sincronizada ao ticker do GSAP e ao ScrollTrigger,
// alimentando o useStageStore com progresso de scroll, ato ativo, época temática em foco
// e microinterações magnéticas nos CTAs.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';
import { useStageStore, type StageEraTheme } from '@/stores/useStageStore';

let registered = false;

function ensureGsapPlugins() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create('stageLight', 'M0,0 C0.16,1 0.3,1 1,1');
  CustomEase.create('stageSlide', 'M0,0 C0.7,0 0.2,1 1,1');
  registered = true;
}

/**
 * Inicializa Lenis + GSAP ScrollTrigger + detecção de época dos blocos temáticos +
 * botões magnéticos. Retorna função de limpeza completa (`dispose`) para desmontagem segura.
 */
export function initStageChoreography(): () => void {
  if (typeof window === 'undefined') return () => {};
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return () => {};

  ensureGsapPlugins();

  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
  });

  const onLenisScroll = (e: { progress: number; velocity: number }) => {
    ScrollTrigger.update();
    useStageStore.getState().setScrollTelemetry(e.progress, e.velocity * 0.05);
  };

  lenis.on('scroll', onLenisScroll);

  const tickerCallback = (timeSec: number) => {
    lenis.raf(timeSec * 1000);
  };
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  // Sincroniza a época cromática do palco 3D quando cada bloco temático (#blocos) entra em foco
  const triggers: ScrollTrigger[] = [];
  const eraElements = document.querySelectorAll<HTMLElement>('[data-stage-era]');
  eraElements.forEach((el) => {
    const era = (el.dataset.stageEra as StageEraTheme) || 'default';
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 65%',
      end: 'bottom 35%',
      onEnter: () => useStageStore.getState().setActiveEra(era),
      onEnterBack: () => useStageStore.getState().setActiveEra(era),
      onLeave: () => {
        if (useStageStore.getState().activeEra === era) {
          useStageStore.getState().setActiveEra('default');
        }
      },
      onLeaveBack: () => {
        if (useStageStore.getState().activeEra === era) {
          useStageStore.getState().setActiveEra('default');
        }
      },
    });
    triggers.push(st);
  });

  // Microinteração magnética suave para CTAs marcados com [data-magnetic]
  const magnetics = [...document.querySelectorAll<HTMLElement>('[data-magnetic]')];
  const cleanups: Array<() => void> = [];

  if (window.matchMedia?.('(pointer: fine)').matches) {
    magnetics.forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'stageLight' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'stageLight' });

      const onMove = (ev: PointerEvent) => {
        const rect = btn.getBoundingClientRect();
        const dx = (ev.clientX - (rect.left + rect.width * 0.5)) * 0.22;
        const dy = (ev.clientY - (rect.top + rect.height * 0.5)) * 0.22;
        xTo(dx);
        yTo(dy);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };
      btn.addEventListener('pointermove', onMove, { passive: true });
      btn.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        btn.removeEventListener('pointermove', onMove);
        btn.removeEventListener('pointerleave', onLeave);
        gsap.set(btn, { x: 0, y: 0 });
      });
    });
  }

  return () => {
    cleanups.forEach((fn) => fn());
    triggers.forEach((st) => st.kill());
    gsap.ticker.remove(tickerCallback);
    lenis.destroy();
  };
}
