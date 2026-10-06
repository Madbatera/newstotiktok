// Trilha instrumental original da apresentação Control Tower (87 s, 104 BPM, Lá menor), com o volume
// reduzido nos trechos de locução (ducking já aplicado no arquivo).
// Síntese determinística em Node puro: gera audio-src/trilha.wav (estéreo, 44,1 kHz).
// Estrutura alinhada às cenas: marca (0–9,5) · acesso (9,5) · produto (18,7–77,8) · fechamento (77,8–87).
import { writeFileSync } from "node:fs";

const SR = 44100;
const DUR = 87;
const N = SR * DUR;
const L = new Float32Array(N);
const R = new Float32Array(N);
const BPM = 104;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;

let seed = 1234567;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp01 = (x) => Math.max(0, Math.min(1, x));

// Am – F – C – G (notas MIDI do acorde, baixo separado)
const PROG = [
  { chord: [57, 60, 64, 69], bass: 45 },
  { chord: [57, 60, 65, 69], bass: 41 },
  { chord: [55, 60, 64, 67], bass: 48 },
  { chord: [55, 59, 62, 67], bass: 43 },
];
const chordAt = (t) => PROG[Math.floor(t / BAR) % PROG.length];

// intensidade de cada camada ao longo do vídeo
const env = (t, pts) => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [t0, v0] = pts[i], [t1, v1] = pts[i + 1];
    if (t >= t0 && t <= t1) return v0 + (v1 - v0) * ((t - t0) / (t1 - t0 || 1));
  }
  return t < pts[0][0] ? pts[0][1] : pts[pts.length - 1][1];
};
const PAD = [[0, 0], [2, 0.9], [77.8, 0.8], [80, 1], [87, 0.6]];
const BASS = [[0, 0], [9.3, 0], [9.6, 1], [77.6, 1], [77.9, 0]];
const KICK = [[0, 0], [9.4, 0], [9.5, 1], [77.7, 1], [77.8, 0]];
const HAT = [[0, 0], [18.5, 0], [18.8, 0.8], [77.7, 0.8], [77.8, 0]];
const ARP = [[0, 0], [28.4, 0], [29, 0.8], [77.8, 1], [80, 0.5], [86, 0]];
// trechos de locução (início, fim): a música desce para 32% com rampas de 0,35 s
const FALAS = [[1.2, 7.9], [10.2, 17.6], [19.3, 28.1], [29.2, 37.2], [38.7, 48.5], [49.7, 58.2], [59.2, 67.5], [68.8, 77.1], [78.6, 83.5]];
const duck = (t) => {
  let g = 1;
  for (const [a, b] of FALAS) {
    const r = 0.35;
    if (t > a - r && t < b + r) g = Math.min(g, t < a ? 1 - 0.68 * ((t - (a - r)) / r) : t > b ? 0.32 + 0.68 * ((t - b) / r) : 0.32);
  }
  return g;
};

const add = (i, l, r) => {
  if (i >= 0 && i < N) {
    L[i] += l;
    R[i] += r;
  }
};

// ---------- pad: dentes de serra desafinados + filtro passa-baixa ----------
{
  const voices = 4;
  const phases = new Float64Array(voices * 3);
  let lpL = 0, lpR = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const g = env(t, PAD);
    if (g <= 0) continue;
    const ch = t >= 77.8 ? { chord: [57, 60, 64, 69, 76] } : chordAt(t);
    let sL = 0, sR = 0;
    ch.chord.slice(0, voices).forEach((m, v) => {
      [-0.08, 0, 0.08].forEach((det, k) => {
        const idx = v * 3 + k;
        phases[idx] = (phases[idx] + midi(m + det) / SR) % 1;
        const saw = phases[idx] * 2 - 1;
        if (k === 0) sL += saw;
        else if (k === 2) sR += saw;
        else {
          sL += saw * 0.5;
          sR += saw * 0.5;
        }
      });
    });
    const cutoff = 0.035 + 0.02 * Math.sin(t * 0.35);
    lpL += cutoff * (sL - lpL);
    lpR += cutoff * (sR - lpR);
    add(i, lpL * 0.05 * g, lpR * 0.05 * g);
  }
}

