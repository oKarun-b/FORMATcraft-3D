import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, X, RotateCcw, Clock, CheckCircle2 } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { useStore } from 'zustand';

export const VersionHistory = () => {
  const setIsHistoryOpen = useEditorStore((state) => state.setIsHistoryOpen);
  const { pastStates, futureStates, undo, redo, clear } = useStore(useEditorStore.temporal, (state) => state);

  // We can't easily "jump" to a specific index in standard temporal without multiple undos,
  // but we can provide a list and perform sequential undos/redos or show the timeline.
  // For this UI, we'll show the count and current "position".
  
  const allStatesCount = pastStates.length + futureStates.length + 1;
  const currentIndex = pastStates.length;

  const handleRevert = (targetIndex: number) => {
    const steps = currentIndex - targetIndex;
    if (steps > 0) {
      for (let i = 0; i < steps; i++) undo();
    } else if (steps < 0) {
      for (let i = 0; i < Math.abs(steps); i++) redo();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <HistoryIcon size={14} className="text-gold" />
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40 font-mono">Snapshot_Log</span>
        </div>
        <button 
          onClick={() => setIsHistoryOpen(false)}
          className="text-white/20 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <div className="space-y-2">
          {/* Legend/Current Marker */}
          <div className="flex items-center gap-2 mb-6 px-1">
             <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
             <span className="text-[9px] font-mono text-white/60 tracking-widest uppercase">Current_State_Active</span>
          </div>

          <div className="relative pl-6 border-l border-white/5 space-y-8">
            {/* Future States (if any) */}
            {futureStates.slice().reverse().map((_, i) => {
              const idx = allStatesCount - 1 - i;
              return (
                <HistoryItem 
                  key={`future-${idx}`}
                  index={idx}
                  active={false}
                  future={true}
                  onClick={() => handleRevert(idx)}
                  label={`Redo_State_${idx}`}
                />
              );
            })}

            {/* Current State */}
            <HistoryItem 
              index={currentIndex}
              active={true}
              onClick={() => {}}
              label="Active_Session"
            />

            {/* Past States */}
            {pastStates.slice().reverse().map((_, i) => {
              const idx = currentIndex - 1 - i;
              return (
                <HistoryItem 
                  key={`past-${idx}`}
                  index={idx}
                  active={false}
                  onClick={() => handleRevert(idx)}
                  label={`Checkpoint_${idx}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/5 bg-white/[0.01]">
        <button 
          onClick={() => {
            if(confirm('Clear all session history? This cannot be undone.')) clear();
          }}
          className="w-full py-3 border border-white/5 rounded-sm flex items-center justify-center gap-2 text-[9px] font-bold text-white/20 hover:text-red-500/80 hover:border-red-500/20 transition-all uppercase tracking-[0.2em]"
        >
          <RotateCcw size={12} /> Purge_History_Cache
        </button>
      </div>
    </div>
  );
};

const HistoryItem = ({ index, active, future = false, onClick, label }: { index: number, active: boolean, future?: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    disabled={active}
    className={`group relative text-left w-full transition-all ${active ? 'cursor-default' : 'hover:translate-x-1'}`}
  >
    {/* Connector dot */}
    <div 
      className={`absolute -left-[27px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 bg-[#050505] flex items-center justify-center transition-all duration-500
        ${active ? 'border-gold bg-gold/10' : 'border-white/10 group-hover:border-white/30'}
      `}
    >
      {active ? (
        <CheckCircle2 size={8} className="text-gold" />
      ) : (
        <div className={`w-1 h-1 rounded-full ${future ? 'bg-white/10' : 'bg-white/30'}`} />
      )}
    </div>

    <div className={`p-3 rounded-sm border transition-all duration-300 flex items-center justify-between ${active ? 'bg-white/[0.03] border-gold/20' : 'border-transparent hover:bg-white/[0.01]'}`}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className={`text-[8px] font-mono tracking-widest uppercase ${active ? 'text-gold' : 'text-white/40'}`}>
            {label}
          </span>
          {active && (
             <span className="text-[6px] px-1 bg-gold/20 text-gold rounded-full font-bold uppercase tracking-tighter">Live</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[6px] font-mono text-white/10 uppercase italic">
          <Clock size={8} /> 
          {active ? 'Last modified just now' : `Snapshot_ID: 0x${(index * 1234).toString(16).padStart(4, '0')}`}
        </div>
      </div>
      
      {!active && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[7px] font-bold text-gold/60 tracking-widest uppercase italic">Revert_To</span>
        </div>
      )}
    </div>
  </button>
);
