// scripts/video/analyze.mjs
// What is in a master, before anyone picks a cut. For each one it writes to
// saidas/video/analise/:
//
//   <master>.contact.jpg     one frame every 5 s, deinterlaced and unsqueezed,
//                            read left to right, top to bottom; each cell
//                            carries its own time in seconds — the same clock
//                            `in` uses in clips.mjs
//   <master>.loudness.json   EBU R128 momentary/short-term loudness and true
//                            peak per second, plus the stretches where the
//                            camera's audio clipped — cuts must stay out of them
//
//   node scripts/video/analyze.mjs [master ...]            all masters by default
//   node scripts/video/analyze.mjs top --from=50 --to=90 --step=1
//                            a closer sheet of one stretch
//                            (<master>.contact-50-90.jpg, no loudness pass)
//   --cols=5 --cell=384      grid columns and cell width in pixels
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ANALYSIS, DEINTERLACE, MASTERS, PRE, masterPath, probe, run } from './workspace.mjs';

const flags = Object.fromEntries(
  process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')),
);
const names = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const STEP = Number(flags.step ?? 5);
const COLS = Number(flags.cols ?? 5);
const CELL_W = Number(flags.cell ?? 384);
const CELL_H = 2 * Math.round((CELL_W * 9) / 32);

// A true peak this close to full scale is the converter running out of room.
const CLIP_DBTP = -0.5;
// ebur128 reports ten frames a second. One hot frame is a snare hit; three in
// a row, or hot frames no further than 0.2 s apart for 0.3 s, is distortion
// one can hear.
const CLIP_MIN_FRAMES = 3;
const CLIP_MAX_GAP = 0.25;

mkdirSync(ANALYSIS, { recursive: true });

function contactSheet(name, file, duration) {
  const from = Number(flags.from ?? 0);
  const to = Math.min(Number(flags.to ?? duration), duration);
  const ranged = flags.from !== undefined || flags.to !== undefined;
  // seek back so the first cell is a clean frame; `lead` is what the filter
  // graph still has to skip, and `seek` puts the master's clock in the label
  const seek = Math.max(0, from - PRE);
  const lead = from - seek;
  const cells = Math.floor((to - from) / STEP - 1e-9) + 1;
  const rows = Math.ceil(cells / COLS);
  const clock = `(t+${seek})`;
  const vf = [
    // deinterlace before picking: bwdif needs the neighbouring fields
    DEINTERLACE,
    `select='gte(t,${lead}+${STEP}*selected_n)'`,
    `scale=${CELL_W}:${CELL_H}:flags=bicubic`,
    'setsar=1',
    // no fontfile: ffmpeg falls back to its built-in face, which is all a
    // timestamp needs
    `drawtext=text='%{eif\\:floor${clock}\\:d}.%{eif\\:floor(mod(${clock}*10\\,10))\\:d}'` +
      `:x=6:y=6:fontsize=${Math.round(CELL_H / 9)}:fontcolor=white:box=1:boxcolor=black@0.65:boxborderw=4`,
    `tile=${COLS}x${rows}:padding=4:margin=4`,
  ].join(',');
  const out = resolve(ANALYSIS, ranged ? `${name}.contact-${from}-${to}.jpg` : `${name}.contact.jpg`);
  run('ffmpeg', [
    '-y', '-v', 'error', ...(seek ? ['-ss', String(seek)] : []), '-t', String(to - seek), '-i', file,
    '-sn', '-an', '-vf', vf, '-frames:v', '1', '-update', '1', '-q:v', '3', out,
  ]);
  console.log(`${name}: ${cells} cells (${COLS}x${rows}, every ${STEP}s from ${from}s) -> ${out}`);
  return !ranged;
}

const db = (s) => (s === '-inf' ? -Infinity : Number(s));
const round1 = (v) => (Number.isFinite(v) ? Math.round(v * 10) / 10 : null);

