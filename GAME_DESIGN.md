# Imagamigos — Game Design Document

*Imagamigos = imagination + amigos (friends). Kids are called "amigo" by the characters.*

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
| Leo | Moonwolf (a friendly wolf, inspired by a real dog named Leo) | 🌙 Moon Medallion |

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

### Leo the Moonwolf — a different kind of quest
Leo has **his own challenge wheel** of wolf skills instead of Physical / Mental / Teamwork / Kindness.
It uses the same 4-level dial:
- **🐾 Tracking:** follow the trail, from step-in-my-footprints up to building a 5-clue treasure trail.
- **🌙 Howl:** sound and song, from three big howls up to a 3-part "moon choir".
- **🐺 Pack:** leading and following as a team, from a pack hug up to a silent birthday-order line-up.
- **👂 Senses:** listening, sniffing and feeling, from counting sounds up to a blindfolded memory sniff.

Leo also has a secret **Moon Form**: a majestic, realistic Moonwolf picture, shown as a dark silhouette
until Leo's quest is finished, then revealed on Leo's page. In the AR Hunt, Leo appears in Moon Form.

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
4. **Challenge.** Kids **spin the challenge wheel** for a type and turn the **difficulty dial**:
   - The wheel has four colours: **🏃 Physical** (move your body), **🧠 Mental** (use your brain),
     **🤝 Teamwork** (play together) and **💖 Kindness** (an act of kindness, such as a compliment, helping
     tidy up, a thank-you card or a secret surprise for the family). **SPIN** lands on one at random;
     tapping a colour chooses that type on purpose. The character reads out the result.
   - **Dial with 4 levels:** 🌱 Easy, 🌿 Medium, 🌳 Hard (+1 bonus ⭐) and 🔥 Super (+2 bonus ⭐). Tap a
     segment or a label; the needle swings to the new level.
   - Each type and level has its own set of challenges (`js/challenges.js`), from "jump 5 times" up to
     "hold a plank for 30 seconds", "what is 12 × 3?", "line up from shortest to tallest without
     talking" or "plan a secret surprise for someone in your family". Mental challenges have a 👀 Show answer button, some challenges have a timer, and
     🔀 Another one swaps the challenge.
   - Physical Easy also includes the character's own themed moves. When the treasure is outside, some
     physical challenges use the yard ("run 3 laps around the yard").
   - The chosen type and level are remembered for the next quest.
5. **Riddle.** The generated riddle describes the hiding spot (or one riddle per stop on a treasure trail). Help comes in three levels: Riddle → 🔎 Clue →
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

## Playing together: trails, making and calming down
**📜 Treasure trails.** In setup, ➕ adds clue stops before the treasure (up to 5 stops in all). The
grown-up leaves a clue card at each stop: a printed card (🖨️ Print clue cards) or any sticky note.
Each stop gets its own riddle ("My next clue is hiding under it!"). After each clue card, the
character says how to move to the next stop in their style: wiggle like a squiggle (Scribbi), roll like
a slow, heavy rock (Craggle), spin like a little planet (Orbit), zig-zag like you're in a maze (Tangle),
tiptoe like a cat (Nyxie), move like a robot (Glitch) or lope like a wolf (Leo). Each extra stop earns
+1 ⭐.

**🎨 Make something together.** After the treasure is found, the character asks the family to build,
draw or invent something: Leo's pillow den, Orbit's rocket ship, Tangle's marble maze, Nyxie's night sky
with a made-up constellation, and so on. There are three ideas per character, and 🔀 swaps the idea.
📷 takes a photo, which is saved to the **Memory Book** in the Creature Journal. Photos are stored only
on the device. "We made it!" earns +1 ⭐. Any character's page also has 🎨 Make something, any time.

**🌙 Calm down with Nyxie.** A 2½-minute guided wind-down, offered after every quest and on the home
screen. Nyxie speaks each step softly: get cosy, moon breathing (the moon grows for 4 seconds while
breathing in and shrinks for 6 seconds while breathing out), cat stretch, curl up like a crescent moon,
star squeeze, whisper one happy thing to your grown-up, then goodnight.

**🧸 Give it back.** After "Show me!", the character asks for the treasure back, and each treasure has a
spot on its plush: a hook-and-loop dot, or a pocket for Scribbi's crayon. "It's back on my plush!", or
"No plush yet — keep going" for families without the plush. Attachment details are in
`manufacturing/treasures/README.md`.