// ---------- baixo pulsante em colcheias ----------
for (let step = 0; step * (BEAT / 2) < DUR; step++) {
  const t0 = step * (BEAT / 2);
  const g = env(t0, BASS);
  if (g <= 0) continue;
  const f = midi(chordAt(t0).bass);
  const len = BEAT / 2 * 0.9;
  const accent = step % 2 === 0 ? 1 : 0.7;
  for (let j = 0; j < len * SR; j++) {
    const t = j / SR;
    const a = Math.min(1, t / 0.004) * Math.exp(-t * 7);
    let s = Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(4 * Math.PI * f * t);
    s = Math.tanh(s * 1.4);
    const v = s * a * 0.2 * g * accent;
    add(Math.floor(t0 * SR) + j, v, v);
  }
}

// ---------- bumbo nos tempos 1 e 3 ----------
for (let b = 0; b * BEAT < DUR; b++) {
  const t0 = 11.5 + b * BEAT * 2;
  if (t0 >= DUR) break;
  const g = env(t0, KICK);
  if (g <= 0) continue;
  let ph = 0;
  for (let j = 0; j < 0.35 * SR; j++) {
    const t = j / SR;
    const f = 48 + 110 * Math.exp(-t * 35);
    ph += f / SR;
    const v = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 9) * 0.42 * g;
    add(Math.floor(t0 * SR) + j, v, v);
  }
}

// ---------- chimbal nos contratempos ----------
{
  let hp = 0, prev = 0;
  for (let b = 0; b * (BEAT / 2) < DUR; b++) {
    const t0 = 18.7 + b * (BEAT / 2);
    if (t0 >= DUR) break;
    const g = env(t0, HAT);
    if (g <= 0) continue;
    const vel = b % 2 === 1 ? 1 : 0.45;
    for (let j = 0; j < 0.06 * SR; j++) {
      const t = j / SR;
      const n = rnd();
      hp = 0.85 * (hp + n - prev);
      prev = n;
      const v = hp * Math.exp(-t * 70) * 0.06 * g * vel;
      add(Math.floor(t0 * SR) + j, v * 0.8, v);
    }
  }
}

// ---------- arpejo em semicolcheias (triângulo, com eco) ----------
{
  const notes = [0, 1, 2, 3, 2, 1, 3, 1];
  for (let s = 0; s * (BEAT / 4) < DUR; s++) {
    const t0 = s * (BEAT / 4);
    const g = env(t0, ARP);
    if (g <= 0) continue;
    const ch = t0 >= 77.8 ? { chord: [57, 60, 64, 69] } : chordAt(t0);
    const m = ch.chord[notes[s % notes.length]] + 12;
    const f = midi(m);
    const pan = s % 2 ? 0.35 : -0.35;
    for (let echo = 0; echo < 3; echo++) {
      const te = t0 + echo * BEAT * 0.75;
      const eg = Math.pow(0.38, echo);
      for (let j = 0; j < 0.22 * SR; j++) {
        const t = j / SR;
        const ph = (f * t) % 1;
        const tri = 1 - 4 * Math.abs(ph - 0.5);
        const v = tri * Math.min(1, t / 0.003) * Math.exp(-t * 16) * 0.075 * g * eg;
        const p = echo % 2 ? -pan : pan;
        add(Math.floor(te * SR) + j, v * (1 - p), v * (1 + p));
      }
    }
  }
}

// ---------- normalização simples e WAV 16 bits ----------
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const gain = 0.89 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write("WAVEfmt ", 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const fade = clamp01((DUR - i / SR) / 3) * duck(i / SR);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * gain * fade)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * gain * fade)) * 32767), 46 + i * 4);
}
writeFileSync(new URL("./trilha.wav", import.meta.url), buf);
console.log("trilha.wav (com ducking)", DUR, "s, pico", peak.toFixed(3));
