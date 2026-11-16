// Imagamigos — game content: characters, hiding spots, riddles and challenges.
// Everything a designer would want to tune lives in this file.

// ⭐ PLUSH STORE LINKS — paste each product's web address between the quotes.
// While a link is empty, the app shows "Coming soon" instead of a Buy button.
const STORE_LINKS = {
  scribbi: "",
  craggle: "",
  orbit: "",
  tangle: "",
  nyxie: "",
  glitch: "",
  leo: "",
};

const CREATURES = [
  {
    id: "scribbi",
    name: "Scribbi",
    kind: "Doodle Sprite",
    color: "#ff3d8b",
    soft: "#fff1e0",
    accessory: "Rainbow Crayon",
    accessoryEmoji: "🖍️",
    tagline: "A squishy, giggly pillow covered in doodles that come to life.",
    catchphrase: "Squiggle-squiggle-hee!",
    description:
      "Scribbi is a soft, squishy creature covered in doodles — swirls, stars, lightning bolts and a rainbow. Every time Scribbi giggles, a brand-new doodle appears somewhere on that cosy cream fur. Scribbi winks at everyone, sticks out a happy tongue, and simply cannot sit still when there's something to draw.",
    size: "As big as a comfy pillow",
    age: "6 sketchbooks old",
    home: "Art tables, notebooks and anywhere crayons live",
    food: "Rainbow sprinkles and sticky notes (only the yellow ones)",
    personality: ["Silly", "Creative", "Wiggly"],
    bestFriend: "Every blank piece of paper",
    sound: "A giggly 'squiggle-squiggle-hee!'",
    season: "Spring, when everything is colourful",
    likes: "Drawing, winking, rainbows, glitter",
    dislikes: "Erasers and boring grey days",
    power: "Anything Scribbi doodles comes to life for one whole minute",
    signs: ["A tiny doodle where there wasn't one before", "Crayon colours on your fingers", "A giggle coming from the toy box"],
    friendTips: ["Draw a picture together", "Wink back!", "Tell Scribbi a silly joke"],
    stats: { speed: 3, magic: 4, kindness: 4, sneaky: 3, strength: 2 },
    facts: [
      "Scribbi's doodles move around when nobody is looking.",
      "The little crown doodle appears when Scribbi feels proud.",
      "One of Scribbi's ears has a squiggle and the other has a plus sign.",
      "A wink from Scribbi means 'let's be friends'.",
      "The rainbow on Scribbi's tummy glows softly at bedtime.",
      "Scribbi once doodled a rainbow so big it covered a whole wall!",
    ],
    intro:
      "Hee-hee! Hi, I'm Scribbi! I was drawing the biggest rainbow ever and my Rainbow Crayon bounced away! Without it, all my doodles turn grey. Can you help me find it?",
    challenges: [
      { text: "Draw a giant swirl in the air with your finger — 5 times!", seconds: 0 },
      { text: "Find 5 things in the room that are different colours of the rainbow.", seconds: 0 },
      { text: "Wiggle like a squiggle! Wiggle your whole body until the timer ends.", seconds: 10 },
    ],
  },
  {
    id: "craggle",
    name: "Craggle",
    kind: "Moss Rock",
    color: "#2fc4b2",
    soft: "#e3f3ec",
    accessory: "Glow Crystal",
    accessoryEmoji: "💎",
    tagline: "A sleepy, mossy old rock who decided to become a pillow.",
    catchphrase: "Hmmm… no rush.",
    description:
      "Craggle is a mossy old rock who woke up one day and decided being a pillow sounded nice. Craggle moves slowly, thinks deeply and always wears a sleepy little smile. The cracks in Craggle's stone glow teal when Craggle is happy, and the moss on top is soft enough to nap on.",
    size: "As big as a beanbag",
    age: "A million years (still a pebble at heart)",
    home: "Gardens, rock piles and cosy, quiet corners",
    food: "Rainwater and a little sunshine",
    personality: ["Chill", "Steady", "Wise"],
    bestFriend: "Snails — they're the only ones who walk at Craggle's speed",
    sound: "A low, happy 'hmmmm-rrrumble'",
    season: "Autumn, for napping in leaf piles",
    likes: "Naps, moss, warm sunshine, being sat on (gently)",
    dislikes: "Being rushed, and leaf blowers",
    power: "Can stay perfectly still for 100 years — then do a little dance",
    signs: ["A patch of fresh moss indoors", "A pebble that seems to be smiling", "A soft, rumbly hum"],
    friendTips: ["Move slowly and calmly", "Share a sunny spot", "Tell Craggle about your day"],
    stats: { speed: 1, magic: 3, kindness: 4, sneaky: 4, strength: 5 },
    facts: [
      "Craggle's glowing cracks are like a smile you can see in the dark.",
      "The hexagon on Craggle's side is a map of the very first mountain.",
      "Craggle's moss grows a tiny bit every time someone says something kind.",
      "Craggle's little feet are 'just in case of dancing'.",
      "Craggle has never once been in a hurry.",
      "Real rocks can be millions of years old — just like Craggle!",
    ],
    intro:
      "Hmmm… hello there. I was napping in the sun and my Glow Crystal rolled right out of my moss. Without it, my cracks won't glow. No rush… but could you help me find it?",
    challenges: [
      { text: "Rock statue! Freeze like a rock — don't move a single pebble!", seconds: 15 },
      { text: "Walk across the room in super-slow motion, just like Craggle.", seconds: 0 },
      { text: "Curl up into a small round rock, then pop up and stretch tall. 5 times!", seconds: 0 },
    ],
  },
  {
    id: "orbit",
    name: "Orbit",
    kind: "Little Planet",
    color: "#4f74d6",
    soft: "#e2e9ff",
    accessory: "Moon Marble",
    accessoryEmoji: "🌕",
    tagline: "A tiny, wide-eyed planet who floated down to visit Earth.",
    catchphrase: "Boop-boop! Ooooh, what's that?",
    description:
      "Orbit is a tiny planet who floated down from space to find out what Earth is like. With a bright orange ring, two bouncy antennae and big amazed eyes, Orbit is always looking up and asking questions. Every crater on Orbit's round body came from a happy bump with a shooting star.",
    size: "As big as a beach ball",
    age: "4 billion years — but brand new to Earth!",
    home: "Windows, rooftops and anywhere you can see the sky",
    food: "Stardust cereal and moon cheese",
    personality: ["Curious", "Dreamy", "Amazed"],
    bestFriend: "The Moon — they wave to each other every night",
    sound: "A bouncy 'boop-boop! Ooooh!'",
    season: "Winter, when nights are long and starry",
    likes: "Stars, questions, spinning, bouncing",
    dislikes: "Cloudy nights and being upside down for too long",
    power: "Can float by spinning really, really fast",
    signs: ["Something quietly spinning on its own", "A tiny crater-shaped dent in a cushion", "Two antennae poking up behind the sofa"],
    friendTips: ["Ask lots of questions", "Look at the stars together", "Show Orbit something new"],
    stats: { speed: 4, magic: 4, kindness: 4, sneaky: 2, strength: 3 },
    facts: [
      "Orbit's antennae wiggle when they pick up signals from space.",
      "The orange ring helps Orbit balance while spinning.",
      "Every one of Orbit's craters has its own name.",
      "Real planets like Saturn have rings made of ice and rock.",
      "Orbit thinks Earth's best invention is pancakes.",
      "Orbit can spin around 100 times without getting dizzy.",
    ],
    intro:
      "Boop-boop! Hi, Earthling! I'm Orbit! My Moon Marble rolled away when I landed — it helps me find my way home to space. Can you help me find it?",
    challenges: [
      { text: "Spin like a planet! Turn around slowly 3 times, then stop and wobble.", seconds: 0 },
      { text: "Blast off! Crouch down, count 5-4-3-2-1, then jump as high as you can!", seconds: 0 },
      { text: "Float like you're in space — move in slow motion until the timer ends.", seconds: 15 },
    ],
  },
  {
    id: "tangle",
    name: "Tangle",
    kind: "Maze Keeper",
    color: "#1fa463",
    soft: "#e0f5e8",
    accessory: "Golden Key",
    accessoryEmoji: "🗝️",
    tagline: "A cheeky puzzle-lover with a golden maze on its tummy.",
    catchphrase: "Heh-heh! Which way, which way?",
    description:
      "Tangle is a puzzle-loving creature with a golden maze stitched right across its tummy. Tangle adores riddles, tricks and secret paths, and always wears a cheeky grin, as if Tangle already knows the answer. The curly golden ears spin round and round whenever Tangle is thinking hard.",
    size: "As big as a big, round cushion",
    age: "Nobody knows — it's a puzzle!",
    home: "Twisty places: under tables, behind bookshelves and in garden hedges",
    food: "Spaghetti (the twistier the better) and pretzels",
    personality: ["Clever", "Playful", "Cheeky"],
    bestFriend: "Anyone who loves a good riddle",
    sound: "A sneaky 'heh-heh-heh!'",
    season: "Summer — perfect for hedge mazes",
    likes: "Riddles, mazes, secret paths, surprises",
    dislikes: "Straight lines and spoilers",
    power: "Can find the way out of any maze — and build brand-new ones",
    signs: ["Things moved into funny twisty patterns", "A riddle that wasn't there before", "A curly golden thread"],
    friendTips: ["Solve a riddle together", "Never give away the answer", "Laugh at Tangle's tricks"],
    stats: { speed: 3, magic: 4, kindness: 3, sneaky: 5, strength: 3 },
    facts: [
      "The maze on Tangle's tummy changes every night.",
      "Tangle's curly ears spin when Tangle is thinking hard.",
      "Tangle has never been lost — not even once.",
      "The middle of Tangle's maze hides a secret only best friends get to hear.",
      "Some real hedge mazes are hundreds of years old.",
      "Tangle says good morning with a riddle.",
    ],
    intro:
      "Heh-heh! Psst, amigo! I'm Tangle! I lost my Golden Key — it opens the secret door in the middle of my maze. Help me find it and you'll be a maze master too!",
    challenges: [
      { text: "Trace a maze! Draw a twisty path in the air with your finger, from your head down to your toes.", seconds: 0 },
      { text: "Walk a zig-zag path across the room — no straight lines allowed!", seconds: 0 },
      { text: "Twist your arms into a pretzel, then untangle them. 3 times!", seconds: 0 },
    ],
  },
  {
    id: "nyxie",
    name: "Nyxie",
    kind: "Moon Cat",
    color: "#8b5cf6",
    soft: "#ece4ff",
    accessory: "Wishing Star",
    accessoryEmoji: "⭐",
    tagline: "A crescent-moon cat who guards sweet dreams at night.",
    catchphrase: "Mrrrow… sweet dreams.",
    description:
      "Nyxie is a crescent-moon cat who wakes up when the stars come out. Silver constellations are stitched across Nyxie's velvety purple fur, and those glowing teal eyes can see in the dark. Nyxie looks mysterious, but is really a gentle night guardian who chases bad dreams away.",
    size: "As long as a sleeping cat, curled into a moon",
    age: "As old as the moon (but Nyxie never tells)",
    home: "Windowsills at night, beds and cosy pillows",
    food: "Starlight milk and moonbeam cookies",
    personality: ["Mysterious", "Gentle", "Loyal"],
    bestFriend: "The night sky — Nyxie knows every star",
    sound: "A soft, sleepy 'mrrrow~'",
    season: "Winter, when the nights are longest",
    likes: "Night time, stars, quiet, cosy blankets",
    dislikes: "Loud alarms and being woken up early",
    power: "Can turn bad dreams into sweet ones",
    signs: ["A sparkle on your pillow", "A soft purr at bedtime", "A curled-up moon shape on a blanket"],
    friendTips: ["Use a soft, whispery voice", "Say goodnight to the moon", "Share your favourite dream"],
    stats: { speed: 4, magic: 5, kindness: 4, sneaky: 5, strength: 2 },
    facts: [
      "The constellations on Nyxie's fur are real star patterns.",
      "Nyxie's ears each have a little star inside.",
      "Real cats can see much better in the dark than people can.",
      "Nyxie's crescent shape grows rounder on a full moon.",
      "Nyxie naps all day so nights can be extra magical.",
      "A slow blink from Nyxie means 'I trust you'.",
    ],
    intro:
      "Mrrrow… hello, little amigo. My Wishing Star slipped out of the sky and landed somewhere nearby. Without it, I can't send tonight's sweet dreams. Will you help me find it?",
    challenges: [
      { text: "Cat stretch! Reach your paws forward, arch your back, then do a big yawn.", seconds: 0 },
      { text: "Tiptoe like a cat at night — 10 completely silent steps.", seconds: 0 },
      { text: "Slow blink! Close your eyes and stay still like a sleepy cat.", seconds: 10 },
    ],
  },
  {
    id: "glitch",
    name: "Glitch",
    kind: "Pixel Pal",
    color: "#9b4dff",
    soft: "#efe2ff",
    accessory: "Power Pixel",
    accessoryEmoji: "🟩",
    tagline: "A cheeky pixel creature who jumped out of a video game.",
    catchphrase: "Bleep-bloop! Level up!",
    description:
      "Glitch is a pixel creature who jumped out of a video game and into the real world. Some of Glitch's pixels are still loading — that's why there are mint-green squares all over! Glitch is cheeky, super-fast and loves pressing buttons, but always takes turns and plays fair.",
    size: "As big as a squishy floor cushion",
    age: "Version 1.0 — brand new!",
    home: "Near TVs, game controllers and anything with buttons",
    food: "Power-ups and crunchy pixel crackers",
    personality: ["Cheeky", "Speedy", "Fair"],
    bestFriend: "Whoever beats Glitch's high score",
    sound: "A beepy 'bleep-bloop!'",
    season: "Any season — Glitch runs on game time",
    likes: "Games, high scores, buttons, racing",
    dislikes: "Low batteries and lag",
    power: "Can teleport short distances — with a little buzz",
    signs: ["A mint-green square left behind", "A beep from nowhere", "A toy that moved when you blinked"],
    friendTips: ["Play a game together", "Cheer when Glitch levels up", "Take turns and play fair"],
    stats: { speed: 5, magic: 3, kindness: 3, sneaky: 4, strength: 3 },
    facts: [
      "Glitch's pixels finish loading when Glitch feels really happy.",
      "Glitch's raised eyebrow means a clever plan is coming.",
      "The very first video games could only show a few colours.",
      "Glitch's square ears pick up game signals.",
      "Glitch always has 3 extra lives.",
      "Glitch can say 'game over' backwards: 'revo emag'!",
    ],
    intro:
      "Bleep-bloop! Player One, is that you? I'm Glitch! My Power Pixel fell out when I jumped out of my game, and now I can't level up! Help me find it?",
    challenges: [
      { text: "Robot moves! Move like a video game robot until the timer ends.", seconds: 10 },
      { text: "Jump left, jump right, jump forward, jump back — like a game character!", seconds: 0 },
      { text: "Freeze-frame! Dance, dance, dance… then FREEZE when the timer ends.", seconds: 15 },
    ],
  },
  {
    id: "leo",
    name: "Leo",
    kind: "Moonwolf",
    challengeSet: "wolf",               // Leo uses the Wolf Pack challenge wheel (js/challenges.js)
    moonForm: "assets/characters/leo-moon.png", // unlocked after Leo's quest; also used in AR
    color: "#e0b45c",
    soft: "#f3ead8",
    accessory: "Moon Medallion",
    accessoryEmoji: "🌙",
    tagline: "A friendly young wolf in a starry cape who welcomes everyone into the pack.",
    catchphrase: "Awoooo! Welcome to the pack!",
    description:
      "Leo is a friendly young wolf with a soft grey-and-cream coat and a starry navy cape. Unlike the wolves in scary stories, Leo is gentle, loyal and loves everyone in the pack — and to Leo, everyone is in the pack! At night Leo's cape glows with stars, and when Leo howls at the moon, the moon howls back (very, very quietly).",
    size: "As big as a giant cuddly beanbag",
    age: "5 full moons",
    home: "Forest edges, cosy dens and the rug by the front door",
    food: "Blueberries, crunchy carrots and moon-shaped cookies",
    personality: ["Loyal", "Gentle", "Brave"],
    bestFriend: "The whole pack — and that means you!",
    sound: "A happy, rolling 'Awoooo!'",
    season: "Winter, for racing through the snow",
    likes: "Howling at the moon, long walks, sniffing new things, belly rubs",
    dislikes: "Anyone feeling left out",
    power: "Can follow any trail — even one made of moonlight",
    signs: ["Paw prints that sparkle", "A soft, happy howl at bedtime", "A trail of tiny gold stars"],
    friendTips: ["Never leave anyone out", "Howl together at the moon", "Go exploring side by side"],
    stats: { speed: 4, magic: 4, kindness: 5, sneaky: 3, strength: 4 },
    facts: [
      "Real wolves live in families called packs, and they look after each other.",
      "A wolf's howl can be heard more than 10 kilometres away.",
      "Leo's cape was stitched by the moon, using starlight thread.",
      "Wolves can smell things far, far better than people can.",
      "Leo's gold Moon Medallion glows brightest on a full moon.",
      "Leo was inspired by a real fluffy dog named Leo!",
    ],
    intro:
      "Awoooo! Hi, I'm Leo! I was howling at the moon and my Moon Medallion slipped off my cape. Without it, my cape can't glow. Will you join my pack and help me find it?",
    challenges: [
      { text: "Howl like a wolf — Awoooo! Three big howls!", seconds: 0 },
    ],
  },
];

