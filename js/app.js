// Imagamigos — main app: screens, quest flow, journal, grown-up setup.
(() => {
  const STORE_KEY = "mythSeekers.v2";
  const app = document.getElementById("app");
  const byId = Object.fromEntries(CREATURES.map((c) => [c.id, c]));

  // ---------- Saved progress (per device) ----------
  const fresh = () => ({ hides: {}, found: {}, arFound: {}, stars: 0, area: "inside" });
  let save = fresh();
  try { save = { ...fresh(), ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") }; } catch (_) {}
  save.hides = save.hides || {};
  // Each hiding place is a treasure TRAIL: clue-card stops first, the treasure last.
  // (Older saves had a single {text, seed} — turn those into a one-stop trail.)
  Object.keys(save.hides).forEach((k) => {
    const h = save.hides[k];
    if (h && !h.stops) save.hides[k] = { stops: [{ text: h.text || "", seed: h.seed || 0 }] };
  });
  const trailOf = (id) => (save.hides[id] && save.hides[id].stops) || [];
  const hidden = (id) => { const t = trailOf(id); return t.length > 0 && t.every((st) => st.text && st.text.trim()); };
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
    document.querySelectorAll(".confetti").forEach((el) => el.remove());
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
            <h1>${allDone ? `<span class="grad-text">Amigo Champion!</span>` : `Who needs <span class="grad-text">your help</span> tonight?`}</h1>
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
        <div class="grid" id="homeGrid">
          ${CREATURES.map((c) => tile(c,
            save.found[c.id] ? `<span class="pill friend">Friend ✔</span>`
              : hidden(c.id) ? `<span class="pill">Help me ${c.accessoryEmoji}</span>`
              : `<span class="pill idle">Not hidden</span>`)).join("")}
        </div>
        <div class="card calm-cta">
          <span class="calm-cta-moon">🌙</span>
          <div><b>Wind down with Nyxie</b><br><span class="small muted">A 2-minute calm-down for after play or before bed</span></div>
          <button class="btn purple" id="calmHome">Start</button>
        </div>
`;
      app.querySelector("#calmHome").onclick = () => Calm.start(() => go("home"));
      app.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => {
        const id = b.dataset.open;
        if (hidden(id) && !save.found[id]) go("quest", id); else go("creature", id);
      });
    },

    journal() {
      app.innerHTML = `
        <h1 class="screen-title">Creature <span class="grad-text">Journal</span></h1>
        <p class="lead">Tap a creature to read all about them. Help them on a quest to unlock their secrets!</p>
        <div class="grid">${CREATURES.map((c) => tile(c, save.found[c.id] ? `<span class="pill friend">Friend ✔</span>` : `<span class="pill seen">Read more</span>`)).join("")}</div>
        <h2 class="screen-title" style="margin-top:26px">📸 Memory <span class="grad-text">Book</span></h2>
        <p class="lead">Things you made together. Photos stay on this device.</p>
        <div class="memory-grid" id="memories"><p class="muted">Loading…</p></div>`;
      app.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => go("creature", b.dataset.open));
      showMemories();
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
            <button class="btn" data-make>🎲 Play together</button>
            <button class="btn" data-chapter>📖 ${friend ? "My story" : "Story (locked)"}</button>
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
      app.querySelector("[data-make]").onclick = () => go("create", id);
      app.querySelector("[data-chapter]").onclick = () => go("story", friend ? id : null);
      app.querySelectorAll("[data-tab]").forEach((b) => b.onclick = () => screens.creature(id, b.dataset.tab));
      const q = app.querySelector("[data-quest]");
      if (q) q.onclick = () => go("quest", id);
    },

    quest(id) { runQuest(byId[id]); },

    // ---------- Dreamwood Storybook ----------
    // story(): the contents page.  story(id): read a chapter ("prologue", a character id, or "finale").
    story(which) {
      const order = ["prologue", ...CREATURES.map((c) => c.id).filter((id) => STORY.chapters[id]), "finale"];
      const allFound = CREATURES.every((c) => save.found[c.id]);
      const unlocked = (k) => k === "prologue" || (k === "finale" ? allFound : !!save.found[k]);
      const chapterOf = (k) => k === "prologue" ? STORY.prologue : k === "finale" ? STORY.finale : STORY.chapters[k];
      const numberOf = (k) => order.indexOf(k);

      if (!which || !unlocked(which)) {
        app.innerHTML = `
          <h1 class="screen-title">📚 The Dreamwood <span class="grad-text">Storybook</span></h1>
          <p class="lead">${esc(STORY.title)}: one big story in short chapters. Find a friend's treasure to unlock their chapter.</p>
          <div class="chapter-list">
            ${order.map((k) => {
              const ch = chapterOf(k), open = unlocked(k), c = byId[k];
              const art = c ? creatureArt(c.id) : k === "prologue" ? "🌙" : "🚪";
              const lockMsg = k === "finale" ? "Find all seven treasures to unlock" : c ? `Find ${c.name}'s ${c.accessory} to unlock` : "";
              return `
                <button class="chapter ${open ? "" : "locked"}" style="${c ? vars(c) : ""}" data-chapter="${k}" ${open ? "" : "aria-disabled=\"true\""}>
                  <span class="chapter-art">${art}</span>
                  <span class="chapter-txt"><small>${k === "prologue" ? "Prologue" : `Chapter ${numberOf(k)}`}</small>
                    <b>${esc(ch.title)}</b>
                    <span class="small muted">${open ? (save.readChapters && save.readChapters[k] ? "✔ Read" : "✨ Ready to read") : `🔒 ${lockMsg}`}</span></span>
                </button>`; }).join("")}
            ${STORY.next.map((n) => `
              <div class="chapter soon"><span class="chapter-art">✨</span>
                <span class="chapter-txt"><small>Coming soon</small><b>${esc(n.title)}</b><span class="small muted">${esc(n.teaser)}</span></span></div>`).join("")}
          </div>`;
        app.querySelectorAll("[data-chapter]").forEach((b) => b.onclick = () => { if (unlocked(b.dataset.chapter)) go("story", b.dataset.chapter); });
        return;
      }

      const ch = chapterOf(which), c = byId[which];
      save.readChapters = save.readChapters || {};
      save.readChapters[which] = Date.now(); persist();
      const i = order.indexOf(which), prev = order[i - 1], next = order[i + 1];
      app.innerHTML = `
        <div style="${c ? vars(c) : ""}">
          <div class="card story-page">
            <div class="story-top">
              <button class="btn small-btn" id="toc">📚 All chapters</button>
              <button class="btn small-btn" id="readAloud">🔊 Read aloud</button>
            </div>
            <div class="story-art ${c ? "bob" : ""}">${c ? creatureArt(c.id) : which === "prologue" ? "🌙" : "🚪"}</div>
            <small class="story-num">${which === "prologue" ? "Prologue" : `Chapter ${i}`}</small>
            <h1 class="story-title">${esc(ch.title)}</h1>
            ${ch.text.map((t) => `<p class="story-text">${esc(t)}</p>`).join("")}
            ${ch.clue ? `<div class="hintbox story-clue">🔍 <b>Mystery clue:</b> ${esc(ch.clue)}</div>` : ""}
            ${ch.meanwhile ? `<p class="story-meanwhile">✨ <i>Meanwhile… ${esc(ch.meanwhile)}</i></p>` : ""}
            ${ch.ending ? `<p class="story-ending">${esc(ch.ending)}</p>` : ""}
            ${ch.wonder ? `<div class="hintbox hot">💭 ${esc(ch.wonder)}</div>` : ""}
          </div>
          <div class="row story-nav">
            ${prev ? `<button class="btn" data-goto="${prev}">◀ ${prev === "prologue" ? "Prologue" : "Previous"}</button>` : ""}
            ${next ? `<button class="btn ${unlocked(next) ? "purple" : ""}" data-goto="${next}">${unlocked(next) ? "Next chapter ▶" : "🔒 Next chapter"}</button>` : ""}
          </div>
        </div>`;
      app.querySelector("#toc").onclick = () => go("story");
      app.querySelector("#readAloud").onclick = () => speakAs("narrator", [ch.title, ...ch.text, ch.clue ? `Mystery clue: ${ch.clue}` : "", ch.meanwhile ? `Meanwhile… ${ch.meanwhile}` : "", ch.ending || "", ch.wonder || ""]);
      app.querySelectorAll("[data-goto]").forEach((b) => b.onclick = () => go("story", unlocked(b.dataset.goto) ? b.dataset.goto : null));
    },

    create(id) {
      const c = byId[id];
      app.innerHTML = `
        <div style="${vars(c)}"><div class="card">
          <div class="quest-head"><div class="art bob">${creatureArt(c.id)}</div>
            <div><h2>${c.name}</h2><span class="kind-chip">${c.kind}</span></div></div>
          <span class="step-label">🎲 Play together with ${c.name}</span>
          <div id="createBox"></div>
        </div></div>`;
      renderTogether(app.querySelector("#createBox"), c, { standalone: true, onDone: (made) => { if (made) confetti(); go("creature", id); } });
    },

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

  // ---------- Memory Book ----------
  function showMemories() {
    Memories.all().then((list) => {
      const box = document.getElementById("memories");
      if (!box) return;
      if (!list.length) {
        box.innerHTML = `<div class="card small muted" style="grid-column:1/-1">Nothing here yet! When a quest ends with the 🎨 Dream Workshop, you make something together. Snap a photo and it will appear here. You can also tap 🎲 Play together on any character's page.</div>`;
        return;
      }
      box.innerHTML = list.map((m) => { const c = byId[m.creature] || {}; return `
        <button class="memory" style="${c.color ? vars(c) : ""}" data-mem="${m.id}">
          <img src="${m.img}" alt="Made for ${esc(c.name || "a friend")}">
          <span>For ${esc(c.name || "a friend")}</span>
        </button>`; }).join("");
      box.querySelectorAll("[data-mem]").forEach((b) => b.onclick = () => {
        const m = list.find((x) => x.id === b.dataset.mem), c = byId[m.creature] || {};
        const d = document.createElement("dialog");
        d.className = "sheet center";
        d.innerHTML = `<img src="${m.img}" alt="" style="width:100%;border-radius:18px">
          <p><b>Made for ${esc(c.name || "a friend")}</b><br><span class="small muted">${esc(m.text)}<br>${new Date(m.date).toLocaleDateString()}</span></p>
          <div class="row"><button class="btn" data-del>🗑️ Delete</button><button class="btn primary" data-close>Close</button></div>`;
        document.body.appendChild(d);
        const close = () => { d.close(); d.remove(); };
        d.querySelector("[data-close]").onclick = close;
        d.querySelector("[data-del]").onclick = () => { if (confirm("Delete this memory?")) { Memories.remove(m.id).then(() => { close(); showMemories(); }); } };
        d.showModal();
      });
    });
  }

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
          <li><b>Want a longer, more active hunt?</b> Tap ➕ to make a <b>treasure trail</b>: leave a clue card (or any sticky note) at each stop, and each riddle leads to the next one, with the treasure at the end.</li>
        </ol>
        <div class="row">
          <button class="btn" id="suggest">✨ Suggest hiding places</button>
          <button class="btn" id="printCards">🖨️ Print clue cards</button>
        </div>
      </div>
      ${CREATURES.map((c) => `<div class="card hide-card" style="${vars(c)}" data-card="${c.id}"></div>`).join("")}
      <button class="btn primary block" id="saveSetup" style="margin-bottom:16px">Save &amp; start playing</button>
      <div class="card" id="voiceCard"></div>
      <div class="card">
        <b>Play again</b>
        <p class="small muted">Clears found characters so kids can hunt again. Stars are kept.</p>
        <div class="row">
          <button class="btn" id="replay">🔄 New hunt</button>
          <button class="btn" id="wipe">🗑️ Reset everything</button>
        </div>
      </div>`;

    // ---- one card per character: its treasure trail (clue stops + treasure) ----
    const trailFor = (id) => {
      if (!save.hides[id] || !save.hides[id].stops || !save.hides[id].stops.length) save.hides[id] = { stops: [{ text: "", seed: 0 }] };
      return save.hides[id].stops;
    };
    const riddleFor = (c, stops, i) => makeRiddle(stops[i].text, c, stops[i].seed || 0, i < stops.length - 1 ? "my next clue" : null);
    const preview = (c, i) => {
      const stops = trailFor(c.id);
      const box = app.querySelector(`[data-preview="${c.id}-${i}"]`);
      if (!box) return;
      if (!stops[i].text.trim()) { box.innerHTML = ""; return; }
      const r = riddleFor(c, stops, i);
      box.innerHTML = `
        ${r.unsafe ? `<p class="hintbox hot small">⚠️ That spot might not be safe for kids. Please choose somewhere else.</p>` : ""}
        <p><b>🧩 Riddle:</b> ${esc(r.riddle)}</p>
        <p><b>🔎 Clue:</b> ${esc(r.clue)}</p>
        <p><b>💡 Big hint:</b> ${esc(r.hint)}</p>
        ${r.variants > 1 ? `<button class="btn small-btn" data-reroll>🔄 Different riddle</button>` : ""}`;
      const rr = box.querySelector("[data-reroll]");
      if (rr) rr.onclick = () => { stops[i].seed = (stops[i].seed || 0) + 1; persist(); preview(c, i); };
    };
    const drawCard = (c, focusIndex) => {
      const card = app.querySelector(`[data-card="${c.id}"]`);
      const stops = trailFor(c.id), last = stops.length - 1;
      card.innerHTML = `
        <div class="hide-head">
          <span class="hide-art">${creatureArt(c.id)}</span>
          <div><b>${c.name}'s ${c.accessory}</b> ${c.accessoryEmoji}<br>
            <span class="muted small">${stops.length > 1 ? `Treasure trail · ${stops.length} stops` : "Where did you hide it?"}</span></div>
        </div>
        ${stops.map((st, i) => `
          <div class="stop-row ${i < last ? "clue" : "treasure"}">
            <div class="stop-label">
              <span>${i < last ? `📜 Clue card ${i + 1} — where did you leave it?` : stops.length > 1 ? `${c.accessoryEmoji} Treasure — the last stop` : ""}</span>
              ${i < last ? `<button class="stop-del" data-del="${i}" aria-label="Remove clue stop ${i + 1}">✕</button>` : ""}
            </div>
            <input type="text" class="hide-input" data-i="${i}" value="${esc(st.text)}"
              placeholder="e.g. ${esc(pick(ideasFor(area)))}" autocomplete="off" autocapitalize="off" enterkeyhint="done" maxlength="140">
            <div class="riddle-preview" data-preview="${c.id}-${i}"></div>
          </div>`).join("")}
        ${stops.length < 5 ? `<button class="btn small-btn" data-addstop>➕ Add a clue stop before the treasure</button>` : ""}`;
      stops.forEach((_, i) => preview(c, i));
      card.querySelectorAll(".hide-input").forEach((inp) => {
        const i = +inp.dataset.i;
        let t;
        inp.oninput = () => { clearTimeout(t); t = setTimeout(() => { stops[i].text = inp.value.trim(); persist(); preview(c, i); }, 250); };
        inp.onkeydown = (e) => { if (e.key === "Enter") inp.blur(); };
      });
      card.querySelectorAll("[data-del]").forEach((b) => b.onclick = () => { stops.splice(+b.dataset.del, 1); persist(); drawCard(c); });
      const add = card.querySelector("[data-addstop]");
      if (add) add.onclick = () => { stops.splice(stops.length - 1, 0, { text: "", seed: 0 }); persist(); drawCard(c, stops.length - 2); };
      if (focusIndex !== undefined) card.querySelector(`.hide-input[data-i="${focusIndex}"]`).focus();
    };
    CREATURES.forEach((c) => drawCard(c));

    app.querySelector("#printCards").onclick = () => printClueCards();
    app.querySelectorAll("[data-area]").forEach((b) => b.onclick = () => { save.area = b.dataset.area; persist(); setupScreen(); });
    app.querySelector("#suggest").onclick = () => {
      const pool = shuffle(ideasFor(area));
      let k = 0;
      CREATURES.forEach((c) => { trailFor(c.id).forEach((st) => { st.text = pool[k++ % pool.length]; }); drawCard(c); });
      persist();
    };
    app.querySelector("#saveSetup").onclick = () => {
      // Drop empty clue stops; keep the treasure stop.
      CREATURES.forEach((c) => {
        const stops = trailFor(c.id);
        save.hides[c.id].stops = stops.filter((st, i) => i === stops.length - 1 || st.text.trim());
      });
      persist();
      go("home");
    };
    // ---- Voice check: hear each character, and choose which voice each one uses ----
    const drawVoices = () => {
      const card = app.querySelector("#voiceCard");
      if (!card) return;
      const opts = Voices.options();
      card.innerHTML = `
        <h2 class="section-title">🔊 Voice check</h2>
        <p class="small muted" style="margin-top:0">Tap ▶ to hear each character. Pick a voice from the menu to change it —
          voices you've downloaded in your device settings are listed here (⭐ = high quality).</p>
        <div class="voice-list">
          ${CREATURES.map((c) => { const v = Voices.voiceFor(c.id); const mine = Voices.chosen(c.id); return `
            <div class="voice-row" style="${vars(c)}">
              <span class="hide-art">${creatureArt(c.id)}</span>
              <div class="voice-pick">
                <b>${c.name}</b>
                <select data-voicepick="${c.id}" aria-label="Voice for ${c.name}">
                  <option value="">✨ Auto${!mine && v ? `: ${esc(v.name.replace(/\s*\(.*\)\s*/, ""))}${/premium|enhanced|natural|neural|online/i.test(v.name) ? " ⭐" : ""}` : ""}</option>
                  ${opts.map((o) => `<option value="${esc(o.name)}" ${mine === o.name ? "selected" : ""}>${o.quality ? "⭐ " : ""}${esc(o.name)} · ${esc(o.lang)}</option>`).join("")}
                </select>
              </div>
              <button class="btn small-btn" data-voicetest="${c.id}" aria-label="Hear ${c.name}">▶</button>
            </div>`; }).join("")}
        </div>
        ${!opts.length ? `<p class="small muted">No voices found yet. If you just downloaded voices, close the browser completely and open the game again.</p>` : ""}
        ${Voices.hasQualityVoices()
          ? `<p class="small" style="margin-bottom:0">✅ High-quality voices found on this device.</p>`
          : `<details class="small voice-tip"><summary><b>Make the voices sound more natural (free)</b></summary>
              <p>Download a high-quality voice on this device, then close and reopen the game:</p>
              <ul>
                <li><b>iPhone / iPad:</b> Settings → Accessibility → Spoken Content → Voices → English → download voices marked <em>Enhanced</em> or <em>Premium</em> (for example Ava, Zoe, Evan, Nathan).</li>
                <li><b>Mac:</b> System Settings → Accessibility → Spoken Content → System Voice → Manage Voices.</li>
                <li><b>Android:</b> Settings → search "Text-to-speech" → Google → Install voice data → English → pick a high-quality voice.</li>
                <li><b>Windows:</b> open the game in Microsoft Edge to use its built-in Natural voices.</li>
              </ul></details>`}`;
      card.querySelectorAll("[data-voicetest]").forEach((b) => b.onclick = () => {
        const c = byId[b.dataset.voicetest];
        speak(`Hi! I'm ${c.name}. ${c.catchphrase}`, c.id);
      });
      card.querySelectorAll("[data-voicepick]").forEach((sel) => sel.onchange = () => {
        const c = byId[sel.dataset.voicepick];
        Voices.choose(c.id, sel.value);
        drawVoices();
        speak(`Hi! I'm ${c.name}. ${c.catchphrase}`, c.id);
      });
    };
    drawVoices();
    Voices.onChange(() => { if (document.getElementById("voiceCard")) drawVoices(); });
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

  // Printable clue cards for treasure-trail stops (any paper or sticky note works too).
  function printClueCards() {
    const cards = [];
    CREATURES.forEach((c) => {
      const stops = trailOf(c.id), clues = stops.length - 1;
      for (let i = 0; i < clues; i++) cards.push({ c, i, clues });
    });
    if (!cards.length) cards.push(...CREATURES.map((c) => ({ c, i: 0, clues: 1, blank: true })));
    const base = location.href.replace(/[^/]*$/, "");
    const w = window.open("", "_blank");
    if (!w) return alert("Please allow pop-ups to print the clue cards.");
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Imagamigos clue cards</title>
      <style>body{font-family:system-ui,sans-serif;margin:16px}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
      .card{border:3px dashed #999;border-radius:18px;padding:16px;text-align:center;break-inside:avoid;min-height:230px}
      .card img{height:110px}.card h2{margin:6px 0;font-size:20px}.card p{margin:4px 0;font-size:15px}
      .tag{display:inline-block;background:#eee;border-radius:99px;padding:3px 10px;font-weight:700;font-size:13px}
      @media print{.noprint{display:none}}</style></head><body>
      <p class="noprint"><button onclick="print()">🖨️ Print</button> Cut out each card and leave it at that clue stop.</p>
      <div class="grid">${cards.map(({ c, i, clues, blank }) => `<div class="card">
        <img src="${base}assets/characters/${c.id}.png" alt="">
        <h2>📜 You found a clue!</h2>
        <span class="tag">${c.name}'s trail${blank ? "" : ` · clue ${i + 1} of ${clues}`}</span>
        <p>Great tracking, amigo! Go back to the app and tap<br><b>"We found the clue card!"</b></p></div>`).join("")}</div>
      </body></html>`);
    w.document.close();
  }

  // ---------- Play together: rotating games for grown-up + kid (js/together.js) ----------
  function nextGameIndex() {
    const i = (save.togetherIdx || 0) % TOGETHER_GAMES.length;
    save.togetherIdx = i + 1; persist();
    return i;
  }
  function renderTogether(box, c, { onDone, standalone = false }) {
    let gi = nextGameIndex();
    const hello = standalone ? "" : "Thank you, amigo! Let's play a game together. ";
    const draw = (speakNow) => {
      clearInterval(timerId);
      const g = TOGETHER_GAMES[gi];
      const how = g.how.replace(/\{name\}/g, c.name);
      const head = `<div class="tg-head"><span class="tg-icon">${g.icon}</span>
        <div><b class="tg-name">${g.name}</b><br><span class="small muted">${esc(how)}</span></div></div>`;
      const switchBtn = `<button class="btn" data-switch>🔀 Different game</button>`;
      const wire = () => {
        box.querySelector("[data-switch]").onclick = () => { gi = (gi + 1) % TOGETHER_GAMES.length; draw(true); };
        const done = box.querySelector("[data-done]"); if (done) done.onclick = () => { clearInterval(timerId); onDone(true); };
        const skip = box.querySelector("[data-skip2]"); if (skip) skip.onclick = () => { clearInterval(timerId); onDone(false); };
      };
      const footer = `
        <button class="btn good block" data-done style="margin-top:12px">🎉 We did it!</button>
        <button class="btn block" data-skip2 style="margin-top:8px">Skip for now</button>`;

      if (g.id === "workshop") {
        // The Dream Workshop is the make-something game, with a photo for the Memory Book.
        box.innerHTML = head + `<div id="wsBox"></div><div class="row" style="margin-top:10px">${switchBtn}</div>`;
        renderCreate(box.querySelector("#wsBox"), c, { onDone, standalone, quiet: !speakNow && standalone });
        wire();
        return;
      }

      if (g.id === "act") {
        const scenes = ACT_SCENES[c.id] || ACT_SCENES.leo;
        let si = Math.floor(Math.random() * scenes.length);
        const show = (sayIt) => {
          const line = hello + scenes[si];
          box.innerHTML = head + `
            <div class="speech">${esc(scenes[si])}</div>
            <div class="row">
              <button class="btn" data-listen>🔊 Listen</button>
              <button class="btn" data-another>🎬 Another scene</button>
              ${switchBtn}
            </div>${footer}`;
          box.querySelector("[data-listen]").onclick = () => speak(scenes[si], c.id);
          box.querySelector("[data-another]").onclick = () => { si = (si + 1) % scenes.length; show(true); };
          wire();
          if (sayIt) speak(sayIt === true ? scenes[si] : line, c.id);
        };
        show(speakNow ? true : (standalone ? false : "first"));
        return;
      }

      if (g.id === "charades") {
        const others = shuffle(Object.entries(CHARADES).filter(([k]) => k !== c.id).flatMap(([, v]) => v));
        const cards = [...shuffle(CHARADES[c.id] || []), ...others];
        let ci = 0, open = false;
        const show = () => {
          box.innerHTML = head + `
            <div class="charade-card ${open ? "open" : ""}">
              ${open ? `<small>Act out… (no words!)</small><b>${esc(cards[ci % cards.length])}</b>`
                     : `<small>Turn ${ci + 1}</small><b>🤫 Actor: hide the screen and tap to peek</b>`}
            </div>
            <div class="row">
              ${open ? `<button class="btn primary" data-hide>👍 Got it! Hide the card</button>` : `<button class="btn primary" data-peek>👀 Peek at the secret card</button>`}
              ${switchBtn}
            </div>${footer}`;
          const pk = box.querySelector("[data-peek]"); if (pk) pk.onclick = () => { open = true; show(); };
          const hd = box.querySelector("[data-hide]"); if (hd) hd.onclick = () => { open = false; ci++; show(); };
          wire();
        };
        show();
        if (speakNow || !standalone) speak(hello + how, c.id);
        return;
      }

      if (g.id === "says") {
        // A round of 10 moves; about a third are tricks without "<name> says".
        const pool = shuffle([...(SAYS_MOVES[c.id] || []), ...SAYS_EVERYDAY]).slice(0, 10);
        const tricks = new Set(shuffle([...Array(10).keys()].slice(1)).slice(0, 3));
        let k = -1, running = false;
        const show = () => {
          const move = k >= 0 && k < pool.length ? pool[k] : null;
          const isTrick = tricks.has(k);
          box.innerHTML = head + `
            <div class="says-card ${isTrick ? "trick" : ""}">
              ${move ? `<small>Move ${k + 1} of ${pool.length}</small><b>${isTrick ? "" : `${esc(c.name)} says… `}${esc(move)}!</b>`
                     : k >= pool.length ? `<b>🎉 Great listening!</b><small>Did anyone get caught by a trick?</small>`
                     : `<b>Ready?</b><small>Listen carefully for "${esc(c.name)} says"!</small>`}
            </div>
            <div class="row">
              ${running ? `<button class="btn" data-stop>⏸ Pause</button>` : `<button class="btn primary" data-go2>${k < 0 ? "▶ Start" : k >= pool.length ? "🔁 Play again" : "▶ Keep going"}</button>`}
              ${switchBtn}
            </div>${footer}`;
          const st = box.querySelector("[data-go2]");
          if (st) st.onclick = () => {
            if (k >= pool.length) k = -1;
            running = true; tick();
            timerId = setInterval(tick, 4500);
          };
          const sp = box.querySelector("[data-stop]"); if (sp) sp.onclick = () => { running = false; clearInterval(timerId); show(); };
          wire();
        };
        const tick = () => {
          if (!box.isConnected) return clearInterval(timerId);
          k++;
          if (k >= pool.length) { running = false; clearInterval(timerId); show(); speak("Great listening, amigo!", c.id); return; }
          show();
          speak(tricks.has(k) ? `${pool[k]}!` : `${c.name} says… ${pool[k]}!`, c.id);
        };
        show();
        if (speakNow || !standalone) speak(hello + how, c.id);
        return;
      }

      if (g.id === "box") {
        const line = `${BOX_TWIST[c.id] || "Here's an invisible box!"} Open it carefully… what's inside?`;
        box.innerHTML = head + `
          <div class="speech">🎁 ${esc(line)}</div>
          <p class="small muted">Ideas: Is it tiny or huge? Light or heavy? Wiggly, sticky, fluffy, slippery? Does it make a sound?</p>
          <div class="row">
            <button class="btn" data-listen>🔊 Listen</button>
            ${switchBtn}
          </div>${footer}`;
        box.querySelector("[data-listen]").onclick = () => speak(line, c.id);
        wire();
        if (speakNow || !standalone) speak(hello + line, c.id);
      }
    };
    draw(false);
  }

  // ---------- Dream Workshop: make something together (+ Memory Book photo) ----------
  function renderCreate(box, c, { onDone, standalone = false, quiet = false }) {
    const reqs = CREATE_REQUESTS[c.id] || ["Make something wonderful together!"];
    let idx = Math.floor(Math.random() * reqs.length), photo = null;
    const lineFor = (req) => standalone ? `Will you make something for me? ${req}` : `Thank you so much! Will you do one more thing for me? ${req}`;
    const draw = () => {
      const req = reqs[idx];
      const line = lineFor(req);
      box.innerHTML = `
        <div class="speech">${esc(line)}</div>
        <p class="small muted">Make it together with your grown-up, then snap a photo to keep it in your 📸 Memory Book.</p>
        ${photo ? `<div class="photo-slot"><img src="${photo}" alt="Your creation"></div>` : ""}
        <div class="row">
          <button class="btn" data-listen>🔊 Listen</button>
          ${reqs.length > 1 ? `<button class="btn" data-other>🔀 Another idea</button>` : ""}
          <label class="btn purple file-btn">📷 ${photo ? "Retake" : "Take a photo"}<input type="file" accept="image/*" capture="environment" hidden></label>
        </div>
        <button class="btn good block" data-made style="margin-top:10px">🎨 We made it!</button>
        <button class="btn block" data-skip style="margin-top:8px">Skip for now</button>`;
      box.querySelector("[data-listen]").onclick = () => speak(line, c.id);
      const other = box.querySelector("[data-other]");
      if (other) other.onclick = () => { idx = (idx + 1) % reqs.length; draw(); speak(reqs[idx], c.id); };
      box.querySelector("input[type=file]").onchange = async (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        try { photo = await shrinkPhoto(f); } catch (_) { alert("Sorry, that photo couldn't be opened."); }
        draw();
      };
      box.querySelector("[data-made]").onclick = async () => {
        if (photo) {
          try { await Memories.add({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, creature: c.id, text: req, date: Date.now(), img: photo }); }
          catch (_) { alert("The photo couldn't be saved on this device, but well done!"); }
        }
        onDone(true);
      };
      box.querySelector("[data-skip]").onclick = () => onDone(false);
    };
    draw();
    if (!quiet) speak(lineFor(reqs[idx]), c.id);
  }

  // ---------- Quest flow ----------
  // Steps: 0 intro → 1 activity challenge → 2 riddle → 3 "what did you find?" → 4 celebrate
  const PATH = ["👋", "🏃", "🧩", "🎁", "🎲", "🎉"];
  function runQuest(c) {
    if (!hidden(c.id)) return go("creature", c.id);
    // Treasure trail: one riddle per stop (clue cards first, the treasure last).
    const trail = trailOf(c.id);
    const riddles = trail.map((st, i) => makeRiddle(st.text, c, st.seed || 0, i < trail.length - 1 ? "my next clue" : null));
    const finalSpot = riddles[riddles.length - 1];
    const outside = finalSpot.place ? finalSpot.place === "outside" : save.area === "outside";
    let stopIdx = 0, totalHints = 0, between = false, madeSomething = false, givingBack = false;
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
        const n = riddles.length, spot = riddles[stopIdx], isClue = stopIdx < n - 1;
        if (between) {
          // Just found a clue card — move to the next stop in the character's style.
          const msg = `Great tracking! Now ${MOVE_LIKE[c.id] || "zoom"} to the next stop!`;
          frame(`
            <span class="step-label">📜 Clue ${stopIdx} of ${n - 1} found!</span>
            <div class="trail-dots">${riddles.map((_, k) => `<i class="${k < stopIdx ? "on" : ""}">${k === n - 1 ? c.accessoryEmoji : "📜"}</i>`).join("")}</div>
            <div class="speech">${esc(msg)}</div>
            <div class="row">
              <button class="btn" data-say="${esc(msg)}">🔊 Listen</button>
              <button class="btn primary" id="nextRiddle">Next riddle ➜</button>
            </div>`);
          speak(msg, c.id);
          app.querySelector("#nextRiddle").onclick = () => { between = false; helpLevel = 0; render(); };
          return;
        }
        const helps = [
          helpLevel >= 1 ? `<div class="hintbox">🔎 <b>Clue:</b> ${spot.clue}</div>` : "",
          helpLevel >= 2 ? `<div class="hintbox hot">💡 <b>Big hint:</b> ${spot.hint}</div>` : "",
        ].join("");
        const intro = isClue
          ? (stopIdx === 0 ? "My treasure trail starts here! Solve the riddle to find the first clue card." : "Here's the next riddle. Find the next clue card!")
          : (n > 1 ? `Last stop! Solve this riddle to find my ${c.accessory}!` : `I think my ${c.accessory} is hiding here… solve my riddle!`);
        frame(`
          <span class="step-label">${n > 1 ? `Stop ${stopIdx + 1} of ${n} · ${isClue ? "find the clue card" : "find the treasure"}` : "Step 2 · The Riddle"}</span>
          ${n > 1 ? `<div class="trail-dots">${riddles.map((_, k) => `<i class="${k < stopIdx ? "on" : ""} ${k === stopIdx ? "now" : ""}">${k === n - 1 ? c.accessoryEmoji : "📜"}</i>`).join("")}</div>` : ""}
          <div class="speech">${intro}</div>
          <p class="big"><b>${spot.riddle}</b></p>
          ${helps}
          <p></p>
          <div class="row">
            <button class="btn" data-say="${esc(spot.riddle)}">🔊 Listen</button>
            ${helpLevel < 2 ? `<button class="btn" id="moreHelp">${helpLevel ? "💡 Big hint" : "🔎 Clue"}</button>` : ""}
            ${isClue ? `<button class="btn good" id="foundClue">📜 We found the clue card!</button>` : `<button class="btn good" data-next>We found it!</button>`}
          </div>`);
        const h = app.querySelector("#moreHelp");
        if (h) h.onclick = () => { helpLevel++; totalHints++; render(); };
        const fc = app.querySelector("#foundClue");
        if (fc) fc.onclick = () => { stopIdx++; between = true; confetti(["📜", "✨"]); render(); };
      } else if (step === 3 && givingBack) {
        // Give the treasure back: it attaches to the character's plush (hook-and-loop dot or pocket).
        const line = `Yay, that's it! Now give it back to me. ${c.returnTo || ""}`;
        frame(`
          <span class="step-label">🧸 Give it back!</span>
          <div class="speech">${esc(line)}</div>
          <p class="small muted">Got the ${esc(c.name)} plush? Pop the treasure back where it belongs.</p>
          <div class="row">
            <button class="btn" data-say="${esc(line)}">🔊 Listen</button>
            <button class="btn good" id="gaveBack">🧸 It's back on my plush!</button>
          </div>
          <button class="btn block" id="noPlush" style="margin-top:8px">No plush yet — keep going</button>`);
        speak(line, c.id);
        app.querySelector("#gaveBack").onclick = () => { confetti(["🧸", c.accessoryEmoji, "✨"]); step = 4; render(); };
        app.querySelector("#noPlush").onclick = () => { step = 4; render(); };
        return;
      } else if (step === 3) {
        const choices = shuffle(CREATURES.filter((x) => x.id !== c.id)).slice(0, 3).concat(c);
        frame(`
          <span class="step-label">Step 3 · Show me!</span>
          <div class="speech">Hold up what you found! Which treasure is it?</div>
          <div class="choices">${shuffle(choices).map((x) =>
            `<button class="choice" data-pick="${x.id}"><span class="e">${x.accessoryEmoji}</span>${x.accessory}</button>`).join("")}</div>`);
        app.querySelectorAll("[data-pick]").forEach((b) => b.onclick = () => {
          if (b.dataset.pick === c.id) { givingBack = true; render(); }
          else { b.classList.add("wrong"); setTimeout(() => b.classList.remove("wrong"), 400); }
        });
      } else if (step === 4) {
        frame(`<span class="step-label">Step 4 · Play together</span><div id="createBox"></div>`);
        renderTogether(app.querySelector("#createBox"), c, { onDone: (made) => { madeSomething = made; step = 5; render(); } });
        return;
      } else {
        const first = !save.found[c.id];
        // Fewer hints = more stars; harder challenges, longer trails and making something earn bonus stars.
        const n = riddles.length;
        const gained = first ? 3 - Math.min(2, Math.round(totalHints / n)) + CHALLENGE_LEVELS[doneLevel - 1].bonus + (n - 1) + (madeSomething ? 1 : 0) : 0;
        if (first) { save.found[c.id] = Date.now(); save.stars += gained; persist(); }
        confetti();
        const thanks = `Thank you, thank you! You found my ${c.accessory}! We are friends forever now.`;
        frame(`
          <div class="speech">${thanks}</div>
          ${first ? `<p class="big center">You earned ${"⭐".repeat(gained)}</p>` : ""}
          <div class="hintbox center">🔓 You unlocked ${c.facts.length} secret fun facts in the Creature Journal!</div>
          ${STORY.chapters[c.id] ? `<div class="hintbox center story-unlock">📖 New story chapter: <b>${esc(STORY.chapters[c.id].title)}</b>
            <br><button class="btn small-btn" id="readChapter" style="margin-top:8px">Read it now</button></div>` : ""}
          <p></p>
          <div class="row">
            <button class="btn" data-say="${esc(thanks)}">🔊 Listen</button>
            <button class="btn" id="secrets">🔓 See secrets</button>
            <button class="btn purple" id="seeAR">🔮 Visit in AR</button>
            ${STORE_LINKS[c.id] ? `<button class="btn" data-shop="${c.id}">🛍️ Get the plush</button>` : ""}
            <button class="btn primary" id="home">More quests</button>
          </div>
          <button class="btn block calm-btn" id="calmDown" style="margin-top:10px">🌙 Calm down with Nyxie</button>`);
        app.querySelector("#calmDown").onclick = () => Calm.start(() => go("home"));
        const rc = app.querySelector("#readChapter");
        if (rc) rc.onclick = () => go("story", c.id);
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
