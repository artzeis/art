/*
 * Wordweave crossword generator.
 *
 * Builds a free-form (American "criss-cross" style) puzzle: words are laid
 * across and down so that every word interlocks with the rest, no two
 * letters touch unless they belong to a crossing, and no accidental words
 * are formed. Many randomized attempts are made and the best layout wins.
 */
(function (root) {
  'use strict';

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

  function attempt(pool, cfg, rng) {
    const N = cfg.size;
    const grid = new Array(N * N).fill('');
    const own = { across: new Int16Array(N * N).fill(-1), down: new Int16Array(N * N).fill(-1) };
    const placed = [];
    let bbox = null;
    let crossings = 0;

    // Order words: longer & theme-priority words first, with plenty of randomness.
    const order = pool
      .map((e) => ({ e, k: e.answer.length * 0.55 + rng() * 5 + (e.priority || 0) }))
      .sort((a, b) => b.k - a.k)
      .slice(0, Math.max(cfg.target * 9, 90))
      .map((x) => x.e);

    function fits(word, r, c, dir) {
      const dr = dir === 'down' ? 1 : 0;
      const dc = dir === 'across' ? 1 : 0;
      const L = word.length;
      const er = r + dr * (L - 1);
      const ec = c + dc * (L - 1);
      if (r < 0 || c < 0 || er >= N || ec >= N) return -1;
      // cells immediately before and after must be empty
      const br = r - dr, bc = c - dc, ar = er + dr, ac = ec + dc;
      if (br >= 0 && bc >= 0 && grid[br * N + bc]) return -1;
      if (ar < N && ac < N && grid[ar * N + ac]) return -1;
      let inter = 0;
      for (let i = 0; i < L; i++) {
        const rr = r + dr * i, cc = c + dc * i;
        const idx = rr * N + cc;
        const ch = grid[idx];
        if (ch) {
          if (ch !== word[i]) return -1;
          if (own[dir][idx] !== -1) return -1;
          inter++;
        } else {
          // side neighbours must be empty, otherwise we'd create stray words
          const s1r = rr + dc, s1c = cc + dr, s2r = rr - dc, s2c = cc - dr;
          if (s1r < N && s1c < N && grid[s1r * N + s1c]) return -1;
          if (s2r >= 0 && s2c >= 0 && grid[s2r * N + s2c]) return -1;
        }
      }
      if (inter === L) return -1;
      return inter;
    }

    function put(entry, r, c, dir) {
      const dr = dir === 'down' ? 1 : 0;
      const dc = dir === 'across' ? 1 : 0;
      const w = entry.answer;
      const wi = placed.length;
      for (let i = 0; i < w.length; i++) {
        const idx = (r + dr * i) * N + (c + dc * i);
        if (grid[idx]) crossings++;
        grid[idx] = w[i];
        own[dir][idx] = wi;
      }
      placed.push({ entry, r, c, dir });
      const er = r + dr * (w.length - 1), ec = c + dc * (w.length - 1);
      if (!bbox) bbox = { r0: r, c0: c, r1: er, c1: ec };
      else {
        bbox.r0 = Math.min(bbox.r0, r); bbox.c0 = Math.min(bbox.c0, c);
        bbox.r1 = Math.max(bbox.r1, er); bbox.c1 = Math.max(bbox.c1, ec);
      }
    }

    function growth(word, r, c, dir) {
      const er = dir === 'down' ? r + word.length - 1 : r;
      const ec = dir === 'across' ? c + word.length - 1 : c;
      const r0 = Math.min(bbox.r0, r), c0 = Math.min(bbox.c0, c);
      const r1 = Math.max(bbox.r1, er), c1 = Math.max(bbox.c1, ec);
      const h = r1 - r0 + 1, w = c1 - c0 + 1;
      const oldArea = (bbox.r1 - bbox.r0 + 1) * (bbox.c1 - bbox.c0 + 1);
      // penalise growth and lopsided shapes
      return (h * w - oldArea) / N + Math.abs(h - w) * 0.35;
    }

    function bestSpot(word) {
      let best = null;
      for (let idx = 0; idx < grid.length; idx++) {
        const ch = grid[idx];
        if (!ch) continue;
        const r = (idx / N) | 0, c = idx % N;
        for (let i = 0; i < word.length; i++) {
          if (word[i] !== ch) continue;
          if (own.across[idx] === -1) {
            const inter = fits(word, r, c - i, 'across');
            if (inter > 0) {
              const s = inter * 10 - growth(word, r, c - i, 'across') + rng() * 6;
              if (!best || s > best.s) best = { r, c: c - i, dir: 'across', s };
            }
          }
          if (own.down[idx] === -1) {
            const inter = fits(word, r - i, c, 'down');
            if (inter > 0) {
              const s = inter * 10 - growth(word, r - i, c, 'down') + rng() * 6;
              if (!best || s > best.s) best = { r: r - i, c, dir: 'down', s };
            }
          }
        }
      }
      return best;
    }

    // Seed word, roughly centred.
    const first = order[0];
    const dir0 = rng() < 0.5 ? 'across' : 'down';
    const mid = Math.floor(N / 2);
    const off = Math.floor((N - first.answer.length) / 2);
    if (dir0 === 'across') put(first, mid, off, 'across');
    else put(first, off, mid, 'down');

    let remaining = order.slice(1);
    for (let pass = 0; pass < 3 && placed.length < cfg.target && remaining.length; pass++) {
      const next = [];
      for (const e of remaining) {
        if (placed.length >= cfg.target) break;
        const spot = bestSpot(e.answer);
        if (spot) put(e, spot.r, spot.c, spot.dir);
        else next.push(e);
      }
      remaining = next;
    }

    return { grid, placed, bbox, crossings, N };
  }

  function scoreAttempt(a, cfg) {
    const h = a.bbox.r1 - a.bbox.r0 + 1;
    const w = a.bbox.c1 - a.bbox.c0 + 1;
    let letters = 0;
    for (const ch of a.grid) if (ch) letters++;
    const density = letters / (h * w);
    const themed = a.placed.filter((p) => !p.entry.filler).length;
    return (
      Math.min(a.placed.length, cfg.target) * 30 +
      themed * 12 +
      a.crossings * 6 +
      density * 60 -
      Math.abs(h - w) * 3
    );
  }

  // Every horizontal/vertical run of 2+ letters must be exactly one placed word.
  function validate(a) {
    const { grid, placed, N } = a;
    const starts = new Set(placed.map((p) => `${p.dir}:${p.r}:${p.c}:${p.entry.answer.length}`));
    for (const dir of ['across', 'down']) {
      for (let line = 0; line < N; line++) {
        let runStart = -1;
        for (let k = 0; k <= N; k++) {
          const r = dir === 'across' ? line : k;
          const c = dir === 'across' ? k : line;
          const filled = k < N && grid[r * N + c];
          if (filled && runStart === -1) runStart = k;
          if (!filled && runStart !== -1) {
            const len = k - runStart;
            if (len >= 2) {
              const sr = dir === 'across' ? line : runStart;
              const sc = dir === 'across' ? runStart : line;
              if (!starts.has(`${dir}:${sr}:${sc}:${len}`)) return false;
            }
            runStart = -1;
          }
        }
      }
    }
    return true;
  }

  function finalize(a, cfg, rng) {
    const { grid, placed, bbox, N } = a;
    const H = bbox.r1 - bbox.r0 + 1;
    const W = bbox.c1 - bbox.c0 + 1;
    const solution = [];
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) solution.push(grid[(r + bbox.r0) * N + (c + bbox.c0)] || null);
    }
    const words = placed.map((p) => {
      let clue;
      if (cfg.clueMode === 'easy') clue = p.entry.easy;
      else if (cfg.clueMode === 'hard') clue = p.entry.hard;
      else clue = rng() < 0.5 ? p.entry.hard : p.entry.easy;
      const main = clue || p.entry.easy || p.entry.hard;
      const other = main === p.entry.easy ? p.entry.hard : p.entry.easy;
      return {
        answer: p.entry.answer,
        clue: main,
        alt: other && other !== main ? other : null,
        dir: p.dir,
        row: p.r - bbox.r0,
        col: p.c - bbox.c0,
        len: p.entry.answer.length,
        filler: !!p.entry.filler
      };
    });
    // Standard numbering: reading order, shared numbers for shared starts.
    const startKeys = [...new Set(words.map((w) => w.row * W + w.col))].sort((x, y) => x - y);
    const numOf = new Map(startKeys.map((k, i) => [k, i + 1]));
    for (const w of words) w.number = numOf.get(w.row * W + w.col);
    words.sort((x, y) => (x.dir === y.dir ? x.number - y.number : x.dir === 'across' ? -1 : 1));
    return { width: W, height: H, solution, words };
  }

  /**
   * entries: [{ answer, easy, hard, priority?, filler? }]
   * cfg: { size, minLen, maxLen, target, clueMode, attempts, timeBudget }
   */
  function generate(entries, cfg, seed) {
    const rng = mulberry32(seed == null ? (Math.random() * 2 ** 32) >>> 0 : seed);
    const maxLen = Math.min(cfg.maxLen, cfg.size);
    const seen = new Set();
    const pool = entries.filter((e) => {
      const ok = /^[A-Z]+$/.test(e.answer) && e.answer.length >= cfg.minLen && e.answer.length <= maxLen && !seen.has(e.answer);
      if (ok) seen.add(e.answer);
      return ok;
    });
    if (pool.length < 2) return null;

    const deadline = now() + (cfg.timeBudget || 900);
    let best = null;
    let bestScore = -Infinity;
    const attempts = cfg.attempts || 60;
    for (let i = 0; i < attempts; i++) {
      const a = attempt(pool, cfg, rng);
      if (!validate(a)) continue;
      const s = scoreAttempt(a, cfg);
      if (s > bestScore) { best = a; bestScore = s; }
      if (best && now() > deadline) break;
    }
    if (!best) return null;
    return finalize(best, cfg, rng);
  }

  const api = { generate, mulberry32 };
  root.CW = Object.assign(root.CW || {}, { generator: api });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
