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
        views: [
          { label: "Entrance", icon: "moon", mood: "night", src: "images/installations/bamboo-bridge-entrance-night.jpg",
            note: "From the path, bent bamboo ribs rise into a pointed arch, with a geometric lantern hung at the peak to light the way across." },
          { label: "On the bridge", icon: "star", mood: "night", src: "images/installations/bamboo-string-stage.jpg",
            note: "Out on the deck, hand-strung string art fills the space between the arches." },
        ],
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
          { label: "Golden hour", icon: "sun", src: "images/installations/teardrop-pavilion-golden-hour.jpg",
            note: "Late sun slips through the pines and lights up the sweep of branches as they rise into the teardrop's point." },
          { label: "Gathering", icon: "leaf", src: "images/installations/teardrop-pavilion.jpg",
            note: "Tucked among the pines, it shelters a quiet conversation." },
          { label: "Winter", icon: "snow", src: "images/installations/teardrop-pavilion-snow.jpg",
            note: "Dusted with snow among the firs, its sweep of branches rises to a point like a flame in the winter forest." },
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
        title: "Leaf Moon Pod",
        caption: "A circular garden pod clad in overlapping hand-cut wooden leaves that sweep around the opening like a gust of wind, with a turf-lined seat inside, a woven pendant lamp, and a stepped timber deck beneath the palms.",
        views: [
          { label: "Front", icon: "sun", src: "images/landscape/leaf-moon-pod-front.jpg",
            note: "Head-on, it reads as a full moon of leaves with a soft green hollow to sink into." },
          { label: "Side", icon: "leaf", src: "images/landscape/leaf-moon-pod-side.jpg",
            note: "From the side, the leaves spiral off the rim, and a shingled, curtained arch connects it to the next room." },
        ],
      },
      {
        title: "Petal Pod",
        caption: "A small meditation room shaped like a flower bud: layered wooden petals with a translucent curved roof, sheer curtains, and a warm lamp that makes it glow at dusk.",
        views: [{ src: "images/landscape/petal-pod-dusk.jpg" }],
      },
      {
        title: "Wave Cedar Shed",
        caption: "A garden shed turned sculpture: layered cedar cut into flowing waves across vertical siding, with an organic-shaped window and a porthole in the door.",
        views: [{ src: "images/landscape/wave-cedar-shed.jpg" }],
      },
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
    layout: "projects",
    items: [
      {
        title: "Timber Booth Dining Nook",
        caption: "Built-in pine booths with live-edge tabletops and a curved divider, set beneath a living green wall.",
        views: [{ src: "images/interiors/timber-booth-dining-nook.jpg" }],
      },
      {
        title: "Laundry Room Conversion",
        caption: "A covered side passage turned into a bright laundry room: birch-ply walls, herringbone oak floors and a translucent roof that pours daylight down between the rafters.",
        views: [
          { label: "Laundry nook", src: "images/interiors/laundry-room-nook.jpg",
            note: "A stacked washer-dryer tucked into its own plywood-lined alcove, with room left for a plant to soak up the skylight." },
          { label: "Built-in shelving", src: "images/interiors/laundry-room-shelving.jpg",
            note: "Deep stepped shelves built over the stairwell make storage out of space that was going to waste." },
        ],
      },
      {
        title: "Podcast Room",
        meta: "Lighthaven · Berkeley, CA",
        caption: "A recording room wrapped in warm wood: walnut-veneer feature panels framed by dark slatted acoustic walls, with curved floating shelves stepping across the wall to hold books, plants and objects behind the conversation.",
        views: [{ src: "images/interiors/podcast-room.jpg" }],
      },
      {
        title: "Carved Swirl Panel",
        caption: "A large hand-carved relief panel with flowing spirals and wood-grain currents.",
        views: [{ src: "images/interiors/carved-swirl-panel.jpg" }],
      },
      {
        title: "Carved Wall Pair",
        caption: "Two sculpted wall pieces carved from a single branch.",
        views: [{ src: "images/interiors/carved-wall-pair.jpg" }],
      },
    ],
  },

  indoorsoutdoors: {
    cover: "images/indoors-outdoors/garden-moon-nook.jpg",
    layout: "projects",
    items: [
      {
        title: "Moon Gate Cabin",
        caption: "A round timber cabin that disappears into the garden: a full-moon opening framed in curved cedar boards and lattice, wrapped in climbing vines, with built-in cushioned benches and a mossy carpet inside.",
        views: [
          { label: "Arrival", icon: "leaf", src: "images/indoors-outdoors/moon-gate-cabin.jpg",
            note: "Vines have grown right over the arch, so the cabin reads as part of the garden rather than something placed in it." },
          { label: "Through the moon", icon: "sun", src: "images/indoors-outdoors/moon-gate-cabin-garden.jpg",
            note: "Step back and the round opening frames the flowering garden beyond, like a window cut through the hedge." },
          { label: "Inside", icon: "play", src: "images/indoors-outdoors/moon-gate-cabin-inside.jpg", video: "images/indoors-outdoors/moon-gate-cabin-inside.mp4",
            note: "Inside, warm cedar curves overhead and U-shaped benches wrap the room, with the garden glowing through the far end." },
        ],
      },
      {
        title: "Garden Moon Nook",
        caption: "A tiny garden room hidden in the plantings: a crescent-moon archway hung with tasseled curtains opens onto a timber deck with built-in bench seating, shelves and a low table, reached by slate stepping stones through agave, bromeliads and banana leaves.",
        views: [{ src: "images/indoors-outdoors/garden-moon-nook.jpg" }],
      },
    ],
  },
};
