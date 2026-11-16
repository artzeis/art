// Hello World Tour — screens, trip flow, map, passport.
(() => {
  const KEY = "helloWorldTour.v1";
  const view = () => document.getElementById("view");
  const byId = Object.fromEntries(COUNTRIES.map((c) => [c.id, c]));
  const CONT_KEYS = Object.keys(CONTINENTS);
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const LEVELS = {
    easy: { name: "Little Explorer", blurb: "5 stops · 2 choices · hints", stops: 5, choices: 2, timer: 0, hints: true,
      types: ["flag", "continent", "greet", "fact"] },
    mid: { name: "Traveler", blurb: "6 stops · 3 choices · capitals", stops: 6, choices: 3, timer: 0, hints: false,
      types: ["flag", "continent", "greet", "fact", "capital"] },
    pro: { name: "Globetrotter", blurb: "8 stops · 4 choices · 20 s timer", stops: 8, choices: 4, timer: 20, hints: false,
      types: ["flag", "pickflag", "continent", "greet", "fact", "capital"] },
  };

  // ---------- Saved progress (this device only) ----------
  const fresh = () => ({ level: "easy", sound: true, speak: false, name: "", stamps: {}, missed: {}, trips: 0, answered: 0, right: 0, best: 0 });
  let save = fresh();
  try { save = { ...fresh(), ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch (_) {}
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (_) {} updateBar(); };

  let trip = null;      // active trip
  let cycleTimer = 0;   // home greeting rotation
  let qTimer = 0;       // question countdown

  // ---------- Helpers ----------
  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((p) => p[1]);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const stampCount = () => Object.keys(save.stamps).length;
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); } catch (_) { return iso; } };

  // ---------- Sound and speech ----------
  let actx = null;
  function tone(freqs, dur = 0.12, type = "triangle") {
    if (!save.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      let t = actx.currentTime;
      freqs.forEach((f) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur + 0.02);
        t += dur * 0.8;
      });
    } catch (_) {}
  }
  const sfx = {
    right: () => tone([523, 659, 784]),
    wrong: () => tone([330, 262], 0.16, "sine"),
    stamp: () => tone([110, 80], 0.09, "square"),
    tap: () => tone([880], 0.05, "sine"),
  };
  function speak(text, lang = "en-US") {
    try {
      if (!window.speechSynthesis) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const base = lang.split("-")[0];
      const voices = speechSynthesis.getVoices();
      const v = voices.find((x) => x.lang === lang) || voices.find((x) => x.lang.split(/[-_]/)[0] === base);
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "en-US"; }
      u.rate = 0.9;
      speechSynthesis.speak(u);
    } catch (_) {}
  }
  const hush = () => { try { speechSynthesis.cancel(); } catch (_) {} };

  // ---------- Flags ----------
  function starPoints(cx, cy, r) {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 ? r * 0.382 : r, a = -Math.PI / 2 + (i * Math.PI) / 5;
      pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`);
    }
    return pts.join(" ");
  }
  function flag(id, label) {
    const f = FLAGS[id], w = f.square ? 20 : 30;
    let s = "";
    if (f.v) f.v.forEach((col, i) => { s += `<rect x="${i * 10}" width="10.05" height="20" fill="${col}"/>`; });
    if (f.h) { const hh = 20 / f.h.length; f.h.forEach((col, i) => { s += `<rect y="${(i * hh).toFixed(2)}" width="30" height="${(hh + 0.05).toFixed(2)}" fill="${col}"/>`; }); }
    if (f.svg) s += f.svg;
    if (f.chakra) {
      s += `<circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" stroke-width="0.45"/>`;
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 12;
        s += `<line x1="${(15 + 2.6 * Math.cos(a)).toFixed(2)}" y1="${(10 + 2.6 * Math.sin(a)).toFixed(2)}" x2="${(15 - 2.6 * Math.cos(a)).toFixed(2)}" y2="${(10 - 2.6 * Math.sin(a)).toFixed(2)}" stroke="#000080" stroke-width="0.22"/>`;
      }
    }
    (f.stars || (f.star ? [f.star] : [])).forEach(([x, y, r, col]) => { s += `<polygon points="${starPoints(x, y, r)}" fill="${col}"/>`; });
    if (f.starLine) {
      const [x, y, r, col] = f.starLine, p = [];
      for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5; p.push(`${(x + r * Math.cos(a)).toFixed(2)},${(y + r * Math.sin(a)).toFixed(2)}`); }
      s += `<polygon points="${p.join(" ")}" fill="none" stroke="${col}" stroke-width="0.9" stroke-linejoin="miter"/>`;
    }
    const name = label === undefined ? `Flag of ${byId[id].name}` : label;
    return `<svg class="flag${f.square ? " square" : ""}" viewBox="0 0 ${w} 20" role="img" aria-label="${esc(name)}"><g>${s}</g></svg>`;
  }

  // ---------- Map ----------
  const px = (lon) => +(lon + 180).toFixed(2);
  const py = (lat) => +(84 - lat).toFixed(2);
  const pathOf = (pts) => "M" + pts.map(([lo, la]) => `${px(lo)},${py(la)}`).join("L") + "Z";
  const LAND_PATHS = LAND.map((l) => ({ c: l.c, d: pathOf(l.p) }));
  const WATER_PATHS = WATER.map(pathOf);
  const arc = (a, b) => {
    const x1 = px(a.lon), y1 = py(a.lat), x2 = px(b.lon), y2 = py(b.lat);
    const dist = Math.hypot(x2 - x1, y2 - y1);
    return `M${x1},${y1} Q${((x1 + x2) / 2).toFixed(1)},${(Math.min(y1, y2) - dist * 0.32).toFixed(1)} ${x2},${y2}`;
  };
  // opts: focus (continent key to light up), clickable (continents are buttons), pins (array of ids),
  // pinMode ("stamp" shows collected), hot (id to emphasise), route (array of ids), cls
  function worldMap(opts = {}) {
    const lands = LAND_PATHS.map((l) => {
      const on = opts.focus && opts.focus === l.c, dim = opts.focus && opts.focus !== l.c;
      return `<path d="${l.d}" class="land c-${l.c}${on ? " on" : ""}${dim ? " dim" : ""}" data-cont="${l.c}"/>`;
    }).join("");
    const water = WATER_PATHS.map((d) => `<path d="${d}" class="lake"/>`).join("");
    let route = "";
    if (opts.route && opts.route.length > 1) {
      route = opts.route.slice(1).map((id, i) => {
        const a = byId[opts.route[i]], b = byId[id];
        return `<path d="${arc(a, b)}" class="route" pathLength="1" style="--i:${i}"/>`;
      }).join("");
    }
    const pins = (opts.pins || []).map((id, i) => {
      const c = byId[id], got = save.stamps[id], hot = opts.hot === id;
      const r = hot ? 3.4 : 2.2;
      const attrs = opts.pinButtons ? `tabindex="0" role="button" aria-label="${esc(c.name)}" data-country="${id}"` : `aria-hidden="true"`;
      return `<g class="pin${got && opts.pinMode === "stamp" ? " got" : ""}${hot ? " hot" : ""} p-${c.cont}" ${attrs} style="--i:${i}">
        <circle cx="${px(c.lon)}" cy="${py(c.lat)}" r="${r + 3}" class="pin-hit"/>
        <circle cx="${px(c.lon)}" cy="${py(c.lat)}" r="${r}" class="pin-dot"/>
        ${opts.labels ? `<text x="${px(c.lon)}" y="${py(c.lat) - r - 1.6}" class="pin-label">${c.air}</text>` : ""}
      </g>`;
    }).join("");
    return `<svg class="map ${opts.cls || ""}${opts.clickable ? " clickable" : ""}" viewBox="0 0 360 162" role="img" aria-label="${esc(opts.label || "World map")}">
      <rect width="360" height="162" class="sea"/>
      <g class="grid">${[-60, -30, 0, 30, 60].map((la) => `<line x1="0" x2="360" y1="${py(la)}" y2="${py(la)}"/>`).join("")}
        ${[-120, -60, 0, 60, 120].map((lo) => `<line y1="0" y2="162" x1="${px(lo)}" x2="${px(lo)}"/>`).join("")}</g>
      <line class="equator" x1="0" x2="360" y1="${py(0)}" y2="${py(0)}"/>
      ${lands}${water}${route}${pins}
    </svg>`;
  }

  // ---------- Shell ----------
  function shell() {
    document.getElementById("app").innerHTML = `
      <header class="bar">
        <div class="bar-in">
          <a class="brand" href="#home" aria-label="Hello World Tour, home">
            <span class="brand-mark" aria-hidden="true"></span><span>Hello World Tour</span>
          </a>
          <nav class="nav" aria-label="Main">
            <a href="#home" data-nav="home">Fly</a>
            <a href="#map" data-nav="map">Map</a>
            <a href="#passport" data-nav="passport">Passport <b id="stampCount" class="count"></b></a>
          </nav>
          <div class="toggles">
            <button id="tSound" class="tog" aria-pressed="false" title="Sound effects"><span aria-hidden="true">♪</span><span class="tog-l">Sound</span></button>
            <button id="tSpeak" class="tog" aria-pressed="false" title="Read questions aloud"><span aria-hidden="true">🔊</span><span class="tog-l">Read aloud</span></button>
          </div>
        </div>
      </header>
      <main id="view" tabindex="-1"></main>
      <dialog id="card" class="card-dialog" aria-label="Country postcard"><div id="cardBody"></div></dialog>`;
    document.getElementById("tSound").onclick = () => { save.sound = !save.sound; persist(); sfx.tap(); };
    document.getElementById("tSpeak").onclick = () => { save.speak = !save.speak; persist(); if (!save.speak) hush(); };
    const dlg = document.getElementById("card");
    dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
    dlg.addEventListener("close", hush);
    updateBar();
  }
  function updateBar() {
    const sc = document.getElementById("stampCount");
    if (!sc) return;
    sc.textContent = `${stampCount()}/${COUNTRIES.length}`;
    document.getElementById("tSound").setAttribute("aria-pressed", save.sound);
    document.getElementById("tSpeak").setAttribute("aria-pressed", save.speak);
  }

  // ---------- Router ----------
  const ROUTES = { home: renderHome, map: renderMap, passport: renderPassport, trip: renderTrip };
  function route() {
    clearInterval(cycleTimer); clearInterval(qTimer); hush();
    let name = (location.hash || "#home").slice(1);
    if (!ROUTES[name] || (name === "trip" && !trip)) name = "home";
    document.querySelectorAll("[data-nav]").forEach((a) => a.toggleAttribute("aria-current", a.dataset.nav === (name === "trip" ? "home" : name)));
    ROUTES[name]();
    window.scrollTo(0, 0);
  }
  function go(name) { if (location.hash === "#" + name) route(); else location.hash = name; }

  // ---------- Home ----------
  function renderHome() {
    const greets = [{ word: "Hello", tongue: "English", lang: "en-US" }, ...COUNTRIES.filter((c) => c.gq !== false).map((c) => c.hello)];
    const lv = LEVELS[save.level];
    view().innerHTML = `
      <section class="hero">
        <div class="hero-copy">
          <p class="kicker">Say hello in <span id="gTongue">English</span></p>
          <h1 class="hello" aria-live="off"><span id="gWord">Hello</span><span class="comma">,</span><br/>world!</h1>
          <p class="lede">Fly to real countries, answer one question at each stop, and collect a passport stamp for every place you get right. Every answer comes with a postcard to learn from.</p>
          <fieldset class="levels">
            <legend>Choose your level</legend>
            ${Object.entries(LEVELS).map(([k, l]) => `
              <label class="level">
                <input type="radio" name="level" id="lv-${k}" value="${k}" ${save.level === k ? "checked" : ""}/>
                <span class="level-name">${l.name}</span><span class="level-blurb">${l.blurb}</span>
              </label>`).join("")}
          </fieldset>
          <div class="cta-row">
            ${trip ? `<a class="btn primary big" href="#trip">Continue trip · stop ${trip.i + 1} of ${trip.stops.length}</a>` : ""}
            <button class="btn ${trip ? "ghost" : "primary big"}" id="startBtn">${trip ? "Start a new trip" : "Start a trip"} <span aria-hidden="true">✈</span></button>
            <a class="btn ghost" href="#map">Explore the map</a>
          </div>
        </div>
        <div class="ticket" aria-hidden="true">
          <div class="ticket-main">
            <div class="t-row"><span class="t-lab">Passenger</span><span class="t-val">${esc(save.name || "World Traveler")}</span></div>
            <div class="t-route"><span class="code">HOME</span><span class="plane">✈</span><span class="code">???</span></div>
            <div class="t-row t-grid">
              <div><span class="t-lab">Flight</span><span class="t-val mono">HW ${String(save.trips + 1).padStart(3, "0")}</span></div>
              <div><span class="t-lab">Stops</span><span class="t-val mono" id="tStops">${lv.stops}</span></div>
              <div><span class="t-lab">Class</span><span class="t-val" id="tClass">${lv.name}</span></div>
            </div>
          </div>
          <div class="ticket-stub">
            <span class="t-lab">Stamps</span><span class="stub-num mono">${stampCount()}</span><span class="t-lab">of ${COUNTRIES.length}</span>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <h2>Where you've been</h2>
          <p class="muted">${stampCount() ? `Filled dots are countries in your passport. ${COUNTRIES.length - stampCount()} still to collect.` : `${COUNTRIES.length} countries on 6 continents are waiting. Your stamps will show up here.`}</p>
        </div>
        ${worldMap({ pins: COUNTRIES.map((c) => c.id), pinMode: "stamp", label: "World map showing the countries in the game" })}
      </section>

      <section class="panel how">
        <h2>How a trip works</h2>
        <ol class="steps">
          <li><b>Pick a level.</b> Little Explorer suits young kids and first-timers. Globetrotter adds flag matching and a timer.</li>
          <li><b>Answer at each stop.</b> Guess the flag, the continent, where people say a greeting, or which country a fact is about.</li>
          <li><b>Read the postcard.</b> Right or wrong, you see the country's flag, capital, a word to say, an animal and a fun fact.</li>
          <li><b>Collect stamps.</b> Get it right and the country is stamped in your passport. Missed ones come back on later trips.</li>
        </ol>
      </section>`;
    // Greeting rotation: the hero line cycles through every greeting in the game.
    let gi = 0;
    const w = document.getElementById("gWord"), t = document.getElementById("gTongue");
    cycleTimer = setInterval(() => {
      gi = (gi + 1) % greets.length;
      w.classList.remove("swap"); void w.offsetWidth; w.classList.add("swap");
      w.textContent = greets[gi].word; t.textContent = greets[gi].tongue;
    }, 2200);
    document.querySelectorAll('input[name="level"]').forEach((r) => r.onchange = () => {
      save.level = r.value; persist(); sfx.tap();
      document.getElementById("tStops").textContent = LEVELS[r.value].stops;
      document.getElementById("tClass").textContent = LEVELS[r.value].name;
    });
    document.getElementById("startBtn").onclick = startTrip;
  }

  // ---------- Trip ----------
  function startTrip() {
    const lv = LEVELS[save.level];
    // Weighted pick: missed countries and ones not yet stamped come up more often.
    const pool = COUNTRIES.map((c) => ({ c, w: 1 + (save.stamps[c.id] ? 0 : 2) + 3 * (save.missed[c.id] || 0) }));
    const chosen = [];
    while (chosen.length < lv.stops && pool.length) {
      const total = pool.reduce((s, p) => s + p.w, 0);
      let r = Math.random() * total, i = 0;
      while ((r -= pool[i].w) > 0) i++;
      chosen.push(pool.splice(i, 1)[0].c);
    }
    let last = "";
    const stops = chosen.map((c) => {
      let types = lv.types.filter((t) => t !== last && (t !== "greet" || c.gq !== false));
      const type = pick(types); last = type;
      return makeQ(c, type, lv);
    });
    trip = { stops, i: 0, streak: 0, best: 0, results: [], answered: false, level: save.level };
    sfx.tap();
    go("trip");
  }

  function makeQ(c, type, lv) {
    const n = lv.choices;
    if (type === "continent") {
      const others = shuffle(CONT_KEYS.filter((k) => k !== "an" && k !== c.cont)).slice(0, n - 1);
      return { type, c, answer: c.cont, options: shuffle([c.cont, ...others]), prompt: `Which continent is ${c.name} in?` };
    }
    let pool = shuffle(COUNTRIES.filter((o) => o.id !== c.id));
    if (type === "greet") pool = pool.filter((o) => o.hello.word !== c.hello.word);
    if (lv.hints) pool.sort((a, b) => (a.cont === c.cont) - (b.cont === c.cont)); // easy: different continents
    const options = shuffle([c.id, ...pool.slice(0, n - 1).map((o) => o.id)]);
    const prompts = {
      flag: "Which country has this flag?",
      pickflag: `Find the flag of ${c.name}.`,
      greet: `Someone says “${c.hello.word}!” to you. Which country could you be in?`,
      fact: c.q,
      capital: `${c.capital} is the capital city of which country?`,
    };
    return { type, c, answer: c.id, options, prompt: prompts[type] };
  }

  function renderTrip() {
    if (trip.results.length > trip.i) trip.i++;   // came back after answering this stop: move on
    if (trip.i >= trip.stops.length) { finishTrip(); return; }
    const q = trip.stops[trip.i], lv = LEVELS[trip.level];
    const prev = trip.i ? trip.stops[trip.i - 1].c.air : "HOME";
    trip.answered = false;
    let visual = "";
    if (q.type === "flag") visual = `<div class="q-flag">${flag(q.c.id, "Mystery flag")}</div>`;
    if (q.type === "greet") visual = `<div class="bubble"><span class="bubble-word">“${esc(q.c.hello.word)}!”</span>${q.c.hello.script ? `<span class="bubble-script" lang="${q.c.hello.lang}">${esc(q.c.hello.script)}</span>` : ""}
      <button class="btn small" id="hearGreet">Hear it <span aria-hidden="true">🔊</span></button></div>`;
    if (q.type === "capital") visual = `<div class="sign"><span class="sign-lab">Capital city</span><span class="sign-name">${esc(q.c.capital)}</span></div>`;
    if (q.type === "pickflag") visual = `<div class="sign"><span class="sign-lab">Destination</span><span class="sign-name">${esc(q.c.name)}</span></div>`;
    if (q.type === "continent") visual = `<p class="muted center">Tap the continent on the map, or pick a button below.</p>${worldMap({ clickable: true, cls: "quiz-map", label: "World map. Each continent can be tapped." })}`;

    let choices;
    if (q.type === "continent") {
      choices = q.options.map((k) => `<button class="choice cont-choice" data-val="${k}"><span class="swatch c-${k}" aria-hidden="true"></span>${CONTINENTS[k].name}</button>`).join("");
    } else if (q.type === "pickflag") {
      choices = q.options.map((id, i) => `<button class="choice flag-choice" data-val="${id}" aria-label="Flag ${"ABCD"[i]}">${flag(id, "")}</button>`).join("");
    } else {
      const showFlags = q.type !== "flag";
      choices = q.options.map((id) => `<button class="choice" data-val="${id}">${showFlags ? flag(id, "") : ""}<span>${esc(byId[id].name)}</span></button>`).join("");
    }

    view().innerHTML = `
      <section class="trip">
        <div class="pass" aria-label="Boarding pass">
          <div class="pass-cell"><span class="t-lab">Flight</span><span class="t-val mono">HW ${String(save.trips + 1).padStart(3, "0")}</span></div>
          <div class="pass-route"><span class="code">${prev}</span><span class="plane" aria-hidden="true">✈</span><span class="code" id="toCode" aria-label="Destination hidden">???</span></div>
          <div class="pass-cell"><span class="t-lab">Stop</span><span class="t-val mono">${trip.i + 1} of ${trip.stops.length}</span></div>
          <ol class="hops" aria-hidden="true">${trip.stops.map((s, i) => `<li class="${i < trip.i ? (trip.results[i].correct ? "ok" : "miss") : i === trip.i ? "now" : ""}"></li>`).join("")}</ol>
        </div>
        ${lv.timer ? `<div class="timer" aria-hidden="true"><span id="timerFill"></span></div>` : ""}
        <div class="qcard">
          <h1 class="prompt" id="prompt" tabindex="-1">${esc(q.prompt)}</h1>
          ${visual}
          <div class="choices n${q.options.length}${q.type === "pickflag" ? " flags" : ""}" role="group" aria-label="Answers">${choices}</div>
          <div class="q-foot">
            ${lv.hints && q.type !== "continent" ? `<button class="btn ghost small" id="hintBtn">Show a hint</button>` : ""}
            <button class="btn ghost small" id="readBtn">Read it to me <span aria-hidden="true">🔊</span></button>
            ${lv.timer ? `<span class="muted mono" id="timerText" aria-live="off">${lv.timer}s</span>` : ""}
          </div>
          <p class="hint" id="hint" hidden></p>
        </div>
        <div id="feedback" aria-live="polite"></div>
      </section>`;

    document.getElementById("prompt").focus({ preventScroll: true });
    view().querySelectorAll(".choice").forEach((b) => b.onclick = () => answer(b.dataset.val));
    if (q.type === "continent") view().querySelectorAll(".quiz-map .land").forEach((p) => p.addEventListener("click", () => answer(p.dataset.cont)));
    const hg = document.getElementById("hearGreet");
    if (hg) hg.onclick = () => speak(q.c.hello.word, q.c.hello.lang);
    document.getElementById("readBtn").onclick = () => readQuestion(q);
    const hb = document.getElementById("hintBtn");
    if (hb) hb.onclick = () => {
      const h = document.getElementById("hint"); h.hidden = false; hb.disabled = true;
      h.textContent = q.type === "fact" || q.type === "greet" || q.type === "flag"
        ? `Hint: this country is in ${CONTINENTS[q.c.cont].name}.` : `Hint: its capital is ${q.c.capital}.`;
    };
    if (save.speak) readQuestion(q);
    if (lv.timer) {
      const end = Date.now() + lv.timer * 1000, fill = document.getElementById("timerFill"), txt = document.getElementById("timerText");
      qTimer = setInterval(() => {
        const left = Math.max(0, end - Date.now());
        fill.style.transform = `scaleX(${left / (lv.timer * 1000)})`;
        txt.textContent = Math.ceil(left / 1000) + "s";
        if (!left) { clearInterval(qTimer); answer(null); }
      }, 100);
    }
  }

  function readQuestion(q) {
    let text = q.prompt;
    if (q.type === "continent") text += " " + q.options.map((k) => CONTINENTS[k].name).join(", or ") + "?";
    else if (q.type !== "pickflag") text += " " + q.options.map((id) => byId[id].name).join(", or ") + "?";
    speak(text);
  }

  function answer(val) {
    if (trip.answered) return;
    trip.answered = true;
    clearInterval(qTimer);
    const q = trip.stops[trip.i], ok = val === q.answer, c = q.c;
    const firstStamp = ok && !save.stamps[c.id];
    trip.results.push({ id: c.id, correct: ok, type: q.type });
    save.answered++;
    if (ok) {
      save.right++; trip.streak++; trip.best = Math.max(trip.best, trip.streak);
      if (!save.stamps[c.id]) save.stamps[c.id] = new Date().toISOString();
      save.missed[c.id] = Math.max(0, (save.missed[c.id] || 0) - 1);
      sfx.right();
    } else {
      trip.streak = 0; save.missed[c.id] = (save.missed[c.id] || 0) + 1;
      sfx.wrong();
    }
    save.best = Math.max(save.best, trip.best);
    persist();

    view().querySelectorAll(".choice").forEach((b) => {
      b.disabled = true;
      if (b.dataset.val === q.answer) { b.classList.add("is-right"); b.insertAdjacentHTML("beforeend", `<span class="mark">✓ Right answer</span>`); }
      else if (b.dataset.val === val) { b.classList.add("is-wrong"); b.insertAdjacentHTML("beforeend", `<span class="mark">✗ Your pick</span>`); }
    });
    view().querySelectorAll(".quiz-map").forEach((m) => m.classList.remove("clickable"));
    document.getElementById("toCode").textContent = c.air;
    document.getElementById("toCode").removeAttribute("aria-label");
    const hb = document.getElementById("hintBtn"); if (hb) hb.disabled = true;

    const answerText = q.type === "continent" ? `${c.name} is in ${CONTINENTS[c.cont].name}.` : `It's ${c.name}.`;
    const head = val === null ? `Time's up! ${answerText}` : ok ? `Correct! ${answerText}` : `Not quite. ${answerText}`;
    const last = trip.i === trip.stops.length - 1;
    const fb = document.getElementById("feedback");
    fb.innerHTML = `
      <div class="verdict ${ok ? "good" : "miss"}"><span class="verdict-icon" aria-hidden="true">${ok ? "✓" : "↻"}</span>
        <div><b>${esc(head)}</b><span>${ok ? (firstStamp ? "New stamp for your passport!" : "Already in your passport. Nice remembering!") : "Read the postcard. This country will come back on a later trip."}</span></div></div>
      ${postcard(c, { stamp: ok, fresh: firstStamp, from: trip.i ? trip.stops[trip.i - 1].c : null })}
      <div class="next-row"><button class="btn primary big" id="nextBtn">${last ? "Finish trip" : "Fly to the next stop"} <span aria-hidden="true">✈</span></button></div>`;
    if (firstStamp) setTimeout(sfx.stamp, 380);
    bindPostcard(fb);
    document.getElementById("nextBtn").onclick = () => {
      sfx.tap();
      if (last) finishTrip(); else { trip.i++; renderTrip(); window.scrollTo(0, 0); }
    };
    fb.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
    if (save.speak) speak(`${head} ${c.fact}`);
  }

  // ---------- Postcard (shared by trip, map and passport) ----------
  function postcard(c, o = {}) {
    const h = c.hello, got = save.stamps[c.id];
    return `
      <article class="postcard p-${c.cont}">
        <div class="pc-left">
          <div class="pc-head">
            ${flag(c.id)}
            <div><h2 class="pc-name">${esc(c.name)}</h2>
              <p class="pc-sub">Capital: <b>${esc(c.capital)}</b> · ${CONTINENTS[c.cont].name} · Airport <span class="mono">${c.air}</span></p></div>
          </div>
          <div class="pc-say">
            <span class="t-lab">Say hello in ${esc(h.tongue)}</span>
            <div class="pc-word"><span>${esc(h.word)}</span>${h.script ? `<span class="pc-script" lang="${h.lang}">${esc(h.script)}</span>` : ""}
              <button class="btn small" data-say="${c.id}">Hear it <span aria-hidden="true">🔊</span></button></div>
            ${h.means ? `<span class="muted">It means “${esc(h.means)}”</span>` : ""}
          </div>
          <ul class="pc-list">
            <li><span class="pc-emoji" aria-hidden="true">${c.animal[0]}</span><span><span class="t-lab">Animal</span>${esc(c.animal[1])}</span></li>
            <li><span class="pc-emoji" aria-hidden="true">${c.thing[0]}</span><span><span class="t-lab">Famous for</span>${esc(c.thing[1])}</span></li>
          </ul>
          <p class="pc-fact"><span class="t-lab">Did you know?</span>${esc(c.fact)}</p>
        </div>
        <div class="pc-right">
          ${worldMap({ focus: c.cont, pins: o.from ? [o.from.id, c.id] : [c.id], hot: c.id, route: o.from ? [o.from.id, c.id] : null, cls: "pc-map", label: `Map showing ${c.name} in ${CONTINENTS[c.cont].name}` })}
          ${o.stamp || got ? stampHTML(c, got, o.fresh) : ""}
        </div>
      </article>`;
  }
  function stampHTML(c, iso, isNew) {
    const tilt = ((c.id.charCodeAt(0) * 7 + c.id.charCodeAt(1)) % 13) - 6;
    return `<div class="stamp p-${c.cont}${isNew ? " thunk" : ""}" style="--tilt:${tilt}deg" aria-label="Passport stamp for ${esc(c.name)}">
      <span class="st-top">${esc(c.name)}</span><span class="st-code">${c.air}</span><span class="st-date">${iso ? fmtDate(iso) : ""}</span></div>`;
  }
  function bindPostcard(root) {
    root.querySelectorAll("[data-say]").forEach((b) => b.onclick = () => { const h = byId[b.dataset.say].hello; speak(h.word, h.lang); });
  }
  function openCard(id) {
    const dlg = document.getElementById("card"), body = document.getElementById("cardBody");
    body.innerHTML = `<button class="close" data-close aria-label="Close postcard">×</button>${postcard(byId[id], {})}`;
    bindPostcard(body);
    dlg.showModal();
    if (save.speak) speak(`${byId[id].name}. ${byId[id].fact}`);
  }

  // ---------- Trip end ----------
  function finishTrip() {
    save.trips++; persist();
    const res = trip.results, right = res.filter((r) => r.correct).length;
    const ids = trip.stops.map((s) => s.c.id);
    const missed = res.filter((r) => !r.correct).map((r) => byId[r.id]);
    const stamped = res.filter((r) => r.correct).map((r) => byId[r.id]);
    const line = right === res.length ? "A perfect trip!" : right >= res.length / 2 ? "Great flying!" : "Every trip teaches you something new.";
    view().innerHTML = `
      <section class="finish">
        <p class="kicker">Flight HW ${String(save.trips).padStart(3, "0")} has landed</p>
        <h1>${line}</h1>
        <p class="lede">You got <b>${right} of ${res.length}</b> right${trip.best > 1 ? `, with a best streak of <b>${trip.best}</b> in a row` : ""}. Your passport now has <b>${stampCount()} of ${COUNTRIES.length}</b> stamps.</p>
        <div class="panel">
          <h2>Your route</h2>
          ${worldMap({ route: ids, pins: ids, labels: true, cls: "route-map", label: "Map of your flight route: " + trip.stops.map((s) => s.c.name).join(", then ") })}
          <p class="muted">${missed.length ? "Countries marked Try again will come up more often on your next trips. " : ""}Tap a country to read its postcard again.</p>
          <ol class="route-list">${trip.stops.map((s, i) => `<li class="${res[i].correct ? "ok" : "miss"}"><button class="linkish" data-open="${s.c.id}">${flag(s.c.id, "")}<span>${esc(s.c.name)}</span><span class="mono muted">${s.c.air}</span><span class="tag">${res[i].correct ? "Stamped" : "Try again"}</span></button></li>`).join("")}</ol>
        </div>
        ${stamped.length ? `<div class="panel"><h2>Stamps from this trip</h2><div class="stamp-row">${stamped.map((c) => stampHTML(c, save.stamps[c.id], false)).join("")}</div></div>` : ""}
        <div class="cta-row">
          <button class="btn primary big" id="againBtn">Fly again <span aria-hidden="true">✈</span></button>
          <a class="btn ghost" href="#passport">Open my passport</a>
        </div>
      </section>`;
    trip = null;
    history.replaceState(null, "", "#home");
    document.querySelectorAll("[data-nav]").forEach((a) => a.toggleAttribute("aria-current", a.dataset.nav === "home"));
    view().querySelectorAll("[data-open]").forEach((b) => b.onclick = () => openCard(b.dataset.open));
    document.getElementById("againBtn").onclick = startTrip;
    window.scrollTo(0, 0);
  }

  // ---------- Explore map ----------
  let mapFilter = "all";
  function renderMap() {
    const list = COUNTRIES.filter((c) => mapFilter === "all" || c.cont === mapFilter);
    const contsWithCountries = CONT_KEYS.filter((k) => k !== "an");
    view().innerHTML = `
      <section class="explore">
        <div class="panel-head">
          <p class="kicker">Explore</p>
          <h1>The world map</h1>
          <p class="lede">Tap a continent to learn about it, or a dot to open that country's postcard. Exploring is free, so look around before you fly.</p>
        </div>
        <div class="chips" role="group" aria-label="Show continent">
          <button class="chip" aria-pressed="${mapFilter === "all"}" data-f="all">Whole world</button>
          ${CONT_KEYS.map((k) => `<button class="chip" aria-pressed="${mapFilter === k}" data-f="${k}"><span class="swatch c-${k}" aria-hidden="true"></span>${CONTINENTS[k].name}</button>`).join("")}
        </div>
        <div class="panel map-panel">
          ${worldMap({ clickable: true, focus: mapFilter === "all" ? null : mapFilter, pins: list.map((c) => c.id), pinMode: "stamp", pinButtons: true, label: "Interactive world map" })}
          ${mapFilter !== "all" ? `<p class="cont-fact"><b>${CONTINENTS[mapFilter].name}.</b> ${CONTINENTS[mapFilter].fact}</p>` : ""}
        </div>
        ${list.length ? `<div class="country-grid">${list.map((c) => `
          <button class="country" data-open="${c.id}">${flag(c.id, "")}
            <span class="cn">${esc(c.name)}</span><span class="cc muted">${esc(c.capital)}</span>
            ${save.stamps[c.id] ? `<span class="tag">Stamped</span>` : ""}</button>`).join("")}</div>`
          : `<p class="muted center">No countries from ${CONTINENTS[mapFilter].name} are in the game, because nobody lives there all year. Penguins do, though!</p>`}
        <p class="muted small-print">${contsWithCountries.length} continents, ${COUNTRIES.length} countries. Map shapes are simplified.</p>
      </section>`;
    view().querySelectorAll("[data-f]").forEach((b) => b.onclick = () => { mapFilter = b.dataset.f; sfx.tap(); renderMap(); });
    view().querySelectorAll(".map .land").forEach((p) => p.addEventListener("click", () => { mapFilter = p.dataset.cont; sfx.tap(); renderMap(); }));
    view().querySelectorAll("[data-open]").forEach((b) => b.onclick = () => openCard(b.dataset.open));
    view().querySelectorAll(".pin[data-country]").forEach((g) => {
      g.addEventListener("click", (e) => { e.stopPropagation(); openCard(g.dataset.country); });
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCard(g.dataset.country); } });
    });
  }

  // ---------- Passport ----------
  function renderPassport() {
    const n = stampCount(), pct = save.answered ? Math.round((save.right / save.answered) * 100) : 0;
    view().innerHTML = `
      <section class="passport">
        <div class="cover">
          <div class="cover-in">
            <p class="cover-kicker">Passport · Hello World Tour</p>
            <label class="name-field" for="travName"><span class="t-lab">Traveler</span>
              <input id="travName" maxlength="24" placeholder="Type your name" value="${esc(save.name)}" autocomplete="off"/></label>
            <dl class="stats">
              <div><dt>Stamps</dt><dd class="mono">${n}<small>/${COUNTRIES.length}</small></dd></div>
              <div><dt>Trips</dt><dd class="mono">${save.trips}</dd></div>
              <div><dt>Right answers</dt><dd class="mono">${save.right}${save.answered ? `<small> ${pct}%</small>` : ""}</dd></div>
              <div><dt>Best streak</dt><dd class="mono">${save.best}</dd></div>
            </dl>
            <div class="meter" role="progressbar" aria-label="Passport filled" aria-valuemin="0" aria-valuemax="${COUNTRIES.length}" aria-valuenow="${n}"><span style="width:${(n / COUNTRIES.length) * 100}%"></span></div>
            ${n === COUNTRIES.length ? `<p class="cover-done">Every stamp collected. You are a true Globetrotter!</p>` : ""}
          </div>
        </div>
        ${CONT_KEYS.filter((k) => k !== "an").map((k) => {
          const cs = COUNTRIES.filter((c) => c.cont === k);
          return `<div class="page">
            <h2><span class="swatch c-${k}" aria-hidden="true"></span>${CONTINENTS[k].name} <span class="muted">${cs.filter((c) => save.stamps[c.id]).length} of ${cs.length}</span></h2>
            <div class="stamp-row">${cs.map((c) => save.stamps[c.id]
              ? `<button class="stamp-btn" data-open="${c.id}">${stampHTML(c, save.stamps[c.id], false)}</button>`
              : `<div class="stamp empty" aria-label="Empty stamp space in ${CONTINENTS[k].name}"><span class="st-code">?</span><span class="st-top">Not yet</span></div>`).join("")}</div>
          </div>`;
        }).join("")}
        <div class="reset">
          <button class="btn ghost small" id="resetBtn">Start a new passport</button>
          <div id="resetConfirm" hidden><span>This clears all stamps and scores on this device.</span>
            <button class="btn danger small" id="resetYes">Clear everything</button>
            <button class="btn ghost small" id="resetNo">Keep my stamps</button></div>
        </div>
      </section>`;
    document.getElementById("travName").oninput = (e) => { save.name = e.target.value.slice(0, 24); persist(); };
    view().querySelectorAll("[data-open]").forEach((b) => b.onclick = () => openCard(b.dataset.open));
    document.getElementById("resetBtn").onclick = () => { document.getElementById("resetConfirm").hidden = false; };
    document.getElementById("resetNo").onclick = () => { document.getElementById("resetConfirm").hidden = true; };
    document.getElementById("resetYes").onclick = () => {
      const keep = { level: save.level, sound: save.sound, speak: save.speak };
      save = { ...fresh(), ...keep }; persist(); renderPassport();
    };
  }

  // ---------- Boot ----------
  function start() {
    shell();
    window.addEventListener("hashchange", route);
    // A link to the page you're already on doesn't fire hashchange, so re-render it ourselves.
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (a && a.getAttribute("href") === (location.hash || "#home")) { e.preventDefault(); route(); }
    });
    route();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
