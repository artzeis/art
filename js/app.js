// Myth Seekers — main app: screens, quest flow, journal, grown-up setup.
(() => {
  const STORE_KEY = "mythSeekers.v2";
  const app = document.getElementById("app");
  const byId = Object.fromEntries(CREATURES.map((c) => [c.id, c]));

  // ---------- Saved progress (per device) ----------
  const fresh = () => ({ hides: {}, found: {}, arFound: {}, stars: 0, area: "inside" });
  let save = fresh();
  try { save = { ...fresh(), ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") }; } catch (_) {}
  save.hides = save.hides || {};
  const hidden = (id) => !!(save.hides[id] && save.hides[id].text);
  const persist = () => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(save)); } catch (_) {}
    document.getElementById("starCount").textContent = save.stars;
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
  const vars = (c) => `--c:${c.color};--soft:${c.soft}`;

  function confetti(emojis = ["⭐", "✨", "🖍️", "💎", "🌕", "🗝️", "🟩", "🌙"]) {
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

  // Each character speaks in its own voice (js/voices.js).
  const speak = (text, id) => speakAs(id, text);

  // ---------- Router ----------
  let timerId = null;
  function go(screen, arg) {
    clearInterval(timerId);
    Voices.stop();
    document.querySelectorAll(".tabbar button").forEach((b) =>
      b.classList.toggle("active", b.dataset.go === screen || (screen === "creature" && b.dataset.go === "journal")));
    (screens[screen] || screens.home)(arg);
    window.scrollTo(0, 0);
  }

  const tile = (c, pill) => `
    <button class="creature-tile bob" style="${vars(c)}" data-open="${c.id}" aria-label="${c.name} the ${c.kind}">
      ${pill || ""}
      <span class="art">${creatureArt(c.id)}</span>
      <span class="label"><span class="name">${c.name}</span><span class="kind">${c.kind}</span></span>
    </button>`;

  const STATS = [
    ["speed", "⚡", "Speed"], ["magic", "✨", "Magic"], ["kindness", "💖", "Kindness"],
    ["sneaky", "🙈", "Sneaky"], ["strength", "💪", "Strength"],
  ];

  const screens = {
    home() {
      const ready = CREATURES.filter((c) => hidden(c.id)).length;
      const foundCount = Object.keys(save.found).length;
      const allDone = foundCount === CREATURES.length;
      app.innerHTML = `
        <section class="welcome">
          <div class="ring" style="--p:${Math.round(foundCount / CREATURES.length * 100)}">
            <div><span><b>${foundCount}/${CREATURES.length}</b><br><small>friends</small></span></div>
          </div>
          <div>
            <h1>${allDone ? `<span class="grad-text">Master Myth Seeker!</span>` : `Who needs <span class="grad-text">your help</span> tonight?`}</h1>
            <p>${allDone ? "You helped every creature! Try the AR Hunt or start a new hunt."
              : "Magical friends lost their treasures. Pick one to begin a quest."}</p>
          </div>
        </section>
        ${ready < CREATURES.length ? `
          <div class="setup-banner">
            <span style="font-size:1.8rem">🔑</span>
            <p><b>Grown-up setup</b><br><span class="small muted">${ready} of ${CREATURES.length} treasures hidden · ${AREAS.find((a) => a[0] === (save.area || "inside")).slice(1, 3).join(" ")}</span></p>
            <button class="btn primary" data-go="grownup" style="margin-left:auto">Set up</button>
          </div>` : ""}
        <div class="grid">
          ${CREATURES.map((c) => tile(c,
            save.found[c.id] ? `<span class="pill friend">Friend ✔</span>`
              : hidden(c.id) ? `<span class="pill">Help me ${c.accessoryEmoji}</span>`
              : `<span class="pill idle">Not hidden</span>`)).join("")}
        </div>`;
      app.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => {
        const id = b.dataset.open;
        if (hidden(id) && !save.found[id]) go("quest", id); else go("creature", id);
      });
    },

    journal() {
      app.innerHTML = `
        <h1 class="screen-title">Creature <span class="grad-text">Journal</span></h1>
        <p class="lead">Tap a creature to read all about them. Help them on a quest to unlock their secrets!</p>
        <div class="grid">${CREATURES.map((c) => tile(c, save.found[c.id] ? `<span class="pill friend">Friend ✔</span>` : `<span class="pill seen">Read more</span>`)).join("")}</div>`;
      app.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => go("creature", b.dataset.open));
    },

    creature(id, tab = "story") {
      const c = byId[id];
      const friend = !!save.found[id];
      const unlocked = friend ? c.facts.length : 1; // one free teaser fact
      const panels = {
        story: `
          <div class="quick">
            <div><b>📏 Size</b>${c.size}</div>
            <div><b>🎂 Age</b>${c.age}</div>
            <div class="wide"><b>🏡 Home</b>${c.home}</div>
          </div>
          <div class="card"><h2 class="section-title"><span class="bubble-ico">📖</span>My story</h2><p class="story">${c.description}</p></div>
          <div class="card">
            <h2 class="section-title"><span class="bubble-ico">🌟</span>All about me</h2>
            <div class="info-grid">
              <div class="info"><span class="ico">😊</span><b>Personality</b><div class="chips">${c.personality.map((p) => `<span>${p}</span>`).join("")}</div></div>
              <div class="info"><span class="ico">🍽️</span><b>Favourite food</b><span>${c.food}</span></div>
              <div class="info"><span class="ico">🤝</span><b>Best friend</b><span>${c.bestFriend}</span></div>
              <div class="info"><span class="ico">🎵</span><b>What I sound like</b><span>${c.sound}</span></div>
              <div class="info"><span class="ico">📅</span><b>Favourite season</b><span>${c.season}</span></div>
              <div class="info"><span class="ico">${c.accessoryEmoji}</span><b>My treasure</b><span>${c.accessory}</span></div>
              <div class="info"><span class="ico">👍</span><b>I love</b><span>${c.likes}</span></div>
              <div class="info"><span class="ico">👎</span><b>I don't like</b><span>${c.dislikes}</span></div>
            </div>
          </div>`,
        powers: `
          <div class="power-box"><small>✨ Magic power</small>${c.power}</div>
          <div class="card">
            <h2 class="section-title"><span class="bubble-ico">📊</span>My powers</h2>
            ${STATS.map(([k, ico, label]) => `
              <div class="stat"><span class="ico">${ico}</span><b>${label}</b>
                <div class="bar" role="img" aria-label="${label} ${c.stats[k]} out of 5"><i style="width:${c.stats[k] * 20}%"></i></div>
                <span class="num">${c.stats[k]}</span></div>`).join("")}
          </div>
          <div class="card">
            <h2 class="section-title"><span class="bubble-ico">👀</span>How to tell I'm nearby</h2>
            <ul class="list">${c.signs.map((s) => `<li><span>🔍</span>${s}</li>`).join("")}</ul>
          </div>
          <div class="card">
            <h2 class="section-title"><span class="bubble-ico">💛</span>How to be my friend</h2>
            <ul class="list">${c.friendTips.map((s) => `<li><span>✅</span>${s}</li>`).join("")}</ul>
          </div>`,
        secrets: `
          <p class="lead center">${friend ? `You're friends with ${c.name}! Here are all the secrets. 🎉`
            : `Help ${c.name} find the ${c.accessory} to unlock ${c.facts.length - 1} more secrets!`}</p>
          <div class="fact-grid">
            ${c.facts.map((f, i) => i < unlocked
              ? `<div class="fact"><span class="n">${i + 1}</span><div>${f}</div></div>`
              : `<div class="fact locked"><div><div class="lock">🔒</div>Secret #${i + 1}</div></div>`).join("")}
          </div>`,
      };
      app.innerHTML = `
        <div style="${vars(c)}">
          <section class="hero">
            <button class="icon-btn say-btn" data-say aria-label="Read aloud">🔊</button>
            <div class="art bob">${creatureArt(c.id)}</div>
            <h1>${c.name}</h1>
            <span class="kind-chip">${c.kind}${friend ? " · Friend ✔" : ""}</span><br>
            <span class="bubble">“${c.catchphrase}”</span>
          </section>
          <div class="row actions">
            ${!friend && hidden(id) ? `<button class="btn primary" data-quest>🗺️ Start quest</button>` : ""}
            <button class="btn purple" data-ar>🔮 Find in AR</button>
          </div>
          <div class="tabs" role="tablist">
            ${[["story", "📖 Story"], ["powers", "⭐ Powers"], ["secrets", friend ? "🔓 Secrets" : "🔒 Secrets"]].map(([k, l]) =>
              `<button role="tab" aria-selected="${k === tab}" class="${k === tab ? "active" : ""}" data-tab="${k}">${l}</button>`).join("")}
          </div>
          ${panels[tab]}
          ${c.moonForm ? moonCard(c, friend) : ""}
          ${plushCard(c)}
        </div>`;
      app.querySelector("[data-say]").onclick = () => speak(`${c.catchphrase} ${c.description}`, c.id);
      app.querySelector("[data-ar]").onclick = () => startAR(id);
      app.querySelectorAll("[data-tab]").forEach((b) => b.onclick = () => screens.creature(id, b.dataset.tab));
      const q = app.querySelector("[data-quest]");
      if (q) q.onclick = () => go("quest", id);
    },

    quest(id) { runQuest(byId[id]); },

    ar() {
      app.innerHTML = `
        <h1 class="screen-title">AR <span class="grad-text">Hide &amp; Seek</span></h1>
        <p class="lead">Creatures hide in your real room. Pick who you want to find.</p>
        <div class="setup-banner"><span style="font-size:1.8rem">📷</span>
          <p class="small"><b>Step 1:</b> scan the room so the creature can pick a hiding spot. <b>Step 2:</b> turn slowly and find it!
          No camera? Explore a magic forest by swiping. <b>Grown-ups: please supervise.</b></p></div>
        <div class="grid">${CREATURES.map((c) => tile(c, save.arFound[c.id] ? `<span class="pill seen">Spotted 👀</span>` : `<span class="pill">Find me!</span>`)).join("")}</div>`;
      app.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => startAR(b.dataset.open));
    },

    grownup() {
      app.innerHTML = `<h1 class="screen-title">🔑 Grown-up Corner</h1><div class="card center" id="gateBox"></div>`;
      renderGate(app.querySelector("#gateBox"), setupScreen);
    },
  };

  // Grown-up gate: a times-table question answered on a big on-screen keypad,
  // so it works the same on every phone without the device keyboard.
  function renderGate(box, onPass, why = "To make sure you're a grown-up") {
    const a = 3 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 7);
    const answer = String(a * b);
    let typed = "";
    box.innerHTML = `
      <p class="big">${why}, what is<br><b>${a} × ${b}</b> ?</p>
      <div class="gate-display" aria-live="polite">&nbsp;</div>
      <p class="small gate-msg">&nbsp;</p>
      <div class="keypad">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-key="${n}">${n}</button>`).join("")}
        <button data-key="del" aria-label="Delete">⌫</button>
        <button data-key="0">0</button>
        <button data-key="ok" class="ok" aria-label="Enter">✔</button>
      </div>`;
    const show = box.querySelector(".gate-display"), msg = box.querySelector(".gate-msg");
    const refresh = () => { show.innerHTML = typed || "&nbsp;"; };
    const check = () => {
      if (typed === answer) return onPass();
      msg.textContent = typed ? "Not quite — try again!" : "Tap the numbers first.";
      show.animate([{ transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "none" }], 300);
      typed = ""; refresh();
    };
    box.querySelectorAll("[data-key]").forEach((btn) => btn.onclick = () => {
      const k = btn.dataset.key;
      msg.innerHTML = "&nbsp;";
      if (k === "ok") return check();
      if (k === "del") typed = typed.slice(0, -1);
      else if (typed.length < 3) typed += k;
      refresh();
    });
  }

  // A character's special "Moon Form" picture, unlocked by finishing their quest.
  const moonCard = (c, unlocked) => `
    <div class="card moon-card ${unlocked ? "" : "locked"}">
      <span class="step-label">🌙 ${unlocked ? "Unlocked!" : "Secret form"}</span>
      <h2>${c.name}'s Moon Form</h2>
      <div class="moon-art"><img src="${c.moonForm}" alt="${unlocked ? `${c.name} in Moon Form` : "A hidden shape"}" loading="lazy"></div>
      <p class="muted small">${unlocked
        ? `When the full moon rises, ${c.name} becomes a majestic Moonwolf with a glowing crescent and a cape full of stars. Look for ${c.name}'s Moon Form in the AR Hunt!`
        : `Finish ${c.name}'s quest to reveal this secret form.`}</p>
    </div>`;

  // ---------- Plush shop ----------
  // Store links live in STORE_LINKS (js/data.js). Opening one needs the grown-up gate.
  const plushCard = (c) => `
    <div class="card shop">
      <img src="assets/plush/${c.id}.jpg" alt="${c.name} pillow plush" loading="lazy">
      <div>
        <span class="step-label">Pillow plush</span>
        <h2>Take ${c.name} home!</h2>
        <p class="muted small">A super-soft pillow plush of ${c.name}, just like the one in the game.</p>
        ${STORE_LINKS[c.id]
          ? `<button class="btn primary" data-shop="${c.id}">🛍️ Get the plush</button>`
          : `<button class="btn" disabled>🛍️ Coming soon</button>`}
      </div>
    </div>`;
  function openShop(id) {
    const url = STORE_LINKS[id];
    if (!url) return;
    const dlg = document.createElement("dialog");
    dlg.className = "sheet center";
    dlg.innerHTML = `<h2>Ask a grown-up</h2><div class="gate-box"></div>
      <button class="btn block" data-close style="margin-top:14px">Not now</button>`;
    document.body.appendChild(dlg);
    const close = () => { dlg.close(); dlg.remove(); };
    dlg.querySelector("[data-close]").onclick = close;
    renderGate(dlg.querySelector(".gate-box"), () => { close(); window.open(url, "_blank", "noopener"); }, "Grown-ups only! To open the store");
    dlg.showModal();
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-shop]");
    if (b) openShop(b.dataset.shop);
  });

  const AREAS = [
    ["inside", "🏠", "Inside", "Rooms in the house"],
    ["outside", "🌳", "Outside", "Yard, garden or park"],
    ["both", "🏡", "Both", "Inside and outside"],
  ];
  const ideasFor = (area) => area === "both" ? [...HIDING_IDEAS.inside, ...HIDING_IDEAS.outside] : HIDING_IDEAS[area];

  function setupScreen() {
    const area = save.area || "inside";
    app.innerHTML = `
      <h1 class="screen-title">🔑 Set Up the Hunt</h1>
      <div class="card">
        <h2 class="section-title">Where are you playing?</h2>
        <div class="area-pick" role="radiogroup">
          ${AREAS.map(([id, ico, label, sub]) => `
            <button role="radio" aria-checked="${id === area}" class="${id === area ? "active" : ""}" data-area="${id}">
              <span class="ico">${ico}</span><b>${label}</b><small>${sub}</small></button>`).join("")}
        </div>
        ${area !== "inside" ? `<p class="safety small" style="margin:12px 0 0">🌳 Outside: stay in a safe, fenced area away from roads and water, and keep a grown-up nearby.</p>` : ""}
      </div>
      <div class="card">
        <ol class="setup-steps small">
          <li>Hide each character's lost item somewhere ${area === "outside" ? "outside" : area === "both" ? "inside or outside" : "in the house"}.</li>
          <li>Type where you hid it, like <em>"under the blue cushion on the sofa"</em>.</li>
          <li>The app writes a riddle, a clue and a big hint from your words. Tap 🔄 for a different riddle.</li>
        </ol>
        <button class="btn block" id="suggest">✨ Suggest hiding places</button>
      </div>
      ${CREATURES.map((c) => `
        <div class="card hide-card" style="${vars(c)}">
          <div class="hide-head">
            <span class="hide-art">${creatureArt(c.id)}</span>
            <div><b>${c.name}'s ${c.accessory}</b> ${c.accessoryEmoji}<br><span class="muted small">Where did you hide it?</span></div>
          </div>
          <input type="text" class="hide-input" data-hide="${c.id}" value="${esc((save.hides[c.id] || {}).text || "")}"
            placeholder="e.g. ${esc(pick(ideasFor(area)))}" autocomplete="off" autocapitalize="off" enterkeyhint="done" maxlength="140">
          <div class="riddle-preview" data-preview="${c.id}"></div>
        </div>`).join("")}
      <button class="btn primary block" id="saveSetup" style="margin-bottom:16px">Save &amp; start playing</button>
      <div class="card">
        <h2 class="section-title">🔊 Voice check</h2>
        <p class="small muted" style="margin-top:0">Tap ▶ to hear each character.</p>
        <div class="voice-list">
          ${CREATURES.map((c) => { const v = Voices.voiceFor(c.id); return `
            <div class="voice-row" style="${vars(c)}">
              <span class="hide-art">${creatureArt(c.id)}</span>
              <div><b>${c.name}</b><br><span class="small muted">${v ? esc(v.name) : "Default voice"}</span></div>
              <button class="btn small-btn" data-voicetest="${c.id}" aria-label="Hear ${c.name}">▶</button>
            </div>`; }).join("")}
        </div>
        ${Voices.hasQualityVoices()
          ? `<p class="small" style="margin-bottom:0">✅ High-quality voices found on this device.</p>`
          : `<details class="small voice-tip"><summary><b>Make the voices sound more natural (free)</b></summary>
              <p>Download a high-quality voice on this device, then reopen the game:</p>
              <ul>
                <li><b>iPhone / iPad:</b> Settings → Accessibility → Spoken Content → Voices → English → download voices marked <em>Enhanced</em> or <em>Premium</em> (for example Ava, Zoe, Evan, Nathan).</li>
                <li><b>Mac:</b> System Settings → Accessibility → Spoken Content → System Voice → Manage Voices.</li>
                <li><b>Android:</b> Settings → search "Text-to-speech" → Google → Install voice data → English → pick a high-quality voice.</li>
                <li><b>Windows:</b> open the game in Microsoft Edge to use its built-in Natural voices.</li>
              </ul></details>`}
      </div>
      <div class="card">
        <b>Play again</b>
        <p class="small muted">Clears found characters so kids can hunt again. Stars are kept.</p>
        <div class="row">
          <button class="btn" id="replay">🔄 New hunt</button>
          <button class="btn" id="wipe">🗑️ Reset everything</button>
        </div>
      </div>`;

    const setHide = (id, text) => {
      const prev = save.hides[id] || {};
      text = text.trim();
      if (text) save.hides[id] = { text, seed: prev.text === text ? prev.seed || 0 : prev.seed || 0 };
      else delete save.hides[id];
      persist();
    };
    const preview = (id) => {
      const box = app.querySelector(`[data-preview="${id}"]`);
      const h = save.hides[id];
      if (!h) { box.innerHTML = ""; return; }
      const r = makeRiddle(h.text, byId[id], h.seed || 0);
      box.innerHTML = `
        ${r.unsafe ? `<p class="hintbox hot small">⚠️ That spot might not be safe for kids. Please choose somewhere else.</p>` : ""}
        <p><b>🧩 Riddle:</b> ${esc(r.riddle)}</p>
        <p><b>🔎 Clue:</b> ${esc(r.clue)}</p>
        <p><b>💡 Big hint:</b> ${esc(r.hint)}</p>
        ${r.variants > 1 ? `<button class="btn small-btn" data-reroll="${id}">🔄 Different riddle</button>` : ""}`;
      if (r.variants > 1) box.querySelector("[data-reroll]").onclick = () => { h.seed = (h.seed || 0) + 1; persist(); preview(id); };
    };
    app.querySelectorAll("[data-hide]").forEach((inp) => {
      preview(inp.dataset.hide);
      let t;
      inp.oninput = () => { clearTimeout(t); t = setTimeout(() => { setHide(inp.dataset.hide, inp.value); preview(inp.dataset.hide); }, 250); };
      inp.onkeydown = (e) => { if (e.key === "Enter") inp.blur(); };
    });
    app.querySelectorAll("[data-area]").forEach((b) => b.onclick = () => { save.area = b.dataset.area; persist(); setupScreen(); });
    app.querySelector("#suggest").onclick = () => {
      const pool = shuffle(ideasFor(area));
      app.querySelectorAll("[data-hide]").forEach((inp, i) => {
        inp.value = pool[i % pool.length]; setHide(inp.dataset.hide, inp.value); preview(inp.dataset.hide);
      });
    };
    app.querySelector("#saveSetup").onclick = () => {
      app.querySelectorAll("[data-hide]").forEach((inp) => setHide(inp.dataset.hide, inp.value));
      go("home");
    };
    app.querySelectorAll("[data-voicetest]").forEach((b) => b.onclick = () => {
      const c = byId[b.dataset.voicetest];
      speak(`Hi! I'm ${c.name}. ${c.catchphrase}`, c.id);
    });
    app.querySelector("#replay").onclick = () => { save.found = {}; persist(); setupScreen(); };
    app.querySelector("#wipe").onclick = () => {
      if (confirm("Reset all progress, stars and hiding places?")) { save = fresh(); persist(); setupScreen(); }
    };
  }

  // Difficulty dial: a half-circle with 4 coloured segments and a needle.
  function dialSVG(level, from = level) {
    const P = (a, r) => [100 + r * Math.cos(a * Math.PI / 180), 100 - r * Math.sin(a * Math.PI / 180)].map((v) => v.toFixed(1)).join(" ");
    const segs = CHALLENGE_LEVELS.map((l, i) => {
      const a0 = 180 - i * 45 - 2, a1 = 180 - (i + 1) * 45 + 2;
      return `<path data-seg="${l.level}" d="M ${P(a0, 78)} A 78 78 0 0 1 ${P(a1, 78)}" stroke="${l.color}" stroke-width="24" fill="none"
        stroke-linecap="round" opacity="${l.level <= level ? 1 : 0.28}" style="cursor:pointer"/>`;
    }).join("");
    const angle = 180 - (from - 0.5) * 45;
    return `<svg class="dial" viewBox="0 0 200 118" role="slider" tabindex="0" aria-label="Difficulty"
        aria-valuemin="1" aria-valuemax="4" aria-valuenow="${level}" aria-valuetext="${CHALLENGE_LEVELS[level - 1].label}">
      ${segs}
      <g class="needle" style="transform: rotate(${-angle}deg)">
        <line x1="100" y1="100" x2="160" y2="100" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
      </g>
      <circle cx="100" cy="100" r="13" fill="#fff"/><circle cx="100" cy="100" r="6" fill="${CHALLENGE_LEVELS[level - 1].color}"/>
    </svg>`;
  }

  // Challenge wheel: one coloured wedge per challenge type, pointer at the top.
  function wheelSVG(types, rot) {
    const n = types.length, step = 360 / n;
    const P = (a, r) => [100 + r * Math.sin(a * Math.PI / 180), 100 - r * Math.cos(a * Math.PI / 180)].map((v) => v.toFixed(1)).join(" ");
    const wedges = types.map((t, i) => {
      const a0 = i * step - step / 2, a1 = i * step + step / 2;
      return `<g data-wedge="${i}" style="cursor:pointer">
        <path d="M 100 100 L ${P(a0, 94)} A 94 94 0 0 1 ${P(a1, 94)} Z" fill="${t.color}" stroke="#140f33" stroke-width="3"/>
        <g transform="rotate(${i * step} 100 100)">
          <text x="100" y="34" text-anchor="middle" font-size="22">${t.icon}</text>
          <text x="100" y="54" text-anchor="middle" font-size="11" font-weight="800" fill="#1a1030" font-family="Nunito, sans-serif">${t.label}</text>
        </g></g>`;
    }).join("");
    return `<svg class="wheel" viewBox="0 0 200 200" style="transform: rotate(${rot}deg)" aria-label="Challenge wheel">
      <circle cx="100" cy="100" r="98" fill="#140f33"/>${wedges}
      <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/>
    </svg>`;
  }

  // ---------- Quest flow ----------
  // Steps: 0 intro → 1 activity challenge → 2 riddle → 3 "what did you find?" → 4 celebrate
  const PATH = ["👋", "🏃", "🧩", "🎁", "🎉"];
  function runQuest(c) {
    if (!hidden(c.id)) return go("creature", c.id);
    const spot = makeRiddle(save.hides[c.id].text, c, save.hides[c.id].seed || 0);
    const outside = spot.place ? spot.place === "outside" : save.area === "outside";
    // Each character can have its own wheel (Leo uses Wolf Pack challenges).
    const types = challengeTypesFor(c);
    const saved = c.challengeSet === "wolf" ? save.ctypeWolf : save.ctype;
    let ctype = types.some((t) => t.id === saved) ? saved : types[0].id;
    let clevel = save.clevel || 1, doneLevel = 1, showAnswer = false, dialFrom = clevel;
    const rememberType = (id) => { if (c.challengeSet === "wolf") save.ctypeWolf = id; else save.ctype = id; persist(); };
    let wheelRot = -types.findIndex((t) => t.id === ctype) * (360 / types.length), spinning = false;
    let challenge = pickChallenge(ctype, clevel, c, outside);
    let step = 0, helpLevel = 0;

    const frame = (body) => {
      app.innerHTML = `
        <div style="${vars(c)}">
          <div class="path">${PATH.map((ico, i) =>
            `${i ? `<span class="line ${i <= step ? "on" : ""}"></span>` : ""}<span class="stop ${i <= step ? "on" : ""} ${i === step ? "now" : ""}">${ico}</span>`).join("")}</div>
          <div class="card">
            <div class="quest-head"><div class="art bob">${creatureArt(c.id)}</div>
              <div><h2>${c.name}</h2><span class="kind-chip">${c.kind}</span></div></div>
            ${body}
          </div>
        </div>`;
      const say = app.querySelector("[data-say]");
      if (say) say.onclick = () => speak(say.dataset.say, c.id);
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
        const lv = CHALLENGE_LEVELS[clevel - 1];
        frame(`
          <span class="step-label">Step 1 · Spin for a challenge</span>
          <div class="wheel-wrap">
            <div class="wheel-pointer" aria-hidden="true"></div>
            ${wheelSVG(types, wheelRot)}
            <button class="spin-btn" id="spin" aria-label="Spin the wheel">SPIN</button>
          </div>
          <p class="center small muted" style="margin:-4px 0 6px">Spin the wheel, or tap a colour to choose.</p>
          <div class="dial-wrap">
            ${dialSVG(clevel, dialFrom)}
            <div class="dial-levels" role="radiogroup" aria-label="Difficulty">
              ${CHALLENGE_LEVELS.map((l) => `<button role="radio" aria-checked="${l.level === clevel}" class="${l.level === clevel ? "active" : ""}" style="--lc:${l.color}" data-level="${l.level}">${l.icon}<br>${l.label}</button>`).join("")}
            </div>
          </div>
          <div class="challenge-box" style="--lc:${lv.color}">
            <span class="level-tag">${types.find((t) => t.id === ctype).icon} ${types.find((t) => t.id === ctype).label} · ${lv.icon} ${lv.label}${lv.bonus ? ` · +${lv.bonus} bonus ⭐` : ""}</span>
            <p class="big">${esc(challenge.text)}</p>
            ${challenge.seconds ? `<div class="timer" id="timer">${challenge.seconds}</div>` : ""}
            ${challenge.answer ? (showAnswer ? `<div class="hintbox">✅ <b>Answer:</b> ${esc(challenge.answer)}</div>` : `<button class="btn small-btn" id="showAnswer">👀 Show answer</button>`) : ""}
          </div>
          <div class="row">
            <button class="btn" data-say="${esc(challenge.text)}">🔊 Listen</button>
            ${challenge.seconds ? `<button class="btn" id="startTimer">⏱️ Start timer</button>` : ""}
            <button class="btn" id="another">🔀 Another one</button>
          </div>
          <button class="btn good block" data-next style="margin-top:10px">We did it!</button>`);
        // Swing the needle from the old level to the new one.
        const needle = app.querySelector(".needle");
        requestAnimationFrame(() => requestAnimationFrame(() => { needle.style.transform = `rotate(${-(180 - (clevel - 0.5) * 45)}deg)`; }));
        dialFrom = clevel;
        const repick = () => { challenge = pickChallenge(ctype, clevel, c, outside, challenge.text); showAnswer = false; render(); };
        // Spin the wheel to a type (random, or a tapped segment), then show a challenge of that type.
        const wheel = app.querySelector(".wheel");
        const spinTo = (k, turns) => {
          if (spinning) return;
          spinning = true;
          const seg = 360 / types.length;
          const target = ((-k * seg + (Math.random() * seg * 0.55 - seg * 0.275)) % 360 + 360) % 360;
          const delta = ((target - (wheelRot % 360)) % 360 + 360) % 360;
          wheelRot += turns * 360 + delta;
          wheel.classList.add("spinning");
          wheel.style.transform = `rotate(${wheelRot}deg)`;
          let finished = false;
          const done = () => {
            if (finished) return;
            finished = true;
            spinning = false;
            const t = types[k];
            ctype = t.id; rememberType(ctype);
            challenge = pickChallenge(ctype, clevel, c, outside, challenge.text); showAnswer = false;
            render();
            if (navigator.vibrate) navigator.vibrate(40);
            speak(`${t.label}! ${challenge.text}`, c.id);
          };
          wheel.addEventListener("transitionend", done, { once: true });
          // Backup in case the animation is switched off (reduced motion) and never "ends".
          setTimeout(done, matchMedia("(prefers-reduced-motion: reduce)").matches ? 60 : 3500);
        };
        app.querySelector("#spin").onclick = () => spinTo(Math.floor(Math.random() * types.length), 4);
        app.querySelectorAll("[data-wedge]").forEach((w) => w.onclick = () => spinTo(+w.dataset.wedge, 1));
        const setLevel = (n) => { clevel = save.clevel = Math.max(1, Math.min(4, n)); persist(); repick(); };
        app.querySelectorAll("[data-level]").forEach((b) => b.onclick = () => setLevel(+b.dataset.level));
        app.querySelectorAll("[data-seg]").forEach((g) => g.onclick = () => setLevel(+g.dataset.seg));
        const dial = app.querySelector(".dial");
        dial.onkeydown = (e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setLevel(clevel + 1); }
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setLevel(clevel - 1); }
        };
        app.querySelector("#another").onclick = repick;
        const sa = app.querySelector("#showAnswer");
        if (sa) sa.onclick = () => { showAnswer = true; render(); };
        app.querySelector("[data-next]").onclick = () => { doneLevel = clevel; step++; render(); };
        const t = app.querySelector("#startTimer");
        if (t) t.onclick = () => {
          let left = challenge.seconds;
          t.disabled = true;
          clearInterval(timerId);
          timerId = setInterval(() => {
            left -= 1;
            const el = app.querySelector("#timer");
            if (el) el.textContent = left > 0 ? left : "🎉";
            if (left <= 0) { clearInterval(timerId); confetti(["✨"]); }
          }, 1000);
        };
        return;
      } else if (step === 2) {
        const helps = [
          helpLevel >= 1 ? `<div class="hintbox">🔎 <b>Clue:</b> ${spot.clue}</div>` : "",
          helpLevel >= 2 ? `<div class="hintbox hot">💡 <b>Big hint:</b> ${spot.hint}</div>` : "",
        ].join("");
        frame(`
          <span class="step-label">Step 2 · The Riddle</span>
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
        const choices = shuffle(CREATURES.filter((x) => x.id !== c.id)).slice(0, 3).concat(c);
        frame(`
          <span class="step-label">Step 3 · Show me!</span>
          <div class="speech">Hold up what you found! Which treasure is it?</div>
          <div class="choices">${shuffle(choices).map((x) =>
            `<button class="choice" data-pick="${x.id}"><span class="e">${x.accessoryEmoji}</span>${x.accessory}</button>`).join("")}</div>`);
        app.querySelectorAll("[data-pick]").forEach((b) => b.onclick = () => {
          if (b.dataset.pick === c.id) { step = 4; render(); }
          else { b.classList.add("wrong"); setTimeout(() => b.classList.remove("wrong"), 400); }
        });
      } else {
        const first = !save.found[c.id];
        // Fewer hints = more stars, and harder challenges earn bonus stars.
        const gained = first ? 3 - Math.min(helpLevel, 2) + CHALLENGE_LEVELS[doneLevel - 1].bonus : 0;
        if (first) { save.found[c.id] = Date.now(); save.stars += gained; persist(); }
        confetti();
        const thanks = `Thank you, thank you! You found my ${c.accessory}! We are friends forever now.`;
        frame(`
          <div class="speech">${thanks}</div>
          ${first ? `<p class="big center">You earned ${"⭐".repeat(gained)}</p>` : ""}
          <div class="hintbox center">🔓 You unlocked ${c.facts.length} secret fun facts in the Creature Journal!</div>
          <p></p>
          <div class="row">
            <button class="btn" data-say="${esc(thanks)}">🔊 Listen</button>
            <button class="btn" id="secrets">🔓 See secrets</button>
            <button class="btn purple" id="seeAR">🔮 Visit in AR</button>
            ${STORE_LINKS[c.id] ? `<button class="btn" data-shop="${c.id}">🛍️ Get the plush</button>` : ""}
            <button class="btn primary" id="home">More quests</button>
          </div>`);
        app.querySelector("#secrets").onclick = () => { go("creature", c.id); screens.creature(c.id, "secrets"); };
        app.querySelector("#seeAR").onclick = () => startAR(c.id);
        app.querySelector("#home").onclick = () => go("home");
        speak(thanks, c.id);
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
  loadCreatureImages(CREATURES.map((c) => c.id)).then(() => {
    go("home");
    try { if (!localStorage.getItem(STORE_KEY + ".seenHelp")) { dlg.showModal(); localStorage.setItem(STORE_KEY + ".seenHelp", "1"); } } catch (_) {}
  });
})();
