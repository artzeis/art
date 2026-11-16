// AR Hide & Seek.
//
// Phase 1 — SCAN: the camera looks around the room. Each video frame is analysed
//   on a tiny canvas: the most detailed (high-edge) patch of the picture is a good
//   "something to hide behind" spot (furniture, plants, shelves). The best spot is
//   remembered for every 30° slice of the room the player sweeps across.
// Phase 2 — SEEK: the creature hides in one of the scanned spots, away from where
//   the player is facing. A warm/cold meter and arrows guide the player; when the
//   spot comes into view the creature peeks out from behind it.
// Phase 3 — FOUND: tap the creature (or hold it in the middle) and it pops out to play.
//
// Works with compass/gyro on phones, swipe-to-look on devices without sensors,
// and an illustrated forest when there is no camera.
const AR = (() => {
  const FOV = 60;            // horizontal degrees across the screen
  const VFOV = 50;           // vertical degrees across the screen
  const SLICE = 30;          // degrees per room slice
  const SLICES_NEEDED = 4;   // sweep ~120° to finish scanning
  const SCAN_MIN_MS = 3500, SCAN_MAX_MS = 12000;
  const GRID_X = 4, GRID_Y = 3;

  let stage, video, stream, raf, state, canvas, ctx;
  const norm = (d) => ((d % 360) + 540) % 360 - 180;
  const $ = (sel) => stage.querySelector(sel);

  // ---------- Sensors & swipe ----------
  function onOrientation(e) {
    let h = null;
    if (typeof e.webkitCompassHeading === "number") h = e.webkitCompassHeading;
    else if (typeof e.alpha === "number") h = 360 - e.alpha;
    if (h === null) return;
    state.sensor = true;
    state.rawHeading = h;
    if (typeof e.beta === "number") state.rawPitch = e.beta;
  }
  function onPointerDown(e) { state.drag = { x: e.clientX, h: state.rawHeading }; }
  function onPointerMove(e) {
    if (!state.drag || state.sensor) return;
    state.rawHeading = state.drag.h - (e.clientX - state.drag.x) * 0.3;
  }
  function onPointerUp() { state.drag = null; }

  // ---------- Frame analysis ----------
  // Returns the grid cell with the most visual detail and its score.
  function analyseFrame() {
    if (!video || video.readyState < 2) return null;
    const w = canvas.width, h = canvas.height;
    ctx.drawImage(video, 0, 0, w, h);
    const px = ctx.getImageData(0, 0, w, h).data;
    const lum = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) lum[i] = px[i * 4] * 0.3 + px[i * 4 + 1] * 0.59 + px[i * 4 + 2] * 0.11;
    const cells = new Float32Array(GRID_X * GRID_Y);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        const g = Math.abs(lum[i + 1] - lum[i - 1]) + Math.abs(lum[i + w] - lum[i - w]);
        cells[Math.min(GRID_Y - 1, (y * GRID_Y / h) | 0) * GRID_X + Math.min(GRID_X - 1, (x * GRID_X / w) | 0)] += g;
      }
    }
    let best = 0;
    for (let i = 1; i < cells.length; i++) {
      // Prefer the lower two rows: things on floors and tables make better hiding places.
      const bias = (k) => cells[k] * (((k / GRID_X) | 0) === 0 ? 0.7 : 1);
      if (bias(i) > bias(best)) best = i;
    }
    return { score: cells[best] / ((w * h) / cells.length), cx: best % GRID_X, cy: (best / GRID_X) | 0 };
  }

  // ---------- Start ----------
  async function start(creature, { onFound, onClose } = {}) {
    try {
      if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
        await DeviceOrientationEvent.requestPermission();
      }
    } catch (_) { /* fall back to swiping */ }

    state = {
      creature, onFound, onClose, phase: "scan",
      rawHeading: 0, heading: 0, rawPitch: 90, pitch: 90, sensor: false, drag: null,
      slices: {}, scanStart: performance.now(), lastAnalyse: 0, lastPing: 0,
      target: null, holdSince: 0, factIndex: 0,
    };

    stage = document.createElement("div");
    stage.className = "ar-stage";
    stage.style.setProperty("--c", creature.color);
    stage.innerHTML = `
      <div class="fallback-bg"></div>
      <video playsinline muted autoplay></video>
      <div class="scan-grid"></div><div class="scan-line"></div>
      <div class="scan-ring" style="--p:0"><div><span><span data-ar="pct">0%</span><small>scanning</small></span></div></div>
      <div class="ar-hud">
        <button class="btn" data-ar="close">✕ Exit</button>
        <div class="meter" aria-label="Warm or cold" hidden><i></i></div>
      </div>
      <span class="arrow left" hidden>⬅️</span><span class="arrow right" hidden>➡️</span>
      <button class="ar-creature" aria-label="${creature.name}" style="opacity:0">
        <div class="wrap"><span class="ar-shadow"></span>${creature.moonForm ? `<img class="char-img" src="${creature.moonForm}" alt="" draggable="false">` : creatureArt(creature.id)}</div>
      </button>
      <div class="ar-msg"><div data-ar="text"><b>Step 1 · Scan the room</b><br>
        <span class="small">Hold the phone up and slowly look around the room so ${creature.name} can find a hiding spot.</span></div></div>`;
    document.body.appendChild(stage);
    video = $("video");
    canvas = document.createElement("canvas");
    canvas.width = 64; canvas.height = 48;
    ctx = canvas.getContext("2d", { willReadFrequently: true });

    stage.addEventListener("click", onStageClick);
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("deviceorientation", onOrientation);

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      if (!state) { stream.getTracks().forEach((t) => t.stop()); return; }
      video.srcObject = stream;
      $(".fallback-bg").remove();
    } catch (_) {
      video.remove(); video = null; // keep the illustrated forest
    }
    setTimeout(() => {
      if (state && state.phase === "scan" && !state.sensor) {
        $(".ar-msg .small").textContent = "Swipe left and right across the screen to look around the room.";
      }
    }, 1200);
    loop();
  }

  // ---------- Main loop ----------
  function loop() {
    raf = requestAnimationFrame(loop);
    if (!state) return;
    state.heading += norm(state.rawHeading - state.heading) * 0.2;
    state.pitch += (state.rawPitch - state.pitch) * 0.2;
    if (state.phase === "scan") scanStep();
    else seekStep();
  }

  function scanStep() {
    const now = performance.now();
    if (now - state.lastAnalyse < 140) return;
    state.lastAnalyse = now;

    const slice = ((Math.floor(((state.heading % 360) + 360) % 360 / SLICE)) + 12) % 12;
    const spot = analyseFrame() || { score: 0.5 + Math.random(), cx: 1 + ((Math.random() * 2) | 0), cy: 1 + ((Math.random() * 2) | 0) };
    const prev = state.slices[slice];
    if (!prev || spot.score > prev.score) {
      state.slices[slice] = { ...spot, heading: state.heading, pitch: state.pitch };
      if (now - state.lastPing > 450) {
        state.lastPing = now;
        const ping = document.createElement("span");
        ping.className = "spot-ping";
        ping.style.left = ((spot.cx + 0.5) / GRID_X) * 100 + "%";
        ping.style.top = ((spot.cy + 0.5) / GRID_Y) * 100 + "%";
        stage.appendChild(ping);
        setTimeout(() => ping.remove(), 1300);
      }
    }

    const covered = Object.keys(state.slices).length;
    const elapsed = now - state.scanStart;
    const p = Math.min(1, Math.max(covered / SLICES_NEEDED, elapsed / SCAN_MAX_MS));
    const pct = Math.round(Math.min(p, elapsed / SCAN_MIN_MS) * 100);
    $(".scan-ring").style.setProperty("--p", pct);
    $('[data-ar="pct"]').textContent = pct + "%";
    if (pct >= 100) finishScan();
  }

  function finishScan() {
    state.phase = "hiding";
    const spots = Object.values(state.slices).sort((a, b) => b.score - a.score);
    // Prefer a good spot that's well away from where the player is looking now.
    const far = spots.filter((s) => Math.abs(norm(s.heading - state.heading)) >= 50);
    let chosen = far[0] || spots[0];
    let heading = chosen.heading + ((chosen.cx + 0.5) / GRID_X - 0.5) * FOV;
    if (!far.length) heading = state.heading + (Math.random() < 0.5 ? -1 : 1) * (100 + Math.random() * 60); // player didn't turn: hide behind them
    state.target = { heading: (heading + 360) % 360, y: (chosen.cy + 1) / GRID_Y, pitch: chosen.pitch };

    ["scan-grid", "scan-line", "scan-ring"].forEach((c) => $("." + c).remove());
    $('[data-ar="text"]').innerHTML = `<b>✨ Scan complete — ${spots.length} hiding spots found!</b><br>
      <span class="small">Close your eyes… ${state.creature.name} is hiding! <b data-ar="count">3</b></span>`;
    let n = 3;
    const tick = setInterval(() => {
      if (!state) return clearInterval(tick);
      n -= 1;
      if (n > 0) { $('[data-ar="count"]').textContent = n; return; }
      clearInterval(tick);
      state.phase = "seek";
      $(".meter").hidden = false;
      $('[data-ar="text"]').innerHTML = `<b>Step 2 · Find ${state.creature.name}!</b><br>
        <span class="small">Turn slowly and watch the meter get 🔥 hot. Look for sparkles where something peeks out!</span>`;
    }, 900);
  }

  function seekStep() {
    if (state.phase === "hiding") return;
    const t = state.target;
    const delta = norm(t.heading - state.heading);
    const el = $(".ar-creature");
    const W = window.innerWidth, H = window.innerHeight;
    const visible = Math.abs(delta) < FOV / 2 + 8;

    // Place the creature's feet on the scanned spot, following phone tilt.
    let y = t.y * H;
    if (state.sensor) y += (state.pitch - t.pitch) * (H / VFOV);
    y = Math.max(H * 0.35, Math.min(H * 0.85, y));
    el.style.top = y - el.offsetHeight + "px";
    el.style.transform = `translateX(${(delta / (FOV / 2)) * (W / 2)}px)`;
    el.style.opacity = visible ? 1 : 0;
    el.style.pointerEvents = visible ? "auto" : "none";

    $(".meter i").style.width = `${Math.round((1 - Math.abs(delta) / 180) * 100)}%`;
    $(".arrow.left").hidden = state.phase !== "seek" || visible || delta > 0;
    $(".arrow.right").hidden = state.phase !== "seek" || visible || delta < 0;

    if (state.phase === "seek") {
      el.classList.toggle("peek", visible);
      // Holding the creature in the middle of the screen also counts as finding it.
      if (Math.abs(delta) < 8) {
        state.holdSince = state.holdSince || performance.now();
        if (performance.now() - state.holdSince > 900) reveal();
      } else state.holdSince = 0;
    }
  }

  function reveal() {
    if (state.phase !== "seek") return;
    state.phase = "found";
    const el = $(".ar-creature");
    el.classList.remove("peek");
    el.classList.add("found", "happy");
    $(".meter").hidden = true;
    if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
    showMenu(`🎉 You found ${state.creature.name}! “${state.creature.catchphrase}”`);
    if (window.speakAs) speakAs(state.creature.id, `You found me! ${state.creature.catchphrase}`);
    state.onFound && state.onFound(state.creature);
  }

  function showMenu(text) {
    $(".ar-msg").innerHTML = `
      <div data-ar="text">${text}</div>
      <div class="row">
        <button class="btn" data-ar="wave">👋 Wave</button>
        <button class="btn" data-ar="spin">🌀 Spin</button>
        <button class="btn primary" data-ar="fact">💡 Fact</button>
        <button class="btn good" data-ar="close">✔ Done</button>
      </div>`;
  }

  function animate(cls) {
    const el = $(".ar-creature");
    el.classList.remove("happy", "spin");
    void el.offsetWidth; // restart the animation
    el.classList.add(cls);
  }

  function onStageClick(e) {
    const action = e.target.closest("[data-ar]")?.dataset.ar;
    const c = state.creature;
    const say = (t) => { const n = $('[data-ar="text"]'); if (n) n.textContent = t; };
    if (e.target.closest(".ar-creature")) {
      if (state.phase === "seek") return reveal();
      if (state.phase === "found") { const f = c.facts[state.factIndex++ % c.facts.length]; animate("happy"); say(`${c.name}: “${f}”`); speakAs(c.id, f); }
      return;
    }
    if (action === "close") return stop();
    if (action === "wave") { animate("happy"); say(`${c.name} waves back at you! 👋`); speakAs(c.id, "Hi! Hi! Hello!"); }
    if (action === "spin") { animate("spin"); say(`Wheee! ${c.name} does a twirl!`); speakAs(c.id, "Wheeeee!"); }
    if (action === "fact") { const f = c.facts[state.factIndex++ % c.facts.length]; animate("happy"); say(`💡 ${f}`); speakAs(c.id, f); }
  }

  function stop() {
    cancelAnimationFrame(raf);
    window.removeEventListener("deviceorientation", onOrientation);
    window.removeEventListener("pointerup", onPointerUp);
    if (stream) stream.getTracks().forEach((t) => t.stop());
    Voices.stop();
    stream = null;
    stage && stage.remove();
    const cb = state && state.onClose;
    state = null;
    cb && cb();
  }

  return { start, stop };
})();
