import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Skull, Zap, Map, TrendingUp, Info, HelpCircle, Activity, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Faction, CampaignDifficulty } from '../types';

interface FactionSelectorProps {
  onSelectFaction: (faction: Faction, difficulty: CampaignDifficulty) => void;
}

export default function FactionSelector({ onSelectFaction }: FactionSelectorProps) {
  const [difficulty, setDifficulty] = useState<CampaignDifficulty>(CampaignDifficulty.OPERATIVE);
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 pt-24 sm:pt-28 sm:p-8 font-sans relative overflow-hidden">
      
      {/* Absolute Dramatic Radial Gradients from Design HTML */}
      <div className="absolute inset-0 opacity-25 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full" style={{ background: "radial-gradient(circle at 25% 45%, #004182 0%, transparent 45%), radial-gradient(circle at 75% 55%, #C50000 0%, transparent 45%)" }} />
      </div>

      {/* Styled Top Bar Header Menu */}
      <nav className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 sm:px-12 py-4 sm:py-6 z-10 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="text-xs tracking-[0.3em] font-black uppercase italic text-white font-mono">Vought International // OS.1</div>
        <div className="flex gap-4 sm:gap-8 text-[9px] sm:text-[10px] tracking-[0.2em] font-bold uppercase">
          <span className="text-blue-400">Sector: New York</span>
          <span className="text-red-500">Threat Level: Extreme</span>
          <span className="hidden md:inline text-white/60">Server: US-EAST-1</span>
        </div>
      </nav>

      <div className="max-w-4xl w-full z-10 flex flex-col gap-8">
        
        {/* Cinematic Title Banner */}
        <div className="text-center">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-red-500/20 bg-red-950/40 text-red-500 text-[10px] font-mono uppercase tracking-[0.3em] font-black mb-4 mx-auto animate-pulse"
          >
            <Zap size={10} /> The Boys: Control War
          </motion.div>
          
          <motion.h1 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black italic uppercase leading-[0.85] tracking-tighter text-white font-display"
          >
            CHOOSE YOUR <br/>
            <span className="text-transparent" style={{ WebkitTextStroke: "1.5px #C50000" }}>ALLIANCE</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-4 font-mono tracking-wider uppercase"
          >
            Vought’s media machine dominates Manhattan. Will you burn down their tower or secure their global supremacy?
          </motion.p>
        </div>

        {/* DIFFICULTY SELECTOR */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-neutral-950/80 border border-white/10 p-5 rounded-none font-mono text-xs uppercase"
          id="campaign-difficulty-selector"
        >
          <div className="flex items-center gap-2 text-[10px] text-white/50 tracking-[0.2em] mb-3.5 font-bold">
            <Activity size={12} className="text-red-500 animate-pulse" />
            SELECT CAMPAIGN CRITICAL THREAT LEVEL
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* RECRUIT */}
            <button
              type="button"
              id="difficulty-recruit-btn"
              onClick={() => setDifficulty(CampaignDifficulty.RECRUIT)}
              className={`p-3 text-left border cursor-pointer transition-all ${
                difficulty === CampaignDifficulty.RECRUIT 
                  ? 'border-emerald-500 bg-emerald-950/20 text-white shadow-md' 
                  : 'border-white/5 bg-black/40 text-slate-400 hover:border-white/25'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-black tracking-widest text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">RECRUIT</span>
                <span className="text-[10px] text-emerald-400">EASY</span>
              </div>
              <p className="text-[9px] text-white/50 lowercase italic leading-relaxed font-sans font-medium">Starting Resources +50%. Slower territory decay. 30% softer enemies in active combat.</p>
            </button>

            {/* OPERATIVE */}
            <button
              type="button"
              id="difficulty-operative-btn"
              onClick={() => setDifficulty(CampaignDifficulty.OPERATIVE)}
              className={`p-3 text-left border cursor-pointer transition-all ${
                difficulty === CampaignDifficulty.OPERATIVE 
                  ? 'border-blue-500 bg-blue-950/20 text-white shadow-md' 
                  : 'border-white/5 bg-black/40 text-slate-400 hover:border-white/25'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-black tracking-widest text-[9px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20">OPERATIVE</span>
                <span className="text-[10px] text-blue-400">NORMAL</span>
              </div>
              <p className="text-[9px] text-white/50 lowercase italic leading-relaxed font-sans font-medium">Standard battle operations. Normal supe response thresholds.</p>
            </button>

            {/* SUPE */}
            <button
              type="button"
              id="difficulty-supe-btn"
              onClick={() => setDifficulty(CampaignDifficulty.SUPE)}
              className={`p-3 text-left border cursor-pointer transition-all ${
                difficulty === CampaignDifficulty.SUPE 
                  ? 'border-red-500 bg-red-950/20 text-white shadow-md' 
                  : 'border-white/5 bg-black/40 text-slate-400 hover:border-white/25'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-black tracking-widest text-[9px] px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20">SUPE THREAT</span>
                <span className="text-[10px] text-red-500">HARD</span>
              </div>
              <p className="text-[9px] text-white/50 lowercase italic leading-relaxed font-sans font-medium">Starting Resources -25%. Elevated threat scaling. 40% deadlier adversaries.</p>
            </button>
          </div>
        </motion.div>

        {/* Factions side-by-side view (Grungy vs Corporate) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* THE BOYS: Vigilante Underground */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="group relative rounded-none bg-black/60 backdrop-blur-sm border border-white/10 hover:border-red-600 p-8 flex flex-col justify-between transition-all duration-300"
          >
            {/* Faction Header */}
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-[#C50000]/10 border border-[#C50000]/40 text-[#C50000] rounded-none group-hover:bg-[#C50000] group-hover:text-white transition-all duration-300">
                  <Skull size={24} />
                </div>
                <span className="text-[10px] font-mono border border-[#C50000]/30 text-[#C50000] px-2.5 py-1 rounded-none font-bold uppercase tracking-widest">THE REBELLION</span>
              </div>

              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic font-display mb-3">THE BOYS</h2>
              <p className="text-xs text-stone-300 leading-relaxed mb-6 font-sans">
                Led by Billy Butcher. A ragtag crew of vengeful humans equipped with black market weapons, toxic halothane stuns, and raw stolen Temp-V injections. Subvert Homelander by any means necessary.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex gap-3 items-start text-xs text-stone-300">
                  <div className="mt-0.5 p-0.5 bg-red-950/40 rounded-none text-red-500 border border-red-900">✔</div>
                  <div>
                    <strong className="text-white font-mono uppercase tracking-wider block text-[11px]">Intel Blueprint Hacking</strong>
                    Unlock strategic blackmail routes to reduce Vought controls passively.
                  </div>
                </div>
                <div className="flex gap-3 items-start text-xs text-stone-300">
                  <div className="mt-0.5 p-0.5 bg-red-950/40 rounded-none text-red-500 border border-red-900">✔</div>
                  <div>
                    <strong className="text-white font-mono uppercase tracking-wider block text-[11px]">Chemical Poisoning Loops</strong>
                    Frenchie specializes in chemical gas stuns in operational battles.
                  </div>
                </div>
                <div className="flex gap-3 items-start text-xs text-stone-300">
                  <div className="mt-0.5 p-0.5 bg-red-950/40 rounded-none text-red-500 border border-red-900">✔</div>
                  <div>
                    <strong className="text-white font-mono uppercase tracking-wider block text-[11px]">Temp-V Laser Eyes</strong>
                    Feed Butcher Temp-V vials to unlock blue nuclear laser beams.
                  </div>
                </div>
              </div>
            </div>

            <button
              id="boys-faction-init-btn"
              onClick={() => onSelectFaction(Faction.BOYS, difficulty)}
              className="w-full py-4 bg-[#C50000] hover:bg-white hover:text-[#C50000] border border-[#C50000] hover:border-white text-white font-black text-xs uppercase tracking-[0.2em] rounded-none transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-mono"
            >
              <span>Initialize Billy Butcher Crew</span>
            </button>
          </motion.div>

          {/* THE SEVEN: Executive Vought Dominance */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="group relative rounded-none bg-black/60 backdrop-blur-sm border border-white/10 hover:border-blue-500 p-8 flex flex-col justify-between transition-all duration-300"
          >
            {/* Faction Header */}
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-500/10 border border-blue-500/40 text-blue-400 rounded-none group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Shield size={24} />
                </div>
                <span className="text-[10px] font-mono border border-blue-500/30 text-blue-400 px-2.5 py-1 rounded-none font-bold uppercase tracking-widest">VOUGHT ELITE</span>
              </div>

              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic font-display mb-3">THE SEVEN</h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
                Vought International’s premium marketing asset. Command Homelander, Queen Maeve, and A-Train under a multi-billion dollar PR framework to crush vigilante safehouses and lock down NYC.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex gap-3 items-start text-xs text-slate-300">
                  <div className="mt-0.5 p-0.5 bg-blue-950/40 rounded-none text-blue-400 border border-blue-900">✔</div>
                  <div>
                    <strong className="text-white font-mono uppercase tracking-wider block text-[11px]">PR Hegemony Stream</strong>
                    Shield your units from public backlash using highly funded talk-shows.
                  </div>
                </div>
                <div className="flex gap-3 items-start text-xs text-slate-300">
                  <div className="mt-0.5 p-0.5 bg-blue-950/40 rounded-none text-blue-400 border border-blue-900">✔</div>
                  <div>
                    <strong className="text-white font-mono uppercase tracking-wider block text-[11px]">God-Core heat vision</strong>
                    Homelander deals massive damage using high damage heat lasers.
                  </div>
                </div>
                <div className="flex gap-3 items-start text-xs text-slate-300">
                  <div className="mt-0.5 p-0.5 bg-blue-950/40 rounded-none text-blue-400 border border-blue-900">✔</div>
                  <div>
                    <strong className="text-white font-mono uppercase tracking-wider block text-[11px]">Infinite Compound-V Lab</strong>
                    Synthesize unlimited raw V to boost supes base stats instantly.
                  </div>
                </div>
              </div>
            </div>

            <button
              id="seven-faction-init-btn"
              onClick={() => onSelectFaction(Faction.SEVEN, difficulty)}
              className="w-full py-4 bg-blue-600 hover:bg-white hover:text-blue-600 border border-blue-600 hover:border-white text-white font-black text-xs uppercase tracking-[0.2em] rounded-none transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-mono"
            >
              <span>Inaugurate Homelander Guard</span>
            </button>
          </motion.div>

        </div>

        {/* Informative Disclaimer */}
        <div className="bg-black/80 border border-white/10 p-5 rounded-none flex items-center gap-4 text-xs leading-normal text-slate-400 font-mono">
          <Info size={18} className="text-red-500 shrink-0" />
          <p className="uppercase tracking-tight text-[11px]">
            Campaign states are processed in a real turn sequence. Both factions contain custom skills, territory incomes, and unique dilemma events. Good luck, soldier.
          </p>
        </div>

      </div>
    </div>
  );
}
