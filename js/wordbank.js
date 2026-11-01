/*
 * Wordweave word bank.
 * Each line: ANSWER|friendly clue (easy)|trickier clue (hard)
 */
(function (root) {
  'use strict';

  const RAW = [
    {
      id: 'animals', name: 'Animals', icon: '🐾', blurb: 'Wild & wonderful creatures',
      keywords: ['animal', 'pet', 'zoo', 'wildlife', 'dog', 'cat', 'bird', 'mammal', 'creature', 'safari', 'farm', 'insect', 'reptile', 'beast', 'wild'],
      words: `
LION|King of the jungle|Pride leader
TIGER|Striped big cat|Bengal or Siberian prowler
ELEPHANT|Large animal with a trunk|Pachyderm with a long memory, supposedly
GIRAFFE|Tallest land animal|Ruminant with ossicones atop its head
ZEBRA|Striped horse relative|Equid in monochrome
PENGUIN|Flightless bird of Antarctica|Tuxedoed swimmer that can't fly
DOLPHIN|Smart sea mammal that clicks|Bottlenose, e.g.
KANGAROO|Hopping Australian animal|Marsupial with a joey in tow
KOALA|Eucalyptus-eating Australian animal|Marsupial often mistakenly called a bear
OWL|Night bird that hoots|Nocturnal raptor with a swiveling head
EAGLE|Large bird of prey|Bald national emblem
FOX|Sly, bushy-tailed animal|Vixen, for one
WOLF|Wild relative of the dog|Pack hunter that howls
BEAR|Large furry animal that hibernates|Grizzly or Kodiak
RABBIT|Long-eared hopping animal|Warren dweller
SQUIRREL|Bushy-tailed nut gatherer|Tree rodent that caches acorns
CAMEL|Desert animal with humps|Dromedary or Bactrian
HORSE|Animal you ride in a saddle|Stallion or mare
MONKEY|Banana-loving primate|Capuchin or macaque
GORILLA|Largest ape|Silverback, for one
PARROT|Colorful talking bird|Macaw relative that mimics speech
SNAKE|Legless reptile|Serpent
TURTLE|Reptile with a shell|Slow-moving testudine
FROG|Green hopper that croaks|Amphibian that starts as a tadpole
SHARK|Ocean predator with fins|Great white, e.g.
WHALE|Largest sea mammal|Cetacean such as a humpback
OTTER|Playful river swimmer|Mustelid that floats on its back
BEAVER|Dam-building animal|Rodent engineer with a flat tail
HEDGEHOG|Small spiny animal|Prickly insectivore that rolls into a ball
CHEETAH|Fastest land animal|Spotted sprinter of the savanna
PANDA|Black-and-white bamboo eater|Giant of China's forests
BAT|Flying mammal|Echolocating night flier
MOOSE|Large antlered animal of the north|Largest member of the deer family
LLAMA|Woolly Andes animal|South American camelid that may spit
RHINO|Horned heavyweight, for short|Thick-skinned grazer, briefly
HIPPO|River horse, for short|Semi-aquatic African giant, briefly
OSTRICH|Huge flightless bird|Ratite that lays the largest eggs
SLOTH|Very slow tree dweller|Upside-down arboreal napper
CROCODILE|Toothy river reptile|Nile predator with a long snout
PEACOCK|Bird with a showy tail|Male fowl famed for its train
ANT|Tiny colony insect|Formicid worker
BEE|Honey maker|Pollinator in a hive
GOAT|Horned farm animal|Kid's parent
DEER|Forest animal with antlers|Buck or doe`
    },
    {
      id: 'space', name: 'Space', icon: '🚀', blurb: 'Planets, stars & beyond',
      keywords: ['space', 'astronomy', 'planet', 'star', 'galaxy', 'universe', 'cosmos', 'nasa', 'rocket', 'moon', 'solar', 'astronaut', 'sky'],
      words: `
PLANET|Earth is one|Mars or Venus, e.g.
STAR|The Sun is one|Twinkler in the night sky
MOON|Earth's natural satellite|Luna
SUN|Center of our solar system|Our nearest star
COMET|Icy visitor with a tail|Halley's, for one
ASTEROID|Rocky space body|Ceres or Vesta, e.g.
GALAXY|Huge collection of stars|Andromeda, e.g.
NEBULA|Cloud of gas and dust in space|Stellar nursery
ORBIT|Path around a planet|Elliptical path
ROCKET|Vehicle that launches into space|Saturn V, e.g.
ASTRONAUT|Space traveler|NASA crew member
MARS|The Red Planet|Fourth rock from the Sun
VENUS|Hottest planet|Morning star
JUPITER|Largest planet|Gas giant with a Great Red Spot
SATURN|Planet with famous rings|Sixth planet
MERCURY|Planet closest to the Sun|Swift planet named for a messenger god
NEPTUNE|Blue planet farthest from the Sun|Ice giant discovered in 1846
URANUS|Planet that spins on its side|Seventh planet
PLUTO|Dwarf planet once called the ninth planet|Kuiper belt body demoted in 2006
TELESCOPE|Tool for viewing distant stars|Hubble or Webb
GRAVITY|Force that keeps us on the ground|What Newton's apple demonstrated
METEOR|Shooting star|Streak across the night sky
ECLIPSE|When the Moon blocks the Sun|Totality event
COSMOS|The universe|Sagan series subject
SATELLITE|Object that orbits a planet|Sputnik, e.g.
SHUTTLE|Reusable spacecraft|Atlantis or Discovery
CRATER|Hole made by an impact|Lunar pockmark
LUNAR|Having to do with the Moon|Like some modules and eclipses
SOLAR|Having to do with the Sun|Kind of flare or panel
ALIEN|Being from another world|Extraterrestrial
QUASAR|Very bright, very distant object|Active galactic nucleus
PULSAR|Spinning star that sends regular signals|Rotating neutron star
COSMONAUT|Russian space traveler|Gagarin, e.g.
LAUNCH|Rocket liftoff|Blastoff
NOVA|Star that suddenly brightens|Stellar flare-up
ROVER|Robot that drives on Mars|Curiosity or Perseverance
ZODIAC|The twelve star signs|Band of constellations
SPACEWALK|Astronaut's trip outside the ship|EVA
STATION|Orbiting outpost like the ISS|Space ___ (ISS)
EARTH|Our home planet|Third rock from the Sun
LIGHTYEAR|Distance light travels in a year|Unit of about 5.88 trillion miles`
    },
    {
      id: 'food', name: 'Food', icon: '🍕', blurb: 'Tasty treats & kitchen staples',
      keywords: ['food', 'cooking', 'cook', 'kitchen', 'recipe', 'fruit', 'vegetable', 'dessert', 'baking', 'bake', 'cuisine', 'meal', 'snack', 'breakfast', 'dinner', 'lunch', 'eat', 'restaurant', 'chef'],
      words: `
PIZZA|Cheesy pie served in slices|Margherita, e.g.
PASTA|Spaghetti or macaroni|Penne or rigatoni
BREAD|Loaf baked from dough|Sourdough, e.g.
CHEESE|Cheddar or Swiss|Brie or Gouda
APPLE|Fruit that keeps the doctor away|Fuji or Gala
BANANA|Long yellow fruit|Plantain relative
ORANGE|Citrus fruit and a color|Navel or Valencia
TOMATO|Red fruit used in ketchup|Heirloom or Roma
CARROT|Orange root vegetable|Bugs Bunny's snack
POTATO|Spud|Russet or Yukon Gold
SUSHI|Japanese rice dish with fish|Nigiri or maki
TACO|Folded tortilla with fillings|Tuesday treat?
BURGER|Patty on a bun|Slider's big sibling
SALAD|Bowl of greens|Caesar or Cobb
SOUP|Hot dish eaten with a spoon|Minestrone or bisque
NOODLE|Long, thin strip of pasta|Ramen strand
RICE|Grain often eaten with chopsticks|Basmati or jasmine
HONEY|Sweet stuff made by bees|Hive product
CHOCOLATE|Sweet made from cocoa|Treat from cacao
COOKIE|Sweet treat for dunking in milk|Snickerdoodle, e.g.
PANCAKE|Breakfast stack with syrup|Flapjack
WAFFLE|Breakfast grid with syrup|Belgian treat
BUTTER|Spread made from cream|Churned dairy
GARLIC|Pungent bulb that wards off vampires|Clove source
ONION|Vegetable that makes you cry|Vidalia, e.g.
LEMON|Sour yellow citrus|Meyer, e.g.
MANGO|Tropical stone fruit|Alphonso, e.g.
AVOCADO|Main ingredient in guacamole|Hass, e.g.
OMELET|Folded egg dish|Denver dish
CURRY|Spiced dish from India|Vindaloo or korma
BAGEL|Ring-shaped bread|Everything ___
MUFFIN|Small cupcake-like breakfast treat|Blueberry ___
PEPPER|Spice paired with salt|Bell or chili
CEREAL|Breakfast in a bowl|Granola, e.g.
YOGURT|Cultured dairy snack|Greek-style product
STEAK|Grilled beef cut|Rib eye or sirloin
DUMPLING|Filled dough pocket|Gyoza or pierogi
CINNAMON|Spice in a sweet roll|Bark-derived spice
VANILLA|Common ice cream flavor|Orchid-derived flavoring
WASABI|Green paste served with sushi|Fiery Japanese condiment`
    },
    {
      id: 'sports', name: 'Sports', icon: '⚽', blurb: 'Games, gear & glory',
      keywords: ['sport', 'sports', 'game', 'athlete', 'olympic', 'olympics', 'team', 'ball', 'fitness', 'exercise', 'football', 'soccer', 'competition'],
      words: `
SOCCER|Game with goalies and a round ball|The beautiful game, in the US
TENNIS|Sport with rackets and a net|Wimbledon sport
GOLF|Game with clubs and 18 holes|Sport of birdies and bogeys
HOCKEY|Sport played on ice with sticks|Game with a puck
BASEBALL|Game with bats and bases|America's pastime
CRICKET|Bat-and-ball game with wickets|Test match sport
RUGBY|Sport with scrums and tries|Game born at an English school
BOXING|Sport fought in a ring|Pugilism
SURFING|Riding ocean waves|Hanging ten
SKIING|Sliding down snowy slopes|Slalom sport
CYCLING|Riding bikes for sport|Tour de France pursuit
SWIMMING|Racing in a pool|Freestyle pursuit
KARATE|Japanese martial art|Dojo discipline
ARCHERY|Shooting arrows at a target|Bow sport
FENCING|Sport with swords|Épée sport
ROWING|Sport with oars|Crew
MARATHON|26.2-mile race|Long-distance footrace
GOAL|Point scored in soccer|Net result?
REFEREE|Official who calls fouls|Whistle blower
STADIUM|Arena where teams play|Venue with bleachers
TROPHY|Prize cup for winners|Silverware
MEDAL|Olympic gold, e.g.|Podium award
OLYMPICS|Global games held every four years|Event with five rings
SPRINT|Short, fast race|Dash
HURDLE|Barrier to jump in a race|Track obstacle
COACH|Team trainer|Bench boss
CAPTAIN|Team leader|Skipper
VOLLEYBALL|Sport with spikes and a high net|Beach game with digs
BASKETBALL|Sport with hoops and dribbling|Game with a shot clock
WRESTLING|Sport with pins and takedowns|Grappling contest
SKATE|Glide on ice|Do a triple axel, say
JUDO|Martial art meaning gentle way|Olympic grappling art
PUCK|Hockey disk|Rubber disk on ice
SERVE|Tennis shot to begin a point|Ace, e.g.
DUNK|Slam in basketball|Jam
HOMERUN|Baseball hit over the fence|Four-bagger
TEAM|Group of players|Squad
RACKET|Tennis swinger|Squash equipment
BADMINTON|Game played with a shuttlecock|Sport with birdies, but not golf`
    },
    {
      id: 'music', name: 'Music', icon: '🎵', blurb: 'Instruments, genres & tunes',
      keywords: ['music', 'song', 'songs', 'band', 'instrument', 'concert', 'sing', 'singer', 'musical', 'orchestra', 'rock', 'jazz', 'pop'],
      words: `
GUITAR|Six-stringed instrument|Strat, e.g.
PIANO|Instrument with 88 keys|Steinway, e.g.
DRUMS|Instruments you hit with sticks|Kit in the back of the band
VIOLIN|Stringed instrument played with a bow|Fiddle
TRUMPET|Brass instrument with three valves|Horn for Louis Armstrong
FLUTE|Woodwind held sideways|Piccolo's big sibling
CELLO|Large instrument played sitting|Yo-Yo Ma's instrument
HARP|Angelic stringed instrument|Instrument with pedals and 47 strings
MELODY|Tune|Air
RHYTHM|Beat of the music|Tempo pattern
CHORUS|Repeated part of a song|Refrain
OPERA|Drama set to music|La Traviata, e.g.
JAZZ|Music with lots of improvisation|Bebop genre
BLUES|Sad music from the Mississippi Delta|Genre with a 12-bar form
CONCERT|Live music show|Gig
ORCHESTRA|Large group of musicians|Symphony ensemble
CONDUCTOR|Person who leads an orchestra|Baton wielder
TEMPO|Speed of music|Allegro or largo
CHORD|Notes played together|Triad, e.g.
NOTE|Single musical sound|Quarter or half, e.g.
LYRICS|Words of a song|Libretto bits
BALLAD|Slow love song|Torch song
SONATA|Classical piece for an instrument|Moonlight ___
SYMPHONY|Long orchestral work|Beethoven's Fifth, e.g.
SAXOPHONE|Curved woodwind with a brass body|Sax
CLARINET|Woodwind with a single reed|Benny Goodman's instrument
BANJO|Twangy instrument in bluegrass|Five-string folk instrument
UKULELE|Small four-stringed Hawaiian instrument|Uke
TUBA|Largest brass instrument|Oom-pah horn
ALBUM|Collection of songs|LP
CHOIR|Group of singers|Church singers
SOPRANO|Highest singing voice|Diva's range, often
DUET|Song for two|Pair performance
HARMONY|Notes that sound good together|Consonance
RAP|Music with rhymes spoken to a beat|Hip-hop style
DISCO|Dance music of the 1970s|Bee Gees genre
MICROPHONE|Device singers sing into|Mic
ENCORE|Extra song after the show|"More!"
AMPLIFIER|Device that makes a guitar louder|Amp
OCTAVE|Span of eight notes|Interval of eight`
    },
    {
      id: 'nature', name: 'Nature', icon: '🌿', blurb: 'Forests, weather & wild places',
      keywords: ['nature', 'outdoors', 'forest', 'plant', 'plants', 'tree', 'trees', 'weather', 'season', 'seasons', 'garden', 'flower', 'flowers', 'landscape', 'environment', 'camping', 'hiking'],
      words: `
FOREST|Large area of trees|Woodland
RIVER|Flowing body of water|Nile, e.g.
MOUNTAIN|Very tall landform|Everest, e.g.
VALLEY|Low land between hills|Dale
DESERT|Dry, sandy region|Sahara, e.g.
JUNGLE|Thick tropical forest|Rain forest
MEADOW|Grassy field|Lea
FLOWER|Rose or tulip|Bloom
TREE|Oak or maple|Sapling, eventually
LEAF|Green part of a tree|Frond
ROOT|Part of a plant underground|Radish, essentially
SEED|What a plant grows from|Acorn, e.g.
RAINBOW|Colorful arc after rain|Roy G. Biv's arc
THUNDER|Boom after lightning|Clap in a storm
LIGHTNING|Flash in a storm|Bolt from the blue
CLOUD|White puff in the sky|Cumulus, e.g.
WATERFALL|Water dropping over a cliff|Niagara, e.g.
VOLCANO|Mountain that erupts|Vesuvius, e.g.
CANYON|Deep gorge|Grand landmark in Arizona
GLACIER|Slow river of ice|Moving ice mass
ISLAND|Land surrounded by water|Isle
LAKE|Inland body of water|Tahoe, e.g.
MOSS|Soft green plant on rocks|What a rolling stone gathers none of
FERN|Leafy plant with fronds|Plant that reproduces by spores
CACTUS|Prickly desert plant|Saguaro, e.g.
PEBBLE|Small stone|Beach stone
BREEZE|Gentle wind|Zephyr
SUNSET|End-of-day sky show|Dusk display
SPRING|Season of blossoms|Season or water source
AUTUMN|Season of falling leaves|Fall
WINTER|Coldest season|Season beginning with a December solstice
SNOW|White winter flakes|Powder
STORM|Wild weather|Tempest
OAK|Tree that grows acorns|Mighty tree from a little nut
PINE|Evergreen with needles|Conifer
BLOSSOM|Flower on a fruit tree|Bloom
SWAMP|Wet, marshy land|Bog
PRAIRIE|Wide grassland|Plain`
    },
    {
      id: 'ocean', name: 'Ocean', icon: '🌊', blurb: 'Sea life & salty adventures',
      keywords: ['ocean', 'sea', 'marine', 'beach', 'fish', 'underwater', 'coast', 'sailing', 'boat', 'boats', 'pirate', 'pirates', 'nautical', 'reef', 'shore'],
      words: `
WAVE|Surfer's ride|Breaker
TIDE|Rise and fall of the sea|Ebb and flow
CORAL|Reef builder|Polyp colony
REEF|Underwater ridge of coral|Great Barrier feature
OCTOPUS|Eight-armed sea creature|Cephalopod with three hearts
SQUID|Sea creature that squirts ink|Calamari source
JELLYFISH|Stinging sea blob|Medusa
STARFISH|Five-armed sea creature|Echinoderm that can regrow arms
CRAB|Sideways-walking shellfish|Hermit, e.g.
LOBSTER|Clawed shellfish|Maine catch
SEAHORSE|Fish whose male carries the babies|Hippocampus
SEAL|Sea mammal that barks|Pinniped
WALRUS|Tusked sea mammal|Arctic pinniped
CLAM|Shellfish in chowder|Quahog
OYSTER|Shellfish that makes pearls|Bivalve with a gem inside
PEARL|Gem from an oyster|June birthstone
SHELL|Beach find|Conch, e.g.
ANCHOR|Heavy hook that holds a ship|It keeps a vessel in place
SAILOR|Person who works at sea|Seaman
SUBMARINE|Underwater boat|U-boat
SHIP|Big boat|Vessel
HARBOR|Safe place for boats|Port
LIGHTHOUSE|Tower with a beacon|Coastal warning tower
BEACH|Sandy shore|Strand
SAND|What a beach is made of|Hourglass filler
SALT|Seawater has lots of it|NaCl
DEPTH|How deep something is|Fathom measure
KELP|Seaweed forest plant|Brown alga
PLANKTON|Tiny drifting sea life|Whale food
TUNA|Big fish often sold in a can|Albacore
SALMON|Pink fish that swims upstream|Coho or sockeye
EEL|Snake-like fish|Moray
MANATEE|Gentle sea cow|Sirenian
NARWHAL|Whale with a tusk|Unicorn of the sea
PACIFIC|Largest ocean|Ocean named for its calm
ATLANTIC|Ocean between Europe and the Americas|Ocean Lindbergh crossed by air
ARCTIC|Coldest ocean|Polar sea up north
CURRENT|Flow of water in the ocean|Gulf Stream, e.g.
DIVER|Swimmer with a scuba tank|One who explores reefs
TSUNAMI|Huge wave from an earthquake|Seismic sea wave`
    },
    {
      id: 'science', name: 'Science', icon: '🔬', blurb: 'Atoms, cells & big ideas',
      keywords: ['science', 'chemistry', 'physics', 'biology', 'lab', 'experiment', 'atom', 'element', 'elements', 'scientist', 'stem', 'medicine', 'health'],
      words: `
ATOM|Tiny building block of matter|Nucleus plus electrons
MOLECULE|Group of bonded atoms|H2O, e.g.
ENERGY|Ability to do work|E in E=mc²
ELECTRON|Negative particle|Lepton in an orbital
PROTON|Positive particle in a nucleus|Hadron with charge +1
NEUTRON|Neutral particle in a nucleus|Uncharged nucleon
OXYGEN|Gas we breathe|Element O
CARBON|Element in diamonds|Element 6
HYDROGEN|Lightest element|Element 1
HELIUM|Gas in floating balloons|Element 2
MAGNET|It attracts iron|Lodestone, e.g.
CELL|Smallest unit of life|Basic biological unit
GENE|Unit of heredity|DNA segment
FOSSIL|Ancient remains in rock|Trilobite in stone
CRYSTAL|Solid with a regular pattern|Quartz specimen
LASER|Beam of focused light|Coherent light source
MICROSCOPE|Tool for seeing tiny things|Lab lens instrument
EXPERIMENT|Scientific test|Trial in the lab
THEORY|Well-tested scientific explanation|Relativity, e.g.
FORMULA|Chemical recipe like H2O|Equation
ACID|Substance with a low pH|Vinegar, e.g.
FRICTION|Force that slows sliding objects|Resistance to motion
VELOCITY|Speed in a direction|Vector quantity
PHYSICS|Science of matter and motion|Newton's field
BIOLOGY|Study of living things|Life science
CHEMISTRY|Study of substances and reactions|Lab science with beakers
GEOLOGY|Study of rocks|Earth science
NEURON|Nerve cell|Brain cell
PROTEIN|Nutrient made of amino acids|Enzyme, e.g.
VIRUS|Germ that causes the flu|Pathogen that needs a host
BACTERIA|Tiny single-celled organisms|Microbes
ENZYME|Protein that speeds reactions|Catalyst in the body
PLASMA|Fourth state of matter|Ionized gas
ISOTOPE|Element variant with extra neutrons|Carbon-14, e.g.
QUANTUM|Tiny packet of energy|___ leap
BEAKER|Lab glass container|Flask cousin
DNA|Genetic code molecule|Double helix
EVOLUTION|Darwin's big idea|Natural selection result
VACCINE|Shot that prevents disease|Immunizing injection
PHOTON|Particle of light|Light quantum`
    },
    {
      id: 'geography', name: 'Geography', icon: '🌍', blurb: 'Countries, maps & landmarks',
      keywords: ['geography', 'country', 'countries', 'travel', 'world', 'map', 'maps', 'city', 'cities', 'continent', 'nation', 'landmark', 'vacation', 'trip'],
      words: `
CONTINENT|Asia or Africa|One of seven landmasses
EQUATOR|Imaginary line around Earth's middle|Zero latitude
CAPITAL|City where the government sits|Paris, for France
MAP|Chart of an area|Atlas page
GLOBE|Round model of Earth|Spherical map
COMPASS|Tool that points north|Navigator's tool
LATITUDE|Distance north or south of the equator|Parallel measure
LONGITUDE|Distance east or west|Meridian measure
PENINSULA|Land almost surrounded by water|Florida, e.g.
DELTA|Land at a river's mouth|Mississippi's mouth
FRANCE|Country with the Eiffel Tower|Gallic nation
JAPAN|Island nation with Mount Fuji|Land of the Rising Sun
BRAZIL|Largest country in South America|Rio's country
EGYPT|Land of the pyramids|Nile nation
CANADA|Country north of the USA|Maple leaf land
INDIA|Country of the Taj Mahal|Most populous nation
CHINA|Land of the Great Wall|Beijing's nation
ITALY|Boot-shaped country|Rome's home
PERU|Home of Machu Picchu|Lima's land
KENYA|East African country famed for safaris|Nairobi's nation
MEXICO|Country south of the USA|Land of the Aztecs
GREECE|Birthplace of the Olympics|Hellenic nation
NORWAY|Land of fjords|Oslo's country
AFRICA|Continent with the Sahara|Continent where humans originated
EUROPE|Continent with the Alps|Old World continent
ASIA|Largest continent|Continent with Everest
AMAZON|Big South American river|Rain forest river
NILE|Long African river|River through Cairo
ALPS|Swiss mountains|Range with Mont Blanc
SAHARA|Large African desert|Largest hot desert
EVEREST|World's highest mountain|Peak first summited in 1953
TUNDRA|Cold treeless plain|Arctic biome
FJORD|Narrow inlet between cliffs|Norwegian inlet
STRAIT|Narrow water passage|Gibraltar, e.g.
ATLAS|Book of maps|Book named for a Titan
BORDER|Line between countries|Frontier
CITY|Large town|Metropolis
OASIS|Watering hole in a desert|Desert refuge
HEMISPHERE|Half of the Earth|Northern or Southern half
ARCHIPELAGO|Group of islands|The Philippines, e.g.`
    },
    {
      id: 'history', name: 'History', icon: '🏛️', blurb: 'Empires, eras & legends',
      keywords: ['history', 'historical', 'ancient', 'medieval', 'empire', 'war', 'king', 'kings', 'queen', 'egypt', 'rome', 'greece', 'castle', 'knight', 'past', 'archaeology'],
      words: `
PHARAOH|Ruler of ancient Egypt|Ramses, e.g.
PYRAMID|Ancient Egyptian tomb|Giza structure
CASTLE|Medieval fortress|Keep-and-moat site
KNIGHT|Armored medieval warrior|Sir, at the Round Table
EMPIRE|Lands ruled by an emperor|Byzantine, e.g.
VIKING|Norse seafarer|Leif Erikson, e.g.
SAMURAI|Japanese warrior|Bushido follower
GLADIATOR|Roman arena fighter|Colosseum combatant
ROMAN|Citizen of ancient Rome|Caesar, e.g.
CAESAR|Famous Roman leader|Julius of the Ides of March
NAPOLEON|French emperor exiled to Elba|Waterloo loser
CLEOPATRA|Last active pharaoh of Egypt|Antony's love
REVOLUTION|Overthrow of a government|1789 event in France
DYNASTY|Line of rulers|Ming, e.g.
TREATY|Peace agreement|Versailles document
COLONY|Settlement ruled by another country|Jamestown, e.g.
MUMMY|Wrapped Egyptian body|Tut, today
KING|Male monarch|Ruler with a crown
QUEEN|Female monarch|Victoria, e.g.
CROWN|Royal headwear|Diadem
THRONE|Royal chair|Seat of power
ARMOR|Knight's metal suit|Chain mail, e.g.
SWORD|Knight's weapon|Excalibur, e.g.
SHIELD|Protective plate carried on the arm|Aegis
SPARTA|Greek city of tough warriors|Rival of Athens
ATHENS|Greek birthplace of democracy|City of the Parthenon
ROME|City of the Colosseum|Eternal City
MEDIEVAL|Of the Middle Ages|Feudal-era
RENAISSANCE|Period of art rebirth in Europe|Era of da Vinci
ARTIFACT|Object from the past|Relic
ARCHIVE|Collection of historical records|Records repository
CENTURY|One hundred years|Hundred-year span
ANCIENT|Very old|Of antiquity
DEMOCRACY|Government by the people|Athenian innovation
SCROLL|Rolled-up ancient document|Dead Sea find
CHARIOT|Horse-drawn war cart|Ben-Hur's racer
TEMPLE|Ancient place of worship|Parthenon, e.g.
EXPLORER|Magellan or Columbus|Voyager of discovery
COLOSSEUM|Roman amphitheater|Flavian Amphitheatre
FEUDAL|Lords-and-vassals system|Like a medieval social order`
    },
    {
      id: 'technology', name: 'Technology', icon: '💻', blurb: 'Gadgets, code & the web',
      keywords: ['technology', 'tech', 'computer', 'computers', 'internet', 'coding', 'programming', 'gadget', 'gadgets', 'digital', 'software', 'robot', 'robots', 'video', 'gaming', 'phone'],
      words: `
COMPUTER|Machine with a keyboard and screen|PC
ROBOT|Machine that performs tasks|Android
INTERNET|Worldwide network|The Net
EMAIL|Electronic letter|Inbox item
KEYBOARD|Typing device|QWERTY layout device
MOUSE|Pointing device|Click tool
SCREEN|Display on a device|Monitor
LAPTOP|Portable computer|Notebook PC
TABLET|Flat touchscreen device|iPad, e.g.
SOFTWARE|Programs on a computer|Code products
HARDWARE|Physical computer parts|Components
CODE|Instructions for a computer|Program text
PIXEL|Tiny dot on a screen|Picture element
BATTERY|Power source for a phone|Lithium-ion cell
WIFI|Wireless internet|Hotspot service
PASSWORD|Secret login word|Credential
BROWSER|App for visiting websites|Chrome or Firefox
WEBSITE|Pages on the internet|Domain's content
APP|Program on a phone|Download for a smartphone
CLOUD|Online storage|Remote servers, collectively
DATA|Information a computer stores|Bits and bytes
BYTE|Eight bits|Memory unit
CHIP|Tiny piece of a circuit|Silicon wafer piece
SENSOR|Device that detects changes|Detector
DRONE|Flying robot with propellers|Quadcopter
PRINTER|Device that puts text on paper|Inkjet, e.g.
CAMERA|Device for taking photos|Lens device
ALGORITHM|Step-by-step procedure for a computer|Recipe for computation
SERVER|Computer that hosts websites|Host machine
NETWORK|Connected computers|LAN, e.g.
DIGITAL|Using numbers instead of analog|Like modern clocks
VIRTUAL|Not physically real, online|Simulated
UPLOAD|Send to the internet|Post, as a file
DOWNLOAD|Get a file from the internet|Fetch, as a file
GADGET|Small tech device|Gizmo
CIRCUIT|Path for electricity|Loop of current
MODEM|Device that connects to the internet|Signal translator box
SILICON|Material in computer chips|Element 14
CURSOR|Blinking line on a screen|Pointer
STORAGE|Where files are kept|Disk space`
    },
    {
      id: 'arts', name: 'Arts & Books', icon: '🎨', blurb: 'Painting, stage & story',
      keywords: ['art', 'arts', 'painting', 'book', 'books', 'reading', 'literature', 'theater', 'theatre', 'movie', 'movies', 'film', 'films', 'poetry', 'writing', 'dance', 'craft', 'crafts'],
      words: `
PAINTING|Artwork on canvas|Oil, e.g.
SCULPTURE|3-D art carved or molded|Statue, e.g.
CANVAS|Surface for painting|Artist's fabric
BRUSH|Painter's tool|Sable tool
EASEL|Stand for a painting|Painter's stand
PALETTE|Board for mixing paint|Range of colors
PORTRAIT|Painting of a person|Mona Lisa, e.g.
POETRY|Verse writing|Rhyme form
NOVEL|Long fiction book|Book-length story
POEM|Verse with rhymes|Sonnet, e.g.
SONNET|Fourteen-line poem|Shakespearean form
AUTHOR|Writer of a book|Novelist
CHAPTER|Section of a book|Book part
LIBRARY|Place to borrow books|Stacks site
THEATER|Place to see plays|Stage venue
STAGE|Platform for actors|The boards
ACTOR|Performer in a play|Thespian
DRAMA|Serious play|Tragedy, e.g.
COMEDY|Funny show|Sitcom genre
BALLET|Dance on pointe|Swan Lake, e.g.
DANCE|Move to music|Waltz, e.g.
MUSEUM|Place to see art|Louvre, e.g.
GALLERY|Room for showing art|Exhibit space
SKETCH|Quick drawing|Rough draft drawing
CHARCOAL|Black drawing stick|Burnt drawing medium
MOSAIC|Art made of small tiles|Tessera artwork
POTTERY|Clay art|Ceramics
FILM|Movie|Picture
SCRIPT|Text actors read|Screenplay
DIRECTOR|Person who runs a film set|Auteur
CHARACTER|Person in a story|Protagonist, e.g.
PLOT|Storyline|Narrative arc
HERO|Main good guy|Protagonist
VILLAIN|Bad guy in a story|Antagonist
FABLE|Story with a moral|Aesop tale
MYTH|Ancient legend|Legend of the gods
ORIGAMI|Japanese paper folding|Paper crane art
COLLAGE|Art made by pasting pieces|Glued composition
MURAL|Painting on a wall|Fresco, e.g.
INK|Pen fluid|Tattoo stuff`
    }
  ];

  function parse(theme) {
    const entries = theme.words.trim().split('\n').map((line) => {
      const [answer, easy, hard] = line.split('|').map((s) => s.trim());
      return { answer: answer.toUpperCase(), easy, hard: hard || easy, theme: theme.id };
    });
    return {
      id: theme.id, name: theme.name, icon: theme.icon, blurb: theme.blurb,
      keywords: theme.keywords, entries
    };
  }

  const themes = RAW.map(parse);

  function generalEntries() {
    const seen = new Set();
    const out = [];
    for (const t of themes) {
      for (const e of t.entries) {
        if (seen.has(e.answer)) continue;
        seen.add(e.answer);
        out.push(e);
      }
    }
    return out;
  }

  const general = {
    id: 'general', name: 'Mixed Bag', icon: '🧠', blurb: 'A bit of everything',
    keywords: ['general', 'trivia', 'mixed', 'random', 'anything', 'everything'],
    entries: generalEntries()
  };

  const api = { themes: themes.concat([general]), general };
  root.CW = Object.assign(root.CW || {}, { bank: api });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
