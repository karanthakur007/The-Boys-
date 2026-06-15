import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Skull, Shield, Star, DollarSign, Brain, Heart, ChevronRight, BarChart3, 
  Users, HelpCircle, Swords, MapIcon, Compass, Activity, Database, AlertCircle, 
  RefreshCw, TrendingUp, Info, Award, Zap, LogOut
} from 'lucide-react';

import { Faction, Character, Territory, Mission, CampaignEvent, CampaignDifficulty } from './types';
import { CHARACTER_DATABASE } from './data/characters';
import { SYSTEM_TERRITORIES, INITIAL_MISSIONS } from './data/territories';
import { CAMPAIGN_EVENTS } from './data/events';
import { getRandomTaunt } from './data/taunts';

import FactionSelector from './components/FactionSelector';
import BattleScreen from './components/BattleScreen';
import CampaignEventsModal from './components/CampaignEventsModal';
import TutorialModal from './components/TutorialModal';
import CharacterAvatar from './components/CharacterAvatar';
import Character3DModel from './components/Character3DModel';

export default function App() {
  // Core Faction and Account Setup
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<CampaignDifficulty>(CampaignDifficulty.OPERATIVE);

  // Campaign Game States
  const [roster, setRoster] = useState<Character[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  
  // Tactical Resources
  const [cash, setCash] = useState<number>(0);
  const [compoundV, setCompoundV] = useState<number>(0);
  const [intel, setIntel] = useState<number>(0);
  const [pr, setPr] = useState<number>(0); // 0 (Hostile) to 100 (Beloved)
  
  // Navigation & Logs
  const [activeTab, setActiveTab] = useState<'map' | 'roster' | 'hq' | 'missions' | 'logs'>('map');
  const [turnCounter, setTurnCounter] = useState<number>(1);
  const [logsList, setLogsList] = useState<string[]>(['Operational transmission lines established. Welcome under control terminal.']);

  // Modals / Transitions Focus
  const [activeCombatMission, setActiveCombatMission] = useState<Mission | null>(null);
  const [currentEvent, setCurrentEvent] = useState<CampaignEvent | null>(null);
  const [resolvedEventText, setResolvedEventText] = useState<string | null>(null);
  
  // Victory Conditions Tracking
  const [campaignOutcome, setCampaignOutcome] = useState<'victory' | 'defeat' | null>(null);

  // Active Selected Character for Roster 3D Hologram
  const [selectedRosterCharId, setSelectedRosterCharId] = useState<string | null>(null);

  // Active Selected Territory for NYC Map interactive HUD
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | null>(null);

  // Character Territory Speech Bubble Taunt Tracking
  const [territoryTaunts, setTerritoryTaunts] = useState<Record<string, { characterId: string; quote: string; visible: boolean }>>({});

  const triggerManualTaunt = (charId: string, territoryId: string) => {
    setTerritoryTaunts(prev => ({
      ...prev,
      [territoryId]: {
        characterId: charId,
        quote: getRandomTaunt(charId),
        visible: true
      }
    }));
  };

  // Initialize Faction Specific Campaigns
  const handleSelectFaction = (faction: Faction, chosenDifficulty?: CampaignDifficulty) => {
    const difficultyToUse = chosenDifficulty || CampaignDifficulty.OPERATIVE;
    setDifficulty(difficultyToUse);
    setSelectedFaction(faction);
    setTurnCounter(1);
    
    // Starting rosters: Player only starts with a core team of 3 characters, has to recruit the remaining 3!
    let initialRoster: Character[] = [];
    if (faction === Faction.BOYS) {
      // Start as The Boys: Butcher, Hughie, MM ready. Frenchie, Kimiko, Starlight are locked.
      initialRoster = CHARACTER_DATABASE.filter(c => c.faction === Faction.BOYS);
      
      // Resource balances representing vigilantes starting light
      let startingCash = 1000;
      let startingV = 15;
      let startingIntel = 60;
      let startingPR = 20;

      if (difficultyToUse === CampaignDifficulty.RECRUIT) {
        startingCash = Math.round(startingCash * 1.5);
        startingV = Math.round(startingV * 1.5);
        startingIntel = Math.round(startingIntel * 1.5);
        startingPR = Math.min(100, Math.round(startingPR * 1.5));
      } else if (difficultyToUse === CampaignDifficulty.SUPE) {
        startingCash = Math.round(startingCash * 0.75);
        startingV = Math.round(startingV * 0.75);
        startingIntel = Math.round(startingIntel * 0.75);
        startingPR = Math.round(startingPR * 0.75);
      }

      setCash(startingCash);
      setCompoundV(startingV);
      setIntel(startingIntel);
      setPr(startingPR);
    } else {
      // Start as The Seven: Homelander, Black Noir, A-train ready. Maeve, Deep, Sister Sage locked.
      initialRoster = CHARACTER_DATABASE.filter(c => c.faction === Faction.SEVEN);
      
      // Resource balances representing Vought billionaire start
      let startingCash = 3500;
      let startingV = 60;
      let startingIntel = 15;
      let startingPR = 80;

      if (difficultyToUse === CampaignDifficulty.RECRUIT) {
        startingCash = Math.round(startingCash * 1.5);
        startingV = Math.round(startingV * 1.5);
        startingIntel = Math.round(startingIntel * 1.5);
        startingPR = Math.min(100, Math.round(startingPR * 1.5));
      } else if (difficultyToUse === CampaignDifficulty.SUPE) {
        startingCash = Math.round(startingCash * 0.75);
        startingV = Math.round(startingV * 0.75);
        startingIntel = Math.round(startingIntel * 0.75);
        startingPR = Math.round(startingPR * 0.75);
      }

      setCash(startingCash);
      setCompoundV(startingV);
      setIntel(startingIntel);
      setPr(startingPR);
    }

    setSelectedRosterCharId(faction === Faction.BOYS ? 'butcher' : 'homelander');
    setSelectedTerritoryId(faction === Faction.BOYS ? 'flatiron' : 'vought_tower');
    setRoster(initialRoster);
    setTerritories(SYSTEM_TERRITORIES.map(t => ({ ...t, stationedCharacterIds: [] })));
    setMissions(INITIAL_MISSIONS);
    
    addLog(`Campaign initialized as ${faction === Faction.BOYS ? 'The Boys Vigilantes' : 'The Seven Vought Elite'} under [${difficultyToUse}] protocol. Secure NYC!`);
  };

  const addLog = (msg: string) => {
    setLogsList(prev => [`Turn ${turnCounter}: ${msg}`, ...prev].slice(0, 35));
  };

  // Compute Total Campaign Control spectrum value
  // sum all territory controls. Value is between -100 (Fully Boys) and +100 (Fully Seven)
  const computeGlobalControlValue = () => {
    if (territories.length === 0) return 0;
    const sum = territories.reduce((acc, t) => acc + t.control, 0);
    return Math.round(sum / territories.length);
  };

  const globalStyle = selectedFaction === Faction.BOYS 
    ? {
        accent: 'text-red-500',
        bgAccent: 'bg-red-700',
        borderAccent: 'border-red-600',
        shadowAccent: 'shadow-red-950/20',
        factionTitle: 'The Boys Vigilante HQ',
        gradientTheme: 'from-black via-neutral-950 to-[#C50000]/15'
      }
    : {
        accent: 'text-blue-400',
        bgAccent: 'bg-blue-600',
        borderAccent: 'border-blue-600',
        shadowAccent: 'shadow-blue-950/20',
        factionTitle: 'Vought Executive Grid',
        gradientTheme: 'from-black via-slate-950 to-[#004182]/15'
      };

  // Station characters to territories to earn passive incomes
  const handleStationCharacter = (charId: string, territoryId: string | '') => {
    // Revoke from any current stationed territory first
    const updatedTerrit = territories.map(t => {
      let filtered = t.stationedCharacterIds.filter(id => id !== charId);
      if (t.id === territoryId) {
        filtered = [...filtered, charId];
      }
      return { ...t, stationedCharacterIds: filtered };
    });

    setTerritories(updatedTerrit);
    
    const char = roster.find(r => r.id === charId);
    if (char) {
      if (territoryId) {
        const targetTerr = territories.find(t => t.id === territoryId);
        addLog(`Stationed ${char.codename} to safeguard ${targetTerr?.name || 'safehouse'}.`);
        setTerritoryTaunts(prev => ({
          ...prev,
          [territoryId]: {
            characterId: charId,
            quote: getRandomTaunt(charId),
            visible: true
          }
        }));
      } else {
        addLog(`Withdrew ${char.codename} back to active operational reserve.`);
        setTerritoryTaunts(prev => {
          const nextTaunts = { ...prev };
          Object.keys(nextTaunts).forEach(key => {
            if (nextTaunts[key].characterId === charId) {
              delete nextTaunts[key];
            }
          });
          return nextTaunts;
        });
      }
    }
  };

  // End turn, run resource generation and random storytelling events triggers
  const executeNextTurnLoop = () => {
    const isBoys = selectedFaction === Faction.BOYS;
    let gainedCash = 0;
    let gainedV = 0;
    let gainedIntel = 0;
    let gainedPR = 0;

    // 1. Calculate resources based on stationed agents
    const nextTerritories = territories.map(t => {
      let boysStationed = t.stationedCharacterIds.filter(id => roster.find(r => r.id === id)?.faction === Faction.BOYS).length;
      let sevenStationed = t.stationedCharacterIds.filter(id => roster.find(r => r.id === id)?.faction === Faction.SEVEN).length;

      // Calculate shift rate
      let shift = (sevenStationed * 12) - (boysStationed * 12);
      
      // If enemies outnumber player or if player lacks coverage on SUPE difficulty
      if (difficulty === CampaignDifficulty.SUPE) {
        if (boysStationed === 0 && sevenStationed === 0) {
          // If player is BOYS, enemy (SEVEN) creeps in, shifting control positively (+6 points)
          // If player is SEVEN, enemy (BOYS) creeps in, shifting control negatively (-6 points)
          const encroachment = isBoys ? 6 : -6;
          shift += encroachment;
        } else {
          // Accelerated takeover for enemy when outnumbering player
          if (isBoys && sevenStationed > boysStationed) {
            shift = Math.round(shift * 1.5);
          } else if (!isBoys && boysStationed > sevenStationed) {
            shift = Math.round(shift * 1.5);
          }
        }
      } else if (difficulty === CampaignDifficulty.RECRUIT) {
        // Player gets a bonus capture rate!
        if (isBoys && boysStationed > sevenStationed) {
          shift = Math.round(shift * 1.4); // Captured 40% faster!
        } else if (!isBoys && sevenStationed > boysStationed) {
          shift = Math.round(shift * 1.4); // Captured 40% faster!
        }
      }

      let nextControl = Math.min(100, Math.max(-100, t.control + shift));

      // Standard base income from territory if we have control bias
      const controller = t.control > 0 ? Faction.SEVEN : Faction.BOYS;
      if (controller === selectedFaction) {
        gainedCash += t.baseIncome.cash;
        gainedV += t.baseIncome.compoundV;
        gainedIntel += t.baseIncome.intel;
        gainedPR += t.baseIncome.pr > 0 ? 5 : -2;
      }

      return {
        ...t,
        control: nextControl
      };
    });

    // 2. Adjust resource bars
    setCash(prev => prev + gainedCash);
    setCompoundV(prev => prev + gainedV);
    setIntel(prev => prev + gainedIntel);
    setPr(prev => Math.min(100, Math.max(0, prev + (gainedPR > 0 ? 8 : -4))));
    setTerritories(nextTerritories);
    
    // Level up alive heroes passively if they are stationed
    setRoster(prev => prev.map(char => {
      const isStationed = nextTerritories.some(t => t.stationedCharacterIds.includes(char.id));
      if (isStationed && char.currentHp > 0) {
        return {
          ...char,
          currentHp: Math.min(char.maxHp, char.currentHp + 25), // Heal while stationed
          xp: char.xp + 15
        };
      }
      return {
        ...char,
        currentHp: Math.min(char.maxHp, char.currentHp + 10) // Small base heal
      };
    }));

    // Trigger random event dilemma
    const randomEvent = CAMPAIGN_EVENTS[Math.floor(Math.random() * CAMPAIGN_EVENTS.length)];
    setCurrentEvent(randomEvent);

    setTurnCounter(prev => prev + 1);
    addLog(`Completed turn sequence. Earned passive streams: +${gainedCash} Cash, +{${gainedV}} Chemical Compound-V stocks.`);
  };

  // Apply Campaign Events Choice outcome
  const handleEventChoiceResolution = (outcomeText: string, applyStateCallback: (state: any) => any) => {
    setCurrentEvent(null);
    setResolvedEventText(outcomeText);

    // Run callback to update complex stats or resource scales
    setTimeout(() => {
      const modifiedState = applyStateCallback({
        cash,
        compoundV,
        intel,
        pr,
        roster,
        log: ''
      });

      setCash(modifiedState.cash);
      setCompoundV(modifiedState.compoundV);
      setIntel(modifiedState.intel);
      setPr(modifiedState.pr);
      if (modifiedState.roster) {
        setRoster(modifiedState.roster);
      }
      if (modifiedState.log) {
        addLog(modifiedState.log);
      }
    }, 100);
  };

  // Spend resources to unlock locked teammates (Progressive Roster mechanic)
  const isCharacterRecruited = (charId: string) => {
    // Initially we just define characters that are unlocked vs locked.
    // To implement simple recruitment, let's keep track of a "unlocked" state in array, 
    // but a cleaner way is characters are unlocked by level or direct cash spend!
    // Let's add a "recruited" id tracker.
  };

  // Recruit feature
  const [unlockedCharIds, setUnlockedCharIds] = useState<string[]>(['butcher', 'hughie', 'mm', 'homelander', 'atrain', 'blacknoir']);

  const recruitTeammate = (charId: string, cost: { cash: number; compoundV?: number; intel?: number }) => {
    if (cash < cost.cash || (cost.compoundV && compoundV < cost.compoundV) || (cost.intel && intel < cost.intel)) {
      addLog('Missing sufficient tactical funds or components!');
      return;
    }

    setCash(prev => prev - cost.cash);
    if (cost.compoundV) setCompoundV(prev => prev - cost.compoundV);
    if (cost.intel) setIntel(prev => prev - cost.intel);

    setUnlockedCharIds(prev => [...prev, charId]);
    const char = CHARACTER_DATABASE.find(c => c.id === charId);
    addLog(`CONFIRMED: Successfully recruited ${char?.codename} to the frontline squad!`);
  };

  // Spent resources at the HQ / BLACKMAIL tab
  const handleHqAction = (type: string) => {
    const isBoys = selectedFaction === Faction.BOYS;

    if (isBoys) {
      if (type === 'leak' && intel >= 40) {
        setIntel(prev => prev - 40);
        // Reduce Vought control across territories
        setTerritories(prev => prev.map(t => ({
          ...t,
          control: Math.max(-100, t.control - 22)
        })));
        addLog('Hacked Vought secure drives. Leaked high-definition blackmail folders, crushing corporate control.');
      } else if (type === 'temp_v' && cash >= 600 && compoundV >= 10) {
        setCash(prev => prev - 600);
        setCompoundV(prev => prev - 10);
        // Buff character stats
        setRoster(prev => prev.map(c => ({
          ...c,
          attack: c.attack + 5,
          maxHp: c.maxHp + 15
        })));
        addLog('Bought high-grade military Temp-V serums. Permanent stats increase applied across all Boys vigilantes.');
      } else if (type === 'pr_blitz' && intel >= 30) {
        setIntel(prev => prev - 30);
        setPr(prev => Math.min(100, prev + 25));
        addLog('Launched organic street-level resistance broadcast across Manhattan. Support rating grew.');
      } else {
        addLog('Lacking adequate raw materials for HQ operation.');
      }
    } else {
      // Seven operations
      if (type === 'pr_blitz' && cash >= 1000) {
        setCash(prev => prev - 1000);
        setPr(prev => Math.min(100, prev + 25));
        addLog('Scheduled a highly commercial global press gala. Stock valuation surged.');
      } else if (type === 'synthesis' && pr >= 30) {
        setPr(prev => Math.max(0, prev - 30));
        setCompoundV(prev => prev + 35);
        addLog('Reallocated public funding into private chemical development. Synthesized +35 Compound V.');
      } else if (type === 'lockdown' && intel >= 35) {
        setIntel(prev => prev - 35);
        setTerritories(prev => prev.map(t => ({
          ...t,
          control: Math.min(100, t.control + 25)
        })));
        addLog('Unleashed fully militarized satellite sweeps. Restored raw Vought order across all districts.');
      } else {
        addLog('Missing corporate funds or public ratings approval.');
      }
    }
  };

  // Launch a Tactical Active Battle
  const handleLaunchCombat = (mission: Mission) => {
    // Verify player has living squad members to dispatch
    const livingFighters = roster
      .filter(char => char.faction === selectedFaction && unlockedCharIds.includes(char.id))
      .filter(char => char.currentHp > 40);

    if (livingFighters.length === 0) {
      addLog('❌ CANNOT ATTACK: All available roster heroes are critically injured! Rest them stationed on safehouses to heal.');
      return;
    }

    addLog(`COMMENCING COMBAT SQUAD ENGAGEMENT: Dispatching tactical units into ${mission.name}...`);
    setActiveCombatMission(mission);
  };

  // Combat completion resolution handler
  const handleCombatFinished = (victory: boolean, survivalState: Character[]) => {
    if (!activeCombatMission) return;

    // Apply outcome effects
    if (victory) {
      // Reward scale
      const rewards = activeCombatMission.reward;
      if (rewards.cash) setCash(prev => prev + rewards.cash);
      if (rewards.compoundV) setCompoundV(prev => prev + rewards.compoundV);
      if (rewards.intel) setIntel(prev => prev + rewards.intel);
      if (rewards.pr) setPr(prev => Math.min(100, Math.max(0, prev + (rewards.pr || 0))));

      // Apply territory control bonus shift weight
      const bonus = rewards.controlBonus || 0;
      setTerritories(prev => prev.map(t => {
        if (t.id === activeCombatMission.territoryId) {
          return {
            ...t,
            control: Math.min(100, Math.max(-100, t.control + bonus))
          };
        }
        return t;
      }));

      addLog(`🏆 VICTORY in ${activeCombatMission.name}! Received: +${rewards.cash || 0} Cash, +{${rewards.compoundV || 0}} V-vials. Control shifted!`);
    } else {
      addLog(`💀 DEFEAT in ${activeCombatMission.name}. Hostile defenders pushed your units back.`);
    }

    // Merge survival health states back to primary roster
    setRoster(prev => prev.map(originalChar => {
      const match = survivalState.find(sc => sc.id === originalChar.id);
      return match ? { ...originalChar, currentHp: match.currentHp } : originalChar;
    }));

    setActiveCombatMission(null);

    // Evaluate potential overarching campaign winner
    setTimeout(() => {
      evaluateWinnerConditions();
    }, 600);
  };

  const evaluateWinnerConditions = () => {
    // Calculate global control
    const currentControl = computeGlobalControlValue();
    if (currentControl <= -90) {
      // Boys dominate
      setCampaignOutcome(selectedFaction === Faction.BOYS ? 'victory' : 'defeat');
    } else if (currentControl >= 90) {
      // Seven dominate
      setCampaignOutcome(selectedFaction === Faction.SEVEN ? 'victory' : 'defeat');
    }
  };

  // Level Up individual heroes
  const triggerLevelUp = (charId: string) => {
    const cost = 800;
    if (cash < cost) {
      addLog('Insufficient cash capital to pay for training regiments!');
      return;
    }

    setCash(prev => prev - cost);
    setRoster(prev => prev.map(char => {
      if (char.id === charId) {
        return {
          ...char,
          level: char.level + 1,
          attack: char.attack + 6,
          defense: char.defense + 3,
          maxHp: char.maxHp + 25,
          currentHp: Math.min(char.maxHp + 25, char.currentHp + 25)
        };
      }
      return char;
    }));

    const matchObj = roster.find(r => r.id === charId);
    addLog(`CONFIRMED: Upgraded ${matchObj?.codename} to Level ${matchObj ? matchObj.level + 1 : 2}! Raw stats amplified.`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between font-sans relative overflow-x-hidden">
      
      {/* Absolute Ambient Backglow */}
      {selectedFaction && (
        <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
          <div 
            className="absolute top-0 left-0 w-full h-full" 
            style={{ 
              background: selectedFaction === Faction.BOYS 
                ? "radial-gradient(circle at 10% 20%, #C50000 0%, transparent 45%), radial-gradient(circle at 90% 80%, #C50000 0%, transparent 45%)" 
                : "radial-gradient(circle at 10% 20%, #004182 0%, transparent 45%), radial-gradient(circle at 90% 80%, #004182 0%, transparent 45%)"
            }} 
          />
        </div>
      )}

      {/* 1. INITIAL ALLIANCE SELECTION PORTAL */}
      {!selectedFaction && (
        <FactionSelector onSelectFaction={handleSelectFaction} />
      )}

      {selectedFaction && (
        <div className="flex-1 flex flex-col z-10 relative">
          {/* Header Dashboard Nav Bar */}
          <header className={`bg-gradient-to-r ${globalStyle.gradientTheme} border-b border-white/10 px-4 sm:px-8 py-4`}>
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              
              {/* Branding and Turn Panel */}
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-none border-2 font-black ${selectedFaction === Faction.BOYS ? 'bg-red-950/20 border-red-650 text-red-500' : 'bg-blue-950/20 border-blue-650 text-blue-400'}`}>
                  {selectedFaction === Faction.BOYS ? <Skull size={22} /> : <Shield size={22} />}
                </div>
                <div>
                  <h1 className="text-xl font-display font-black uppercase italic tracking-tighter text-white">
                    {globalStyle.factionTitle}
                  </h1>
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] block">
                    NYC STRUGGLE FOR CONTROL // SEASON WAR
                  </span>
                </div>
              </div>

              {/* Status and Resources panel */}
              <div className="flex flex-wrap gap-4 items-center bg-black/80 p-3 rounded-none border border-white/10 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 border-r border-white/10 pr-2">
                  <Activity size={13} className={difficulty === CampaignDifficulty.SUPE ? "text-red-500 animate-pulse" : (difficulty === CampaignDifficulty.RECRUIT ? "text-emerald-400" : "text-blue-400")} />
                  <div className="font-mono">
                    <span className="text-[9px] text-white/40 block leading-none font-bold uppercase tracking-wider">THREAT LEVEL</span>
                    <strong className={`text-[10px] font-black uppercase ${difficulty === CampaignDifficulty.SUPE ? "text-red-500" : (difficulty === CampaignDifficulty.RECRUIT ? "text-emerald-400" : "text-blue-400")}`}>
                      {difficulty === CampaignDifficulty.SUPE ? "SUPE THREAT" : (difficulty === CampaignDifficulty.RECRUIT ? "RECRUIT" : "OPERATIVE")}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <DollarSign size={13} className="text-red-500" />
                  <div className="font-mono">
                    <span className="text-[9px] text-white/40 block leading-none font-bold uppercase tracking-wider">CASH</span>
                    <strong className="text-xs text-white">${cash}</strong>
                  </div>
                </div>

                <div className="h-6 w-[1px] bg-white/10" />

                <div className="flex items-center gap-1.5">
                  <Database size={13} className="text-blue-400" />
                  <div className="font-mono">
                    <span className="text-[9px] text-white/40 block leading-none font-bold uppercase tracking-wider">COMPOUND-V</span>
                    <strong className="text-xs text-blue-400">{compoundV} u</strong>
                  </div>
                </div>

                <div className="h-6 w-[1px] bg-white/10" />

                <div className="flex items-center gap-1.5">
                  <Brain size={13} className="text-slate-400" />
                  <div className="font-mono">
                    <span className="text-[9px] text-white/40 block leading-none font-bold uppercase tracking-wider">INTEL</span>
                    <strong className="text-xs text-slate-300">{intel} files</strong>
                  </div>
                </div>

                <div className="h-6 w-[1px] bg-white/10" />

                <div className="flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-red-500" />
                  <div className="font-mono">
                    <span className="text-[9px] text-white/40 block leading-none font-bold uppercase tracking-wider">CONTROL INDEX</span>
                    <strong className="text-xs text-red-500">{pr}% Approval</strong>
                  </div>
                </div>
              </div>

              {/* End turn button */}
              <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="text-right hidden md:block">
                  <span className="text-[9px] text-white/40 font-mono block tracking-wider uppercase">TURN CYCLE</span>
                  <span className="text-xs font-black text-white uppercase italic">Phase {turnCounter}</span>
                </div>
                
                <button
                  onClick={executeNextTurnLoop}
                  className={`w-full sm:w-auto py-3 px-6 rounded-none font-mono font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border hover:bg-white hover:text-black ${selectedFaction === Faction.BOYS ? 'bg-[#C50000] text-white border-[#C50000] hover:border-white' : 'bg-[#004182] text-white border-[#004182] hover:border-white'}`}
                >
                  <RefreshCw size={13} className="animate-spin duration-3000" style={{ animationDuration: '3s' }} />
                  <span>Cycle Turn</span>
                </button>
              </div>

            </div>
          </header>

          {/* COMBAT OVERLAY ACTIVE OR STANDARD MAP FLOW */}
          {activeCombatMission ? (
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
              <BattleScreen
                playerFaction={selectedFaction}
                playerTeam={roster.filter(c => c.faction === selectedFaction && unlockedCharIds.includes(c.id))}
                enemyIds={activeCombatMission.enemyTeam}
                allCharacters={CHARACTER_DATABASE}
                onBattleEnd={handleCombatFinished}
                missionName={activeCombatMission.name}
                rewards={activeCombatMission.reward}
                difficulty={difficulty}
              />
            </main>
          ) : (
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">

              {/* NYC Map Spectrum Slider Balance Header */}
              <div className="bg-black/40 p-6 rounded-none border border-white/10 mb-2 z-10 relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-red-500" />
                    <span className="text-xs font-display font-black uppercase tracking-[0.1em] text-white">
                      SPECTRAL STATUS: NYC METROPOLITAN CONTROL
                    </span>
                  </div>
                  <div className="text-xs font-black font-mono uppercase tracking-wider text-[11px]">
                    Status: {computeGlobalControlValue() < -20 
                      ? <span className="text-red-500">Boys Vigilantes Infiltration</span> 
                      : computeGlobalControlValue() > 20 
                        ? <span className="text-blue-400">Vought Corporate Lockdown</span> 
                        : <span className="text-white/60">Contested Grid</span>
                    } ({computeGlobalControlValue()}%)
                  </div>
                </div>

                {/* Control weight colored track */}
                <div className="relative w-full h-3 bg-neutral-900 rounded-none overflow-hidden border border-white/10">
                  {/* Left (Boys faction colored bar) */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-[#C50000]"
                    style={{ width: `${Math.max(0, -computeGlobalControlValue())}%`, left: '0%' }}
                  />
                  {/* Right (Seven faction colored bar) */}
                  <div 
                    className="absolute top-0 bottom-0 bg-[#004182]"
                    style={{ width: `${Math.max(0, computeGlobalControlValue())}%`, right: '0%' }}
                  />
                  
                  {/* Anchor Center marker */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/30 -translate-x-1/2" />
                </div>
                
                <div className="flex justify-between text-[9px] font-mono text-white/40 mt-2 uppercase tracking-tight">
                  <span className="font-bold text-red-500">100% Boys Dominance (Vigilante Victory)</span>
                  <span className="hidden sm:inline">Contested Balance</span>
                  <span className="font-bold text-blue-500 text-right">100% Vought Dominance (Corporate Victory)</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="flex flex-wrap gap-2 border-b border-white/10 pb-3 z-10 relative">
                <button
                  onClick={() => setActiveTab('map')}
                  className={`px-4 py-3 text-xs font-mono font-black uppercase rounded-none tracking-[0.1em] flex items-center gap-2 transition-all border ${activeTab === 'map' ? `${selectedFaction === Faction.BOYS ? 'bg-[#C50000]' : 'bg-[#004182]'} text-white border-white/25 shadow-lg` : 'bg-black/40 text-slate-400 border-white/5 hover:text-white hover:border-white/20'}`}
                >
                  <MapIcon size={14} /> NYC Map & Safehouses
                </button>

                <button
                  onClick={() => setActiveTab('roster')}
                  className={`px-4 py-3 text-xs font-mono font-black uppercase rounded-none tracking-[0.1em] flex items-center gap-2 transition-all border ${activeTab === 'roster' ? `${selectedFaction === Faction.BOYS ? 'bg-[#C50000]' : 'bg-[#004182]'} text-white border-white/25 shadow-lg` : 'bg-black/40 text-slate-400 border-white/5 hover:text-white hover:border-white/20'}`}
                >
                  <Users size={14} /> Squad Roster {`(${roster.filter(c => c.faction === selectedFaction && unlockedCharIds.includes(c.id)).length}/6)`}
                </button>

                <button
                  onClick={() => setActiveTab('hq')}
                  className={`px-4 py-3 text-xs font-mono font-black uppercase rounded-none tracking-[0.1em] flex items-center gap-2 transition-all border ${activeTab === 'hq' ? `${selectedFaction === Faction.BOYS ? 'bg-[#C50000]' : 'bg-[#004182]'} text-white border-white/25 shadow-lg` : 'bg-black/40 text-slate-400 border-white/5 hover:text-white hover:border-white/20'}`}
                >
                  <Compass size={14} />
                  {selectedFaction === Faction.BOYS ? 'Vigilante Tech & Leaks' : 'Vought Initiatives'}
                </button>

                <button
                  onClick={() => setActiveTab('missions')}
                  className={`px-4 py-3 text-xs font-mono font-black uppercase rounded-none tracking-[0.1em] flex items-center gap-2 transition-all border ${activeTab === 'missions' ? `${selectedFaction === Faction.BOYS ? 'bg-[#C50000]' : 'bg-[#004182]'} text-white border-white/25 shadow-lg` : 'bg-black/40 text-slate-400 border-white/5 hover:text-white hover:border-white/20'}`}
                >
                  <Swords size={14} /> Tactical Missions
                </button>

                <button
                  onClick={() => setActiveTab('logs')}
                  className={`px-4 py-3 text-xs font-mono font-black uppercase rounded-none tracking-[0.1em] flex items-center gap-2 transition-all border ${activeTab === 'logs' ? `${selectedFaction === Faction.BOYS ? 'bg-[#C50000]' : 'bg-[#004182]'} text-white border-white/25 shadow-lg` : 'bg-black/40 text-slate-400 border-white/5 hover:text-white hover:border-white/20'}`}
                >
                  <Activity size={14} /> Log Files
                </button>

                <button
                  onClick={() => setSelectedFaction(null)}
                  className="ml-auto px-4 py-3 text-xs font-mono font-black uppercase rounded-none tracking-[0.1.5em] flex items-center gap-2 bg-red-950/20 text-red-500 hover:bg-red-900/45 border border-red-900/20 hover:border-red-500/30 transition-all"
                >
                  <LogOut size={13} /> Change alliance
                </button>
              </nav>

              {/* MAIN CONTENT BLOCK RESOLVERS */}
                     {/* TAB 1: NYC MAP AND SAFEHOUSE MANAGEMENT WITH 3D HUD AND VISUAL DISPATCH */}
              {activeTab === 'map' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                  
                  {/* LEFT COLUMN: THE 3D TACTICAL TERMINAL RADAR HUD */}
                  {(() => {
                    const currentMapTerrId = selectedTerritoryId || (selectedFaction === Faction.BOYS ? 'flatiron' : 'vought_tower');
                    const selectedTerr = territories.find(t => t.id === currentMapTerrId) || territories[0];
                    const activeStationedMembers = roster.filter(r => selectedTerr.stationedCharacterIds.includes(r.id));
                    
                    // Determine which default local character to preview if unassigned
                    const defaultCharacters: Record<string, string> = {
                      vought_tower: 'homelander',
                      flatiron: 'butcher',
                      central_park: 'starlight',
                      brooklyn_docks: 'atrain',
                      times_square: 'blacknoir'
                    };
                    const displayCharId = activeStationedMembers.length > 0 
                      ? activeStationedMembers[0].id 
                      : (defaultCharacters[selectedTerr.id] || 'butcher');
                    
                    const charDataForHolo = CHARACTER_DATABASE.find(c => c.id === displayCharId);
                    
                    const controlLabel = selectedTerr.control < 0 
                      ? `${Math.abs(selectedTerr.control)}% Boys` 
                      : selectedTerr.control > 0 
                        ? `${selectedTerr.control}% Seven` 
                        : 'Contested';

                    return (
                      <div className="col-span-1 lg:col-span-5 bg-black/85 border border-white/10 p-6 rounded-none lg:sticky lg:top-6 shadow-2xl space-y-6">
                        <div className="border-b border-white/10 pb-4">
                          <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest block mb-1 flex items-center gap-1.5 animate-pulse">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                            📡 SECURE RADAR STATION FEED // HUD SCANNER
                          </span>
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-display font-black text-white uppercase italic tracking-tight">
                              {selectedTerr.name}
                            </h3>
                          </div>
                          <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest block mt-1">
                            COORDINATES: {selectedTerr.id.toUpperCase()} SECTOR
                          </span>
                        </div>

                        {/* Interactive 3D Canvas Box or Security Feed */}
                        <div className="relative border border-white/10 bg-[#04040a] p-1">
                          
                          {/* Live 3D Model */}
                          <div className="w-full h-80 relative overflow-hidden bg-black/60">
                            {charDataForHolo && (
                              <Character3DModel characterId={charDataForHolo.id} className="w-full h-full opacity-90" />
                            )}
                            
                            {/* Scanning horizontal line */}
                            <div className="absolute inset-x-0 w-full h-[1px] bg-sky-500 shadow-[0_0_10px_#0ea5e9] animate-[bounce_3s_infinite] pointer-events-none" />
                            
                            {/* Cyber HUD Overlays */}
                            <div className="absolute inset-0 border border-white/5 flex flex-col justify-between p-3.5 pointer-events-none">
                              {/* Top status */}
                              <div className="flex justify-between items-start">
                                <span className="text-[8px] font-mono text-emerald-400 bg-black/80 px-2 py-0.5 border border-emerald-500/20 uppercase tracking-widest font-bold animate-pulse">
                                  {activeStationedMembers.length > 0 ? 'DEFENDER ACTIVE' : 'PREVIEWING SECTOR LANDMARK'}
                                </span>
                                <span className="text-[7.5px] font-mono text-white/30 tracking-wider">
                                  AZIMUTH 345.9° // CAM_08
                                </span>
                              </div>

                              {/* Corner scanning grid decorations */}
                              <div className="flex justify-between text-white/20 font-mono text-[9px] select-none">
                                <span>[L-GRID]</span>
                                <span>[R-SYS]</span>
                              </div>

                              {/* Bottom Details HUD overlay */}
                              <div className="bg-black/85 border border-white/10 p-2 font-mono text-[9px] uppercase tracking-normal space-y-1.5">
                                <div className="text-white font-bold flex justify-between">
                                  <span>FEED OPERATIONAL:</span>
                                  <span className="text-blue-400 font-extrabold">{charDataForHolo?.codename || 'CLASSIFIED'}</span>
                                </div>
                                {activeStationedMembers.length > 0 ? (
                                  <div className="text-zinc-400 text-[8px] flex justify-between">
                                    <span>HP STATUS:</span>
                                    <span className="text-emerald-400 font-bold">{activeStationedMembers[0].currentHp}/{activeStationedMembers[0].maxHp} HP</span>
                                  </div>
                                ) : (
                                  <div className="text-red-500 text-[8px] font-bold blink leading-none animate-pulse">
                                    🚨 WARNING: SECTOR VACANT — NO DEPLOYED ALLIED GUARD
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Orbit rotate guidance */}
                          <p className="text-[7.5px] text-center font-mono text-white/30 uppercase tracking-wider mt-1.5">
                            DRAG MOUSE OR SWIPE TO ROTATE THE TACTICAL 3D FEED HOLOGRAM
                          </p>
                        </div>

                        {/* Detailed Description */}
                        <div>
                          <p className="text-[11px] text-zinc-300 font-sans uppercase tracking-tight leading-relaxed">
                            {selectedTerr.description}
                          </p>
                        </div>

                        {/* Passive yielded resources indicator inside HUD */}
                        <div className="bg-neutral-950 border border-white/5 p-4 rounded-none space-y-3 uppercase font-mono">
                          <span className="text-[8.5px] text-amber-500 uppercase tracking-widest block font-bold border-b border-white/5 pb-1">
                            RESOURCE SUPPORT FEED (YIELDS):
                          </span>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/60 p-2 border border-white/5 text-center">
                              <span className="text-[8px] text-white/40 block">CASH REVENUE</span>
                              <strong className="text-sm text-emerald-400 font-black">+${selectedTerr.baseIncome.cash}</strong>
                              <span className="text-[7px] text-white/20 block">/ cycle</span>
                            </div>
                            <div className="bg-black/60 p-2 border border-white/5 text-center">
                              <span className="text-[8px] text-white/40 block">COMPOUND V</span>
                              <strong className="text-sm text-purple-400 font-black">+{selectedTerr.baseIncome.compoundV} V</strong>
                              <span className="text-[7px] text-white/20 block">/ cycle</span>
                            </div>
                            <div className="bg-black/60 p-2 border border-white/5 text-center col-span-2">
                              <span className="text-[8px] text-white/40 block">INTEL DATA DEPOSIT</span>
                              <strong className="text-xs text-slate-350 font-black">+{selectedTerr.baseIncome.intel} FILES / cycle</strong>
                            </div>
                          </div>
                        </div>

                        {/* Stationed Guard Speech/Taunt bubble inside HUD */}
                        {activeStationedMembers.length > 0 && (
                          <div className="bg-black/40 border border-white/15 p-3 rounded-none relative">
                            {(() => {
                              const char = activeStationedMembers[0];
                              const activeTaunt = territoryTaunts[selectedTerr.id];
                              return (
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest font-black">
                                      📢 DEPLOYED AGENT VOCAL LOGS:
                                    </span>
                                    <button 
                                      onClick={() => triggerManualTaunt(char.id, selectedTerr.id)}
                                      className="text-[9px] text-white/40 hover:text-white transition-all p-1 cursor-pointer flex items-center gap-1 bg-black border border-white/10"
                                      title="Trigger next quote"
                                    >
                                      <RefreshCw size={8} className="hover:rotate-180 transition-transform duration-350" />
                                      <span>NEXT TRANSMISSION</span>
                                    </button>
                                  </div>
                                  <p className="text-[11.5px] italic text-zinc-100 font-sans leading-relaxed uppercase tracking-tight">
                                    "{activeTaunt?.quote || getRandomTaunt(char.id)}"
                                  </p>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                        
                        {/* Withdraw button inside HUD */}
                        {activeStationedMembers.length > 0 && (
                          <button
                            onClick={() => handleStationCharacter(activeStationedMembers[0].id, '')}
                            className="w-full py-3 text-xs font-mono font-black text-red-500 bg-red-950/20 border border-red-500/20 hover:border-red-500 hover:bg-red-900 hover:text-white transition-all cursor-pointer uppercase tracking-widest"
                          >
                            Withdraw {activeStationedMembers[0].codename} Back to Reserves
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* RIGHT COLUMN: INTERACTIVE SECTOR LIST & CUSTOM DISPATCH DECKS */}
                  <div className="col-span-1 lg:col-span-7 space-y-6">
                    <div className="flex justify-between items-center mb-1 border-b border-white/5 pb-2">
                      <h3 className="text-xs font-mono font-black uppercase text-white tracking-[0.2em]">
                        NYC District Factional Sectors
                      </h3>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase font-black">
                        5 LOCATIONS IDENTIFIED
                      </span>
                    </div>

                    <div className="space-y-5">
                      {territories.map((t) => {
                        const isSelected = selectedTerritoryId === t.id || (!selectedTerritoryId && t.id === (selectedFaction === Faction.BOYS ? 'flatiron' : 'vought_tower'));
                        const controlLabel = t.control < 0 
                          ? `${Math.abs(t.control)}% Boys` 
                          : t.control > 0 
                            ? `${t.control}% Seven` 
                            : 'Contested';
                        const activeStationedMembers = roster.filter(r => t.stationedCharacterIds.includes(r.id));
                        
                        // Faction support rating tags
                        const isWeDominant = (selectedFaction === Faction.BOYS && t.control < 0) || (selectedFaction === Faction.SEVEN && t.control > 0);
                        const isSecure = Math.abs(t.control) >= 50;

                        return (
                          <div 
                            key={t.id} 
                            onClick={() => setSelectedTerritoryId(t.id)}
                            className={`relative bg-black/60 rounded-none p-5 border transition-all duration-300 flex flex-col justify-between shadow-lg cursor-pointer ${isSelected ? 'border-amber-500 ring-1 ring-amber-500/30 shadow-amber-950/20' : 'border-white/10 hover:border-white/30'}`}
                          >
                            <div>
                              {/* District Name */}
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-widest block mb-0.5">METROPOLITAN SECTOR</span>
                                  <h3 className="text-md font-display font-black uppercase tracking-tight text-white leading-tight">
                                    {t.name}
                                  </h3>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <span className={`px-2 py-0.5 rounded-none text-[8px] font-mono leading-none tracking-widest font-bold uppercase border ${t.control < -25 ? 'bg-red-950/30 text-red-500 border-red-500/20' : t.control > 25 ? 'bg-blue-950/30 text-blue-400 border-blue-500/20' : 'bg-neutral-900 text-neutral-400 border-white/5'}`}>
                                    {controlLabel}
                                  </span>
                                  <span className="text-[7.5px] font-mono uppercase text-zinc-500">
                                    {isSecure ? '🛡️ HOST SECURE' : isWeDominant ? '📈 INFLUENCE UP' : '⚠️ HIGH RISK'}
                                  </span>
                                </div>
                              </div>

                              {/* Sector Control Bar */}
                              <div className="relative w-full h-1.5 bg-neutral-950 text-xs mb-4">
                                <div 
                                  className="absolute left-0 top-0 bottom-0 bg-[#C50000]"
                                  style={{ width: `${Math.max(0, -t.control)}%` }}
                                />
                                <div 
                                  className="absolute right-0 top-0 bottom-0 bg-[#004182]"
                                  style={{ width: `${Math.max(0, t.control)}%` }}
                                />
                                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/20 -translate-x-1/2" />
                              </div>

                              {/* Static display of currently guarding agent */}
                              <div className="border-t border-white/5 pt-3 mb-4 flex justify-between items-center">
                                <span className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
                                  DEPLOYED DEFENDER STATUS:
                                </span>
                                {activeStationedMembers.length > 0 ? (
                                  <div className="flex items-center gap-2 bg-[#10b981]/5 px-2 py-1 border border-emerald-500/20 animate-fade-in text-[10px]">
                                    <div className={`w-4 h-4 rounded-none ${activeStationedMembers[0].avatar} border border-white/20 flex items-center justify-center overflow-hidden shrink-0`}>
                                      <CharacterAvatar id={activeStationedMembers[0].id} size="xs" />
                                    </div>
                                    <span className="text-white font-mono font-black">{activeStationedMembers[0].codename.toUpperCase()} (LEVEL {activeStationedMembers[0].level})</span>
                                  </div>
                                ) : (
                                  <span className="text-[9px] font-mono text-amber-500 font-extrabold animate-pulse uppercase tracking-widest bg-amber-500/5 border border-amber-500/25 px-2 py-0.5">
                                    ⚠️ VACANT
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* TACTICAL DISPATCH STATION DECK - CLICK TO DEPLOY DIRECTLY! */}
                            <div className="bg-black/95 border border-white/5 p-3 rounded-none">
                              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-2.5">
                                ⚔️ TACTICAL FORCE DISPATCH DECK (TAP AVIATOR PORTRAIT TO DEPLOY):
                              </span>

                              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {roster
                                  .filter(r => r.faction === selectedFaction && unlockedCharIds.includes(r.id))
                                  .map(char => {
                                    const isDeployHere = t.stationedCharacterIds.includes(char.id);
                                    const isDeployElsewhere = territories.some(ot => ot.id !== t.id && ot.stationedCharacterIds.includes(char.id));
                                    const isDead = char.currentHp <= 0;

                                    return (
                                      <div 
                                        key={char.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (isDead) return;
                                          if (isDeployHere) {
                                            // Withdraw
                                            handleStationCharacter(char.id, '');
                                          } else {
                                            // Deploy here
                                            handleStationCharacter(char.id, t.id);
                                          }
                                        }}
                                        className={`p-1.5 border rounded-none flex flex-col items-center justify-between transition-all relative group cursor-pointer ${
                                          isDead 
                                            ? 'bg-red-950/10 border-red-900/10 opacity-30 cursor-not-allowed'
                                            : isDeployHere
                                              ? 'bg-emerald-950/20 border-emerald-500/80 ring-1 ring-emerald-500/30'
                                              : isDeployElsewhere
                                                ? 'bg-amber-950/10 border-amber-500/40 opacity-70 hover:opacity-100'
                                                : 'bg-neutral-900 border-white/10 hover:border-white/40'
                                        }`}
                                      >
                                        <div className={`w-8 h-8 rounded-none border border-white/20 ${char.avatar} flex items-center justify-center overflow-hidden mb-1`}>
                                          <CharacterAvatar id={char.id} size="sm" />
                                        </div>

                                        {/* HP Mini-indicator */}
                                        <div className="w-full bg-neutral-950 h-1 mb-1">
                                          <div className="bg-red-500 h-full" style={{ width: `${(char.currentHp / char.maxHp) * 100}%` }} />
                                        </div>

                                        <span className="text-[7.5px] font-mono font-bold text-white truncate max-w-full uppercase text-center leading-tight">
                                          {char.codename}
                                        </span>

                                        {/* Status badge Overlay */}
                                        {isDead ? (
                                          <div className="absolute inset-0 bg-red-950/80 flex items-center justify-center font-mono text-[6.5px] font-black text-red-500 uppercase select-none text-center leading-none">
                                            IN RECOVERY
                                          </div>
                                        ) : isDeployHere ? (
                                          <div className="absolute -top-1 -right-1 bg-emerald-500 text-black font-black text-[6px] h-3 w-3 flex items-center justify-center rounded-none shadow-md">
                                            ✓
                                          </div>
                                        ) : isDeployElsewhere ? (
                                          <div className="absolute top-1 right-1 bg-amber-500/90 text-black font-semibold text-[5.5px] px-0.5 tracking-tighter uppercase leading-none rounded-none overflow-hidden scale-90">
                                            GUARDING
                                          </div>
                                        ) : null}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>

                            {/* Active territory pointer icon in visual terminal */}
                            {isSelected && (
                              <div className="absolute top-2 right-2 flex h-2.5 w-2.5 pointer-events-none">
                                <span className="animate-ping absolute inline-flex h-full w-full bg-amber-500 rounded-full opacity-75"></span>
                                <span className="relative inline-flex bg-amber-500 h-2.5 w-2.5"></span>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: ACTIVE SQUAD ROSTER AND PROGRESSIVE RECRUITMENT */}
              {activeTab === 'roster' && (
                <div className="space-y-6">
                  {/* Holographic Showroom & Selection splitscreen */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                    
                    {/* LEFT COLUMN: THE 3D TACTICAL PROJECTOR HUD */}
                    {(() => {
                      const currentProjectionCharId = selectedRosterCharId || (selectedFaction === Faction.BOYS ? 'butcher' : 'homelander');
                      const projectionChar = CHARACTER_DATABASE.find(c => c.id === currentProjectionCharId);
                      const isProjectionUnlocked = unlockedCharIds.includes(currentProjectionCharId);

                      return (
                        <div className="col-span-1 lg:col-span-5 bg-black/80 border border-white/10 p-6 rounded-none lg:sticky lg:top-6 shadow-2xl space-y-6">
                          <div className="border-b border-white/10 pb-4">
                            <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest block mb-1">
                              📡 TACTICAL HUD // 3D CHARACTER SHOWROOM
                            </span>
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-display font-black text-white uppercase italic tracking-tight">
                                {projectionChar?.name || 'UNKNOWN AGENT'}
                              </h3>
                              <span className={`px-2 py-0.5 font-mono text-[8.5px] uppercase font-black border ${isProjectionUnlocked ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                {isProjectionUnlocked ? 'READY FOR DISPATCH' : 'CONTRACT LOCKED'}
                              </span>
                            </div>
                            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest block mt-1">
                              CODENAME: {projectionChar?.codename || 'CLASSIFIED'}
                            </span>
                          </div>

                          {/* Interactive 3D Canvas Box */}
                          <div className="relative border border-white/10 bg-[#040409]">
                            {projectionChar && (
                              <Character3DModel characterId={projectionChar.id} className="w-full h-80" />
                            )}
                            
                            {/* Status overlays in visual HUD */}
                            <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5 pointer-events-none font-mono">
                              <span className="text-[7px] text-white bg-black/80 px-1 py-0.5 border border-white/5 uppercase">
                                ORBIT ROTATE ACTIVE (DRAG MOUSE)
                              </span>
                            </div>
                          </div>

                          {/* Character Bio Info */}
                          <div>
                            <p className="text-[11px] text-zinc-300 font-sans uppercase tracking-tight leading-relaxed">
                              {projectionChar?.description}
                            </p>
                          </div>

                          {/* Visual stats metrics bars */}
                          {projectionChar && (
                            <div className="bg-black/40 border border-white/5 p-4 rounded-none space-y-3.5">
                              <span className="text-[8.5px] font-mono text-amber-500 uppercase tracking-widest block font-bold border-b border-white/5 pb-1">
                                Operational Diagnostics:
                              </span>
                              
                              {/* HP */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-zinc-400 uppercase">
                                  <span>HP/VITALITY:</span>
                                  <strong className="text-white">{projectionChar.maxHp} HP</strong>
                                </div>
                                <div className="w-full h-1 bg-zinc-900 border border-white/5 rounded-none overflow-hidden">
                                  <div className="h-full bg-red-650" style={{ width: `${Math.min(100, (projectionChar.maxHp / 260) * 100)}%` }} />
                                </div>
                              </div>

                              {/* Attack */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-zinc-400 uppercase">
                                  <span>ATTACK POWER:</span>
                                  <strong className="text-white">{projectionChar.attack} AP</strong>
                                </div>
                                <div className="w-full h-1 bg-zinc-900 border border-white/5 rounded-none overflow-hidden">
                                  <div className="h-full bg-amber-500" style={{ width: `${(projectionChar.attack / 50) * 100}%` }} />
                                </div>
                              </div>

                              {/* Defense */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-zinc-400 uppercase">
                                  <span>DEFENSIVE MITIGATION:</span>
                                  <strong className="text-white">{projectionChar.defense} DM</strong>
                                </div>
                                <div className="w-full h-1 bg-zinc-900 border border-white/5 rounded-none overflow-hidden">
                                  <div className="h-full bg-indigo-500" style={{ width: `${(projectionChar.defense / 30) * 100}%` }} />
                                </div>
                              </div>

                              {/* Speed */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-zinc-400 uppercase">
                                  <span>COMBAT VELOCITY:</span>
                                  <strong className="text-white">{projectionChar.speed} VEL</strong>
                                </div>
                                <div className="w-full h-1 bg-zinc-900 border border-white/5 rounded-none overflow-hidden">
                                  <div className="h-full bg-sky-400" style={{ width: `${(projectionChar.speed / 40) * 100}%` }} />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Character Action Combat Skills preview */}
                          {projectionChar && (
                            <div className="space-y-2.5">
                              <span className="text-[8.5px] font-mono text-white/50 uppercase tracking-widest block font-bold">
                                Active Combat Battle Skills ({projectionChar.skills?.length || 0}):
                              </span>
                              <div className="space-y-2">
                                {projectionChar.skills?.map((skill) => (
                                  <div key={skill.name} className="bg-black/95 border border-white/10 p-3 rounded-none">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-wide">
                                        ⚔️ {skill.name}
                                      </span>
                                      <span className="text-[8px] font-mono px-1.5 py-0.5 bg-neutral-950 text-white/50 uppercase border border-white/5">
                                        DMG MULTIPLIER: x{skill.damageMultiplier || 1.0}
                                      </span>
                                    </div>
                                    <p className="text-[9.5px] text-zinc-450 uppercase tracking-tight leading-relaxed">
                                      {skill.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* RIGHT COLUMN: THE AGENT SELECTION LISTS AND CONTRACT DECK */}
                    <div className="col-span-1 lg:col-span-7 space-y-8">
                      {/* Active squad list */}
                      <div>
                        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                          <h3 className="text-xs font-mono font-black uppercase text-white tracking-[0.2em]">
                            Active Squad Roster
                          </h3>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase font-black">
                            {roster.filter(char => char.faction === selectedFaction && unlockedCharIds.includes(char.id)).length}/6 ACQUIRED
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {roster
                            .filter(char => char.faction === selectedFaction && unlockedCharIds.includes(char.id))
                            .map(char => {
                              const isStationed = territories.some(t => t.stationedCharacterIds.includes(char.id));
                              const isSelected = selectedRosterCharId === char.id || (!selectedRosterCharId && char.id === (selectedFaction === Faction.BOYS ? 'butcher' : 'homelander'));

                              return (
                                <div 
                                  key={char.id} 
                                  onClick={() => setSelectedRosterCharId(char.id)}
                                  className={`relative bg-black/60 border rounded-none p-5 flex flex-col justify-between hover:border-white transition-all duration-300 shadow-md cursor-pointer ${isSelected ? 'border-amber-500/70 ring-1 ring-amber-500/30 shadow-amber-950/20' : 'border-white/10'}`}
                                >
                                  <div>
                                    <div className="flex justify-between items-start mb-4">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-none border border-white/20 ${char.avatar} flex items-center justify-center overflow-hidden`}>
                                          <CharacterAvatar id={char.id} size="md" />
                                        </div>
                                        <div>
                                          <span className="text-[9px] text-white/40 font-mono block uppercase tracking-wider font-bold">
                                            Level {char.level} Operations
                                          </span>
                                          <h4 className="text-sm font-display font-black text-white italic uppercase tracking-tight">
                                            {char.codename}
                                          </h4>
                                        </div>
                                      </div>
                                      <span className={`px-2 py-0.5 rounded-none text-[8px] uppercase font-mono border ${isStationed ? 'bg-[#C50000]/10 text-red-500 border-red-500/10' : 'bg-black text-white/40 border-white/10'}`}>
                                        {isStationed ? 'GUARDING' : 'RESERVE'}
                                      </span>
                                    </div>

                                    {/* Small current HP indicator */}
                                    <div className="space-y-1.5 mb-4">
                                      <div className="flex justify-between text-[8px] font-mono text-white/50 uppercase tracking-wider">
                                        <span>Current Vitality:</span>
                                        <span className="font-bold">{char.currentHp} / {char.maxHp} HP</span>
                                      </div>
                                      <div className="w-full h-1 bg-neutral-900 rounded-none overflow-hidden">
                                        <div 
                                          className={`h-full ${char.currentHp < char.maxHp * 0.4 ? 'bg-red-650' : selectedFaction === Faction.BOYS ? 'bg-[#C50000]' : 'bg-[#004182]'}`} 
                                          style={{ width: `${Math.round((char.currentHp / char.maxHp) * 100)}%` }} 
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 pt-3 border-t border-white/5">
                                    <button
                                      type="button"
                                      disabled={cash < 800}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        triggerLevelUp(char.id);
                                      }}
                                      className={`w-full py-2.5 rounded-none font-mono text-[9px] uppercase font-black tracking-wider transition-all duration-200 border cursor-pointer ${cash >= 800 ? 'bg-white text-black border-white hover:bg-neutral-200' : 'bg-black text-white/20 border-white/5 cursor-not-allowed'}`}
                                    >
                                      Level Up Agent (-$800)
                                    </button>
                                  </div>

                                  {/* Visually active state marker */}
                                  {isSelected && (
                                    <div className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* Recruitment panel lock list */}
                      <div className="border-t border-white/10 pt-6">
                        <h3 className="text-xs font-mono font-black uppercase text-white/40 tracking-[0.2em] mb-4">
                          Incarcerated / Potential Recruits
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {CHARACTER_DATABASE
                            .filter(char => char.faction === selectedFaction && !unlockedCharIds.includes(char.id))
                            .map(char => {
                              const costMap: Record<string, { cash: number; compoundV?: number; intel?: number }> = {
                                kimiko: { cash: 1200, compoundV: 25 },
                                starlight: { cash: 1600, intel: 40 },
                                frenchie: { cash: 900, intel: 20 },
                                maeve: { cash: 2000, compoundV: 35 },
                                thedeep: { cash: 800, compoundV: 15 },
                                sagesister: { cash: 1500, intel: 45 }
                              };

                              const myCost = costMap[char.id] || { cash: 1000 };
                              const canAfford = cash >= myCost.cash && 
                                                (!myCost.compoundV || compoundV >= myCost.compoundV) && 
                                                (!myCost.intel || intel >= myCost.intel);
                              
                              const isSelected = selectedRosterCharId === char.id;

                              return (
                                <div 
                                  key={char.id} 
                                  onClick={() => setSelectedRosterCharId(char.id)}
                                  className={`relative bg-black/30 border border-dashed rounded-none p-5 flex flex-col justify-between hover:opacity-100 transition-all cursor-pointer ${isSelected ? 'border-amber-500/70 ring-1 ring-amber-500/30' : 'border-white/15 opacity-75'}`}
                                >
                                  <div>
                                    <div className="flex gap-3 items-center mb-4">
                                      <div className="w-8 h-8 rounded-none bg-neutral-900 border border-white/10 flex items-center justify-center font-bold text-xs text-white/40 uppercase tracking-widest font-mono">
                                        🔒
                                      </div>
                                      <div>
                                        <span className="text-[8.5px] font-mono text-red-500 block uppercase tracking-wide font-bold">RECRUITMENT CONTRACT</span>
                                        <h4 className="text-xs font-display font-black text-white uppercase italic tracking-tight">
                                          {char.codename}
                                        </h4>
                                      </div>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mb-4 uppercase tracking-normal leading-relaxed">
                                      {char.description}
                                    </p>
                                  </div>

                                  <div className="bg-black/95 p-3 rounded-none border border-white/5 mb-4 text-[9px] font-mono uppercase tracking-tight space-y-1">
                                    <span className="text-white/60 font-semibold mb-1 block">Contract Cost requirements:</span>
                                    <div className="flex justify-between">
                                      <span>Cash reserves:</span>
                                      <span className={cash >= myCost.cash ? 'text-emerald-400 font-bold' : 'text-red-500'}>
                                        ${myCost.cash} / ${cash}
                                      </span>
                                    </div>
                                    {myCost.compoundV && (
                                      <div className="flex justify-between">
                                        <span>V-barrels:</span>
                                        <span className={compoundV >= myCost.compoundV ? 'text-purple-400 font-bold' : 'text-red-500'}>
                                          {myCost.compoundV} / {compoundV} V
                                        </span>
                                      </div>
                                    )}
                                    {myCost.intel && (
                                      <div className="flex justify-between">
                                        <span>Intel Folders:</span>
                                        <span className={intel >= myCost.intel ? 'text-slate-300 font-bold' : 'text-red-500'}>
                                          {myCost.intel} / {intel} Files
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      recruitTeammate(char.id, myCost);
                                    }}
                                    disabled={!canAfford}
                                    className={`w-full py-2.5 rounded-none font-mono text-[9px] uppercase font-black tracking-[0.1em] text-center transition-all border cursor-pointer ${
                                      canAfford
                                        ? selectedFaction === Faction.BOYS 
                                          ? 'bg-[#C50000] text-white border-[#C50000] hover:bg-white hover:text-[#C50000]'
                                          : 'bg-[#004182] text-white border-[#004182] hover:bg-white hover:text-[#004182]'
                                        : 'bg-black text-white/20 border-white/5 cursor-not-allowed'
                                    }`}
                                  >
                                    Execute Recruit Contract
                                  </button>

                                  {/* Visually active state marker */}
                                  {isSelected && (
                                    <div className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: HQ ACTIONS (Blackmail leaks or PR corporate Synthesis) */}
              {activeTab === 'hq' && (
                <div className="max-w-4xl mx-auto space-y-8 z-10 relative">
                  <div className="text-center max-w-lg mx-auto">
                    <h3 className="text-xl font-display font-black uppercase text-white tracking-tight italic">
                      {selectedFaction === Faction.BOYS ? 'FLATIRON OPERATIONS COMMAND' : 'VOUGHT BOARDROOM CHAMBER'}
                    </h3>
                    <p className="text-xs text-slate-450 font-mono mt-2 uppercase tracking-tight">
                      Manipulate metropolitan approvals, synthesize super-serums, or execute mass network leaks.
                    </p>
                  </div>

                  {selectedFaction === Faction.BOYS ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Leak */}
                      <div className="bg-black/60 p-6 rounded-none border border-white/10 hover:border-white transition-all duration-300 flex flex-col justify-between shadow-md">
                        <div>
                          <span className="text-[9px] font-mono text-red-500 font-bold uppercase tracking-widest block mb-2">Blackmail Leaks</span>
                          <h4 className="font-display font-black text-base text-white uppercase tracking-tight mb-3">CONSPIRACY INFILTRATION</h4>
                          <p className="text-xs text-slate-400 leading-relaxed mb-6 uppercase tracking-tight">Expose stolen internal hard drives. Passive enemy hold slips across all Brooklyn and Queens safe sectors.</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-red-400 block mb-4 font-bold">COST: -40 INTEL FILES</span>
                          <button
                            disabled={intel < 40}
                            onClick={() => handleHqAction('leak')}
                            className={`w-full py-3 border rounded-none font-mono text-[10px] uppercase font-black tracking-wider text-center transition-all duration-200 cursor-pointer ${intel >= 40 ? 'bg-white text-black border-white hover:bg-neutral-200' : 'bg-black text-white/20 border-white/5 cursor-not-allowed'}`}
                          >
                            Execute Operations leak
                          </button>
                        </div>
                      </div>

                      {/* Buy Temp V */}
                      <div className="bg-black/60 p-6 rounded-none border border-white/10 hover:border-white transition-all duration-300 flex flex-col justify-between shadow-md">
                        <div>
                          <span className="text-[9px] font-mono text-red-500 font-bold uppercase tracking-widest block mb-2">Tactical Synthesis</span>
                          <h4 className="font-display font-black text-base text-white uppercase tracking-tight mb-3">ACQUIRE TEMP-V INJECTIONS</h4>
                          <p className="text-xs text-slate-400 leading-relaxed mb-6 uppercase tracking-tight">Equip vigilante fighters. Grants a permanent +5 Attack and +15 Max HP boost to all active squad members.</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-red-400 block mb-4 font-bold">COST: -$600 CASH & -10 V-BARRELS</span>
                          <button
                            disabled={cash < 600 || compoundV < 10}
                            onClick={() => handleHqAction('temp_v')}
                            className={`w-full py-3 border rounded-none font-mono text-[10px] uppercase font-black tracking-wider text-center transition-all duration-200 cursor-pointer ${cash >= 600 && compoundV >= 10 ? 'bg-white text-black border-white hover:bg-neutral-200' : 'bg-black text-white/20 border-white/5 cursor-not-allowed'}`}
                          >
                            Infuse Temp-V serums
                          </button>
                        </div>
                      </div>

                      {/* Organic PR Campaign */}
                      <div className="bg-black/60 p-6 rounded-none border border-white/10 hover:border-white transition-all duration-300 flex flex-col justify-between shadow-md">
                        <div>
                          <span className="text-[9px] font-mono text-red-500 font-bold uppercase tracking-widest block mb-1">Guerrilla Broadcast</span>
                          <h4 className="font-display font-black text-base text-white uppercase tracking-tight mb-3">STREET RESISTANCE BROADCAST</h4>
                          <p className="text-xs text-slate-400 leading-relaxed mb-6 uppercase tracking-tight">Publish raw collateral damage footage online to disrupt public alignment and skyrocket favor indexes.</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-red-400 block mb-4 font-bold">COST: -30 INTEL FILES</span>
                          <button
                            disabled={intel < 30}
                            onClick={() => handleHqAction('pr_blitz')}
                            className={`w-full py-3 border rounded-none font-mono text-[10px] uppercase font-black tracking-wider text-center transition-all duration-200 cursor-pointer ${intel >= 30 ? 'bg-white text-black border-white hover:bg-neutral-200' : 'bg-black text-white/20 border-white/5 cursor-not-allowed'}`}
                          >
                            Deploy Street Campaign
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Operational elements for The Seven (Vought Board)
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Media Blitz */}
                      <div className="bg-black/60 p-6 rounded-none border border-white/10 hover:border-white transition-all duration-300 flex flex-col justify-between shadow-md">
                        <div>
                          <span className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-widest block mb-2">Global Media Network</span>
                          <h4 className="font-display font-black text-base text-white uppercase tracking-tight mb-3">CORPORATE HOMELANDER LIVE</h4>
                          <p className="text-xs text-slate-400 leading-relaxed mb-6 uppercase tracking-tight">Purchase high-tier television blocks to display charismatic saves. Drastically resets public favor approval.</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-blue-400 block mb-4 font-bold">COST: -$1000 CASH</span>
                          <button
                            disabled={cash < 1000}
                            onClick={() => handleHqAction('pr_blitz')}
                            className={`w-full py-3 border rounded-none font-mono text-[10px] uppercase font-black tracking-wider text-center transition-all duration-200 cursor-pointer ${cash >= 1000 ? 'bg-white text-black border-white hover:bg-neutral-200' : 'bg-black text-white/20 border-white/5 cursor-not-allowed'}`}
                          >
                            Launch Media Gala
                          </button>
                        </div>
                      </div>

                      {/* Synthesis */}
                      <div className="bg-black/60 p-6 rounded-none border border-white/10 hover:border-white transition-all duration-300 flex flex-col justify-between shadow-md">
                        <div>
                          <span className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-widest block mb-2">Laboratory Division</span>
                          <h4 className="font-display font-black text-base text-white uppercase tracking-tight mb-3">EXTRACT COMPOUND-V BARRELS</h4>
                          <p className="text-xs text-slate-400 leading-relaxed mb-6 uppercase tracking-tight">Convert biological research grants directly into active field serums. Grants +35 Compound V immediately.</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-blue-400 block mb-4 font-bold">COST: -30 PUBLIC APPROVAL</span>
                          <button
                            disabled={pr < 30}
                            onClick={() => handleHqAction('synthesis')}
                            className={`w-full py-3 border rounded-none font-mono text-[10px] uppercase font-black tracking-wider text-center transition-all duration-200 cursor-pointer ${pr >= 30 ? 'bg-white text-black border-white hover:bg-neutral-200' : 'bg-black text-white/20 border-white/5 cursor-not-allowed'}`}
                          >
                            Synthesize Compound V
                          </button>
                        </div>
                      </div>

                      {/* Lockdown scanning */}
                      <div className="bg-black/60 p-6 rounded-none border border-white/10 hover:border-white transition-all duration-300 flex flex-col justify-between shadow-md font-sans">
                        <div>
                          <span className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-widest block mb-2">Tactical Surveillance</span>
                          <h4 className="font-display font-black text-base text-white uppercase tracking-tight mb-3">MILITARIZED ORBITAL LOCKDOWN</h4>
                          <p className="text-xs text-slate-400 leading-relaxed mb-6 uppercase tracking-tight">Authorize radar satellites to sweep metropolitan grids to uncover and stamp down rogue safehouse cells.</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-blue-400 block mb-4 font-bold">COST: -35 INTEL FILES</span>
                          <button
                            disabled={intel < 35}
                            onClick={() => handleHqAction('lockdown')}
                            className={`w-full py-3 border rounded-none font-mono text-[10px] uppercase font-black tracking-wider text-center transition-all duration-200 cursor-pointer ${intel >= 35 ? 'bg-white text-black border-white hover:bg-neutral-200' : 'bg-black text-white/20 border-white/5 cursor-not-allowed'}`}
                          >
                            Establish Security lockdown
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: COMBAT ACTIONS BOARD */}
              {activeTab === 'missions' && (
                <div className="space-y-6 z-10 relative">
                  <div className="bg-black/40 p-6 rounded-none border border-white/10 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="text-sm font-display font-black uppercase text-white tracking-widest italic">TACTICAL SKIRMISH MAP</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-lg uppercase tracking-tight">
                        Dispatch a strike squad to seize Manhattan control. <em className="text-red-500">Warning:</em> Active combatants participating must maintain health above 40 HP, otherwise rest them stationed on sectors.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {missions.map((m) => {
                      const targetTerritory = territories.find(t => t.id === m.territoryId);
                      
                      return (
                        <div key={m.id} className="bg-black/60 rounded-none p-6 border border-white/10 hover:border-white transition-all duration-300 flex flex-col justify-between shadow-lg">
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <span className={`text-[9.5px] uppercase font-mono font-black px-2 py-0.5 rounded-none mr-2 border ${m.dangerLevel === 'EXTREME' ? 'bg-red-950/40 text-red-500 border-red-500/30' : 'bg-neutral-900 text-neutral-400 border-white/5'}`}>
                                  {m.dangerLevel} THREAT DANGER
                                </span>
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                  Sector: {targetTerritory?.name || 'Infiltration Zone'}
                                </span>
                              </div>
                            </div>

                            <h4 className="text-lg font-display font-black text-white uppercase tracking-tight italic mb-3">
                              {m.name}
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6 uppercase tracking-tight">{m.description}</p>

                            {/* Threat info */}
                            <div className="bg-black/80 p-4 rounded-none mb-6 text-[10px] font-mono border border-white/10 uppercase tracking-tight">
                              <span className="text-white/40 block font-bold mb-2 uppercase tracking-widest">Hostile Defenders Spotted:</span>
                              <div className="flex gap-2 flex-wrap">
                                {m.enemyTeam.map(enemyId => {
                                  const dbMatch = CHARACTER_DATABASE.find(c => c.id === enemyId);
                                  return (
                                    <span key={enemyId} className="px-2.5 py-1 rounded-none bg-neutral-900 border border-white/10 text-white font-black">
                                      {dbMatch?.codename || enemyId}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center text-[10px] font-mono border-t border-white/10 pt-4 mb-4 text-white/50 uppercase tracking-wider">
                              <span>Mission Returns:</span>
                              <strong className="text-emerald-400 font-bold">+${m.reward.cash} Cash | +{m.reward.compoundV || 0} V | Shift: {m.reward.controlBonus}%</strong>
                            </div>

                            <button
                              onClick={() => handleLaunchCombat(m)}
                              className={`w-full py-3.5 border font-mono text-xs font-black uppercase tracking-[0.15em] rounded-none transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                                selectedFaction === Faction.BOYS 
                                  ? 'bg-[#C50000] text-white border-[#C50000] hover:bg-white hover:text-[#C50000]' 
                                  : 'bg-[#004182] text-white border-[#004182] hover:bg-white hover:text-[#004182]'
                              }`}
                            >
                              <Swords size={13} />
                              <span>Dispatch Combat Squad ({roster.filter(c => c.faction === selectedFaction && unlockedCharIds.includes(c.id) && c.currentHp > 40).length} Ready)</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: DICTIONARY AND CHRONOLOGICAL LOGS */}
              {activeTab === 'logs' && (
                <div className="max-w-3xl mx-auto space-y-6 z-10 relative">
                  <h3 className="text-xs font-mono font-black uppercase text-white tracking-[0.2em]">Campaign Chronicles</h3>
                  <div className="bg-black/85 rounded-none border border-white/10 p-6 font-mono text-xs text-white/70 max-h-[460px] overflow-y-auto space-y-3 uppercase tracking-tight">
                    <AnimatePresence initial={false}>
                      {logsList.map((log) => (
                        <motion.div 
                          key={log}
                          layout
                          initial={{ opacity: 0, y: -12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            opacity: { duration: 0.25, ease: "easeOut" },
                            y: { type: "spring", stiffness: 350, damping: 28 },
                            layout: { type: "spring", stiffness: 350, damping: 28 }
                          }}
                          className="pb-2.5 border-b border-white/5 last:border-0 flex gap-3 items-start leading-relaxed"
                          id={`log-item-${log.substring(0, 15).replace(/[^a-zA-Z0-9]/g, '-')}`}
                        >
                          <span className="text-red-500 font-bold shrink-0 font-display">➢</span>
                          <span>{log}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

            </main>
          )}

          {/* Persistent Footer */}
          <footer className="bg-black border-t border-white/10 py-8 px-4 sm:px-8 mt-16 text-center text-xs font-mono text-white/40 flex flex-col sm:flex-row justify-between items-center max-w-7xl w-full mx-auto gap-4 relative z-10">
            <span>© 2026 THE BOYS WEBSERIES TRADEMARKS COMPLY WITH VOUGHT INC.</span>
            <div className="flex gap-6 items-center">
              <button 
                onClick={() => setShowTutorial(true)}
                className="hover:text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer text-red-500"
              >
                <HelpCircle size={12} /> View Tactics Manual
              </button>
              <span className="text-white/20">|</span>
              <span>GRID SECURE // SECURE TRANSITS COMPLETE</span>
            </div>
          </footer>
        </div>
      )}

      {/* 2. PERSISTENT TUTORIAL DRILL MODAL */}
      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}

      {/* 3. CAMPAIGN EVENTS RANDOM DILEMMA MODAL */}
      {currentEvent && (
        <CampaignEventsModal
          currentEvent={currentEvent}
          playerFaction={selectedFaction || Faction.BOYS}
          onChoiceSelected={handleEventChoiceResolution}
        />
      )}

      {/* 4. STORYTELLING DILEMMA RESOLVED MESSAGE OVERLAY */}
      <AnimatePresence>
        {resolvedEventText && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-stone-900 border border-amber-600/30 rounded-xl p-6 shadow-2xl"
            >
              <h3 className="text-sm font-mono uppercase tracking-widest text-amber-500 font-black mb-2 flex items-center gap-1.5">
                <AlertCircle size={15} /> Event Resolution Outcome
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-6">
                {resolvedEventText}
              </p>
              <button
                onClick={() => {
                  setResolvedEventText(null);
                  evaluateWinnerConditions();
                }}
                className="w-full py-2 bg-amber-500 text-slate-950 font-mono text-xs font-bold uppercase rounded hover:bg-amber-400 transition-all cursor-pointer"
              >
                Accept Consequence
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. FINALE MAJOR SHOWDOWN VICTORY OR DEFEAT OVERLAY */}
      <AnimatePresence>
        {campaignOutcome && (
          <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-lg z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-full max-w-lg rounded-2xl border p-8 text-center shadow-2xl ${
                campaignOutcome === 'victory' 
                  ? 'bg-gradient-to-tr from-amber-950/80 via-yellow-950/40 to-slate-950 border-amber-500 shadow-amber-950' 
                  : 'bg-gradient-to-tr from-red-950/80 via-stone-900 to-slate-950 border-red-500 shadow-red-955'
              }`}
            >
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center border border-dashed mb-4 bg-slate-950">
                {campaignOutcome === 'victory' ? (
                  <Trophy size={32} className="text-amber-500 animate-bounce" />
                ) : (
                  <Activity size={32} className="text-red-500 animate-pulse" />
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-slate-100 italic mb-2">
                {campaignOutcome === 'victory' ? '🏆 GLOBAL CAMPAIGN SECURED' : '💀 MISSION FAIL - SECTOR CONTAMINATED'}
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
                {campaignOutcome === 'victory' ? (
                  selectedFaction === Faction.BOYS 
                    ? "Butcher\'s plan succeeds. Vought stock drops to zero, and Homelander is forced to flee NYC after severe PR leakage. Humanity secures another day!"
                    : "The vigilantes have been totally crushed and their safehouses converted to high-tech parking lots. Homelander's fame is immortalized in corporate records."
                ) : (
                  selectedFaction === Faction.BOYS 
                    ? "Butcher is locked up in clinical Vought vaults. The vigilantes have disbanded after heavy orbital sweep strikes. Order reigns supreme."
                    : "Vought Tower has fallen to the rebel leaks. High-security profiles leaked online, forced into legal liquidation."
                )}
              </p>

              <button
                onClick={() => {
                  setCampaignOutcome(null);
                  setSelectedFaction(null); // Return to home setup selector
                }}
                className={`py-3 px-8 rounded-lg font-mono text-xs uppercase font-black transition-all cursor-pointer ${
                  campaignOutcome === 'victory'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-950/20'
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                Commence New Campaign
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Simple Helper component to render trophy in Victory states
function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
      <path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4s-4-1.12-4-4V6a4 4 0 0 1 4-4z" />
    </svg>
  );
}
