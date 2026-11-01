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
- **Extras**: a timer with pause, a progress bar, automatic saving (resume later), best times and a daily streak, a celebration with confetti, a print layout, light and dark modes, and an on-screen keyboard on touch devices.

## Running it

It's plain HTML, CSS and JavaScript, with no build step and no dependencies.

```bash
# any static file server works, e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

You can also open `index.html` directly, or host the folder on GitHub Pages (Settings → Pages → deploy from branch).

## Project layout

```
index.html            App shell
css/styles.css        All styling (light/dark, responsive, print)
js/config.js          Difficulty presets
js/wordbank.js        Built-in themes, answers and clues
js/generator.js       Crossword layout engine
js/custom-theme.js    Custom-theme word lookup (Datamuse + local fallback)
js/app.js             UI, input, game state, saving
scripts/check.js      Sanity tests: node scripts/check.js
```

### Adding words or themes

Add a block to `js/wordbank.js`. Each line is `ANSWER|easy clue|hard clue`. Then run `node scripts/check.js`. It checks for duplicates and for clues that give away the answer, and it generates hundreds of test grids to make sure they're valid.
