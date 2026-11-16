# Imagamigos — Character Art

Each character has two pictures:

| File | What it is |
|---|---|
| `assets/characters/<id>.png` | The **app character**, used everywhere in the game, including AR. Transparent background, about 760 px wide. |
| `assets/plush/<id>.jpg` | The **pillow plush** product photo, shown on the plush store card. Square, 640 × 640. |

The ids are `scribbi`, `craggle`, `orbit`, `tangle`, `nyxie`, `glitch` and `leo`.
Leo also has `assets/characters/leo-moon.png`, his unlockable Moon Form, which is also used in AR.

## Adding or replacing a character's art
1. Make the picture on a plain, light background, with one character per picture and the whole body visible.
2. Send it to Claude, or upload it on GitHub into the folder above using the exact file name.
3. The game picks it up automatically. A character without a picture shows its treasure emoji instead.

## Store links
Paste each plush's product link into `STORE_LINKS` at the top of `js/data.js`.
