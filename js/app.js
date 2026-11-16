// Myth Seekers — main app: screens, quest flow, journal, grown-up setup.
(() => {
  const STORE_KEY = "mythSeekers.v1";
  const app = document.getElementById("app");
  const byId = Object.fromEntries(CREATURES.map((c) => [c.id, c]));
  const spotById = Object.fromEntries(SPOTS.map((s) => [s.id, s]));

  // ---------- Saved progress (per device) ----------
  const fresh = () => ({ spots: {}, found: {}, arFound: {}, stars: 0 });
  let save = fresh();
  try { save = { ...fresh(), ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") }; } catch (_) {}
  const persist = () => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(save)); } catch (_) {}
    document.getElementById("starCount").textContent = save.stars;
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);

  function confetti(emojis = ["⭐", "✨", "🌸", "🍄", "🪶", "🍀"]) {
    for (let i = 0; i < 28; i++) {
      const s = document.createElement("span");
      s.className = "confetti";
      s.textContent = pick(emojis);
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 3600);
    }
  }

  function speak(text) {
    try {
      if (!window.speechSynthesis) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95; u.pitch = 1.2;
      speechSynthesis.speak(u);
    } catch (_) {}
  }

  // ---------- Router ----------
  let timerId = null;
  function go(screen, arg) {
    clearInterval(timerId);
    try { speechSynthesis.cancel(); } catch (_) {}
    document.querySelectorAll(".tabbar button").forEach((b) =>
      b.classList.toggle("active", b.dataset.go === screen || (screen === "creature" && b.dataset.go === "journal")));
    (screens[screen] || screens.home)(arg);
    window.scrollTo(0, 0);
  }

  const tile = (c, status) => `
    <button class="creature-tile bob" style="--c:${c.color}" data-open="${c.id}">
      ${status}
      ${CREATURE_SVG[c.id]}
      <span class="name">${c.name}</span>
      <span class="kind">${c.kind}</span>
    </button>`;

  const screens = {
    home() {
      const ready = CREATURES.filter((c) => save.spots[c.id]).length;
      const foundCount = Object.keys(save.found).length;
      app.innerHTML = `
        <h1 class="screen-title">Who needs your help?</h1>
        <p class="lead">Magical creatures have lost their treasures! Pick one to start a quest.
          ${foundCount ? `You've helped <b>${foundCount}</b> of ${CREATURES.length} friends.` : ""}</p>
        ${ready < CREATURES.length ? `
          <div class="card">
            <b>🔑 Grown-up setup needed</b>
            <p class="muted small">Hide the creature accessories, then tell the app where you put them.
              ${ready ? `${ready} of ${CREATURES.length} are ready.` : ""}</p>
            <button class="btn primary block" data-go="grownup">Set up the hunt</button>
          </div>` : ""}
        <div class="grid">
          ${CREATURES.map((c) => tile(c,
            save.found[c.id] ? `<span class="badge">Friend ✔</span>`
              : save.spots[c.id] ? `<span class="badge lost">Lost ${c.accessoryEmoji}</span>`
              : `<span class="badge nospot">Not hidden</span>`)).join("")}
        </div>
        ${foundCount === CREATURES.length ? `
          <div class="card" style="margin-top:14px;text-align:center">
            <h2>🏆 Master Myth Seeker!</h2>
            <p>You helped every creature. Try finding them all in AR mode, or ask a grown-up to hide everything again!</p>
          </div>` : ""}`;
      app.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => {
        const id = b.dataset.open;
        if (save.spots[id] && !save.found[id]) go("quest", id); else go("creature", id);
      });
    },

    journal() {
      app.innerHTML = `
        <h1 class="screen-title">📖 Creature Journal</h1>
        <p class="lead">Learn about every creature. Help them on a quest to unlock their secret fun facts!</p>
        <div class="grid">${CREATURES.map((c) => tile(c, save.found[c.id] ? `<span class="badge">Friend ✔</span>` : "")).join("")}</div>`;
      app.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => go("creature", b.dataset.open));
    },

    creature(id) {
      const c = byId[id];
      const friend = !!save.found[id];
      app.innerHTML = `
        <div class="card" style="border-top:8px solid ${c.color}">
          <div class="hero bob">${CREATURE_SVG[c.id]}
            <div><h2>${c.name}</h2><div class="muted"><b>${c.kind}</b></div><p>${c.tagline}</p></div>
          </div>
          <p class="big">${c.description}</p>
          <dl class="facts">
            <dt>🏡 Where they live</dt><dd>${c.home}</dd>
            <dt>💖 Favourite things</dt><dd>${c.likes}</dd>
            <dt>✨ Magic power</dt><dd>${c.power}</dd>
            <dt>${c.accessoryEmoji} Treasure</dt><dd>${c.accessory}</dd>
          </dl>
        </div>
        <div class="card">
          <h3>🔒 Secret fun facts</h3>
          ${friend ? `<ul class="funfacts">${c.facts.map((f) => `<li>${f}</li>`).join("")}</ul>`
            : `<p class="muted">Help ${c.name} find the ${c.accessory} to unlock these!</p>`}
        </div>
        <div class="row">
          <button class="btn" data-say>🔊 Read aloud</button>
          ${!friend && save.spots[id] ? `<button class="btn primary" data-quest>Start quest</button>` : ""}
          <button class="btn" data-ar>🔮 Find in AR</button>
        </div>`;
      app.querySelector("[data-say]").onclick = () => speak(`${c.name} the ${c.kind}. ${c.description}`);
      app.querySelector("[data-ar]").onclick = () => startAR(id);
      const q = app.querySelector("[data-quest]");
      if (q) q.onclick = () => go("quest", id);
    },

    quest(id) { runQuest(byId[id]); },

    ar() {
      app.innerHTML = `
        <h1 class="screen-title">🔮 AR Hide &amp; Seek</h1>
        <p class="lead">Creatures are hiding all around you! Look through the camera, turn slowly in a circle,
          and follow the meter until it's 🔥 hot. Tap the creature when you find it to play and learn.</p>
        <div class="card small">📷 Uses your camera and motion sensors. No camera? You'll explore a magic forest instead —
          just swipe to look around. <b>Grown-ups: please supervise and keep the play area clear.</b></div>
        <div class="grid">${CREATURES.map((c) => tile(c, save.arFound[c.id] ? `<span class="badge">Spotted 👀</span>` : "")).join("")}</div>`;
      app.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => startAR(b.dataset.open));
    },

    grownup() {
      const a = 3 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 7);
      app.innerHTML = `
        <h1 class="screen-title">🔑 Grown-up Corner</h1>
        <div class="card">
          <p>To make sure you're a grown-up, what is <b>${a} × ${b}</b>?</p>
          <input type="number" inputmode="numeric" id="gate" aria-label="Answer" />
          <p></p><button class="btn primary block" id="gateGo">Enter</button>
        </div>`;
      const check = () => {
        if (Number(app.querySelector("#gate").value) === a * b) setupScreen();
        else app.querySelector("#gate").animate([{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "none" }], 300);
      };
      app.querySelector("#gateGo").onclick = check;
      app.querySelector("#gate").onkeydown = (e) => e.key === "Enter" && check();
    },
  };

  function setupScreen() {
    const options = (sel) => ["inside", "outside"].map((place) => `
      <optgroup label="${place === "inside" ? "Inside" : "Outside"}">
        ${SPOTS.filter((s) => s.place === place).map((s) => `<option value="${s.id}" ${sel === s.id ? "selected" : ""}>${s.label}</option>`).join("")}
      </optgroup>`).join("");
    app.innerHTML = `
      <h1 class="screen-title">🔑 Set Up the Hunt</h1>
      <div class="card">
        <ol class="small">
          <li>Take out the five creature accessories.</li>
          <li>Hide each one in a different spot in your play area.</li>
          <li>Choose that spot below so the riddles lead kids to it.</li>
        </ol>
        <p class="small muted">Not hidden yet? Tap "Suggest spots" and hide them where the app says.</p>
        <div class="row">
          <button class="btn" data-rand="inside">🏠 Suggest spots (inside)</button>
          <button class="btn" data-rand="all">🌳 Suggest (inside + outside)</button>
        </div>
      </div>
      <div class="card">
        ${CREATURES.map((c) => `
          <label class="field">${c.accessoryEmoji} ${c.accessory} <span class="muted small">(${c.name} the ${c.kind})</span>
            <select data-spot="${c.id}"><option value="">— Not hidden —</option>${options(save.spots[c.id])}</select>
          </label>`).join("")}
        <button class="btn primary block" id="saveSetup">Save &amp; start playing</button>
      </div>
      <div class="card">
        <b>Play again</b>
        <p class="small muted">Clears found creatures so kids can hunt again. Stars are kept.</p>
        <div class="row">
          <button class="btn" id="replay">🔄 New hunt</button>
          <button class="btn" id="wipe">🗑️ Reset everything</button>
        </div>
      </div>`;

    app.querySelectorAll("[data-rand]").forEach((b) => b.onclick = () => {
      const pool = shuffle(SPOTS.filter((s) => b.dataset.rand === "all" || s.place === "inside"));
      app.querySelectorAll("[data-spot]").forEach((sel, i) => sel.value = pool[i].id);
    });
    app.querySelector("#saveSetup").onclick = () => {
      app.querySelectorAll("[data-spot]").forEach((sel) => {
        if (sel.value) save.spots[sel.dataset.spot] = sel.value; else delete save.spots[sel.dataset.spot];
      });
      persist(); go("home");
    };
    app.querySelector("#replay").onclick = () => { save.found = {}; persist(); setupScreen(); };
    app.querySelector("#wipe").onclick = () => {
      if (confirm("Reset all progress, stars and hiding spots?")) { save = fresh(); persist(); setupScreen(); }
    };
  }

  // ---------- Quest flow ----------
  // Steps: 0 intro → 1 activity challenge → 2 riddle → 3 "what did you find?" → 4 celebrate
  function runQuest(c) {
    const spot = spotById[save.spots[c.id]];
    if (!spot) return go("creature", c.id);
    const challenge = pick(c.challenges);
    let step = 0, helpLevel = 0;

    const frame = (body) => {
      app.innerHTML = `
        <div class="progress">${[0, 1, 2, 3].map((i) => `<i class="${i <= step ? "on" : ""}"></i>`).join("")}</div>
        <div class="card" style="border-top:8px solid ${c.color}">
          <div class="hero bob" style="grid-template-columns:110px 1fr">${CREATURE_SVG[c.id]}
            <div><h2>${c.name}</h2><span class="muted">${c.kind}</span></div></div>
          ${body}
        </div>`;
      const say = app.querySelector("[data-say]");
      if (say) say.onclick = () => speak(say.dataset.say);
    };

    const render = () => {
      clearInterval(timerId);
      if (step === 0) {
        frame(`
          <div class="speech">${c.intro}</div>
          <div class="row">
            <button class="btn" data-say="${esc(c.intro)}">🔊 Listen</button>
            <button class="btn primary" data-next>I'll help!</button>
          </div>`);
      } else if (step === 1) {
        frame(`
          <div class="step-label">Step 1 · Seeker Challenge</div>
          <p class="big">${challenge.text}</p>
          ${challenge.seconds ? `<div class="timer" id="timer">${challenge.seconds}</div>` : ""}
          <div class="row">
            <button class="btn" data-say="${esc(challenge.text)}">🔊 Listen</button>
            ${challenge.seconds ? `<button class="btn" id="startTimer">⏱️ Start timer</button>` : ""}
            <button class="btn good" data-next>We did it!</button>
          </div>`);
        const t = app.querySelector("#startTimer");
        if (t) t.onclick = () => {
          let left = challenge.seconds;
          t.disabled = true;
          clearInterval(timerId);
          timerId = setInterval(() => {
            left -= 1;
            app.querySelector("#timer").textContent = left > 0 ? left : "🎉";
            if (left <= 0) { clearInterval(timerId); confetti(["✨"]); }
          }, 1000);
        };
      } else if (step === 2) {
        const helps = [
          helpLevel >= 1 ? `<div class="hintbox">🔎 <b>Clue:</b> ${spot.clue}</div>` : "",
          helpLevel >= 2 ? `<div class="hintbox">💡 <b>Big hint:</b> ${spot.hint}</div>` : "",
        ].join("");
        frame(`
          <div class="step-label">Step 2 · The Riddle</div>
          <div class="speech">I think my ${c.accessory} is hiding here… solve my riddle!</div>
          <p class="big"><b>${spot.riddle}</b></p>
          ${helps}
          <p></p>
          <div class="row">
            <button class="btn" data-say="${esc(spot.riddle)}">🔊 Listen</button>
            ${helpLevel < 2 ? `<button class="btn" id="moreHelp">${helpLevel ? "💡 Big hint" : "🔎 Clue"}</button>` : ""}
            <button class="btn good" data-next>We found it!</button>
          </div>`);
        const h = app.querySelector("#moreHelp");
        if (h) h.onclick = () => { helpLevel++; render(); };
      } else if (step === 3) {
        const choices = shuffle(CREATURES.map((x) => x)).filter((x) => x.id !== c.id).slice(0, 3).concat(c);
        frame(`
          <div class="step-label">Step 3 · Show me!</div>
          <div class="speech">Hold up what you found! Which treasure is it?</div>
          <div class="choices">${shuffle(choices).map((x) =>
            `<button class="choice" data-pick="${x.id}">${x.accessoryEmoji}<br>${x.accessory}</button>`).join("")}</div>`);
        app.querySelectorAll("[data-pick]").forEach((b) => b.onclick = () => {
          if (b.dataset.pick === c.id) { step = 4; render(); }
          else { b.classList.add("wrong"); setTimeout(() => b.classList.remove("wrong"), 400); }
        });
      } else {
        const first = !save.found[c.id];
        const gained = first ? 3 - Math.min(helpLevel, 2) : 0; // fewer hints = more stars
        if (first) { save.found[c.id] = Date.now(); save.stars += gained; persist(); }
        confetti();
        const thanks = `Thank you, thank you! You found my ${c.accessory}! We are friends forever now.`;
        frame(`
          <div class="speech">${thanks}</div>
          ${first ? `<p class="big" style="text-align:center">You earned ${"⭐".repeat(gained)}</p>` : ""}
          <p class="small muted">Here's a secret: ${c.facts[0]}</p>
          <div class="row">
            <button class="btn" data-say="${esc(thanks)}">🔊 Listen</button>
            <button class="btn" id="seeAR">🔮 Visit in AR</button>
            <button class="btn primary" id="home">More quests</button>
          </div>`);
        app.querySelector("#seeAR").onclick = () => startAR(c.id);
        app.querySelector("#home").onclick = () => go("home");
        speak(thanks);
      }
      const next = app.querySelector("[data-next]");
      if (next) next.onclick = () => { step++; render(); };
    };
    render();
  }

  function startAR(id) {
    const before = document.querySelector(".tabbar .active")?.dataset.go || "ar";
    AR.start(byId[id], {
      onFound: (c) => {
        if (!save.arFound[c.id]) { save.arFound[c.id] = Date.now(); save.stars += 1; persist(); }
      },
      onClose: () => go(before === "journal" ? "creature" : before, id),
    });
  }

  // ---------- Wiring ----------
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-go]");
    if (g) go(g.dataset.go);
  });
  const dlg = document.getElementById("helpDialog");
  document.getElementById("helpBtn").onclick = () => dlg.showModal();
  document.getElementById("helpClose").onclick = () => dlg.close();

  persist();
  go("home");
  try { if (!localStorage.getItem(STORE_KEY + ".seenHelp")) { dlg.showModal(); localStorage.setItem(STORE_KEY + ".seenHelp", "1"); } } catch (_) {}
})();
