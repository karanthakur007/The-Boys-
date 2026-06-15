export interface TauntQuote {
  characterId: string;
  name: string;
  quote: string;
}

export const CHARACTER_TAUNTS: Record<string, string[]> = {
  // THE BOYS
  butcher: [
    "Well, well, well... if it ain't the invisible cunt.",
    "Don't worry, my son, I'm here to fix this proper.",
    "Right, let's go do some bad things."
  ],
  hughie: [
    "Oh God, oh God, we are all going to die, aren't we?",
    "I'm not doing this naked again. No way.",
    "Alright, let's put up a fight!"
  ],
  mm: [
    "Keep your hands clean and stick to the plan.",
    "I've got a bad feeling about this, but I've got your back.",
    "Let's clean this city up, one block at a time!"
  ],
  frenchie: [
    "Mon ami! Let us make something beautifully dangerous!",
    "Ah, the sweet smell of halothane and vengeance.",
    "Time for some chemical romance!"
  ],
  kimiko: [
    "*cracks knuckles aggressively*",
    "*intense, lethal stare*",
    "*feral growl*"
  ],
  starlight: [
    "I am done playing by your rules!",
    "Let's show them what real light can do.",
    "Time to clean up Vought's mess!"
  ],

  // THE SEVEN
  homelander: [
    "I can do whatever the f**k I want!",
    "You are not the real heroes. I am.",
    "I'm Homelander, and you... are toys."
  ],
  maeve: [
    "Buy yourself some time, because you're gonna need it.",
    "We're all hypocrites, but I can still kick your ass.",
    "Just stick to the PR script, okay?"
  ],
  atrain: [
    "You can't catch the fastest man alive!",
    "I'm back on top, baby! Mach 3!",
    "Clear the track, there's a new record coming!"
  ],
  blacknoir: [
    "...",
    "*taps carbon-fiber blade silently*",
    "*perches in the shadows*"
  ],
  thedeep: [
    "The sea is calling, and it's super pissed!",
    "I'm a valuable member of this team, right?",
    "Respect the gills, man! Respect them!"
  ],
  sagesister: [
    "I calculated 837 ways this ends. In all of them, I win.",
    "Please don't make me explain this twice.",
    "Your moves are so basic, it hurts."
  ],

  // ENEMIES / OPPOSITION TAUNTS
  "Vought Guard Executive": [
    "Hold position! Neutralize the unauthorized vigilante!",
    "Vought stock must not drop because of you!",
    "Call backup! We have an breach in Sector 4!"
  ],
  "Security Drone Squad": [
    "[TARGET IDENTIFIED: INITIATING LETHAL DEPLOYMENT]",
    "[SCANNING TRAJECTORY... DEFENSE MATRIX ENABLED]",
    "[BEEP] TARGET DECLARED VOUGHT PROPERTY TRESPASSER"
  ],
  "Supe Enforcer Force": [
    "I'll break your bones before Homelander even hears of you!",
    "Taste real Compound V power, insect!",
    "Out of my way, mere human!"
  ],
  "Homelander Duplicate": [
    "You dare carbon-copy perfection?",
    "I am the upgrade!",
    "You're just another piece of useless rust..."
  ],
  "Black Noir Echo": [
    "...",
    "*swishes dual blades with perfect precision*",
    "*fuses back into the floor shadows*"
  ]
};

export function getRandomTaunt(characterIdOrName: string): string {
  const normId = characterIdOrName.toLowerCase().replace(/['\s-]/g, '');
  
  // Try exact lookup
  if (CHARACTER_TAUNTS[characterIdOrName]) {
    const list = CHARACTER_TAUNTS[characterIdOrName];
    return list[Math.floor(Math.random() * list.length)];
  }
  
  // Try normalized lookup
  const foundKey = Object.keys(CHARACTER_TAUNTS).find(
    k => k.toLowerCase().replace(/['\s-]/g, '') === normId
  );
  
  if (foundKey) {
    const list = CHARACTER_TAUNTS[foundKey];
    return list[Math.floor(Math.random() * list.length)];
  }

  // Generic fallback quotes
  const fallbacks = [
    "Look out! I'm moving into position!",
    "Time to show these guys who runs this city!",
    "You picked the wrong neighborhood to mess with!"
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
