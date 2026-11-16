/* Wordweave — app controller */
(function () {
  'use strict';

  const { bank, generator, custom, skins, ambient, sound, progress, demo, DIFFICULTIES } = window.CW;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  // ---------- storage ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('wordweave:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('wordweave:' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
    del(k) { try { localStorage.removeItem('wordweave:' + k); } catch (e) { /* ignore */ } }
  };

  const IDEAS = ['Dinosaurs', 'Coffee', 'Halloween', 'Ancient Egypt', 'Pirates', 'Gardening', 'Winter', 'Superheroes', 'Weather', 'Camping', 'Baking', 'Mythology'];

  // ---------- setup state ----------
  const prefs = store.get('prefs', { theme: 'animals', custom: '', difficulty: 'medium' });
  let selTheme = prefs.custom ? null : (prefs.theme || 'animals');
  let customText = prefs.custom || '';
  let difficulty = DIFFICULTIES[prefs.difficulty] ? prefs.difficulty : 'medium';

  // ---------- game state ----------
  let G = null; // current game
  let paused = false;
  let timerHandle = null;
  let saveHandle = null;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  // =====================================================
  // Color scheme
  // =====================================================
  // Dark "neon" mode is the default; light "frost" mode is opt-in.
  function applyScheme(mode) {
    const dark = mode !== 'light';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#060913' : '#eef1fb';
  }

  // =====================================================
  // Theme skins
  // =====================================================
  let currentSkin = null;
  let skinKey = '';
  function setSkin(desc) {
    const key = JSON.stringify(desc);
    if (key === skinKey) return;
    skinKey = key;
    currentSkin = skins.get(desc);
    skins.apply(document.documentElement, currentSkin);
    if (ambient) ambient.set(currentSkin);
    sound.setTheme(currentSkin.id);
  }

  // Live preview in the hero uses words from the theme being previewed.
  let demoKey = '';
  function refreshDemo() {
    const desc = previewSkinDesc();
    const text = customText.trim();
    const key = text ? 'c:' + text.toLowerCase() : desc.id;
    if (key === demoKey) return;
    demoKey = key;
    const theme = bank.themes.find((t) => t.id === desc.id) || bank.general;
    $('#demoTheme').textContent = text ? `${theme.icon} ${titleCase(text)}` : `${theme.icon} ${theme.name}`;
    demo.start($('#heroDemo'), theme.entries);
  }

  // Sound toggle
  function paintSoundBtn() {
    const on = sound.isOn();
    const b = $('#soundBtn');
    b.classList.toggle('muted-on', !on);
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', on ? 'Sound on' : 'Sound off');
  }
  $('#soundBtn').addEventListener('click', () => { sound.toggle(); paintSoundBtn(); });
  paintSoundBtn();
  function previewSkinDesc() {
    return customText.trim() ? skins.forCustom(customText.trim(), bank) : { id: selTheme || 'animals' };
  }
  applyScheme(store.get('scheme', null));
  $('#themeToggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    store.set('scheme', next);
    applyScheme(next);
  });

  // =====================================================
  // Views
  // =====================================================
  function show(view) {
    for (const id of ['setupView', 'loadingView', 'gameView']) $('#' + id).hidden = id !== view;
    document.body.classList.toggle('in-game', view === 'gameView');
    document.body.classList.toggle('has-kb', view === 'gameView' && isTouch);
    $('#keyboard').hidden = !(view === 'gameView' && isTouch);
    window.scrollTo({ top: 0 });
    if (view === 'gameView') requestAnimationFrame(fitGrid);
  }

  // =====================================================
  // Setup screen
  // =====================================================
  function renderSetup() {
    const grid = $('#themeGrid');
    grid.innerHTML = '';
    for (const t of bank.themes) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'theme-card';
      b.setAttribute('role', 'radio');
      b.dataset.id = t.id;
      const sk = skins.get({ id: t.id });
      skins.apply(b, sk);
      b.innerHTML = `<span class="t-tag"></span><span class="t-icon" aria-hidden="true">${t.icon}</span><span><span class="t-name"></span><span class="t-blurb"></span></span>`;
      b.querySelector('.t-tag').textContent = sk.tag;
      b.querySelector('.t-name').textContent = t.name;
      b.querySelector('.t-blurb').textContent = t.blurb;
      b.addEventListener('click', () => { selTheme = t.id; customText = ''; $('#customTheme').value = ''; sound.play('click'); syncSetup(); });
      addTilt(b);
      grid.appendChild(b);
    }

    const sug = $('#suggestions');
    sug.innerHTML = '';
    const ideas = IDEAS.slice().sort(() => Math.random() - 0.5).slice(0, 6);
    for (const idea of ideas) {
      const c = document.createElement('button');
      c.type = 'button';
      c.className = 'chip';
      c.textContent = idea;
      c.addEventListener('click', () => { customText = idea; $('#customTheme').value = idea; selTheme = null; syncSetup(); });
      sug.appendChild(c);
    }

    const dg = $('#difficultyGrid');
    dg.innerHTML = '';
    Object.entries(DIFFICULTIES).forEach(([key, d], i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'diff-card';
      b.setAttribute('role', 'radio');
      b.dataset.id = key;
      b.innerHTML = `<span class="d-top"><span class="d-name">${d.label}</span><span class="d-dots">${[0, 1, 2].map((k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</span></span>
        <span class="d-blurb">${d.blurb}</span><span class="d-size">Up to ${d.size}×${d.size} · ~${d.target} words</span>`;
      b.addEventListener('click', () => { difficulty = key; sound.play('click'); syncSetup(); });
      dg.appendChild(b);
    });

    $('#customTheme').value = customText;
    syncSetup();
    renderResume();
    renderStats();
  }

  // 3D tilt + light sheen that follows the pointer
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function addTilt(el) {
    if (!finePointer) return;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(700px) rotateX(${(0.5 - y) * 12}deg) rotateY(${(x - 0.5) * 14}deg) translateY(-4px)`;
      el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  }

  function syncSetup() {
    $$('.theme-card').forEach((b) => b.setAttribute('aria-checked', String(!customText && b.dataset.id === selTheme)));
    $$('.diff-card').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.id === difficulty)));
    $('#customWrap .custom-input').classList.toggle('active', !!customText);
    $('#clearCustom').hidden = !customText;
    store.set('prefs', { theme: selTheme || 'animals', custom: customText, difficulty });
    // live preview of the chosen theme's design (debounced while typing)
    clearTimeout(syncSetup.t);
    syncSetup.t = setTimeout(() => { if (!$('#setupView').hidden) { setSkin(previewSkinDesc()); refreshDemo(); } }, customText ? 450 : 0);
  }

  $('#customTheme').addEventListener('input', (e) => {
    customText = e.target.value.replace(/\s+/g, ' ').trimStart();
    if (!customText.trim()) { customText = ''; if (!selTheme) selTheme = 'animals'; }
    syncSetup();
  });
  $('#customTheme').addEventListener('keydown', (e) => { if (e.key === 'Enter') startNew(); });
  $('#clearCustom').addEventListener('click', () => {
    customText = ''; $('#customTheme').value = ''; if (!selTheme) selTheme = 'animals'; syncSetup(); $('#customTheme').focus();
  });
  $('#generateBtn').addEventListener('click', () => startNew());

  function renderResume() {
    const saved = store.get('current', null);
    const card = $('#resumeCard');
    if (!saved || saved.done) { card.hidden = true; return; }
    const filled = saved.fill.filter(Boolean).length;
    const total = saved.puzzle.solution.filter(Boolean).length;
    $('#resumeIcon').textContent = saved.puzzle.icon;
    $('#resumeMeta').textContent = `${saved.puzzle.title} · ${DIFFICULTIES[saved.puzzle.difficulty].label} · ${Math.round((filled / total) * 100)}% filled · ${fmtTime(saved.elapsed)}`;
    card.hidden = false;
  }
  $('#resumeBtn').addEventListener('click', () => {
    const saved = store.get('current', null);
    if (saved) loadGame(saved);
  });

  function getStats() {
    return Object.assign({ solved: 0, best: {}, xp: 0, badges: [], themes: [], daily: {} }, store.get('stats', {}));
  }

  function renderStats() {
    const s = getStats();
    const lv = progress.levelFor(s.xp);
    $('#levelNum').textContent = lv.level;
    $('#levelRing').style.setProperty('--p', Math.round((lv.into / lv.need) * 100));
    $('#playerTitle').textContent = lv.title;
    $('#xpFill').style.width = (lv.into / lv.need) * 100 + '%';
    $('#xpText').textContent = `${lv.into} / ${lv.need} XP to level ${lv.level + 1}`;
    $('#statSolved').textContent = s.solved || 0;
    $('#statStreak').textContent = s.streak || 0;
    $('#statBadges').textContent = `${(s.badges || []).length}/${progress.BADGES.length}`;
    const strip = $('#badgeStrip');
    strip.innerHTML = '';
    for (const b of progress.BADGES) {
      const got = (s.badges || []).includes(b.id);
      const el = document.createElement('span');
      el.className = 'badge-chip' + (got ? ' got' : '');
      el.textContent = b.icon;
      el.title = `${b.name}${got ? '' : ' (locked)'} — ${b.desc}`;
      el.setAttribute('aria-label', el.title);
      strip.appendChild(el);
    }
    renderDaily();
  }

  function renderDaily() {
    const d = progress.daily(bank);
    const s = getStats();
    const card = $('#dailyCard');
    skins.apply(card, skins.get({ id: d.theme.id }));
    $('#dailyDate').textContent = d.label;
    $('#dailyIcon').textContent = d.theme.icon;
    $('#dailyTheme').textContent = d.theme.name;
    const solvedTime = s.daily && s.daily[d.key];
    const saved = store.get('current', null);
    const inProgress = saved && !saved.done && saved.puzzle.daily === d.key;
    $('#dailyMeta').textContent = solvedTime != null
      ? `Solved in ${fmtTime(solvedTime)} — come back tomorrow for a new one!`
      : 'Same puzzle for everyone today · Medium · +100 XP bonus';
    $('#dailyBtn').textContent = solvedTime != null ? 'Play it again' : inProgress ? 'Continue daily' : "Play today's puzzle";
    card.classList.toggle('done', solvedTime != null);
  }

  function playDaily() {
    const d = progress.daily(bank);
    const saved = store.get('current', null);
    if (saved && !saved.done && saved.puzzle.daily === d.key) { loadGame(saved); return; }
    startNew({ daily: true });
  }
  $('#dailyBtn').addEventListener('click', playDaily);
  $('#heroDaily').addEventListener('click', playDaily);
  $('#heroPlay').addEventListener('click', () => $('.setup-card').scrollIntoView({ behavior: 'smooth', block: 'start' }));

  $('#brandHome').addEventListener('click', goHome);
  function goHome() {
    stopTimer();
    saveNow();
    renderSetup();
    show('setupView');
  }

  // =====================================================
  // Puzzle creation
  // =====================================================
  const LOADING_LINES = ['Gathering words…', 'Crossing letters…', 'Writing clues…', 'Weaving the grid…'];

  async function startNew(opts = {}) {
    const dailyInfo = opts.daily ? progress.daily(bank) : null;
    const diffKey = dailyInfo ? dailyInfo.difficulty : difficulty;
    // The daily puzzle must come out identical on every device, so it gets a fixed seed and no time cut-off.
    const cfg = dailyInfo ? Object.assign({}, DIFFICULTIES[diffKey], { timeBudget: 1e9 }) : DIFFICULTIES[diffKey];
    const text = dailyInfo ? '' : customText.trim();
    show('loadingView');
    let li = 0;
    $('#loadingText').textContent = LOADING_LINES[0];
    const ticker = setInterval(() => { li = (li + 1) % LOADING_LINES.length; $('#loadingText').textContent = LOADING_LINES[li]; }, 900);
    const minWait = new Promise((r) => setTimeout(r, 700));

    try {
      let entries, title, icon, skin, notice = '';
      if (text) {
        const res = await custom.buildCustomEntries(text, difficulty, cfg, bank);
        entries = res.entries;
        notice = res.notice;
        title = titleCase(text);
        skin = skins.forCustom(text, bank);
        const look = bank.themes.find((t) => t.id === skin.id);
        icon = look ? look.icon : '✨';
      } else {
        const theme = dailyInfo ? dailyInfo.theme : (bank.themes.find((t) => t.id === selTheme) || bank.themes[0]);
        entries = theme.entries;
        title = dailyInfo ? `Daily · ${theme.name}` : theme.name;
        icon = theme.icon;
        skin = { id: theme.id };
      }

      // Words used recently get pushed down the list so each puzzle feels fresh.
      const recent = new Set(store.get('recent', []));
      if (!dailyInfo) entries = entries.map((e) => Object.assign({}, e, { priority: (e.priority || 0) - (recent.has(e.answer) ? 3.5 : 0) }));

      await new Promise((r) => setTimeout(r, 30)); // let the loader paint
      const seed = dailyInfo ? dailyInfo.seed : (Date.now() ^ Math.floor(Math.random() * 2 ** 32)) >>> 0;
      const puzzle = generator.generate(entries, cfg, seed);
      await minWait;
      if (!puzzle || puzzle.words.length < 4) throw new Error('Could not build a puzzle from that theme.');

      const used = puzzle.words.map((w) => w.answer);
      store.set('recent', used.concat([...recent]).slice(0, 160));

      Object.assign(puzzle, { title, icon, skin, difficulty: diffKey, notice, seed, created: Date.now(), custom: !!text, daily: dailyInfo ? dailyInfo.key : null });
      const counter = store.get('counter', 0) + 1;
      store.set('counter', counter);
      puzzle.number = counter;

      loadGame({
        puzzle,
        fill: Array(puzzle.solution.length).fill(''),
        revealed: Array(puzzle.solution.length).fill(false),
        wrong: Array(puzzle.solution.length).fill(false),
        elapsed: 0,
        reveals: 0,
        done: false,
        autocheck: cfg.autocheck,
        maxCombo: 0
      });
    } catch (err) {
      console.error(err);
      show('setupView');
      toast(err.message || 'Something went wrong — please try again.');
    } finally {
      clearInterval(ticker);
    }
  }

  function titleCase(s) {
    return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
  }

  // =====================================================
  // Game setup
  // =====================================================
  function loadGame(saved) {
    const p = saved.puzzle;
    const W = p.width, H = p.height;
    const cellWords = Array.from({ length: W * H }, () => ({ across: -1, down: -1 }));
    p.words.forEach((w, wi) => {
      w.cells = [];
      for (let i = 0; i < w.len; i++) {
        const r = w.row + (w.dir === 'down' ? i : 0);
        const c = w.col + (w.dir === 'across' ? i : 0);
        const idx = r * W + c;
        w.cells.push(idx);
        cellWords[idx][w.dir] = wi;
      }
    });
    G = Object.assign({}, saved, { W, H, cellWords, sel: -1, dir: 'across', notifiedFull: false });
    G.reveals = G.reveals || 0;
    G.maxCombo = G.maxCombo || 0;
    G.combo = 0;
    G.lastWordAt = 0;
    G.correctWords = new Set();
    p.words.forEach((w, wi) => { if (w.cells.every((i) => G.fill[i] === p.solution[i])) G.correctWords.add(wi); });

    // header
    setSkin(p.skin || { id: 'general' });
    $('#puzzleTitle').textContent = p.title;
    $('#puzzleIcon').textContent = p.icon;
    const badge = $('#puzzleBadge');
    badge.textContent = DIFFICULTIES[p.difficulty].label;
    badge.className = 'badge ' + p.difficulty;
    $('#puzzleCount').textContent = `Puzzle #${p.number || 1} · ${p.words.length} words`;
    const notice = $('#notice');
    notice.hidden = !p.notice;
    notice.textContent = p.notice || '';
    $('#autocheck').checked = !!G.autocheck;

    buildGrid();
    buildClues();
    buildKeyboard();
    paused = false;
    $('#pauseOverlay').hidden = true;
    $('#grid').classList.remove('solved');

    const first = p.words[0];
    select(firstEmpty(first) ?? first.cells[0], first.dir);
    show('gameView');
    updateProgress();
    if (!G.done) startTimer(); else renderTimer();
    saveNow();
  }

  function buildGrid() {
    const grid = $('#grid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${G.W}, var(--cell-size))`;
    const nums = new Map(G.puzzle.words.map((w) => [w.cells[0], w.number]));
    G.cellEls = [];
    G.puzzle.solution.forEach((ch, idx) => {
      const d = document.createElement('div');
      d.className = 'cell' + (ch ? '' : ' block');
      if (ch) {
        d.setAttribute('role', 'gridcell');
        if (nums.has(idx)) {
          const n = document.createElement('span');
          n.className = 'num';
          n.textContent = nums.get(idx);
          d.appendChild(n);
        }
        const l = document.createElement('span');
        l.className = 'letter';
        d.appendChild(l);
        d.addEventListener('pointerdown', (e) => { e.preventDefault(); onCellTap(idx); });
      }
      G.cellEls.push(d);
      grid.appendChild(d);
    });
    G.puzzle.solution.forEach((ch, idx) => ch && paintCell(idx));
  }

  function buildClues() {
    const lists = { across: $('#acrossList'), down: $('#downList') };
    lists.across.innerHTML = '';
    lists.down.innerHTML = '';
    G.clueEls = [];
    G.puzzle.words.forEach((w, wi) => {
      const li = document.createElement('li');
      li.innerHTML = '<span class="cn"></span><span class="ct"></span><span class="cl"></span>';
      li.querySelector('.cn').textContent = w.number;
      li.querySelector('.ct').textContent = w.clue;
      li.querySelector('.cl').textContent = `(${w.len})`;
      li.addEventListener('click', () => {
        select(firstEmpty(w) ?? w.cells[0], w.dir);
        if (window.innerWidth <= 900) $('#clueBar').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      lists[w.dir].appendChild(li);
      G.clueEls[wi] = li;
    });
    G.puzzle.words.forEach((_, wi) => paintClueDone(wi));
  }

  function buildKeyboard() {
    const kb = $('#keyboard');
    if (kb.childElementCount) return;
    const rows = ['QWERTYUIOP', 'ASDFGHJKL', '⇄ZXCVBNM⌫'];
    for (const row of rows) {
      const r = document.createElement('div');
      r.className = 'kb-row';
      for (const k of row) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'kb-key' + (k === '⇄' || k === '⌫' ? ' wide' : '');
        if (k === '⌫') {
          b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 5H8l-6 7 6 7h13zM12 9l6 6M18 9l-6 6"/></svg>';
          b.setAttribute('aria-label', 'Backspace');
        } else if (k === '⇄') {
          b.textContent = '⇄';
          b.setAttribute('aria-label', 'Switch direction');
        } else b.textContent = k;
        b.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          if (k === '⌫') handleKey('Backspace');
          else if (k === '⇄') handleKey(' ');
          else handleKey(k);
        });
        r.appendChild(b);
      }
      kb.appendChild(r);
    }
  }

  // =====================================================
  // Grid sizing
  // =====================================================
  function fitGrid() {
    if (!G || $('#gameView').hidden) return;
    const wrap = $('#gridWrap');
    const style = getComputedStyle(wrap);
    const padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const availW = wrap.clientWidth - padX;
    const kbH = isTouch ? $('#keyboard').offsetHeight || 170 : 0;
    const padY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    // On phones the board sticks to the top, so only the clue bar sits above it.
    const above = window.innerWidth <= 640 ? $('#clueBar').offsetHeight + 16 : wrap.getBoundingClientRect().top + window.scrollY;
    const availH = window.innerHeight - above - padY - 44 - kbH;
    const GAP = 0.08; // gap between tiles, as a fraction of the tile size
    const size = Math.floor(Math.max(18, Math.min(54, availW / (G.W + (G.W - 1) * GAP), Math.max(availH, 240) / (G.H + (G.H - 1) * GAP))));
    document.documentElement.style.setProperty('--cell-size', size + 'px');
    document.documentElement.style.setProperty('--gap', Math.max(2, Math.round(size * GAP)) + 'px');
  }
  window.addEventListener('resize', fitGrid);

  // =====================================================
  // Selection & painting
  // =====================================================
  function wordIdx(idx, dir) { return G.cellWords[idx] ? G.cellWords[idx][dir] : -1; }
  function currentWord() { return wordIdx(G.sel, G.dir); }
  function firstEmpty(w) { const c = w.cells.find((i) => !G.fill[i]); return c === undefined ? null : c; }

  function select(idx, dir) {
    if (idx == null || idx < 0 || !G.puzzle.solution[idx]) return;
    if (dir && wordIdx(idx, dir) !== -1) G.dir = dir;
    else if (wordIdx(idx, G.dir) === -1) G.dir = G.dir === 'across' ? 'down' : 'across';
    G.sel = idx;
    paintSelection();
  }

  function paintSelection() {
    const wi = currentWord();
    const word = G.puzzle.words[wi];
    const otherDir = G.dir === 'across' ? 'down' : 'across';
    const xi = wordIdx(G.sel, otherDir);
    const inWord = new Set(word ? word.cells : []);
    const inCross = new Set(xi >= 0 ? G.puzzle.words[xi].cells : []);
    G.cellEls.forEach((el, idx) => {
      if (!G.puzzle.solution[idx]) return;
      el.classList.toggle('active', idx === G.sel);
      el.classList.toggle('inword', inWord.has(idx) && idx !== G.sel);
      el.classList.toggle('cross', !inWord.has(idx) && inCross.has(idx));
    });
    G.clueEls.forEach((li, i) => {
      li.classList.toggle('active', i === wi);
      li.classList.toggle('cross', i === xi);
    });
    if (word) {
      $('#clueBarText').innerHTML = `<span class="cb-num">${word.number} ${word.dir === 'across' ? 'Across' : 'Down'}</span>`;
      $('#clueBarText').appendChild(document.createTextNode(word.clue));
      scrollClueIntoView(G.clueEls[wi]);
    }
  }

  function scrollClueIntoView(li) {
    const col = $('.clues-col');
    if (!li || !col || col.scrollHeight <= col.clientHeight) return;
    const lt = li.offsetTop - col.offsetTop;
    if (lt < col.scrollTop + 40 || lt > col.scrollTop + col.clientHeight - 60) {
      col.scrollTo({ top: lt - col.clientHeight / 3, behavior: 'smooth' });
    }
  }

  function paintCell(idx) {
    const el = G.cellEls[idx];
    el.querySelector('.letter').textContent = G.fill[idx] || '';
    el.classList.toggle('wrong', !!G.wrong[idx]);
    el.classList.toggle('revealed', !!G.revealed[idx]);
    const w = G.puzzle.words;
    const label = [];
    for (const d of ['across', 'down']) { const wi = wordIdx(idx, d); if (wi >= 0) label.push(`${w[wi].number} ${d}`); }
    el.setAttribute('aria-label', `${label.join(', ')}${G.fill[idx] ? ', letter ' + G.fill[idx] : ', empty'}`);
  }

  function paintClueDone(wi) {
    const w = G.puzzle.words[wi];
    G.clueEls[wi].classList.toggle('done', w.cells.every((i) => G.fill[i]));
  }

  function afterChange(idxs, opts = {}) {
    const words = new Set();
    for (const i of idxs) {
      paintCell(i);
      for (const d of ['across', 'down']) { const wi = wordIdx(i, d); if (wi >= 0) words.add(wi); }
    }
    words.forEach(paintClueDone);
    // celebrate words that just became correct (but not the very last one — the win takes over)
    const allDone = G.puzzle.solution.every((ch, i) => !ch || G.fill[i] === ch);
    words.forEach((wi) => {
      const ok = G.puzzle.words[wi].cells.every((i) => G.fill[i] === G.puzzle.solution[i]);
      if (ok && !G.correctWords.has(wi)) {
        G.correctWords.add(wi);
        if (!opts.quiet && !allDone) celebrateWord(wi);
      } else if (!ok) G.correctWords.delete(wi);
    });
    updateProgress();
    scheduleSave();
    checkComplete();
  }

  // ---------- word-complete effects & combos ----------
  function celebrateWord(wi) {
    const w = G.puzzle.words[wi];
    const now = Date.now();
    G.combo = now - G.lastWordAt < 25000 ? G.combo + 1 : 1;
    G.lastWordAt = now;
    G.maxCombo = Math.max(G.maxCombo || 0, G.combo);

    w.cells.forEach((i, n) => {
      const el = G.cellEls[i];
      el.style.setProperty('--d', n * 45 + 'ms');
      el.classList.remove('word-pop'); void el.offsetWidth; el.classList.add('word-pop');
      setTimeout(() => el.classList.remove('word-pop'), 900 + n * 45);
    });
    const li = G.clueEls[wi];
    li.classList.remove('just-done'); void li.offsetWidth; li.classList.add('just-done');

    // floating word label above the word's middle tile
    const wrap = $('.board-col');
    const mid = G.cellEls[w.cells[Math.floor(w.cells.length / 2)]];
    const wr = wrap.getBoundingClientRect(), cr = mid.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'float-word';
    f.textContent = `${w.answer} +${10 * G.combo}`;
    f.style.left = cr.left - wr.left + cr.width / 2 + 'px';
    f.style.top = cr.top - wr.top + 'px';
    wrap.appendChild(f);
    setTimeout(() => f.remove(), 1400);

    if (G.combo >= 2) {
      sound.play('combo', G.combo);
      const c = $('#comboPop');
      c.textContent = `COMBO ×${G.combo}`;
      c.classList.remove('show'); void c.offsetWidth; c.classList.add('show');
    } else sound.play('word');
  }

  function updateProgress() {
    const total = G.puzzle.solution.filter(Boolean).length;
    const filled = G.fill.filter(Boolean).length;
    const pct = Math.round((filled / total) * 100);
    $('#progressFill').style.width = pct + '%';
    $('#progressText').textContent = `${filled}/${total} letters`;
  }

  // =====================================================
  // Input
  // =====================================================
  function onCellTap(idx) {
    if (!G) return;
    if (idx === G.sel) {
      const other = G.dir === 'across' ? 'down' : 'across';
      if (wordIdx(idx, other) !== -1) { G.dir = other; paintSelection(); }
    } else {
      select(idx, G.dir);
    }
  }

  document.addEventListener('keydown', (e) => {
    if (!G || $('#gameView').hidden || paused) return;
    if (e.target.closest && e.target.closest('input, textarea')) return;
    if (!$('#winModal').hidden || !$('#helpModal').hidden || !$('#confirmModal').hidden) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (handleKey(e.key, e.shiftKey)) e.preventDefault();
  });

  function handleKey(key, shift) {
    if (!G || paused) return false;
    if (/^[a-zA-Z]$/.test(key)) { typeLetter(key.toUpperCase()); return true; }
    switch (key) {
      case 'Backspace': backspace(); return true;
      case 'Delete': clearCell(G.sel); return true;
      case 'ArrowLeft': arrow('across', -1); return true;
      case 'ArrowRight': arrow('across', 1); return true;
      case 'ArrowUp': arrow('down', -1); return true;
      case 'ArrowDown': arrow('down', 1); return true;
      case ' ': case 'Enter': toggleDir(); return true;
      case 'Tab': jumpWord(shift ? -1 : 1); return true;
      default: return false;
    }
  }

  function toggleDir() {
    const other = G.dir === 'across' ? 'down' : 'across';
    if (wordIdx(G.sel, other) !== -1) { G.dir = other; paintSelection(); }
  }

  function arrow(dir, delta) {
    if (G.dir !== dir && wordIdx(G.sel, dir) !== -1) { G.dir = dir; paintSelection(); return; }
    let r = Math.floor(G.sel / G.W), c = G.sel % G.W;
    while (true) {
      if (dir === 'across') c += delta; else r += delta;
      if (r < 0 || c < 0 || r >= G.H || c >= G.W) return;
      const idx = r * G.W + c;
      if (G.puzzle.solution[idx]) { select(idx, dir); return; }
    }
  }

  function setLetter(idx, ch) {
    if (G.revealed[idx]) return false;
    G.fill[idx] = ch;
    G.wrong[idx] = !!(ch && G.autocheck && ch !== G.puzzle.solution[idx]);
    return true;
  }

  function typeLetter(ch) {
    if (G.done) return;
    const idx = G.sel;
    const changed = setLetter(idx, ch);
    if (changed) {
      const el = G.cellEls[idx];
      el.classList.remove('typed'); void el.offsetWidth; el.classList.add('typed');
      sound.play('type');
      afterChange([idx]);
    }
    if (G.done) return;
    // advance
    const word = G.puzzle.words[currentWord()];
    const pos = word.cells.indexOf(idx);
    const last = pos === word.cells.length - 1;
    if (last) {
      if (word.cells.every((i) => G.fill[i])) jumpWord(1, true);
      return;
    }
    select(word.cells[pos + 1], G.dir);
  }

  function backspace() {
    if (G.done) return;
    const idx = G.sel;
    if (G.fill[idx] && !G.revealed[idx]) { clearCell(idx); return; }
    const word = G.puzzle.words[currentWord()];
    const pos = word.cells.indexOf(idx);
    if (pos > 0) {
      const prev = word.cells[pos - 1];
      select(prev, G.dir);
      clearCell(prev);
    } else {
      jumpWord(-1, false, true);
    }
  }

  function clearCell(idx) {
    if (G.done || G.revealed[idx] || !G.fill[idx]) return;
    G.fill[idx] = '';
    G.wrong[idx] = false;
    sound.play('erase');
    afterChange([idx]);
  }

  // Ordered: across clues then down clues.
  function jumpWord(delta, preferIncomplete, toEnd) {
    const words = G.puzzle.words;
    const cur = currentWord();
    const n = words.length;
    for (let step = 1; step <= n; step++) {
      const wi = (cur + delta * step + n * 2) % n;
      const w = words[wi];
      const empty = firstEmpty(w);
      if (preferIncomplete && empty === null) continue;
      select(toEnd ? w.cells[w.cells.length - 1] : (empty ?? w.cells[0]), w.dir);
      return;
    }
    // everything is filled — just move to the next clue
    if (preferIncomplete) jumpWord(delta, false);
  }

  $('#prevClue').addEventListener('click', () => jumpWord(-1));
  $('#nextClue').addEventListener('click', () => jumpWord(1));

  // =====================================================
  // Check / reveal
  // =====================================================
  function scopeCells(scope) {
    if (scope === 'letter') return [G.sel];
    if (scope === 'word') return G.puzzle.words[currentWord()].cells.slice();
    return G.puzzle.solution.map((ch, i) => (ch ? i : -1)).filter((i) => i >= 0);
  }

  function doCheck(scope) {
    if (G.done) return;
    const cells = scopeCells(scope);
    let wrong = 0, empty = 0;
    for (const i of cells) {
      if (!G.fill[i]) { empty++; continue; }
      if (G.fill[i] !== G.puzzle.solution[i]) { G.wrong[i] = true; wrong++; }
    }
    afterChange(cells, { quiet: true });
    sound.play(wrong ? 'wrong' : 'good');
    if (wrong) toast(`${wrong} letter${wrong === 1 ? '' : 's'} need${wrong === 1 ? 's' : ''} another look`);
    else if (empty) toast('Looking good so far! ✓');
    else toast('All correct! ✓');
  }

  function doReveal(scope) {
    if (G.done) return;
    const run = () => {
      const cells = scopeCells(scope);
      const changed = [];
      for (const i of cells) {
        if (G.fill[i] === G.puzzle.solution[i] && !G.wrong[i]) continue;
        G.fill[i] = G.puzzle.solution[i];
        G.wrong[i] = false;
        G.revealed[i] = true;
        changed.push(i);
      }
      if (changed.length) G.reveals += scope === 'puzzle' ? changed.length : 1;
      afterChange(cells, { quiet: true });
    };
    if (scope === 'puzzle') confirmBox('Reveal the whole puzzle? This ends the game.', run);
    else run();
  }

  $$('[data-check]').forEach((b) => b.addEventListener('click', () => { closeMenus(); doCheck(b.dataset.check); }));
  $$('[data-reveal]').forEach((b) => b.addEventListener('click', () => { closeMenus(); doReveal(b.dataset.reveal); }));
  $('#autocheck').addEventListener('change', (e) => {
    G.autocheck = e.target.checked;
    if (G.autocheck) {
      const filled = scopeCells('puzzle').filter((i) => G.fill[i]);
      filled.forEach((i) => { G.wrong[i] = G.fill[i] !== G.puzzle.solution[i]; });
      afterChange(filled, { quiet: true });
    } else scheduleSave();
  });

  function closeMenus(except) { $$('details.menu[open]').forEach((d) => { if (d !== except) d.open = false; }); }
  document.addEventListener('click', (e) => {
    const inMenu = e.target.closest('details.menu');
    closeMenus(inMenu);
  });

  $('#restartBtn').addEventListener('click', () => {
    closeMenus();
    confirmBox('Clear every answer and restart the timer?', () => {
      const all = scopeCells('puzzle');
      all.forEach((i) => { G.fill[i] = ''; G.wrong[i] = false; G.revealed[i] = false; });
      G.elapsed = 0; G.reveals = 0; G.done = false; G.notifiedFull = false;
      $('#grid').classList.remove('solved');
      G.combo = 0; G.maxCombo = 0;
      afterChange(all, { quiet: true });
      select(G.puzzle.words[0].cells[0], G.puzzle.words[0].dir);
      startTimer();
    });
  });
  $('#printBtn').addEventListener('click', () => { closeMenus(); printPuzzle(); });
  $('#newSameBtn').addEventListener('click', () => { closeMenus(); saveNow(); startNew(); });
  $('#changeBtn').addEventListener('click', () => { closeMenus(); goHome(); });

  // =====================================================
  // Completion
  // =====================================================
  function checkComplete() {
    if (G.done) return;
    const cells = scopeCells('puzzle');
    if (!cells.every((i) => G.fill[i])) { G.notifiedFull = false; return; }
    const correct = cells.every((i) => G.fill[i] === G.puzzle.solution[i]);
    if (correct) win();
    else if (!G.notifiedFull) {
      G.notifiedFull = true;
      toast('Every square is filled, but something’s not quite right. Try Check → Puzzle.');
    }
  }

  function win() {
    G.done = true;
    stopTimer();
    saveNow();
    const p = G.puzzle;
    const assisted = G.reveals > 0;
    const stats = getStats();
    const before = progress.levelFor(stats.xp);
    let bestMsg = '';
    if (!assisted) {
      stats.solved = (stats.solved || 0) + 1;
      const prev = stats.best[p.difficulty];
      if (!prev || G.elapsed < prev) {
        stats.best[p.difficulty] = G.elapsed;
        bestMsg = prev ? `⚡ New personal best for ${DIFFICULTIES[p.difficulty].label}!` : '';
      } else bestMsg = `Your best ${DIFFICULTIES[p.difficulty].label} time: ${fmtTime(prev)}`;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 864e5).toDateString();
      if (stats.lastDay !== today) stats.streak = stats.lastDay === yesterday ? (stats.streak || 0) + 1 : 1;
      stats.lastDay = today;
      const themeKey = p.custom ? 'custom:' + p.title.toLowerCase() : (p.skin && p.skin.id) || p.title;
      if (!stats.themes.includes(themeKey)) stats.themes.push(themeKey);
      if (p.daily && stats.daily[p.daily] == null) stats.daily[p.daily] = Math.round(G.elapsed);
    }
    const dailyFirst = !!p.daily && !assisted && stats.daily[p.daily] === Math.round(G.elapsed);
    const gain = progress.xpFor({ difficulty: p.difficulty, elapsed: G.elapsed, reveals: G.reveals, maxCombo: G.maxCombo, daily: dailyFirst });
    stats.xp = (stats.xp || 0) + gain.total;
    const earned = progress.newBadges(stats, { difficulty: p.difficulty, elapsed: G.elapsed, reveals: G.reveals, custom: p.custom, daily: !!p.daily, maxCombo: G.maxCombo });
    stats.badges = (stats.badges || []).concat(earned);
    store.set('stats', stats);
    const after = progress.levelFor(stats.xp);

    $('#grid').classList.add('solved');
    G.cellEls.forEach((el, i) => { el.style.animationDelay = ((i % G.W) + Math.floor(i / G.W)) * 25 + 'ms'; });
    sound.play('win');
    if (!assisted) confetti();
    setTimeout(() => {
      $('#winTitle').textContent = assisted ? 'Puzzle complete!' : 'Puzzle solved!';
      $('.win-burst').textContent = assisted ? '🧩' : (p.icon || '🎉');
      $('#winSub').textContent = `${p.title} · ${DIFFICULTIES[p.difficulty].label}`;
      $('#winTime').textContent = fmtTime(G.elapsed);
      $('#winWords').textContent = p.words.length;
      $('#winHelp').textContent = G.reveals;
      $('#winBest').textContent = assisted ? 'Solve one without reveals to set a best time.' : bestMsg;
      const parts = [`Solve +${gain.base}`];
      if (gain.speed) parts.push(`Speed +${gain.speed}`);
      if (gain.combo) parts.push(`Combo +${gain.combo}`);
      if (gain.dailyBonus) parts.push(`Daily +${gain.dailyBonus}`);
      if (gain.assisted) parts.push('Reveals ×0.4');
      $('#xpBreakdown').textContent = parts.join('  ·  ');
      const wb = $('#winBadges');
      wb.innerHTML = '';
      for (const id of earned) {
        const b = progress.BADGES.find((x) => x.id === id);
        const el = document.createElement('div');
        el.className = 'new-badge';
        el.innerHTML = '<span class="nb-icon"></span><span><b></b><small></small></span>';
        el.querySelector('.nb-icon').textContent = b.icon;
        el.querySelector('b').textContent = `Badge unlocked: ${b.name}`;
        el.querySelector('small').textContent = b.desc;
        wb.appendChild(el);
      }
      openModal('winModal');
      animateXp(before, after, gain.total);
    }, assisted ? 300 : 900);
  }

  function animateXp(before, after, total) {
    const gainEl = $('#xpGain'), fill = $('#winXpFill'), lvl = $('#winLevel');
    const leveled = after.level > before.level;
    lvl.textContent = `Lv ${before.level} · ${before.title}`;
    lvl.classList.remove('up');
    fill.style.transition = 'none';
    fill.style.width = (before.into / before.need) * 100 + '%';
    void fill.offsetWidth;
    fill.style.transition = '';
    const start = performance.now(), dur = 1200;
    (function tick(t) {
      const k = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      gainEl.textContent = `+${Math.round(total * e)} XP`;
      if (k < 1) requestAnimationFrame(tick);
    })(start);
    setTimeout(() => {
      if (leveled) {
        fill.style.width = '100%';
        setTimeout(() => {
          fill.style.transition = 'none';
          fill.style.width = '0%';
          void fill.offsetWidth;
          fill.style.transition = '';
          fill.style.width = (after.into / after.need) * 100 + '%';
          lvl.textContent = `LEVEL UP! Lv ${after.level} · ${after.title}`;
          lvl.classList.add('up');
          sound.play('levelup');
        }, 650);
      } else {
        fill.style.width = (after.into / after.need) * 100 + '%';
      }
    }, 150);
  }

  $('#winAgain').addEventListener('click', () => { closeModal('winModal'); startNew(); });
  $('#winChange').addEventListener('click', () => { closeModal('winModal'); goHome(); });
  $('#winView').addEventListener('click', () => closeModal('winModal'));

  // =====================================================
  // Timer
  // =====================================================
  function fmtTime(s) {
    s = Math.floor(s || 0);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
  }
  function renderTimer() { $('#timer').textContent = fmtTime(G.elapsed); }
  function startTimer() {
    stopTimer();
    renderTimer();
    let last = Date.now();
    timerHandle = setInterval(() => {
      const t = Date.now();
      if (!paused && !document.hidden && G && !G.done) {
        G.elapsed += (t - last) / 1000;
        renderTimer();
      }
      last = t;
    }, 500);
  }
  function stopTimer() { if (timerHandle) clearInterval(timerHandle); timerHandle = null; }

  function setPaused(p) {
    if (!G || G.done) return;
    paused = p;
    $('#pauseOverlay').hidden = !p;
    $('#pauseBtn').innerHTML = p
      ? '<svg viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M9 6v12M15 6v12"/></svg>';
    $('#pauseBtn').setAttribute('aria-label', p ? 'Resume' : 'Pause');
    $('#grid').style.visibility = p ? 'hidden' : '';
    saveNow();
  }
  $('#pauseBtn').addEventListener('click', () => setPaused(!paused));
  $('#resumePlayBtn').addEventListener('click', () => setPaused(false));

  // =====================================================
  // Save
  // =====================================================
  function snapshot() {
    const puzzle = Object.assign({}, G.puzzle, { words: G.puzzle.words.map(({ cells, ...w }) => w) });
    return { puzzle, fill: G.fill, revealed: G.revealed, wrong: G.wrong, elapsed: G.elapsed, reveals: G.reveals, done: G.done, autocheck: G.autocheck };
  }
  function saveNow() { if (G) store.set('current', snapshot()); }
  function scheduleSave() { clearTimeout(saveHandle); saveHandle = setTimeout(saveNow, 400); }
  setInterval(() => { if (G && !G.done && !$('#gameView').hidden) saveNow(); }, 5000);
  window.addEventListener('beforeunload', saveNow);
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveNow(); });

  // =====================================================
  // Print
  // =====================================================
  function printPuzzle() {
    const p = G.puzzle;
    const sheet = $('#printSheet');
    const cell = Math.floor(Math.min(500 / p.width, 30));
    const nums = new Map(p.words.map((w) => [w.cells[0], w.number]));
    let gridHtml = `<div class="print-grid" style="grid-template-columns:repeat(${p.width},${cell}px);grid-auto-rows:${cell}px;width:${cell * p.width}px">`;
    p.solution.forEach((ch, i) => { gridHtml += ch ? `<div>${nums.has(i) ? `<span>${nums.get(i)}</span>` : ''}</div>` : '<div class="b"></div>'; });
    gridHtml += '</div>';
    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const list = (dir) => p.words.filter((w) => w.dir === dir).map((w) => `<li><b>${w.number}</b> ${esc(w.clue)} (${w.len})</li>`).join('');
    sheet.innerHTML = `<h1>${esc(p.icon + ' ' + p.title)}</h1><div class="p-sub">${DIFFICULTIES[p.difficulty].label} · Wordweave puzzle #${p.number || 1}</div>${gridHtml}
      <div class="print-clues"><h3>Across</h3><ol>${list('across')}</ol><h3>Down</h3><ol>${list('down')}</ol></div>`;
    window.print();
  }

  // =====================================================
  // Modals & toast
  // =====================================================
  function openModal(id) { $('#' + id).hidden = false; const b = $('#' + id + ' .btn-primary'); if (b) b.focus(); }
  function closeModal(id) { $('#' + id).hidden = true; }
  $$('.modal').forEach((m) => m.addEventListener('click', (e) => { if (e.target === m) m.hidden = true; }));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { $$('.modal').forEach((m) => { m.hidden = true; }); closeMenus(); }
  });

  let confirmCb = null;
  function confirmBox(text, cb) { $('#confirmText').textContent = text; confirmCb = cb; openModal('confirmModal'); }
  $('#confirmYes').addEventListener('click', () => { closeModal('confirmModal'); if (confirmCb) confirmCb(); confirmCb = null; });
  $('#confirmNo').addEventListener('click', () => { closeModal('confirmModal'); confirmCb = null; });

  $('#helpBtn').addEventListener('click', () => openModal('helpModal'));
  $('#helpClose').addEventListener('click', () => closeModal('helpModal'));

  let toastHandle = null;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastHandle);
    toastHandle = setTimeout(() => t.classList.remove('show'), 2600);
  }

  // =====================================================
  // Confetti
  // =====================================================
  function confetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = $('#confetti');
    const ctx = cv.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const colors = currentSkin ? [currentSkin.a1, currentSkin.a2, currentSkin.a3, '#ffffff'] : ['#818cf8', '#f472b6', '#34d399', '#ffffff'];
    const EXTRA = { space: ['★', '✦'], ocean: ['🫧', '🐚'], technology: ['0', '1', '</>'], science: ['⚛', '⬢'], history: ['👑', '✦'], arts: ['🎨', '✏️'], general: ['✦', '★'], custom: ['✦', '✧'] };
    const glyphs = currentSkin && currentSkin.fx.glyphs && !currentSkin.fx.tint ? currentSkin.fx.glyphs
      : (currentSkin && (EXTRA[currentSkin.id] || (currentSkin.fx.glyphs))) || ['✦'];
    const parts = Array.from({ length: 170 }, (_, n) => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4,
      s: 6 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      c: colors[(Math.random() * colors.length) | 0],
      g: n % 4 === 0 ? glyphs[(Math.random() * glyphs.length) | 0] : null
    }));
    const start = performance.now();
    (function frame(t) {
      const age = t - start;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of parts) {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.globalAlpha = Math.max(0, 1 - age / 3200);
        ctx.fillStyle = p.c;
        if (p.g) {
          ctx.font = `700 ${p.s * 2.6}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji","JetBrains Mono",sans-serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(p.g, 0, 0);
        } else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      }
      if (age < 3200) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(start);
  }

  // =====================================================
  // Install / Add to Home Screen
  // =====================================================
  const SITE_URL = 'https://artzeis.github.io/art/';
  let deferredInstall = null;
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/i.test(ua);
  let embedded = false;
  try { embedded = window.top !== window.self; } catch (e) { embedded = true; }

  function refreshInstallBtn() { $('#installBtn').hidden = isStandalone(); }
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; refreshInstallBtn(); });
  window.addEventListener('appinstalled', () => { deferredInstall = null; refreshInstallBtn(); toast('Wordweave is on your Home Screen 🎉'); });

  function installSteps() {
    const share = '<svg viewBox="0 0 24 24" class="inline-ic"><path d="M12 3v12M8 7l4-4 4 4M5 12v8h14v-8"/></svg>';
    if (embedded) {
      return `<p>Home Screen icons need the app's own website. Open it in your browser first:</p>
        <a class="btn btn-soft site-link" href="${SITE_URL}" target="_blank" rel="noopener">${SITE_URL.replace('https://', '')}</a>
        <p class="muted small">Then tap this ⤓ Install button again for the steps.</p>`;
    }
    if (isIOS) {
      return `<ol><li>Tap the <strong>Share</strong> button ${share} in Safari's toolbar.</li>
        <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
        <li>Tap <strong>Add</strong> — the Wordweave icon appears on your Home Screen.</li></ol>`;
    }
    if (isAndroid) {
      return `<ol><li>Tap the browser menu <strong>⋮</strong> (top-right).</li>
        <li>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
        <li>Confirm — the Wordweave icon appears with your apps.</li></ol>`;
    }
    return `<ol><li>Click the <strong>install</strong> icon at the right end of the address bar, or open the browser menu.</li>
      <li>Choose <strong>Install Wordweave</strong> (or <strong>Add to Home Screen / Dock</strong>).</li>
      <li>Wordweave opens in its own window with its own icon.</li></ol>`;
  }

  $('#installBtn').addEventListener('click', async () => {
    if (deferredInstall && !embedded) {
      deferredInstall.prompt();
      try { await deferredInstall.userChoice; } catch (e) { /* ignore */ }
      deferredInstall = null;
      return;
    }
    $('#installSteps').innerHTML = installSteps();
    openModal('installModal');
  });
  $('#installClose').addEventListener('click', () => closeModal('installModal'));
  refreshInstallBtn();

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost') && !embedded) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ }));
  }

  // =====================================================
  // Boot
  // =====================================================
  renderSetup();
  show('setupView');
})();
