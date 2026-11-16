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
  const vars = (c) => `--c:${c.color};--soft:${c.soft}`;

  function confetti(emojis = ["⭐", "✨", "🌸", "🍄", "🪶", "🍀", "🎾"]) {
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
      const ready = CREATURES.filter((c) => save.spots[c.id]).length;
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
            <p><b>Grown-up setup</b><br><span class="small muted">${ready} of ${CREATURES.length} treasures hidden</span></p>
            <button class="btn primary" data-go="grownup" style="margin-left:auto">Set up</button>
          </div>` : ""}
        <div class="grid">
          ${CREATURES.map((c) => tile(c,
            save.found[c.id] ? `<span class="pill friend">Friend ✔</span>`
              : save.spots[c.id] ? `<span class="pill">Help me ${c.accessoryEmoji}</span>`
              : `<span class="pill idle">Not hidden</span>`)).join("")}
        </div>`;
      app.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => {
        const id = b.dataset.open;
        if (save.spots[id] && !save.found[id]) go("quest", id); else go("creature", id);
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
            ${c.photo ? `<div class="photo-badge"><img src="${c.photo}" alt="The real ${c.name.split(" ")[0]}">The real ${c.name.split(" ")[0]}</div>` : ""}
            <div class="art bob">${creatureArt(c.id)}</div>
            <h1>${c.name}</h1>
            <span class="kind-chip">${c.kind}${friend ? " · Friend ✔" : ""}</span><br>
            <span class="bubble">“${c.catchphrase}”</span>
          </section>
          <div class="row actions">
            ${!friend && save.spots[id] ? `<button class="btn primary" data-quest>🗺️ Start quest</button>` : ""}
            <button class="btn purple" data-ar>🔮 Find in AR</button>
          </div>
          <div class="tabs" role="tablist">
            ${[["story", "📖 Story"], ["powers", "⭐ Powers"], ["secrets", friend ? "🔓 Secrets" : "🔒 Secrets"]].map(([k, l]) =>
              `<button role="tab" aria-selected="${k === tab}" class="${k === tab ? "active" : ""}" data-tab="${k}">${l}</button>`).join("")}
          </div>
          ${panels[tab]}
        </div>`;
      app.querySelector("[data-say]").onclick = () => speak(`${c.name} the ${c.kind}. ${c.catchphrase} ${c.description}`);
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
      // Grown-up gate: a times-table question answered on a big on-screen keypad,
      // so it works the same on every phone without the device keyboard.
      const a = 3 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 7);
      const answer = String(a * b);
      let typed = "";
      app.innerHTML = `
        <h1 class="screen-title">🔑 Grown-up Corner</h1>
        <div class="card center">
          <p class="big">To make sure you're a grown-up, what is<br><b>${a} × ${b}</b> ?</p>
          <div class="gate-display" id="gateShow" aria-live="polite">&nbsp;</div>
          <p class="small" id="gateMsg">&nbsp;</p>
          <div class="keypad">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-key="${n}">${n}</button>`).join("")}
            <button data-key="del" aria-label="Delete">⌫</button>
            <button data-key="0">0</button>
            <button data-key="ok" class="ok" aria-label="Enter">✔</button>
          </div>
        </div>`;
      const show = app.querySelector("#gateShow"), msg = app.querySelector("#gateMsg");
      const refresh = () => { show.innerHTML = typed || "&nbsp;"; };
      const check = () => {
        if (typed === answer) return setupScreen();
        msg.textContent = typed ? "Not quite — try again!" : "Tap the numbers first.";
        show.animate([{ transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "none" }], 300);
        typed = ""; refresh();
      };
      app.querySelectorAll("[data-key]").forEach((btn) => btn.onclick = () => {
        const k = btn.dataset.key;
        msg.innerHTML = "&nbsp;";
        if (k === "ok") return check();
        if (k === "del") typed = typed.slice(0, -1);
        else if (typed.length < 3) typed += k;
        refresh();
      });
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
        <ol class="setup-steps small">
          <li>Take out the creature accessories (and any ball for Leo).</li>
          <li>Hide each one in a different spot in your play area.</li>
          <li>Choose that spot below so the riddles lead kids to it.</li>
        </ol>
        <p class="small muted">Not hidden yet? Tap a "Suggest" button and hide each one where the app says.</p>
        <div class="row">
          <button class="btn" data-rand="inside">🏠 Suggest (inside)</button>
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
  const PATH = ["👋", "🏃", "🧩", "🎁", "🎉"];
  function runQuest(c) {
    const spot = spotById[save.spots[c.id]];
    if (!spot) return go("creature", c.id);
    const challenge = pick(c.challenges);
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
          <span class="step-label">Step 1 · Seeker Challenge</span>
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
        const gained = first ? 3 - Math.min(helpLevel, 2) : 0; // fewer hints = more stars
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
            <button class="btn primary" id="home">More quests</button>
          </div>`);
        app.querySelector("#secrets").onclick = () => { go("creature", c.id); screens.creature(c.id, "secrets"); };
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
  loadCreatureImages(CREATURES.map((c) => c.id)).then(() => {
    go("home");
    try { if (!localStorage.getItem(STORE_KEY + ".seenHelp")) { dlg.showModal(); localStorage.setItem(STORE_KEY + ".seenHelp", "1"); } } catch (_) {}
  });
})();
