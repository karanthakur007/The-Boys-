import { Character, Faction, Skill } from '../types';

export const BOYS_SKILLS: Record<string, Skill[]> = {
  butcher: [
    { name: 'Crowbar Strike', description: 'Deals moderate blunt damage.', damageMultiplier: 1.2, cooldownTurns: 0, currentCooldown: 0 },
    { name: 'Laser Beam eyes (Temp V)', description: 'Fires blue energy beams. Heavy damage and pierces armor.', damageMultiplier: 2.5, cooldownTurns: 3, currentCooldown: 0, effect: 'laser' },
    { name: 'Butcher\'s Rage', description: 'Empowers self, increasing attack rating.', damageMultiplier: 1.5, cooldownTurns: 2, currentCooldown: 0, effect: 'taunt' }
  ],
  hughie: [
    { name: 'Taser Pulse', description: 'Deals low electric damage and slows target.', damageMultiplier: 0.8, cooldownTurns: 0, currentCooldown: 0 },
    { name: 'Naked Teleport', description: 'Teleports to safety, healing or shielding an ally.', damageMultiplier: 1.2, cooldownTurns: 2, currentCooldown: 0, effect: 'speed' },
    { name: 'Panicked Defibrillator', description: 'Fully restores health of a teammate.', damageMultiplier: 0.0, cooldownTurns: 4, currentCooldown: 0, effect: 'heal' }
  ],
  mm: [
    { name: 'Tactical Pistol', description: 'Standard firearm precision shot.', damageMultiplier: 1.0, cooldownTurns: 0, currentCooldown: 0 },
    { name: 'Suppressive Fire', description: 'Heavy fire, taunts enemies to attack MM while boosting defense.', damageMultiplier: 1.3, cooldownTurns: 2, currentCooldown: 0, effect: 'shield' },
    { name: 'MM\'s Plan', description: 'Gives tactical shield bubble to all allies.', damageMultiplier: 0.0, cooldownTurns: 3, currentCooldown: 0, effect: 'shield' }
  ],
  frenchie: [
    { name: 'Improvised Grenade', description: 'Explosive blast dealing decent AoE damage.', damageMultiplier: 1.3, cooldownTurns: 0, currentCooldown: 0, effect: 'aoe' },
    { name: 'Halothane Gas', description: 'Stuns the entire enemy team for 1 turn.', damageMultiplier: 0.7, cooldownTurns: 4, currentCooldown: 0, effect: 'gas' },
    { name: 'Compound V Hypo', description: 'Applies experimental booster to a teammates weapon.', damageMultiplier: 1.8, cooldownTurns: 2, currentCooldown: 0 }
  ],
  kimiko: [
    { name: 'Feral Claw Strike', description: 'Rips through armor with raw power.', damageMultiplier: 1.4, cooldownTurns: 0, currentCooldown: 0 },
    { name: 'Regeneration Burst', description: 'Heals self and gains temporary immortality for a turn.', damageMultiplier: 0.0, cooldownTurns: 3, currentCooldown: 0, effect: 'regen' },
    { name: 'Quiet Fury', description: 'Unleashes devastating multi-claw attack on one enemy.', damageMultiplier: 2.2, cooldownTurns: 2, currentCooldown: 0 }
  ],
  starlight: [
    { name: 'Light Blast', description: 'Basic solar fire.', damageMultiplier: 1.1, cooldownTurns: 0, currentCooldown: 0 },
    { name: 'Bio-Electric Pulse', description: 'Blinds enemies and stuns the target.', damageMultiplier: 1.6, cooldownTurns: 3, currentCooldown: 0, effect: 'stun' },
    { name: 'Supercharged EMP', description: 'Drain power grid to deal massive explosive light damage.', damageMultiplier: 2.4, cooldownTurns: 4, currentCooldown: 0, effect: 'aoe' }
  ]
};

