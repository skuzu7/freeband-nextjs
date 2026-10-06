// scripts/video/encode.mjs
// Cuts the clips of clips.mjs from the camera masters, with sound, for the
// site's own player. For each clip it writes to saidas/video/site/:
//
//   <id>.mp4          H.264 High + AAC — plays everywhere
//   <id>.av1.mp4      AV1 + the very same AAC stream — about half the bytes
//   <id>.jpg          poster, 1920×1080, the frame at posterAt
//   <id>.levels.json  RMS envelope of the final audio at 20 Hz, 0..1, so the
//                     LED panel can follow the music without Web Audio
//   manifest.json     what the player needs: durations, bytes, loudness and
//                     the `codecs` strings for <source type>, all read back
//                     from the files rather than assumed
//
// The masters are 1440×1080 anamorphic, interlaced, AC-3 5.1 and untagged;
// what comes out is 1920×1080 square-pixel 29.97p, BT.709-tagged, stereo at
// -16 LUFS. The run fails when a file is over its size budget or is not what
// the manifest would claim.
//
//   node scripts/video/encode.mjs [id ...]   the clips named, or all of them
//   node scripts/video/encode.mjs --poster [id ...]   only redo the posters
//                                            (after moving posterAt)
//   node scripts/video/encode.mjs --manifest only re-read what is on disk
import { closeSync, existsSync, mkdirSync, openSync, readSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CLIPS } from './clips.mjs';
import { DEINTERLACE, PRE, SITE, masterPath, probe, run } from './workspace.mjs';

// Decimal megabytes: the stricter reading of "10 MB" and "5 MB".
const BUDGET = { h264: 10_000_000, av1: 5_000_000 };
const SIZE = { w: 1920, h: 1080 };
const FPS = '30000/1001';
const LOUDNESS = { I: -16, TP: -1.5, LRA: 11 };
const LEVELS_RATE = 20;
// Where a clip starts. x264 is held by its 3 Mbit/s ceiling, so crf 25 fits
// 10 MB up to about 25 s; AV1 has no ceiling, and stage footage in front of a
// lit LED wall has never fitted 5 MB at 34 — clips.mjs raises it clip by clip.
const DEFAULTS = { crf: 25, av1Crf: 34, denoise: '2.5:2:5:4' };

// 5.1(side) is FL FR FC LFE SL SR. Centre at -3 dB to both sides, surrounds at
// -6 dB, LFE dropped: nothing below 40 Hz survives a laptop speaker anyway.
const LAYOUT = '5.1(side)';
const PAN = 'pan=stereo|c0=FL+0.707*FC+0.5*SL|c1=FR+0.707*FC+0.5*SR';

// The camera writes no colour tags. It is HD, so BT.709 — say so, or a
// browser is free to guess.
const BT709 = 'setparams=range=tv:color_primaries=bt709:color_trc=bt709:colorspace=bt709';
const BT709_OUT = ['-color_range', 'tv', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709'];

const n3 = (v) => String(Math.round(v * 1000) / 1000);
const file = (id, ext) => resolve(SITE, `${id}.${ext}`);

// ---------- the clip list itself ----------

function validate(clips) {
  const durations = {};
  for (const c of clips) {
    const where = `clips.mjs, "${c.id}"`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id)) throw new Error(`${where}: the id must be kebab-case.`);
    if (clips.filter((o) => o.id === c.id).length > 1) throw new Error(`${where}: duplicate id.`);
    if (!c.title || !c.description) throw new Error(`${where}: title and description are required.`);
    if (!(c.dur >= 20 && c.dur <= 30)) throw new Error(`${where}: dur is ${c.dur}s, clips run 20-30 s.`);
    if (c.in < PRE) throw new Error(`${where}: in must leave ${PRE}s of pre-roll before it.`);
    if (!(c.posterAt >= 0 && c.posterAt < c.dur)) throw new Error(`${where}: posterAt is outside the clip.`);
    const master = masterPath(c.master);
    const info = (durations[c.master] ??= probe(master, 'format=duration:stream=codec_type,channel_layout'));
    if (c.in + c.dur > Number(info.format.duration)) throw new Error(`${where}: runs past the end of the master.`);
    const layout = info.streams.find((s) => s.codec_type === 'audio')?.channel_layout;
    if (layout !== LAYOUT) throw new Error(`${where}: the downmix expects ${LAYOUT}, the master is ${layout}.`);
    for (const o of clips) {
      if (o === c || o.master !== c.master) continue;
      if (c.in < o.in + o.dur && o.in < c.in + c.dur) throw new Error(`${where}: overlaps "${o.id}" on ${c.master}.`);
    }
  }
}

