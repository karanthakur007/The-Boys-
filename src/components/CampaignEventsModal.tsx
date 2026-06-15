import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, AlertCircle, HelpCircle, AlertTriangle } from 'lucide-react';
import { CampaignEvent, Faction } from '../types';

interface CampaignEventsModalProps {
  currentEvent: CampaignEvent;
  playerFaction: Faction;
  onChoiceSelected: (outcomeText: string, updatedStateModifier: (state: any) => any) => void;
}

export default function CampaignEventsModal({
  currentEvent,
  playerFaction,
  onChoiceSelected
}: CampaignEventsModalProps) {
  
  // Decide which choice block is appropriate for display
  const isBoys = playerFaction === Faction.BOYS;
  const targetChoice = isBoys ? currentEvent.boysChoice : currentEvent.sevenChoice;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl shadow-red-950/20"
      >
        {/* Header Alert Ribbon */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-red-900/60 rounded border border-red-500 text-red-400 animate-pulse">
            <ShieldAlert size={20} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold block">Breaking Critical Event</span>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide">{currentEvent.title}</h3>
          </div>
        </div>

        {/* Narrative Description body */}
        <div className="p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
            {currentEvent.description}
          </p>

          <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 mb-6 flex items-start gap-3">
            <AlertTriangle className="text-amber-500 mt-0.5 shrink-0" size={16} />
            <div>
              <span className="text-xs font-semibold text-slate-300 block">The Operational Imperative</span>
              <p className="text-[11px] text-slate-400 mt-1">
                {isBoys 
                  ? "As vigilantes, your assets are scarce. Blackmail and publicity are your strongest shields against sheer, unbridled supe brutality."
                  : "As Vought executives, corporate stability and stock values are absolute. Control the public narrative at all costs."
                }
              </p>
            </div>
          </div>

          {/* User Choice Interactive Trigger */}
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChoiceSelected(targetChoice.outcomeText, targetChoice.applyEffects)}
              className="w-full p-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-lg text-xs tracking-wider uppercase text-center transition-all shadow-md shadow-amber-950/20 flex items-center justify-center gap-2"
            >
              <HelpCircle size={14} />
              <span>{targetChoice.label}</span>
            </motion.button>
          </div>
        </div>

        {/* Footnote */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span>CODENAME TRANSMISSION // SECURE LINE</span>
          <span>VOUGHT INC V-GRID</span>
        </div>
      </motion.div>
    </div>
  );
}
