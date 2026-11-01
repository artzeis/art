#!/usr/bin/env node
/* Sanity checks for the word bank and generator: node scripts/check.js */
'use strict';
const bank = require('../js/wordbank.js');
const { generate } = require('../js/generator.js');
const { DIFFICULTIES } = require('../js/config.js');

let failures = 0;
const fail = (msg) => { failures++; console.error('FAIL:', msg); };

// 1. Word bank hygiene
for (const t of bank.themes) {
  const seen = new Set();
  for (const e of t.entries) {
    if (!/^[A-Z]+$/.test(e.answer)) fail(`${t.id}: bad answer "${e.answer}"`);
    if (seen.has(e.answer)) fail(`${t.id}: duplicate ${e.answer}`);
    seen.add(e.answer);
    for (const clue of [e.easy, e.hard]) {
      if (!clue) fail(`${t.id}: ${e.answer} missing clue`);
      else if (clue.toUpperCase().replace(/[^A-Z]/g, '').includes(e.answer) && e.answer.length > 3)
        fail(`${t.id}: clue for ${e.answer} gives away the answer: "${clue}"`);
    }
  }
}

// 2. Generator output integrity
function check(p, label) {
  const { width: W, height: H, solution, words } = p;
  const grid = new Array(W * H).fill(null);
  for (const w of words) {
    for (let i = 0; i < w.len; i++) {
      const r = w.row + (w.dir === 'down' ? i : 0);
      const c = w.col + (w.dir === 'across' ? i : 0);
      if (r >= H || c >= W) return fail(`${label}: word out of bounds`);
      grid[r * W + c] = w.answer[i];
    }
  }
  for (let i = 0; i < W * H; i++) if (grid[i] !== solution[i]) return fail(`${label}: solution mismatch`);
  // connectivity
  const start = solution.findIndex(Boolean);
  const seen = new Set([start]);
  const stack = [start];
  while (stack.length) {
    const i = stack.pop();
    const r = (i / W) | 0, c = i % W;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const rr = r + dr, cc = c + dc;
      if (rr < 0 || cc < 0 || rr >= H || cc >= W) continue;
      const j = rr * W + cc;
      if (solution[j] && !seen.has(j)) { seen.add(j); stack.push(j); }
    }
  }
  if (seen.size !== solution.filter(Boolean).length) fail(`${label}: grid not connected`);
}

const stats = {};
for (const [dk, cfg] of Object.entries(DIFFICULTIES)) {
  for (const t of bank.themes) {
    let total = 0, minWords = Infinity, maxDim = 0, ms = 0;
    const runs = 25;
    for (let s = 0; s < runs; s++) {
      const t0 = Date.now();
      const p = generate(t.entries, cfg, s * 7919 + 13);
      ms += Date.now() - t0;
      if (!p) { fail(`${dk}/${t.id}: no puzzle`); continue; }
      check(p, `${dk}/${t.id}/${s}`);
      total += p.words.length;
      minWords = Math.min(minWords, p.words.length);
      maxDim = Math.max(maxDim, p.width, p.height);
    }
    stats[`${dk}/${t.id}`] = { avgWords: +(total / runs).toFixed(1), minWords, maxDim, avgMs: Math.round(ms / runs) };
  }
}
console.table(stats);
console.log(failures ? `${failures} failure(s)` : 'All checks passed');
process.exit(failures ? 1 : 0);
