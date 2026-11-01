/* Wordweave — app controller */
(function () {
  'use strict';

  const { bank, generator, custom, DIFFICULTIES } = window.CW;
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
  function applyScheme(mode) {
    const dark = mode === 'dark' || (mode == null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#14161d' : '#f6f1e7';
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
      b.innerHTML = `<span class="t-icon" aria-hidden="true">${t.icon}</span><span><span class="t-name"></span><span class="t-blurb"></span></span>`;
      b.querySelector('.t-name').textContent = t.name;
      b.querySelector('.t-blurb').textContent = t.blurb;
      b.addEventListener('click', () => { selTheme = t.id; customText = ''; $('#customTheme').value = ''; syncSetup(); });
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
      b.addEventListener('click', () => { difficulty = key; syncSetup(); });
      dg.appendChild(b);
    });

    $('#customTheme').value = customText;
    syncSetup();
    renderResume();
    renderStats();
  }

  function syncSetup() {
    $$('.theme-card').forEach((b) => b.setAttribute('aria-checked', String(!customText && b.dataset.id === selTheme)));
    $$('.diff-card').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.id === difficulty)));
    $('#customWrap .custom-input').classList.toggle('active', !!customText);
    $('#clearCustom').hidden = !customText;
    store.set('prefs', { theme: selTheme || 'animals', custom: customText, difficulty });
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

  function renderStats() {
    const s = store.get('stats', { solved: 0, best: {} });
    const parts = [];
    if (s.solved) parts.push(`🏆 ${s.solved} puzzle${s.solved === 1 ? '' : 's'} solved`);
    if (s.streak > 1) parts.push(`🔥 ${s.streak}-day streak`);
    $('#statsLine').textContent = parts.join('   ·   ');
  }

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

  async function startNew() {
    const cfg = DIFFICULTIES[difficulty];
    const text = customText.trim();
    show('loadingView');
    let li = 0;
    $('#loadingText').textContent = LOADING_LINES[0];
    const ticker = setInterval(() => { li = (li + 1) % LOADING_LINES.length; $('#loadingText').textContent = LOADING_LINES[li]; }, 900);
    const minWait = new Promise((r) => setTimeout(r, 700));

    try {
      let entries, title, icon, notice = '';
      if (text) {
        const res = await custom.buildCustomEntries(text, difficulty, cfg, bank);
        entries = res.entries;
        notice = res.notice;
        title = titleCase(text);
        icon = '✨';
      } else {
        const theme = bank.themes.find((t) => t.id === selTheme) || bank.themes[0];
        entries = theme.entries;
        title = theme.name;
        icon = theme.icon;
      }

      // Words used recently get pushed down the list so each puzzle feels fresh.
      const recent = new Set(store.get('recent', []));
      entries = entries.map((e) => Object.assign({}, e, { priority: (e.priority || 0) - (recent.has(e.answer) ? 3.5 : 0) }));

      await new Promise((r) => setTimeout(r, 30)); // let the loader paint
      const seed = (Date.now() ^ Math.floor(Math.random() * 2 ** 32)) >>> 0;
      const puzzle = generator.generate(entries, cfg, seed);
      await minWait;
      if (!puzzle || puzzle.words.length < 4) throw new Error('Could not build a puzzle from that theme.');

      const used = puzzle.words.map((w) => w.answer);
      store.set('recent', used.concat([...recent]).slice(0, 160));

      Object.assign(puzzle, { title, icon, difficulty, notice, seed, created: Date.now() });
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
        autocheck: cfg.autocheck
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

    // header
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
    const size = Math.floor(Math.max(18, Math.min(52, availW / G.W, Math.max(availH, 240) / G.H)));
    document.documentElement.style.setProperty('--cell-size', size + 'px');
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

  function afterChange(idxs) {
    const words = new Set();
    for (const i of idxs) {
      paintCell(i);
      for (const d of ['across', 'down']) { const wi = wordIdx(i, d); if (wi >= 0) words.add(wi); }
    }
    words.forEach(paintClueDone);
    updateProgress();
    scheduleSave();
    checkComplete();
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
    afterChange(cells);
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
      afterChange(cells);
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
      afterChange(filled);
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
      afterChange(all);
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
    const assisted = G.reveals > 0;
    const stats = store.get('stats', { solved: 0, best: {} });
    let bestMsg = '';
    if (!assisted) {
      stats.solved = (stats.solved || 0) + 1;
      const prev = stats.best[G.puzzle.difficulty];
      if (!prev || G.elapsed < prev) {
        stats.best[G.puzzle.difficulty] = G.elapsed;
        bestMsg = prev ? `⚡ New personal best for ${DIFFICULTIES[G.puzzle.difficulty].label}!` : '';
      } else bestMsg = `Your best ${DIFFICULTIES[G.puzzle.difficulty].label} time: ${fmtTime(prev)}`;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 864e5).toDateString();
      if (stats.lastDay !== today) stats.streak = stats.lastDay === yesterday ? (stats.streak || 0) + 1 : 1;
      stats.lastDay = today;
      store.set('stats', stats);
    }
    $('#grid').classList.add('solved');
    G.cellEls.forEach((el, i) => { el.style.animationDelay = ((i % G.W) + Math.floor(i / G.W)) * 25 + 'ms'; });
    if (!assisted) confetti();
    setTimeout(() => {
      $('#winTitle').textContent = assisted ? 'Puzzle complete!' : 'Puzzle solved!';
      $('.win-burst').textContent = assisted ? '🧩' : '🎉';
      $('#winSub').textContent = `${G.puzzle.icon} ${G.puzzle.title} · ${DIFFICULTIES[G.puzzle.difficulty].label}`;
      $('#winTime').textContent = fmtTime(G.elapsed);
      $('#winWords').textContent = G.puzzle.words.length;
      $('#winHelp').textContent = G.reveals;
      $('#winBest').textContent = assisted ? 'Solve one without reveals to set a best time.' : bestMsg;
      openModal('winModal');
    }, assisted ? 300 : 900);
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
    const colors = ['#e5603b', '#f5b347', '#2f6f73', '#6cc3c4', '#e8a0bf', '#7aa95c'];
    const parts = Array.from({ length: 160 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4,
      s: 6 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      c: colors[(Math.random() * colors.length) | 0]
    }));
    const start = performance.now();
    (function frame(t) {
      const age = t - start;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of parts) {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.globalAlpha = Math.max(0, 1 - age / 3200);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      }
      if (age < 3200) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(start);
  }

  // =====================================================
  // Boot
  // =====================================================
  renderSetup();
  show('setupView');
})();
