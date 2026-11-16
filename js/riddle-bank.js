// Imagine Seek — extra riddles, so the same hiding place gets a different riddle on different hunts.
// Keyed by the FIRST key of each object in RIDDLE_OBJECTS (js/riddles.js). Add more any time —
// every riddle here is automatically mixed in with the ones in riddles.js.
const RIDDLE_BANK = {
  couch: [
    "I'm long and soft with cushions on top. Grown-ups sit on me and say \"I'll just rest my eyes\"! What am I?",
    "Snacks fall into me, coins hide in me, and everyone loves to flop on me. What am I?",
    "I'm the comfiest seat for the whole family, and my cushions make great forts! What am I?",
  ],
  cushion: [
    "I'm squishy and square, and I love being hugged or sat on. You can build a fort with lots of me! What am I?",
    "Fluff me up and lean on me. I make every seat comfier! What am I?",
    "I'm soft, I'm plump, and I sometimes end up on the floor in a pillow fight. What am I?",
  ],
  pillow: [
    "Every night I hold your sleepy head. In the morning I'm all squished! What am I?",
    "I'm soft and fluffy and I love pillow fights! What am I?",
    "I wear a case but I never go travelling. You rest your head on me. What am I?",
  ],
  bed: [
    "You jump into me at night and crawl out of me in the morning. What am I?",
    "I have sheets but I'm not a book, and a blanket but I'm not a picnic. What am I?",
    "Dreams happen here every single night. What am I?",
  ],
  blanket: [
    "Wrap me around you on a chilly night and you'll be snug as a bug. What am I?",
    "I'm great for capes, forts and cuddles. What am I?",
    "I'm soft and big, and I keep your toes warm. What am I?",
  ],
  bookshelf: [
    "I'm tall with lots of flat levels, and stories stand in rows on me. What am I?",
    "I'm a home for books, standing up straight in a line. What am I?",
    "Pick a story from me and I'll have a gap until you put it back. What am I?",
  ],
  book: [
    "Open me and I tell you a story. Close me and I keep it secret. What am I?",
    "I'm full of words and pictures, and I have a cover but I'm not a blanket. What am I?",
    "You turn my pages one by one. What am I?",
  ],
  table: [
    "Plates, cups and spoons all sit on me at dinner time. What am I?",
    "I'm flat on top and I stand on legs. Families gather around me. What am I?",
    "Crumbs land on me and drinks get spilled on me, but I'm always ready for the next meal. What am I?",
  ],
  desk: [
    "I'm a table for working, drawing and writing. What am I?",
    "Crayons, pencils and paper live on top of me. What am I?",
    "I'm where homework and colouring happen. What am I?",
  ],
  chair: [
    "I have a back and a seat, and I'm waiting for someone to sit on me. What am I?",
    "You pull me out to sit at the table. What am I?",
    "I have legs but I can't dance, and a back but I can't stand up straight. What am I?",
  ],
  flowerpot: [
    "I hold soil and a green friend who loves sunshine and water. What am I?",
    "I'm a little house for a plant. What am I?",
    "Water me and I'll grow taller every week! What am I?",
  ],
  shoe: [
    "I have laces or straps, and I go everywhere your feet go. What am I?",
    "I'm always one of a pair, and you put me on before you go out. What am I?",
    "I have a sole but I'm not a fish. What am I?",
  ],
  "front door": [
    "Knock knock! You open me to go out and close me when you come home. What am I?",
    "I have a handle, hinges and sometimes a bell beside me. What am I?",
    "Visitors stand outside me and ring the bell. What am I?",
  ],
  windowsill: [
    "I'm the little ledge where plants and cats like to sit in the sun. What am I?",
    "Raindrops race down me and sunshine pours through me. What am I?",
    "Look through me to see the sky, the trees and the weather! What am I?",
  ],
  curtain: [
    "I hang by the window and swish open in the morning. What am I?",
    "I'm a big soft sheet that keeps the night sky out of your room. What am I?",
    "Pull me left and right to let the sunshine in or keep it out. What am I?",
  ],
  rug: [
    "I'm soft under your feet, and I lie on the floor all day long. What am I?",
    "Wipe your feet on me before you come in! What am I?",
    "I'm flat and fuzzy, and the floor is my bed. What am I?",
  ],
  "toy box": [
    "Every toy in the house comes home to me at tidy-up time. What am I?",
    "Open my lid and out tumble dolls, cars and blocks! What am I?",
    "I'm a box full of fun. What am I?",
  ],
  teddy: [
    "I'm a soft friend with button eyes who loves bedtime cuddles. What am I?",
    "I can't talk, but I'm the best listener in the house. What am I?",
    "I'm fuzzy and huggable, and I sleep in your bed. What am I?",
  ],
  lamp: [
    "Click my switch and I glow. What am I?",
    "I wear a shade but I'm not wearing sunglasses. What am I?",
    "I help you read a book when it's dark. What am I?",
  ],
  tv: [
    "Press a button and I show you cartoons. What am I?",
    "I'm a big screen in the living room. What am I?",
    "The remote control is my best friend. What am I?",
  ],
  fridge: [
    "Milk, cheese and veggies stay cold inside me. What am I?",
    "I hum all day in the kitchen and keep the food fresh. What am I?",
    "Your drawings often get stuck on my door with magnets! What am I?",
  ],
  cupboard: [
    "I keep cups, bowls or snacks tucked away behind my doors. What am I?",
    "Open me and you might find something tasty. What am I?",
    "I'm a box on the wall with doors. What am I?",
  ],
  sink: [
    "Turn my tap and water comes splashing out. What am I?",
    "Dishes and dirty hands both get washed in me. What am I?",
    "Water goes down my drain with a gurgle. What am I?",
  ],
  bathtub: [
    "Fill me with warm water and bubbles for a splashy wash! What am I?",
    "Boats and ducks float in me, but I'm not the sea. What am I?",
    "Pull my plug and the water goes glug-glug-glug. What am I?",
  ],
  towel: [
    "I'm soft and fluffy, and I help you dry off after a bath. What am I?",
    "I hang on a hook in the bathroom. What am I?",
    "Wrap me around you like a cape after your bath! What am I?",
  ],
  "laundry basket": [
    "Muddy socks and grass-stained trousers all get thrown into me. What am I?",
    "I hold the clothes that need a wash. What am I?",
    "Throw your dirty clothes into me — slam dunk! What am I?",
  ],
  "washing machine": [
    "I spin clothes round and round with bubbles until they're clean. What am I?",
    "I have a round window and I like to rumble. What am I?",
    "I eat dirty clothes and give them back clean! What am I?",
  ],
  closet: [
    "Coats and clothes hang inside me on hangers. What am I?",
    "Open my doors to choose what to wear today. What am I?",
    "I'm where outfits wait for their turn. What am I?",
  ],
  drawer: [
    "I slide out to show you what's inside, then slide back in. What am I?",
    "Socks, spoons or secrets might be tucked inside me. What am I?",
    "Pull my handle and I open like a tongue! What am I?",
  ],
  stairs: [
    "Step, step, step — I help you go up and down. What am I?",
    "I'm a mountain of little steps inside a house. What am I?",
    "Count me as you climb! What am I?",
  ],
  coat: [
    "I have buttons or a zip, and I keep you warm outside. What am I?",
    "You hang me on a hook by the door. What am I?",
    "I have pockets and sleeves, and I love rainy days. What am I?",
  ],
  hat: [
    "I keep the sun or the cold off your head. What am I?",
    "You put me on your head before going outside. What am I?",
    "I can be a cap, a beanie or a sun hat. What am I?",
  ],
  backpack: [
    "You carry me on your back to school or on a trip. What am I?",
    "I have zips and pockets full of snacks and books. What am I?",
    "Two straps, one big pocket — and lots of adventures. What am I?",
  ],
  box: [
    "Open my lid or flaps to see what's inside. What am I?",
    "I'm square, I'm hollow, and I hold things. What am I?",
    "Cats love to sit in me! What am I?",
  ],
  piano: [
    "I have black and white teeth, and I sing when you press them. What am I?",
    "Tap my keys and I make music. What am I?",
    "I'm big and musical, and I have a bench to sit on. What am I?",
  ],
  clock: [
    "I go tick-tock all day long. What am I?",
    "I tell you when it's time for bed. What am I?",
    "My hands go round and round, but I never wave. What am I?",
  ],
  mirror: [
    "Wave at me and I wave back! What am I?",
    "I show you your face when you brush your hair. What am I?",
    "I'm shiny and flat, and I copy everything you do. What am I?",
  ],
  radiator: [
    "I get warm in winter and make the room toasty. What am I?",
    "I sit by the wall and keep everyone cosy. What am I?",
    "Socks and gloves sometimes dry on top of me. What am I?",
  ],
  highchair: [
    "I'm a tall chair with a little tray for the baby. What am I?",
    "Babies eat their mashed peas sitting in me. What am I?",
    "I'm made just for the littlest one. What am I?",
  ],
  tree: [
    "I have branches like arms and leaves like hair. What am I?",
    "Birds build nests in me and squirrels climb me. What am I?",
    "I'm tall and leafy, and I've been growing for years and years. What am I?",
  ],
  bush: [
    "I'm a leafy ball growing out of the ground. What am I?",
    "Birds and bugs hide in my branches. What am I?",
    "I'm smaller than a tree but bigger than a flower. What am I?",
  ],
  rock: [
    "I'm hard and heavy, and I've been sitting here for ages. What am I?",
    "Bugs and worms love to hide underneath me. What am I?",
    "I'm a big stone in the garden. What am I?",
  ],
  "flower bed": [
    "Bees buzz around me and butterflies visit me. What am I?",
    "I'm a patch of soil full of colourful blooms. What am I?",
    "Smell me and you'll smile — I'm full of flowers! What am I?",
  ],
  fence: [
    "I'm a long line of posts and boards around the garden. What am I?",
    "Cats walk along my top like a tightrope. What am I?",
    "I keep things in and keep things out. What am I?",
  ],
  bench: [
    "I'm a long outdoor seat for two or three friends. What am I?",
    "Grown-ups sit on me to watch you play. What am I?",
    "I live outside and wait for someone to sit down. What am I?",
  ],
  swing: [
    "Pump your legs and I'll take you higher and higher! What am I?",
    "I go forward and back, forward and back. What am I?",
    "I hang from chains or ropes in the playground. What am I?",
  ],
  slide: [
    "Climb the steps and whoosh down my slippery side! What am I?",
    "I'm a playground ride that always goes down. What am I?",
    "Wheeeee! What am I?",
  ],
  trampoline: [
    "Boing, boing, boing — I help you jump super high! What am I?",
    "I'm stretchy and springy and great for bouncing. What am I?",
    "Jump on me and you'll feel like you can fly! What am I?",
  ],
  sandbox: [
    "Bring a bucket and spade — I'm full of sand for digging! What am I?",
    "Sandcastles are built in me. What am I?",
    "I'm a little beach in the garden. What am I?",
  ],
  "watering can": [
    "I have a long nose that sprinkles water on the flowers. What am I?",
    "Plants get thirsty, so they call me! What am I?",
    "Fill me up, tip me over, and the garden gets a drink. What am I?",
  ],
  "garden hose": [
    "I'm long and green and I spray water everywhere! What am I?",
    "I lie coiled up in the garden until it's time to water. What am I?",
    "Squeeze my nozzle on a hot day for a splash! What am I?",
  ],
  bucket: [
    "I'm great for carrying sand at the beach or water in the garden. What am I?",
    "I have a handle and a round bottom. What am I?",
    "Fill me, carry me, tip me out! What am I?",
  ],
  bike: [
    "I have two wheels and pedals, and I take you riding. What am I?",
    "Ring my bell — ding ding! What am I?",
    "Put on your helmet before you ride me! What am I?",
  ],
  ball: [
    "Kick me, throw me, bounce me — I'm always ready to play! What am I?",
    "I'm round and I roll. What am I?",
    "Dogs love to chase me! What am I?",
  ],
  planter: [
    "I'm a big pot full of soil and flowers outside. What am I?",
    "Plants grow in me by the door or on the patio. What am I?",
    "I hold dirt, roots and a little bit of garden. What am I?",
  ],
  log: [
    "I'm a piece of a tree that's lying down for a rest. What am I?",
    "Beetles and bugs live under my bark. What am I?",
    "I'm round and woody and great for balancing on. What am I?",
  ],
  shed: [
    "I'm a little wooden house where tools and bikes sleep. What am I?",
    "Spades, rakes and flowerpots are kept in me. What am I?",
    "I stand in the garden with a door but no beds. What am I?",
  ],
  porch: [
    "I'm the spot just outside the front door. What am I?",
    "Parcels and visitors wait on me. What am I?",
    "You wipe your feet here before going in. What am I?",
  ],
  mailbox: [
    "The postman brings letters and drops them into me. What am I?",
    "I'm full of envelopes and cards. What am I?",
    "Birthday cards arrive in me! What am I?",
  ],
  grass: [
    "I'm green and soft, and I tickle your bare feet. What am I?",
    "Lawnmowers give me a haircut. What am I?",
    "I cover the garden like a green carpet. What am I?",
  ],
};

// Different ways a riddle can finish. {T} = what's hiding (capitalised), {t} = lower case, {w} = where ("under it").
const RIDDLE_ENDINGS = [
  "{T} is hiding {w}!",
  "Guess what it is, then look {w} — that's where {t} is!",
  "Solved it? Peek {w} to find {t}!",
  "When you guess it, {t} will be waiting {w}!",
];
