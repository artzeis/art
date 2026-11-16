// Imagamigos — character voices.
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
    pitch: 1.25, rate: 1.06, voice: "f",
    prefer: ["Zoe", "Ava", "Joelle", "Samantha", "Allison", "Nicky", "Noelle", "Microsoft Ana", "Microsoft Aria", "Microsoft Jenny", "Google US English"],
    before: null, after: { text: "Hee-hee!", pitch: 1.4, rate: 1.1 }, skipIf: /hee/i,
  },
  // Chill, steady, wise — deep, calm, slow, a thoughtful "Hmmm…" first.
  craggle: {
    pitch: 0.78, rate: 0.84, voice: "m",
    prefer: ["Malcolm", "Daniel", "Evan", "Tom", "Arthur", "Aaron", "Oliver", "Microsoft Guy", "Microsoft Ryan", "Microsoft Christopher", "Google UK English Male"],
    before: { text: "Hmmm…", rate: 0.75 }, after: null, skipIf: /^h+m+/i,
  },
  // Curious, dreamy, amazed — warm, bright and wide-eyed.
  orbit: {
    pitch: 1.18, rate: 1.0, voice: "f",
    prefer: ["Isha", "Karen", "Tessa", "Allison", "Susan", "Matilda", "Victoria", "Microsoft Natasha", "Microsoft Libby", "Microsoft Jenny", "Google UK English Female"],
    before: { text: "Ooooh!", pitch: 1.3 }, after: null, skipIf: /^(boop|ooo)/i,
  },
  // Clever, playful, cheeky — quick and sly, with a chuckle.
  tangle: {
    pitch: 1.05, rate: 1.1, voice: "m",
    prefer: ["Nathan", "Rishi", "Lee", "Alex", "Aaron", "Microsoft Brian", "Microsoft Andrew", "Microsoft Guy", "Google US English"],
    before: null, after: { text: "Heh-heh!", pitch: 1.1, rate: 1.05 }, skipIf: /heh/i,
  },
  // Mysterious, gentle, loyal — soft, calm and unhurried, starts with a purr.
  nyxie: {
    pitch: 0.96, rate: 0.88, volume: 0.9, voice: "f",
    prefer: ["Serena", "Moira", "Kate", "Jamie", "Martha", "Fiona", "Stephanie", "Microsoft Sonia", "Microsoft Libby", "Google UK English Female"],
    before: { text: "Mrrrow…", rate: 0.8 }, after: null, skipIf: /^mr+/i,
  },
  // Cheeky, speedy, fair — clear, upbeat game-show style, with a quick beep to finish.
  glitch: {
    pitch: 1.0, rate: 1.04, voice: "m",
    prefer: ["Evan", "Alex", "Tom", "Nathan", "Lee", "Aaron", "Daniel", "Microsoft Eric", "Microsoft Steffan", "Microsoft Davis", "Google US English"],
    before: null, after: { text: "Bleep-bloop!", pitch: 1.2, rate: 1.1 }, skipIf: /bleep/i,
  },
  // Loyal, gentle, brave — warm, friendly and steady, a happy howl first.
  leo: {
    pitch: 0.92, rate: 0.95, voice: "m",
    prefer: ["Oliver", "Aaron", "Arthur", "Daniel", "Evan", "Tom", "Microsoft Andrew", "Microsoft Guy", "Google UK English Male"],
    before: { text: "Awoooo!", pitch: 1.05, rate: 0.85 }, after: null, skipIf: /^awoo/i,
  },
  // Storyteller for the Dreamwood Storybook — warm, clear and a little slow. (Listed last so the
  // characters get first pick of the voices.)
  narrator: {
    pitch: 1.0, rate: 0.92, voice: "f",
    prefer: ["Serena", "Kate", "Samantha", "Karen", "Moira", "Microsoft Libby", "Microsoft Sonia", "Google UK English Female"],
    before: null, after: null,
  },
};

// Old robotic and novelty voices (mainly on Apple devices) that are never used.
const ROBOTIC_VOICES = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|eddy|flo|fred|good news|grandma|grandpa|hysterical|jester|junior|kathy|organ|princess|ralph|reed|rocko|sandy|shelley|superstar|trinoids|whisper|wobble|zarvox)\b/i;
const QUALITY_VOICES = /premium|enhanced|natural|neural|online|siri/i;
// Rough guide to which voices sound higher/lighter or lower/deeper, used to match characters.
const LIGHT_VOICES = /^(ava|zoe|joelle|noelle|samantha|allison|nicky|susan|karen|tessa|moira|serena|kate|fiona|martha|stephanie|victoria|isha|matilda|jamie|catherine|veena|microsoft (ana|aria|jenny|natasha|libby|sonia|emma|michelle|clara)|google uk english female|google us english)/i;
const DEEP_VOICES = /^(daniel|evan|tom|arthur|aaron|oliver|nathan|rishi|lee|alex|malcolm|gordon|microsoft (guy|ryan|christopher|brian|andrew|eric|steffan|davis|david|william)|google uk english male)/i;
const CHOICE_KEY = "mythSeekers.voiceChoices";

