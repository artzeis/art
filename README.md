# Myth Seekers ✨

A real-world treasure hunt game for kids. Help Scribbi, Craggle, Orbit, Tangle, Nyxie and Glitch
find their lost treasures by solving riddles and completing activity challenges. There is
also an optional AR hide-and-seek mode.

See [GAME_DESIGN.md](GAME_DESIGN.md) for the full design, and [ART_BRIEF.md](ART_BRIEF.md) for the character
artwork and store links.

## Run it
It's a static web app with no build step:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

The camera and motion sensors used by AR mode only work on `localhost` or over **HTTPS**. Hosting the
folder on GitHub Pages works well for playing on a phone.

## Files
- `index.html` — app shell and the How to Play instructions
- `styles.css` — styles
- `js/data.js` — **plush store links** (`STORE_LINKS`), characters, challenges, hiding spots and riddles (edit content here)
- `js/art.js` — loads the character artwork
- `assets/characters/` — app character pictures (`scribbi.png`, `craggle.png`, …)
- `assets/plush/` — plush product photos for the store cards
- `js/app.js` — screens, quest flow, journal, grown-up setup
- `js/ar.js` — AR mode: room scan, hiding and seeking
- `js/riddles.js` — writes riddles from the grown-up's description of each hiding place
- `js/voices.js` — each character's speaking voice (pitch, speed, preferred voices)