// ---------- filter graphs ----------

function videoFilter(clip) {
  const { denoise } = { ...DEFAULTS, ...clip };
  return [
    // the demuxer cuts on packets; trim sets the exact length
    `trim=start=${PRE}:end=${n3(PRE + clip.dur)}`,
    'setpts=PTS-STARTPTS',
    DEINTERLACE,
    `scale=${SIZE.w}:${SIZE.h}:flags=lanczos`,
    'setsar=1',
    `hqdn3d=${denoise}`,
    // before videoIn the fade holds black
    `fade=t=in:st=${n3(clip.videoIn ?? 0)}:d=0.2`,
    `fade=t=out:st=${n3(clip.dur - 0.4)}:d=0.4`,
    BT709,
  ].join(',');
}

function audioFilter(clip, loudnorm) {
  return [
    `atrim=start=${PRE}:end=${n3(PRE + clip.dur)}`,
    'asetpts=PTS-STARTPTS',
    PAN,
    'highpass=f=40',
    loudnorm,
    // loudnorm may hand back 192 kHz
    'aresample=48000',
    'afade=t=in:d=0.05',
    `afade=t=out:st=${n3(clip.dur - 0.5)}:d=0.5`,
  ].join(',');
}

/** The master, opened PRE seconds early and a little long; trim does the rest. */
const source = (clip) => ['-ss', n3(clip.in - PRE), '-t', n3(clip.dur + PRE + 0.5), '-i', masterPath(clip.master), '-sn'];

/** The JSON block loudnorm prints at the end of a pass. */
function loudnormReport(stderr) {
  const a = stderr.lastIndexOf('{');
  const b = stderr.lastIndexOf('}');
  if (a < 0 || b < a) throw new Error('loudnorm printed no measurement.');
  return JSON.parse(stderr.slice(a, b + 1));
}

// ---------- the four files of a clip ----------

function encodeH264(clip) {
  const { crf } = { ...DEFAULTS, ...clip };
  const target = `loudnorm=I=${LOUDNESS.I}:TP=${LOUDNESS.TP}:LRA=${LOUDNESS.LRA}`;
  // pass 1 only listens: with the measurement in hand, pass 2 can apply one
  // fixed gain (linear) instead of riding the level through the clip
  const first = run('ffmpeg', [
    '-hide_banner', '-nostats', ...source(clip), '-vn', '-map', '0:a:0',
    '-af', audioFilter(clip, `${target}:print_format=json`), '-f', 'null', '-',
  ]);
  const m = loudnormReport(first.stderr);
  const second =
    `${target}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}` +
    `:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true:print_format=json`;
  const out = run('ffmpeg', [
    '-y', '-hide_banner', '-nostats', ...source(clip), '-map', '0:v:0', '-map', '0:a:0',
    '-vf', videoFilter(clip), '-af', audioFilter(clip, second),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-maxrate', '3000k', '-bufsize', '6000k',
    // preset slow keeps five reference frames, which at 1080p is Level 5.0 —
    // past what some hardware decoders accept. Pinning 4.0 costs one frame.
    '-profile:v', 'high', '-level:v', '4.0', '-pix_fmt', 'yuv420p', '-g', '60', ...BT709_OUT,
    '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2',
    '-movflags', '+faststart', file(clip.id, 'mp4'),
  ]);
  const applied = loudnormReport(out.stderr);
  // loudnorm falls back to its dynamic mode, without saying so anywhere else,
  // when a fixed gain would overshoot the true-peak ceiling
  if (applied.normalization_type !== 'linear') {
    console.warn(`  ! ${clip.id}: loudnorm ran ${applied.normalization_type}, not linear`);
  }
  return { source: m, normalization: applied.normalization_type };
}

