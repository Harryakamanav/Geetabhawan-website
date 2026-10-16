/**
 * Geeta Bhawan Mandir — Sacred Web Audio Acoustic Synthesis Engine
 * Zero external MP3 / audio files. Pure mathematical synthesis via Web Audio API.
 * Strictly user-controlled. NEVER autoplays.
 */

let audioCtx = null;
let isAudioActive = false;
let tanpuraNodes = [];
let masterGain = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesizes a Brass Temple Bell (घंटी निनाद)
 * Modeled on physical temple bell acoustics with 6 simultaneous oscillators
 */
export function playTempleBell() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const bellGain = ctx.createGain();
  bellGain.connect(masterGain);

  // Initial strike impact transient
  const clapperOsc = ctx.createOscillator();
  const clapperGain = ctx.createGain();
  clapperOsc.type = 'triangle';
  clapperOsc.frequency.setValueAtTime(3200, now);
  clapperOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

  clapperGain.gain.setValueAtTime(0.6, now);
  clapperGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

  clapperOsc.connect(clapperGain);
  clapperGain.connect(bellGain);

  clapperOsc.start(now);
  clapperOsc.stop(now + 0.1);

  // Temple bell resonance overtones (fundamental ~1180Hz, hum ~590Hz, tierce ~1420Hz, quint ~1780Hz)
  const partials = [
    { freq: 590, gain: 0.35, decay: 3.5 },   // Hum note
    { freq: 1180, gain: 0.5, decay: 4.2 },   // Fundamental strike tone
    { freq: 1420, gain: 0.3, decay: 2.8 },   // Tierce
    { freq: 1780, gain: 0.25, decay: 2.2 },  // Quint
    { freq: 2360, gain: 0.15, decay: 1.6 },  // Nominal octave
    { freq: 3540, gain: 0.08, decay: 0.9 }   // Superquint
  ];

  partials.forEach((part) => {
    const osc = ctx.createOscillator();
    const pGain = ctx.createGain();

    osc.type = 'sine';
    // Subtle physical bell detune
    osc.frequency.setValueAtTime(part.freq + (Math.random() * 4 - 2), now);

    pGain.gain.setValueAtTime(part.gain, now);
    pGain.gain.exponentialRampToValueAtTime(0.00001, now + part.decay);

    osc.connect(pGain);
    pGain.connect(bellGain);

    osc.start(now);
    osc.stop(now + part.decay + 0.1);
  });
}

/**
 * Starts or stops the Meditative Tanpura Drone in Key of D (Sa - Pa - Sa' - Sa)
 * D2 (73.4Hz/110Hz), A2 (110Hz/164.81Hz), D3 (146.8Hz/220Hz), D4 (293.6Hz/440Hz)
 */
export function toggleTanpuraDrone() {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (isAudioActive) {
    stopTanpuraDrone();
    return false;
  }

  // Play an auspicious opening bell strike
  playTempleBell();

  // Tanpura fundamental frequencies (Key of D)
  const strings = [
    { freq: 110.0, gain: 0.12, type: 'sawtooth' }, // Pa (sub-harmonic)
    { freq: 164.81, gain: 0.15, type: 'triangle' }, // Pa
    { freq: 220.0, gain: 0.18, type: 'sine' },     // Sa
    { freq: 440.0, gain: 0.08, type: 'triangle' }   // Sa' (high)
  ];

  const droneMaster = ctx.createGain();
  droneMaster.gain.setValueAtTime(0.001, ctx.currentTime);
  droneMaster.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 3.0); // Gentle 3-second fade-in
  droneMaster.connect(masterGain);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, ctx.currentTime);
  filter.Q.setValueAtTime(2, ctx.currentTime);

  strings.forEach((str) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = str.type;
    osc.frequency.setValueAtTime(str.freq, ctx.currentTime);

    // Subtle natural chorusing detune
    osc.detune.setValueAtTime((Math.random() - 0.5) * 6, ctx.currentTime);

    g.gain.setValueAtTime(str.gain, ctx.currentTime);

    // Subtle breath LFO vibrato (0.2 Hz)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.18 + Math.random() * 0.05, ctx.currentTime);
    lfoGain.gain.setValueAtTime(str.gain * 0.3, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(g.gain);
    lfo.start();

    osc.connect(g);
    g.connect(filter);

    osc.start();

    tanpuraNodes.push(osc, lfo);
  });

  filter.connect(droneMaster);
  tanpuraNodes.push(droneMaster, filter);

  isAudioActive = true;
  return true;
}

export function stopTanpuraDrone() {
  if (!audioCtx || !isAudioActive) return;

  tanpuraNodes.forEach((node) => {
    try {
      if (node.stop) node.stop();
      if (node.disconnect) node.disconnect();
    } catch (e) {
      // Ignore cleanup
    }
  });

  tanpuraNodes = [];
  isAudioActive = false;
}

export function getAudioState() {
  return isAudioActive;
}
