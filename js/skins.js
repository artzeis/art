/*
 * Wordweave theme "skins": every theme gets its own palette, display font,
 * background motif and ambient animation.
 */
(function (root) {
  'use strict';

  // ---- Background motifs (SVG tiles used as CSS masks, so they take the theme colour) ----
  const P = (w, h, body) => `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${body}</svg>`;
  const paw = `<ellipse cx='0' cy='6' rx='7' ry='6'/><circle cx='-8' cy='-4' r='3'/><circle cx='-3' cy='-10' r='3'/><circle cx='3' cy='-10' r='3'/><circle cx='8' cy='-4' r='3'/>`;
  const star4 = 'M0,-7 L1.6,-1.6 L7,0 L1.6,1.6 L0,7 L-1.6,1.6 L-7,0 L-1.6,-1.6Z';
  const leaf = `<path d='M0 -14 C 9 -7 9 7 0 14 C -9 7 -9 -7 0 -14Z'/><path d='M0 -14 V14' stroke='#fff' stroke-width='1.2'/>`;
  const S = "fill='none' stroke='#000' stroke-linecap='round' stroke-linejoin='round'";

  const MOTIFS = {
    paw: P(140, 140, `<g transform='translate(34 38) rotate(-20)'>${paw}</g><g transform='translate(100 104) rotate(25)'>${paw}</g>`),
    stars: P(160, 160, `<circle cx='12' cy='20' r='1.4'/><circle cx='70' cy='8' r='1'/><circle cx='130' cy='40' r='1.6'/><circle cx='40' cy='90' r='1'/><circle cx='100' cy='120' r='1.3'/><circle cx='150' cy='140' r='1'/><circle cx='20' cy='145' r='1.5'/><path transform='translate(90 70)' d='${star4}'/><path transform='translate(30 50) scale(.6)' d='${star4}'/>`),
    dots: P(48, 48, `<circle cx='12' cy='12' r='5'/><circle cx='36' cy='36' r='5'/>`),
    field: P(180, 120, `<g ${S} stroke-width='2'><rect x='4' y='4' width='172' height='112' rx='4'/><path d='M90 4 V116'/><circle cx='90' cy='60' r='18'/><rect x='4' y='34' width='22' height='52'/><rect x='154' y='34' width='22' height='52'/></g>`),
    staff: P(220, 90, `<g ${S} stroke-width='1.4'><path d='M0 20H220M0 30H220M0 40H220M0 50H220M0 60H220'/><path d='M66 52V22M156 42V12' stroke-width='2'/></g><ellipse cx='61' cy='54' rx='6' ry='4.5' transform='rotate(-20 61 54)'/><ellipse cx='151' cy='44' rx='6' ry='4.5' transform='rotate(-20 151 44)'/>`),
    leaf: P(140, 140, `<g transform='translate(36 40) rotate(35)'>${leaf}</g><g transform='translate(104 100) rotate(-40)'>${leaf}</g>`),
    waves: P(120, 44, `<g ${S} stroke-width='2'><path d='M0 14 Q 15 4 30 14 T 60 14 T 90 14 T 120 14'/><path d='M0 36 Q 15 26 30 36 T 60 36 T 90 36 T 120 36' opacity='.6'/></g>`),
    hex: P(34.64, 60, `<path ${S} stroke-width='1.3' d='M17.32 0 L34.64 10 L34.64 30 L17.32 40 L0 30 L0 10 Z M17.32 40 L17.32 60'/>`),
    globe: P(140, 140, `<g ${S} stroke-width='1.4'><circle cx='70' cy='70' r='52'/><ellipse cx='70' cy='70' rx='24' ry='52'/><path d='M18 70H122M26 44H114M26 96H114M70 18V122'/></g>`),
    meander: P(48, 48, `<path ${S} stroke-width='3' stroke-linecap='square' stroke-linejoin='miter' d='M0 44 H44 V4 H10 V34 H34 V14 H20 V24'/>`),
    circuit: P(120, 120, `<g ${S} stroke-width='2'><path d='M10 14 H44 V46 H82'/><path d='M104 20 V64 H70 V104'/><path d='M18 104 V72 H44'/></g><circle cx='10' cy='14' r='3.5'/><circle cx='82' cy='46' r='3.5'/><circle cx='104' cy='20' r='3.5'/><circle cx='70' cy='104' r='3.5'/><circle cx='44' cy='72' r='3.5'/>`),
    squiggle: P(140, 140, `<path ${S} stroke-width='3.5' d='M12 34 q 10 -16 20 0 t 20 0 t 20 0'/><path ${S} stroke-width='3' d='M80 104 c 10 -20 30 10 40 -10'/><circle cx='104' cy='40' r='7'/><circle cx='30' cy='100' r='4'/><circle cx='120' cy='70' r='2.5'/>`),
    sparkle: P(150, 150, `<path transform='translate(36 40)' d='${star4}'/><path transform='translate(110 100) scale(1.3)' d='${star4}'/><path transform='translate(120 26) scale(.6)' d='${star4}'/><circle cx='50' cy='120' r='2'/>`),
    grid: P(44, 44, `<path ${S} stroke-width='1' d='M44 0H0V44'/>`)
  };

  // a1 = primary, a2 = secondary, a3 = highlight, on = text colour on accent fills
  const SKINS = {
    animals: { a1: '#ffb547', a2: '#4ade80', a3: '#f97316', on: '#1c1204', font: "'Fredoka'", motif: 'paw', tag: 'Into the wild',
      fx: { mode: 'float', glyphs: ['🐾'], count: 14, size: [16, 26], alpha: 0.2 } },
    space: { a1: '#a78bfa', a2: '#22d3ee', a3: '#f472b6', on: '#0b0820', font: "'Orbitron'", motif: 'stars', tag: 'Orbit unlocked',
      fx: { mode: 'stars', count: 150 } },
    food: { a1: '#ff6b6b', a2: '#ffc94a', a3: '#ff9ec4', on: '#220606', font: "'Fredoka'", motif: 'dots', tag: 'Order up',
      fx: { mode: 'fall', glyphs: ['🍕', '🍓', '🧁', '🍩', '🥑', '🍋', '🌮'], count: 14, size: [18, 28], alpha: 0.28 } },
    sports: { a1: '#b6f22e', a2: '#38bdf8', a3: '#f8fafc', on: '#0c1600', font: "'Orbitron'", motif: 'field', tag: 'Game on',
      fx: { mode: 'float', glyphs: ['⚽', '🏀', '🎾', '🏈', '🏐'], count: 10, size: [18, 30], alpha: 0.22 } },
    music: { a1: '#f472d0', a2: '#8b5cf6', a3: '#38bdf8', on: '#1d0618', font: "'Orbitron'", motif: 'staff', tag: 'Drop the beat',
      fx: { mode: 'rise', glyphs: ['♪', '♫', '♬', '♩'], tint: true, count: 26, size: [16, 34], alpha: 0.4 } },
    nature: { a1: '#4ade80', a2: '#facc15', a3: '#fb923c', on: '#04170a', font: "'Fredoka'", motif: 'leaf', tag: 'Breathe it in',
      fx: { mode: 'fall', glyphs: ['🍃', '🍂', '🌿', '🍁'], count: 16, size: [16, 26], alpha: 0.32, sway: true } },
    ocean: { a1: '#2dd4bf', a2: '#3b82f6', a3: '#a5f3fc', on: '#021614', font: "'Space Grotesk'", motif: 'waves', tag: 'Dive deep',
      fx: { mode: 'bubbles', count: 38 } },
    science: { a1: '#39ff88', a2: '#22d3ee', a3: '#c084fc', on: '#02150a', font: "'JetBrains Mono'", motif: 'hex', tag: 'Hypothesis: fun',
      fx: { mode: 'network', count: 48 } },
    geography: { a1: '#38bdf8', a2: '#fbbf24', a3: '#34d399', on: '#03131c', font: "'Space Grotesk'", motif: 'globe', tag: 'Passport ready',
      fx: { mode: 'drift', glyphs: ['✈', '☁', '☁'], tint: true, count: 10, size: [18, 36], alpha: 0.28 } },
    history: { a1: '#f5c46b', a2: '#d9622b', a3: '#fde68a', on: '#1a1003', font: "'Cinzel'", motif: 'meander', tag: 'Ages ago',
      fx: { mode: 'dust', count: 70 } },
    technology: { a1: '#22d3ee', a2: '#e879f9', a3: '#a3e635', on: '#021317', font: "'JetBrains Mono'", motif: 'circuit', tag: 'System online',
      fx: { mode: 'matrix' } },
    arts: { a1: '#fb7185', a2: '#a78bfa', a3: '#fbbf24', on: '#1c0610', font: "'Fraunces'", motif: 'squiggle', tag: 'Make it bold',
      fx: { mode: 'blobs', count: 8 } },
    general: { a1: '#818cf8', a2: '#f472b6', a3: '#34d399', on: '#0b0b24', font: "'Orbitron'", motif: 'grid', tag: 'Anything goes',
      fx: { mode: 'network', count: 36 } }
  };

  function hsl(h, s, l) { return `hsl(${Math.round(h) % 360} ${s}% ${l}%)`; }
  function hashHue(text) {
    let h = 0;
    for (const ch of text.toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h % 360;
  }

  function customSkin(hue) {
    return {
      a1: hsl(hue, 92, 64), a2: hsl(hue + 55, 90, 62), a3: hsl(hue + 180, 85, 70), on: '#0b0b18',
      font: "'Orbitron'", motif: 'sparkle', tag: 'Custom theme',
      fx: { mode: 'drift', glyphs: ['✦', '✧', '·', '✦'], tint: true, count: 28, size: [10, 24], alpha: 0.45, float: true }
    };
  }

  /** Resolve a skin descriptor ({id} or {id:'custom', hue}) to a full skin object. */
  function get(desc) {
    if (!desc) return SKINS.general;
    if (desc.id === 'custom') return Object.assign({ id: 'custom' }, customSkin(desc.hue || 0));
    return Object.assign({ id: desc.id }, SKINS[desc.id] || SKINS.general);
  }

  /** Pick a skin for a custom theme: borrow a built-in look if the words match, else a hue from the name. */
  function forCustom(text, bank) {
    const toks = text.toLowerCase().split(/[^a-z]+/).filter((t) => t.length >= 3)
      .map((t) => (t.length > 3 && t.endsWith('s') && !t.endsWith('ss') ? t.slice(0, -1) : t));
    for (const t of bank.themes) {
      if (t.id === 'general') continue;
      const words = [t.id, t.name.toLowerCase()].concat(t.keywords);
      if (toks.some((tok) => words.some((k) => k === tok || k.replace(/s$/, '') === tok))) return { id: t.id };
    }
    return { id: 'custom', hue: hashHue(text) };
  }

  function motifUrl(name) {
    return `url("data:image/svg+xml,${encodeURIComponent(MOTIFS[name] || MOTIFS.grid)}")`;
  }

  /** Write a skin's custom properties onto an element. */
  function apply(el, skin) {
    el.dataset.skin = skin.id;
    el.style.setProperty('--a1', skin.a1);
    el.style.setProperty('--a2', skin.a2);
    el.style.setProperty('--a3', skin.a3);
    el.style.setProperty('--on-accent', skin.on);
    el.style.setProperty('--font-skin', `${skin.font}, var(--font-ui)`);
    el.style.setProperty('--motif', motifUrl(skin.motif));
  }

  root.CW = Object.assign(root.CW || {}, { skins: { get, forCustom, apply, SKINS } });
})(typeof window !== 'undefined' ? window : globalThis);
