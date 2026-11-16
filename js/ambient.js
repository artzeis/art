/*
 * Ambient background animation — a small particle engine with one
 * look per theme (stars, bubbles, falling leaves, binary rain…).
 */
(function (root) {
  'use strict';

  const cv = document.getElementById('ambient');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let W = 0, H = 0, dpr = 1;
  let fx = null, colors = ['#fff', '#fff', '#fff'];
  let parts = [];
  let raf = 0, last = 0, t = 0;
  let extra = {};

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (fx) seed();
  }

  function scaled(n) {
    return Math.max(4, Math.round(n * Math.min(1.4, (W * H) / (1440 * 900))));
  }

  function makeGlyph(initial) {
    const [s0, s1] = fx.size || [16, 26];
    return {
      x: rand(0, W), y: initial ? rand(0, H) : 0, s: rand(s0, s1),
      vx: rand(-0.15, 0.15), vy: rand(0.25, 0.6), r: rand(0, Math.PI * 2), vr: rand(-0.01, 0.01),
      ph: rand(0, Math.PI * 2), g: pick(fx.glyphs), c: pick(colors), a: rand(0.6, 1)
    };
  }

  function seed() {
    parts = [];
    extra = {};
    const m = fx.mode;
    if (m === 'stars') {
      for (let i = 0; i < scaled(fx.count); i++) parts.push({ x: rand(0, W), y: rand(0, H), r: rand(0.3, 1.6), ph: rand(0, 6.28), sp: rand(0.6, 2), c: Math.random() < 0.15 ? pick(colors) : '#ffffff' });
      extra.shoot = null; extra.nextShoot = 2;
    } else if (m === 'bubbles') {
      for (let i = 0; i < scaled(fx.count); i++) parts.push({ x: rand(0, W), y: rand(0, H), r: rand(2, 13), vy: rand(0.2, 0.8), ph: rand(0, 6.28), c: pick(colors) });
    } else if (m === 'network') {
      for (let i = 0; i < scaled(fx.count); i++) parts.push({ x: rand(0, W), y: rand(0, H), vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25), r: rand(1.2, 2.6), c: pick(colors) });
    } else if (m === 'dust') {
      for (let i = 0; i < scaled(fx.count); i++) parts.push({ x: rand(0, W), y: rand(0, H), r: rand(0.6, 2.2), vy: rand(-0.25, -0.05), vx: rand(-0.1, 0.1), ph: rand(0, 6.28), c: pick(colors) });
    } else if (m === 'matrix') {
      const step = 22;
      for (let x = step / 2; x < W; x += step) {
        if (Math.random() < 0.55) continue;
        parts.push({ x, y: rand(-H, H), sp: rand(0.6, 1.8), len: (rand(6, 16)) | 0, chars: Array.from({ length: 16 }, () => (Math.random() < 0.5 ? '0' : '1')), c: Math.random() < 0.8 ? colors[0] : colors[1] });
      }
    } else if (m === 'blobs') {
      for (let i = 0; i < fx.count; i++) parts.push({ x: rand(0, W), y: rand(0, H), r: rand(120, 280), vx: rand(-0.2, 0.2), vy: rand(-0.2, 0.2), c: colors[i % 3] });
    } else {
      for (let i = 0; i < scaled(fx.count); i++) parts.push(makeGlyph(true));
    }
  }

  function drawGlyph(p, alpha) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.globalAlpha = alpha;
    ctx.font = `${p.s}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;
    ctx.fillStyle = fx.tint ? p.c : '#fff';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (fx.tint) { ctx.shadowColor = p.c; ctx.shadowBlur = 12; }
    ctx.fillText(p.g, 0, 0);
    ctx.restore();
  }

  function step(dt) {
    t += dt;
    ctx.clearRect(0, 0, W, H);
    const m = fx.mode;
    const k = dt * 60; // normalise to 60fps

    if (m === 'stars') {
      for (const p of parts) {
        const a = 0.35 + 0.65 * Math.abs(Math.sin(t * p.sp + p.ph));
        ctx.globalAlpha = a;
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      extra.nextShoot -= dt;
      if (!extra.shoot && extra.nextShoot <= 0) {
        extra.shoot = { x: rand(W * 0.2, W), y: rand(0, H * 0.4), life: 1 };
        extra.nextShoot = rand(3, 8);
      }
      if (extra.shoot) {
        const s = extra.shoot;
        s.x -= 14 * k; s.y += 6 * k; s.life -= dt * 1.4;
        const g = ctx.createLinearGradient(s.x, s.y, s.x + 120, s.y - 52);
        g.addColorStop(0, colors[1]); g.addColorStop(1, 'transparent');
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.strokeStyle = g; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x + 120, s.y - 52); ctx.stroke();
        if (s.life <= 0) extra.shoot = null;
      }
    } else if (m === 'bubbles') {
      for (const p of parts) {
        p.y -= p.vy * k;
        const x = p.x + Math.sin(t * 1.2 + p.ph) * 6;
        if (p.y < -20) { p.y = H + 20; p.x = rand(0, W); }
        ctx.globalAlpha = 0.45;
        ctx.strokeStyle = p.c; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, 6.283); ctx.stroke();
        ctx.globalAlpha = 0.5; ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(x - p.r * 0.35, p.y - p.r * 0.35, p.r * 0.2, 0, 6.283); ctx.fill();
      }
    } else if (m === 'network') {
      for (const p of parts) {
        p.x += p.vx * k; p.y += p.vy * k;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i], b = parts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 140) {
            ctx.globalAlpha = (1 - d / 140) * 0.35;
            ctx.strokeStyle = a.c;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of parts) {
        ctx.globalAlpha = 0.9; ctx.fillStyle = p.c;
        ctx.shadowColor = p.c; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      ctx.shadowBlur = 0;
    } else if (m === 'dust') {
      for (const p of parts) {
        p.y += p.vy * k; p.x += p.vx * k + Math.sin(t + p.ph) * 0.1;
        if (p.y < -5) { p.y = H + 5; p.x = rand(0, W); }
        ctx.globalAlpha = 0.25 + 0.5 * Math.abs(Math.sin(t * 0.8 + p.ph));
        ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      ctx.shadowBlur = 0;
    } else if (m === 'matrix') {
      ctx.font = '600 15px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      for (const p of parts) {
        p.y += p.sp * k;
        if (p.y - p.len * 18 > H) { p.y = rand(-200, 0); p.sp = rand(0.6, 1.8); }
        if (Math.random() < 0.03) p.chars[(Math.random() * p.chars.length) | 0] = Math.random() < 0.5 ? '0' : '1';
        for (let i = 0; i < p.len; i++) {
          const y = p.y - i * 18;
          if (y < -20 || y > H + 20) continue;
          ctx.globalAlpha = i === 0 ? 0.9 : (1 - i / p.len) * 0.45;
          ctx.fillStyle = i === 0 ? '#ffffff' : p.c;
          ctx.fillText(p.chars[i], p.x, y);
        }
      }
    } else if (m === 'blobs') {
      for (const p of parts) {
        p.x += p.vx * k; p.y += p.vy * k;
        if (p.x < -p.r) p.x = W + p.r; if (p.x > W + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = H + p.r; if (p.y > H + p.r) p.y = -p.r;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, p.c); g.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.22;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
    } else {
      // glyph modes: float, fall, rise, drift
      const alpha = fx.alpha ?? 0.25;
      for (const p of parts) {
        if (m === 'fall') {
          p.y += p.vy * k; p.x += (fx.sway ? Math.sin(t + p.ph) * 0.6 : p.vx) * k; p.r += p.vr * k;
          if (p.y > H + 30) Object.assign(p, makeGlyph(false), { y: -30 });
        } else if (m === 'rise') {
          p.y -= p.vy * 1.2 * k; p.x += Math.sin(t * 1.5 + p.ph) * 0.4 * k; p.r = Math.sin(t + p.ph) * 0.3;
          if (p.y < -30) Object.assign(p, makeGlyph(false), { y: H + 30 });
        } else if (m === 'drift') {
          p.x += (fx.float ? p.vx : Math.abs(p.vy) * 0.8) * k; p.y += (fx.float ? Math.sin(t + p.ph) * 0.2 : 0) * k; p.r = 0;
          if (p.x > W + 40) Object.assign(p, makeGlyph(true), { x: -40 });
          if (p.x < -40) p.x = W + 40;
        } else {
          p.x += p.vx * k; p.y += Math.sin(t * 0.6 + p.ph) * 0.25 * k + p.vx * 0.5 * k; p.r += p.vr * 0.5 * k;
          if (p.x < -40) p.x = W + 40; if (p.x > W + 40) p.x = -40;
          if (p.y < -40) p.y = H + 40; if (p.y > H + 40) p.y = -40;
        }
        const a = m === 'drift' && fx.float ? alpha * (0.5 + 0.5 * Math.abs(Math.sin(t + p.ph))) : alpha * p.a;
        drawGlyph(p, a);
      }
    }
    ctx.globalAlpha = 1;
  }

  let paused = false;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (document.hidden || paused) { last = now; return; }
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    step(dt);
  }

  function set(skin) {
    fx = skin.fx;
    colors = [skin.a1, skin.a2, skin.a3];
    cancelAnimationFrame(raf);
    resize();
    seed();
    if (reduced.matches) { step(0.016); return; }
    last = 0;
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { if (fx) resize(); });
  function setPaused(p) { paused = !!p; if (paused) ctx.clearRect(0, 0, W, H); }
  root.CW = Object.assign(root.CW || {}, { ambient: { set, setPaused } });
})(window);
