// src/lib/led/wall.ts
// The 3D Volumetric LED Stage Wall on the fold, drawn by the GPU: one canvas,
// one quad, one WebGL2 fragment shader. The shader projects the stage footage
// onto a curved 3D concave LED matrix with hemispherical lens normals,
// physically inspired Fresnel/specular rim reflections, Z-depth luminance
// relief, and overhead volumetric stage beams — resolving smoothly into the
// live stage picture and breaking back into 3D dots under the pointer or as
// the visitor scrolls through the narrative storyboard (S0 → S5).
//
// Zero external 3D library dependencies: createLedWall returns null wherever
// WebGL2 is missing or fails to link, and the caller keeps the server poster.

const VERTEX = `#version 300 es
in vec2 corner;
void main() {
  gl_Position = vec4(corner, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;

uniform sampler2D picture;
uniform vec2 canvasSize;   // device px
uniform vec2 pictureSize;  // source px
uniform float pitch;       // dot pitch, device px
uniform float resolve;     // 0 = 3D panel of dots, 1 = the picture
uniform vec3 pointer;      // x, y in device px from top-left; z = strength (0..1)
uniform float reach;       // pointer radius in device px
uniform float level;       // music envelope level, 0..1
uniform float time;        // elapsed seconds
uniform float curvature;   // 3D stage concavity & perspective strength
uniform float beamPower;   // overhead volumetric stage beam intensity
uniform float quality;     // 1.0 = Tier C, 2.0 = Tier B, 3.0 = Tier A
uniform vec3 dimColor;
uniform vec3 ledColor;
uniform vec3 hotColor;
uniform vec3 groundColor;
uniform vec3 redColor;
out vec4 colour;

// 3D concave stage cylindrical projection + autonomous orbit & pointer camera rig tilt.
vec2 stageProject(vec2 p, out float depthFactor, out vec2 tiltShift, out vec2 ndcOut) {
  vec2 ndc = (p / canvasSize) * 2.0 - 1.0;
  ndcOut = ndc;
  vec2 ptrNdc = (pointer.xy / max(canvasSize, vec2(1.0))) * 2.0 - 1.0;
  vec2 autoOrbit = vec2(sin(time * 0.65), cos(time * 0.48)) * (1.0 - pointer.z * 0.7) * 0.45;
  vec2 rigVec = mix(autoOrbit, ptrNdc, pointer.z);
  tiltShift = rigVec * 0.042 * curvature;

  // Concave stage arc: edges curve noticeably toward the viewer in 3D space.
  float r2 = dot(ndc, ndc);
  float curve = 1.0 + curvature * 0.095 * (ndc.x * ndc.x * 0.75 + ndc.y * ndc.y * 0.35);
  depthFactor = clamp(1.0 - r2 * 0.22 * curvature, 0.72, 1.18);

  vec2 warped = (ndc / curve + tiltShift) * 0.5 + 0.5;
  return clamp(warped, 0.0, 1.0) * canvasSize;
}

// object-fit: cover, matching the server-rendered poster underneath.
vec2 cover(vec2 p) {
  vec2 uv = clamp(p / canvasSize, 0.0, 1.0);
  float canvasRatio = canvasSize.x / canvasSize.y;
  float pictureRatio = pictureSize.x / pictureSize.y;
  if (canvasRatio > pictureRatio) uv.y = (uv.y - 0.5) * (pictureRatio / canvasRatio) + 0.5;
  else uv.x = (uv.x - 0.5) * (canvasRatio / pictureRatio) + 0.5;
  return clamp(uv, 0.0, 1.0);
}

void main() {
  vec2 rawP = vec2(gl_FragCoord.x, canvasSize.y - gl_FragCoord.y);
  float depthFactor = 1.0;
  vec2 tiltShift = vec2(0.0);
  vec2 ndc = vec2(0.0);
  vec2 p = stageProject(rawP, depthFactor, tiltShift, ndc);

  // Near the pointer: in Auto 3D / Matrix mode (resolve < 0.5), the pointer acts
  // as an interactive 3D optical spotlight lens revealing the live stage picture
  // inside the 3D LED matrix; in Vídeo Puro mode (resolve >= 0.5), the pointer
  // breaks the video back into 3D tactile LED domes.
  float distToPtr = distance(rawP, pointer.xy);
  float near = 1.0 - smoothstep(0.0, reach, distToPtr);

  float wingMask = smoothstep(0.15, 0.90, length(ndc * vec2(0.95, 0.75)));
  float scanBand = 0.5 + 0.5 * sin(ndc.x * 3.2 - ndc.y * 2.1 + time * 1.15);
  float centerSpotlight = (1.0 - wingMask) * (0.35 + 0.25 * scanBand);

  float baseM = resolve < 0.5
    ? clamp(resolve + centerSpotlight * 0.28 + pointer.z * near * 0.68, 0.0, 0.88)
    : clamp(resolve - pointer.z * near * 0.92, 0.0, 1.0);
  float m = baseM;

  // Local 3D pitch modulation: cells swell slightly under pointer & music level.
  float localPitch = pitch * (1.0 + 0.1 * near * pointer.z * (1.0 - m));
  vec2 cellIndex = floor(p / localPitch);
  vec2 centre = (cellIndex + 0.5) * localPitch;

  // Z-depth relief parallax based on cell luminance.
  vec3 cellSample = texture(picture, cover(centre)).rgb;
  float luma = dot(cellSample, vec3(0.2126, 0.7152, 0.0722));
  float light = smoothstep(0.02, 0.80, luma);

  // Organic 3D wave breathing across the LED matrix.
  float wave = sin(cellIndex.x * 0.11 + time * 1.45) * cos(cellIndex.y * 0.09 - time * 1.05);
  float idlePulse = (0.06 + 0.08 * level) * wave * (1.0 - m * 0.65);
  light = clamp(light + idlePulse, 0.0, 1.0);

  vec2 reliefOffset = tiltShift * canvasSize * (light - 0.35) * 0.55 * (1.0 - m);
  vec3 whole = texture(picture, cover(rawP - reliefOffset)).rgb;

  vec2 delta = (p - centre) / localPitch;
  float d = length(delta);

  // 3D LED dome radius: grows with cell brightness + audio level, merges as m -> 1.
  float radius = mix(0.16 + 0.34 * light, 0.79, m * m) * (1.0 + 0.22 * level * (1.0 - m));
  float edge = 1.25 / localPitch;
  float lit = 1.0 - smoothstep(radius - edge, radius + edge, d);

  // Base LED color ramp (night -> led-500 -> led-200 hot).
  vec3 led = mix(dimColor, ledColor, smoothstep(0.0, 0.64, light));
  led = mix(led, hotColor, smoothstep(0.64, 1.0, light));

  // 3D Hemispherical Lens Normal, Specular & Fresnel Rim (all tiers).
  vec2 domeUv = clamp(delta / max(radius, 0.08), -1.0, 1.0);
  float nz = sqrt(max(0.02, 1.0 - dot(domeUv, domeUv)));
  vec3 N = normalize(vec3(domeUv.x, -domeUv.y, nz));
  vec3 L = normalize(vec3(sin(time * 0.65) * 0.4 - tiltShift.x * 4.5, 0.48, 0.80));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0001), 20.0) * (0.4 + 0.6 * light) * (0.35 + 0.25 * quality);
  float fresnel = pow(max(1.0 - max(dot(N, V), 0.0), 0.0001), 2.8);

  led += hotColor * spec * 0.48 * (1.0 - m * 0.65);
  // Acrylic-red stage bounce on grazing angles, scan bands & pointer proximity.
  float redBounce = clamp(0.45 * near * pointer.z + 0.28 * level + 0.22 * scanBand * wingMask, 0.0, 0.85);
  led += mix(ledColor, redColor, redBounce) * fresnel * 0.34 * (0.25 + 0.75 * light);

  // Halo bloom around driven LEDs.
  led += ledColor * exp(-d * d * 7.5) * light * 0.32 * (1.0 + level * 1.15) * depthFactor;

  // Overhead 3D volumetric stage beams across all WebGL tiers.
  if (beamPower > 0.01) {
    vec2 uv = rawP / canvasSize;
    float b1 = (uv.x - 0.24 - uv.y * 0.22 * sin(time * 0.52)) * 3.8;
    float b2 = (uv.x - 0.76 + uv.y * 0.22 * cos(time * 0.44)) * 3.8;
    float b3 = (uv.x - 0.50 + uv.y * 0.15 * sin(time * 0.35 + 1.4)) * 4.5;
    float beam1 = exp(-b1 * b1);
    float beam2 = exp(-b2 * b2);
    float beam3 = exp(-b3 * b3);
    float vFade = clamp(1.0 - uv.y * 0.9, 0.0, 1.0);
    float verticalFade = vFade * sqrt(vFade);
    vec3 beams = (
      ledColor * (beam1 + beam3 * 0.6) +
      mix(ledColor, redColor, 0.55) * beam2
    ) * verticalFade * beamPower * (0.22 + 0.24 * level);
    led += beams * 1.25;
    whole += beams * 0.65;
  }

  vec3 panel = mix(groundColor, led, lit);
  colour = vec4(mix(panel, whole, smoothstep(0.18, 0.95, m)), 1.0);
}`;

