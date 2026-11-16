// Imagine Seek — "Play together": the last step of every quest.
// A grown-up and a kid play a short, imaginative game together. The game type rotates each quest:
//   🎭 Act it out → 🤫 Creature charades → 📣 Dreamling says → 🎁 The Invisible Box → 🎨 Dream Workshop
// (🔀 in the app switches to another game any time). Edit the content below freely.

const TOGETHER_GAMES = [
  { id: "act", icon: "🎭", name: "Act it out",
    how: "{name} sets a pretend scene. Play it out together — use your whole body!" },
  { id: "charades", icon: "🤫", name: "Creature charades",
    how: "Take turns: the actor peeks at the secret card, then acts it out with no words. Everyone else guesses!" },
  { id: "says", icon: "📣", name: "Dreamling says",
    how: "Only move when you hear \"{name} says\"! If {name} doesn't say it… stay still!" },
  { id: "box", icon: "🎁", name: "The Invisible Box",
    how: "Take turns: open the invisible box, pull something out and show what it is — how big, how heavy, how it moves. Everyone else guesses! Then pass the box on." },
  { id: "workshop", icon: "🎨", name: "Dream Workshop",
    how: "Make something together, then snap a photo for your Memory Book." },
];

// 🎭 Act it out — pretend scenes, three per character.
const ACT_SCENES = {
  scribbi: [
    "Oh no, all the colours are melting! Catch the falling colours in your hands before they hit the floor!",
    "You're inside a giant colouring book. Tiptoe along the lines together — don't step outside them!",
    "Let's paint the whole sky! Use your arms as giant paintbrushes and paint a sunset together.",
  ],
  craggle: [
    "We're boulders rolling down a mountain. Roll… tumble… and slowly, slowly stop.",
    "Everyone is a sleepy rock. When the grown-up says \"sunshine!\", stretch and wake up very, very slowly.",
    "Climb a huge mountain together — hold hands, pull each other up, and wave from the top!",
  ],
  orbit: [
    "There's no gravity! Float across the room in slow motion — and don't bump into any space rocks.",
    "Blast off! Squat down for the countdown, then zoom around the room as rockets and land gently.",
    "We've landed on a bouncy planet. Every single step is a big, springy bounce!",
  ],
  tangle: [
    "We're lost in a giant maze! Walk together, and every time you hit a wall, spin around and try another way.",
    "The floor is a secret maze only Tangle can see. Follow the leader exactly — the kid leads!",
    "Sneak past the sleeping maze guard on tiptoe. If they hear you, freeze!",
  ],
  nyxie: [
    "We're cats on a moonlit roof: stretch, tiptoe, and pounce on the falling stars!",
    "Catch the fireflies! Cup your hands and gently catch the glowing bugs floating around the room.",
    "It's a sleepy night. Yawn, stretch, and curl up together like a crescent moon.",
  ],
  glitch: [
    "We're video game characters! Run, jump over pretend obstacles, and grab all the coins.",
    "Oh no, a glitch! Move in jerky robot slow motion… then super fast… then FREEZE!",
    "Level up! Strike a power-up pose, then show off your brand-new superpower move.",
  ],
  leo: [
    "The floor is lava! Cross the room to rescue Leo using only pillows and furniture.",
    "We're a wolf pack on a snowy trail. Walk in a line, sniff for clues, and howl when you find one!",
    "Wolf hide-and-seek: one wolf counts to 10 while the pack hides, then sniffs them all out.",
  ],
};

// 🤫 Creature charades — secret cards (the current character's cards come first).
const CHARADES = {
  scribbi: ["Scribbi drawing a giant rainbow", "Scribbi winking and giggling", "Scribbi wiggling like a squiggle"],
  craggle: ["Craggle napping in the sun", "Craggle walking super, super slowly", "Craggle being sat on — gently!"],
  orbit: ["Orbit spinning in space", "Orbit seeing a shooting star", "Orbit blasting off"],
  tangle: ["Tangle lost in a maze", "Tangle solving a tricky puzzle", "Tangle laughing at a secret joke"],
  nyxie: ["Nyxie sneaking through the night", "Nyxie stretching like a cat", "Nyxie hanging stars in the sky"],
  glitch: ["Glitch doing a robot dance", "Glitch glitching — frozen… then jerky!", "Glitch winning a video game"],
  leo: ["Leo howling at the moon", "Leo following a scent trail", "Leo doing the zoomies"],
};

// 📣 Dreamling says — each character's own moves, mixed with everyday ones.
const SAYS_MOVES = {
  scribbi: ["draw a rainbow in the air", "wiggle like a squiggle", "wink at your grown-up"],
  craggle: ["move in slow motion", "be a perfectly still rock", "do a big, slow stretch"],
  orbit: ["spin like a planet", "float like you're in space", "count down and blast off"],
  tangle: ["walk in a zig-zag", "tiptoe sneakily", "tie your arms in a knot"],
  nyxie: ["stretch like a cat", "purr softly", "curl up like a crescent moon"],
  glitch: ["move like a robot", "freeze like a paused game", "do a victory dance"],
  leo: ["howl like a wolf", "sniff the air", "walk on all fours"],
};
const SAYS_EVERYDAY = ["touch your nose", "jump three times", "spin around", "wiggle your fingers", "stand on one foot",
  "flap your arms", "march on the spot", "make a silly face", "reach up to the sky", "touch your toes"];

// 🎁 The Invisible Box — what kind of box each character brings.
const BOX_TWIST = {
  scribbi: "Scribbi's invisible box is full of colours and doodles.",
  craggle: "Craggle's invisible box is very, very heavy — and very, very old.",
  orbit: "Orbit's invisible box came all the way from outer space!",
  tangle: "Tangle's invisible box is full of tricks and surprises.",
  nyxie: "Nyxie's invisible box is full of night-time things.",
  glitch: "Glitch's invisible box is full of things from video games.",
  leo: "Leo's invisible box is full of things from the forest.",
};
