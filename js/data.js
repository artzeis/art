// Myth Seekers — game content: creatures, hiding spots, riddles and challenges.
// Everything a designer would want to tune lives in this file.

const CREATURES = [
  {
    id: "fairy",
    name: "Pip Petalwing",
    kind: "Fairy",
    color: "#f48fb1",
    accessory: "Flower Crown",
    accessoryColor: "pink",
    accessoryEmoji: "🌸",
    tagline: "A tiny glowing helper who paints dew onto flowers every morning.",
    description:
      "Fairies are no bigger than your thumb and shine with a soft glow when they are happy. Pip lives where flowers grow and sunlight is warm. She can't resist anything sparkly and leaves tiny drops of dew on petals as a thank-you to the garden.",
    home: "Flower gardens, sunny windowsills and potted plants",
    likes: "Sparkles, petals, humming songs, kindness",
    power: "Can make a flower bloom by whispering to it",
    facts: [
      "A fairy's wings beat so fast they sound like a soft hum.",
      "Fairies sleep curled up inside tulips.",
      "If you say thank you to a plant, a fairy hears it!",
      "Fairy glow changes colour with their mood — pink means happy.",
    ],
    intro:
      "Hello, Seeker! I dropped my Flower Crown while flying, and now I can't glow without it. Can you help me find it?",
    challenges: [
      { text: "Flutter your arms like fairy wings and tiptoe all the way around the room!", seconds: 0 },
      { text: "Find 3 things that are pink or purple and point to each one.", seconds: 0 },
      { text: "Freeze like a fairy statue — don't move a wiggle!", seconds: 15 },
    ],
  },
  {
    id: "gnome",
    name: "Bramble Mossbeard",
    kind: "Gnome",
    color: "#e53935",
    accessory: "Pointy Red Hat",
    accessoryColor: "red",
    accessoryEmoji: "🎩",
    tagline: "A grumbly-but-kind garden guardian with a very long beard.",
    description:
      "Gnomes are small, strong and very good at digging. Bramble guards the garden at night, chases away mischief and helps worms find their way home. He grumbles a lot, but he always shares his mushroom soup.",
    home: "Under garden roots, near rocks and cosy dark corners",
    likes: "Mushrooms, shiny pebbles, naps, counting things",
    power: "Can talk to worms, beetles and snails",
    facts: [
      "A gnome's hat grows a tiny bit taller every birthday.",
      "Gnomes can be 300 years old and still feel young.",
      "Gnomes are 7 times stronger than a person their size!",
      "They polish pebbles until they shine like stars.",
    ],
    intro:
      "Hmph! Hello there. My Pointy Red Hat blew right off my head in the wind. A gnome without his hat is just a beard with legs! Will you help me?",
    challenges: [
      { text: "Do 10 gnome squats: crouch down tiny, then pop up tall!", seconds: 0 },
      { text: "Count 10 things in the room that are round like pebbles.", seconds: 0 },
      { text: "Walk like a gnome — tiny, stompy steps — to the door and back.", seconds: 0 },
    ],
  },
  {
    id: "elf",
    name: "Lirien Leafwhisper",
    kind: "Elf",
    color: "#43a047",
    accessory: "Silver Leaf Bow",
    accessoryColor: "green",
    accessoryEmoji: "🍃",
    tagline: "A quiet forest elf who can hear a leaf fall a mile away.",
    description:
      "Elves are tall, graceful and wise. They move without a sound and have pointy ears that hear the smallest whispers. Lirien looks after the trees, sings to the stars, and is the best archer in the whole forest.",
    home: "Tall trees, quiet bookshelves and leafy hideaways",
    likes: "Quiet, stories, starlight, helping animals",
    power: "Can walk across fallen leaves without making them crunch",
    facts: [
      "Elves can live for a thousand years.",
      "An elf's pointy ears can hear a whisper from across a field.",
      "Elves name every tree in their forest.",
      "Elves love books — they have been writing stories for ages.",
    ],
    intro:
      "Greetings, young Seeker. I set down my Silver Leaf Bow to help a lost bunny, and now it is hidden. Will you move as quietly as an elf to find it?",
    challenges: [
      { text: "Silent elf walk: take 10 steps heel-to-toe without making a single sound.", seconds: 0 },
      { text: "Close your eyes and listen. Name 3 sounds you can hear.", seconds: 20 },
      { text: "Balance on one foot like an elf in a tree!", seconds: 10 },
    ],
  },
  {
    id: "bird",
    name: "Ember Sunfeather",
    kind: "Sunfeather Bird",
    color: "#ff9800",
    accessory: "Golden Feather",
    accessoryColor: "gold",
    accessoryEmoji: "🪶",
    tagline: "A magical bird whose feathers shimmer like a sunrise.",
    description:
      "Sunfeather birds fly so high they touch the clouds. Their feathers glow orange and gold, and they sing the sun up every morning. Ember is cheerful, a bit of a show-off, and loves to race the wind.",
    home: "High places — tops of shelves, windows and treetops",
    likes: "Singing, high places, warm sunlight, racing",
    power: "Can make a rainbow by flapping through a rain shower",
    facts: [
      "A Sunfeather's song can be heard on the other side of a mountain.",
      "They only lose one golden feather a year — it's very lucky to find one!",
      "Sunfeathers keep warm by sitting in sunbeams.",
      "Their eggs glow like little nightlights.",
    ],
    intro:
      "Tweet-tweet! Hi, hi, hi! I was doing loop-the-loops and my Golden Feather floated away. I can't fly my fastest without it! Can you find it?",
    challenges: [
      { text: "Flap your wings 15 times as fast as you can!", seconds: 0 },
      { text: "Sing a bird song — tweet, chirp and whistle!", seconds: 10 },
      { text: "Soar around the room with your arms out, then land softly on one foot.", seconds: 0 },
    ],
  },
  {
    id: "centaur",
    name: "Thistle Swiftmane",
    kind: "Centaur",
    color: "#8d6e63",
    accessory: "Lucky Horseshoe",
    accessoryColor: "silver",
    accessoryEmoji: "🍀",
    tagline: "Half horse, half person, and all heart — a stargazing galloper.",
    description:
      "Centaurs have the body of a horse and the upper body of a person. They are fast, brave, and great at reading the stars to find their way. Thistle is gentle and wise, and she loves teaching young creatures about the night sky.",
    home: "Open meadows, doorways and wide spaces to gallop",
    likes: "Galloping, stars, maps, apples",
    power: "Can find her way anywhere by looking at the stars",
    facts: [
      "Centaurs can gallop as fast as the wind.",
      "They have names for over 1,000 stars.",
      "A centaur's horseshoe brings luck to whoever finds it.",
      "Centaurs love crunchy apples and carrots.",
    ],
    intro:
      "Hello, friend! I galloped so fast that my Lucky Horseshoe came loose. Without it, my luck has run away! Will you gallop with me to find it?",
    challenges: [
      { text: "Gallop in place like a centaur!", seconds: 20 },
      { text: "Find something shaped like a star, a moon or a circle.", seconds: 0 },
      { text: "Do 5 big horse jumps — as high as you can!", seconds: 0 },
    ],
  },
];