export type Rgb = readonly [number, number, number];

export type PerformanceTier = 'A' | 'B' | 'C' | 'D';

export type StageViewMode = 'auto' | 'matrix' | 'stage';

export type StoryboardStageId = 'S0' | 'S1' | 'S2' | 'S3' | 'S4' | 'S5';

export interface StoryboardState {
  id: StoryboardStageId;
  /** 0 = dots, 1 = the picture. */
  resolve: number;
  /** 3D stage concavity & perspective strength (0..1.5). */
  curvature: number;
  /** Overhead volumetric stage beam intensity (0..1). */
  beamPower: number;
}

/** "#rrggbb" → three floats in 0..1. Anything else is black. */
export function hexToRgb(hex: string): Rgb {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  if (!m) return [0, 0, 0];
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255];
}

export interface WallPalette {
  /** An unlit dot. */
  dim: Rgb;
  /** A lit dot. */
  led: Rgb;
  /** A dot driven hard. */
  hot: Rgb;
  /** The panel between the dots. */
  ground: Rgb;
  /** Optional warm acrylic-red stage bounce light. */
  red?: Rgb;
}

export interface WallFrame {
  /** 0 = dots, 1 = the picture. */
  resolve: number;
  /** Pointer in CSS px from the canvas's top-left corner. */
  pointerX: number;
  pointerY: number;
  /** 0 = pointer away, 1 = pointer on the wall. */
  pointerOn: number;
  /** Music level, 0..1. */
  level: number;
  /** Elapsed time in seconds for organic 3D idle motion. */
  time?: number;
  /** 3D stage curvature factor. */
  curvature?: number;
  /** Volumetric stage beam intensity. */
  beamPower?: number;
}

