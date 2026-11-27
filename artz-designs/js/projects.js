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
        title: "Golden Face Pyramid Stage",
        caption: "A main-stage facade: a towering pyramid of warm geometric panels crowned by a golden-masked face and sunburst halo, with sculpted wooden arms reaching out over the crowd.",
        views: [
          { src: "images/installations/golden-face-pyramid-stage.jpg" },
        ],
      },
      {
        title: "Forest Arch Stage",
        caption: "A city-festival stage built as a living ruin: weathered reclaimed-wood pillars rising into lit arches wrapped in greenery, with a diamond keystone at the crown.",
        views: [
          { label: "Show", icon: "star", src: "images/installations/forest-arch-stage-crowd.jpg", note: "Packed and lit up, the arches frame the DJ booth above a sea of hands." },
          { label: "Before doors", icon: "sun", src: "images/installations/forest-arch-stage-dusk.jpg", note: "At dusk before the gates open, the fixtures and reclaimed-wood structure read clearly against the sky." },
        ],
      },
      {
        title: "Jungle DJ Stage",
        caption: "A DJ stage in the jungle: layered wooden wings and a central crest cut with organic cell patterns, string curtains, river stones at the base and a web painted across the dance floor.",
        views: [
          { src: "images/installations/jungle-dj-stage.jpg" },
        ],
      },
      {
        title: "Vine Tower House",
        caption: "A whimsical storybook tower for a festival: a leaning, flared timber house with coffin-shaped doors and windows, a crooked chimney and a tiny pagoda lookout, all wrapped in vines.",
        views: [
          { src: "images/installations/vine-tower-house.jpg" },
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
          { label: "Seat", icon: "star", src: "images/landscape/leaf-moon-pod-seat.jpg", note: "Up close, the turf-lined hollow curves into a single sculpted seat under the woven lamp." },
          { label: "Side", icon: "leaf", src: "images/landscape/leaf-moon-pod-side.jpg",
            note: "From the side, the leaves spiral off the rim, and a shingled, curtained arch connects it to the next room." },
        ],
      },
      {
        title: "Arched Garden Office",
        caption: "A pointed-arch work cabin attached to the Leaf Moon Pod: dark timber ribs, cascading cedar shingles, tied-back linen curtains and a built-in curved desk under the palms.",
        views: [
          { label: "Inside", icon: "sun", src: "images/landscape/arched-garden-office-front.jpg", note: "Through the arch: a quiet desk with a view of the palm fronds." },
          { label: "Arch", icon: "leaf", src: "images/landscape/arched-garden-office-side.jpg", note: "From the side, the shingles spill over the curved roof like overlapping leaves." },
        ],
      },
      {
        title: "Garden Bar Pavilion",
        caption: "A backyard bar pavilion with geometric mountain-motif railings, a wraparound bar top and a star lantern, connected by a herringbone deck to a turf-topped bench built around an old tree.",
        views: [
          { label: "Bar", icon: "star", src: "images/landscape/garden-bar-pavilion.jpg", note: "Angular timber latticework rises like a mountain range behind the bar seating." },
          { label: "Tree bench", icon: "leaf", src: "images/landscape/tree-bench-deck.jpg", note: "A turf-topped bench wraps the trunk of the old tree, with the deck patterns leading back to the bar." },
        ],
      },
      {
        title: "Lounge Pergola",
        caption: "A heavy-timber pergola on a stained deck, with angled braces, hanging greenery and low lounge seating set into a garden lawn.",
        views: [
          { src: "images/landscape/lounge-pergola.jpg" },
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
        title: "Cinnamon Tree Tea Lounge",
        meta: "Hawaii",
        caption: "A hexagonal tea lounge set beneath a cinnamon tree: a shingled roof on hand-carved posts with flowing cutout brackets, sheltering an open timber deck with low rail seating.",
        views: [
          { label: "Under the tree", src: "images/landscape/cinnamon-tea-lounge.jpg" },
          { label: "Full view", src: "images/landscape/cinnamon-tea-lounge-full.jpg", note: "Stepping back shows the whole pavilion: carved, pierced posts and swooping brackets under a cedar-shingle hip roof." },
        ],
      },
      {
        title: "Gothic Garden Gate",
        caption: "Double redwood gates in a pointed Gothic arch, crowned by a stepped sunburst of fanned boards and hung on hand-forged strap hinges.",
        views: [
          { label: "Closed", src: "images/landscape/gothic-gate-closed.jpg", note: "Closed, the two leaves meet beneath a carved arch rib and the sunburst crown." },
          { label: "Open", icon: "sun", src: "images/landscape/gothic-gate-open.jpg", note: "Swung open, the arch frames the garden path and the pods beyond." },
        ],
      },
      {
        title: "Rose Arbor Bench",
        caption: "A curved cedar reading nook with a corrugated roof and lit bench, now almost swallowed by climbing roses and nandina.",
        views: [{ src: "images/landscape/rose-arbor-bench.jpg" }],
      },
      {
        title: "Pergola Lounge Deck",
        caption: "A custom timber pergola over a wraparound deck, with built-in cushioned bench seating, a geometric lattice column climbing through the center, and slatted shade that throws shifting patterns across the lounge.",
        views: [
          { label: "Lounge", src: "images/landscape/pergola-lounge-deck.jpg" },
          { label: "Lattice column", src: "images/landscape/pergola-lattice-column.jpg", note: "Up close, the center column is a stack of offset timber frames that climbing vines can weave through." },
        ],
      },
      {
        title: "Slatted Timber Gateway",
        caption: "A side-yard entry reimagined: a pivoting gate and frame clad in alternating timber slats over black steel, with vertical rhythm on the door and horizontal bands around the opening.",
        views: [{ src: "images/landscape/slatted-timber-gateway.jpg" }],
      },
      {
        title: "Courtyard Lounge & Planter Screen",
        caption: "A slatted privacy screen topped with a bromeliad planter and trained vines, paired with a live-edge bar top to turn a narrow courtyard into an outdoor living room.",
        views: [
          { label: "Finished", src: "images/landscape/courtyard-planter-screen.jpg" },
          { label: "Build", src: "images/landscape/courtyard-planter-screen-build.jpg", note: "Mid-install: the slatted screen and its planter box going in beside the live-edge bar top." },
        ],
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
          { label: "Finished", src: "images/interiors/laundry-room-finished.jpg",
            note: "Done: herringbone oak floors, birch-ply walls and the stacked washer-dryer under the skylight roof." },
          { label: "Laundry nook", src: "images/interiors/laundry-room-nook.jpg",
            note: "A stacked washer-dryer tucked into its own plywood-lined alcove, with room left for a plant to soak up the skylight." },
          { label: "Built-in shelving", src: "images/interiors/laundry-room-shelving.jpg",
            note: "Deep stepped shelves built over the stairwell make storage out of space that was going to waste." },
        ],
      },
      {
        title: "Event Kitchen Pantry",
        meta: "Event space kitchen",
        caption: "Curved, wave-edged pantry shelving in pale wood: floating shelves above a freestanding stepped unit that keeps snacks organized and on display.",
        views: [{ src: "images/interiors/event-kitchen-pantry.jpg" }],
      },
      {
        title: "Hotel Laundry Room",
        meta: "Nonprofit hotel & event space",
        caption: "A working laundry room with an L-shaped folding counter built over the machines, a curved notch for easy reach, open cubbies and long floating shelves beneath stained-glass windows.",
        views: [{ src: "images/interiors/hotel-laundry-room.jpg" }],
      },
      {
        title: "Podcast Room",
        meta: "Lighthaven · California",
        caption: "A recording room wrapped in warm wood: walnut-veneer feature panels framed by dark slatted acoustic walls, with curved floating shelves stepping across the wall to hold books, plants and objects behind the conversation.",
        views: [
          { label: "Conversation", src: "images/interiors/podcast-room-hosts.jpg",
            note: "Set for two: the shelves frame the Lighthaven sign right behind the conversation." },
          { label: "Full room", src: "images/interiors/podcast-room.jpg",
            note: "Pulled back, the slatted acoustic walls wrap the corners and the floating shelves step all the way across." },
        ],
      },
      {
        title: "Carved Folding Screen",
        caption: "A three-panel room divider carved with flowing currents and a cascade of moons, warm-stained to sit among plants in an open living space.",
        views: [
          { src: "images/interiors/carved-folding-screen.jpg" },
        ],
      },
      {
        title: "Carved Swirl Panel",
        caption: "A large hand-carved relief panel with flowing spirals and wood-grain currents.",
        views: [{ src: "images/interiors/carved-swirl-panel.jpg" }],
      },
      {
        title: "Carved Wall Pair",
        caption: "Two sculpted wall pieces carved from a single branch.",
        views: [
          { label: "Installed", src: "images/interiors/carved-wall-pair.jpg" },
          { label: "Detail", src: "images/interiors/carved-wall-pieces.jpg", note: "Laid flat, the pair shows its spiralling cuts, knots and glossy hand-rubbed finish." },
        ],
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
        title: "Hex Work Pod",
        caption: "A hexagonal outdoor meeting room: a heavy timber frame with a shingled, turf-topped roof, cedar-lined interior and facing bench seats around a standing desk.",
        views: [
          { label: "Furnished", icon: "sun", src: "images/indoors-outdoors/hex-pod-furnished.jpg", note: "Cushioned benches, a sit-stand table and a roll-down shade make it a working office in the garden." },
          { label: "Outside", icon: "leaf", src: "images/indoors-outdoors/hex-pod-angle.jpg", note: "From the corner, the tilted hexagon and shingle roof with tufts of greenery read as one sculptural form." },
          { label: "Build", icon: "star", src: "images/indoors-outdoors/hex-pod-build.jpg", note: "Fresh from the build: the cedar-lined benches and floor before furnishing." },
        ],
      },
      {
        title: "Leaf Shell Lounge",
        caption: "A curling shell of layered wooden leaves sheltering a built-in curved bench, its ceiling hung with ivy, ferns and string lights.",
        views: [
          { src: "images/indoors-outdoors/leaf-shell-lounge.jpg" },
        ],
      },
      {
        title: "Stone Wall Patio Office",
        caption: "A covered patio turned year-round workspace: a sculpted faux-rock wall behind clear roll-down panels, a translucent roof on timber rafters, ferns, string lights and overhead heaters.",
        views: [{ src: "images/indoors-outdoors/stone-wall-patio-office.jpg" }],
      },
      {
        title: "Garden Moon Nook",
        caption: "A tiny garden room hidden in the plantings: a crescent-moon archway hung with tasseled curtains opens onto a timber deck with built-in bench seating, shelves and a low table, reached by slate stepping stones through agave, bromeliads and banana leaves.",
        views: [{ src: "images/indoors-outdoors/garden-moon-nook.jpg" }],
      },
    ],
  },
};
