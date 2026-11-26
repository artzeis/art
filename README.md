# Myth Seekers ✨

A real-world treasure hunt game for kids. Help a Fairy, a Gnome, an Elf, a Sunfeather Bird and a
Centaur find their lost accessories by solving riddles and completing activity challenges. There is
also an optional AR hide-and-seek mode.

See [GAME_DESIGN.md](GAME_DESIGN.md) for the full design.

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
- `js/data.js` — creatures, descriptions, challenges, hiding spots and riddles (edit content here)
- `js/app.js` — screens, quest flow, journal, grown-up setup
- `js/ar.js` — AR hide-and-seek mode
