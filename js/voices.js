// Myth Seekers — character voices.
//
// Every character speaks with the device's built-in text-to-speech (works offline), and each one
// "performs" its lines to match its personality:
//   • its own pitch, speed and volume
//   • its own installed voice where the device has several (the `prefer` list is tried in order)
//   • its own delivery: how lines are split up, pauses, pitch changes and little sounds
//
// Tune a character by editing its entry below.
//   pitch: 0.1 (very deep) … 2 (very high)    rate: 0.5 (slow) … 1.5 (fast)    pause: ms between phrases
const VOICE_STYLES = {
  // Silly, creative, wiggly — high, fast and bouncy, pitch hopping up and down, giggles.
  scribbi: {
    pitch: 1.75, rate: 1.15, pause: 60, split: "sentence",
    prefer: ["Junior", "Samantha", "Ava", "Microsoft Ana", "Microsoft Aria", "Google US English"],
    shape: (parts, long, text) => {
      parts = parts.map((p, i) => ({ ...p, pitch: i % 2 ? 1.95 : 1.7 }));
      if (long && !/hee/i.test(text)) parts.push({ text: "Hee-hee!", pitch: 2, rate: 1.25 });
      return parts;
    },
  },
  // Chill, steady, wise — very deep and slow, thinks between every phrase.
  craggle: {
    pitch: 0.45, rate: 0.72, pause: 420, split: "phrase",
    prefer: ["Ralph", "Grandpa", "Daniel", "Fred", "Microsoft Guy", "Google UK English Male", "Arthur"],
    shape: (parts, long, text) => (long && !/^h+m+/i.test(text) ? [{ text: "Hmmmm…", rate: 0.6 }, ...parts] : parts),
  },
  // Curious, dreamy, amazed — bright, voice rises at questions and exclamations.
  orbit: {
    pitch: 1.35, rate: 1.0, pause: 140, split: "sentence",
    prefer: ["Kathy", "Tessa", "Karen", "Microsoft Jenny", "Google US English"],
    shape: (parts, long, text) => {
      parts = parts.map((p) => ({ ...p, pitch: /\?\s*$/.test(p.text) ? 1.65 : /!\s*$/.test(p.text) ? 1.5 : 1.3 }));
      return long && !/^(boop|ooo)/i.test(text) ? [{ text: "Ooooh!", pitch: 1.7 }, ...parts] : parts;
    },
  },
  // Clever, playful, cheeky — quick and sly, a little quieter on the sneaky bits, chuckles.
  tangle: {
    pitch: 1.1, rate: 1.2, pause: 90, split: "sentence",
    prefer: ["Jester", "Eddy", "Reed", "Rishi", "Aaron", "Microsoft Christopher"],
    shape: (parts, long, text) => {
      parts = parts.map((p) => ({ ...p, volume: /\?\s*$/.test(p.text) ? 0.85 : 1 }));
      if (long && !/heh/i.test(text)) parts.push({ text: "Heh-heh-heh!", pitch: 1.2, rate: 1.3 });
      return parts;
    },
  },
  // Mysterious, gentle, loyal — soft and slow, sleepy pauses, a purr to start.
  nyxie: {
    pitch: 0.95, rate: 0.8, volume: 0.85, pause: 380, split: "sentence",
    prefer: ["Moira", "Serena", "Shelley", "Martha", "Microsoft Sonia", "Google UK English Female"],
    shape: (parts, long, text) => (long && !/^mr+/i.test(text) ? [{ text: "Mrrrow…", rate: 0.7, pitch: 0.9 }, ...parts] : parts),
  },
  // Cheeky, speedy, fair — steady robot tone (flat pitch, clear voice), short beeps between thoughts.
  glitch: {
    pitch: 0.9, rate: 0.98, pause: 200, split: "sentence",
    prefer: ["Fred", "Alex", "Daniel", "Microsoft David", "Google US English"],
    shape: (parts, long, text) => {
      const beeps = long && !/bleep/i.test(text);
      const out = [];
      parts.forEach((p, i) => { out.push({ ...p, pitch: 0.9 }); if (beeps && i === 0 && parts.length > 1) out.push({ text: "Bleep.", pitch: 1.3, rate: 1.1 }); });
      if (beeps) out.push({ text: "Bleep-bloop!", pitch: 1.25, rate: 1.1 });
      return out;
    },
  },
};

const Voices = (() => {
  let assigned = null;
  let token = 0;
  const english = () => (window.speechSynthesis ? speechSynthesis.getVoices() : [])
    .filter((v) => /^en(-|_|$)/i.test(v.lang))
    .sort((a, b) => (b.localService - a.localService) || a.name.localeCompare(b.name));

  // Give each character a different voice: its favourite if the device has it, otherwise the next unused one.
  function assign() {
    const list = english();
    if (!list.length) return null;
    const used = new Set();
    const map = {};
    Object.entries(VOICE_STYLES).forEach(([id, st]) => {
      const fav = st.prefer.map((n) => list.find((v) => v.name.toLowerCase().startsWith(n.toLowerCase()) && !used.has(v.name))).find(Boolean);
      const v = fav || list.find((x) => !used.has(x.name)) || list[0];
      used.add(v.name); map[id] = v;
    });
    return map;
  }
  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = () => { assigned = assign(); };
    assigned = assign();
  }

  // Break a line into phrases (",;:" too) or sentences.
  function split(text, mode) {
    const re = mode === "phrase" ? /[^.!?,;:…]+[.!?,;:…]*/g : /[^.!?…]+[.!?…]*/g;
    return (text.match(re) || [text]).map((t) => t.trim()).filter(Boolean).map((t) => ({ text: t }));
  }

  function speakAs(id, text) {
    try {
      if (!window.speechSynthesis || !text) return;
      speechSynthesis.cancel();
      if (!assigned) assigned = assign();
      const st = VOICE_STYLES[id] || { pitch: 1.1, rate: 0.95, pause: 100, split: "sentence" };
      const base = split(text, st.split);
      const long = text.length > 60;                // little extras only on longer lines
      const parts = st.shape ? st.shape(base, long, text.trim()) : base;
      const my = ++token;
      const voice = assigned && assigned[id];
      const play = (i) => {
        if (my !== token || i >= parts.length) return;
        const p = parts[i];
        const u = new SpeechSynthesisUtterance(p.text);
        if (voice) { u.voice = voice; u.lang = voice.lang; }
        u.pitch = p.pitch ?? st.pitch;
        u.rate = p.rate ?? st.rate;
        u.volume = p.volume ?? st.volume ?? 1;
        let done = false;
        const next = () => { if (done) return; done = true; setTimeout(() => play(i + 1), st.pause || 0); };
        u.onend = next; u.onerror = next;
        speechSynthesis.speak(u);
      };
      play(0);
    } catch (_) {}
  }
  const stop = () => { token++; try { window.speechSynthesis && speechSynthesis.cancel(); } catch (_) {} };
  return { speakAs, stop, voiceFor: (id) => assigned && assigned[id] };
})();
const speakAs = Voices.speakAs;
