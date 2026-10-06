// src/lib/led/wall.ts
// The LED wall on the fold, drawn by the GPU: one canvas, one quad, one
// fragment shader. The shader lays a grid of dots over the stage footage and
// reads the picture once per dot, so the wall shows the band the way their
// own panel would — and as `resolve` goes from 0 to 1 the dots swell, merge
// and hand over to the picture itself.
//
// No library: the whole renderer is the two shaders below and a texture
// upload per frame. createLedWall returns null wherever WebGL2 is missing or
// the program does not link, and the caller then simply keeps the poster.

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
uniform float resolve;     // 0 = panel of dots, 1 = the picture
uniform vec3 pointer;      // x, y in device px from the top-left; z = strength
uniform float reach;       // how far the pointer turns the picture back to dots
uniform float level;       // how loud the music is, 0..1
uniform vec3 dimColor;
uniform vec3 ledColor;
uniform vec3 hotColor;
uniform vec3 groundColor;
out vec4 colour;

// object-fit: cover, as the poster under the canvas is laid out.
vec2 cover(vec2 p) {
  vec2 uv = p / canvasSize;
  float canvasRatio = canvasSize.x / canvasSize.y;
  float pictureRatio = pictureSize.x / pictureSize.y;
  if (canvasRatio > pictureRatio) uv.y = (uv.y - 0.5) * (pictureRatio / canvasRatio) + 0.5;
  else uv.x = (uv.x - 0.5) * (canvasRatio / pictureRatio) + 0.5;
  return uv;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, canvasSize.y - gl_FragCoord.y);
  vec2 centre = (floor(p / pitch) + 0.5) * pitch;

  vec3 whole = texture(picture, cover(p)).rgb;
  vec3 cell = texture(picture, cover(centre)).rgb;
  // Stage footage is mostly dark: stretch it so the mid-tones light a dot.
  float light = smoothstep(0.03, 0.8, dot(cell, vec3(0.2126, 0.7152, 0.0722)));

  // Near the pointer the picture falls back to dots.
  float near = 1.0 - smoothstep(0.0, reach, distance(p, pointer.xy));
  float m = clamp(resolve - pointer.z * near, 0.0, 1.0);

  float d = distance(p, centre) / pitch;
  // A dot is as big as its cell is bright; resolving, it grows past the cell.
  float radius = mix(0.12 + 0.32 * light, 0.78, m * m) * (1.0 + 0.18 * level * (1.0 - m));
  float edge = 1.2 / pitch;
  float lit = 1.0 - smoothstep(radius - edge, radius + edge, d);

  vec3 led = mix(dimColor, ledColor, smoothstep(0.0, 0.7, light));
  led = mix(led, hotColor, smoothstep(0.7, 1.0, light));
  led += ledColor * exp(-d * d * 9.0) * light * 0.25 * (1.0 + level);

  vec3 panel = mix(groundColor, led, lit);
  colour = vec4(mix(panel, whole, smoothstep(0.25, 1.0, m)), 1.0);
}`;

export type Rgb = readonly [number, number, number];

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
}

export interface LedWall {
  /** Matches the drawing buffer to the canvas's CSS box. */
  resize(cssWidth: number, cssHeight: number, dpr: number): void;
  /** Uploads the current picture: a poster <img> or a playing <video>. */
  upload(source: TexImageSource, width: number, height: number): void;
  draw(frame: WallFrame): void;
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
 * Sets the wall up on `canvas`. `pitchCss` is the distance between dots and
 * `reachCss` how far the pointer's effect extends, both in CSS px.
 */
export function createLedWall(
  canvas: HTMLCanvasElement,
  palette: WallPalette,
  pitchCss = 10,
  reachCss = 240,
): LedWall | null {
  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' });
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

  // One triangle strip covering the clip space.
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
  };
  ctx.uniform1i(at('picture'), 0);
  ctx.uniform3fv(at('dimColor'), palette.dim);
  ctx.uniform3fv(at('ledColor'), palette.led);
  ctx.uniform3fv(at('hotColor'), palette.hot);
  ctx.uniform3fv(at('groundColor'), palette.ground);

  let scale = 1;
  let hasPicture = false;

  return {
    resize(cssWidth, cssHeight, dpr) {
      scale = dpr;
      const width = Math.max(1, Math.round(cssWidth * dpr));
      const height = Math.max(1, Math.round(cssHeight * dpr));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      ctx.viewport(0, 0, width, height);
      ctx.uniform2f(uniform.canvasSize, width, height);
      ctx.uniform1f(uniform.pitch, pitchCss * dpr);
      ctx.uniform1f(uniform.reach, reachCss * dpr);
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
      ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
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
