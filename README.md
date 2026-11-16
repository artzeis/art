# Wordweave — crossword puzzle generator

A friendly web app that generates a **brand-new, playable crossword** every time.
Choose a theme from the list (or type your own), choose a difficulty, and play right in the browser on a desktop or phone.

## Features

- **13 built-in themes**: Animals, Space, Food, Sports, Music, Nature, Ocean, Science, Geography, History, Technology, Arts & Books, and a Mixed Bag. Each word has a friendly clue and a trickier clue.
- **Write-your-own themes** such as "Dinosaurs", "Coffee" or "Ancient Egypt". The app looks up related words and dictionary definitions through the free [Datamuse API](https://www.datamuse.com/api/), adds matching words from the built-in library, and fills in with general words if the theme is narrow. With no internet connection it still builds a puzzle from the built-in library.
- **Three difficulty levels**:
  | | Grid | Words | Clues |
  |---|---|---|---|
  | Easy | up to 11×11 | ~11 everyday words | friendly, auto-check on |
  | Medium | up to 13×13 | ~16 words | a mix of straight and sly clues |
  | Hard | up to 15×15 | ~22 longer words | tricky clues |
- **Unique puzzles**: each grid is built from a fresh random seed. Dozens of layouts are tried and the best interlocking one wins. Words you've seen recently are pushed down the list.
- **Comfortable play**: click or tap squares, type to fill, use the arrow keys, press Space to switch direction and Tab for the next clue. The current clue bar has previous/next buttons and the clue list stays in sync with the grid.
- **Help when you need it**: check or reveal a letter, word or the whole puzzle, plus an optional auto-check mode.
- **A look for every theme**: a futuristic glass-and-neon interface where each theme brings its own colors, display font, background pattern and animated background. Examples: twinkling stars and shooting stars for Space, rising bubbles for Ocean, falling binary digits for Technology, drifting leaves for Nature, golden dust for History, and floating notes for Music. Pick a theme and the whole page changes to match. Custom themes borrow the closest built-in look or get their own color.
- **Daily Puzzle**: one puzzle a day, identical for everyone, with a different theme each day and a +100 XP bonus.
- **Levels, XP and badges**: earn XP for every solve (bonuses for speed, word combos and dailies), climb ten ranks from *Rookie Weaver* to *Grand Weaver*, and unlock 9 badges.
- **Juicy feedback**: finished words light up with a floating "+WORD" label, quick solves chain into combos, and every theme has its own synthesized sound effects (mute from the top bar).
- **Live preview**: the start screen shows a mini crossword solving itself with words from the theme you've picked. Theme cards tilt in 3D under the pointer, and confetti uses theme symbols.
- **Extras**: a timer with pause, a progress bar, automatic saving (resume later), best times and a daily streak, a celebration with confetti, a print layout, neon (dark) and frost (light) modes, and an on-screen keyboard on touch devices.

## Running it

It's plain HTML, CSS and JavaScript, with no build step and no dependencies.

```bash
# any static file server works, e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

You can also open `index.html` directly, or host the folder on GitHub Pages (Settings → Pages → deploy from branch).

## Add to Home Screen

Wordweave is an installable web app: it has its own icon, opens full-screen, and keeps working offline.

1. Host the folder on GitHub Pages (Settings → Pages → Deploy from a branch → pick the branch and `/ (root)`) and open the site on your phone.
2. Tap the **⤓ Install** button in the app's top bar for step-by-step instructions, or:
   - **iPhone/iPad (Safari):** Share → *Add to Home Screen* → Add.
   - **Android (Chrome):** menu ⋮ → *Install app* / *Add to Home screen*.
   - **Desktop (Chrome/Edge):** the install icon in the address bar.

The app icon (colorful WOW/JOY crossword tiles) lives in `icons/icon.svg`, and the simplified browser-tab icon in `icons/favicon.svg`. After editing either, run `node scripts/make-icons.js` to regenerate the PNG sizes.

## Project layout

```
index.html            App shell
css/styles.css        All styling (light/dark, responsive, print)
js/config.js          Difficulty presets
js/wordbank.js        Built-in themes, answers and clues
js/skins.js           Per-theme design: colors, fonts, background patterns
js/ambient.js         Animated theme backgrounds (particle engine)
js/sound.js           Synthesized theme sound effects
js/progress.js        XP, levels, badges and the Daily Puzzle
js/demo.js            Self-solving preview on the start screen
js/generator.js       Crossword layout engine
js/custom-theme.js    Custom-theme word lookup (Datamuse + local fallback)
js/app.js             UI, input, game state, saving
manifest.webmanifest  App name, icon and colors used when it's installed
sw.js                 Service worker (offline support)
icons/                App icon (SVG source + generated PNGs)
scripts/check.js      Sanity tests: node scripts/check.js
scripts/make-icons.js Renders the icon PNGs from icons/icon.svg
```

### Adding words or themes

Add a block to `js/wordbank.js`. Each line is `ANSWER|easy clue|hard clue`. Then run `node scripts/check.js`. It checks for duplicates and for clues that give away the answer, and it generates hundreds of test grids to make sure they're valid.
