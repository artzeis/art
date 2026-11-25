// Myth Seekers: After Dark — teams, turns, quests, Creature Court and the final scoreboard.
(() => {
  const STORE_KEY = "mythSeekers.afterDark.v1";
  const app = document.getElementById("app");
  const byId = Object.fromEntries(CREATURES.map((c) => [c.id, c]));
  const spotById = Object.fromEntries(SPOTS.map((s) => [s.id, s]));
  const SPICE = [
    { n: 1, label: "Mild", ico: "🌶️", desc: "Office party. Silly, not saucy." },
    { n: 2, label: "Cheeky", ico: "🌶️🌶️", desc: "Friends' night. A bit of gossip." },
    { n: 3, label: "Spicy", ico: "🌶️🌶️🌶️", desc: "Anything goes (clothes stay on)." },
  ];
  const RIDDLE_SECONDS = 180;
  const QUICK_SECONDS = 90; // find it within this many seconds for the speed bonus
  const STATS = [["charm", "💋", "Charm"], ["chaos", "🌀", "Chaos"], ["stamina", "🔋", "Stamina"], ["shade", "🕶️", "Shade"], ["rizz", "🔥", "Rizz"]];

  // ---------- Saved state ----------
  const fresh = () => ({
    ageOk: false,
    started: false,
    teams: [],            // { name, score, passes, fails, hints, fastest }
    spice: 2,
    sips: true,
    spots: {},            // creatureId -> spotId
    found: {},            // creatureId -> team index
    turn: 0,
    courtUsed: [],
    rule: null,           // active Court rule text
  });
  let save = fresh();
  try { save = { ...fresh(), ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") }; } catch (_) {}
  const persist = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(save)); } catch (_) {} };

  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
  const vars = (c) => `--c:${c.color}`;
  const sip = () => (save.sips ? SIP.on : SIP.off);
  const sipText = (t) => t.replace("{sip_team}", save.sips ? SIP.teamOn : SIP.teamOff).replace("{sip}", sip());
  const penalty = () => (save.sips ? "Take a sip. 🥂" : `Forfeit: ${pick(FORFEITS)}`);
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, "0")}`;
  const lost = () => CREATURES.filter((c) => save.spots[c.id] && !(c.id in save.found));
  const team = () => save.teams[save.turn % save.teams.length];

  function confetti(emojis = ["🥂", "✨", "👑", "🎤", "🍷", "💪", "🫗"]) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < 30; i++) {
      const s = document.createElement("span");
      s.className = "confetti";
      s.textContent = pick(emojis);
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 3600);
    }
  }

  function buzz(ms = 200) { try { navigator.vibrate && navigator.vibrate(ms); } catch (_) {} }

  // ---------- Router ----------
  let timerId = null;
  function go(screen, arg) {
    clearInterval(timerId);
    if (!save.ageOk) screen = "gate";
    document.querySelectorAll(".tabbar button").forEach((b) =>
      b.classList.toggle("active", b.dataset.go === screen || (screen === "creature" && b.dataset.go === "creatures")));
    document.body.classList.toggle("gated", screen === "gate");
    (screens[screen] || screens.home)(arg);
    window.scrollTo(0, 0);
  }

  const scoreboard = (highlight = true) => {
    const max = Math.max(...save.teams.map((t) => t.score));
    return `<div class="scores">${save.teams.map((t, i) => `
      <div class="score ${highlight && i === save.turn % save.teams.length ? "now" : ""}">
        <span class="tname">${t.score === max && max > 0 ? "👑 " : ""}${esc(t.name)}</span><b>${t.score}</b>
      </div>`).join("")}</div>`;
  };

  const tile = (c, pill) => `
    <button class="creature-tile" style="${vars(c)}" data-open="${c.id}">
      <span class="art">${CREATURE_SVG[c.id]}<span class="badge">${c.accessoryEmoji}</span></span>
      <span class="name">${c.name}</span>
      <span class="kind">${c.title}</span>
      ${pill || ""}
    </button>`;

  const screens = {
    gate() {
      app.innerHTML = `
        <section class="gate">
          <div class="moon">🌙</div>
          <h1>Myth Seekers<br><span>After Dark</span></h1>
          <p class="lead">The creatures have grown up. They've also gone out, had a few, and lost their stuff.</p>
          <div class="card">
            <p><b>This is a party game for adults (18+).</b> It has cheeky humour and optional drinking rules.
              Sips can be any drink, alcohol is never required, and every challenge can be swapped for a forfeit.</p>
            <button class="btn primary block" id="ageYes">I'm 18 or over. Let's party 🥂</button>
            <p class="small muted center">Under 18? Play the <a href="../index.html">family version of Myth Seekers</a>.</p>
          </div>
        </section>`;
      app.querySelector("#ageYes").onclick = () => { save.ageOk = true; persist(); go("home"); };
    },

    home() {
      if (!save.started) {
        app.innerHTML = `
          <section class="welcome">
            <div class="big-emoji">🪩</div>
            <h1>Tonight's guest list</h1>
            <p>Five magical creatures went out last night. Their prized possessions did not come home.
              Split into teams, do ridiculous challenges, crack the riddles and race to return the goods.</p>
          </section>
          <div class="grid">${CREATURES.map((c) => tile(c, `<span class="pill">Lost: ${c.accessoryEmoji} ${c.accessory}</span>`)).join("")}</div>
          <button class="btn primary block big-btn" data-go="setup">🎉 Set up a party</button>
          <button class="btn block" data-go="rules">📜 How to play</button>`;
        bindTiles("creature");
        return;
      }
      const left = lost();
      if (!left.length) return go("final");
      const t = team();
      app.innerHTML = `
        ${scoreboard()}
        ${save.rule ? `<div class="rule-banner">⚖️ <b>Court rule in force:</b> ${esc(sipText(save.rule))}</div>` : ""}
        <section class="turn-card">
          <small>Up next</small>
          <h1>${esc(t.name)}</h1>
          <p>Pick a creature to help. Everyone else: you're the judges. Be harsh. Be fair. Mostly harsh.</p>
        </section>
        <div class="grid">${CREATURES.map((c) => tile(c,
          c.id in save.found ? `<span class="pill done">Returned by ${esc(save.teams[save.found[c.id]].name)}</span>`
            : save.spots[c.id] ? `<span class="pill">Help me! ${c.accessoryEmoji}</span>`
            : `<span class="pill idle">Not hidden</span>`)).join("")}</div>
        <div class="row">
          <button class="btn" id="skip">⏭️ Skip ${esc(t.name)}'s turn</button>
          <button class="btn" id="court">⚖️ Creature Court card</button>
        </div>`;
      app.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => {
        const id = b.dataset.open;
        if (save.spots[id] && !(id in save.found)) go("quest", id); else go("creature", id);
      });
      app.querySelector("#skip").onclick = () => { nextTurn(); go("home"); };
      app.querySelector("#court").onclick = () => go("court", { then: "home" });
    },

    creatures() {
      app.innerHTML = `
        <h1 class="screen-title">💘 Creature Profiles</h1>
        <p class="lead">Swipe right on nobody. Read everything. Return a creature's stuff to unlock their gossip.</p>
        <div class="grid">${CREATURES.map((c) => tile(c, c.id in save.found ? `<span class="pill done">Gossip unlocked</span>` : `<span class="pill">View profile</span>`)).join("")}</div>`;
      bindTiles("creature");
    },

    creature(id) {
      const c = byId[id];
      const unlocked = id in save.found ? c.gossip.length : 1;
      app.innerHTML = `
        <div style="${vars(c)}">
          <section class="hero">
            <div class="art">${CREATURE_SVG[c.id]}<span class="badge">${c.accessoryEmoji}</span></div>
            <h1>${c.name}</h1>
            <span class="kind-chip">${c.kind} · ${c.title}</span>
            <p class="bubble">“${c.catchphrase}”</p>
          </section>
          <div class="card"><h2 class="section-title">📝 Bio</h2><p>${c.bio}</p></div>
          <div class="card">
            <h2 class="section-title">💘 Dating profile</h2>
            <div class="info-grid">
              <div class="info"><b>🎂 Age</b>${c.age}</div>
              <div class="info"><b>💼 Job</b>${c.job}</div>
              <div class="info"><b>✨ Star sign</b>${c.starSign}</div>
              <div class="info"><b>🍸 Drink order</b>${c.drink}</div>
              <div class="info green"><b>💚 Green flag</b>${c.greenFlag}</div>
              <div class="info red"><b>🚩 Red flag</b>${c.redFlag}</div>
              <div class="info wide"><b>💬 Opening line</b>“${c.datingLine}”</div>
              <div class="info wide"><b>${c.accessoryEmoji} Lost item</b>${c.accessory} <span class="muted small">(stand-in: ${c.standIn})</span></div>
            </div>
          </div>
          <div class="card">
            <h2 class="section-title">📊 Stats</h2>
            ${STATS.map(([k, ico, label]) => `
              <div class="stat"><span>${ico}</span><b>${label}</b>
                <div class="bar" role="img" aria-label="${label} ${c.stats[k]} out of 5"><i style="width:${c.stats[k] * 20}%"></i></div></div>`).join("")}
          </div>
          <div class="card">
            <h2 class="section-title">🤫 Gossip</h2>
            <p class="small muted">${id in save.found ? "All the tea. You earned it." : `Return the ${c.accessory} to unlock ${c.gossip.length - 1} more.`}</p>
            <div class="gossip">${c.gossip.map((g, i) => i < unlocked
              ? `<div class="g"><span>${i + 1}</span>${g}</div>`
              : `<div class="g locked"><span>🔒</span>Redacted by ${c.name}'s lawyer</div>`).join("")}</div>
          </div>
          <button class="btn block" data-go="${save.started ? "home" : "creatures"}">← Back</button>
        </div>`;
    },

    rules() {
      app.innerHTML = `
        <h1 class="screen-title">📜 How to Play</h1>
        <div class="card">
          <ol class="howto">
            <li><b>The host hides five items</b> around the house before guests arrive: a tiara, a flask, a corkscrew,
              a microphone and a sweatband. Stand-ins are fine (a hairbrush makes a great mic). Tell the app where each one is.</li>
            <li><b>Split into 2 to 6 teams</b> and pick a spice level: Mild, Cheeky or Spicy.</li>
            <li><b>On your turn, pick a lost creature.</b> It tells you, at length, what it lost.</li>
            <li><b>Do the challenge.</b> Everyone else judges. Nail it for <b>+2</b>. Bottle it and ${save.sips ? "take a sip" : "do a forfeit"}.</li>
            <li><b>Crack the riddle</b> and go find the item. You have 3 minutes. Each clue costs a point.
              Find it within 90 seconds for a <b>+2</b> speed bonus.</li>
            <li><b>Bring it back</b> and prove it's the right one. A find is worth <b>5</b> points, minus clues.</li>
            <li><b>Creature Court:</b> after each turn, a creature hands down a card for the whole room:
              votes, Never Have I Ever and silly rules.</li>
            <li><b>Last call:</b> when all five items are home, the team with the most points wins. Awards are handed out.</li>
          </ol>
        </div>
        <div class="card safety">
          <h2 class="section-title">🛡️ Play nice</h2>
          <ul>
            <li>Sips can be any drink. Nobody has to drink alcohol, and anyone can swap a sip for a forfeit. Turn sips off in setup to use forfeits for everyone.</li>
            <li>Anything involving touching needs a clear yes from the other person. "Pass" is always allowed.</li>
            <li>Keep hiding spots safe: nothing hot, high up or breakable. Don't send tipsy people up ladders.</li>
            <li>Drink water. Eat snacks. Look after each other, and get everyone home safely.</li>
          </ul>
        </div>
        <button class="btn primary block" data-go="${save.started ? "home" : "setup"}">${save.started ? "Back to the party" : "Set up a party"}</button>`;
    },

    setup() { setupScreen(); },
    host() { hostScreen(); },
    quest(id) { runQuest(byId[id]); },
    court(opts) { courtScreen(opts || {}); },
    final() { finalScreen(); },
  };

  function bindTiles(target) {
    app.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => go(target, b.dataset.open));
  }

  // ---------- Setup ----------
  function spotSelect(id) {
    return `<select data-spot="${id}"><option value="">— Not hidden —</option>${["inside", "outside"].map((place) => `
      <optgroup label="${place === "inside" ? "Inside" : "Outside"}">
        ${SPOTS.filter((s) => s.place === place).map((s) => `<option value="${s.id}" ${save.spots[id] === s.id ? "selected" : ""}>${s.label}</option>`).join("")}
      </optgroup>`).join("")}</select>`;
  }

  function setupScreen() {
    let names = save.teams.length ? save.teams.map((t) => t.name) : shuffle(TEAM_NAMES).slice(0, 2);
    let spice = save.spice, sips = save.sips;

    const render = () => {
      app.innerHTML = `
        <h1 class="screen-title">🎉 Set Up the Party</h1>
        <div class="card">
          <h2 class="section-title">1 · Teams</h2>
          ${names.map((n, i) => `
            <div class="team-row">
              <input value="${esc(n)}" data-team="${i}" aria-label="Team ${i + 1} name" maxlength="28" />
              ${names.length > 2 ? `<button class="btn icon" data-del="${i}" aria-label="Remove team">✕</button>` : ""}
            </div>`).join("")}
          ${names.length < 6 ? `<button class="btn" id="addTeam">＋ Add a team</button>` : ""}
        </div>
        <div class="card">
          <h2 class="section-title">2 · Spice level</h2>
          <div class="spice">${SPICE.map((s) => `
            <button class="${s.n === spice ? "on" : ""}" data-spice="${s.n}"><span>${s.ico}</span><b>${s.label}</b><small>${s.desc}</small></button>`).join("")}</div>
          <label class="toggle"><input type="checkbox" id="sips" ${sips ? "checked" : ""} />
            <span><b>Sip rules</b><br><small class="muted">On: penalties are "take a sip" (any drink). Off: everyone does forfeits instead.</small></span></label>
        </div>
        <div class="card">
          <h2 class="section-title">3 · Hide the goods</h2>
          <p class="small muted">Hide each item in a different spot, then pick that spot below. No props? Use a stand-in.
            Don't want to think? Hit Suggest and hide them where the app says.</p>
          <div class="row">
            <button class="btn" data-rand="inside">🏠 Suggest (inside)</button>
            <button class="btn" data-rand="all">🌳 Suggest (inside + garden)</button>
          </div>
          ${CREATURES.map((c) => `
            <label class="field"><span>${c.accessoryEmoji} <b>${c.accessory}</b> <span class="muted small">· stand-in: ${c.standIn}</span></span>
              ${spotSelect(c.id)}</label>`).join("")}
        </div>
        <p class="error" id="err" role="alert"></p>
        <button class="btn primary block big-btn" id="start">🥂 Start the party</button>`;

      app.querySelectorAll("[data-team]").forEach((inp) => inp.oninput = () => { names[inp.dataset.team] = inp.value; });
      app.querySelectorAll("[data-del]").forEach((b) => b.onclick = () => { names.splice(Number(b.dataset.del), 1); keepSpots(); render(); });
      const add = app.querySelector("#addTeam");
      if (add) add.onclick = () => { names.push(pick(TEAM_NAMES.filter((n) => !names.includes(n))) || `Team ${names.length + 1}`); keepSpots(); render(); };
      app.querySelectorAll("[data-spice]").forEach((b) => b.onclick = () => { spice = Number(b.dataset.spice); keepSpots(); render(); });
      app.querySelector("#sips").onchange = (e) => { sips = e.target.checked; };
      app.querySelectorAll("[data-rand]").forEach((b) => b.onclick = () => {
        const pool = shuffle(SPOTS.filter((s) => b.dataset.rand === "all" || s.place === "inside"));
        app.querySelectorAll("[data-spot]").forEach((sel, i) => sel.value = pool[i].id);
      });
      app.querySelector("#start").onclick = () => {
        keepSpots();
        const chosen = Object.values(save.spots);
        const err = app.querySelector("#err");
        if (!chosen.length) { err.textContent = "Hide at least one item first."; return; }
        if (new Set(chosen).size !== chosen.length) { err.textContent = "Two items share a hiding spot. Give each one its own."; return; }
        save.teams = names.map((n, i) => ({ name: n.trim() || `Team ${i + 1}`, score: 0, passes: 0, fails: 0, hints: 0, fastest: null }));
        Object.assign(save, { spice, sips, started: true, found: {}, turn: 0, courtUsed: [], rule: null });
        persist(); confetti(); go("home");
      };
    };
    // Keep spot choices across re-renders of the form.
    const keepSpots = () => app.querySelectorAll("[data-spot]").forEach((sel) => {
      if (sel.value) save.spots[sel.dataset.spot] = sel.value; else delete save.spots[sel.dataset.spot];
    });
    render();
  }

  function hostScreen() {
    if (!save.started) return go("setup");
    app.innerHTML = `
      <h1 class="screen-title">🔑 Host Controls</h1>
      ${scoreboard(false)}
      <div class="card">
        <h2 class="section-title">Hiding spots</h2>
        <p class="small muted">Moved something? Update it here. Returned items are ticked.</p>
        ${CREATURES.map((c) => `
          <label class="field"><span>${c.accessoryEmoji} <b>${c.accessory}</b> ${c.id in save.found ? "✅" : ""}</span>${spotSelect(c.id)}</label>`).join("")}
        <button class="btn primary block" id="saveSpots">Save spots</button>
      </div>
      <div class="card">
        <h2 class="section-title">Scores</h2>
        ${save.teams.map((t, i) => `
          <div class="team-row"><span class="grow">${esc(t.name)}</span>
            <button class="btn icon" data-adj="${i}:-1" aria-label="Minus one">−</button><b class="pts">${t.score}</b>
            <button class="btn icon" data-adj="${i}:1" aria-label="Plus one">＋</button></div>`).join("")}
        <label class="toggle"><input type="checkbox" id="sips" ${save.sips ? "checked" : ""} /><span><b>Sip rules</b></span></label>
      </div>
      <div class="card">
        <h2 class="section-title">End of the night</h2>
        <div class="row">
          <button class="btn" id="last">🏁 Last call (end now)</button>
          <button class="btn" id="again">🔄 New party, same teams</button>
          <button class="btn danger" id="wipe">🗑️ Reset everything</button>
        </div>
      </div>`;
    app.querySelector("#saveSpots").onclick = () => {
      app.querySelectorAll("[data-spot]").forEach((sel) => { if (sel.value) save.spots[sel.dataset.spot] = sel.value; else delete save.spots[sel.dataset.spot]; });
      persist(); go("home");
    };
    app.querySelectorAll("[data-adj]").forEach((b) => b.onclick = () => {
      const [i, d] = b.dataset.adj.split(":").map(Number);
      save.teams[i].score += d; persist(); hostScreen();
    });
    app.querySelector("#sips").onchange = (e) => { save.sips = e.target.checked; persist(); };
    app.querySelector("#last").onclick = () => go("final");
    app.querySelector("#again").onclick = () => { save.started = false; save.found = {}; save.spots = {}; persist(); go("setup"); };
    app.querySelector("#wipe").onclick = () => {
      if (confirm("Reset all teams, scores and hiding spots?")) { save = { ...fresh(), ageOk: true }; persist(); go("home"); }
    };
  }

  function nextTurn() { save.turn = (save.turn + 1) % save.teams.length; persist(); }

  // ---------- Quest ----------
  // Steps: 0 intro → 1 challenge → 2 riddle hunt → 3 show me → 4 score
  const PATH = ["💬", "🎭", "🧩", "🔍", "🏆"];
  function runQuest(c) {
    const spot = spotById[save.spots[c.id]];
    if (!spot) return go("creature", c.id);
    const t = team();
    const pool = c.challenges.filter((x) => x.spice <= save.spice);
    const top = pool.filter((x) => x.spice === save.spice);
    let challenge = pick(top.length && Math.random() < 0.7 ? top : pool);
    let redrawn = false;
    let step = 0, hints = 0, passed = null, wrongPicks = 0, timeUsed = 0, riddleStart = null, timesUp = false;

    const frame = (body) => {
      app.innerHTML = `
        <div style="${vars(c)}">
          <div class="team-strip">🎯 ${esc(t.name)} · ${t.score} pts</div>
          <div class="path">${PATH.map((ico, i) =>
            `${i ? `<span class="line ${i <= step ? "on" : ""}"></span>` : ""}<span class="stop ${i <= step ? "on" : ""} ${i === step ? "now" : ""}">${ico}</span>`).join("")}</div>
          <div class="card quest">
            <div class="quest-head"><div class="art">${CREATURE_SVG[c.id]}</div>
              <div><h2>${c.name}</h2><span class="kind-chip">${c.title}</span></div></div>
            ${body}
          </div>
        </div>`;
    };

    const render = () => {
      clearInterval(timerId);
      if (step === 0) {
        frame(`
          <div class="speech">${c.intro}</div>
          <p class="small muted">Read it out loud in ${c.name}'s voice. That's not optional.</p>
          <div class="row"><button class="btn primary" data-next>Fine, we'll help</button>
          <button class="btn" data-go="home">Pick someone else</button></div>`);
      } else if (step === 1) {
        const spiceTag = SPICE[challenge.spice - 1];
        frame(`
          <span class="step-label">Challenge · ${spiceTag.ico} ${spiceTag.label}</span>
          <p class="big">${challenge.text}</p>
          ${challenge.seconds ? `<div class="timer" id="timer">${fmt(challenge.seconds)}</div>` : ""}
          ${passed === null ? `
            <p class="small muted">The other teams are the judges. Majority rules. Heckling encouraged.</p>
            <div class="row">
              ${challenge.seconds ? `<button class="btn" id="startTimer">⏱️ Start timer</button>` : ""}
              ${!redrawn && pool.length > 1 ? `<button class="btn" id="redraw">🔁 Redraw (once)</button>` : ""}
            </div>
            <div class="row">
              <button class="btn good" id="pass">🙌 Nailed it (+2)</button>
              <button class="btn bad" id="fail">😬 Bottled it</button>
            </div>`
          : `<div class="verdict ${passed ? "yes" : "no"}">${passed ? "Nailed it. +2 points. 🙌" : `Bottled it. ${penalty()}`}</div>
             <button class="btn primary block" data-next>On to the riddle →</button>`}`);
        const st = app.querySelector("#startTimer");
        if (st) st.onclick = () => {
          let left = challenge.seconds;
          st.disabled = true;
          timerId = setInterval(() => {
            left -= 1;
            const el = app.querySelector("#timer");
            if (el) el.textContent = left > 0 ? fmt(left) : "⏰ Time!";
            if (left <= 0) { clearInterval(timerId); buzz(400); }
          }, 1000);
        };
        const rd = app.querySelector("#redraw");
        if (rd) rd.onclick = () => { challenge = pick(pool.filter((x) => x !== challenge)); redrawn = true; render(); };
        const p = app.querySelector("#pass"), f = app.querySelector("#fail");
        if (p) p.onclick = () => { passed = true; confetti(["🙌", "✨"]); render(); };
        if (f) f.onclick = () => { passed = false; render(); };
      } else if (step === 2) {
        if (riddleStart === null) riddleStart = Date.now();
        const helps = [
          hints >= 1 ? `<div class="hintbox">🔎 <b>Clue:</b> ${spot.clue}</div>` : "",
          hints >= 2 ? `<div class="hintbox hot">🚨 <b>Dead giveaway:</b> ${spot.hint}</div>` : "",
        ].join("");
        frame(`
          <span class="step-label">The Riddle · ${fmt(RIDDLE_SECONDS)} on the clock</span>
          <div class="speech">My ${c.accessory} is hiding somewhere around here. This is where I last saw it:</div>
          <p class="big riddle"><b>${spot.riddle}</b></p>
          <div class="timer hunt" id="timer"></div>
          ${helps}
          <div class="row">
            ${hints < 2 ? `<button class="btn" id="hint">${hints ? "🚨 Dead giveaway (−1)" : "🔎 Clue (−1)"}</button>` : ""}
            <button class="btn" id="giveUp">🏳️ Give up</button>
          </div>
          <button class="btn good block" id="found">🎉 We've got it!</button>`);
        const tick = () => {
          const el = app.querySelector("#timer");
          const used = Math.floor((Date.now() - riddleStart) / 1000);
          const left = RIDDLE_SECONDS - used;
          if (!el) return;
          if (left > 0) {
            el.textContent = fmt(left);
            el.classList.toggle("bonus", used < QUICK_SECONDS);
            el.dataset.note = used < QUICK_SECONDS ? `Speed bonus for ${fmt(QUICK_SECONDS - used)} more` : "No speed bonus now. Keep looking!";
          } else {
            el.textContent = "⏰ Time's up!";
            el.dataset.note = `${penalty()} Then keep looking. Your points still count.`;
            el.classList.remove("bonus");
            if (!timesUp) { timesUp = true; buzz(600); }
            clearInterval(timerId);
          }
        };
        tick();
        timerId = setInterval(tick, 500);
        const h = app.querySelector("#hint");
        if (h) h.onclick = () => { hints++; render(); };
        app.querySelector("#found").onclick = () => { timeUsed = Math.floor((Date.now() - riddleStart) / 1000); step = 3; render(); };
        app.querySelector("#giveUp").onclick = () => {
          if (!confirm(`Give up on ${c.name}? The item stays hidden for another team, and you score nothing this turn.`)) return;
          if (passed) t.score += 2;
          t.passes += passed ? 1 : 0; t.fails += passed ? 0 : 1; t.hints += hints;
          nextTurn();
          app.innerHTML = `<div class="card center"><h2>🏳️ ${esc(t.name)} gave up</h2>
            <p>${c.name} is devastated. ${penalty()}</p>
            <p class="small muted">The ${c.accessory} stays hidden. Put it back if you moved it!</p>
            <button class="btn primary block" id="toCourt">⚖️ Creature Court</button></div>`;
          app.querySelector("#toCourt").onclick = () => go("court", { by: c.id, then: "home" });
        };
      } else if (step === 3) {
        const choices = shuffle(shuffle(CREATURES.filter((x) => x.id !== c.id)).slice(0, 3).concat(c));
        frame(`
          <span class="step-label">Prove it</span>
          <div class="speech">Hold it up so the room can see. Which one have you got?</div>
          <div class="choices">${choices.map((x) =>
            `<button class="choice" data-pick="${x.id}"><span class="e">${x.accessoryEmoji}</span>${x.accessory}</button>`).join("")}</div>
          ${wrongPicks ? `<p class="small center bad-text">Wrong item: −1 point. Nice try.</p>` : ""}`);
        app.querySelectorAll("[data-pick]").forEach((b) => b.onclick = () => {
          if (b.dataset.pick === c.id) { step = 4; render(); }
          else { wrongPicks++; b.classList.add("wrong"); buzz(); setTimeout(render, 400); }
        });
      } else {
        const quick = timeUsed < QUICK_SECONDS;
        const lines = [
          ["Found it", 5],
          ...(hints ? [[`Clues used (${hints})`, -hints]] : []),
          ...(passed ? [["Challenge nailed", 2]] : []),
          ...(quick ? [["Speed bonus", 2]] : []),
          ...(wrongPicks ? [["Wrong item shown", -wrongPicks]] : []),
        ];
        const total = Math.max(0, lines.reduce((s, l) => s + l[1], 0));
        if (!(c.id in save.found)) {
          save.found[c.id] = save.turn % save.teams.length;
          t.score += total; t.hints += hints;
          t.passes += passed ? 1 : 0; t.fails += passed ? 0 : 1;
          if (t.fastest === null || timeUsed < t.fastest) t.fastest = timeUsed;
          nextTurn();
        }
        confetti();
        frame(`
          <div class="speech">${c.thanks}</div>
          <div class="tally">
            ${lines.map(([l, v]) => `<div><span>${l}</span><b>${v > 0 ? "+" : ""}${v}</b></div>`).join("")}
            <div class="sum"><span>${esc(t.name)} scores</span><b>+${total}</b></div>
          </div>
          <p class="small muted center">Found in ${fmt(timeUsed)}. ${c.name}'s gossip is now unlocked.</p>
          <button class="btn primary block" id="toCourt">⚖️ ${c.name} calls the Creature Court</button>`);
        app.querySelector("#toCourt").onclick = () => go("court", { by: c.id, then: "home" });
      }
      const next = app.querySelector("[data-next]");
      if (next) next.onclick = () => { step++; render(); };
    };
    render();
  }

  // ---------- Creature Court ----------
  function courtScreen({ by, then = "home" }) {
    let pool = COURT.filter((k) => k.spice <= save.spice && !save.courtUsed.includes(COURT.indexOf(k)));
    if (!pool.length) { save.courtUsed = []; pool = COURT.filter((k) => k.spice <= save.spice); }
    const mine = pool.filter((k) => k.by === by);
    const card = pick(mine.length && Math.random() < 0.6 ? mine : pool);
    save.courtUsed.push(COURT.indexOf(card));
    if (card.type === "rule" && card.text.startsWith("New rule")) save.rule = card.text;
    persist();
    const c = byId[card.by];
    const kind = { vote: "🗳️ The Vote", never: "🙊 Never Have I Ever", rule: "📜 Court Order" }[card.type];
    const left = lost().length;
    app.innerHTML = `
      <div style="${vars(c)}">
        <section class="court">
          <small>⚖️ Creature Court is in session</small>
          <div class="art">${CREATURE_SVG[c.id]}</div>
          <h2>${c.name} presiding</h2>
          <span class="kind-chip">${kind}</span>
          <p class="big">${esc(sipText(card.text))}</p>
          ${save.sips ? `<p class="small muted">Not drinking? Swap any sip for a forfeit: ${pick(FORFEITS)}</p>` : ""}
        </section>
        <button class="btn primary block big-btn" id="done">${left ? `Next up: ${esc(team().name)} →` : "🏁 Last call!"}</button>
        <button class="btn block" id="another">🔁 Another card</button>
      </div>`;
    app.querySelector("#done").onclick = () => go(left ? then : "final");
    app.querySelector("#another").onclick = () => courtScreen({ then });
  }

  // ---------- Final ----------
  function finalScreen() {
    const ranked = save.teams.map((t, i) => ({ ...t, i })).sort((a, b) => b.score - a.score);
    const winner = ranked[0];
    const best = (fn, dir = 1) => [...ranked].sort((a, b) => dir * (fn(b) - fn(a)))[0];
    const fastestTeam = ranked.filter((t) => t.fastest !== null).sort((a, b) => a.fastest - b.fastest)[0];
    const awards = [
      ["👑", "Pip's Most Iconic", winner.name, "Top of the leaderboard. Pose for a photo."],
      ["🎤", "Ember's Encore Award", best((t) => t.passes).name, "Most challenges nailed."],
      ["🍷", "Lirien's Refined Palate", best((t) => -t.hints).name, "Fewest clues needed. Insufferable, frankly."],
      ...(fastestTeam ? [["💪", "Thistle's Personal Best", fastestTeam.name, `Fastest find: ${fmt(fastestTeam.fastest)}.`]] : []),
      ["🫗", "Bramble's Grudge Award", ranked[ranked.length - 1].name, "Last place. Hold it against everyone until the next party."],
    ];
    const tie = ranked.length > 1 && ranked[1].score === winner.score;
    confetti(["👑", "🥂", "🏆", "✨"]);
    app.innerHTML = `
      <section class="welcome final">
        <div class="big-emoji">🏆</div>
        <h1>${tie ? "It's a tie!" : `${esc(winner.name)} win!`}</h1>
        <p>${tie ? "Settle it with a gnome freeze: last team to move loses." : "Every creature thanks you. Some of them are crying. Ember is singing about it."}</p>
      </section>
      <div class="podium">${ranked.map((t, n) => `
        <div class="place"><span class="pos">${["🥇", "🥈", "🥉"][n] || n + 1}</span><span class="tname">${esc(t.name)}</span><b>${t.score}</b></div>`).join("")}</div>
      <div class="card">
        <h2 class="section-title">🎖️ The Awards</h2>
        ${awards.map(([ico, title, who, why]) => `
          <div class="award"><span class="ico">${ico}</span><div><b>${title}</b><br>${esc(who)}<br><span class="small muted">${why}</span></div></div>`).join("")}
      </div>
      <div class="row">
        <button class="btn primary" id="again">🔄 Rematch</button>
        <button class="btn" data-go="creatures">🤫 Read the gossip</button>
      </div>`;
    app.querySelector("#again").onclick = () => { save.started = false; save.found = {}; save.spots = {}; save.rule = null; persist(); go("setup"); };
  }

  // ---------- Wiring ----------
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-go]");
    if (g) go(g.dataset.go === "host" && !save.started ? "setup" : g.dataset.go);
  });

  go("home");
})();
