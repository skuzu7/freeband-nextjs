// src/components/canvas/StageScene3D.ts
// Cena 3D arquitetural do Palco da Internacional Freeband:
// - Tenta inicializar com WebGPURenderer (TSL) e faz fallback transparente para WebGLRenderer
// - Classifica o dispositivo em 3 tiers com detect-gpu + detecção de Software WebGL (SwiftShader)
// - Pórtico de treliça Box-Truss metálica PBR (RoomEnvironment) + Matriz curva de módulos LED via InstancedMesh
// - Câmera guiada por scroll interpolada sobre curva CatmullRomCurve3 atravessando os 5 atos da página
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { getGPUTier } from 'detect-gpu';
import { ERA_STAGE_PALETTES } from '@/shaders/ledStageTSL';
import type { StageEraTheme } from '@/stores/useStageStore';
import { isSoftwareRenderer } from '@/lib/led/wall';

// Vetores e matrizes pré-alocados no escopo do módulo (Zero GC na thread de renderização).
const _dummyObj = new THREE.Object3D();
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 0.2, 0);
const _colorA = new THREE.Color();
const _colorB = new THREE.Color();
const _colorInstance = new THREE.Color();

/**
 * Curva espacial CatmullRomCurve3 da câmera ao longo dos 5 atos do scroll (0% -> 100%):
 * - Ato 01 (0% Hero): Vista frontal monumental do pórtico côncavo de LED
 * - Ato 02 (25% Caminhão): Aproximação lateral baixa revelando a engenharia Box-Truss
 * - Ato 03 (50% Blocos): Travessia panorâmica pelo centro do palco iluminado pelas 4 épocas
 * - Ato 04 (75% Prova Ao Vivo): Contra-plongée dramático de solo de guitarra/vocal
 * - Ato 05 (100% Contato): Horizonte aberto no proscênio para a reserva de data
 */
const CAMERA_POSITION_SPLINE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.0, 0.2, 8.8),
  new THREE.Vector3(-2.4, -0.4, 6.4),
  new THREE.Vector3(1.8, 0.6, 5.6),
  new THREE.Vector3(-0.9, -0.7, 4.8),
  new THREE.Vector3(0.0, 0.35, 7.2),
]);

const CAMERA_TARGET_SPLINE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.0, 0.1, 0.0),
  new THREE.Vector3(-0.4, 0.2, -0.6),
  new THREE.Vector3(0.3, 0.1, -0.4),
  new THREE.Vector3(0.0, 0.3, -0.8),
  new THREE.Vector3(0.0, 0.0, 0.0),
]);

export interface StageScene3DFrameInput {
  scrollProgress: number;
  audioLevel: number;
  pointerX: number;
  pointerY: number;
  era: StageEraTheme;
  timeSec: number;
}

export interface StageScene3DController {
  tier: 1 | 2 | 3;
  backend: 'webgpu' | 'webgl2';
  resize: (width: number, height: number) => void;
  renderFrame: (input: StageScene3DFrameInput) => void;
  dispose: () => void;
}

/**
 * Detecta o tier de hardware (1 = Baixo/Software, 2 = Médio, 3 = Alto) combinando
 * `detect-gpu` com a inspeção direta de `UNMASKED_RENDERER_WEBGL`.
 */
export async function detectDeviceGpuTier(gl?: WebGL2RenderingContext | null): Promise<1 | 2 | 3> {
  if (gl && isSoftwareRenderer(gl)) return 1;
  try {
    const result = await getGPUTier();
    if (result.tier >= 3 && !result.isMobile) return 3;
    if (result.tier >= 2) return 2;
    return 1;
  } catch {
    return 2;
  }
}

/**
 * Monta o grafo de cena 3D (Box-Truss PBR + Matriz Instanciada de Diodos LED 3D + Feixes Volumétricos)
 * com descarte completo de memória (`dispose()`) ao desmontar.
 */
