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

## Myth Seekers: After Dark (adults' party version, 18+)
The same five creatures, all grown up and with lost party gear: Pip's Glitter Tiara, Bramble's Hip Flask,
Lirien's Silver Corkscrew, Ember's Golden Microphone and Thistle's Lucky Sweatband. It's a team game for
2 to 6 teams. Each turn, a team does a party challenge judged by the room, then cracks a riddle against a
3-minute clock to find the hidden item. Between turns, the Creature Court hands out votes, "Never Have I Ever"
cards and silly rules. There are three spice levels (Mild, Cheeky, Spicy) and optional sip rules, and every
sip can be swapped for a forfeit.

Open `party/index.html`, or `http://localhost:8000/party/` when serving the folder.

- `party/js/data.js` — creatures, challenges, hiding spots, riddles and Court cards (edit content here)
- `party/js/app.js` — teams, turns, scoring, Court and the final awards
- `party/js/art.js` — creature artwork (copied from the family version)