function encodeAv1(clip) {
  const { av1Crf } = { ...DEFAULTS, ...clip };
  // the audio is copied from the H.264 file: one encode, the same samples in
  // both, and one loudness figure that holds for either source
  run('ffmpeg', [
    '-y', '-hide_banner', '-nostats', '-v', 'error', ...source(clip), '-i', file(clip.id, 'mp4'),
    '-map', '0:v:0', '-map', '1:a:0', '-vf', videoFilter(clip),
    '-c:v', 'libsvtav1', '-preset', '5', '-crf', String(av1Crf), '-g', '60', '-pix_fmt', 'yuv420p', ...BT709_OUT,
    '-c:a', 'copy', '-movflags', '+faststart', file(clip.id, 'av1.mp4'),
  ]);
}

function poster(clip) {
  const { denoise } = { ...DEFAULTS, ...clip };
  const vf = [
    // the pre-roll goes through the clip's own chain, so the frame picked has
    // its neighbours behind it and looks like the video it stands for
    DEINTERLACE,
    `scale=${SIZE.w}:${SIZE.h}:flags=lanczos`,
    'setsar=1',
    `hqdn3d=${denoise}`,
    `select='gte(t,${PRE})'`,
    // JPEG is BT.601 full range by definition; without the matrix change the
    // stage's magentas and greens drift (green PSNR 26 dB against 42 dB)
    'scale=in_color_matrix=bt709:out_color_matrix=bt601:in_range=tv:out_range=pc',
    'format=yuvj420p',
  ].join(',');
  run('ffmpeg', [
    '-y', '-v', 'error', '-ss', n3(clip.in + clip.posterAt - PRE), '-t', n3(PRE + 1), '-i', masterPath(clip.master),
    '-sn', '-an', '-vf', vf, '-frames:v', '1', '-update', '1', '-q:v', '3', file(clip.id, 'jpg'),
  ]);
}

function levels(clip) {
  // the audio as the visitor hears it: decoded back from the finished file
  const { stdout } = run(
    'ffmpeg',
    ['-v', 'error', '-i', file(clip.id, 'mp4'), '-map', '0:a:0', '-ac', '2', '-ar', '48000', '-f', 'f32le', '-'],
    { binary: true },
  );
  const pcm = new Float32Array(stdout.buffer, stdout.byteOffset, stdout.byteLength >> 2);
  const hop = (48000 / LEVELS_RATE) * 2; // interleaved stereo
  const rms = [];
  for (let i = 0; i < pcm.length; i += hop) {
    const end = Math.min(pcm.length, i + hop);
    let sum = 0;
    for (let k = i; k < end; k++) sum += pcm[k] * pcm[k];
    rms.push(Math.sqrt(sum / (end - i)));
  }
  // linear amplitude over the clip's loudest window: the camera's limiter
  // leaves little dynamic range, and a dB scale would flatten what is left
  const peak = Math.max(...rms) || 1;
  const data = { rate: LEVELS_RATE, levels: rms.map((v) => Math.round((v / peak) * 1000) / 1000) };
  writeFileSync(file(clip.id, 'levels.json'), JSON.stringify(data) + '\n');
}

// ---------- reading the files back ----------

/** Child boxes of an ISO BMFF container held in `buf`. */
function* boxes(buf, start = 0, end = buf.length) {
  for (let p = start; p + 8 <= end; ) {
    let size = buf.readUInt32BE(p);
    let head = 8;
    if (size === 1) {
      size = Number(buf.readBigUInt64BE(p + 8));
      head = 16;
    } else if (size === 0) size = end - p;
    if (size < head) return;
    yield { type: buf.toString('latin1', p + 4, p + 8), start: p + head, end: p + size };
    p += size;
  }
}

