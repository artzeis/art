/*
 * Player progression: XP, levels with titles, badges and the Daily Puzzle.
 */
(function (root) {
  'use strict';

  const TITLES = [
    'Rookie Weaver', 'Letter Scout', 'Clue Cadet', 'Grid Runner', 'Word Pilot',
    'Puzzle Ranger', 'Cipher Knight', 'Lexicon Captain', 'Crossword Commander', 'Grand Weaver'
  ];

  const BASE_XP = { easy: 100, medium: 200, hard: 350 };
  const PAR = { easy: 240, medium: 540, hard: 900 }; // seconds

  function needFor(level) { return 300 + 150 * (level - 1); }

  function levelFor(xp) {
    let level = 1, rem = Math.max(0, xp || 0);
    while (rem >= needFor(level)) { rem -= needFor(level); level++; }
    const title = level <= TITLES.length ? TITLES[level - 1] : `${TITLES[TITLES.length - 1]} ${toRoman(level - TITLES.length + 1)}`;
    return { level, into: rem, need: needFor(level), title };
  }

  function toRoman(n) {
    const map = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let out = '';
    for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
    return out;
  }

  /** XP earned for a finished puzzle. */
  function xpFor({ difficulty, elapsed, reveals, maxCombo, daily, mode, timeLeft }) {
    const base = BASE_XP[difficulty] || 150;
    const par = PAR[difficulty] || 540;
    let speed = Math.max(0, Math.round(((par - elapsed) / par) * base * 0.6));
    if (mode === 'zen') speed = 0;
    // Time Attack rewards seconds left on the clock, capped so it can't dwarf the solve itself
    if (mode === 'attack') speed = Math.min(Math.round(base * 0.8), Math.round(Math.max(0, timeLeft || 0) * 0.5));
    const combo = Math.min(5, Math.max(0, (maxCombo || 1) - 1)) * 10;
    const dailyBonus = daily ? 100 : 0;
    let total = base + speed + combo + dailyBonus;
    if (reveals) total = Math.round(total * 0.4);
    return { total, base, speed, combo, dailyBonus, assisted: !!reveals };
  }

  const BADGES = [
    { id: 'first', icon: '🌟', name: 'First Weave', desc: 'Solve your first puzzle' },
    { id: 'speed', icon: '⚡', name: 'Lightning', desc: 'Solve an Easy puzzle in under 2 minutes' },
    { id: 'brain', icon: '🧠', name: 'Big Brain', desc: 'Solve a Hard puzzle with no reveals' },
    { id: 'streak', icon: '🔥', name: 'On Fire', desc: 'Solve puzzles 3 days in a row' },
    { id: 'explorer', icon: '🧭', name: 'Explorer', desc: 'Solve puzzles in 5 different themes' },
    { id: 'creator', icon: '✨', name: 'Trailblazer', desc: 'Solve a puzzle on your own custom theme' },
    { id: 'daily', icon: '📅', name: 'Daily Devotee', desc: 'Solve a Daily Puzzle' },
    { id: 'combo', icon: '💥', name: 'Combo Master', desc: 'Hit a ×5 word combo' },
    { id: 'decorated', icon: '🏆', name: 'Decorated', desc: 'Solve 10 puzzles' },
    { id: 'beatclock', icon: '⏱️', name: 'Beat the Clock', desc: 'Finish a Time Attack puzzle before time runs out' },
    { id: 'zen', icon: '🍃', name: 'Inner Peace', desc: 'Solve a puzzle in Zen mode' },
    { id: 'collector', icon: '📚', name: 'Collector', desc: 'Collect 100 words in your Wordbook' }
  ];

  /** Returns the ids of badges newly earned, given updated stats and the solve that just happened. */
  function newBadges(stats, solve) {
    const have = new Set(stats.badges || []);
    const earned = [];
    const award = (id, cond) => { if (cond && !have.has(id)) { earned.push(id); have.add(id); } };
    const clean = !solve.reveals;
    award('first', clean && stats.solved >= 1);
    award('speed', clean && solve.difficulty === 'easy' && solve.elapsed < 120);
    award('brain', clean && solve.difficulty === 'hard');
    award('streak', (stats.streak || 0) >= 3);
    award('explorer', (stats.themes || []).length >= 5);
    award('creator', clean && solve.custom);
    award('daily', clean && solve.daily);
    award('combo', (solve.maxCombo || 0) >= 5);
    award('decorated', stats.solved >= 10);
    award('beatclock', solve.mode === 'attack' && solve.completed);
    award('zen', clean && solve.mode === 'zen');
    award('collector', Object.keys(stats.words || {}).length >= 100);
    return earned;
  }

  // ---------- Daily puzzle ----------
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function daily(bank, date) {
    const d = date || new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const dayNum = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
    const themes = bank.themes.filter((t) => t.id !== 'general');
    const theme = themes[(dayNum * 7) % themes.length];
    const label = d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    return { key, label, theme, seed: hash('wordweave-daily-' + key), difficulty: 'medium' };
  }

  root.CW = Object.assign(root.CW || {}, { progress: { levelFor, xpFor, BADGES, newBadges, daily } });
})(window);
