# Hello World Tour — Game Design

## Concept
A travel game for all ages about learning the world. Players take short "trips" (5–8 stops). At each
stop they answer one quick question about a real country. Every answer, right or wrong, opens a
**postcard**: the flag, capital, how to say hello (with audio), an animal, something the country is
famous for, a fun fact, and a map showing where it is. Right answers earn a **passport stamp**.

**Pillars:** every question teaches something, being wrong costs nothing, and a session can be as
short as two minutes.

## Levels (one game for everyone)
| Level | Stops | Choices | Extras | Who it's for |
|---|---|---|---|---|
| Little Explorer | 5 | 2 | Hint button; wrong answers come from other continents | Young kids, first-timers |
| Traveler | 6 | 3 | Capital-city questions | Older kids, families |
| Globetrotter | 8 | 4 | "Find the flag" questions, 20-second timer | Teens and adults |

## Question types
1. **Flag:** which country has this flag?
2. **Continent:** which continent is X in? Players can tap the continent on the map or pick a button.
3. **Greeting:** someone says "Konnichiwa!" Where are you? Players can hear the word. Greetings that
   several countries share, such as "Hola", are never used for this type.
4. **Fact:** for example, "Where do Komodo dragons live in the wild?"
5. **Capital:** Lima is the capital of which country? (Traveler and up.)
6. **Find the flag:** pick the flag of Japan from four flags. (Globetrotter only.)

## Core loop
Pick a level → **boarding pass** (the destination's airport code shows as `???`) → answer → the
verdict appears, the airport code is revealed, and the postcard opens with a flight arc on its mini map
→ a stamp "thunks" onto the postcard on a first correct answer → fly on → at the end of the trip, the
whole route draws itself across the world map and the stamps from the trip are shown.

**Learning loop:** countries you missed and countries you haven't stamped yet are picked more often
on later trips, which gives light spaced repetition.

## Other screens
- **Map:** explore freely. Tap a continent to filter the map and read a fact about it, or tap a dot or
  card to open that country's postcard.
- **Passport:** the traveler's name, stats (stamps, trips, right answers, best streak) and one stamp
  page per continent. A reset option asks for confirmation on the page itself.

## Accessibility
- "Read aloud" reads each question and its choices. Greetings are spoken in the country's language
  when the device has a voice for it.
- Big tap targets, full keyboard support, and visible focus.
- Right and wrong are shown with icons and text as well as colour.
- Light and dark themes. Animations turn off when the device asks for reduced motion.
- No accounts and no ads. Progress is saved only on the device.

## Content
27 countries across 6 continents, plus Antarctica on the map. The content lives in `data.js`. To add
a country, add an entry with a flag recipe, a greeting, an animal, a thing it's famous for, a fact, a
question for the fact, its capital's coordinates, and an airport code. Flags are drawn as SVG so they
look the same everywhere (some are simplified). The map is a hand-drawn, simplified outline.

## Ideas for later
- More countries, including flags with detailed emblems (Canada, Mexico, Brazil, Kenya).
- A "pass and play" family mode, with turns shown on the boarding pass.
- A daily trip that's the same for everyone, so people can compare scores.
- Sound recordings from native speakers instead of the device's built-in voices.
