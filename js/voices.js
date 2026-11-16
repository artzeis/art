// Myth Seekers — character voices.
//
// Characters speak with the device's built-in text-to-speech (free, works offline).
// To sound natural rather than robotic:
//   • the best-quality voices on the device are chosen first ("Premium", "Enhanced", "Natural",
//     "Neural", "Online" voices), and old robotic/novelty voices are never used
//   • pitch and speed stay close to normal (big pitch changes are what make voices sound robotic)
//   • each line is spoken in one smooth piece; personality comes from the voice, a gentle
//     pitch/speed change, and a short sound like "Hee-hee!" or "Mrrrow…"
//
// Tune a character below.  pitch: 0.5 (deep) … 1.5 (high), 1 = normal.  rate: 0.7 (slow) … 1.3 (fast).
const VOICE_STYLES = {
  // Silly, creative, wiggly — bright young voice, a bit quick, giggles.
  scribbi: {
    pitch: 1.25, rate: 1.06,
    prefer: ["Ava", "Samantha", "Zoe", "Allison", "Nicky", "Microsoft Ana", "Microsoft Aria", "Microsoft Jenny", "Google US English"],
    before: null, after: { text: "Hee-hee!", pitch: 1.4, rate: 1.1 }, skipIf: /hee/i,
  },
  // Chill, steady, wise — deep, calm, slow, a thoughtful "Hmmm…" first.
  craggle: {
    pitch: 0.78, rate: 0.84,
    prefer: ["Daniel", "Evan", "Tom", "Arthur", "Aaron", "Oliver", "Microsoft Guy", "Microsoft Ryan", "Microsoft Christopher", "Google UK English Male"],
    before: { text: "Hmmm…", rate: 0.75 }, after: null, skipIf: /^h+m+/i,
  },
  // Curious, dreamy, amazed — warm, bright and wide-eyed.
  orbit: {
    pitch: 1.18, rate: 1.0,
    prefer: ["Karen", "Tessa", "Allison", "Susan", "Victoria", "Microsoft Natasha", "Microsoft Libby", "Microsoft Jenny", "Google UK English Female"],
    before: { text: "Ooooh!", pitch: 1.3 }, after: null, skipIf: /^(boop|ooo)/i,
  },
  // Clever, playful, cheeky — quick and sly, with a chuckle.
  tangle: {
    pitch: 1.05, rate: 1.1,
    prefer: ["Rishi", "Nathan", "Alex", "Aaron", "Lee", "Microsoft Brian", "Microsoft Andrew", "Microsoft Guy", "Google US English"],
    before: null, after: { text: "Heh-heh!", pitch: 1.1, rate: 1.05 }, skipIf: /heh/i,
  },
  // Mysterious, gentle, loyal — soft, calm and unhurried, starts with a purr.
  nyxie: {
    pitch: 0.96, rate: 0.88, volume: 0.9,
    prefer: ["Moira", "Serena", "Kate", "Martha", "Fiona", "Stephanie", "Microsoft Sonia", "Microsoft Libby", "Google UK English Female"],
    before: { text: "Mrrrow…", rate: 0.8 }, after: null, skipIf: /^mr+/i,
  },
  // Cheeky, speedy, fair — clear, upbeat game-show style, with a quick beep to finish.
  glitch: {
    pitch: 1.0, rate: 1.04,
    prefer: ["Alex", "Tom", "Evan", "Nathan", "Lee", "Aaron", "Daniel", "Microsoft Eric", "Microsoft Steffan", "Microsoft Davis", "Google US English"],
    before: null, after: { text: "Bleep-bloop!", pitch: 1.2, rate: 1.1 }, skipIf: /bleep/i,
  },
};

// Old robotic and novelty voices (mainly on Apple devices) that are never used.
const ROBOTIC_VOICES = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|eddy|flo|fred|good news|grandma|grandpa|hysterical|jester|junior|kathy|organ|princess|ralph|reed|rocko|sandy|shelley|superstar|trinoids|whisper|wobble|zarvox)\b/i;
const QUALITY_VOICES = /premium|enhanced|natural|neural|online|siri/i;

const Voices = (() => {
  let assigned = null;
  let token = 0;

  const score = (v) => (QUALITY_VOICES.test(v.name) ? 50 : 0) + (v.localService ? 0 : 5) + (/^en-(us|gb)/i.test(v.lang) ? 2 : 0);
  const englishVoices = () => (window.speechSynthesis ? speechSynthesis.getVoices() : [])
    .filter((v) => /^en(-|_|$)/i.test(v.lang) && !ROBOTIC_VOICES.test(v.name))
    .sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));

  // Each character gets its best preferred voice the device has (highest quality first),
  // a different one from the other characters where possible.
  function assign() {
    const list = englishVoices();
    if (!list.length) return null;
    const used = new Set();
    const map = {};
    Object.entries(VOICE_STYLES).forEach(([id, st]) => {
      // Among this character's preferred voices, a high-quality one wins; otherwise the earliest in the list.
      let v = null, best = -Infinity;
      st.prefer.forEach((pref, i) => {
        list.forEach((x) => {
          if (used.has(x.name) || !x.name.toLowerCase().startsWith(pref.toLowerCase())) return;
          const sc = (QUALITY_VOICES.test(x.name) ? 100 : 0) - i;
          if (sc > best) { best = sc; v = x; }
        });
      });
      v = v || list.find((x) => !used.has(x.name)) || list[0];
      used.add(v.name);
      map[id] = v;
    });
    return map;
  }
  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = () => { assigned = assign(); };
    assigned = assign();
  }

  function speakAs(id, text) {
    try {
      if (!window.speechSynthesis || !text) return;
      speechSynthesis.cancel();
      if (!assigned) assigned = assign();
      const st = VOICE_STYLES[id] || { pitch: 1, rate: 1 };
      const line = String(text).trim();
      const extras = line.length > 40 && !(st.skipIf && st.skipIf.test(line));
      const parts = [
        extras && st.before ? st.before : null,
        { text: line },
        extras && st.after ? st.after : null,
      ].filter(Boolean);
      const my = ++token;
      const voice = assigned && assigned[id];
      const play = (i) => {
        if (my !== token || i >= parts.length) return;
        const p = parts[i];
        const u = new SpeechSynthesisUtterance(p.text);
        if (voice) { u.voice = voice; u.lang = voice.lang; }
        u.pitch = p.pitch ?? st.pitch;
        u.rate = p.rate ?? st.rate;
        u.volume = st.volume ?? 1;
        let done = false;
        const next = () => { if (done) return; done = true; setTimeout(() => play(i + 1), 120); };
        u.onend = next; u.onerror = next;
        speechSynthesis.speak(u);
      };
      play(0);
    } catch (_) {}
  }
  const stop = () => { token++; try { window.speechSynthesis && speechSynthesis.cancel(); } catch (_) {} };
  const voiceFor = (id) => { if (!assigned) assigned = assign(); return assigned && assigned[id]; };
  const hasQualityVoices = () => englishVoices().some((v) => QUALITY_VOICES.test(v.name));
  return { speakAs, stop, voiceFor, hasQualityVoices };
})();
const speakAs = Voices.speakAs;