/** The moov box; +faststart puts it at the front, but nothing here relies on it. */
function readMoov(path) {
  const fd = openSync(path, 'r');
  try {
    const total = statSync(path).size;
    const head = Buffer.alloc(16);
    for (let p = 0; p < total; ) {
      readSync(fd, head, 0, 16, p);
      let size = head.readUInt32BE(0);
      let skip = 8;
      if (size === 1) {
        size = Number(head.readBigUInt64BE(8));
        skip = 16;
      } else if (size === 0) size = total - p;
      if (head.toString('latin1', 4, 8) === 'moov') {
        const moov = Buffer.alloc(size - skip);
        readSync(fd, moov, 0, moov.length, p + skip);
        return moov;
      }
      p += size;
    }
  } finally {
    closeSync(fd);
  }
  throw new Error(`${path}: no moov box.`);
}

const hex2 = (v) => v.toString(16).toUpperCase().padStart(2, '0');

/** RFC 6381 codec string of one sample entry, from its configuration box. */
function codecOf(buf, entry) {
  // children start after the fixed fields: 78 bytes for video, 28 for audio
  const video = entry.type === 'avc1' || entry.type === 'av01';
  const conf = [...boxes(buf, entry.start + (video ? 78 : 28), entry.end)];
  const find = (type) => {
    const b = conf.find((c) => c.type === type);
    if (!b) throw new Error(`${entry.type} entry without ${type}.`);
    return b.start;
  };
  if (entry.type === 'avc1') {
    // avcC: version, profile_idc, constraint flags, level_idc
    const p = find('avcC');
    return `avc1.${hex2(buf[p + 1])}${hex2(buf[p + 2])}${hex2(buf[p + 3])}`;
  }
  if (entry.type === 'av01') {
    // av1C: marker/version, profile(3) level(5), tier(1) high_bitdepth(1) twelve_bit(1) ...
    const p = find('av1C');
    const profile = buf[p + 1] >> 5;
    const level = buf[p + 1] & 0x1f;
    const tier = buf[p + 2] >> 7 ? 'H' : 'M';
    const depth = (buf[p + 2] >> 6) & 1 ? ((buf[p + 2] >> 5) & 1 ? 12 : 10) : 8;
    // the optional tail (chroma, colour) defaults to 4:2:0 BT.709 limited — what these files are
    return `av01.${profile}.${String(level).padStart(2, '0')}${tier}.${String(depth).padStart(2, '0')}`;
  }
  if (entry.type === 'mp4a') {
    // esds: ES_Descriptor(3) > DecoderConfigDescriptor(4) > DecoderSpecificInfo(5)
    let p = find('esds') + 4;
    const descriptor = (tag) => {
      if (buf[p++] !== tag) throw new Error(`esds: expected descriptor ${tag}.`);
      while (buf[p++] & 0x80);
    };
    descriptor(3);
    // ES_ID, then flags announcing three optional fields
    const flags = buf[p + 2];
    p += 3;
    if (flags & 0x80) p += 2;
    if (flags & 0x40) p += 1 + buf[p];
    if (flags & 0x20) p += 2;
    descriptor(4);
    const objectType = buf[p];
    p += 13;
    descriptor(5);
    let audioObject = buf[p] >> 3;
    if (audioObject === 31) audioObject = 32 + (((buf[p] & 7) << 3) | (buf[p + 1] >> 5));
    return `mp4a.${objectType.toString(16)}.${audioObject}`;
  }
  throw new Error(`Unexpected sample entry "${entry.type}".`);
}

/** "video codec, audio codec" for <source type='video/mp4; codecs="…"'>. */
function codecs(path) {
  const moov = readMoov(path);
  const down = (range, type) => [...boxes(moov, range.start, range.end)].filter((b) => b.type === type);
  const out = [];
  for (const trak of down({ start: 0, end: moov.length }, 'trak')) {
    const stsd = ['mdia', 'minf', 'stbl', 'stsd'].reduce((box, type) => down(box, type)[0], trak);
    // stsd: version/flags, entry count, then the entries
    out.push(codecOf(moov, [...boxes(moov, stsd.start + 8, stsd.end)][0]));
  }
  return out.sort((a, b) => a.startsWith('mp4a') - b.startsWith('mp4a')).join(', ');
}

