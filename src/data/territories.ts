import { Territory, Mission } from '../types';

export const SYSTEM_TERRITORIES: Territory[] = [
  {
    id: 'vought_tower',
    name: 'Vought Corporate Tower',
    description: 'The monumental core of Vought power in Midtown. Heavily secured with active PR sweeps, server vaults, and elite high security.',
    control: 60, // Starts biased toward Seven (positive)
    boysInfluenceRate: 0,
    sevenInfluenceRate: 0,
    stationedCharacterIds: [],
    baseIncome: { cash: 1500, compoundV: 20, intel: 5, pr: 50 }
  },
  {
    id: 'flatiron',
    name: 'Flatiron Safehouse HQ',
    description: 'The Boys\' main underground headquarters. Scattered monitors, guns, and files tracking down Vought secrets.',
    control: -60, // Starts biased toward Boys (negative)
    boysInfluenceRate: 0,
    sevenInfluenceRate: 0,
    stationedCharacterIds: [],
    baseIncome: { cash: 400, compoundV: 2, intel: 35, pr: -10 }
  },
  {
    id: 'central_park',
    name: 'Central Park Pavilions',
    description: 'The ultimate battleground for public approval. Public festivals, charity galas, and secret rendezvous sites.',
    control: 10,
    boysInfluenceRate: 0,
    sevenInfluenceRate: 0,
    stationedCharacterIds: [],
    baseIncome: { cash: 600, compoundV: 5, intel: 15, pr: 25 }
  },
  {
    id: 'brooklyn_docks',
    name: 'Brooklyn Shipping Docks',
    description: 'Industrial warehouses. The primary port for Vought’s secret shipments of raw Compound V ingredients.',
    control: -10,
    boysInfluenceRate: 0,
    sevenInfluenceRate: 0,
    stationedCharacterIds: [],
    baseIncome: { cash: 800, compoundV: 30, intel: 12, pr: 5 }
  },
  {
    id: 'times_square',
    name: 'Times Square Media Grid',
    description: 'The beating heart of global advertising. Whichever faction dominates this billboard grid dictates the narrative.',
    control: 25,
    boysInfluenceRate: 0,
    sevenInfluenceRate: 0,
    stationedCharacterIds: [],
    baseIncome: { cash: 1100, compoundV: 8, intel: 18, pr: 45 }
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm1',
    name: 'Compound V Hijack',
    description: 'Intercept a heavily armed cargo truck moving raw Compound V shipping barrels in the Brooklyn Docks.',
    dangerLevel: 'Medium',
    reward: { cash: 500, compoundV: 25, controlBonus: -20 },
    territoryId: 'brooklyn_docks',
    enemyTeam: ['atrain', 'thedeep']
  },
  {
    id: 'm2',
    name: 'Vought Server Infiltration',
    description: 'Slip into the sub-basement servers of the Vought Corporate Tower to download blackmail datasets.',
    dangerLevel: 'High',
    reward: { cash: 800, intel: 40, controlBonus: -25 },
    territoryId: 'vought_tower',
    enemyTeam: ['blacknoir', 'sagesister']
  },
  {
    id: 'm3',
    name: 'Rival Press Conference Ambush',
    description: 'Disrupt Vought\'s grand live broadcast in Times Square to leak shocking security cam reels.',
    dangerLevel: 'EXTREME',
    reward: { cash: 1200, pr: -50, controlBonus: -35 },
    territoryId: 'times_square',
    enemyTeam: ['homelander', 'maeve']
  },
  {
    id: 'm4',
    name: 'Vigilante Safehouse Raid',
    description: 'Storm a suspected operational safehouse of The Boys in the Flatiron district to retrieve stolen blueprints.',
    dangerLevel: 'Medium',
    reward: { cash: 600, intel: 20, controlBonus: 20 },
    territoryId: 'flatiron',
    enemyTeam: ['frenchie', 'hughie']
  },
  {
    id: 'm5',
    name: 'Central Park Security Sweep',
    description: 'Cleanse the public meeting grounds of secret bugging devices and neutralize vigilante spotters.',
    dangerLevel: 'Low',
    reward: { cash: 400, pr: 30, controlBonus: 15 },
    territoryId: 'central_park',
    enemyTeam: ['starlight', 'mm']
  },
  {
    id: 'm6',
    name: 'Butcher\'s Final Strike',
    description: 'Direct skirmish targeting Billy Butcher to crush the vigilante uprising once and for all.',
    dangerLevel: 'EXTREME',
    reward: { cash: 2000, pr: 100, controlBonus: 40 },
    territoryId: 'flatiron',
    enemyTeam: ['butcher', 'kimiko', 'mm']
  }
];