export interface LedWall {
  /** Matches the drawing buffer to the canvas's CSS box. */
  resize(cssWidth: number, cssHeight: number, dpr: number): void;
  /** Uploads the current picture: a poster <img> or a playing <video>. */
  upload(source: TexImageSource, width: number, height: number): void;
  draw(frame: WallFrame): void;
  /** True when running on a CPU/software WebGL rasterizer (SwiftShader/llvmpipe). */
  readonly isSoftwareGl: boolean;
  /** Detected performance tier ('A' | 'B' | 'C'). */
  readonly tier: PerformanceTier;
  /** Schedules `cb` after GPU command completion on software WebGL, or via rAF on hardware GPU. */
  scheduleNextFrame(cb: (now: number) => void): () => void;
  dispose(): void;
}

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

/**
 * Detects whether a WebGL2 context is backed by a software CPU rasterizer
 * (SwiftShader, llvmpipe, softpipe, Basic Render Driver).
 */
export function isSoftwareRenderer(gl: WebGL2RenderingContext): boolean {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

/**
 * Classifies device capability into adaptive rendering tiers:
 * - Tier A: Hardware GPU, >= 4 cores -> Full 3D lens normals, volumetric beams, DPR up to 1.5
 * - Tier B: Hardware GPU, mobile/mid -> 3D lens normals, DPR up to 1.25
 * - Tier C: Software WebGL or low-end -> Fast single-pass LED matrix, DPR 1.0
 * - Tier D: No WebGL2 -> Static/video fallback
 */
export function classifyPerformanceTier(opts: {
  hasWebGL2: boolean;
  isSoftware: boolean;
  cores?: number;
  memoryGb?: number;
  isMobileViewport?: boolean;
}): PerformanceTier {
  if (!opts.hasWebGL2) return 'D';
  if (opts.isSoftware) return 'C';
  const cores = opts.cores ?? 4;
  const mem = opts.memoryGb ?? 4;
  if (cores < 4 || mem < 4) return 'B';
  if (opts.isMobileViewport) return 'B';
  return 'A';
}

/**
 * Sets the 3D volumetric wall up on `canvas`. `pitchCss` is the distance
 * between dots and `reachCss` how far the pointer's effect extends, both in CSS px.
 */
export function createLedWall(
  canvas: HTMLCanvasElement,
  palette: WallPalette,
  pitchCss = 10,
  reachCss = 260,
): LedWall | null {
  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'high-performance' });
  } catch {
    gl = null;
  }
  if (!gl) return null;
  const ctx = gl;

  const vertex = compile(ctx, ctx.VERTEX_SHADER, VERTEX);
  const fragment = compile(ctx, ctx.FRAGMENT_SHADER, FRAGMENT);
  const program = ctx.createProgram();
  if (!vertex || !fragment || !program) return null;
  ctx.attachShader(program, vertex);
  ctx.attachShader(program, fragment);
  ctx.linkProgram(program);
  if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) return null;
  ctx.useProgram(program);

  const software = isSoftwareRenderer(ctx);
  const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & { deviceMemory?: number }) : undefined;
  const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 768;
  const tier = classifyPerformanceTier({
    hasWebGL2: true,
    isSoftware: software,
    cores: nav?.hardwareConcurrency,
    memoryGb: nav?.deviceMemory,
    isMobileViewport,
  });
  const qualityValue = tier === 'A' ? 3.0 : tier === 'B' ? 2.0 : 1.0;

  // One triangle strip covering clip space.
  const quad = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, quad);
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), ctx.STATIC_DRAW);
  const corner = ctx.getAttribLocation(program, 'corner');
  ctx.enableVertexAttribArray(corner);
  ctx.vertexAttribPointer(corner, 2, ctx.FLOAT, false, 0, 0);

  const texture = ctx.createTexture();
  ctx.bindTexture(ctx.TEXTURE_2D, texture);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);

  const at = (name: string) => ctx.getUniformLocation(program, name);
  const uniform = {
    canvasSize: at('canvasSize'),
    pictureSize: at('pictureSize'),
    pitch: at('pitch'),
    resolve: at('resolve'),
    pointer: at('pointer'),
    reach: at('reach'),
    level: at('level'),
    time: at('time'),
    curvature: at('curvature'),
    beamPower: at('beamPower'),
    quality: at('quality'),
  };
  ctx.uniform1i(at('picture'), 0);
  ctx.uniform3fv(at('dimColor'), palette.dim);
  ctx.uniform3fv(at('ledColor'), palette.led);
  ctx.uniform3fv(at('hotColor'), palette.hot);
  ctx.uniform3fv(at('groundColor'), palette.ground);
  ctx.uniform3fv(at('redColor'), palette.red ?? [0.93, 0.21, 0.14]);
  ctx.uniform1f(uniform.quality, qualityValue);

  let scale = 1;
  let hasPicture = false;

  return {
    isSoftwareGl: software,
    tier,
    resize(cssWidth, cssHeight, dpr) {
      const maxDpr = software ? 1 : tier === 'A' ? 1.5 : 1.25;
      scale = Math.min(dpr, maxDpr);
      const width = Math.max(1, Math.round(cssWidth * scale));
      const height = Math.max(1, Math.round(cssHeight * scale));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      ctx.viewport(0, 0, width, height);
      ctx.uniform2f(uniform.canvasSize, width, height);
      ctx.uniform1f(uniform.pitch, pitchCss * scale);
      ctx.uniform1f(uniform.reach, reachCss * scale);
    },
    upload(source, width, height) {
      ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGB, ctx.RGB, ctx.UNSIGNED_BYTE, source);
      ctx.uniform2f(uniform.pictureSize, width, height);
      hasPicture = true;
    },
    draw(frame) {
      if (!hasPicture) return;
      ctx.uniform1f(uniform.resolve, frame.resolve);
      ctx.uniform3f(uniform.pointer, frame.pointerX * scale, frame.pointerY * scale, frame.pointerOn);
      ctx.uniform1f(uniform.level, frame.level);
      ctx.uniform1f(uniform.time, frame.time ?? 0);
      ctx.uniform1f(uniform.curvature, frame.curvature ?? 1.0);
      ctx.uniform1f(uniform.beamPower, frame.beamPower ?? 0.65);
      ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
    },
    scheduleNextFrame(cb) {
      if (!software || typeof ctx.fenceSync !== 'function') {
        const id = requestAnimationFrame(cb);
        return () => cancelAnimationFrame(id);
      }
      let timerId = 0;
      let cancelled = false;
      const sync = ctx.fenceSync(ctx.SYNC_GPU_COMMANDS_COMPLETE, 0);
      ctx.flush();
      const poll = () => {
        if (cancelled) {
          if (sync) ctx.deleteSync(sync);
          return;
        }
        const state = sync ? ctx.getSyncParameter(sync, ctx.SYNC_STATUS) : ctx.SIGNALED;
        if (state === ctx.UNSIGNALED) {
          timerId = window.setTimeout(poll, 8);
        } else {
          if (sync) ctx.deleteSync(sync);
          timerId = window.setTimeout(() => {
            if (!cancelled) cb(performance.now());
          }, 80);
        }
      };
      timerId = window.setTimeout(poll, 8);
      return () => {
        cancelled = true;
        window.clearTimeout(timerId);
        if (sync) {
          try {
            ctx.deleteSync(sync);
          } catch {
            // Context may already be lost or disposed.
          }
        }
      };
    },
    dispose() {
      ctx.deleteTexture(texture);
      ctx.deleteBuffer(quad);
      ctx.deleteProgram(program);
      ctx.deleteShader(vertex);
      ctx.deleteShader(fragment);
    },
  };
}

