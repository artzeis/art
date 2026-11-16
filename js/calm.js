// Imagamigos — "Calm down with Nyxie": a 2½-minute wind-down after active play or before bed.
// Nyxie speaks each step softly; a glowing moon grows and shrinks to pace slow breathing.
// Edit the steps below — seconds is how long each one lasts.
const CALM_STEPS = [
  { text: "Let's get cosy. Sit or lie down somewhere soft, next to your grown-up.", seconds: 12, icon: "🛏️" },
  { text: "Moon breathing. Breathe in slowly as the moon grows… and out as it shrinks.", seconds: 40, icon: "🌙", breathe: true },
  { text: "Cat stretch. Reach your paws up high… and slowly bring them down.", seconds: 15, icon: "🐈" },
  { text: "Curl up small, like a sleepy crescent moon.", seconds: 15, icon: "🌙" },
  { text: "Star squeeze. Squeeze your hands into tight little fists… and let go. Again… and let go.", seconds: 16, icon: "⭐" },
  { text: "Think of one happy thing from today, and whisper it to your grown-up.", seconds: 20, icon: "💜" },
  { text: "You did wonderfully, little Seeker. Mrrrow… sweet dreams.", seconds: 8, icon: "✨", last: true },
];

const Calm = (() => {
  let stage, timer, breathTimer, onExit;

  function start(exitCb) {
    onExit = exitCb;
    stage = document.createElement("div");
    stage.className = "calm-stage";
    const nyxie = typeof CREATURES !== "undefined" && CREATURES.find((c) => c.id === "nyxie");
    stage.innerHTML = `
      <div class="calm-stars"></div>
      <div class="calm-top">
        <button class="btn" data-calm="exit">✕ Stop</button>
        <div class="calm-dots">${CALM_STEPS.map(() => "<i></i>").join("")}</div>
        <button class="btn" data-calm="skip">Skip ▶</button>
      </div>
      <div class="calm-moon" aria-hidden="true"><div class="calm-moon-glow"></div>${nyxie ? creatureArt("nyxie") : "🌙"}</div>
      <div class="calm-breath" aria-live="polite"></div>
      <div class="calm-card"><span class="calm-icon"></span><p class="calm-text"></p></div>`;
    document.body.appendChild(stage);
    stage.addEventListener("click", (e) => {
      const a = e.target.closest("[data-calm]")?.dataset.calm;
      if (a === "exit" || a === "done") stop();
      if (a === "skip") show(current + 1);
    });
    show(0);
  }

  let current = 0;
  function show(i) {
    clearTimeout(timer); clearTimeout(breathTimer);
    if (!stage) return;
    if (i >= CALM_STEPS.length) return stop();
    current = i;
    const st = CALM_STEPS[i];
    stage.querySelectorAll(".calm-dots i").forEach((d, k) => d.classList.toggle("on", k <= i));
    stage.querySelector(".calm-icon").textContent = st.icon;
    stage.querySelector(".calm-text").textContent = st.text;
    stage.classList.remove("breathing");
    const breath = stage.querySelector(".calm-breath");
    breath.textContent = "";
    speakAs("nyxie", st.text);
    if (st.breathe) {
      // 4 seconds in, 6 seconds out — the moon animation in CSS uses the same 10-second rhythm.
      let phase = 0;
      const tick = () => {
        if (phase === 0) stage && stage.classList.add("breathing"); // start the moon on the first "in"
        const inhale = phase % 2 === 0;
        breath.textContent = inhale ? "Breathe in…" : "…and out";
        phase++;
        breathTimer = setTimeout(tick, inhale ? 4000 : 6000);
      };
      breathTimer = setTimeout(tick, 5000); // let Nyxie finish explaining first
    }
    if (st.last) {
      stage.querySelector(".calm-card").insertAdjacentHTML("beforeend", `<button class="btn primary" data-calm="done">Goodnight 🌙</button>`);
      return;
    }
    timer = setTimeout(() => show(i + 1), st.seconds * 1000);
  }

  function stop() {
    clearTimeout(timer); clearTimeout(breathTimer);
    if (typeof Voices !== "undefined") Voices.stop();
    if (stage) stage.remove();
    stage = null;
    if (onExit) onExit();
  }

  return { start, stop };
})();
