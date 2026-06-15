import { CampaignEvent } from '../types';

export const CAMPAIGN_EVENTS: CampaignEvent[] = [
  {
    id: 'e1',
    title: 'PR Scandal: Collateral Damage',
    description: 'During a dynamic chase, A-Train accidentally ran through an innocent pedestrian, and someone captured it on video. The file is floating around safehouse servers.',
    boysChoice: {
      label: 'Expose the Tape immediately',
      outcomeText: 'You leak the raw feed on the internet. Vought’s public favor tanks, but they fire back with severe cyberattacks against your safehouse network.',
      applyEffects: (state) => ({
        ...state,
        pr: Math.max(0, state.pr - 30),
        intel: Math.max(0, state.intel - 15),
        cash: Math.max(0, state.cash - 200),
        log: 'You leaked A-Train\'s video feed. Vought stock dipped 8% but they trace-hacked your funding bank accounts.'
      })
    },
    sevenChoice: {
      label: 'Pay off the family & NDA them',
      outcomeText: 'You allocate corporate cash and send security units to suppress the family. Public rating is preserved, but you burn cold liquidity.',
      applyEffects: (state) => ({
        ...state,
        cash: Math.max(0, state.cash - 600),
        pr: Math.min(100, state.pr + 20),
        log: 'Paid off witnesses with $600 cash. The incident was completely buried in mainstream outlets.'
      })
    }
  },
  {
    id: 'e2',
    title: 'The Temp-V Dilemma',
    description: 'Frenchie successfully synthesizes a toxic green vial of Temp-V. It grants human beings severe superpower bursts but corrupts their internal organs if abused.',
    boysChoice: {
      label: 'Distribute to Butcher & team',
      outcomeText: 'You give your team the green serum. Everyone gets permanent +8 Attack and +20 Max HP but loses 30 current HP on administrative strain.',
      applyEffects: (state) => {
        const updatedRoster = state.roster.map((char: any) => {
          if (char.faction === 'BOYS') {
            return {
              ...char,
              attack: char.attack + 8,
              maxHp: char.maxHp + 20,
              currentHp: Math.max(5, char.currentHp - 30),
              tempVEnabled: true
            };
          }
          return char;
        });
        return {
          ...state,
          roster: updatedRoster,
          compoundV: Math.max(0, state.compoundV - 10),
          log: 'The team ingested Temp V. Claws and lasers feel sharper, but Butcher has a hacking cough.'
        };
      }
    },
    sevenChoice: {
      label: 'Confiscate and Destroy the samples',
      outcomeText: 'You locate and seize their illicit synthesize operations. You gain 15 Compound V and eliminate their chemical leverage.',
      applyEffects: (state) => ({
        ...state,
        compoundV: state.compoundV + 15,
        intel: Math.max(0, state.intel - 10),
        log: 'Seized vigilante assets. Shipped raw V stocks straight back into the central Vought vault.'
      })
    }
  },
  {
    id: 'e3',
    title: 'Homelander\'s Live Retribution',
    description: 'Homelander holds an unscripted, impromptu broadcast atop Vought Tower. He demands absolute obedience and threatens to vaporize anyone in his way.',
    boysChoice: {
      label: 'Deploy Starlight for damage control',
      outcomeText: 'Starlight runs a concurrent live-stream defusing his rage, saving innocent opinion and recruiting volunteers.',
      applyEffects: (state) => ({
        ...state,
        pr: Math.min(100, state.pr + 15),
        cash: state.cash + 300,
        log: 'Starlight bypassed Vought firewalls to stream an appeal for peace. Volunteers donated cash.'
      })
    },
    sevenChoice: {
      label: 'Approve Homelander\'s raw feedback',
      outcomeText: 'You endorse his supreme statement. Absolute authority increases your military dominance but causes public approval to splinter rapidly.',
      applyEffects: (state) => ({
        ...state,
        pr: Math.max(0, state.pr - 25),
        compoundV: state.compoundV + 30, // heavy V allocation
        log: 'Approved Homelander\'s broadcast. Vought gains tighter field control, and stock drops are offset by aggressive military contracts.'
      })
    }
  },
  {
    id: 'e4',
    title: 'Vought Security Leak',
    description: 'An anonymous analyst on Vought\'s 48th floor leaves a schematic for the laser arrays hanging in a secure digital dropbox.',
    boysChoice: {
      label: 'Download structural files',
      outcomeText: 'You gain deep architectural blueprints. Increase Intel significantly.',
      applyEffects: (state) => ({
        ...state,
        intel: state.intel + 40,
        log: 'Hacked the security blueprints. You now know the exact patrol timings of Black Noir.'
      })
    },
    sevenChoice: {
      label: 'Purge internal systems & punish staff',
      outcomeText: 'Establish a rigid military lockdown over the tech floor. Stops security hazards.',
      applyEffects: (state) => ({
        ...state,
        pr: Math.max(0, state.pr - 10),
        cash: Math.max(0, state.cash - 100),
        intel: state.intel + 15,
        log: 'Vought Tower tech floors locked down. Two analysts were fired; security grids tightened.'
      })
    }
  }
];