// Hiding spots. A grown-up picks one per accessory in Setup.
// Each spot has three levels of help: a riddle, a clue, and a big hint.
const SPOTS = [
  {
    id: "couch", label: "Couch / sofa cushions", place: "inside",
    riddle: "I have a back but no spine, arms but no hands. You sink into me to watch shows and read with your family. What am I?",
    clue: "Look where people sit and snuggle in the living room.",
    hint: "Check between or under the couch cushions!",
  },
  {
    id: "bookshelf", label: "Bookshelf", place: "inside",
    riddle: "I hold a thousand stories, but I never say a word. Line by line on my wooden shelves, adventures sleep. Where am I?",
    clue: "Find where the books live.",
    hint: "Look on, behind or between books on the bookshelf.",
  },
  {
    id: "plant", label: "Houseplant / flowerpot", place: "inside",
    riddle: "I am green and I drink but never eat. I grow toward the sunshine and never move my feet. What am I?",
    clue: "Find something leafy that lives in a pot.",
    hint: "Peek around the bottom of a plant or flowerpot.",
  },
  {
    id: "shoes", label: "By the shoes / front door", place: "inside",
    riddle: "You put us on to go outside; we come in pairs and have tongues but never talk. Where are we?",
    clue: "Go to where you take your shoes off.",
    hint: "Look in or next to the shoes by the front door.",
  },
  {
    id: "pillow", label: "Under a bed pillow", place: "inside",
    riddle: "I'm soft and fluffy and I hold your dreams all night long. Where your head lays down, that's where I belong.",
    clue: "Go to a bedroom and look where you sleep.",
    hint: "Lift up a pillow on a bed!",
  },
  {
    id: "table", label: "Under the kitchen table", place: "inside",
    riddle: "I have four legs but never walk. Plates sit on my back while families talk. Look below me!",
    clue: "Where do you eat dinner?",
    hint: "Crawl under the kitchen or dining table.",
  },
  {
    id: "toybox", label: "Toy box / toy basket", place: "inside",
    riddle: "I'm full of fun, but I'm closed or I'm piled. I'm the treasure chest of every child!",
    clue: "Where do your toys go at clean-up time?",
    hint: "Look in the toy box or toy basket.",
  },
  {
    id: "window", label: "Windowsill", place: "inside",
    riddle: "I am a hole in the wall you can see through, but you can't walk through. Sunbeams come to visit me.",
    clue: "Find where the light comes in.",
    hint: "Check along a windowsill or behind the curtain.",
  },
  {
    id: "chair", label: "Under a chair", place: "inside",
    riddle: "I have a seat but I never sit, four legs but I never run. Look underneath for some fun!",
    clue: "Check something you sit on — not the couch!",
    hint: "Look under a chair.",
  },
  {
    id: "tree", label: "At the base of a tree", place: "outside",
    riddle: "I'm tall with a trunk but I'm not an elephant. I have bark but I'm not a dog. What am I?",
    clue: "Go outside and find something with leaves that's taller than a grown-up.",
    hint: "Look around the roots at the bottom of a tree.",
  },
  {
    id: "rock", label: "Under or beside a big rock", place: "outside",
    riddle: "I'm hard and grey and I sit very still. Bugs like to hide underneath me. What am I?",
    clue: "Find something heavy and stony in the garden.",
    hint: "Look beside or under a big rock.",
  },
  {
    id: "flowerbed", label: "In a flower bed", place: "outside",
    riddle: "Red, yellow, purple and blue, we smell sweet and bees love us too. Where do we grow?",
    clue: "Find where the flowers are growing outside.",
    hint: "Search gently in the flower bed — don't squish the flowers!",
  },
  {
    id: "step", label: "On a step / porch", place: "outside",
    riddle: "You go up me and you go down me, but I never move at all. What am I?",
    clue: "Look near the door where you go outside.",
    hint: "Check the steps or porch.",
  },
];