## 📚 The Dreamwood Storybook
One big story told in short chapters (`js/story.js`), in a **Stories** tab.
- **The world:** the Imagamigos live in **Dreamwood**, a secret land on the other side of every pillow
  (a nod to the pillow plush toys). One night **the Great Gust** blew their seven treasures through the
  pillow-doors into our world.
- **Chapters unlock as you play:** the prologue is always open, and each character's chapter unlocks
  when their treasure is found. Chapters can be read in any order. Each stands on its own, but adds a
  **mystery clue** and a **"Meanwhile…"** line that hands the story to another friend:
  - **Scribbi:** a tiny rider on the Gust.
  - **Craggle:** the legend of the Moon Door.
  - **Orbit:** a question-mark-shaped shooting star.
  - **Tangle:** a new door in the maze with seven shapes.
  - **Nyxie:** Pip-Pip, the smallest star, is missing.
  - **Glitch:** a tiny voice whispering "find the door".
  - **Leo:** the Gust smells of peppermint, thunder and birthday cake.
- **The finale ("The Moon Door")** unlocks when all seven are home. The door opens a crack, a tiny voice
  says hello, and the chapter ends **"To be continued…"**. It asks kids what they think is behind the
  door, leaving room for future chapters and new characters (`STORY.next` lists "Coming soon" chapters).
- **Read aloud:** a warm narrator voice reads each chapter paragraph by paragraph.
- **Personal Story Challenges:** the last challenge of every quest is that character's own **Story
  Challenge**, tied to their chapter:
  - **Scribbi:** paint Dreamwood back to life.
  - **Craggle:** make up the slow, rumbly song.
  - **Orbit:** chart the mystery star.
  - **Tangle:** build the secret door and crawl through.
  - **Nyxie:** make a dream shield.
  - **Glitch:** invent the signal dance.
  - **Leo:** make a pack flag and howl together.

  Photos go to the Memory Book. Story Challenges can also be done any time from the storybook.

## Character voices
Every line a character says can be heard in that character's own voice (`js/voices.js`). The game uses
the device's built-in text-to-speech, so it's free and works offline. It is tuned to sound **natural
rather than robotic**:
- **Best voices first:** high-quality voices ("Enhanced", "Premium", "Natural", "Neural") are picked
  first, and old robotic or novelty voices (Zarvox, Fred, Jester, Grandpa…) are never used.
- **Gentle settings:** pitch and speed stay close to normal, because big pitch changes are what make
  speech sound robotic. Each line is spoken in one smooth piece.
- **Personality** comes from the choice of voice, a gentle pitch and speed change, and one short sound.

| Character | Personality | Voice |
|---|---|---|
| Scribbi | Silly, creative, wiggly | Bright young voice, a little quick, ends with "Hee-hee!" |
| Craggle | Chill, steady, wise | Deep, calm and slow, starts with a thoughtful "Hmmm…" |
| Orbit | Curious, dreamy, amazed | Warm and bright, starts with an amazed "Ooooh!" |
| Tangle | Clever, playful, cheeky | Quick and sly, ends with a chuckle, "Heh-heh!" |
| Nyxie | Mysterious, gentle, loyal | Soft and unhurried, starts with a purr, "Mrrrow…" |
| Glitch | Cheeky, speedy, fair | Clear and upbeat, ends with a quick "Bleep-bloop!" |
| Leo | Loyal, gentle, brave | Warm, friendly and steady, starts with a happy "Awoooo!" |

**Voice check (Grown-up Corner):** a ▶ button to hear each character and a **voice menu** to choose
which voice each one uses. The menu lists every voice on the device, so voices downloaded in the
device's settings can be picked (⭐ = high quality), and the choice is remembered. On **Auto**, the game
scores every voice for each character: high-quality voices first, then voices that suit the
character (lighter for Scribbi, Orbit and Nyxie, deeper for Craggle, Tangle, Glitch and Leo).
Voice check also has steps to download free high-quality voices (iPhone/iPad: Settings → Accessibility →
Spoken Content → Voices; Android: Text-to-speech settings; Windows: use Microsoft Edge).

For voices that sound like real actors, the next step would be recorded or AI-generated audio from a
voice service. Fixed lines could be pre-recorded, but the riddles are written on the fly, so they would
need the service to speak them live, through a small server that keeps the service's key safe.

## Rewards and progress
- ⭐ Sparkle Stars from quests and AR sightings.
- The Creature Journal fills in with "Friend ✔" badges. Helping all seven unlocks the **Amigo
  Champion** banner.
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
