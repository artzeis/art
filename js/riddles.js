// Imagamigos — riddle maker.
//
// A grown-up types where a lost item is hidden, e.g. "under the blue cushion on the sofa".
// makeRiddle() turns that description into a kid-friendly riddle, a clue and a big hint.
// It runs entirely in the browser (no internet, nothing leaves the device):
//   • finds the hiding object  (sofa, bookshelf, tree, …) → a riddle about that object
//   • finds the position word  (under, behind, inside, …) → "…is hiding UNDER it!"
//   • finds the room / area     (kitchen, garden, …)       → the clue
//   • finds a colour            (blue, red, …)             → extra help in the clue
// Anything it doesn't recognise still gets a letter riddle ("starts with D, 8 letters").

const RIDDLE_OBJECTS = [
  // ---------- inside ----------
  { keys: ["couch", "sofa", "settee"], place: "inside", riddles: [
    "I have a back but no spine, and arms but no hands. Families sink into me to watch shows. What am I?",
    "I'm soft and long and full of comfy seats. Grown-ups flop on me after a busy day. What am I?"],
    clue: "Look where people sit and snuggle in the living room." },
  { keys: ["cushion", "cushions"], place: "inside", riddles: [
    "I'm soft and squishy and I sit on sofas and chairs. You lean on me to get comfy. What am I?"],
    clue: "Look at the comfy seats." },
  { keys: ["pillow", "pillows"], place: "inside", riddles: [
    "I'm soft and fluffy and I hold your dreams all night. Where your head lies down, that's where I belong. What am I?"],
    clue: "Go to a bedroom and look where you sleep." },
  { keys: ["bed"], place: "inside", riddles: [
    "I have a head but no face, and four legs but I never walk. You climb into me every night. What am I?",
    "I wear sheets and a blanket and I'm where you dream. What am I?"],
    clue: "Go to a bedroom." },
  { keys: ["blanket", "duvet", "quilt"], place: "inside", riddles: [
    "I'm big and soft and I keep you warm and cosy. What am I?"],
    clue: "Look for something you snuggle under." },
  { keys: ["bookshelf", "bookcase", "shelf", "shelves"], place: "inside", riddles: [
    "I hold a thousand stories but never say a word. Line by line on my shelves, adventures sleep. What am I?"],
    clue: "Find where the books live." },
  { keys: ["book", "books"], place: "inside", riddles: [
    "I have pages but I'm not a website, and a spine but I'm not a person. Open me for a story! What am I?"],
    clue: "Look where the stories are kept." },
  { keys: ["table"], place: "inside", riddles: [
    "I have four legs but never walk. Plates sit on my back while families talk. What am I?"],
    clue: "Where do you eat dinner?" },
  { keys: ["desk"], place: "inside", riddles: [
    "Pencils and paper sit on top of me. I'm where homework and drawing happen. What am I?"],
    clue: "Find where people write and draw." },
  { keys: ["chair", "chairs", "stool", "armchair"], place: "inside", riddles: [
    "I have a seat but I never sit, and legs but I never run. What am I?"],
    clue: "Find something you sit on — but not the sofa!" },
  { keys: ["flowerpot", "plant pot", "plant", "plants", "houseplant", "pot plant"], place: "inside", riddles: [
    "I'm green and I drink but never eat. I grow toward the sunshine and never move my feet. What am I?"],
    clue: "Find something leafy that lives in a pot." },
  { keys: ["shoe", "shoes", "boot", "boots", "slipper", "slippers", "sneakers", "trainers"], place: "inside", riddles: [
    "We come in pairs and we have tongues, but we never talk. You wear us to go outside. What are we?"],
    clue: "Go to where shoes are kept." },
  { keys: ["front door", "back door", "door"], place: "inside", riddles: [
    "I open and close but I'm not a mouth. I have a handle but I'm not a cup. What am I?"],
    clue: "Look where people come in and go out." },
  { keys: ["windowsill", "window sill", "window", "windows"], place: "inside", riddles: [
    "I'm a hole in the wall you can see through but not walk through. Sunbeams come to visit me. What am I?"],
    clue: "Find where the light comes in." },
  { keys: ["curtain", "curtains", "blinds"], place: "inside", riddles: [
    "I open in the morning and close at night, and I keep the sun out of your eyes. What am I?"],
    clue: "Look near a window." },
  { keys: ["rug", "carpet", "mat", "doormat"], place: "inside", riddles: [
    "Everyone walks all over me, but I never complain. I lie flat on the floor. What am I?"],
    clue: "Look down at the floor!" },
  { keys: ["toy box", "toybox", "toy chest", "toy basket", "toys"], place: "inside", riddles: [
    "I'm full of fun at clean-up time. I'm the treasure chest of every child! What am I?"],
    clue: "Where do your toys go at clean-up time?" },
  { keys: ["teddy", "teddy bear", "stuffed animal", "stuffed toy", "plushie", "soft toy"], place: "inside", riddles: [
    "I'm soft and cuddly, I have a face, and I love hugs — but I'm not alive. What am I?"],
    clue: "Look for a cuddly friend." },
  { keys: ["lamp"], place: "inside", riddles: [
    "Click me on and I chase the dark away. What am I?"],
    clue: "Find something that makes light." },
  { keys: ["tv", "television", "telly"], place: "inside", riddles: [
    "I have a screen and a remote, and I show cartoons and movies. What am I?"],
    clue: "Look where you watch shows." },
  { keys: ["fridge", "refrigerator"], place: "inside", riddles: [
    "I'm big and cold and full of food. When you open me, a little light turns on. What am I?"],
    clue: "Go to the kitchen." },
  { keys: ["cupboard", "cabinet", "pantry"], place: "inside", riddles: [
    "I have doors but I'm not a house, and I keep plates, snacks or tins safe inside. What am I?"],
    clue: "Look in the kitchen." },
  { keys: ["sink"], place: "inside", riddles: [
    "I have a tap and a drain, and I'm where you wash your hands. What am I?"],
    clue: "Find where the water comes out." },
  { keys: ["bathtub", "bath tub", "tub", "bath"], place: "inside", riddles: [
    "I fill up with water and bubbles, and rubber ducks love me. What am I?"],
    clue: "Go to the bathroom." },
  { keys: ["towel", "towels"], place: "inside", riddles: [
    "The more I dry, the wetter I get. What am I?"],
    clue: "Look in the bathroom." },
  { keys: ["laundry basket", "laundry", "washing basket", "hamper"], place: "inside", riddles: [
    "Dirty socks and shirts all jump into me. What am I?"],
    clue: "Where do clothes go when they need washing?" },
  { keys: ["washing machine", "dryer"], place: "inside", riddles: [
    "I go round and round and make clothes clean. What am I?"],
    clue: "Find where the laundry gets done." },
  { keys: ["closet", "wardrobe"], place: "inside", riddles: [
    "Shirts and dresses hang inside me, waiting to be worn. What am I?"],
    clue: "Find where clothes are kept." },
  { keys: ["drawer", "drawers", "dresser"], place: "inside", riddles: [
    "Pull me out and push me in. Socks and secrets sleep inside me. What am I?"],
    clue: "Look for something that slides open." },
  { keys: ["stairs", "staircase", "steps", "step"], place: "inside", riddles: [
    "You go up me and you go down me, but I never move at all. What am I?"],
    clue: "Find a way to go up or down." },
  { keys: ["coat", "jacket", "coats", "coat hook", "coat rack"], place: "inside", riddles: [
    "I keep you warm outside and I have sleeves but no arms. What am I?"],
    clue: "Look where coats hang." },
  { keys: ["hat", "cap"], place: "inside", riddles: [
    "I sit on top of your head but I'm not your hair. What am I?"],
    clue: "Look for something you wear on your head." },
  { keys: ["backpack", "school bag", "bag", "handbag"], place: "inside", riddles: [
    "I have straps and zips, and I carry your things on your back. What am I?"],
    clue: "Look for something that carries things." },
  { keys: ["box", "boxes", "basket"], place: "inside", riddles: [
    "I have sides and a bottom, and I hold things inside me. What am I?"],
    clue: "Look for something you keep things in." },
  { keys: ["piano", "keyboard"], place: "inside", riddles: [
    "I have lots of keys but I can't open any doors. Press me and I sing! What am I?"],
    clue: "Find something that makes music." },
  { keys: ["clock"], place: "inside", riddles: [
    "I have hands but I can't clap, and a face but I can't smile. What am I?"],
    clue: "Find something that tells the time." },
  { keys: ["mirror"], place: "inside", riddles: [
    "Look at me and you'll see yourself smiling back. What am I?"],
    clue: "Find something shiny that copies you." },
  { keys: ["radiator", "heater"], place: "inside", riddles: [
    "I keep the room warm on cold days. What am I?"],
    clue: "Find something that warms the room." },
  { keys: ["highchair", "high chair", "crib", "cot"], place: "inside", riddles: [
    "I'm made just for babies. What am I?"],
    clue: "Look where the baby things are." },
  { keys: ["oven", "stove", "cooker", "fireplace", "fire"], place: "inside", unsafe: true, riddles: [
    "I get very hot to cook the food. What am I?"],
    clue: "Ask a grown-up for help here." },
  // ---------- outside ----------
  { keys: ["tree", "trees", "tree trunk"], place: "outside", riddles: [
    "I have a trunk but I'm not an elephant, and bark but I'm not a dog. What am I?"],
    clue: "Find something with leaves that's taller than a grown-up." },
  { keys: ["bush", "bushes", "hedge", "shrub"], place: "outside", riddles: [
    "I'm round and green and full of leaves. Birds hide in me, but I'm not a tree. What am I?"],
    clue: "Find a leafy plant that's smaller than a tree." },
  { keys: ["rock", "rocks", "stone", "stones", "boulder"], place: "outside", riddles: [
    "I'm hard and grey and I sit very still. Bugs love to hide under me. What am I?"],
    clue: "Find something heavy and stony." },
  { keys: ["flower bed", "flowerbed", "flowers", "flower"], place: "outside", riddles: [
    "Red, yellow, purple and blue — we smell sweet and bees love us too. What are we?"],
    clue: "Find where the flowers grow." },
  { keys: ["fence", "gate"], place: "outside", riddles: [
    "I stand in a long line around the yard, keeping things in — I work very hard! What am I?"],
    clue: "Walk to the edge of the yard." },
  { keys: ["bench", "garden chair", "deck chair", "picnic table"], place: "outside", riddles: [
    "I have a seat but I live outside. Grown-ups rest on me in the sunshine. What am I?"],
    clue: "Find somewhere to sit outdoors." },
  { keys: ["swing", "swings"], place: "outside", riddles: [
    "Back and forth, up to the sky — push me and I make you fly! What am I?"],
    clue: "Where do you play outside?" },
  { keys: ["slide"], place: "outside", riddles: [
    "Up the ladder you climb, then whoosh — down you go! What am I?"],
    clue: "Where do you play outside?" },
  { keys: ["trampoline"], place: "outside", riddles: [
    "Jump on me and I'll bounce you high! What am I?"],
    clue: "Find something bouncy." },
  { keys: ["sandbox", "sandpit", "sand pit"], place: "outside", riddles: [
    "I'm full of tiny grains for building castles. What am I?"],
    clue: "Find where you dig and build." },
  { keys: ["watering can"], place: "outside", riddles: [
    "I have a handle and a long spout, and I give the flowers a drink. What am I?"],
    clue: "What do grown-ups use to water the plants?" },
  { keys: ["garden hose", "hose"], place: "outside", riddles: [
    "I curl up like a snake but I'm not alive. When the garden is thirsty, I help it thrive! What am I?"],
    clue: "What do grown-ups use to water the plants?" },
  { keys: ["bucket", "pail"], place: "outside", riddles: [
    "I have a handle and I carry water or sand. What am I?"],
    clue: "Look for something that carries water." },
  { keys: ["bike", "bicycle", "scooter", "tricycle"], place: "outside", riddles: [
    "I have wheels and handlebars, and you pedal or push to ride me. What am I?"],
    clue: "Find something you ride." },
  { keys: ["ball", "football", "soccer ball"], place: "outside", riddles: [
    "I'm round and I bounce, and everyone wants to kick or throw me. What am I?"],
    clue: "Find something round for playing games." },
  { keys: ["planter", "garden pot", "plant pot outside"], place: "outside", riddles: [
    "I'm a pot that lives outside, with soil inside and flowers galore. What am I?"],
    clue: "Find a plant pot outside." },
  { keys: ["log", "logs", "woodpile", "stump"], place: "outside", riddles: [
    "I used to be part of a tree, and now I'm lying on the ground. What am I?"],
    clue: "Find a piece of wood outside." },
  { keys: ["shed", "playhouse", "doghouse", "kennel"], place: "outside", riddles: [
    "I'm a tiny house in the garden, but nobody sleeps in me. What am I?"],
    clue: "Find a little building outside." },
  { keys: ["porch", "deck", "patio", "doorstep"], place: "outside", riddles: [
    "I'm right outside the door, where you stand before you go in. What am I?"],
    clue: "Look near the door where you go outside." },
  { keys: ["mailbox", "letterbox"], place: "outside", riddles: [
    "Letters and cards arrive inside me. What am I?"],
    clue: "Where does the post arrive?" },
  { keys: ["grass", "lawn"], place: "outside", riddles: [
    "I'm green and soft and I get a haircut every week. What am I?"],
    clue: "Look down at the ground outside." },
  { keys: ["pool", "pond", "road", "street", "driveway"], place: "outside", unsafe: true, riddles: [
    "Grown-ups only go here! What is it?"],
    clue: "Ask a grown-up for help here." },
];

