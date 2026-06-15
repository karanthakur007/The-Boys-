export enum Faction {
  BOYS = 'BOYS',
  SEVEN = 'SEVEN'
}

export enum CampaignDifficulty {
  RECRUIT = 'RECRUIT', // Easy
  OPERATIVE = 'OPERATIVE', // Normal
  SUPE = 'SUPE' // Hard
}

export interface Character {
  id: string;
  name: string;
  codename: string;
  faction: Faction;
  avatar: string; // Tailored dynamic color/styling
  description: string;
  // Base Stats
  maxHp: number;
  currentHp: number;
  attack: number;
  defense: number;
  speed: number;
  // Upgrades
  level: number;
  xp: number;
  tempVEnabled: boolean; // Temp V boost for Boys, Compound V mastery for Seven
  unlockedSkills: string[];
  skills: Skill[];
}

export interface Skill {
  name: string;
  description: string;
  damageMultiplier: number;
  cooldownTurns: number;
  currentCooldown: number;
  effect?: 'laser' | 'gas' | 'shield' | 'speed' | 'regen' | 'taunt' | 'stun' | 'aoe' | 'heal';
}

export interface Territory {
  id: string;
  name: string;
  description: string;
  control: number; // -100 (100% Boys) to +100 (100% Seven)
  boysInfluenceRate: number; // Percent increase per turn for Boys characters stationed
  sevenInfluenceRate: number; // Percent increase per turn for Seven characters stationed
  stationedCharacterIds: string[];
  baseIncome: {
    cash: number;
    compoundV: number;
    intel: number;
    pr: number;
  };
}

export interface CampaignEvent {
  id: string;
  title: string;
  description: string;
  boysChoice: {
    label: string;
    outcomeText: string;
    applyEffects: (state: any) => any;
  };
  sevenChoice: {
    label: string;
    outcomeText: string;
    applyEffects: (state: any) => any;
  };
}

export interface CombatUnit {
  id: string;
  name: string;
  codename: string;
  faction: Faction;
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  skills: Skill[];
  isDead: boolean;
  avatar: string;
  side: 'player' | 'enemy';
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  dangerLevel: 'Low' | 'Medium' | 'High' | 'EXTREME';
  reward: {
    cash?: number;
    compoundV?: number;
    intel?: number;
    pr?: number;
    controlBonus?: number; // percentage control shift in territory
  };
  territoryId: string;
  enemyTeam: string[]; // character IDs or custom enemy names
}