function loudness(name, file, duration, layout) {
  // measured on the source channels, not on a downmix: clipping happens per
  // channel at capture, and a mix would average it away
  const { stderr } = run('ffmpeg', [
    '-hide_banner', '-nostats', '-i', file, '-sn', '-vn', '-map', '0:a:0',
    '-af', 'ebur128=peak=true', '-f', 'null', '-',
  ]);
  const frames = [];
  const line = /t:\s*([\d.]+)\s+TARGET:.*?M:\s*(-?[\d.]+)\s+S:\s*(-?[\d.]+)\s+I:.*?FTPK:\s*(.*?)\s*dBFS/;
  for (const l of stderr.split('\n')) {
    const m = line.exec(l);
    if (!m) continue;
    // -120.7 is the filter's "window not full yet" (0.4 s for M, 3 s for S)
    const gate = (v) => (v <= -120 ? -Infinity : v);
    frames.push({
      t: Number(m[1]),
      m: gate(Number(m[2])),
      s: gate(Number(m[3])),
      tp: Math.max(...m[4].trim().split(/\s+/).map(db)),
    });
  }
  if (!frames.length) throw new Error(`${name}: ebur128 printed nothing to parse.`);
  const summary = stderr.slice(stderr.lastIndexOf('Summary:'));
  const pick = (re) => Number(re.exec(summary)?.[1] ?? NaN);

  const seconds = [];
  for (const f of frames) {
    // a frame is stamped with the end of its 100 ms
    const sec = Math.max(0, Math.ceil(f.t - 1e-6) - 1);
    const b = (seconds[sec] ??= { t: sec, m: -Infinity, s: -Infinity, tp: -Infinity, hot: 0 });
    b.m = Math.max(b.m, f.m);
    b.s = f.s;
    b.tp = Math.max(b.tp, f.tp);
    if (f.tp >= CLIP_DBTP) b.hot++;
  }

  // sustained clipping: runs of hot frames, bridged over short gaps
  const clipping = [];
  let cur = null;
  for (const f of frames) {
    if (f.tp < CLIP_DBTP) continue;
    if (cur && f.t - cur.to <= CLIP_MAX_GAP + 1e-6) {
      cur.to = f.t;
      cur.frames++;
      cur.peak = Math.max(cur.peak, f.tp);
    } else {
      cur = { from: Math.round((f.t - 0.1) * 10) / 10, to: f.t, frames: 1, peak: f.tp };
      clipping.push(cur);
    }
  }
  const sustained = clipping
    .filter((c) => c.frames >= CLIP_MIN_FRAMES)
    .map((c) => ({ from: c.from, to: round1(c.to), frames: c.frames, peak: round1(c.peak) }));

  const data = {
    master: name,
    duration,
    measuredOn: `source channels, ${layout}`,
    integrated: pick(/I:\s+(-?[\d.]+) LUFS/),
    lra: pick(/LRA:\s+(-?[\d.]+) LU/),
    truePeak: pick(/Peak:\s+(-?[\d.]+) dBFS/),
    clipThreshold: CLIP_DBTP,
    // every stretch to stay out of: [from, to] in seconds of the master
    clipping: sustained,
    // 100 ms frames at or above the threshold, including the isolated ones
    hotFrames: frames.filter((f) => f.tp >= CLIP_DBTP).length,
    // per second: m = loudest momentary (400 ms) value, s = short-term (3 s)
    // at the end of the second, tp = true peak over all channels, hot = 100 ms
    // frames at or above the threshold
    seconds: seconds.map((b) => ({ t: b.t, m: round1(b.m), s: round1(b.s), tp: round1(b.tp), hot: b.hot })),
    // the same curve at the filter's own 10 Hz, to place a cut inside a breath
    frames: { rate: 10, m: frames.map((f) => round1(f.m)), tp: frames.map((f) => round1(f.tp)) },
  };
  const out = resolve(ANALYSIS, `${name}.loudness.json`);
  writeFileSync(out, JSON.stringify(data) + '\n');
  console.log(
    `${name}: I ${data.integrated} LUFS, LRA ${data.lra} LU, peak ${data.truePeak} dBTP, ` +
      `${data.hotFrames} hot frames, ${sustained.length} clipped stretch(es) -> ${out}`,
  );
  for (const c of sustained) console.log(`  clipping ${c.from}-${c.to}s (${c.frames} frames, ${c.peak} dBTP)`);
}

for (const name of names.length ? names : Object.keys(MASTERS)) {
  const file = masterPath(name);
  const info = probe(file, 'format=duration:stream=codec_type,channel_layout');
  const duration = Number(info.format.duration);
  const layout = info.streams.find((s) => s.codec_type === 'audio')?.channel_layout ?? 'unknown';
  if (contactSheet(name, file, duration)) loudness(name, file, duration, layout);
}
