# Artz Designs — Portfolio Website

Live at **https://artzeis.github.io/art/** (redeploys automatically on every push to `master`).

A static portfolio site (no build step) with a home page and four gallery pages:

| Page | File | Image folder |
|---|---|---|
| Landscape Design | `landscape-design.html` | `images/landscape/` |
| Festival Installations | `festival-installations.html` | `images/festival/` |
| Stages | `stages.html` | `images/stages/` |
| Interior Remodels | `interior-remodels.html` | `images/interiors/` |

## Adding images
1. Put the image in the right folder under `images/`.
2. Add an entry in `js/projects.js`:
   ```js
   { src: "images/stages/main-stage.jpg", title: "Main Stage", caption: "Short description", year: "2025" },
   ```
3. Optionally set `cover` for a category to choose its image on the home page.

Until a category has images it shows "Image coming soon" placeholders. Clicking an image opens a full-screen
viewer (arrow keys / swipe to move between images, Esc to close).

## Contact details
Edit the placeholder email, Instagram and location in the Contact section of `index.html`.

## Preview locally
```bash
cd artz-designs
python3 -m http.server 8000   # open http://localhost:8000
```
