// Imagamigos — Challenges.
//
// Before solving a riddle, kids spin the wheel for a challenge TYPE (Physical, Mental, Teamwork or
// Kindness) — or tap a segment to choose — and turn the DIFFICULTY dial (4 levels). A random challenge from that type and level is shown.
// Add or edit challenges below. Fields:
//   text     what to do ({name} becomes the character's name)
//   seconds  optional timer
//   answer   optional answer (Mental) — hidden behind a "Show answer" button
//   outside  true = only offered when the treasure is hidden outside

// The four types share the spinning wheel; `color` is the wheel segment colour.
const CHALLENGE_TYPES = [
  { id: "physical", icon: "🏃", label: "Physical", sub: "Move your body", color: "#ff8a3d" },
  { id: "mental", icon: "🧠", label: "Mental", sub: "Use your brain", color: "#7c6bff" },
  { id: "teamwork", icon: "🤝", label: "Teamwork", sub: "Play together", color: "#3fb6ff" },
  { id: "kindness", icon: "💖", label: "Kindness", sub: "Do something kind", color: "#ff5fa2" },
];

const CHALLENGE_LEVELS = [
  { level: 1, label: "Easy", icon: "🌱", color: "#4fe3a1", bonus: 0 },
  { level: 2, label: "Medium", icon: "🌿", color: "#ffd23f", bonus: 0 },
  { level: 3, label: "Hard", icon: "🌳", color: "#ff8a3d", bonus: 1 },
  { level: 4, label: "Super", icon: "🔥", color: "#ff4f6d", bonus: 2 },
];

