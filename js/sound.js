/*
 * Tiny synthesized sound effects (no audio files). Each theme gets its own
 * timbre and key. Sound can be switched off from the top bar.
 */
(function (root) {
  'use strict';

  const KEY = 'wordweave:sound';
  let enabled = true;
  try { enabled = localStorage.getItem(KEY) !== 'off'; } catch (e) { /* ignore */ }

  let ctx = null;
  let master = null;
  let voice = { wave: 'sine', base: 523.25, gain: 1 };

  // timbre + key per theme
  const VOICES = {
    space: { wave: 'sine', base: 440, gain: 1, shimmer: true },
    technology: { wave: 'square', base: 523.25, gain: 0.35 },
    science: { wave: 'square', base: 587.33, gain: 0.3 },
    history: { wave: 'triangle', base: 392, gain: 1.1 },
    music: { wave: 'triangle', base: 523.25, gain: 1.1, shimmer: true },
    ocean: { wave: 'sine', base: 392, gain: 1, shimmer: true },
    nature: { wave: 'sine', base: 659.25, gain: 0.9 },
    food: { wave: 'triangle', base: 587.33, gain: 1 },
    animals: { wave: 'triangle', base: 493.88, gain: 1 },
    sports: { wave: 'sawtooth', base: 440, gain: 0.25 },
    geography: { wave: 'sine', base: 493.88, gain: 1 },
    arts: { wave: 'triangle', base: 698.46, gain: 0.9, shimmer: true },
    general: { wave: 'sine', base: 523.25, gain: 1 },
    custom: { wave: 'sine', base: 523.25, gain: 1, shimmer: true }
  };

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  const note = (n) => voice.base * Math.pow(2, n / 12);

  function tone(freq, at, dur, vol, type) {
    const c = ac();
    if (!c) return;
    const t = c.currentTime + at;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || voice.wave;
    o.frequency.setValueAtTime(freq, t);
    const v = vol * voice.gain;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(v, 0.0002), t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + dur + 0.05);
    if (voice.shimmer && dur > 0.15) {
      const o2 = c.createOscillator();
      const g2 = c.createGain();
      o2.type = 'sine';
      o2.frequency.setValueAtTime(freq * 2.003, t);
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(Math.max(v * 0.3, 0.0002), t + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + dur * 1.2);
      o2.connect(g2).connect(master);
      o2.start(t);
      o2.stop(t + dur * 1.2 + 0.05);
    }
  }

  const PENTA = [0, 2, 4, 7, 9];

  function play(name, arg) {
    if (!enabled) return;
    switch (name) {
      case 'type': tone(note(12 + PENTA[(Math.random() * PENTA.length) | 0]), 0, 0.08, 0.03); break;
      case 'erase': tone(note(-5), 0, 0.07, 0.025); break;
      case 'click': tone(note(7), 0, 0.06, 0.025); break;
      case 'word': [0, 4, 7, 12].forEach((n, i) => tone(note(n + 12), i * 0.065, 0.32, 0.045)); break;
      case 'combo': {
        const lift = Math.min(arg || 2, 6) * 2;
        [0, 7, 12, 16].forEach((n, i) => tone(note(n + 12 + lift), i * 0.05, 0.3, 0.045));
        break;
      }
      case 'wrong': tone(note(-12), 0, 0.2, 0.05, 'triangle'); tone(note(-13), 0.06, 0.22, 0.04, 'triangle'); break;
      case 'good': tone(note(12), 0, 0.15, 0.04); tone(note(19), 0.08, 0.25, 0.04); break;
      case 'win': {
        [0, 4, 7, 12, 16, 19, 24].forEach((n, i) => tone(note(n), i * 0.09, 0.5, 0.05));
        [0, 4, 7].forEach((n) => tone(note(n + 12), 0.7, 1.4, 0.035));
        break;
      }
      case 'levelup': [7, 12, 16, 19, 24, 28].forEach((n, i) => tone(note(n), i * 0.07, 0.45, 0.045)); break;
      default: break;
    }
  }

  // ---------- generative ambient music ----------
  let musicOn = false;
  let musicTimer = null;
  let step = 0;
  const PROG = [[0, 7, 16], [-3, 4, 12], [-7, 0, 9], [-5, 2, 11]]; // I – vi – IV – V voicings

  function pad(freq, at, dur, vol) {
    const c = ac();
    if (!c) return;
    const t = c.currentTime + at;
    const o = c.createOscillator();
    const f = c.createBiquadFilter();
    const g = c.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(freq, t);
    f.type = 'lowpass';
    f.frequency.value = 900;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + dur * 0.35);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(f).connect(g).connect(master);
    o.start(t);
    o.stop(t + dur + 0.1);
  }

  function musicTick() {
    if (!musicOn || document.hidden) return;
    const chord = PROG[Math.floor(step / 2) % PROG.length];
    const low = voice.base / 4;
    if (step % 2 === 0) chord.forEach((n) => pad(low * Math.pow(2, n / 12), 0, 7.5, 0.018));
    // sparse melody from the pentatonic scale
    if (Math.random() < 0.7) {
      const n = chord[0] + 12 + PENTA[(Math.random() * PENTA.length) | 0] + (Math.random() < 0.3 ? 12 : 0);
      tone(low * 2 * Math.pow(2, n / 12), Math.random() * 1.2, 1.6, 0.012, 'sine');
    }
    step++;
  }

  function setMusic(on) {
    musicOn = !!on;
    clearInterval(musicTimer);
    musicTimer = null;
    if (musicOn) {
      if (!ac()) return;
      musicTick();
      musicTimer = setInterval(musicTick, 3600);
    }
  }

  function setTheme(id) { voice = VOICES[id] || VOICES.general; }
  function setEnabled(on) {
    enabled = !!on;
    try { localStorage.setItem(KEY, enabled ? 'on' : 'off'); } catch (e) { /* ignore */ }
  }
  function isOn() { return enabled; }
  function toggle() {
    enabled = !enabled;
    try { localStorage.setItem(KEY, enabled ? 'on' : 'off'); } catch (e) { /* ignore */ }
    if (enabled) play('click');
    return enabled;
  }

  root.CW = Object.assign(root.CW || {}, { sound: { play, setTheme, toggle, isOn, setEnabled, setMusic } });
})(window);
