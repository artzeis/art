/* ==========================================================
   PORTFOLIO CONTENT — edit this file to add your work.

   1. Drop image files into the matching folder:
        images/landscape/   images/installations/
        images/installations/      images/interiors/
   2. Add an entry to that category's "items" list below, e.g.
        { src: "images/landscape/rock-garden.jpg",
          title: "Desert Rock Garden",
          caption: "Native plantings and hand-set boulders.",
          year: "2025" },
   3. Optional: set "cover" to the image you want on the home page card.

   While a category has no items, the page shows placeholder tiles.
   ========================================================== */

window.PORTFOLIO = {
  installations: {
    cover: "images/installations/driftwood-moon-day.jpg",
    layout: "projects",   // feature rows; group photos with "views"
    items: [
      {
        title: "Bamboo Bridge",
        meta: "Envision Festival",
        caption: "A bridge decoration of bent bamboo arches and hand-strung string art, turning a festival crossing into a glowing threshold after dark.",
        views: [{ src: "images/installations/bamboo-string-stage.jpg" }],
      },
      {
        title: "Driftwood Moon",
        meta: "Private client · Northern California",
        caption: "A crescent moon built from hundreds of pieces of layered driftwood, with a walkable deck through its belly and a glowing orb strung from tip to tip.",
        views: [
          { label: "Day", icon: "sun", src: "images/installations/driftwood-moon-day.jpg",
            note: "By day it rests in the meadow like something washed ashore: weathered, sculptural, a place to climb in and lounge." },
          { label: "Night", icon: "moon", mood: "night", src: "images/installations/driftwood-moon-night.jpg",
            note: "After dark the orb lights up and the moon gets its own moon, glowing against the night sky." },
        ],
      },
      {
        title: "Idea Seed",
        meta: "Lighthaven · Berkeley, CA",
        caption: "An event space shaped like a seed pod cracking open: shingled wooden petals curl around a soft, moss-green interior big enough to gather in.",
        views: [
          { label: "Day", icon: "sun", src: "images/installations/bloom-pod-day.jpg",
            note: "In daylight it reads as sculpture: warm wood, curling petals and a green heart waiting to be sat in." },
          { label: "Night", icon: "moon", mood: "night", src: "images/installations/bloom-pod-night.jpg",
            note: "At night it changes completely. The petals fall into silhouette, the moss glows electric green, and a carved pinecone lantern hangs at the center like the seed's first spark." },
        ],
      },
      {
        title: "Teardrop Pavilion",
        meta: "Retreat center · Rocky Mountains",
        caption: "Functional art for a mountain retreat: a teardrop of woven branches wrapped around a timber-striped nook with a deck and table, for conversation, meditation and practice.",
        views: [
          { label: "Autumn", icon: "leaf", src: "images/installations/teardrop-pavilion.jpg",
            note: "Tucked among the pines, it shelters a quiet conversation." },
          { label: "Winter", icon: "snow", src: "images/installations/teardrop-pavilion-yoga.jpg",
            note: "In deep snow it still holds its shape, framing the mountain light for a morning practice." },
        ],
      },
      {
        title: "Great Owl",
        meta: "In collaboration with Alchemy Arts Collective",
        caption: "A giant wooden owl painted in UV-reactive sacred geometry that comes alive under blacklight.",
        views: [
          { label: "Gateway", icon: "star", src: "images/installations/owl-gateway-uv.jpg",
            note: "With wings spread wide, it becomes a glowing gateway to walk beneath." },
          { label: "Main stage", icon: "moon", mood: "night", src: "images/installations/owl-festival-crowd.jpg", position: "18% 50%",
            note: "Perched beside the main stage, it watches over thousands of dancers." },
        ],
      },
      {
        title: "Floral Entrance Arch",
        caption: "A towering flower-covered gateway in the pines.",
        views: [{ src: "images/installations/floral-entrance-arch.jpg" }],
      },
      {
        title: "Wooden Serpent (in progress)",
        caption: "Faceted timber segments taking shape during the build.",
        views: [{ src: "images/installations/wooden-serpent-build.jpg" }],
      },
    ],
  },
  landscape: {
    cover: "images/landscape/branch-helix.jpg",
    layout: "projects",
    items: [
      {
        title: "Pergola Lounge Deck",
        caption: "A custom timber pergola over a wraparound deck, with built-in cushioned bench seating, a geometric lattice column climbing through the center, and slatted shade that throws shifting patterns across the lounge.",
        views: [{ src: "images/landscape/pergola-lounge-deck.jpg" }],
      },
      {
        title: "Slatted Timber Gateway",
        caption: "A side-yard entry reimagined: a pivoting gate and frame clad in alternating timber slats over black steel, with vertical rhythm on the door and horizontal bands around the opening.",
        views: [{ src: "images/landscape/slatted-timber-gateway.jpg" }],
      },
      {
        title: "Courtyard Lounge & Planter Screen",
        caption: "A slatted privacy screen topped with a bromeliad planter and trained vines, paired with a live-edge bar top to turn a narrow courtyard into an outdoor living room.",
        views: [{ src: "images/landscape/courtyard-planter-screen.jpg" }],
      },
      {
        title: "Branch Helix",
        caption: "A spiralling ladder of peeled branches rising out of the meadow.",
        views: [{ src: "images/landscape/branch-helix.jpg" }],
      },
      {
        title: "Driftwood Path Pillars",
        caption: "Twisted driftwood columns glowing from within, framing a lit garden path.",
        views: [{ src: "images/landscape/driftwood-pillars-path.jpg" }],
      },
    ],
  },

  interiors: {
    cover: "images/interiors/timber-booth-dining-nook.jpg",
    items: [
      { src: "images/interiors/timber-booth-dining-nook.jpg", title: "Timber Booth Dining Nook", caption: "Built-in pine booths with live-edge tabletops and a curved divider, set beneath a living green wall.", year: "" },
      { src: "images/interiors/carved-swirl-panel.jpg", title: "Carved Swirl Panel", caption: "A large hand-carved relief panel with flowing spirals and wood-grain currents.", year: "" },
      { src: "images/interiors/carved-wall-pair.jpg", title: "Carved Wall Pair", caption: "Two sculpted wall pieces carved from a single branch.", year: "" },
    ],
  },
};
