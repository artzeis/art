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
  const SLICES_NEEDED = 3;   // sweep ~90° to finish scanning
  const SCAN_MIN_MS = 3000, SCAN_MAX_MS = 8000;
  // Make finding easy for kids:
  const SHOW_WITHIN = FOV / 2 + 25;  // the creature starts peeking in before it's fully on screen
  const FOUND_WITHIN = 14;           // degrees from the centre that count as found…
  const FOUND_HOLD_MS = 450;         // …when held there this long (or just tap it)
  const CALL_AFTER_MS = 15000;       // the creature calls out "I'm over here!"
  const COME_CLOSER_AFTER_MS = 30000; // then slowly floats towards where the player is looking

  // Gentle beeps that speed up as you get closer (like a treasure detector).
  let audio = null, muted = false;
  function beep(freq) {
    if (muted || !audio) return;
    try {
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.12, audio.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.12);
      o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime + 0.13);
    } catch (_) {}
  }
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
    try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); } catch (_) { audio = null; }
    try {
      if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
        await DeviceOrientationEvent.requestPermission();
      }
    } catch (_) { /* fall back to swiping */ }

    state = {
      creature, onFound, onClose, phase: "scan",
      rawHeading: 0, heading: 0, rawPitch: 90, pitch: 90, sensor: false, drag: null,
      slices: {}, scanStart: performance.now(), lastAnalyse: 0, lastPing: 0,
      target: null, holdSince: 0, factIndex: 0, seekStart: 0, lastBeep: 0, called: false, hintKey: "",
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
        <button class="btn" data-ar="mute" aria-label="Sound on or off">🔊</button>
      </div>
      <div class="ar-hint" hidden aria-live="polite"></div>
      <div class="edge-glow left" hidden></div><div class="edge-glow right" hidden></div>
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
    const pct = Math.round((elapsed >= SCAN_MAX_MS ? 1 : Math.min(p, elapsed / SCAN_MIN_MS)) * 100);
    $(".scan-ring").style.setProperty("--p", pct);
    $('[data-ar="pct"]').textContent = pct + "%";
    if (pct >= 100) finishScan();
  }

  function finishScan() {
    state.phase = "hiding";
    const spots = Object.values(state.slices).sort((a, b) => b.score - a.score);
    // Hide in a good spot a little to the side — not right in front, but never far behind the player.
    const nearby = spots.filter((s) => { const d = Math.abs(norm(s.heading - state.heading)); return d >= 35 && d <= 110; });
    let chosen = nearby[0] || spots[0];
    let heading = chosen.heading + ((chosen.cx + 0.5) / GRID_X - 0.5) * FOV;
    if (!nearby.length) heading = state.heading + (Math.random() < 0.5 ? -1 : 1) * (50 + Math.random() * 40); // player didn't turn: hide just to one side
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
      state.seekStart = performance.now();
      $(".meter").hidden = false;
      $(".ar-hint").hidden = false;
      $('[data-ar="text"]').innerHTML = `<b>Step 2 · Find ${state.creature.name}!</b><br>
        <span class="small">Follow the arrows and the beeps — they get faster as you get closer. Tap ${state.creature.name} when you see them!</span>`;
    }, 900);
  }

  function seekStep() {
    if (state.phase === "hiding") return;
    const t = state.target;
    const now = performance.now();
    // Stuck for a while? The creature floats slowly towards where the player is looking.
    if (state.phase === "seek" && now - state.seekStart > COME_CLOSER_AFTER_MS) {
      const d = norm(t.heading - state.heading);
      if (Math.abs(d) > 20) t.heading = (t.heading - Math.sign(d) * 0.35 + 360) % 360;
    }
    const delta = norm(t.heading - state.heading);
    const dist = Math.abs(delta);
    const el = $(".ar-creature");
    const W = window.innerWidth, H = window.innerHeight;
    const visible = dist < SHOW_WITHIN;       // close enough to peek in from the side of the screen
    const onScreen = dist < FOV / 2 + 4;       // really in view

    // Place the creature's feet on the scanned spot, following phone tilt.
    let y = t.y * H;
    if (state.sensor) y += (state.pitch - t.pitch) * (H / VFOV);
    y = Math.max(H * 0.35, Math.min(H * 0.82, y));
    el.style.top = y - el.offsetHeight + "px";
    // When it's just off screen, keep a bit of it peeking in at the edge as a clue.
    const edge = W / 2 - 70;
    const x = Math.max(-edge, Math.min(edge, (delta / (FOV / 2)) * (W / 2)));
    el.style.transform = `translateX(${x}px)`;
    el.style.opacity = visible ? 1 : 0;
    el.style.pointerEvents = visible ? "auto" : "none";

    $(".meter i").style.width = `${Math.round((1 - dist / 180) * 100)}%`;
    const seeking = state.phase === "seek";
    const goLeft = delta < 0;
    $(".arrow.left").hidden = !seeking || onScreen || !goLeft;
    $(".arrow.right").hidden = !seeking || onScreen || goLeft;
    $(".edge-glow.left").hidden = !seeking || onScreen || !goLeft;
    $(".edge-glow.right").hidden = !seeking || onScreen || goLeft;

    if (!seeking) return;
    el.classList.toggle("peek", visible);

    // Plain-words hint: which way, and how warm.
    const warmth = dist < 25 ? "🔥 So close! Look for the sparkles!" : dist < 60 ? "♨️ Getting warmer!" : dist < 110 ? "🌤️ Warm…" : "❄️ Cold…";
    const text = onScreen ? (dist < 25 ? `👀 There! Tap ${state.creature.name}!` : warmth) : (goLeft ? `⬅️ Turn left — ${warmth}` : `${warmth} — turn right ➡️`);
    if (text !== state.hintKey) { state.hintKey = text; $(".ar-hint").textContent = text; }

    // Treasure-detector beeps: faster and higher when closer; a little buzz when very close.
    const gap = 160 + (dist / 180) * 1300;
    if (now - state.lastBeep > gap) {
      state.lastBeep = now;
      beep(dist < 25 ? 880 : dist < 60 ? 700 : 520);
      if (dist < 25 && navigator.vibrate) navigator.vibrate(18);
    }

    // After a while the creature calls out to help.
    if (!state.called && now - state.seekStart > CALL_AFTER_MS) {
      state.called = true;
      if (window.speakAs) speakAs(state.creature.id, `I'm over here! Turn ${goLeft ? "left" : "right"}!`);
    }

    // Holding the creature near the middle of the screen also counts as finding it.
    if (dist < FOUND_WITHIN) {
      state.holdSince = state.holdSince || now;
      if (now - state.holdSince > FOUND_HOLD_MS) reveal();
    } else state.holdSince = 0;
  }

  function reveal() {
    if (state.phase !== "seek") return;
    state.phase = "found";
    const el = $(".ar-creature");
    el.classList.remove("peek");
    el.classList.add("found", "happy");
    $(".meter").hidden = true;
    $(".ar-hint").hidden = true;
    ["left", "right"].forEach((k) => { $(".edge-glow." + k).hidden = true; $(".arrow." + k).hidden = true; });
    if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
    [660, 880, 1100].forEach((f, i) => setTimeout(() => beep(f), i * 110));
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
    if (action === "mute") { muted = !muted; e.target.closest("[data-ar]").textContent = muted ? "🔇" : "🔊"; return; }
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