export const SEVEN_SKILLS: Record<string, Skill[]> = {
  homelander: [
    { name: 'God Punch', description: 'Devastating punch that shatters ribs.', damageMultiplier: 1.5, cooldownTurns: 0, currentCooldown: 0 },
    { name: 'Heat Vision', description: 'Fires red lasers from eyes, completely obliterating defense.', damageMultiplier: 3.0, cooldownTurns: 3, currentCooldown: 0, effect: 'laser' },
    { name: 'Vought Propaganda Storm', description: 'Screams in rage, dealing sound damage and reducing enemy morale.', damageMultiplier: 1.8, cooldownTurns: 2, currentCooldown: 0, effect: 'aoe' }
  ],
  maeve: [
    { name: 'Amazonian Sword', description: 'Heavy slash dealing high damage.', damageMultiplier: 1.3, cooldownTurns: 0, currentCooldown: 0 },
    { name: 'Indestructible Shield', description: 'Creates a heavy defense bubble blocks all attacks.', damageMultiplier: 0.0, cooldownTurns: 3, currentCooldown: 0, effect: 'shield' },
    { name: 'Martial Combo', description: 'Unloads a sequence of expert martial arts strikes.', damageMultiplier: 2.1, cooldownTurns: 2, currentCooldown: 0 }
  ],
  atrain: [
    { name: 'Supersonic Dash', description: 'Hits the target at Mach 2 speeds.', damageMultiplier: 1.4, cooldownTurns: 0, currentCooldown: 0, effect: 'speed' },
    { name: 'V-Boosted Slams', description: 'Speed-punches the target multiple times.', damageMultiplier: 2.1, cooldownTurns: 2, currentCooldown: 0 },
    { name: 'Shockwave Sweep', description: 'Generates a powerful sonic boom hitting all enemies.', damageMultiplier: 1.5, cooldownTurns: 3, currentCooldown: 0, effect: 'aoe' }
  ],
  blacknoir: [
    { name: 'Carbon Fiber Blade', description: 'Stealth attack dealing deep bleeding wounds.', damageMultiplier: 1.2, cooldownTurns: 0, currentCooldown: 0 },
    { name: 'Silent Exploding Shuriken', description: 'Throws active ninja-bomb at a target.', damageMultiplier: 1.8, cooldownTurns: 2, currentCooldown: 0, effect: 'aoe' },
    { name: 'Vital Pierce', description: 'Strikes the weakest spot, ignoring 100% defense.', damageMultiplier: 2.4, cooldownTurns: 3, currentCooldown: 0, effect: 'stun' }
  ],
  thedeep: [
    { name: 'High-Pressure Torrent', description: 'Streams firehose-like water currents.', damageMultiplier: 1.0, cooldownTurns: 0, currentCooldown: 0 },
    { name: 'Oceanic Calling', description: 'Summons a giant whale or octopus to slap the enemy.', damageMultiplier: 1.7, cooldownTurns: 2, currentCooldown: 0, effect: 'aoe' },
    { name: 'Fresh Seafood Buffet', description: 'Heals self and gains speed by eating sea creatures.', damageMultiplier: 0.0, cooldownTurns: 3, currentCooldown: 0, effect: 'regen' }
  ],
  sagesister: [
    { name: 'Strategic Read', description: 'Analyzes target, increasing future damage against them.', damageMultiplier: 1.1, cooldownTurns: 0, currentCooldown: 0 },
    { name: 'Calculated Defense', description: 'Predicts physical trajectories to shield team.', damageMultiplier: 0.0, cooldownTurns: 2, currentCooldown: 0, effect: 'shield' },
    { name: 'Cognitive Disruption', description: 'Overwhelms the enemy brain, silencing and stunning them.', damageMultiplier: 2.0, cooldownTurns: 4, currentCooldown: 0, effect: 'stun' }
  ]
};

