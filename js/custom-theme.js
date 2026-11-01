/*
 * Builds a word list for any theme the player types in.
 *
 * 1. Asks the free Datamuse API (https://www.datamuse.com/api/) for words
 *    related to the theme, along with dictionary definitions that become clues.
 * 2. Adds matching words from the built-in bank (by theme keyword or clue text).
 * 3. Tops up with general words if the theme is very narrow, so a puzzle can
 *    always be built — even offline.
 */
(function (root) {
  'use strict';

  const BANNED_DEF = /\b(vulgar|obscene|offensive|derogatory|disparaging|slur|ethnic)\b/i;
  const MIN_FREQ = { easy: 2, medium: 0.4, hard: 0.05 };

  function stem(w) {
    w = w.toLowerCase();
    if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
    if (w.length > 4 && w.endsWith('es') && /(s|x|z|ch|sh)es$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
    return w;
  }

  function tokens(text) {
    return text.toLowerCase().split(/[^a-z]+/).filter((t) => t.length >= 3).map(stem);
  }

  function cleanDef(def) {
    let d = def.replace(/^[a-z]+\t/, '').trim();
    d = d.split(';')[0].trim();
    d = d.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
    if (d.length > 90) d = d.slice(0, 87).replace(/\s+\S*$/, '') + '…';
    return d.charAt(0).toUpperCase() + d.slice(1);
  }

  function pickClue(word, defs) {
    if (!defs || !defs.length) return null;
    const lw = word.toLowerCase();
    const root4 = lw.slice(0, Math.max(4, lw.length - 2));
    for (const raw of defs) {
      if (BANNED_DEF.test(raw)) return null; // skip the word entirely
      const d = cleanDef(raw);
      const low = d.toLowerCase();
      if (d.length < 6 || low.includes(lw) || low.includes(root4)) continue;
      return d;
    }
    return null;
  }

  async function fetchJSON(url, ms) {
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = setTimeout(() => ctrl && ctrl.abort(), ms);
    try {
      const res = await fetch(url, ctrl ? { signal: ctrl.signal } : undefined);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  async function fromDatamuse(text, difficulty, maxLen) {
    const q = encodeURIComponent(text.trim().toLowerCase());
    const base = 'https://api.datamuse.com/words?md=df&max=250';
    const urls = [`${base}&ml=${q}`, `${base}&rel_trg=${q}`, `${base}&topics=${q}&ml=${q}`];
    const results = await Promise.allSettled(urls.map((u) => fetchJSON(u, 7000)));
    const ok = results.filter((r) => r.status === 'fulfilled');
    if (!ok.length) throw new Error('offline');

    const themeStems = new Set(tokens(text));
    const minFreq = MIN_FREQ[difficulty] ?? 0.4;
    const seen = new Set();
    const out = [];
    ok.forEach((r, source) => {
      (r.value || []).forEach((item, rank) => {
        const w = item.word;
        if (!/^[a-z]+$/.test(w) || w.length < 3 || w.length > maxLen) return;
        const sw = stem(w);
        // don't use the theme itself (or a chunk of it) as an answer
        if ([...themeStems].some((t) => t === sw || (sw.length >= 4 && (t.startsWith(sw) || sw.startsWith(t))))) return;
        const answer = w.toUpperCase();
        if (seen.has(answer)) return;
        const tags = item.tags || [];
        if (tags.includes('prop')) return;
        const f = tags.find((t) => t.startsWith('f:'));
        const freq = f ? parseFloat(f.slice(2)) : 0;
        if (freq < minFreq) return;
        const clue = pickClue(w, item.defs);
        if (!clue) return;
        seen.add(answer);
        // Earlier results are more on-theme; ml (source 0) is the best signal.
        out.push({ answer, easy: clue, hard: clue, priority: 6 - source - rank / 60 });
      });
    });
    return out;
  }

  function fromBank(text, bank) {
    const toks = tokens(text);
    if (!toks.length) return [];
    const matches = [];
    const seen = new Set();
    const add = (e, priority) => {
      if (seen.has(e.answer)) return;
      seen.add(e.answer);
      matches.push(Object.assign({}, e, { priority }));
    };
    for (const t of bank.themes) {
      if (t.id === 'general') continue;
      const hit = toks.some((tok) =>
        stem(t.name).includes(tok) || t.keywords.some((k) => stem(k) === tok || (tok.length >= 5 && stem(k).includes(tok)))
      );
      if (hit) t.entries.forEach((e) => add(e, 3));
    }
    for (const e of bank.general.entries) {
      const hay = `${e.answer} ${e.easy} ${e.hard}`.toLowerCase();
      const words = hay.split(/[^a-z]+/).map(stem);
      if (toks.some((tok) => words.includes(tok))) add(e, 4);
    }
    return matches;
  }

  /**
   * Returns { entries, notice, onlineCount }.
   */
  async function buildCustomEntries(text, difficulty, cfg, bank) {
    let online = [];
    let offline = false;
    try {
      online = await fromDatamuse(text, difficulty, Math.min(cfg.maxLen, cfg.size));
    } catch (e) {
      offline = true;
    }
    const local = fromBank(text, bank);
    const seen = new Set();
    const entries = [];
    for (const e of local.concat(online)) {
      if (seen.has(e.answer)) continue;
      seen.add(e.answer);
      entries.push(e);
    }
    const usable = entries.filter((e) => e.answer.length >= cfg.minLen && e.answer.length <= cfg.maxLen).length;
    let notice = '';
    const wanted = Math.ceil(cfg.target * 1.5);
    if (usable < wanted) {
      for (const e of bank.general.entries) {
        if (seen.has(e.answer)) continue;
        seen.add(e.answer);
        entries.push(Object.assign({}, e, { filler: true, priority: -4 }));
      }
      if (offline && usable === 0) {
        notice = `We couldn't reach the word service, so “${text}” became a general-knowledge puzzle. Check your connection or pick a built-in theme.`;
      } else if (offline) {
        notice = `Offline mode: we found ${usable} “${text}” words in the built-in library and mixed in some general ones.`;
      } else {
        notice = `“${text}” is a niche theme — we found ${usable} matching words and filled the rest with general knowledge.`;
      }
    }
    return { entries, notice, onlineCount: online.length };
  }

  const api = { buildCustomEntries, _internals: { stem, tokens, pickClue, cleanDef, fromBank } };
  root.CW = Object.assign(root.CW || {}, { custom: api });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
