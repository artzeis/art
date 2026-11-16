#!/usr/bin/env node
/* Renders icons/icon.svg to the PNG sizes the app manifest and iOS need: node scripts/make-icons.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const dir = path.join(__dirname, '..', 'icons');
  const svg = fs.readFileSync(path.join(dir, 'icon.svg'), 'utf8');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['maskable-512.png', 512], ['apple-touch-icon.png', 180]]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><head><link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@700&display=block" rel="stylesheet"></head>
      <body style="margin:0;background:#060913">${svg.replace('width="512" height="512"', `width="${size}" height="${size}"`)}</body></html>`);
    // use the rounded Fredoka face if it can be fetched; fall back to system fonts otherwise
    await page.evaluate(() => document.fonts.load('700 72px Fredoka').catch(() => null));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(dir, name), clip: { x: 0, y: 0, width: size, height: size } });
    console.log('wrote', name);
  }
  // small browser-tab icon comes from a simplified design that stays readable at 16–32px
  const fav = fs.readFileSync(path.join(dir, 'favicon.svg'), 'utf8');
  await page.setViewportSize({ width: 32, height: 32 });
  await page.setContent(`<html><body style="margin:0;background:transparent">${fav.replace('width="64" height="64"', 'width="32" height="32"')}</body></html>`);
  await page.screenshot({ path: path.join(dir, 'favicon-32.png'), clip: { x: 0, y: 0, width: 32, height: 32 }, omitBackground: true });
  console.log('wrote favicon-32.png');
  await browser.close();
})();