export const CHARACTER_DATABASE: Character[] = [
  // THE BOYS
  {
    id: 'butcher',
    name: 'Billy Butcher',
    codename: 'Butcher',
    faction: Faction.BOYS,
    avatar: 'bg-gradient-to-tr from-stone-900 to-amber-950 border-amber-600',
    description: 'Leader of The Boys. A foul-mouthed agent of pure vengeance with a deep-seated hatred for Supes, especially Homelander.',
    maxHp: 180,
    currentHp: 180,
    attack: 34,
    defense: 12,
    speed: 15,
    level: 1,
    xp: 0,
    tempVEnabled: false,
    unlockedSkills: ['Crowbar Strike', 'Laser Beam eyes (Temp V)', 'Butcher\'s Rage'],
    skills: BOYS_SKILLS.butcher
  },
  {
    id: 'hughie',
    name: 'Hughie Campbell',
    codename: 'Hughie',
    faction: Faction.BOYS,
    avatar: 'bg-gradient-to-tr from-emerald-950 to-stone-900 border-emerald-600',
    description: 'An average guy thrown into extreme vigilantism. He provides critical support, panic support, and smart backup.',
    maxHp: 120,
    currentHp: 120,
    attack: 18,
    defense: 8,
    speed: 18,
    level: 1,
    xp: 0,
    tempVEnabled: false,
    unlockedSkills: ['Taser Pulse', 'Naked Teleport', 'Panicked Defibrillator'],
    skills: BOYS_SKILLS.hughie
  },
  {
    id: 'mm',
    name: "Mother's Milk",
    codename: 'MM',
    faction: Faction.BOYS,
    avatar: 'bg-gradient-to-tr from-stone-900 to-amber-900 border-yellow-700',
    description: 'The tactical operational expert. Organized, defensive, and serves as the structural anchor for The Boys.',
    maxHp: 200,
    currentHp: 200,
    attack: 25,
    defense: 25,
    speed: 10,
    level: 1,
    xp: 0,
    tempVEnabled: false,
    unlockedSkills: ['Tactical Pistol', 'Suppressive Fire', "MM's Plan"],
    skills: BOYS_SKILLS.mm
  },
  {
    id: 'frenchie',
    name: 'Serge',
    codename: 'Frenchie',
    faction: Faction.BOYS,
    avatar: 'bg-gradient-to-tr from-indigo-950 to-stone-900 border-indigo-500',
    description: 'An eccentric French chemist and weapons engineer. Adept at exploiting supe physical weaknesses and poison gas.',
    maxHp: 130,
    currentHp: 130,
    attack: 28,
    defense: 10,
    speed: 14,
    level: 1,
    xp: 0,
    tempVEnabled: false,
    unlockedSkills: ['Improvised Grenade', 'Halothane Gas', 'Compound V Hypo'],
    skills: BOYS_SKILLS.frenchie
  },
  {
    id: 'kimiko',
    name: 'Kimiko Miyashiro',
    codename: 'The Female',
    faction: Faction.BOYS,
    avatar: 'bg-gradient-to-tr from-rose-950 to-stone-900 border-rose-600',
    description: 'A silent, mutant-strength fighter with incredible healing factors and bone-snapping speed.',
    maxHp: 190,
    currentHp: 190,
    attack: 38,
    defense: 15,
    speed: 24,
    level: 1,
    xp: 0,
    tempVEnabled: true,
    unlockedSkills: ['Feral Claw Strike', 'Regeneration Burst', 'Quiet Fury'],
    skills: BOYS_SKILLS.kimiko
  },
  {
    id: 'starlight',
    name: 'Annie January',
    codename: 'Starlight',
    faction: Faction.BOYS,
    avatar: 'bg-gradient-to-tr from-sky-950 to-amber-950 border-amber-400',
    description: 'A genuine hero. Formerly of The Seven, she defects to help The Boys subvert Vought’s global marketing regime.',
    maxHp: 160,
    currentHp: 160,
    attack: 30,
    defense: 18,
    speed: 16,
    level: 1,
    xp: 0,
    tempVEnabled: false,
    unlockedSkills: ['Light Blast', 'Bio-Electric Pulse', 'Supercharged EMP'],
    skills: BOYS_SKILLS.starlight
  },

  // THE SEVEN
  {
    id: 'homelander',
    name: 'John Vought',
    codename: 'Homelander',
    faction: Faction.SEVEN,
    avatar: 'bg-gradient-to-tr from-blue-950 to-red-950 border-blue-500',
    description: 'The terrifying, narcissistic, god-tier leader of The Seven with laser vision and absolute invincibility feelings.',
    maxHp: 260,
    currentHp: 260,
    attack: 48,
    defense: 30,
    speed: 25,
    level: 1,
    xp: 0,
    tempVEnabled: false,
    unlockedSkills: ['God Punch', 'Heat Vision', 'Vought Propaganda Storm'],
    skills: SEVEN_SKILLS.homelander
  },
  {
    id: 'maeve',
    name: 'Maggie Shaw',
    codename: 'Queen Maeve',
    faction: Faction.SEVEN,
    avatar: 'bg-gradient-to-tr from-yellow-950 to-stone-900 border-amber-600',
    description: 'A disillusioned warrior of Vought. Immense stamina and swordcraft. Hardened on the outside, conflicted internally.',
    maxHp: 220,
    currentHp: 220,
    attack: 35,
    defense: 25,
    speed: 15,
    level: 1,
    xp: 0,
    tempVEnabled: false,
    unlockedSkills: ['Amazonian Sword', 'Indestructible Shield', 'Martial Combo'],
    skills: SEVEN_SKILLS.maeve
  },
  {
    id: 'atrain',
    name: 'Reggie Franklin',
    codename: 'A-Train',
    faction: Faction.SEVEN,
    avatar: 'bg-gradient-to-tr from-indigo-950 to-slate-900 border-sky-400',
    description: 'The fastest man alive. Reliant on Compound V to protect his brand rating, dealing rapid sonic shockwave slams.',
    maxHp: 150,
    currentHp: 150,
    attack: 28,
    defense: 14,
    speed: 35,
    level: 1,
    xp: 0,
    tempVEnabled: false,
    unlockedSkills: ['Supersonic Dash', 'V-Boosted Slams', 'Shockwave Sweep'],
    skills: SEVEN_SKILLS.atrain
  },
  {
    id: 'blacknoir',
    name: 'Unknown Agent',
    codename: 'Black Noir',
    faction: Faction.SEVEN,
    avatar: 'bg-gradient-to-tr from-neutral-950 to-stone-900 border-neutral-700',
    description: 'The silent ninja assassin. Highly lethally efficient, completely mute, and absolute in executing Vought orders.',
    maxHp: 170,
    currentHp: 170,
    attack: 36,
    defense: 16,
    speed: 20,
    level: 1,
    xp: 0,
    tempVEnabled: false,
    unlockedSkills: ['Carbon Fiber Blade', 'Silent Exploding Shuriken', 'Vital Pierce'],
    skills: SEVEN_SKILLS.blacknoir
  },
  {
    id: 'thedeep',
    name: 'Kevin Moskowitz',
    codename: 'The Deep',
    faction: Faction.SEVEN,
    avatar: 'bg-gradient-to-tr from-teal-950 to-green-950 border-teal-500',
    description: 'Lord of the Seven Seas. Can talk to marine life (mostly ends in disaster) and acts in desperate need of validation.',
    maxHp: 160,
    currentHp: 160,
    attack: 24,
    defense: 18,
    speed: 12,
    level: 1,
    xp: 0,
    tempVEnabled: false,
    unlockedSkills: ['High-Pressure Torrent', 'Oceanic Calling', 'Fresh Seafood Buffet'],
    skills: SEVEN_SKILLS.thedeep
  },
  {
    id: 'sagesister',
    name: 'Sister Sage',
    codename: 'Sister Sage',
    faction: Faction.SEVEN,
    avatar: 'bg-gradient-to-tr from-purple-950 to-slate-900 border-purple-500',
    description: 'The smartest human on Earth. Uses high intellect, tactical strategy setup, and master cognitive disruptions.',
    maxHp: 140,
    currentHp: 140,
    attack: 20,
    defense: 12,
    speed: 18,
    level: 1,
    xp: 0,
    tempVEnabled: false,
    unlockedSkills: ['Strategic Read', 'Calculated Defense', 'Cognitive Disruption'],
    skills: SEVEN_SKILLS.sagesister
  }
];
