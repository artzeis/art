/*
 * Hero "live preview": a mini crossword that solves itself using words from
 * the currently selected theme, so players see what they're about to get.
 */
(function (root) {
  'use strict';

  let token = 0;
  let host = null;

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  function findPair(entries) {
    const pool = entries.filter((e) => /^[A-Z]+$/.test(e.answer));
    const across = pool.filter((e) => e.answer.length >= 5 && e.answer.length <= 7);
    const down = pool.filter((e) => e.answer.length >= 4 && e.answer.length <= 6);
    if (!across.length || !down.length) return null;
    for (let t = 0; t < 120; t++) {
      const A = pick(across), B = pick(down);
      if (A.answer === B.answer) continue;
      const spots = [];
      for (let i = 0; i < A.answer.length; i++) {
        for (let j = 0; j < B.answer.length; j++) if (A.answer[i] === B.answer[j]) spots.push([i, j]);
      }
      if (spots.length) { const [i, j] = pick(spots); return { A, B, i, j }; }
    }
    return null;
  }

  function build(pair) {
    const { A, B, i, j } = pair;
    const W = A.answer.length, H = B.answer.length;
    const grid = host.querySelector('.demo-grid');
    grid.style.gridTemplateColumns = `repeat(${W}, var(--demo-cell))`;
    grid.innerHTML = '';
    const cells = [];
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const d = document.createElement('div');
        const inA = r === j, inB = c === i;
        d.className = 'demo-cell' + (inA || inB ? '' : ' empty');
        if (inA || inB) d.innerHTML = '<span></span>';
        grid.appendChild(d);
        cells.push(d);
      }
    }
    // numbering: whichever start comes first in reading order is 1
    const startA = j * W, startB = i;
    const nums = startA === startB ? { a: 1, b: 1 } : (startB < startA ? { b: 1, a: 2 } : { a: 1, b: 2 });
    const tag = (idx, num) => { if (!cells[idx].querySelector('i')) { const n = document.createElement('i'); n.textContent = num; cells[idx].appendChild(n); } };
    tag(startB < startA ? startB : startA, 1);
    if (startA !== startB) tag(startB < startA ? startA : startB, 2);
    const aCells = Array.from({ length: W }, (_, c) => j * W + c);
    const bCells = Array.from({ length: H }, (_, r) => r * W + i);
    return { cells, aCells, bCells, nums };
  }

  async function typeWord(my, cells, idxs, word, clueEl, label, clue) {
    clueEl.innerHTML = '';
    const b = document.createElement('b');
    b.textContent = label;
    clueEl.appendChild(b);
    clueEl.appendChild(document.createTextNode(clue));
    idxs.forEach((k) => cells[k].classList.add('hl'));
    for (let n = 0; n < idxs.length; n++) {
      if (my !== token) return false;
      const cell = cells[idxs[n]];
      cell.classList.add('cur');
      await wait(110);
      if (my !== token) return false;
      const span = cell.querySelector('span');
      if (!span.textContent) { span.textContent = word[n]; cell.classList.add('pop'); }
      await wait(150);
      cell.classList.remove('cur');
    }
    idxs.forEach((k, n) => setTimeout(() => cells[k].classList.add('ok'), n * 50));
    await wait(450 + idxs.length * 50);
    idxs.forEach((k) => cells[k].classList.remove('hl'));
    return my === token;
  }

  async function run(my, entries) {
    while (my === token) {
      const setup = document.getElementById('setupView');
      if (!host || (setup && setup.hidden) || document.hidden) { await wait(800); continue; }
      const pair = findPair(entries);
      if (!pair) return;
      host.classList.remove('fade');
      const { cells, aCells, bCells, nums } = build(pair);
      const clueEl = host.querySelector('.demo-clue');
      await wait(400);
      const first = nums.a <= nums.b
        ? [[aCells, pair.A, `${nums.a} ACROSS`], [bCells, pair.B, `${nums.b} DOWN`]]
        : [[bCells, pair.B, `${nums.b} DOWN`], [aCells, pair.A, `${nums.a} ACROSS`]];
      for (const [idxs, e, label] of first) {
        if (!(await typeWord(my, cells, idxs, e.answer, clueEl, label, e.easy))) return;
      }
      if (my !== token) return;
      host.classList.add('solved');
      await wait(1600);
      host.classList.remove('solved');
      host.classList.add('fade');
      await wait(450);
    }
  }

  function start(el, entries) {
    host = el;
    token++;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const pair = findPair(entries);
      if (!pair) return;
      const { cells, aCells, bCells } = build(pair);
      aCells.forEach((k, n) => { cells[k].querySelector('span').textContent = pair.A.answer[n]; });
      bCells.forEach((k, n) => { cells[k].querySelector('span').textContent = pair.B.answer[n]; });
      host.querySelector('.demo-clue').textContent = pair.A.easy;
      return;
    }
    run(token, entries);
  }

  root.CW = Object.assign(root.CW || {}, { demo: { start } });
})(window);
