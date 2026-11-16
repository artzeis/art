// Wordlings — a Dreamling word game for 1 player vs the computer, or 2–4 players passing one phone.
//
// Rules in short: trace a word (3+ letters) through neighbouring letter bubbles in any direction.
// Used bubbles pop, the letters above fall, new ones float in. Special bubbles: ⭐ doubles the word,
// 🌙 triples its letter, 💎 adds 5. Long words earn bonuses. Each player has a Dreamling partner with a
// one-time Dream Power. Highest score after the last round wins.
(() => {
  const N = 6;                                // board is N × N
  const MIN_LEN = 3;
  const LEN_BONUS = (n) => (n >= 8 ? 15 : n === 7 ? 10 : n === 6 ? 6 : n === 5 ? 3 : 0);
  const VAL = { a: 1, e: 1, i: 1, o: 1, u: 2, n: 1, r: 1, t: 1, l: 1, s: 1, d: 2, g: 2, h: 3, b: 3, c: 3, m: 3, p: 3,
    f: 4, w: 4, y: 4, v: 5, k: 5, j: 7, x: 7, z: 8, qu: 8 };
  // How often each letter appears (roughly English, a few extra vowels for kids).
  const FREQ = { e: 12, a: 9, i: 8, o: 8, u: 4, t: 7, n: 6, s: 6, r: 6, h: 4, l: 4, d: 4, c: 3, m: 3, p: 2, g: 2, b: 2, f: 2,
    y: 2, w: 2, k: 1, v: 1, x: 0.5, j: 0.4, z: 0.4, qu: 0.5 };
  const VOWELS = new Set(["a", "e", "i", "o", "u"]);
  const SPECIAL_CHANCE = 0.09;

  // Each Dreamling's one-time Dream Power.
  const POWERS = {
    scribbi: { name: "Doodle", icon: "🖍️", text: "Change any letter into a letter you choose." },
    craggle: { name: "Boulder Bonus", icon: "🪨", text: "Your next word scores +10 points." },
    orbit: { name: "Spin", icon: "🌀", text: "Spin the whole board into new places." },
    tangle: { name: "Twist", icon: "🔀", text: "Swap any two letters." },
    nyxie: { name: "Moonbeam", icon: "🌙", text: "Your next word scores double." },
    glitch: { name: "Respawn", icon: "🎮", text: "Swap every letter on the board for new ones." },
    leo: { name: "Sniff", icon: "🐾", text: "Sniff out a great word and light up its path." },
  };
  const COMPUTER_LINES = {
    scribbi: ["Hee-hee!", "Squiggle-squiggle!"], craggle: ["Hmmm…", "No rush."], orbit: ["Ooooh!", "Boop-boop!"],
    tangle: ["Heh-heh!", "Psst…"], nyxie: ["Mrrrow…", "Purr…"], glitch: ["Bleep-bloop!", "Level up!"], leo: ["Awoooo!", "Sniff sniff!"],
  };

  const app = document.getElementById("wl");
  const byId = Object.fromEntries(CREATURES.map((c) => [c.id, c]));
  const img = (id) => `../assets/characters/${id}.png`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const rand = (n) => Math.floor(Math.random() * n);
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const say = (id, text) => { try { if (window.speakAs && !muted) speakAs(id, text); } catch (_) {} };
  let muted = false;
  try { muted = localStorage.getItem("wordlings.muted") === "1"; } catch (_) {}

  // ---------------------------------------------------------------- dictionary
  let VALID = null, TRIE_COMMON = null, TRIE_ALL = null;
  const newNode = () => ({ k: {}, w: false });
  function addWord(root, w) { let n = root; for (const ch of w) n = n.k[ch] || (n.k[ch] = newNode()); n.w = true; }
  async function loadDictionary() {
    const get = (f) => fetch(`dict/${f}.txt`).then((r) => r.text()).then((t) => t.split("\n").filter(Boolean));
    const [common, more, extra] = await Promise.all([get("common"), get("more"), get("extra")]);
    VALID = new Set([...common, ...more, ...extra]);
    TRIE_COMMON = newNode(); common.forEach((w) => addWord(TRIE_COMMON, w));
    TRIE_ALL = newNode(); common.forEach((w) => addWord(TRIE_ALL, w)); more.forEach((w) => addWord(TRIE_ALL, w));
  }

  // ---------------------------------------------------------------- board
  const BAG = Object.entries(FREQ);
  const BAG_TOTAL = BAG.reduce((s, [, f]) => s + f, 0);
  let uid = 0;
  function drawLetter(board) {
    const vowels = board ? board.filter((t) => t && VOWELS.has(t.l)).length : 12;
    if (vowels < 10 && Math.random() < 0.6) return ["a", "e", "i", "o", "u"][rand(5)];
    let r = Math.random() * BAG_TOTAL;
    for (const [l, f] of BAG) { r -= f; if (r <= 0) return l; }
    return "e";
  }
  function newTile(board) {
    const r = Math.random();
    const sp = r < SPECIAL_CHANCE * 0.4 ? "star" : r < SPECIAL_CHANCE * 0.75 ? "moon" : r < SPECIAL_CHANCE ? "gem" : null;
    return { id: ++uid, l: drawLetter(board), sp };
  }
  function freshBoard() {
    const b = [];
    for (let i = 0; i < N * N; i++) b.push(newTile(b));
    return b;
  }
  const rc = (i) => [Math.floor(i / N), i % N];
  const adjacent = (a, b) => { const [r1, c1] = rc(a), [r2, c2] = rc(b); return a !== b && Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1; };
  const wordOf = (board, path) => path.map((i) => board[i].l).join("");

  function scorePath(board, path, player) {
    let base = 0, mult = 1, gems = 0;
    path.forEach((i) => {
      const t = board[i];
      base += (VAL[t.l] || 1) * (t.sp === "moon" ? 3 : 1);
      if (t.sp === "star") mult *= 2;
      if (t.sp === "gem") gems += 5;
    });
    const letters = wordOf(board, path).length;
    let pts = (base + gems) * mult + LEN_BONUS(letters);
    if (player) pts = pts * (player.multNext || 1) + (player.bonusNext || 0);
    return pts;
  }

  // Every word on the board that's in `trie` (best-scoring path for each word).
  function solve(board, trie, maxLen = 9) {
    const found = new Map();
    const walk = (i, node, path, used) => {
      let n = node;
      for (const ch of board[i].l) { n = n && n.k[ch]; }
      if (!n) return;
      path.push(i); used[i] = true;
      const w = wordOf(board, path);
      if (n.w && w.length >= MIN_LEN && VALID.has(w)) {
        const pts = scorePath(board, path);
        const prev = found.get(w);
        if (!prev || pts > prev.pts) found.set(w, { word: w, path: path.slice(), pts });
      }
      if (path.length < maxLen) {
        const [r, c] = rc(i);
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          const rr = r + dr, cc = c + dc;
          if ((dr || dc) && rr >= 0 && rr < N && cc >= 0 && cc < N && !used[rr * N + cc]) walk(rr * N + cc, n, path, used);
        }
      }
      path.pop(); used[i] = false;
    };
    for (let i = 0; i < N * N; i++) walk(i, trie, [], []);
    return [...found.values()].sort((a, b) => b.pts - a.pts);
  }

  // ---------------------------------------------------------------- setup
  const DEFAULTS = { mode: "cpu", you: "scribbi", cpu: "leo", level: "medium", rounds: 8, players: [
    { name: "Player 1", cid: "scribbi" }, { name: "Player 2", cid: "orbit" }, { name: "Player 3", cid: "nyxie" }, { name: "Player 4", cid: "glitch" }], count: 2, yourName: "You" };
  let setup = DEFAULTS;
  try { setup = { ...DEFAULTS, ...JSON.parse(localStorage.getItem("wordlings.setup") || "{}") }; } catch (_) {}
  const saveSetup = () => { try { localStorage.setItem("wordlings.setup", JSON.stringify(setup)); } catch (_) {} };

  function picks(selected, attr) {
    return `<div class="wl-picks">${CREATURES.map((c) => `<button class="wl-pick ${c.id === selected ? "active" : ""}" style="--c:${c.color}"
      ${attr}="${c.id}" aria-label="${c.name}" title="${c.name}"><img src="${img(c.id)}" alt=""></button>`).join("")}</div>`;
  }
  const powerLine = (cid) => `${POWERS[cid].icon} <b>${byId[cid].name}'s Dream Power — ${POWERS[cid].name}:</b> ${POWERS[cid].text}`;

  function showSetup() {
    const cpu = setup.mode === "cpu";
    app.innerHTML = `
      <div class="wl-hero">
        <h1>Let's play <span style="background:var(--warm);-webkit-background-clip:text;background-clip:text;color:transparent">Wordlings!</span></h1>
        <p>Slide through the letter bubbles to make words. Pop them, score them, and outsmart your friends!</p>
      </div>
      <div class="wl-modes">
        <button class="wl-mode ${cpu ? "active" : ""}" data-mode="cpu"><span>🤖</span><b>Vs a Dreamling</b><small>Play the computer</small></button>
        <button class="wl-mode ${!cpu ? "active" : ""}" data-mode="pass"><span>👨‍👩‍👧</span><b>With friends</b><small>Pass the phone · 2–4</small></button>
      </div>
      <div class="wl-card">
        ${cpu ? `
          <div class="wl-label">Your name</div>
          <div class="wl-player" style="--c:${byId[setup.you].color}"><span class="av"><img src="${img(setup.you)}" alt=""></span>
            <input id="yourName" maxlength="14" value="${esc(setup.yourName)}" aria-label="Your name"></div>
          <div class="wl-label">Your Dreamling partner</div>${picks(setup.you, "data-you")}
          <div class="wl-power-note">${powerLine(setup.you)}</div>
          <div class="wl-label">Play against</div>${picks(setup.cpu, "data-cpu")}
          <div class="wl-label">How tricky?</div>
          <div class="wl-seg">${[["easy", "🌱 Easy"], ["medium", "🌿 Medium"], ["hard", "🔥 Hard"]].map(([k, l]) =>
            `<button data-level="${k}" class="${setup.level === k ? "active" : ""}">${l}</button>`).join("")}</div>`
        : `
          <div class="wl-label">How many players?</div>
          <div class="wl-seg">${[2, 3, 4].map((n) => `<button data-count="${n}" class="${setup.count === n ? "active" : ""}">${n} players</button>`).join("")}</div>
          ${setup.players.slice(0, setup.count).map((p, i) => `
            <div class="wl-label">Player ${i + 1}</div>
            <div class="wl-player" style="--c:${byId[p.cid].color}"><span class="av"><img src="${img(p.cid)}" alt=""></span>
              <input data-name="${i}" maxlength="14" value="${esc(p.name)}" aria-label="Player ${i + 1} name"></div>
            ${picks(p.cid, `data-p${i}`)}`).join("")}`}
        <div class="wl-label">Rounds</div>
        <div class="wl-seg">${[5, 8, 12].map((n) => `<button data-rounds="${n}" class="${setup.rounds === n ? "active" : ""}">${n === 5 ? "⚡ 5 quick" : n === 8 ? "8 rounds" : "12 long"}</button>`).join("")}</div>
      </div>
      <button class="wl-btn primary block wl-play" id="start">${VALID ? "✨ Start game" : "Loading words…"}</button>`;

    app.querySelectorAll("[data-mode]").forEach((b) => b.onclick = () => { setup.mode = b.dataset.mode; saveSetup(); showSetup(); });
    app.querySelectorAll("[data-you]").forEach((b) => b.onclick = () => { setup.you = b.dataset.you; if (setup.cpu === setup.you) setup.cpu = CREATURES.find((c) => c.id !== setup.you).id; saveSetup(); showSetup(); });
    app.querySelectorAll("[data-cpu]").forEach((b) => b.onclick = () => { if (b.dataset.cpu === setup.you) return; setup.cpu = b.dataset.cpu; saveSetup(); showSetup(); });
    app.querySelectorAll("[data-level]").forEach((b) => b.onclick = () => { setup.level = b.dataset.level; saveSetup(); showSetup(); });
    app.querySelectorAll("[data-rounds]").forEach((b) => b.onclick = () => { setup.rounds = +b.dataset.rounds; saveSetup(); showSetup(); });
    app.querySelectorAll("[data-count]").forEach((b) => b.onclick = () => { setup.count = +b.dataset.count; saveSetup(); showSetup(); });
    for (let i = 0; i < 4; i++) app.querySelectorAll(`[data-p${i}]`).forEach((b) => b.onclick = () => { setup.players[i].cid = b.dataset[`p${i}`]; saveSetup(); showSetup(); });
    app.querySelectorAll("[data-name]").forEach((inp) => inp.oninput = () => { setup.players[+inp.dataset.name].name = inp.value; saveSetup(); });
    const yn = app.querySelector("#yourName"); if (yn) yn.oninput = () => { setup.yourName = yn.value; saveSetup(); };
    const st = app.querySelector("#start");
    st.disabled = !VALID;
    st.onclick = () => startGame();
  }

  // ---------------------------------------------------------------- game
  let G = null;
  const mkPlayer = (name, cid, cpu) => ({ name: name.trim() || byId[cid].name, cid, cpu, score: 0, powerUsed: false, bonusNext: 0, multNext: 1, hints: 3, best: null, words: 0 });

  function startGame() {
    const players = setup.mode === "cpu"
      ? [mkPlayer(setup.yourName || "You", setup.you, false), mkPlayer(byId[setup.cpu].name, setup.cpu, true)]
      : setup.players.slice(0, setup.count).map((p) => mkPlayer(p.name, p.cid, false));
    G = { players, rounds: setup.rounds, t: 0, board: freshBoard(), sel: [], busy: false, mode: null, swapA: null, level: setup.level, hintPath: [] };
    // Make sure there's always something to play on the first board.
    while (solve(G.board, TRIE_COMMON, 5).length < 8) G.board = freshBoard();
    render(true);
    nextTurn(true);
  }
  const isYou = (pl) => pl.name.trim().toLowerCase() === "you";
  const turnLabel = (pl) => isYou(pl) ? "Your turn" : `${esc(pl.name)}'s turn`;
  const current = () => G.players[G.t % G.players.length];
  const roundNo = () => Math.floor(G.t / G.players.length) + 1;

  function render(fresh, drops) {
    const p = current();
    app.innerHTML = `
      <div class="wl-scores">${G.players.map((pl) => `
        <div class="wl-score ${pl === p ? "turn" : ""}" style="--c:${byId[pl.cid].color}">
          <img src="${img(pl.cid)}" alt=""><div style="min-width:0"><div class="nm">${esc(pl.name)}</div><div class="pts">${pl.score}</div></div>
        </div>`).join("")}</div>
      <div class="wl-status"><span>Round ${Math.min(roundNo(), G.rounds)} of ${G.rounds}</span>
        <span>${turnLabel(p)}</span>
        <button class="wl-icon-btn" id="mute" style="width:32px;height:32px" aria-label="Sound">${muted ? "🔇" : "🔊"}</button></div>
      <div class="wl-word" id="word"></div>
      <div class="wl-board-wrap"><div class="wl-board" id="board"></div><svg class="wl-path" id="path"></svg></div>
      <div id="controls"></div>`;
    drawBoard(drops);
    updateWord();
    drawControls();
    app.querySelector("#mute").onclick = () => { muted = !muted; try { localStorage.setItem("wordlings.muted", muted ? "1" : "0"); } catch (_) {} if (muted && window.Voices) Voices.stop(); render(); };
  }

  function drawBoard(drops = {}) {
    const el = app.querySelector("#board");
    el.innerHTML = G.board.map((t, i) => `
      <button class="wl-tile ${t.sp || ""} ${G.sel.includes(i) ? "sel" : ""} ${drops[t.id] ? "drop" : ""} ${G.hintPath.includes(i) ? "hint" : ""}
        ${G.mode && G.mode !== "busy" ? "pickme" : ""}" data-i="${i}" ${drops[t.id] ? `style="--from:${-drops[t.id] * 112}%"` : ""}
        aria-label="${t.l.toUpperCase()}${t.sp ? " " + t.sp : ""}">
        ${t.l === "qu" ? "Qu" : t.l.toUpperCase()}<sub>${VAL[t.l]}</sub>${t.sp ? `<span class="sp">${t.sp === "star" ? "⭐" : t.sp === "moon" ? "🌙" : "💎"}</span>` : ""}
      </button>`).join("");
    drawPath();
    bindBoard(el);
  }

  function drawPath() {
    const svg = app.querySelector("#path"), board = app.querySelector("#board");
    if (!svg || !board) return;
    const br = board.getBoundingClientRect();
    const pts = G.sel.map((i) => { const r = board.children[i].getBoundingClientRect(); return [r.left - br.left + r.width / 2, r.top - br.top + r.height / 2]; });
    svg.setAttribute("viewBox", `0 0 ${br.width} ${br.height}`);
    svg.innerHTML = pts.length > 1 ? `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="#ffcf6b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>` : "";
  }

  function updateWord() {
    const el = app.querySelector("#word");
    if (!el) return;
    if (!G.sel.length) { el.className = "wl-word"; el.innerHTML = `<span class="muted small" style="font-family:Nunito;letter-spacing:0">${current().cpu ? "Thinking…" : G.mode === "doodle" ? "🖍️ Tap a letter to change" : G.mode === "twist" ? "🔀 Tap two letters to swap" : "Slide or tap letters to make a word"}</span>`; return; }
    const w = wordOf(G.board, G.sel);
    const ok = w.length >= MIN_LEN && VALID.has(w);
    el.className = "wl-word " + (ok ? "ok" : w.length >= MIN_LEN ? "bad" : "");
    el.innerHTML = `${w.toUpperCase()}${ok ? `<span class="val">+${scorePath(G.board, G.sel, current())}</span>` : ""}`;
    const play = app.querySelector("#playBtn"); if (play) play.disabled = !ok;
  }

  function drawControls() {
    const box = app.querySelector("#controls"), p = current();
    if (p.cpu) { box.innerHTML = `<div class="wl-think"><img src="${img(p.cid)}" alt=""> ${esc(p.name)} is looking for a word…</div>`; return; }
    if (G.mode === "doodle-letter") {
      box.innerHTML = `<div class="wl-card"><b>🖍️ Pick a new letter</b><div class="wl-letters" style="margin-top:8px">
        ${"abcdefghijklmnopqrstuvwxyz".split("").map((l) => `<button data-letter="${l}">${l.toUpperCase()}</button>`).join("")}</div>
        <button class="wl-btn block" id="cancelMode" style="margin-top:8px">Cancel</button></div>`;
      box.querySelectorAll("[data-letter]").forEach((b) => b.onclick = () => {
        G.board[G.doodleAt].l = b.dataset.letter; usePower(); G.mode = null; render();
      });
      box.querySelector("#cancelMode").onclick = () => { G.mode = null; render(); };
      return;
    }
    const pw = POWERS[p.cid];
    const boost = p.multNext > 1 ? " · 🌙 ×2 ready" : p.bonusNext ? " · 🪨 +10 ready" : "";
    box.innerHTML = `
      <div class="wl-row" style="margin-bottom:8px">
        <button class="wl-btn" id="clearBtn">✖ Clear</button>
        <button class="wl-btn good wl-play" id="playBtn" style="flex:2" disabled>✔ Play word</button>
      </div>
      <div class="wl-actions">
        <button class="wl-btn" id="hintBtn" ${p.hints ? "" : "disabled"}><span>💡</span>Hint (${p.hints})</button>
        <button class="wl-btn" id="powerBtn" ${p.powerUsed ? "disabled" : ""} style="--c:${byId[p.cid].color}"><span>${pw.icon}</span>${pw.name}</button>
        <button class="wl-btn" id="shakeBtn"><span>🌀</span>Shake</button>
        <button class="wl-btn" id="quitBtn"><span>🏁</span>End</button>
      </div>
      <p class="small muted center" style="margin:4px 0 0">${p.powerUsed ? "Dream Power used" : `${pw.icon} ${pw.name}: ${pw.text}`}${boost}</p>
      ${G.mode ? `<button class="wl-btn block" id="cancelMode" style="margin-top:8px">Cancel ${G.mode === "doodle" ? "Doodle" : "Twist"}</button>` : ""}`;
    box.querySelector("#clearBtn").onclick = () => { G.sel = []; refreshSel(); };
    box.querySelector("#playBtn").onclick = () => playWord();
    box.querySelector("#hintBtn").onclick = () => hint();
    box.querySelector("#powerBtn").onclick = () => power();
    box.querySelector("#shakeBtn").onclick = () => { if (confirm("Shake the board? It mixes up the letters but skips your turn.")) shake(); };
    box.querySelector("#quitBtn").onclick = () => { if (confirm("End this game now?")) endGame(); };
    const cm = box.querySelector("#cancelMode"); if (cm) cm.onclick = () => { G.mode = null; G.swapA = null; render(); };
    updateWord();
  }

  function refreshSel() {
    const board = app.querySelector("#board");
    if (!board) return;
    [...board.children].forEach((t, i) => t.classList.toggle("sel", G.sel.includes(i)));
    drawPath(); updateWord();
  }

  // Touch / mouse: slide through letters, or tap them one at a time.
  function bindBoard(el) {
    let dragging = false, moved = false, maybePop = false;
    const tileAt = (x, y) => {
      const t = document.elementFromPoint(x, y)?.closest(".wl-tile");
      if (!t) return null;
      const r = t.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      return Math.hypot(x - cx, y - cy) < r.width * 0.42 ? +t.dataset.i : null; // inner circle: makes diagonals easy
    };
    el.onpointerdown = (e) => {
      if (G.busy || current().cpu) return;
      const i = tileAt(e.clientX, e.clientY);
      if (i === null) return;
      if (G.mode) return pickForMode(i);
      G.hintPath = [];
      dragging = true; moved = false; maybePop = false;
      const last = G.sel[G.sel.length - 1];
      if (!G.sel.length) G.sel = [i];
      else if (i === last) maybePop = true;
      else if (!G.sel.includes(i) && adjacent(last, i)) G.sel.push(i);
      else G.sel = [i];
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
      refreshSel();
    };
    el.onpointermove = (e) => {
      if (!dragging) return;
      const i = tileAt(e.clientX, e.clientY);
      if (i === null) return;
      const last = G.sel[G.sel.length - 1];
      if (i === last) return;
      moved = true;
      if (G.sel.length > 1 && i === G.sel[G.sel.length - 2]) { G.sel.pop(); refreshSel(); return; }
      if (!G.sel.includes(i) && adjacent(last, i)) { G.sel.push(i); refreshSel(); }
    };
    el.onpointerup = el.onpointercancel = () => {
      if (dragging && maybePop && !moved) { G.sel.pop(); refreshSel(); }
      dragging = false;
    };
  }

  function toast(big, small) {
    const t = document.createElement("div");
    t.className = "wl-toast"; t.innerHTML = `${big}${small ? `<small>${small}</small>` : ""}`;
    document.body.appendChild(t); setTimeout(() => t.remove(), 1900);
  }
  function confetti(list = ["⭐", "✨", "🔤", "💎", "🌙"]) {
    for (let i = 0; i < 26; i++) {
      const s = document.createElement("span"); s.className = "confetti"; s.textContent = list[rand(list.length)];
      s.style.left = Math.random() * 100 + "vw"; s.style.animationDuration = 1.6 + Math.random() * 1.5 + "s";
      document.body.appendChild(s); setTimeout(() => s.remove(), 3300);
    }
  }

  function playWord() {
    const p = current(), w = wordOf(G.board, G.sel);
    if (w.length < MIN_LEN || !VALID.has(w)) { const el = app.querySelector("#word"); el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); return; }
    const pts = scorePath(G.board, G.sel, p);
    p.score += pts; p.words++;
    p.multNext = 1; p.bonusNext = 0;
    if (!p.best || pts > p.best.pts) p.best = { word: w, pts };
    toast(`${w.toUpperCase()} +${pts}`, pts >= 25 ? "Amazing word!" : pts >= 15 ? "Great word!" : "");
    if (pts >= 25) confetti();
    if (p.cpu) say(p.cid, `${COMPUTER_LINES[p.cid][rand(2)]} ${w}! ${pts} points.`);
    else if (pts >= 20) say(p.cid, `Wow! ${w}! ${pts} points!`);
    popAndRefill(G.sel.slice(), () => { G.t++; nextTurn(); });
  }

  // Pop the used bubbles, let the rest fall, and drop new ones in from the top.
  function popAndRefill(path, done) {
    G.busy = true;
    const board = app.querySelector("#board");
    path.forEach((i) => board.children[i].classList.add("pop"));
    setTimeout(() => {
      const gone = new Set(path), drops = {};
      const next = new Array(N * N);
      for (let c = 0; c < N; c++) {
        const keep = [];
        for (let r = N - 1; r >= 0; r--) { const i = r * N + c; if (!gone.has(i)) keep.push({ t: G.board[i], from: r }); }
        let r = N - 1;
        keep.forEach(({ t, from }) => { next[r * N + c] = t; if (r !== from) drops[t.id] = r - from; r--; });
        let k = 1;
        while (r >= 0) { const t = newTile(next.filter(Boolean).concat(keep.map((x) => x.t))); next[r * N + c] = t; drops[t.id] = r + k; r--; k++; }
      }
      G.board = next; G.sel = []; G.hintPath = [];
      render(false, drops);
      setTimeout(() => { G.busy = false; done && done(); }, 380);
    }, 330);
  }

  function nextTurn(first) {
    if (G.t >= G.rounds * G.players.length) return endGame();
    // Keep the board playable.
    if (solve(G.board, TRIE_COMMON, 4).length < 3) { G.board = freshBoard(); toast("🌀 New letters!", "The board was getting tricky"); }
    render();
    const p = current();
    if (!first && setup.mode === "pass" && G.players.length > 1) toast(`${esc(p.name)}'s turn`, `Pass the phone to ${esc(p.name)}`);
    if (p.cpu) setTimeout(cpuTurn, 900);
  }

  function shake() {
    const letters = shuffle(G.board.slice());
    for (let k = 0; k < 6; k++) letters[rand(N * N)] = newTile(letters);
    G.board = letters; G.sel = []; G.mode = null;
    toast("🌀 Shake!", `${esc(current().name)} skips this turn`);
    G.t++;
    setTimeout(() => nextTurn(), 400);
  }

  function hint() {
    const p = current();
    if (!p.hints) return;
    const words = solve(G.board, TRIE_COMMON, 6);
    if (!words.length) return toast("Hmm…", "Try Shake for new letters");
    const pick = words[Math.min(words.length - 1, Math.floor(words.length * 0.25))];
    p.hints--;
    G.sel = []; G.hintPath = pick.path.slice(0, 2);
    render();
    toast("💡 Start here!", `A ${pick.word.length}-letter word begins with these`);
  }

  function usePower() { const p = current(); p.powerUsed = true; }
  function power() {
    const p = current();
    if (p.powerUsed) return;
    const pw = POWERS[p.cid];
    G.sel = [];
    switch (p.cid) {
      case "scribbi": G.mode = "doodle"; render(); return;
      case "tangle": G.mode = "twist"; G.swapA = null; render(); return;
      case "craggle": p.bonusNext += 10; break;
      case "nyxie": p.multNext = 2; break;
      case "orbit": G.board = shuffle(G.board.slice()); break;
      case "glitch": G.board = G.board.map((t) => ({ ...newTile(G.board), sp: t.sp })); break;
      case "leo": {
        const best = solve(G.board, TRIE_ALL, 8)[0];
        if (best) { G.hintPath = best.path; toast("🐾 Sniff sniff!", `Follow the glowing path: ${best.word.length} letters`); }
        break;
      }
    }
    usePower();
    say(p.cid, `${pw.name}!`);
    if (p.cid !== "leo") toast(`${pw.icon} ${pw.name}!`, pw.text);
    render();
  }

  function pickForMode(i) {
    if (G.mode === "doodle") { G.doodleAt = i; G.mode = "doodle-letter"; G.sel = [i]; render(); return; }
    if (G.mode === "twist") {
      if (G.swapA === null) { G.swapA = i; G.sel = [i]; refreshSel(); return; }
      const a = G.swapA;
      [G.board[a], G.board[i]] = [G.board[i], G.board[a]];
      G.swapA = null; G.mode = null; G.sel = [];
      usePower(); toast("🔀 Twist!", "Two letters swapped"); render();
    }
  }

  // ---------------------------------------------------------------- computer player
  function cpuTurn() {
    const p = current();
    if (!G || !p.cpu) return;
    const trie = G.level === "hard" ? TRIE_ALL : TRIE_COMMON;
    let words = solve(G.board, trie, G.level === "easy" ? 5 : 8);
    if (G.level === "easy") words = words.filter((w) => w.word.length <= 5);
    // Uses its Dream Power sometimes.
    if (!p.powerUsed && G.level !== "easy") {
      if ((p.cid === "glitch" || p.cid === "orbit") && words.length < 4) { power(); words = solve(G.board, trie, 8); }
      else if ((p.cid === "nyxie" || p.cid === "craggle") && words[0] && words[0].pts >= 14) power();
    }
    if (!words.length) return shake();
    let choice;
    if (G.level === "hard") choice = words[Math.min(words.length - 1, rand(2))];
    else if (G.level === "medium") choice = words[Math.floor(words.length * (0.15 + Math.random() * 0.35))];
    else choice = words[Math.floor(words.length * (0.45 + Math.random() * 0.5))];
    // Trace it slowly so players can see the word being made.
    let k = 0;
    G.sel = [];
    const step = () => {
      if (!G) return;
      G.sel.push(choice.path[k++]); refreshSel();
      if (k < choice.path.length) setTimeout(step, 260); else setTimeout(playWord, 650);
    };
    step();
  }

  // ---------------------------------------------------------------- end
  function endGame() {
    const ranked = G.players.slice().sort((a, b) => b.score - a.score);
    const win = ranked[0], tie = ranked[1] && ranked[1].score === win.score;
    app.innerHTML = `
      <div class="wl-card wl-end">
        <img class="win" src="${img(win.cid)}" alt="">
        <h1>${tie ? "It's a tie!" : isYou(win) ? "You win!" : `${esc(win.name)} wins!`}</h1>
        <p class="muted">${tie ? "What a close game!" : win.cpu ? `${esc(win.name)} the Dreamling won this time — try again!` : "Brilliant word wizardry! 🎉"}</p>
        ${ranked.map((pl, i) => `
          <div class="wl-rank"><span>${["🥇", "🥈", "🥉", "4️⃣"][i]}</span><img src="${img(pl.cid)}" alt="">
            <div><b style="margin:0;font-family:Nunito;font-size:1rem">${esc(pl.name)}</b><br><span class="small muted">${pl.best ? `Best word: ${pl.best.word.toUpperCase()} (${pl.best.pts})` : "No words yet"}</span></div>
            <b>${pl.score}</b></div>`).join("")}
      </div>
      <div class="wl-row">
        <button class="wl-btn primary" id="again">🔁 Play again</button>
        <button class="wl-btn" id="setup">⚙️ New game</button>
      </div>
      <a class="wl-btn block center" href="../" style="display:block;margin-top:8px;text-decoration:none">← Back to Imagine Seek</a>`;
    confetti();
    say(win.cid, tie ? "A tie! Let's play again!" : win.cpu ? `I win! ${byId[win.cid].catchphrase}` : `Hooray! ${win.name} wins!`);
    app.querySelector("#again").onclick = () => startGame();
    app.querySelector("#setup").onclick = () => { G = null; showSetup(); };
    G = null;
  }

  // ---------------------------------------------------------------- wiring
  const rules = document.getElementById("rulesDlg");
  document.getElementById("powerList").innerHTML = CREATURES.map((c) => `<li><img src="${img(c.id)}" alt=""><span>${POWERS[c.id].icon} <b>${c.name} — ${POWERS[c.id].name}:</b> ${POWERS[c.id].text}</span></li>`).join("");
  document.getElementById("rulesBtn").onclick = () => rules.showModal();
  document.getElementById("rulesClose").onclick = () => rules.close();
  window.addEventListener("resize", () => G && drawPath());

  showSetup();
  loadDictionary().then(() => { if (!G) showSetup(); }).catch(() => { app.innerHTML = `<div class="wl-card">Sorry — the word list couldn't load. Check your connection and refresh.</div>`; });
})();
