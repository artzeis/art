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
| Character | Kind | Treasure to find |
|---|---|---|
| Scribbi | Doodle Sprite | 🖍️ Rainbow Crayon |
| Craggle | Moss Rock | 💎 Glow Crystal |
| Orbit | Little Planet | 🌕 Moon Marble |
| Tangle | Maze Keeper | 🗝️ Golden Key |
| Nyxie | Moon Cat | ⭐ Wishing Star |
| Glitch | Pixel Pal | 🟩 Power Pixel |

Each character has two versions: the **app character** used in the game, and a matching **pillow plush**
sold separately. Every character page has a "Take ___ home!" card with the plush photo and a **Get the
plush** button, also offered after a quest is finished. Store links are set in `STORE_LINKS` at the top
of `js/data.js`; while a link is empty, the button reads "Coming soon". Opening the store always goes
through the grown-up gate first.

Each creature has a profile in the Creature Journal, split into three easy tabs:
- **📖 Story:** size, age and home, the creature's story, then picture tiles for personality, favourite
  food, best friend, what it sounds like, favourite season, its treasure, likes and dislikes.
- **⭐ Powers:** its magic power, five power bars (Speed, Magic, Kindness, Sneaky, Strength),
  "How to tell I'm nearby" signs and "How to be my friend" tips.
- **🔒 Secrets:** six fun facts. One is free, and the other five unlock when kids finish that
  creature's quest.

Each creature also has a catchphrase and a 🔊 read-aloud button.

## Look and feel
An "enchanted night" theme: a deep indigo sky with a slowly moving aurora and twinkling stars, frosted-glass
cards, warm gradient buttons, and the rounded Fredoka and Nunito fonts. Each creature has its own glow colour,
used on its portrait card, profile and quest. Characters are drawn in a shaded storybook style. Quest progress is a path of five icons (👋 → 🏃 → 🧩 → 🎁 → 🎉).
Animations are turned off for players whose device asks for reduced motion.

## Core loop
1. **Setup (grown-up).** Behind a simple math gate, the grown-up chooses where to play (**Inside**,
   **Outside** or **Both**), hides each character's lost item, and **types where it is**, for example
   *"under the blue cushion on the sofa"*. "Suggest hiding places" fills in ideas for the chosen area.
   Outdoor play shows a safety reminder.
   - **Riddle maker** (`js/riddles.js`): turns the description into a riddle, a clue and a big hint,
     right on the device. It recognises about 60 hiding objects (sofa, bookshelf, fridge, tree,
     slide…), the position word (under, behind, inside, on top of…), the room (kitchen, backyard…) and
     colours. Example: *"I have a back but no spine… My Rainbow Crayon is hiding under it!"*, then
     the clue *"Go to the living room… Look for something blue"*, then the big hint *"Look under the blue cushion
     on the sofa!"* An unrecognised object gets a letter riddle ("starts with D, ends with R, 8
     letters"). The grown-up sees a live preview, can tap 🔄 for a different riddle, and is warned
     about unsafe spots (oven, fireplace, road, pool).
   - Whether the spot is inside or outside, worked out from the description, decides between indoor
     and outdoor challenges.
2. **Choose a quest.** Kids pick a creature marked "Lost".
3. **Intro.** The creature explains what it lost. The text can be read aloud.
4. **Seeker Challenge.** An activity matched to the character: wiggling like a squiggle, freezing like a rock, spinning like a planet,
   zig-zag walks, cat stretches, robot moves and so on. Some have a timer.
   Treasures hidden outside get outdoor challenges instead, such as galloping across the yard, spotting
   real birds, finding cloud shapes or lining up pebbles.
5. **Riddle.** The generated riddle describes the hiding spot. Help comes in three levels: Riddle → 🔎 Clue →
   💡 Big Hint.
6. **Show me!** Kids pick the treasure they found from four choices. This is a light check that they
   really found it.
7. **Celebrate.** Confetti, ⭐ stars (3 with no help, 2 after a clue, 1 after the big hint), and the
   fun facts unlock in the Creature Journal.
8. **Replay.** The grown-up taps "New hunt" and hides everything again in new spots.

## AR mode (optional)
1. **Scan.** The camera opens with a scanning grid and a progress ring. The player slowly looks around the
   room (or swipes, without motion sensors). Every frame is analysed on a tiny canvas to find the most
   detailed patch of the picture, such as furniture, plants or shelves, which makes a good place to hide
   behind. The best spot in each 30° slice of the room is remembered, and a blue ping marks each one.
2. **Hide.** After roughly a 120° sweep, the creature picks a strong spot away from where the player is
   facing and hides there ("Close your eyes… 3, 2, 1").
3. **Seek.** A ❄️→🔥 meter and arrows on the screen edges guide the player. When the spot comes into view,
   the creature peeks out from behind it with a sparkle and follows the phone's tilt.
4. **Found.** Tapping the creature, or holding it in the middle of the screen, makes it pop out. The phone
   vibrates, and kids can Wave, Spin or hear a Fun fact.
- The first time kids spot each creature in AR, they earn +1 ⭐.
- **Fallbacks:** without a camera, an illustrated forest is shown instead.

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