// Hiding-place ideas for the "Suggest" button in grown-up setup.
// Grown-ups can also type any hiding place they like — js/riddles.js writes the riddle.
const HIDING_IDEAS = {
  inside: [
    "under a cushion on the sofa", "behind the books on the bookshelf", "next to a plant pot",
    "inside a shoe by the front door", "under a pillow on the bed", "under the kitchen table",
    "in the toy box", "on the windowsill behind the curtain", "under a chair", "under the doormat",
    "inside the laundry basket", "behind the bathroom door",
  ],
  outside: [
    "at the bottom of a tree", "beside a big rock", "in the flower bed", "on the porch step",
    "under a bush", "along the bottom of the fence", "under the garden bench", "under the slide",
    "behind an outdoor flowerpot", "inside the watering can",
  ],
};

// Challenges used when a treasure is hidden outside (more room to move!).
const OUTDOOR_CHALLENGES = {
  scribbi: [
    { text: "Find something outside for each colour: red, yellow, green and blue.", seconds: 0 },
    { text: "Draw a giant star on the ground with a stick or your foot.", seconds: 0 },
  ],
  craggle: [
    { text: "Find 3 rocks or pebbles: one small, one medium and one big.", seconds: 0 },
    { text: "Find something green and soft, like Craggle's moss.", seconds: 0 },
  ],
  orbit: [
    { text: "Look up! Find a cloud, a bird or the moon in the sky (never stare at the sun).", seconds: 0 },
    { text: "Orbit a tree! Run around it in a big circle like a planet.", seconds: 0 },
  ],
  tangle: [
    { text: "Walk a zig-zag path across the yard — no straight lines allowed!", seconds: 0 },
    { text: "Make a mini maze on the ground with sticks or stones.", seconds: 0 },
  ],
  nyxie: [
    { text: "Find your shadow and pounce on it like a cat!", seconds: 0 },
    { text: "Look for something shaped like a moon or a star outside.", seconds: 0 },
  ],
  leo: [
    { text: "Howl at the sky — can you hear an echo?", seconds: 0 },
  ],
  glitch: [
    { text: "Hop across 10 pretend 'pixel squares' like stepping stones.", seconds: 0 },
    { text: "Race to a tree or the fence and back — beat your high score!", seconds: 0 },
  ],
};