const Voices = (() => {
  let assigned = null;
  let token = 0;

  const score = (v) => (QUALITY_VOICES.test(v.name) ? 50 : 0) + (v.localService ? 0 : 5) + (/^en-(us|gb)/i.test(v.lang) ? 2 : 0);
  const englishVoices = () => (window.speechSynthesis ? speechSynthesis.getVoices() : [])
    .filter((v) => /^en(-|_|$)/i.test(v.lang) && !ROBOTIC_VOICES.test(v.name))
    .sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));

  // Voices a grown-up picked by hand in Voice check (saved on this device).
  let choices = {};
  try { choices = JSON.parse(localStorage.getItem(CHOICE_KEY) || "{}"); } catch (_) {}
  const saveChoices = () => { try { localStorage.setItem(CHOICE_KEY, JSON.stringify(choices)); } catch (_) {} };

  // Automatic choice: every voice on the device is scored for each character —
  //   high-quality (Enhanced / Premium / Natural) voices count most, so voices you download are used,
  //   then a voice that suits the character (lighter or deeper), then the character's favourite names.
  // Each character gets a different voice where possible. Hand-picked voices always win.
  function assign() {
    const list = englishVoices();
    if (!list.length) return null;
    const all = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    const used = new Set();
    const map = {};
    Object.entries(choices).forEach(([id, name]) => {
      const v = all.find((x) => x.name === name);
      if (v && VOICE_STYLES[id]) { map[id] = v; used.add(v.name); }
    });
    Object.entries(VOICE_STYLES).forEach(([id, st]) => {
      if (map[id]) return;
      let v = null, best = -Infinity;
      list.forEach((x) => {
        if (used.has(x.name)) return;
        let sc = QUALITY_VOICES.test(x.name) ? 100 : 0;
        if (st.voice === "f" && LIGHT_VOICES.test(x.name)) sc += 30;
        if (st.voice === "m" && DEEP_VOICES.test(x.name)) sc += 30;
        const pi = st.prefer.findIndex((pref) => x.name.toLowerCase().startsWith(pref.toLowerCase()));
        if (pi >= 0) sc += 20 - pi;
        if (/^en-(us|gb)/i.test(x.lang)) sc += 1;
        if (sc > best) { best = sc; v = x; }
      });
      v = v || list[0];
      used.add(v.name);
      map[id] = v;
    });
    return map;
  }
  const listeners = [];
  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = () => { assigned = assign(); listeners.forEach((f) => f()); };
    assigned = assign();
  }

  function speakAs(id, text) {
    try {
      if (!window.speechSynthesis || !text) return;
      speechSynthesis.cancel();
      if (!assigned) assigned = assign();
      const st = VOICE_STYLES[id] || { pitch: 1, rate: 1 };
      let parts;
      if (Array.isArray(text)) {
        // A list of paragraphs (e.g. a story chapter): read them in order, no extra sounds.
        parts = text.map((t) => ({ text: String(t).trim() })).filter((p) => p.text);
      } else {
        const line = String(text).trim();
        const extras = line.length > 40 && !(st.skipIf && st.skipIf.test(line));
        parts = [
          extras && st.before ? st.before : null,
          { text: line },
          extras && st.after ? st.after : null,
        ].filter(Boolean);
      }
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
        const next = () => { if (done) return; done = true; setTimeout(() => play(i + 1), Array.isArray(text) ? 450 : 120); };
        u.onend = next; u.onerror = next;
        speechSynthesis.speak(u);
      };
      play(0);
    } catch (_) {}
  }
  const stop = () => { token++; try { window.speechSynthesis && speechSynthesis.cancel(); } catch (_) {} };
  const voiceFor = (id) => { if (!assigned) assigned = assign(); return assigned && assigned[id]; };
  const hasQualityVoices = () => englishVoices().some((v) => QUALITY_VOICES.test(v.name));
  // For the Voice check menus: all usable English voices, best first, marked ⭐ when high-quality.
  const options = () => englishVoices().map((v) => ({ name: v.name, lang: v.lang, quality: QUALITY_VOICES.test(v.name) }));
  const choose = (id, name) => { if (name) choices[id] = name; else delete choices[id]; saveChoices(); assigned = assign(); };
  const chosen = (id) => choices[id] || "";
  const onChange = (f) => listeners.push(f);
  return { speakAs, stop, voiceFor, hasQualityVoices, options, choose, chosen, onChange };
})();
const speakAs = Voices.speakAs;
