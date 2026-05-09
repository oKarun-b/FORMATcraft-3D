import React from 'react';

export const PropertySection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="flex flex-col gap-5">
    <div className="flex items-center gap-3">
      <span className="text-[9px] font-mono text-white/40 tracking-[0.3em] uppercase shrink-0 font-black">{title}</span>
      <div className="h-px bg-white/5 flex-1" />
    </div>
    <div className="px-1">
      {children}
    </div>
  </div>
);

export const RangeControl = ({ label, value, onChange, min = 1, max = 100 }: { label: string, value: number, onChange: (v: number) => void, min?: number, max?: number }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center text-[9px] font-mono">
      <span className="text-white/20 uppercase tracking-widest font-medium">{label}</span>
      <span className="text-gold/60 font-bold tabular-nums">{value}</span>
    </div>
    <div className="relative flex items-center">
      <input 
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-[3px] bg-white/5 rounded-full appearance-none cursor-crosshair accent-gold hover:accent-gold-light transition-all range-sm"
      />
    </div>
  </div>
);

export const ToggleControl = ({ label, active, onClick, icon }: { label: string, active: boolean, onClick: () => void, icon?: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className="w-full group flex items-center justify-between py-2 transition-all"
  >
    <div className="flex items-center gap-2">
      {icon && <div className={`${active ? 'text-gold' : 'text-white/20'}`}>{icon}</div>}
      <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest group-hover:text-white/60 transition-colors">{label}</span>
    </div>
    <div className={`w-8 h-4 rounded-full p-0.5 transition-all duration-300 ${active ? 'bg-gold/40' : 'bg-white/5'}`}>
      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${active ? 'translate-x-4 bg-gold shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'translate-x-0 bg-white/20'}`} />
    </div>
  </button>
);