// Simple, cute inline SVG illustrations for each creature.
const CREATURE_SVG = {
  fairy: `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g class="wing-l"><ellipse cx="62" cy="80" rx="40" ry="26" fill="#b3e5fc" opacity=".8" transform="rotate(-25 62 80)"/><ellipse cx="66" cy="118" rx="28" ry="16" fill="#e1bee7" opacity=".8" transform="rotate(20 66 118)"/></g>
    <g class="wing-r"><ellipse cx="138" cy="80" rx="40" ry="26" fill="#b3e5fc" opacity=".8" transform="rotate(25 138 80)"/><ellipse cx="134" cy="118" rx="28" ry="16" fill="#e1bee7" opacity=".8" transform="rotate(-20 134 118)"/></g>
    <path d="M100 92 L130 160 L70 160 Z" fill="#f48fb1"/>
    <rect x="90" y="158" width="6" height="22" rx="3" fill="#ffcc80"/><rect x="104" y="158" width="6" height="22" rx="3" fill="#ffcc80"/>
    <circle cx="100" cy="70" r="22" fill="#ffe0b2"/>
    <path d="M78 66 Q80 42 100 44 Q122 42 122 66 Q116 54 100 54 Q86 54 78 66Z" fill="#ffb74d"/>
    <circle cx="86" cy="52" r="5" fill="#f06292"/><circle cx="100" cy="47" r="5" fill="#ba68c8"/><circle cx="114" cy="52" r="5" fill="#f06292"/>
    <circle cx="92" cy="72" r="3" fill="#4e342e"/><circle cx="108" cy="72" r="3" fill="#4e342e"/>
    <path d="M93 81 Q100 87 107 81" stroke="#d84315" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="86" cy="79" r="4" fill="#f8bbd0"/><circle cx="114" cy="79" r="4" fill="#f8bbd0"/>
    <line x1="128" y1="118" x2="152" y2="92" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/>
    <path d="M152 80 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z" fill="#ffeb3b"/>
  </svg>`,
  gnome: `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="100" cy="186" rx="50" ry="8" fill="#000" opacity=".15"/>
    <rect x="70" y="120" width="60" height="55" rx="18" fill="#1e88e5"/>
    <rect x="70" y="150" width="60" height="8" fill="#5d4037"/>
    <ellipse cx="82" cy="180" rx="14" ry="8" fill="#5d4037"/><ellipse cx="118" cy="180" rx="14" ry="8" fill="#5d4037"/>
    <path d="M100 10 L140 92 L60 92 Z" fill="#e53935"/>
    <ellipse cx="100" cy="92" rx="44" ry="9" fill="#c62828"/>
    <circle cx="100" cy="104" r="24" fill="#ffe0b2"/>
    <path d="M72 108 Q100 175 128 108 Q114 120 100 118 Q86 120 72 108Z" fill="#fafafa"/>
    <circle cx="100" cy="110" r="9" fill="#ffab91"/>
    <circle cx="90" cy="99" r="3" fill="#3e2723"/><circle cx="110" cy="99" r="3" fill="#3e2723"/>
    <path d="M84 93 l10 -2 M106 91 l10 2" stroke="#9e9e9e" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  elf: `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="100" cy="190" rx="40" ry="6" fill="#000" opacity=".15"/>
    <path d="M72 100 L128 100 L138 175 L62 175 Z" fill="#43a047"/>
    <rect x="66" y="132" width="68" height="7" fill="#795548"/>
    <rect x="84" y="174" width="10" height="14" rx="4" fill="#5d4037"/><rect x="106" y="174" width="10" height="14" rx="4" fill="#5d4037"/>
    <path d="M58 66 L80 72 L80 82 Z" fill="#ffe0b2"/><path d="M142 66 L120 72 L120 82 Z" fill="#ffe0b2"/>
    <circle cx="100" cy="76" r="24" fill="#ffe0b2"/>
    <path d="M74 80 Q72 40 100 36 Q128 40 126 80 Q122 58 100 56 Q78 58 74 80Z" fill="#2e7d32"/>
    <path d="M100 36 Q114 20 126 26" stroke="#2e7d32" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M86 64 Q100 58 114 64 Q100 54 86 64Z" fill="#fff59d"/>
    <ellipse cx="91" cy="78" rx="3" ry="4" fill="#1b5e20"/><ellipse cx="109" cy="78" rx="3" ry="4" fill="#1b5e20"/>
    <path d="M94 88 Q100 92 106 88" stroke="#6d4c41" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M150 90 Q172 135 150 180" stroke="#b0bec5" stroke-width="5" fill="none" stroke-linecap="round"/>
    <line x1="150" y1="90" x2="150" y2="180" stroke="#eceff1" stroke-width="1.5"/>
    <path d="M150 110 q8 -6 14 0 q-6 6 -14 0z" fill="#66bb6a"/>
  </svg>`,
  bird: `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M70 120 Q20 150 30 190 Q55 160 80 140Z" fill="#ff7043"/>
    <path d="M78 126 Q45 170 64 196 Q76 160 92 140Z" fill="#ffca28"/>
    <ellipse cx="105" cy="112" rx="44" ry="36" fill="#ff9800"/>
    <g class="wing-r"><path d="M100 104 Q150 60 184 82 Q160 110 112 124Z" fill="#ffb300"/><path d="M110 112 Q150 92 176 100 Q150 120 116 124Z" fill="#ff7043"/></g>
    <circle cx="138" cy="74" r="24" fill="#ffa726"/>
    <path d="M128 52 Q124 26 134 20 Q136 40 140 50 Q146 28 156 26 Q150 44 146 54Z" fill="#ff5722"/>
    <path d="M160 72 L184 80 L160 86 Z" fill="#fdd835"/>
    <circle cx="146" cy="70" r="5" fill="#fff"/><circle cx="147" cy="70" r="3" fill="#3e2723"/>
    <path d="M96 146 l-4 22 M110 146 l2 22" stroke="#6d4c41" stroke-width="4" stroke-linecap="round"/>
    <circle cx="40" cy="40" r="3" fill="#fff59d"/><circle cx="62" cy="24" r="2" fill="#fff59d"/><circle cx="176" cy="132" r="3" fill="#fff59d"/>
  </svg>`,
  centaur: `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="104" cy="192" rx="62" ry="6" fill="#000" opacity=".15"/>
    <path d="M150 118 Q186 120 178 168 Q170 140 154 136Z" fill="#4e342e"/>
    <ellipse cx="112" cy="128" rx="48" ry="24" fill="#8d6e63"/>
    <rect x="72" y="138" width="10" height="48" rx="5" fill="#795548"/><rect x="88" y="140" width="10" height="46" rx="5" fill="#8d6e63"/>
    <rect x="128" y="138" width="10" height="48" rx="5" fill="#795548"/><rect x="144" y="140" width="10" height="46" rx="5" fill="#8d6e63"/>
    <rect x="70" y="182" width="14" height="7" rx="2" fill="#3e2723"/><rect x="86" y="182" width="14" height="7" rx="2" fill="#3e2723"/>
    <rect x="126" y="182" width="14" height="7" rx="2" fill="#3e2723"/><rect x="142" y="182" width="14" height="7" rx="2" fill="#3e2723"/>
    <path d="M60 120 Q60 76 78 70 L96 70 Q108 80 98 122Z" fill="#7e57c2"/>
    <path d="M62 82 Q42 96 48 118" stroke="#ffe0b2" stroke-width="9" fill="none" stroke-linecap="round"/>
    <circle cx="80" cy="50" r="21" fill="#ffe0b2"/>
    <path d="M58 54 Q54 22 82 26 Q106 28 100 56 Q98 38 82 38 Q66 38 62 62Z" fill="#4e342e"/>
    <path d="M60 54 Q50 80 58 96" stroke="#4e342e" stroke-width="8" fill="none" stroke-linecap="round"/>
    <circle cx="74" cy="52" r="3" fill="#3e2723"/><circle cx="88" cy="52" r="3" fill="#3e2723"/>
    <path d="M75 61 Q81 66 87 61" stroke="#8d4a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M38 108 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="#ffeb3b"/>
  </svg>`,
};