const RIDDLE_ROOMS = [
  ["living room", "inside"], ["lounge", "inside"], ["family room", "inside"], ["kitchen", "inside"],
  ["dining room", "inside"], ["bedroom", "inside"], ["bathroom", "inside"], ["hallway", "inside"],
  ["hall", "inside"], ["playroom", "inside"], ["office", "inside"], ["study", "inside"],
  ["laundry room", "inside"], ["garage", "inside"], ["basement", "inside"], ["attic", "inside"],
  ["nursery", "inside"], ["backyard", "outside"], ["front yard", "outside"], ["yard", "outside"],
  ["garden", "outside"], ["park", "outside"], ["playground", "outside"], ["outside", "outside"],
];

const RIDDLE_COLOURS = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "brown",
  "black", "white", "grey", "gray", "silver", "gold", "golden"];

// Position words, longest first. `it` is how the riddle finishes: "…is hiding UNDER it!"
const RIDDLE_PREPS = [
  ["on top of", "on top of it"], ["underneath", "under it"], ["in front of", "in front of it"],
  ["next to", "right next to it"], ["in between", "tucked inside it"], ["between", "tucked inside it"],
  ["beneath", "under it"], ["below", "under it"], ["under", "under it"], ["behind", "behind it"],
  ["inside", "inside it"], ["beside", "right next to it"], ["near", "close to it"], ["by", "right next to it"],
  ["on", "on it"], ["in", "inside it"], ["at", "close to it"],
];

