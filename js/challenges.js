// Myth Seekers — Seeker Challenges.
//
// Before solving a riddle, kids pick a challenge TYPE (Physical, Mental or Teamwork) and turn the
// DIFFICULTY dial (4 levels). A random challenge from that type and level is shown.
// Add or edit challenges below. Fields:
//   text     what to do ({name} becomes the character's name)
//   seconds  optional timer
//   answer   optional answer (Mental) — hidden behind a "Show answer" button
//   outside  true = only offered when the treasure is hidden outside

const CHALLENGE_TYPES = [
  { id: "physical", icon: "🏃", label: "Physical", sub: "Move your body" },
  { id: "mental", icon: "🧠", label: "Mental", sub: "Use your brain" },
  { id: "teamwork", icon: "🤝", label: "Teamwork", sub: "Play together" },
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
};

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
