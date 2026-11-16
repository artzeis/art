// Optional AR "hide and seek" mode.
// The creature is hidden at a random direction around the player. Kids turn the
// phone (compass/gyro) — or swipe on devices without motion sensors — and
// follow the warm/cold meter until the creature appears over the camera view.
const AR = (() => {
  const FOV = 60;          // degrees of view across the screen width
  const FOUND_WITHIN = 12; // degrees from centre that counts as "found"

  let stage, video, stream, raf, state;

  const norm = (d) => ((d % 360) + 540) % 360 - 180; // -> [-180, 180)

  function onOrientation(e) {
    let h = null;
    if (typeof e.webkitCompassHeading === "number") h = e.webkitCompassHeading;
    else if (typeof e.alpha === "number") h = 360 - e.alpha;
    if (h === null) return;
    state.sensor = true;
    state.rawHeading = h;
  }

  function onPointerDown(e) { state.drag = { x: e.clientX, h: state.rawHeading }; }
  function onPointerMove(e) {
    if (!state.drag || state.sensor) return;
    state.rawHeading = state.drag.h - (e.clientX - state.drag.x) * 0.35;
  }
  function onPointerUp() { state.drag = null; }

  async function start(creature, { onFound, onClose } = {}) {
    // iOS needs permission for motion sensors, requested inside the tap.
    try {
      if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
        await DeviceOrientationEvent.requestPermission();
      }
    } catch (_) { /* fall back to swiping */ }

    state = {
      creature, onFound, onClose,
      rawHeading: 0, heading: 0, sensor: false, drag: null,
      target: null, found: false, factIndex: 0,
    };

    stage = document.createElement("div");
    stage.className = "ar-stage";
    stage.innerHTML = `
      <div class="fallback-bg"></div>
      <video playsinline muted autoplay></video>
      <div class="ar-hud">
        <button class="btn" data-ar="close">✕ Exit</button>
        <span>❄️</span><div class="meter" aria-label="Warm or cold"><i></i></div><span>🔥</span>
      </div>
      <span class="arrow left" hidden>⬅️</span><span class="arrow right" hidden>➡️</span>
      <button class="ar-creature" aria-label="${creature.name}" style="opacity:0">${CREATURE_SVG[creature.id]}</button>
      <div class="ar-msg"><b>${creature.name}</b> is hiding somewhere around you!
        <div class="small muted" data-ar="tip">Turn slowly in a circle and watch the meter get warmer. 🔥</div></div>`;
    document.body.appendChild(stage);
    video = stage.querySelector("video");

    stage.addEventListener("click", onStageClick);
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("deviceorientation", onOrientation);

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      video.srcObject = stream;
    } catch (_) {
      video.remove(); // keep the illustrated forest background
    }

    // Wait a moment to learn the starting heading, then hide the creature
    // somewhere behind or beside the player.
    setTimeout(() => {
      if (!state) return;
      if (!state.sensor) {
        stage.querySelector('[data-ar="tip"]').textContent =
          "Swipe left and right to look around, and watch the meter get warmer. 🔥";
      }
      state.heading = state.rawHeading;
      const offset = (90 + Math.random() * 180) * (Math.random() < 0.5 ? -1 : 1);
      state.target = (state.heading + offset + 360) % 360;
    }, 700);

    loop();
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    if (!state || state.target === null) return;
    // Smooth the heading so the creature doesn't jitter.
    state.heading += norm(state.rawHeading - state.heading) * 0.2;
    const delta = norm(state.target - state.heading);
    const el = stage.querySelector(".ar-creature");
    const visible = Math.abs(delta) < FOV / 2 + 10;
    el.style.opacity = visible ? 1 : 0;
    el.style.pointerEvents = visible ? "auto" : "none";
    el.style.transform = `translateX(${(delta / (FOV / 2)) * (window.innerWidth / 2)}px)`;
    stage.querySelector(".meter i").style.width = `${Math.round((1 - Math.abs(delta) / 180) * 100)}%`;
    stage.querySelector(".arrow.left").hidden = visible || delta > 0;
    stage.querySelector(".arrow.right").hidden = visible || delta < 0;

    if (!state.found && Math.abs(delta) < FOUND_WITHIN) {
      state.found = true;
      if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
      el.classList.add("happy");
      showMenu(`🎉 You found ${state.creature.name}! Tap the creature or pick something to do.`);
      state.onFound && state.onFound(state.creature);
    }
  }

  function showMenu(text) {
    stage.querySelector(".ar-msg").innerHTML = `
      <div data-ar="text">${text}</div>
      <div class="row">
        <button class="btn" data-ar="wave">👋 Wave</button>
        <button class="btn" data-ar="spin">🌀 Spin</button>
        <button class="btn primary" data-ar="fact">💡 Fun fact</button>
        <button class="btn good" data-ar="close">✔ Done</button>
      </div>`;
  }

  function animate(cls) {
    const el = stage.querySelector(".ar-creature");
    el.classList.remove("happy", "spin");
    void el.offsetWidth; // restart animation
    el.classList.add(cls);
  }

  function onStageClick(e) {
    const action = e.target.closest("[data-ar]")?.dataset.ar;
    const c = state.creature;
    const say = (t) => { const n = stage.querySelector('[data-ar="text"]'); if (n) n.textContent = t; };
    if (e.target.closest(".ar-creature") && state.found) {
      animate("happy");
      say(`${c.name}: "${c.facts[state.factIndex++ % c.facts.length]}"`);
      return;
    }
    if (action === "close") return stop();
    if (action === "wave") { animate("happy"); say(`${c.name} waves back at you! 👋`); }
    if (action === "spin") { animate("spin"); say(`Wheee! ${c.name} does a twirl!`); }
    if (action === "fact") { animate("happy"); say(`💡 ${c.facts[state.factIndex++ % c.facts.length]}`); }
  }

  function stop() {
    cancelAnimationFrame(raf);
    window.removeEventListener("deviceorientation", onOrientation);
    window.removeEventListener("pointerup", onPointerUp);
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
    stage && stage.remove();
    const cb = state && state.onClose;
    state = null;
    cb && cb();
  }

  return { start, stop };
})();