// `what` is what is hiding there, e.g. "my next clue" for a treasure-trail stop.
function makeRiddle(text, creature, seed = 0, what = null) {
  const raw = String(text || "").trim();
  const t = " " + raw.toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ") + " ";
  const at = (word) => {
    const m = t.match(new RegExp(` ${word.replace(/ /g, " ")} `));
    return m ? m.index : -1;
  };
  const treasure = what || (creature ? `my ${creature.accessory}` : "the treasure");

  // Objects mentioned, with where they appear. Longer names win ("toy box" before "box").
  const found = [];
  RIDDLE_OBJECTS.forEach((o) => o.keys.forEach((k) => {
    const i = at(k);
    if (i >= 0) found.push({ o, k, i, end: i + k.length });
  }));
  found.sort((a, b) => b.k.length - a.k.length);
  const chosen = [];
  found.forEach((f) => { if (!chosen.some((c) => f.i < c.end && c.i < f.end)) chosen.push(f); });
  chosen.sort((a, b) => a.i - b.i);
  const main = chosen[0] || null;

  // Position word: the one closest before the hiding object (or the first one if no object).
  let prep = null;
  for (const [w, it] of RIDDLE_PREPS) {
    const i = at(w);
    if (i < 0) continue;
    if (main ? i < main.i && (!prep || i > prep.i) : (!prep || i < prep.i)) prep = { w, it, i };
  }

  const room = RIDDLE_ROOMS.map(([r, place]) => ({ r, place, i: at(r) })).filter((x) => x.i >= 0).sort((a, b) => b.r.length - a.r.length)[0];
  const colour = RIDDLE_COLOURS.find((c) => at(c) >= 0);
  const pick = (arr) => arr[Math.abs(seed) % arr.length];
  const plural = main && /[^s]s$/.test(main.k) && !["glass", "bus"].includes(main.k);
  const hidingWords = (prep ? prep.it : "close to it").replace(/ it$/, plural ? " them" : " it");

  let riddle, clue, word = "";
  if (main) {
    riddle = `${pick(main.o.riddles)} ${cap(treasure)} is hiding ${hidingWords}!`;
    const roomBit = room && !main.o.clue.toLowerCase().includes(room.r) ? `Go to the ${room.r === "outside" ? "outdoors" : room.r}. ` : "";
    clue = roomBit + main.o.clue;
  } else {
    // Unknown object: build a letter riddle from the main noun.
    word = mainNoun(t, prep);
    if (word) {
      const L = word.length;
      const forms = [
        `I'm thinking of something that starts with the letter ${word[0].toUpperCase()} and ends with ${word[L - 1].toUpperCase()}. It has ${L} letters. ${cap(treasure)} is hiding ${hidingWords}!`,
        `Spell it out! It begins with ${word[0].toUpperCase()}, it has ${L} letters, and ${treasure} is hiding ${hidingWords}. What is it?`,
      ];
      riddle = pick(forms);
      clue = room ? `Go to the ${room.r === "outside" ? "outdoors" : room.r}.` : `The word starts with "${word.slice(0, 2).toUpperCase()}…".`;
    } else {
      riddle = `${cap(treasure)} is hiding somewhere nearby. Use your detective eyes and look everywhere!`;
      clue = room ? `Go to the ${room.r}.` : "Look high, look low, look all around!";
    }
  }
  if (colour) clue += ` Look for something ${colour === "gray" ? "grey" : colour}.`;

  const startsWithPrep = RIDDLE_PREPS.some(([w]) => t.startsWith(` ${w} `));
  const hint = raw ? (startsWithPrep ? `Look ${raw.replace(/[.!]+$/, "")}!` : `It's hidden here: ${raw.replace(/[.!]+$/, "")}.`) : "";

  return {
    riddle, clue, hint,
    variants: main ? main.o.riddles.length : word ? 2 : 1,
    place: main ? main.o.place : room ? room.place : null,
    unsafe: chosen.some((f) => f.o.unsafe),
    recognised: main ? main.k : word || null,
  };

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
}

// The word right after the position word, skipping little words, colours and sizes.
function mainNoun(t, prep) {
  const skip = new Set(["the", "a", "an", "my", "our", "your", "his", "her", "their", "big", "little",
    "small", "old", "new", "of", "top", "bottom", "side", "back", "front", "left", "right", ...RIDDLE_COLOURS]);
  const words = (prep ? t.slice(prep.i + prep.w.length + 1) : t).trim().split(" ");
  const stops = new Set(RIDDLE_PREPS.map(([w]) => w.split(" ")[0]));
  let last = "";
  for (const w of words) {
    if (stops.has(w) && last) break;
    if (!skip.has(w) && /^[a-z]{3,}$/.test(w)) last = w;
  }
  return last;
}
