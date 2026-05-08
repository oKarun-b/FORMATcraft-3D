import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scene3D } from './Scene3D';
import { useEditorStore } from '../store/useEditorStore';
import { 
  Palette, 
  Sun, 
  Maximize2, 
  Scissors, 
  Hammer, 
  Settings2,
  ChevronRight,
  MousePointer2
} from 'lucide-react';

export const InteractiveDemo = () => {
  const { 
    mode, setMode, 
    selectedColor, setSelectedColor,
    garmentSize, setGarmentSize,
    clothDeformation, setClothDeformation,
    showMannequin, setShowMannequin,
    showStitching, setShowStitching,
    furnitureWidth, setFurnitureWidth,
    furnitureHeight, setFurnitureHeight,
    furnitureDepth, setFurnitureDepth,
    isExploded, setIsExploded,
    woodTexture, setWoodTexture
  } = useEditorStore();
  const [exposure, setExposure] = useState(1);
  const [roughness, setRoughness] = useState(0.2);
  const [environment, setEnvironment] = useState('studio');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const modes = [
    { id: 'fashion', label: 'Fashion', icon: <Scissors size={14} />, desc: 'Textile physics & drape' },
    { id: 'carpentry', label: 'Carpenter', icon: <Hammer size={14} />, desc: 'Structural wood & joints' }
  ];

  return (
    <section className="py-32 bg-[#050505] relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Header & Controls */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="mb-12">
              <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-[0.4em] mb-4 block">Interactive Preview</span>
              <h2 className="text-5xl md:text-6xl font-serif text-white tracking-tight italic mb-6">Experience the Forge.</h2>
              <p className="text-white/40 font-light leading-relaxed">
                Toggle between disciplines and adjust engine parameters in real-time. Our unified viewport handles both soft textiles and rigid structures with identical precision.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`p-6 rounded-[2rem] border transition-all duration-500 text-left group ${
                    mode === m.id 
                    ? 'border-gold bg-gold/5 shadow-[0_0_30px_rgba(245,158,11,0.1)]' 
                    : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                    mode === m.id ? 'bg-gold text-black' : 'bg-white/5 text-white/40 group-hover:text-white'
                  }`}>
                    {m.icon}
                  </div>
                  <div className={`font-medium mb-1 ${mode === m.id ? 'text-white' : 'text-white/40'}`}>{m.label}</div>
                  <div className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed">
                    {m.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* AI Generator Placeholder (Motion Feature) */}
            <AnimatePresence mode="wait">
              {mode === 'fashion' ? (
                <motion.button
                  key="ai-fashion"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={handleAIGenerate}
                  className="w-full mb-8 py-5 rounded-[2rem] bg-gradient-to-r from-gold/20 to-gold/5 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gold/10 transition-all overflow-hidden relative"
                >
                  {isGenerating ? (
                    <motion.div 
                      key="gen"
                      animate={{ x: [-100, 300] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/40 to-transparent w-full"
                    />
                  ) : null}
                  <Palette size={14} /> {isGenerating ? 'AI Synthesizing...' : 'AI Outfit Pulse'}
                </motion.button>
              ) : (
                <motion.button
                  key="ai-carpenter"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={handleAIGenerate}
                  className="w-full mb-8 py-5 rounded-[2rem] bg-gradient-to-r from-blue-500/20 to-blue-500/5 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-500/10 transition-all overflow-hidden relative"
                >
                  {isGenerating ? (
                    <motion.div 
                      key="gen"
                      animate={{ x: [-100, 300] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent w-full"
                    />
                  ) : null}
                  <Hammer size={14} /> {isGenerating ? 'Computing Joinery...' : 'Parametric Solver'}
                </motion.button>
              )}
            </AnimatePresence>

            {/* Engine Parameters */}
            <div className="space-y-6 p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] glass">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Sun size={12} className="text-gold" /> Exposure
                  </span>
                  <span className="text-[10px] font-mono text-gold">{exposure.toFixed(1)} EV</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1" 
                  value={exposure}
                  onChange={(e) => setExposure(parseFloat(e.target.value))}
                  className="w-full accent-gold h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer" 
                />
              </div>

              {mode === 'carpentry' && (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                         Width
                      </span>
                      <span className="text-[10px] font-mono text-gold">{furnitureWidth.toFixed(2)}m</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="2.5" step="0.1" value={furnitureWidth}
                      onChange={(e) => setFurnitureWidth(parseFloat(e.target.value))}
                      className="w-full accent-gold h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                         Height
                      </span>
                      <span className="text-[10px] font-mono text-gold">{furnitureHeight.toFixed(2)}m</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="2" step="0.1" value={furnitureHeight}
                      onChange={(e) => setFurnitureHeight(parseFloat(e.target.value))}
                      className="w-full accent-gold h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer" 
                    />
                  </div>
                  <div>
                    <div className="flex font-bold justify-between items-center mb-3">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                         Depth
                      </span>
                      <span className="text-[10px] font-mono text-gold">{furnitureDepth.toFixed(2)}m</span>
                    </div>
                    <input 
                      type="range" min="0.4" max="1.5" step="0.1" value={furnitureDepth}
                      onChange={(e) => setFurnitureDepth(parseFloat(e.target.value))}
                      className="w-full accent-gold h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer" 
                    />
                  </div>
                  <div className="pt-2">
                     <button 
                      onClick={() => setIsExploded(!isExploded)}
                      className={`w-full py-4 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isExploded ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-white/5 text-white/40 hover:bg-white/5'}`}
                    >
                      Exploded Assembly
                    </button>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 block">Material Library</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'oak', label: 'Aged Oak' },
                        { id: 'walnut', label: 'Black Walnut' },
                        { id: 'pine', label: 'Raw Pine' }
                      ].map((w) => (
                        <button
                          key={w.id}
                          onClick={() => setWoodTexture(w.id)}
                          className={`py-3 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all ${woodTexture === w.id ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40 bg-white/[0.02]'}`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {mode === 'fashion' ? (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <Maximize2 size={12} className="text-gold" /> Garment Scale
                      </span>
                      <span className="text-[10px] font-mono text-gold">{garmentSize.toFixed(1)}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.8" 
                      max="1.2" 
                      step="0.01" 
                      value={garmentSize}
                      onChange={(e) => setGarmentSize(parseFloat(e.target.value))}
                      className="w-full accent-gold h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <Settings2 size={12} className="text-gold" /> Fabric Physics
                      </span>
                      <span className="text-[10px] font-mono text-gold">{(clothDeformation * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="0.8" 
                      step="0.05" 
                      value={clothDeformation}
                      onChange={(e) => setClothDeformation(parseFloat(e.target.value))}
                      className="w-full accent-gold h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer" 
                    />
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowMannequin(!showMannequin)}
                      className={`flex-1 py-3 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all ${showMannequin ? 'bg-gold/10 border-gold/30 text-gold' : 'border-white/5 text-white/40'}`}
                    >
                      Mannequin
                    </button>
                    <button 
                      onClick={() => setShowStitching(!showStitching)}
                      className={`flex-1 py-3 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all ${showStitching ? 'bg-gold/10 border-gold/30 text-gold' : 'border-white/5 text-white/40'}`}
                    >
                      Stitching
                    </button>
                  </div>
                </>
              ) : null}

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Palette size={12} className="text-gold" /> Material Tint
                  </span>
                  <div className="flex gap-2">
                    {['#ffffff', '#f59e0b', '#dc2626', '#10b981', '#3b82f6'].map(c => (
                      <button 
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`w-4 h-4 rounded-full border border-white/20 transition-transform ${selectedColor === c ? 'scale-125 border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Viewport */}
          <div className="lg:col-span-8 relative min-h-[500px] lg:min-h-auto">
            <div className="absolute inset-0">
              <Scene3D exposure={exposure} environment={environment} scale={1} roughness={roughness} />
            </div>

            {/* HUD Overlay */}
            <div className="absolute top-8 left-8 pointer-events-none">
              <div className="flex gap-3 mb-4">
                <div className="px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[9px] font-mono text-white/60 uppercase tracking-widest">
                  Live Viewport
                </div>
                <div className="px-3 py-1.5 rounded-full bg-gold/20 border border-gold/40 backdrop-blur-md text-[9px] font-mono text-gold uppercase tracking-widest">
                  WebGPU Active
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 right-8 flex gap-2">
              <button 
                onClick={() => setEnvironment(environment === 'studio' ? 'city' : 'studio')}
                className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all group backdrop-blur-md"
              >
                <Sun size={18} className="group-hover:rotate-45 transition-transform" />
              </button>
              <button className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all backdrop-blur-md">
                <Maximize2 size={18} />
              </button>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/5 backdrop-blur-md">
                <MousePointer2 size={12} className="text-white/40" />
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Drag to rotate • Scroll to zoom</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
