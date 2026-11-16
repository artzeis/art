// Myth Seekers — character voices.
//
// Every character speaks with the device's built-in text-to-speech, but each one gets
// its own pitch and speed, plus its own installed voice where the device has several.
// Tune a character by changing its numbers below:
//   pitch: 0.1 (very deep) … 2 (very high)    rate: 0.5 (slow) … 1.5 (fast)
//   prefer: voice names to try first (the first one found on the device is used)
const VOICE_STYLES = {
  scribbi: { pitch: 1.75, rate: 1.15, prefer: ["Junior", "Samantha", "Ava", "Microsoft Aria", "Google US English"] },  // giggly & bouncy
  craggle: { pitch: 0.45, rate: 0.72, prefer: ["Ralph", "Albert", "Grandpa", "Daniel", "Microsoft Guy", "Google UK English Male", "Fred"] }, // deep, slow rumble
  orbit:   { pitch: 1.35, rate: 1.0,  prefer: ["Kathy", "Flo", "Tessa", "Karen", "Microsoft Jenny", "Google UK English Female"] }, // curious & wide-eyed
  tangle:  { pitch: 1.1,  rate: 1.18, prefer: ["Jester", "Eddy", "Rishi", "Reed", "Aaron", "Microsoft Christopher"] },   // quick & sneaky
  nyxie:   { pitch: 0.95, rate: 0.82, volume: 0.9, prefer: ["Moira", "Shelley", "Serena", "Martha", "Microsoft Sonia", "Google UK English Female"] }, // soft & sleepy
  glitch:  { pitch: 0.7,  rate: 1.3,  prefer: ["Zarvox", "Trinoids", "Fred", "Microsoft David", "Google US English"] },    // beepy robot
};

const Voices = (() => {
  let assigned = null;
  const english = () => (window.speechSynthesis ? speechSynthesis.getVoices() : [])
    .filter((v) => /^en(-|_|$)/i.test(v.lang))
    .sort((a, b) => (b.localService - a.localService) || a.name.localeCompare(b.name));

  // Give each character a different voice: their favourite if available, otherwise the next unused one.
  function assign() {
    const list = english();
    if (!list.length) return null;
    const used = new Set();
    const map = {};
    Object.entries(VOICE_STYLES).forEach(([id, st]) => {
      const fav = st.prefer.map((n) => list.find((v) => v.name.toLowerCase().includes(n.toLowerCase()) && !used.has(v.name))).find(Boolean);
      const v = fav || list.find((x) => !used.has(x.name)) || list[0];
      used.add(v.name); map[id] = v;
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
      const st = VOICE_STYLES[id] || { pitch: 1.1, rate: 0.95 };
      const u = new SpeechSynthesisUtterance(text);
      const v = assigned && assigned[id];
      if (v) { u.voice = v; u.lang = v.lang; }
      u.pitch = st.pitch; u.rate = st.rate; u.volume = st.volume ?? 1;
      speechSynthesis.speak(u);
    } catch (_) {}
  }
  const stop = () => { try { window.speechSynthesis && speechSynthesis.cancel(); } catch (_) {} };
  return { speakAs, stop, voiceFor: (id) => assigned && assigned[id] };
})();
const speakAs = Voices.speakAs;