// "Make something for me!" — after the treasure is found, the character asks the family to
// create something together. Kids (and grown-ups) can snap a photo for the Memory Book.
const CREATE_REQUESTS = {
  scribbi: [
    "Draw a brand-new doodle creature and give it a name!",
    "Make a rainbow out of things you can find — one thing for every colour.",
    "Make and decorate a paper crown together — I lost mine!",
  ],
  craggle: [
    "Build me a cosy rock garden out of pebbles, toys or cushions.",
    "Build the tallest tower you can — strong like a mountain!",
    "Make a comfy nap spot for me out of blankets and pillows.",
  ],
  orbit: [
    "Build a rocket ship out of boxes, chairs or blankets — big enough for a grown-up too!",
    "Draw your very own planet and give it a name.",
    "Make a space helmet out of anything you can find.",
  ],
  tangle: [
    "Build a maze for a toy car or marble to roll through.",
    "Draw a maze on paper and have your grown-up solve it.",
    "Invent a secret code and write me a message in it.",
  ],
  nyxie: [
    "Make a cosy moon bed for me with your softest things.",
    "Draw the night sky with a constellation you made up.",
    "Make a dream catcher out of paper, string or ribbon.",
  ],
  glitch: [
    "Design a brand-new video game level on paper.",
    "Build a robot out of boxes, cups or blocks.",
    "Make up a dance move together and give it a game name, like 'The Power-Up'.",
  ],
  leo: [
    "Build a den out of pillows and blankets — big enough for the whole pack!",
    "Draw a map of your home and mark the best pack hideouts.",
    "Make a paper moon medallion for every member of your pack.",
  ],
};

// How to move between treasure-trail stops, in each character's style.
const MOVE_LIKE = {
  scribbi: "wiggle like a squiggle",
  craggle: "roll like a slow, heavy rock",
  orbit: "spin like a little planet",
  tangle: "zig-zag like you're in a maze",
  nyxie: "tiptoe like a cat at night",
  glitch: "move like a video game robot",
  leo: "lope like a wolf",
};
