// Myth Seekers — Memory Book: photos of things families made, kept on this device only (IndexedDB).
const Memories = (() => {
  let dbp = null;
  const open = () => dbp || (dbp = new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open("mythSeekersMemories", 1);
      req.onupgradeneeded = () => req.result.createObjectStore("photos", { keyPath: "id" });
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (e) { reject(e); }
  }));
  const tx = (mode, fn) => open().then((db) => new Promise((resolve, reject) => {
    const t = db.transaction("photos", mode);
    const out = fn(t.objectStore("photos"));
    t.oncomplete = () => resolve(out && out.result !== undefined ? out.result : out);
    t.onerror = () => reject(t.error);
  }));
  return {
    add: (m) => tx("readwrite", (s) => s.put(m)),
    all: () => tx("readonly", (s) => s.getAll()).then((list) => (list || []).sort((a, b) => b.date - a.date)).catch(() => []),
    remove: (id) => tx("readwrite", (s) => s.delete(id)),
  };
})();

// Shrink a photo from the camera to a small JPEG so lots of memories fit on the device.
function shrinkPhoto(file, max = 900) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const cv = document.createElement("canvas");
      cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
      cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(url);
      resolve(cv.toDataURL("image/jpeg", 0.75));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read photo")); };
    img.src = url;
  });
}
