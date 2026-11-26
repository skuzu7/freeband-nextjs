// src/shaders/ledStageTSL.ts
// Shader-assinatura em TSL (Three.js Shading Language) que compila nativamente para
// WGSL (WebGPURenderer) e GLSL (WebGLRenderer), além das paletas cromáticas por época.
//
// Matemática óptica implementada:
// 1. Curvatura cilíndrica côncava do pórtico LED (parábola horizontal sobre o eixo X)
// 2. Deslocamento axial Z por instância guiado pela luminância e pelo envelope RMS de áudio
// 3. Iluminação Fresnel em vermelho acrílico (#ee3524) combinada ao feixe da era ativa
import * as THREE from 'three/webgpu';
import {
  color,
  float,
  Fn,
  mix,
  normalWorld,
  positionLocal,
  positionWorld,
  sin,
  smoothstep,
  time,
  uniform,
  uv,
  vec3,
  cameraPosition,
} from 'three/tsl';
import type { StageEraTheme } from '@/stores/useStageStore';

export interface EraPaletteRGB {
  /** Cor primária dos feixes de palco (0..1 RGB). */
  beam: [number, number, number];
  /** Cor de realce quente / secundária (0..1 RGB). */
  accent: [number, number, number];
  /** Nome técnico exibido no console de telemetria. */
  label: string;
}

/**
 * Paletas de luz calibradas para cada ato e bloco temático da Freeband:
 * - default: Azul Painel LED (oklch 70% 0.16 240) + Vermelho Acrílico (#ee3524)
 * - anos-50: Ouro Vintage & Âmbar Quente de Salão
 * - anos-70: Prisma Disco (Magenta Elétrico + Ciano Espelhado)
 * - country: Cobre Neon & Vermelho Arena
 * - cabare: Carmim Profundo & Ouro Champagne
 */
export const ERA_STAGE_PALETTES: Record<StageEraTheme, EraPaletteRGB> = {
  default: {
    beam: [0.18, 0.68, 0.98],
    accent: [0.933, 0.208, 0.141],
    label: 'Azul Matriz LED · Acrílico #EE3524',
  },
  'anos-50': {
    beam: [0.98, 0.74, 0.28],
    accent: [0.95, 0.42, 0.18],
    label: 'Bloco 01 · Anos 50 · Ouro & Âmbar',
  },
  'anos-70': {
    beam: [0.24, 0.86, 0.98],
    accent: [0.94, 0.22, 0.68],
    label: 'Bloco 02 · Anos 70 · Prisma Disco',
  },
  country: {
    beam: [0.96, 0.52, 0.16],
    accent: [0.933, 0.208, 0.141],
    label: 'Bloco 03 · Country · Neon Arena',
  },
  cabare: {
    beam: [0.933, 0.208, 0.141],
    accent: [0.98, 0.78, 0.36],
    label: 'Bloco 04 · Cabaré · Carmim & Plumas',
  },
};

/**
 * Constrói o material PBR Node (`MeshStandardNodeMaterial`) em TSL para os módulos
 * instanciados do pórtico LED 3D no `WebGPURenderer`.
 */
export function createLedStageTSLMaterial() {
  const uScrollProgress = uniform(0);
  const uAudioLevel = uniform(0);
  const uBeamColor = uniform(new THREE.Color(0.18, 0.68, 0.98));
  const uAccentColor = uniform(new THREE.Color(0.933, 0.208, 0.141));
  const uCurvature = uniform(0.24);

  const material = new THREE.MeshStandardNodeMaterial({
    roughness: 0.22,
    metalness: 0.78,
  });

  // Deslocamento harmônico dos módulos 3D: combina curvatura parabólica de palco
  // com onda acústica reativa ao envelope RMS de áudio e ao tempo.
  const displacedPosition = Fn(() => {
    const pos = positionLocal.toVar();
    const wavePhase = pos.x.mul(1.8).add(pos.y.mul(1.2)).sub(time.mul(2.6));
    const acousticPulse = sin(wavePhase).mul(float(0.08).add(uAudioLevel.mul(0.32)));
    const archCurve = pos.x.mul(pos.x).mul(uCurvature).negate();
    return vec3(pos.x, pos.y, pos.z.add(acousticPulse).add(archCurve));
  });

  // Emissão luminosa TSL: mistura o feixe principal da era com borda Fresnel em vermelho acrílico.
  const emissiveStageNode = Fn(() => {
    const viewDir = cameraPosition.sub(positionWorld).normalize();
    const ndotv = normalWorld.dot(viewDir).clamp(0.0, 1.0);
    const fresnel = float(1.0).sub(ndotv).pow(2.6);

    const verticalScan = smoothstep(
      float(-0.4),
      float(0.9),
      sin(uv().y.mul(12.0).sub(time.mul(1.8)).add(uScrollProgress.mul(6.28))),
    );

    const coreGlow = mix(uBeamColor, uAccentColor, fresnel.mul(0.75));
    const energy = float(0.45).add(verticalScan.mul(0.55)).add(uAudioLevel.mul(0.85));
    return coreGlow.mul(energy);
  });

  material.positionNode = displacedPosition();
  material.colorNode = color(0x0b1021);
  material.emissiveNode = emissiveStageNode();

  return {
    material,
    uniforms: {
      uScrollProgress,
      uAudioLevel,
      uBeamColor,
      uAccentColor,
      uCurvature,
    },
  };
}
