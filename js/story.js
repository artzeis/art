// Imagine Seek — the Dreamyville Storybook.
//
// One big story told in short chapters. The prologue is always open; each character's chapter
// unlocks when their treasure is found (so chapters can be read in any order — each one stands on its
// own but adds a clue to the shared mystery). When all seven are home, the "Moon Door" chapter unlocks
// and ends on "To be continued…", leaving room for future chapters and new characters.
//
// To add more story later: add a chapter to STORY.next (it shows as "Coming soon" until `text` is filled).
const STORY = {
  title: "The Great Gust",
  prologue: {
    title: "The Night of the Great Gust",
    text: [
      "On the other side of every pillow is a secret town called Dreamyville. That's where the Dreamlings live: Scribbi, Craggle, Orbit, Tangle, Nyxie, Glitch and Leo.",
      "Every night, while you sleep, they keep Dreamyville bright. Scribbi doodles the flowers, Nyxie hangs the stars, and Leo howls the moon awake.",
      "But one night, something strange happened. A shooting star zipped across the sky… and then a huge, swirly wind roared through Dreamyville. The Great Gust! It spun the friends around, whooshed through the pillow-doors, and blew their seven treasures right into YOUR world.",
      "Without their treasures, the Dreamlings are losing their magic. They need a real-life helper — a Seeker — to find them. And that's you!",
    ],
  },
  chapters: {
    scribbi: {
      title: "Scribbi and the Grey Doodles",
      text: [
        "When the Great Gust blew Scribbi's Rainbow Crayon away, something sad happened: all of Scribbi's doodles started turning grey. The swirls stopped swirling. The stars stopped twinkling. Even the rainbow on Scribbi's tummy went pale.",
        "\"Hee… hee?\" said Scribbi, which is how a doodle sprite sounds when it's trying very hard to stay cheerful.",
        "Now that you've found the crayon, the colours are rushing back! With the very first stroke, Scribbi drew a picture of the Great Gust — the swirly wind, the shooting star… and something nobody had noticed before.",
      ],
      clue: "In Scribbi's drawing, someone tiny is RIDING the Great Gust! Who could it be?",
      meanwhile: "Scribbi raced off to show Craggle. Craggle always knows the old stories.",
    },
    craggle: {
      title: "Craggle Remembers",
      text: [
        "Craggle had been napping on the same sunny hill for a hundred years when the Great Gust tumbled him head over moss. \"Hmph,\" said Craggle. \"Rude.\"",
        "His Glow Crystal rolled away, and without it, Craggle's cracks went dark — and so did his memories. Rocks remember everything, you see, but only when they glow.",
        "Now the crystal is back, Craggle's cracks are shining teal again… and a very, very old memory is waking up. \"Hmmm… I remember a legend,\" he rumbled slowly. \"Something about seven treasures… and a door.\"",
      ],
      clue: "The old legend says: \"When seven treasures shine together, the Moon Door will open.\"",
      meanwhile: "Craggle told Tangle about the legend. Tangle's curly ears started spinning very fast.",
    },
    orbit: {
      title: "Orbit and the Question-Mark Star",
      text: [
        "Orbit was counting shooting stars on the night of the Great Gust. \"Ninety-eight… ninety-nine…\"",
        "Then the hundredth star whizzed past — and it wasn't like the others. Its tail curled into a giant question mark. \"Ooooh!\" said Orbit. \"What's THAT?\" Right then — WHOOSH! — the Gust spun Orbit so fast that the Moon Marble flew out of the orange ring.",
        "With the Moon Marble home, Orbit can steer again. And Orbit is sure of one thing: that question-mark star and the Great Gust are connected.",
      ],
      clue: "The question-mark star zoomed straight toward the middle of Tangle's maze.",
      meanwhile: "Orbit asked Nyxie if any stars had been acting strange. Nyxie went very, very quiet.",
    },
    tangle: {
      title: "Tangle and the Door That Wasn't There",
      text: [
        "Tangle knows every twist of the great Dreamyville Maze — every corner, every dead end, every secret shortcut. So when the Great Gust blew the Golden Key away, Tangle went to check the maze… and stopped.",
        "In the very middle stood a door that had NEVER been there before. A round, silver door with seven little shapes on it: a crayon, a crystal, a marble, a key, a star, a pixel and a moon.",
        "\"Heh… heh?\" said Tangle, for once not sure what was funny. Now the Golden Key is back, Tangle tried it in the lock. It fit… but the door didn't open. Not yet.",
      ],
      clue: "The door has seven shapes — one for every treasure!",
      meanwhile: "Tangle drew the shapes and sent the drawing to Glitch, whose screen had started beeping strangely.",
    },
    nyxie: {
      title: "Nyxie and the Missing Star",
      text: [
        "Every night, Nyxie hangs the stars in the Dreamyville sky, one by one, with soft purple paws. Three thousand, two hundred and twelve stars — and Nyxie knows every one by name.",
        "The Wishing Star was the favourite: the one that turns bad dreams into sweet ones. When the Great Gust blew it away, Nyxie looked up and counted… and counted again. Three thousand, two hundred and ELEVEN.",
        "Now the Wishing Star is home and sweet dreams are back. But Nyxie still counts three thousand, two hundred and eleven. A different star is missing — Pip-Pip, the smallest star of all.",
      ],
      clue: "Pip-Pip, the smallest star, vanished on the very same night as the Great Gust.",
      meanwhile: "Nyxie whispered the news to Orbit, who gasped: \"The question-mark star!\"",
    },
    glitch: {
      title: "Glitch Gets a Signal",
      text: [
        "Glitch was on level 999 of the hardest game in Dreamyville when the Great Gust blew the Power Pixel right out of the screen. GAME… PAUSED.",
        "Without the Power Pixel, Glitch couldn't level up, couldn't teleport, and couldn't even do the victory dance. Bleep.",
        "With the Power Pixel back, Glitch powered up — and the screen began to flicker with a mystery signal: beep… beep… boop… and then a teeny-tiny whisper: \"…find… the… door…\"",
      ],
      clue: "Someone small sent the signal — someone who wants to be found.",
      meanwhile: "Glitch played the signal for Leo. Leo's ears shot straight up.",
    },
    leo: {
      title: "Leo Follows the Trail",
      text: [
        "Leo was howling the moon awake when the Great Gust hit. It knocked the Moon Medallion right off Leo's cape, and the cape stopped glowing.",
        "Leo didn't panic. Leo sniffed. Wolves can follow any trail — even one made of wind. And the Great Gust's trail smelled very strange: like peppermint… and thunder… and a tiny bit like birthday cake.",
        "Now the Moon Medallion is back and the cape is shining again. Leo knows the trail leads somewhere — and that this is a job for the whole pack. \"Awoooo!\" Leo called. \"Everyone! Pack meeting!\"",
      ],
      clue: "The Gust's trail smells of peppermint, thunder and birthday cake. Who smells like that?",
      meanwhile: "One by one, the Dreamlings came running — and every single one of them had a clue to share.",
    },
  },
  finale: {
    title: "The Moon Door",
    text: [
      "All seven treasures are home. The Dreamlings gathered in the middle of Tangle's maze, in front of the round silver door.",
      "Scribbi held up the Rainbow Crayon. Craggle's crystal glowed. Orbit's marble spun. Tangle turned the Golden Key. Nyxie's star twinkled. Glitch's pixel buzzed. And Leo's medallion shone like the moon.",
      "One by one, the seven shapes on the door lit up… and the door began to open, just a crack. A smell of peppermint and thunder drifted out. And from somewhere on the other side, a teeny-tiny voice said: \"Hello? Is anybody there?\"",
    ],
    ending: "To be continued…",
    wonder: "What do you think is behind the Moon Door? Who does the tiny voice belong to? Draw it, or tell your grown-up your idea!",
  },
  // Future chapters go here. Each shows as "Coming soon" until it has text.
  next: [
    { title: "Behind the Moon Door", teaser: "Who rode the Great Gust — and why?" },
  ],
};