const H264_PROFILE = { Baseline: 0x42, 'Constrained Baseline': 0x42, Main: 0x4d, High: 0x64 };
const AV1_PROFILE = { Main: 0, High: 1, Professional: 2 };
const AAC_OBJECT = { LC: 2, 'HE-AAC': 5, 'HE-AACv2': 29 };

/** What ffprobe sees in a finished file, checked against what the site was promised. */
function inspect(path, kind) {
  const info = probe(
    path,
    'format=duration:stream=codec_type,codec_name,profile,level,width,height,sample_aspect_ratio,field_order,avg_frame_rate,sample_rate,channels,channel_layout',
  );
  const v = info.streams.find((s) => s.codec_type === 'video');
  const a = info.streams.find((s) => s.codec_type === 'audio');
  const want = {
    'video codec': [v?.codec_name, kind],
    width: [v?.width, SIZE.w],
    height: [v?.height, SIZE.h],
    'pixel aspect': [v?.sample_aspect_ratio, '1:1'],
    'field order': [v?.field_order, 'progressive'],
    'frame rate': [v?.avg_frame_rate, FPS],
    'audio codec': [a?.codec_name, 'aac'],
    'sample rate': [a?.sample_rate, '48000'],
    channels: [a?.channel_layout, 'stereo'],
  };
  for (const [what, [got, expected]] of Object.entries(want)) {
    if (got !== expected) throw new Error(`${path}: ${what} is ${got}, expected ${expected}.`);
  }
  // the string parsed out of the boxes has to agree with ffprobe's own reading
  const string = codecs(path);
  const [vc, ac] = string.split(', ');
  const agrees =
    kind === 'h264'
      ? vc.startsWith(`avc1.${hex2(H264_PROFILE[v.profile] ?? 0)}`) && vc.endsWith(hex2(v.level))
      : vc.startsWith(`av01.${AV1_PROFILE[v.profile]}.${String(v.level).padStart(2, '0')}`);
  if (!agrees || ac !== `mp4a.40.${AAC_OBJECT[a.profile]}`) {
    throw new Error(`${path}: boxes say "${string}", ffprobe says ${v.profile}@${v.level} + AAC ${a.profile}.`);
  }
  return { duration: Number(info.format.duration), codecs: string };
}

