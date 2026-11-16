# Myth Seekers — Game Design Document

## Concept
A real-world creature hunt for kids (about ages 4–10) built like Pokémon GO, but instead of catching
monsters, kids **help magical creatures** find lost treasures. A grown-up hides the physical
accessories that come in the box. The app then gives riddles, clues and movement challenges that lead
kids to each one. An optional **AR mode** lets kids find the creatures hiding around them through the
phone camera.

**Pillars:** get kids moving, get them thinking (riddles), and reward kindness (you *befriend*
creatures; you never capture them).

## What's in the box
| Creature | Kind | Accessory (physical item) |
|---|---|---|
| Pip Petalwing | Fairy | 🌸 Flower Crown |
| Bramble Mossbeard | Gnome | 🎩 Pointy Red Hat |
| Lirien Leafwhisper | Elf | 🍃 Silver Leaf Bow |
| Ember Sunfeather | Sunfeather Bird | 🪶 Golden Feather |
| Thistle Swiftmane | Centaur | 🍀 Lucky Horseshoe |

Each creature has a profile in the Creature Journal, split into three easy tabs:
- **📖 Story:** size, age and home, the creature's story, then picture tiles for personality, favourite
  food, best friend, what it sounds like, favourite season, its treasure, likes and dislikes.
- **⭐ Powers:** its magic power, five power bars (Speed, Magic, Kindness, Sneaky, Strength),
  "How to tell I'm nearby" signs and "How to be my friend" tips.
- **🔒 Secrets:** six fun facts. One is free, and the other five unlock when kids finish that
  creature's quest.

Each creature also has a catchphrase and a 🔊 read-aloud button.

## Look and feel
Bright sky colours, the rounded Baloo 2 font, chunky buttons and big tap targets. Each creature has its
own colour, used on its card, profile and quest. Quest progress is a path of five icons
(👋 → 🏃 → 🧩 → 🎁 → 🎉). Animations are turned off for players whose device asks for reduced motion.

## Core loop
1. **Setup (grown-up).** Behind a simple math gate, the grown-up hides each accessory and picks
   the matching spot from a list of 13 (9 indoor, 4 outdoor). They can also tap "Suggest spots" and
   hide each item where the app says.
2. **Choose a quest.** Kids pick a creature marked "Lost".
3. **Intro.** The creature explains what it lost. The text can be read aloud.
4. **Seeker Challenge.** An activity matched to the creature: gnome squats, silent elf walk, galloping
   like a centaur, flapping like a bird, a fairy statue freeze, and so on. Some have a timer.
5. **Riddle.** The riddle describes the hiding spot. Help comes in three levels: Riddle → 🔎 Clue →
   💡 Big Hint.
6. **Show me!** Kids pick the treasure they found from four choices. This is a light check that they
   really found it.
7. **Celebrate.** Confetti, ⭐ stars (3 with no help, 2 after a clue, 1 after the big hint), and the
   fun facts unlock in the Creature Journal.
8. **Replay.** The grown-up taps "New hunt" and hides everything again in new spots.

## AR mode (optional)
- The camera view shows a creature hidden in a random direction, 90–270° away from where the player
  starts facing.
- Kids turn in a circle. A ❄️→🔥 meter and arrows on the edges of the screen guide them.
- When they find the creature, it bounces and the phone vibrates. Kids can tap it for fun facts or
  choose **Wave**, **Spin** or **Fun fact**.
- The first time kids spot each creature in AR, they earn +1 ⭐.
- **Fallbacks:** without motion sensors, kids swipe to look around. Without a camera, an illustrated
  magic forest is shown instead.

## Rewards and progress
- ⭐ Sparkle Stars from quests and AR sightings.
- The Creature Journal fills in with "Friend ✔" badges. Helping all five unlocks the **Master Myth
  Seeker** banner.
- Progress is saved on the device.

## Safety and accessibility
- Grown-up gate in front of setup and reset.
- Hiding spots stay at kid height, and the instructions remind grown-ups to supervise AR mode.
- Every story line has a 🔊 read-aloud button (browser speech) for pre-readers.
- Big tap targets and high-contrast cards.

## Ideas for later
- Printed QR or NFC tags on accessories so kids scan instead of choosing from the "Show me!" list.
- Multi-step clue chains (riddle A leads to a note that leads to riddle B).
- Seasonal creatures (Snow Sprite, Pumpkin Gnome) and party mode for several teams.
- Custom riddles written by the grown-up for their own spots.
- Real anchored AR (WebXR plane detection) so creatures sit on actual tables and floors.