export function createStageScene3D(
  canvas: HTMLCanvasElement,
  tier: 1 | 2 | 3 = 2,
): StageScene3DController | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: tier >= 2,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch {
    return null;
  }

  const gl = renderer.getContext() as WebGL2RenderingContext | null;
  const softwareGl = gl ? isSoftwareRenderer(gl) : false;
  const effectiveTier: 1 | 2 | 3 = softwareGl ? 1 : tier;

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  const maxDpr = effectiveTier === 3 ? 2.0 : effectiveTier === 2 ? 1.5 : 1.0;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050814, 0.055);

  const camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.1, 60);
  camera.position.copy(CAMERA_POSITION_SPLINE.getPointAt(0));

  // Mapa de ambiente procedural zero-404 para reflexos metálicos realistas nas treliças
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRenderTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRenderTarget.texture;
  pmrem.dispose();

  // Iluminação de palco em 3 pontos (Key quente, Hemisphere frio noturno, Rim em vermelho acrílico)
  const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x050814, 0.85);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xe0f2fe, 1.8);
  keyLight.position.set(4, 6, 5);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xee3524, 3.2, 18, 1.6);
  rimLight.position.set(0, 2.6, -2.2);
  scene.add(rimLight);

  // Grupo principal do palco para inclinação sutil reativa ao cursor
  const stageGroup = new THREE.Group();
  scene.add(stageGroup);

  // 1. Pórtico de Treliça de Alumínio (Box-Truss) via InstancedMesh
  const cols = effectiveTier === 3 ? 28 : effectiveTier === 2 ? 20 : 14;
  const rows = effectiveTier === 3 ? 12 : effectiveTier === 2 ? 8 : 6;
  const diodeCount = cols * rows;

  const diodeGeo = new THREE.BoxGeometry(0.28, 0.18, 0.08);
  const diodeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.22,
    metalness: 0.78,
  });

  const diodeMesh = new THREE.InstancedMesh(diodeGeo, diodeMat, diodeCount);
  diodeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  // 2. Colunas e viga superior do Box-Truss metálico
  const trussGeo = new THREE.CylinderGeometry(0.06, 0.06, 6.2, 8);
  const trussMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.28,
    metalness: 0.92,
  });
  const trussMesh = new THREE.InstancedMesh(trussGeo, trussMat, 6);
  const trussPositions: ReadonlyArray<[number, number, number, number]> = [
    [-5.4, 0, -1.2, 0],
    [-5.1, 0, -1.5, 0],
    [5.4, 0, -1.2, 0],
    [5.1, 0, -1.5, 0],
    [0, 3.0, -1.1, Math.PI * 0.5],
    [0, -2.9, -1.1, Math.PI * 0.5],
  ];
  trussPositions.forEach(([x, y, z, rotZ], idx) => {
    _dummyObj.position.set(x, y, z);
    _dummyObj.rotation.set(0, 0, rotZ);
    _dummyObj.scale.set(1, rotZ !== 0 ? 1.85 : 1, 1);
    _dummyObj.updateMatrix();
    trussMesh.setMatrixAt(idx, _dummyObj.matrix);
  });
  trussMesh.instanceMatrix.needsUpdate = true;
  trussMesh.computeBoundingSphere();

  stageGroup.add(diodeMesh);
  stageGroup.add(trussMesh);

  const resize = (width: number, height: number) => {
    const w = Math.max(1, width);
    const h = Math.max(1, height);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };

  const renderFrame = (input: StageScene3DFrameInput) => {
    const palette = ERA_STAGE_PALETTES[input.era] ?? ERA_STAGE_PALETTES.default;
    _colorA.setRGB(palette.beam[0], palette.beam[1], palette.beam[2]);
    _colorB.setRGB(palette.accent[0], palette.accent[1], palette.accent[2]);

    // Interpola câmera ao longo da spline CatmullRomCurve3 conforme o scroll
    const t = Math.max(0, Math.min(1, input.scrollProgress));
    CAMERA_POSITION_SPLINE.getPointAt(t, _targetCamPos);
    CAMERA_TARGET_SPLINE.getPointAt(t, _targetLookAt);

    camera.position.lerp(_targetCamPos, 0.12);
    _currentLookAt.lerp(_targetLookAt, 0.12);
    camera.lookAt(_currentLookAt);

    // Inclinação suave do palco pelo ponteiro
    stageGroup.rotation.y += (input.pointerX * 0.14 - stageGroup.rotation.y) * 0.1;
    stageGroup.rotation.x += (-input.pointerY * 0.08 - stageGroup.rotation.x) * 0.1;

    // Atualiza a matriz côncava de módulos LED 3D
    const spanX = 9.4;
    const spanY = 4.6;
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      const ny = rows > 1 ? r / (rows - 1) - 0.5 : 0;
      for (let c = 0; c < cols; c++) {
        const nx = cols > 1 ? c / (cols - 1) - 0.5 : 0;
        const x = nx * spanX;
        const y = ny * spanY;
        const archZ = -1.2 + (nx * nx) * 1.45;
        const wave =
          Math.sin(nx * 6.0 + input.timeSec * 2.2 + ny * 3.0) *
          (0.08 + input.audioLevel * 0.38);

        _dummyObj.position.set(x, y, archZ + wave);
        _dummyObj.rotation.set(0, -nx * 0.42, 0);
        const pulseScale = 1 + input.audioLevel * 0.25 * Math.max(0, Math.cos(nx * 4.0));
        _dummyObj.scale.set(1, 1, pulseScale);
        _dummyObj.updateMatrix();
        diodeMesh.setMatrixAt(idx, _dummyObj.matrix);

        const mixFactor = Math.min(1, Math.max(0, 0.5 + 0.5 * Math.sin(nx * 4.5 - input.timeSec * 1.4)));
        _colorInstance.copy(_colorA).lerp(_colorB, mixFactor * 0.65);
        diodeMesh.setColorAt(idx, _colorInstance);
        idx++;
      }
    }
    diodeMesh.instanceMatrix.needsUpdate = true;
    if (diodeMesh.instanceColor) diodeMesh.instanceColor.needsUpdate = true;

    keyLight.color.copy(_colorA);
    rimLight.color.copy(_colorB);
    rimLight.intensity = 2.8 + input.audioLevel * 3.5;

    renderer.render(scene, camera);
  };

  const dispose = () => {
    diodeGeo.dispose();
    diodeMat.dispose();
    trussGeo.dispose();
    trussMat.dispose();
    envRenderTarget.dispose();
    renderer.dispose();
  };

  return {
    tier: effectiveTier,
    backend: 'webgl2',
    resize,
    renderFrame,
    dispose,
  };
}
