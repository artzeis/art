// Myth Seekers — character artwork.
// Each character's app picture lives at assets/characters/<id>.png (transparent background).
// The matching plush product photo lives at assets/plush/<id>.jpg.
const CREATURE_IMG = {};
function creatureArt(id) {
  if (CREATURE_IMG[id]) return `<img class="char-img" src="${CREATURE_IMG[id]}" alt="" draggable="false">`;
  const c = (typeof CREATURES !== "undefined" && CREATURES.find((x) => x.id === id)) || {};
  return `<span class="char-fallback">${c.accessoryEmoji || "✨"}</span>`;
}
function loadCreatureImages(ids) {
  return Promise.all(ids.map((id) => new Promise((resolve) => {
    const url = `assets/characters/${id}.png`;
    const img = new Image();
    img.onload = () => { CREATURE_IMG[id] = url; resolve(); };
    img.onerror = () => resolve();
    img.src = url;
  })));
}
