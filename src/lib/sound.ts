// Lightweight synthesized sounds via Web Audio API.
// No external assets. Each call returns immediately and schedules audio nodes.

let ctx: AudioContext | null = null;
let masterEnabled = true;

const getCtx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') {
    void ctx.resume();
  }
  return ctx;
};

export const setSoundsEnabled = (v: boolean) => { masterEnabled = v; };

type ToneOpts = {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  startAt?: number;
  attack?: number;
  release?: number;
  freqEnd?: number;
};

const tone = (audio: AudioContext, opts: ToneOpts) => {
  const {
    freq, duration, type = 'sine', gain = 0.18,
    startAt = 0, attack = 0.005, release = 0.08, freqEnd,
  } = opts;
  const t0 = audio.currentTime + startAt;
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqEnd != null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + duration);
  }
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.linearRampToValueAtTime(gain * 0.7, t0 + duration - release);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
};

const noiseBurst = (audio: AudioContext, opts: { duration: number; gain?: number; startAt?: number; filterFreq?: number; filterFreqEnd?: number }) => {
  const { duration, gain = 0.12, startAt = 0, filterFreq = 2000, filterFreqEnd } = opts;
  const t0 = audio.currentTime + startAt;
  const bufferSize = Math.max(1, Math.floor(audio.sampleRate * duration));
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = audio.createBufferSource();
  src.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterFreq, t0);
  if (filterFreqEnd != null) filter.frequency.exponentialRampToValueAtTime(Math.max(20, filterFreqEnd), t0 + duration);
  const g = audio.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  src.connect(filter).connect(g).connect(audio.destination);
  src.start(t0);
  src.stop(t0 + duration + 0.02);
};

const play = (fn: (audio: AudioContext) => void) => {
  if (!masterEnabled) return;
  const audio = getCtx();
  if (!audio) return;
  try { fn(audio); } catch { /* swallow */ }
};

// Public sounds — short, polite, never overlapping with each other significantly.

export const playMissionDone = () => play(audio => {
  // Ascending major chord 2 notes
  tone(audio, { freq: 660, duration: 0.12, type: 'triangle', gain: 0.16 });
  tone(audio, { freq: 880, duration: 0.18, type: 'triangle', gain: 0.16, startAt: 0.08 });
});

export const playMalus = () => play(audio => {
  // Descending two-tone thud
  tone(audio, { freq: 220, duration: 0.12, type: 'sawtooth', gain: 0.12 });
  tone(audio, { freq: 140, duration: 0.18, type: 'sawtooth', gain: 0.14, startAt: 0.08 });
});

export const playConvert = () => play(audio => {
  // Quick magical arpeggio
  const notes = [523, 659, 784, 1047]; // C E G C
  notes.forEach((f, i) => tone(audio, {
    freq: f, duration: 0.1, type: 'sine', gain: 0.12, startAt: i * 0.05,
  }));
});

export const playRewardBig = () => play(audio => {
  // Fanfare: C-E-G then sparkle
  tone(audio, { freq: 523, duration: 0.14, type: 'triangle', gain: 0.18 });
  tone(audio, { freq: 659, duration: 0.14, type: 'triangle', gain: 0.18, startAt: 0.1 });
  tone(audio, { freq: 784, duration: 0.18, type: 'triangle', gain: 0.18, startAt: 0.2 });
  tone(audio, { freq: 1568, duration: 0.25, type: 'sine', gain: 0.14, startAt: 0.36 });
});

export const playRewardSmall = () => play(audio => {
  tone(audio, { freq: 880, duration: 0.18, type: 'sine', gain: 0.15 });
  tone(audio, { freq: 1320, duration: 0.18, type: 'sine', gain: 0.13, startAt: 0.08 });
});

export const playStreak = () => play(audio => {
  // Whoosh + bright high tone
  noiseBurst(audio, { duration: 0.3, gain: 0.08, filterFreq: 4000, filterFreqEnd: 400 });
  tone(audio, { freq: 1200, duration: 0.3, type: 'triangle', gain: 0.14, startAt: 0.1, freqEnd: 1800 });
});

export const playTimerEnd = () => play(audio => {
  // Soft double bell
  tone(audio, { freq: 880, duration: 0.5, type: 'sine', gain: 0.18, release: 0.3 });
  tone(audio, { freq: 660, duration: 0.5, type: 'sine', gain: 0.16, startAt: 0.18, release: 0.3 });
});

export const playUndo = () => play(audio => {
  tone(audio, { freq: 500, duration: 0.12, type: 'triangle', gain: 0.12, freqEnd: 300 });
});