const CHALLENGE_BANK = {
  physical: {
    1: [
      { text: "Jump up and down 5 times!" },
      { text: "Touch your toes, then reach up to the sky. Do it 3 times!" },
      { text: "Hop on one foot 5 times." },
      { text: "Spin around 3 times, then sit down — whoa, dizzy!" },
      { text: "Crawl like a bear to the door and back." },
      { text: "Run to the nearest tree and give it a high five!", outside: true },
    ],
    2: [
      { text: "Do 10 star jumps!" },
      { text: "Balance on one foot like a flamingo.", seconds: 15 },
      { text: "Hop on one foot 10 times, then switch feet and do 10 more." },
      { text: "Do 5 big frog jumps across the room." },
      { text: "Bear-crawl 10 steps forward, then 10 steps back." },
      { text: "Run to the fence and back 2 times!", outside: true },
    ],
    3: [
      { text: "Do 15 star jumps without stopping!" },
      { text: "Balance on one foot with your eyes closed.", seconds: 15 },
      { text: "Do 10 squats, then 10 toe touches." },
      { text: "Wall sit! Lean on a wall and sit on an invisible chair.", seconds: 20 },
      { text: "Jump rope — or pretend to — 25 times!" },
      { text: "Do 5 bunny hops across the grass, then run back.", outside: true },
    ],
    4: [
      { text: "Do 25 star jumps, then 10 squats!" },
      { text: "Plank! Hold your body straight like a board.", seconds: 30 },
      { text: "Stand on one foot and do 5 slow arm circles each way — no wobbling!" },
      { text: "Do 5 push-ups (knees on the floor is fine!)." },
      { text: "Run on the spot as fast as you can!", seconds: 30 },
      { text: "Run 3 laps around the yard!", outside: true },
    ],
  },
  mental: {
    1: [
      { text: "Count backwards from 10 to 1 — then shout BLAST OFF!" },
      { text: "What sound does a cow make? A duck? A cat?", answer: "Moo! Quack! Meow!" },
      { text: "Name 3 things that are red." },
      { text: "What comes next? 🔴 🔵 🔴 🔵 🔴 …", answer: "🔵 Blue!" },
      { text: "How many legs does a dog have?", answer: "4 legs" },
      { text: "Find something that starts with the letter B." },
    ],
    2: [
      { text: "What is 5 + 4?", answer: "9" },
      { text: "Name 5 animals that live in the ocean." },
      { text: "What comes next? 2, 4, 6, 8 …", answer: "10" },
      { text: "Spell CAT backwards.", answer: "T-A-C" },
      { text: "What has hands but can't clap?", answer: "A clock" },
      { text: "Remember these and say them back: 🍎 🐶 ⭐ 🚗", answer: "Apple, dog, star, car" },
    ],
    3: [
      { text: "What is 7 + 8?", answer: "15" },
      { text: "What is 6 × 3?", answer: "18" },
      { text: "Say the 7 days of the week in order.", answer: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday" },
      { text: "What has to be broken before you can use it?", answer: "An egg" },
      { text: "Spell RAINBOW backwards.", answer: "W-O-B-N-I-A-R" },
      { text: "Name 6 animals in 15 seconds — go!", seconds: 15 },
    ],
    4: [
      { text: "What is 12 × 3?", answer: "36" },
      { text: "What is 100 − 37?", answer: "63" },
      { text: "Name 8 animals in 20 seconds — go!", seconds: 20 },
      { text: "What comes next? 1, 1, 2, 3, 5, 8 …", answer: "13 (add the two numbers before it!)" },
      { text: "The more you take, the more you leave behind. What are they?", answer: "Footsteps" },
      { text: "Say the months of the year in order — no mistakes!", answer: "January, February, March, April, May, June, July, August, September, October, November, December" },
    ],
  },
  teamwork: {
    1: [
      { text: "Hold hands with a teammate and jump 3 times together." },
      { text: "Give your teammate a high five, a low five and a fist bump!" },
      { text: "One person makes a silly face — everyone else copies it!" },
      { text: "Make a bridge with your arms and let a toy go under it." },
      { text: "Give a teammate (or a teddy) a 3-second hug." },
    ],
    2: [
      { text: "Mirror game! Face a partner and copy every move they make.", seconds: 20 },
      { text: "Count to 20 together, taking turns: one says 1, the next says 2…" },
      { text: "Hold hands in a circle and walk around 2 times without letting go." },
      { text: "Build a tower of 5 things together." },
      { text: "One teammate calls a colour — everyone races to touch something that colour!" },
    ],
    3: [
      { text: "Sit back to back and stand up together — no hands!" },
      { text: "Carry a pillow across the room between two of you — no hands allowed!" },
      { text: "Spell DRAGON together: each person says one letter in turn." },
      { text: "One person closes their eyes. The others guide them to the door using words only." },
      { text: "Pass a toy around the team 10 times without dropping it." },
    ],
    4: [
      { text: "Make a human letter! Use all your bodies to make a T, then an L." },
      { text: "Silent line-up! Line up from shortest to tallest without talking." },
      { text: "Three-legged walk! Stand side by side, hold on tight and walk across the room in step." },
      { text: "Team story: each person adds one sentence to a story about {name}." },
      { text: "Balance a toy on a book and pass it to every teammate without dropping it." },
    ],
  },
  kindness: {
    1: [
      { text: "Give someone a big smile and say, \"Have a great day!\"" },
      { text: "Say thank you to someone for something nice they did." },
      { text: "Give a family member (or a teddy) a gentle hug." },
      { text: "Tell someone one thing you love about them." },
      { text: "Share a toy with someone for a little while." },
      { text: "Wave and say hello to a neighbour (with a grown-up nearby).", outside: true },
    ],
    2: [
      { text: "Help tidy up 5 things that aren't yours." },
      { text: "Draw a happy picture and give it to someone." },
      { text: "Ask someone, \"How are you feeling today?\" and really listen to the answer." },
      { text: "Help set the table or put out the cups." },
      { text: "Make a kind card for someone and hide it where they'll find it." },
      { text: "Leave a little water out for the birds (ask a grown-up first).", outside: true },
    ],
    3: [
      { text: "Do a chore without being asked — then tell a grown-up what you did!" },
      { text: "Write or draw a thank-you note for someone who helps you." },
      { text: "Teach someone something you know how to do." },
      { text: "Give 3 different people a compliment." },
      { text: "Help water the plants or fill a pet's water bowl (with a grown-up)." },
      { text: "Pick up 3 pieces of litter — wear gloves and ask a grown-up to help.", outside: true },
    ],
    4: [
      { text: "Plan a secret surprise for someone in your family — then do it!" },
      { text: "Make a kindness coupon, like \"one free hug\" or \"I'll help tidy your room\", and give it away." },
      { text: "With a grown-up, choose a toy or book you've outgrown to give to someone who'd love it." },
      { text: "Call or video-chat a grandparent or friend just to say hi and ask about their day." },
      { text: "Do 3 kind things in a row for 3 different people." },
    ],
  },
};

// ---------- Leo's own wheel: Wolf Pack challenges ----------
// Leo is a friendly wolf, so Leo's quests use a completely different set of challenges.
const WOLF_CHALLENGE_TYPES = [
  { id: "tracking", icon: "🐾", label: "Tracking", sub: "Follow the trail", color: "#e0b45c" },
  { id: "howl", icon: "🌙", label: "Howl", sub: "Sound & song", color: "#7c8cff" },
  { id: "pack", icon: "🐺", label: "Pack", sub: "Lead & follow", color: "#59c3a5" },
  { id: "senses", icon: "👂", label: "Senses", sub: "Listen, sniff, feel", color: "#ff7a7a" },
];

Object.assign(CHALLENGE_BANK, {
  tracking: {
    1: [
      { text: "Follow the leader! Step exactly where your grown-up steps for 10 steps." },
      { text: "Find 3 things that are grey and cream, just like Leo's fur." },
      { text: "Close your eyes while someone hides a sock. Find it while they say \"warmer\" or \"colder\"." },
      { text: "Look for real bird or animal footprints outside.", outside: true },
    ],
    2: [
      { text: "Make a trail of 5 toys, then have a teammate follow it to the end." },
      { text: "Wolf check: find something soft, something hard and something bumpy." },
      { text: "Spot 3 things in the room that have moved since this morning." },
      { text: "Follow a line of trees, fence posts or stepping stones without stepping off.", outside: true },
    ],
    3: [
      { text: "Someone hides a toy and leaves 3 arrow clues (made of socks or spoons). Follow the clues!" },
      { text: "Scent trail: a grown-up dabs a little soap or lemon on 3 things. Sniff them all out!" },
      { text: "Walk backwards along a trail of 5 objects without knocking any over." },
      { text: "Find 5 different kinds of leaves and match each one to its plant.", outside: true },
    ],
    4: [
      { text: "Make your own treasure trail with 5 clues for someone else to follow." },
      { text: "Memory track: study the room, then close your eyes while someone moves 1 thing. What changed?", seconds: 20 },
      { text: "Draw a map of the room and mark 3 secret spots for the pack." },
      { text: "Lead the pack on a mystery walk using only landmarks: \"go to the big tree, then the gate…\"", outside: true },
    ],
  },
  howl: {
    1: [
      { text: "Howl like a wolf — Awoooo! Three big howls!" },
      { text: "Make 3 animal sounds and let someone guess each animal." },
      { text: "Whisper-howl: howl as quietly as you possibly can." },
      { text: "Howl at the sky — can you hear an echo?", outside: true },
    ],
    2: [
      { text: "Howl high, then howl low, then howl right in the middle!" },
      { text: "Clap a rhythm and have someone copy it back to you." },
      { text: "Sing \"Twinkle Twinkle Little Star\" — but only using wolf howls!" },
      { text: "Copy a bird song you can hear outside.", outside: true },
    ],
    3: [
      { text: "Pack howl! Everyone starts quiet, gets louder… then stops on the same beat." },
      { text: "Make up a short wolf song about the moon and sing it." },
      { text: "Echo game: howl a pattern (short-long-short) and everyone copies it exactly." },
    ],
    4: [
      { text: "Howl conversation: have a whole chat with a teammate using only howls, then guess what they said!" },
      { text: "Make up a 4-line poem or song about Leo and perform it." },
      { text: "Moon choir: make a 3-part howl song with your team — low, middle and high voices." },
    ],
  },
  pack: {
    1: [
      { text: "Wolf walk: everyone walks in a line behind the leader on hands and feet." },
      { text: "Pack hug! Everyone squishes together in one big group hug." },
      { text: "Take turns being the leader and doing a move for the pack to copy." },
      { text: "Run as a pack to the fence and back — stay together the whole way!", outside: true },
    ],
    2: [
      { text: "Pack circle: hold hands, all sit down together, then all stand up together." },
      { text: "Leader of the pack: the leader calls \"run\", \"sit\" or \"howl\" and everyone does it fast!" },
      { text: "Help a pack member finish something they find tricky." },
    ],
    3: [
      { text: "Protect the pup: one wolf guards a teddy while the others try to gently tag it." },
      { text: "Pack plan: cross the room together using only cushions as stepping stones (with a grown-up's OK)." },
      { text: "Pack praise: each wolf says one thing the pack is great at." },
    ],
    4: [
      { text: "Silent pack: line up in birthday order using only hand signals — no talking!" },
      { text: "Wolf relay: each wolf carries a toy to the next. Time the whole pack, then try to beat it!" },
      { text: "Pack promise: make up a kindness rule for your pack, write it down and everyone signs it." },
    ],
  },
  senses: {
    1: [
      { text: "Close your eyes and listen. How many different sounds can you hear?", seconds: 15 },
      { text: "Sniff 3 things in the kitchen (with a grown-up). Which smells best?" },
      { text: "Find something cold, something warm and something fluffy." },
      { text: "Listen for birds: how many different bird songs can you hear?", seconds: 20, outside: true },
    ],
    2: [
      { text: "Mystery touch: close your eyes while someone hands you an object. What is it?" },
      { text: "Night vision: with a grown-up, dim the lights and find 3 things." },
      { text: "Wolf ears: everyone whispers a different word at once. Can you hear yours?" },
    ],
    3: [
      { text: "Blindfold walk: a teammate guides you across the room using words only." },
      { text: "Sound hunt: someone hides a phone playing quiet music. Find it by listening!" },
      { text: "Smell test: guess 3 smells with your eyes closed (like orange, soap or cinnamon)." },
    ],
    4: [
      { text: "Moon senses: eyes closed — name 5 sounds, 2 smells and 1 thing you can feel.", seconds: 30 },
      { text: "Silent stalk: sneak up on a teammate with closed eyes. If they hear you and point, you're caught!" },
      { text: "Memory sniff: smell 4 things, then name them again in a mixed-up order." },
    ],
  },
});

// Which wheel a character uses.
function challengeTypesFor(creature) {
  return creature && creature.challengeSet === "wolf" ? WOLF_CHALLENGE_TYPES : CHALLENGE_TYPES;
}

// Pick a challenge. Physical Easy also includes the character's own themed challenges.
function pickChallenge(type, level, creature, outside, previousText) {
  let pool = (CHALLENGE_BANK[type] && CHALLENGE_BANK[type][level]) || [];
  pool = pool.filter((c) => !c.outside || outside);
  if (type === "physical" && level === 1 && creature) {
    const own = outside && typeof OUTDOOR_CHALLENGES !== "undefined" ? OUTDOOR_CHALLENGES[creature.id] : creature.challenges;
    pool = pool.concat(own || []);
  }
  const fresh = pool.filter((c) => c.text !== previousText);
  const list = fresh.length ? fresh : pool;
  const c = list[Math.floor(Math.random() * list.length)] || { text: "Do a happy dance!" };
  return { ...c, text: c.text.replace(/\{name\}/g, creature ? creature.name : "your friend") };
}