/**
 * Where the wall sits between dots (0) and picture (1) for a fold that has
 * scrolled `progress` of its own height out of view: the picture holds for the
 * first stretch, then breaks back into dots as the stage leaves.
 */
export function resolveForScroll(progress: number): number {
  const t = Math.min(1, Math.max(0, (progress - 0.1) / 0.7));
  return 1 - t * t * (3 - 2 * t);
}

/**
 * 6-state scroll storyboard (S0 → S5) mapping scroll progress (0..1+) to
 * 3D stage parameters:
 * - S0 (Hero): Full stage picture & volumetric beams
 * - S1 (Exploração): Perspective curvature increases as scroll begins
 * - S2 (Detalhamento): 3D LED domes emerge with specular relief
 * - S3 (Transformação): Picture dissolves into sculptural 3D LED waves
 * - S4 (Integração): Deep LED matrix bridges into the page's LedStage
 * - S5 (Conclusão): Stable unlit/ambient matrix state
 */
export function stageStateForScroll(progress: number, mode: StageViewMode = 'auto'): StoryboardState {
  const p = Math.max(0, progress);
  const baseResolve = resolveForScroll(p);
  const resolve = mode === 'matrix' ? 0.08 : mode === 'stage' ? 0.98 : 0.22 * baseResolve;

  let id: StoryboardStageId = 'S0';
  if (p >= 0.85) id = 'S5';
  else if (p >= 0.65) id = 'S4';
  else if (p >= 0.45) id = 'S3';
  else if (p >= 0.25) id = 'S2';
  else if (p >= 0.1) id = 'S1';

  const bell = Math.sin(Math.min(1, p) * Math.PI);
  const curvature = mode === 'stage' ? 0.0 : 1.15 + 0.45 * bell;
  const beamPower = mode === 'stage' ? 0.25 : Math.max(0.3, 1.0 - p * 0.7);

  return { id, resolve, curvature, beamPower };
}