/** Integrated loudness and true peak of a finished file (EBU R128). */
function loudnessOf(path) {
  const { stderr } = run('ffmpeg', ['-hide_banner', '-nostats', '-i', path, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-']);
  const summary = stderr.slice(stderr.lastIndexOf('Summary:'));
  const integrated = Number(/I:\s+(-?[\d.]+) LUFS/.exec(summary)?.[1]);
  const truePeak = Number(/Peak:\s+(-?[\d.]+) dBFS/.exec(summary)?.[1]);
  if (!Number.isFinite(integrated) || !Number.isFinite(truePeak)) throw new Error(`${path}: ebur128 printed no summary.`);
  return { integrated, truePeak };
}

const mb = (bytes) => `${(bytes / 1e6).toFixed(2)} MB`;

/** One manifest entry, or the list of reasons this clip must not ship. */
function describe(clip) {
  const paths = { h264: file(clip.id, 'mp4'), av1: file(clip.id, 'av1.mp4'), poster: file(clip.id, 'jpg'), levels: file(clip.id, 'levels.json') };
  const missing = Object.values(paths).filter((p) => !existsSync(p));
  if (missing.length) return { skipped: true };
  const bytes = Object.fromEntries(Object.entries(paths).map(([k, p]) => [k, statSync(p).size]));
  const h264 = inspect(paths.h264, 'h264');
  const av1 = inspect(paths.av1, 'av1');
  const loudness = loudnessOf(paths.h264);
  const problems = [];
  for (const kind of ['h264', 'av1']) {
    if (bytes[kind] > BUDGET[kind]) {
      problems.push(
        `${clip.id}: the ${kind === 'h264' ? 'H.264' : 'AV1'} file is ${mb(bytes[kind])}, over its ${mb(BUDGET[kind])} budget. ` +
          `Raise ${kind === 'h264' ? 'crf' : 'av1Crf'} (now ${{ ...DEFAULTS, ...clip }[kind === 'h264' ? 'crf' : 'av1Crf']}) ` +
          `or denoise for this clip in clips.mjs.`,
      );
    }
  }
  if (Math.abs(h264.duration - av1.duration) > 0.05) problems.push(`${clip.id}: the two encodes differ in length.`);
  if (Math.abs(h264.duration - clip.dur) > 0.1) problems.push(`${clip.id}: runs ${h264.duration}s, clips.mjs says ${clip.dur}s.`);
  if (Math.abs(loudness.integrated - LOUDNESS.I) > 1) problems.push(`${clip.id}: ${loudness.integrated} LUFS, target ${LOUDNESS.I} ±1.`);
  if (loudness.truePeak > -1) problems.push(`${clip.id}: true peak ${loudness.truePeak} dBTP, ceiling -1.`);
  const entry = {
    id: clip.id,
    title: clip.title,
    description: clip.description,
    duration: h264.duration,
    width: SIZE.w,
    height: SIZE.h,
    // LUFS and dBTP of the audio both sources carry
    loudness,
    // in the order a <video> should list them: the first one the browser can play wins
    sources: [
      { file: `${clip.id}.av1.mp4`, codecs: av1.codecs, bytes: bytes.av1 },
      { file: `${clip.id}.mp4`, codecs: h264.codecs, bytes: bytes.h264 },
    ],
    poster: { file: `${clip.id}.jpg`, bytes: bytes.poster },
    levels: { file: `${clip.id}.levels.json`, bytes: bytes.levels, rate: LEVELS_RATE },
    // where it came from, for whoever recuts it
    cut: { master: clip.master, in: clip.in, dur: clip.dur, posterAt: clip.posterAt },
  };
  return { entry, problems };
}

// ---------- run ----------

const args = process.argv.slice(2);
const manifestOnly = args.includes('--manifest');
const posterOnly = args.includes('--poster');
const ids = args.filter((a) => !a.startsWith('--'));
for (const id of ids) {
  if (!CLIPS.some((c) => c.id === id)) throw new Error(`Unknown clip "${id}". Known: ${CLIPS.map((c) => c.id).join(', ')}.`);
}
validate(CLIPS);
mkdirSync(SITE, { recursive: true });

if (!manifestOnly) {
  for (const clip of CLIPS.filter((c) => !ids.length || ids.includes(c.id))) {
    const t0 = Date.now();
    console.log(`${clip.id}  (${clip.master} ${clip.in}s +${clip.dur}s)`);
    if (!posterOnly) {
      const audio = encodeH264(clip);
      console.log(`  h264   ${mb(statSync(file(clip.id, 'mp4')).size)}  source ${audio.source.input_i} LUFS / ${audio.source.input_tp} dBTP, ${audio.normalization} gain`);
      encodeAv1(clip);
      console.log(`  av1    ${mb(statSync(file(clip.id, 'av1.mp4')).size)}`);
      levels(clip);
    }
    poster(clip);
    console.log(`  poster at ${clip.posterAt}s, ${Math.round((Date.now() - t0) / 1000)}s`);
  }
}

// the manifest always describes everything on disk, so encoding one clip
// never drops the others from it
const entries = [];
const problems = [];
for (const clip of CLIPS) {
  const d = describe(clip);
  if (d.skipped) {
    console.log(`${clip.id}: not encoded yet, left out of the manifest`);
    continue;
  }
  entries.push(d.entry);
  problems.push(...d.problems);
  console.log(
    `${clip.id}: ${d.entry.duration}s, ${d.entry.loudness.integrated} LUFS / ${d.entry.loudness.truePeak} dBTP, ` +
      d.entry.sources.map((s) => `${mb(s.bytes)} [${s.codecs}]`).join(', '),
  );
}
if (problems.length) {
  console.error(`\nmanifest.json not written:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
  process.exit(1);
}
writeFileSync(resolve(SITE, 'manifest.json'), JSON.stringify({ budget: BUDGET, clips: entries }, null, 2) + '\n');
console.log(`manifest.json: ${entries.length} of ${CLIPS.length} clips`);
