import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Star, Sword, Map, Settings, Play, ShieldAlert } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

export default function TutorialModal({ onClose }: TutorialModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl"
      >
        {/* Banner with Boys style graffiti overlay look */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 p-6 text-slate-950 flex justify-between items-center border-b border-amber-500">
          <div className="flex items-center gap-2">
            <ShieldAlert size={24} className="animate-bounce" />
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider">Operational Manual</h2>
              <p className="text-xs font-semibold opacity-90">How to fight for control in NYC</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-xs font-mono font-bold bg-slate-950 text-amber-500 px-3 py-1.5 rounded hover:bg-slate-900 uppercase transition-all"
          >
            DISMISS
          </button>
        </div>

        <div className="p-6 max-h-[460px] overflow-y-auto scrollbar-thin text-slate-300 space-y-6">
          
          {/* Section 1: Core Goal */}
          <div>
            <h4 className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-amber-500 tracking-wider mb-2">
              <Star size={14} /> The Objective
            </h4>
            <p className="text-xs leading-relaxed font-sans text-slate-400">
              The war for New York is played across 5 strategic territories. Your current general level of control is governed by active missions and stationary hero power. To secure absolute victory, you must reach <strong>100% control</strong> of NYC by performing tactical missions and maintaining field dominance.
            </p>
          </div>

          {/* Section 2: Factions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-950/50 border border-amber-950/40">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">THE BOYS (Vigilantes)</span>
              <p className="text-[11px] leading-relaxed text-slate-400">
                They rely on <strong>Intel/Blackmail</strong> to bypass supe defenses, and use toxic green <strong>Temp-V</strong> barrels to boost baseline physical punch. Gather files and strike in silence.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-950/50 border border-sky-950/40">
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest block mb-1">THE SEVEN (Vought Corp)</span>
              <p className="text-[11px] leading-relaxed text-slate-400">
                They leverage massive <strong>Vought PR/Cash</strong> funding streams and absolute <strong>Compound-V</strong> injections. Command unmatched security arrays to eliminate pestilent instigators.
              </p>
            </div>
          </div>

          {/* Section 3: Tactical Board Operations */}
          <div>
            <h4 className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-amber-500 tracking-wider mb-2">
              <Map size={14} /> Faction Operations Loop
            </h4>
            <ul className="text-xs space-y-2 text-slate-400 list-disc list-inside">
              <li><strong>Roster Allocation:</strong> Station squad members on specific map sectors to earn passive turn income like cash, intel, or V-Fluid.</li>
              <li><strong>Blackmail / Lab Upgrades:</strong> Spend hard-extracted resources to empower characters, increase maximum HP, unlock skills, or establish propaganda arrays.</li>
              <li><strong>Active Missions:</strong> Select extreme custom skirmishes in Manhattan. Deploy up to 3 selected teammates to participate in a high-stakes team battle!</li>
            </ul>
          </div>

          {/* Section 4: Combat Skills */}
          <div>
            <h4 className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-amber-500 tracking-wider mb-2">
              <Sword size={14} /> Turn combat strategies
            </h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-2">
              During active missions, heroes take alternate turn phases automatically. When it is your turn:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono">
              <div className="p-2 border border-slate-800 rounded bg-slate-900/50">
                <strong className="text-slate-200 block mb-0.5">🔥 Blazing Lasers</strong>
                Armor-piercing high-damage beams slicing targets.
              </div>
              <div className="p-2 border border-slate-800 rounded bg-slate-900/50">
                <strong className="text-slate-200 block mb-0.5">🧪 Halothane Gas</strong>
                Stuns adversaries, restricting their physical ability to strike.
              </div>
              <div className="p-2 border border-slate-800 rounded bg-slate-900/50">
                <strong className="text-slate-200 block mb-0.5">🛡️ Shield Bubbles</strong>
                Absorbs hostile blows and preserves operational health.
              </div>
            </div>
          </div>

          {/* Button to close */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-amber-500 text-slate-950 text-xs tracking-wider uppercase font-bold rounded hover:bg-amber-400 transition-all font-mono"
            >
              <Play size={12} /> Enter the Fight
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
