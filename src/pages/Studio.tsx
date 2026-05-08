import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scissors, 
  Box, 
  Settings2, 
  Maximize2, 
  Share2, 
  Download, 
  Cpu,
  X,
  Database,
  Layers,
  Zap
} from 'lucide-react';
import { Scene3D } from '../components/Scene3D';
import { PatternEditor } from '../components/PatternEditor';
import { useEditorStore } from '../store/useEditorStore';

export const StudioPage = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const { 
    mode, 
    setMode, 
    selectedColor, 
    setSelectedColor,
    garmentSize,
    setGarmentSize,
    clothDeformation,
    setClothDeformation,
    showMannequin,
    setShowMannequin,
    showStitching,
    setShowStitching,
    furnitureWidth,
    setFurnitureWidth,
    furnitureHeight,
    setFurnitureHeight,
    furnitureDepth,
    setFurnitureDepth,
    isExploded,
    setIsExploded,
    woodTexture,
    setWoodTexture,
    wireframe,
    setWireframe,
    autoRotate,
    setAutoRotate
  } = useEditorStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 h-screen bg-[#050505] flex flex-col overflow-hidden"
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Universal Toolbar */}
        <div className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-[#000] z-50">
          <div className="flex flex-col gap-3 mb-4">
            <StudioTool 
              active={mode === 'fashion'} 
              onClick={() => setMode('fashion')}
              icon={<Scissors size={18} />}
              label="FSHN"
            />
            <StudioTool 
              active={mode === 'carpentry'} 
              onClick={() => setMode('carpentry')}
              icon={<Box size={18} />}
              label="WOOD"
            />
          </div>
          
          <div className="w-8 h-px bg-white/10" />

          <div className="flex flex-col gap-6">
            <StudioSideIcon icon={<Settings2 size={18} />} label="SYS_PREFS" />
            <StudioSideIcon icon={<Maximize2 size={18} />} label="VIEW_FULL" />
          </div>

          <div className="mt-auto flex flex-col gap-4 pb-4">
            <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono text-white/10 hover:text-white/40 hover:border-white/20 transition-all cursor-help">
              ?
            </div>
          </div>
        </div>

        {/* 2D Design Workspace (Collapsible relative to mode) */}
        {mode === 'fashion' && (
          <div className="hidden lg:block w-[450px] border-r border-white/5 bg-[#050505]">
            <PatternEditor />
          </div>
        )}

        {/* Main 3D Viewport Area */}
        <div className="flex-1 relative flex flex-col bg-[#000]">
          {/* Viewport Floating Overlays */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="px-3 py-1.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[9px] font-mono text-white/40 tracking-[0.2em] uppercase font-bold">
                ENGINE: PBR_V4 // {mode.toUpperCase()}
              </span>
            </div>
            
            <div className="flex gap-1">
              {(['perspective', 'front', 'top', 'iso'] as const).map(view => (
                <button 
                  key={view} 
                  onClick={() => useEditorStore.getState().setCameraView(view)}
                  className={`px-2 py-1 border text-[8px] font-mono transition-colors uppercase tracking-widest ${useEditorStore((state) => state.cameraView) === view ? 'bg-gold/20 border-gold text-gold' : 'bg-black/40 border-white/5 text-white/20 hover:text-white/60'}`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <div className="flex bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-1">
              <button className="p-2 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-all">
                <Share2 size={14} />
              </button>
              <div className="w-px h-full bg-white/10 mx-1" />
              <button 
                onClick={() => setShowExportModal(true)}
                className="px-4 py-1.5 rounded-md bg-gold text-black font-bold text-[9px] flex items-center gap-2 hover:bg-gold-light transition-all tracking-widest"
              >
                <Download size={14} /> EXPORT
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 cursor-crosshair">
            <Scene3D />
          </div>

          {/* Export Modal Overlay */}
          <AnimatePresence>
            {showExportModal && (
              <ExportModal onClose={() => setShowExportModal(false)} />
            )}
          </AnimatePresence>

          {/* Viewport Status Rail */}
          <footer className="h-8 border-t border-white/5 flex items-center justify-between px-4 bg-[#0A0A0A] text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] w-full">
            <div className="flex gap-6 items-center">
              <span className="text-gold/40">STATUS: READY</span>
              <span className="opacity-50">SAMPLES: 128/128</span>
              <span className="opacity-50">COORDINATES: X: 12.4 Y: -0.2 Z: 4.1</span>
            </div>
            <div className="flex gap-6">
              <span>LATENCY: &lt;10ms</span>
              <span>DEV_BRANCH: PBR_STABLE_42</span>
            </div>
          </footer>
        </div>

        {/* Right Inspector Sidebar */}
        <div className="hidden xl:flex w-72 border-l border-white/5 bg-[#000] flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 font-mono">Properties.v4</span>
            <div className="flex gap-1.5 opacity-30">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-10 no-scrollbar pb-24">
            {/* Global Settings */}
            <PropertySection title="Base Material">
              <div className="grid grid-cols-5 gap-3">
                {['#ffffff', '#f59e0b', '#09090B', '#3b82f6', '#ef4444'].map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`aspect-square rounded-full border-2 transition-all ${selectedColor === color ? 'border-gold scale-110 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'border-white/5 hover:border-white/20'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </PropertySection>

            {mode === 'fashion' ? (
              <>
                <PropertySection title="Simulation Engine">
                  <div className="space-y-6">
                    <RangeControl 
                      label="Garment Scale" 
                      value={Math.round(garmentSize * 100)} 
                      onChange={(v) => setGarmentSize(v / 100)}
                    />
                    <RangeControl 
                      label="Cloth Physics" 
                      value={Math.round(clothDeformation * 100)} 
                      onChange={(v) => setClothDeformation(v / 100)}
                    />
                  </div>
                </PropertySection>

                <PropertySection title="Visualization">
                  <div className="space-y-3">
                    <ToggleControl 
                      label="Mannequin Body" 
                      active={showMannequin} 
                      onClick={() => setShowMannequin(!showMannequin)} 
                    />
                    <ToggleControl 
                      label="Stitching Overlay" 
                      active={showStitching} 
                      onClick={() => setShowStitching(!showStitching)} 
                    />
                    <ToggleControl 
                      label="Mesh Wireframe" 
                      active={wireframe} 
                      onClick={() => setWireframe(!wireframe)} 
                    />
                  </div>
                </PropertySection>
              </>
            ) : (
              <>
                <PropertySection title="Geometry Architecture">
                  <div className="space-y-6">
                    <RangeControl 
                      label="Width" 
                      value={Math.round(furnitureWidth * 40)} 
                      onChange={(v) => setFurnitureWidth(v / 40)}
                    />
                    <RangeControl 
                      label="Height" 
                      value={Math.round(furnitureHeight * 50)} 
                      onChange={(v) => setFurnitureHeight(v / 50)}
                    />
                    <RangeControl 
                      label="Depth" 
                      value={Math.round(furnitureDepth * 80)} 
                      onChange={(v) => setFurnitureDepth(v / 80)}
                    />
                  </div>
                </PropertySection>

                <PropertySection title="Wood Selection">
                  <div className="grid grid-cols-3 gap-2">
                    {['oak', 'walnut', 'pine'].map(t => (
                      <button
                        key={t}
                        onClick={() => setWoodTexture(t)}
                        className={`py-2 rounded-lg border text-[9px] uppercase tracking-widest transition-all ${woodTexture === t ? 'bg-gold/10 border-gold text-gold' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </PropertySection>

                <PropertySection title="Structural View">
                  <div className="space-y-3">
                    <ToggleControl 
                      label="Exploded View" 
                      active={isExploded} 
                      onClick={() => setIsExploded(!isExploded)} 
                    />
                    <ToggleControl 
                      label="Wireframe Mode" 
                      active={wireframe} 
                      onClick={() => setWireframe(!wireframe)} 
                    />
                  </div>
                </PropertySection>
              </>
            )}

            <PropertySection title="Scene Graphics">
              <ToggleControl 
                label="Auto-Rotation" 
                active={autoRotate} 
                onClick={() => setAutoRotate(!autoRotate)} 
              />
            </PropertySection>

            <PropertySection title="Analytics_Core">
              <div className="p-4 rounded-md bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center gap-2">
                  <Cpu size={12} className="text-gold/60" />
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] italic">Intelligence_Active</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[8px] font-mono">
                    <span className="text-white/20">STRESS_TEST</span>
                    <span className="text-green-500">PASS</span>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono">
                    <span className="text-white/20">DENSITY_VAL</span>
                    <span className="text-white/60">0.84_g/cm³</span>
                  </div>
                  <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gold/40 animate-[progress_3s_infinite_linear]" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>
            </PropertySection>
          </div>

          <div className="mt-auto p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl">
            <button className="w-full py-3.5 bg-white text-black text-[10px] font-bold rounded-sm uppercase tracking-[0.4em] hover:bg-gold transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.05)] active:scale-95">
              Compile_Output
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StudioTool = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`group flex flex-col items-center gap-1.5 transition-all ${active ? 'text-gold' : 'text-white/10 hover:text-white/40'}`}
  >
    <div className={`w-11 h-11 rounded-sm border flex items-center justify-center transition-all duration-500 ${active ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'border-white/5 bg-transparent hover:border-white/10'}`}>
      {icon}
    </div>
    <span className={`text-[8px] font-mono font-bold tracking-[0.1em] uppercase transition-all duration-300 ${active ? 'opacity-80' : 'opacity-0 group-hover:opacity-40'}`}>{label}</span>
  </button>
);

const StudioSideIcon = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="text-white/10 hover:text-gold transition-all group relative">
    {icon}
    <div className="absolute left-full ml-4 px-2 py-1 rounded bg-black/95 border border-white/10 text-[8px] font-mono text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
      {label}
    </div>
  </button>
);

const PropertySection = ({ title, children }: { title: string, children: React.ReactNode }) => (
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

const RangeControl = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center text-[9px] font-mono">
      <span className="text-white/20 uppercase tracking-widest font-medium">{label}</span>
      <span className="text-gold/60 font-bold tabular-nums">{value}</span>
    </div>
    <div className="relative flex items-center">
      <input 
        type="range"
        min="1"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-[3px] bg-white/5 rounded-full appearance-none cursor-crosshair accent-gold hover:accent-gold-light transition-all range-sm"
      />
    </div>
  </div>
);

const ToggleControl = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full group flex items-center justify-between py-2 transition-all"
  >
    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest group-hover:text-white/60 transition-colors">{label}</span>
    <div className={`w-8 h-4 rounded-full p-0.5 transition-all duration-300 ${active ? 'bg-gold/40' : 'bg-white/5'}`}>
      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${active ? 'translate-x-4 bg-gold shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'translate-x-0 bg-white/20'}`} />
    </div>
  </button>
);

const ExportModal = ({ onClose }: { onClose: () => void }) => {
  const [format, setFormat] = useState('GLTF');
  const [resolution, setResolution] = useState(80);
  const [compression, setCompression] = useState(40);
  const [preserveMaterials, setPreserveMaterials] = useState(true);
  const [exporting, setExporting] = useState(false);

  const formats = [
    { id: 'GLTF', label: 'pbr_gltf.v2', icon: <Database size={14} /> },
    { id: 'OBJ', label: 'obj_mesh_std', icon: <Layers size={14} /> },
    { id: 'STL', label: 'stl_binary', icon: <Box size={14} /> },
    { id: 'FBX', label: 'fbx_studio', icon: <Zap size={14} /> }
  ];

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      onClose();
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 5 }}
        className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
      >
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
           <span className="text-[10px] font-mono font-bold text-gold tracking-[0.4em] uppercase">Export_Engine_v1.2</span>
           <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
             <X size={16} />
           </button>
        </div>

        <div className="p-8 space-y-10">
          <div className="space-y-4">
             <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-bold block mb-4">Target_Format</span>
             <div className="grid grid-cols-2 gap-2">
                {formats.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`flex items-center gap-3 p-3 rounded-md border text-[10px] font-mono uppercase tracking-[0.1em] transition-all ${format === f.id ? 'bg-gold/10 border-gold text-gold' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
                  >
                    {f.icon}
                    <span>{f.label}</span>
                    {format === f.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />}
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-6">
             <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-bold block mb-4">Compiler_Settings</span>
             <RangeControl label="Geometry_Resolution" value={resolution} onChange={setResolution} />
             <RangeControl label="Mesh_Compression" value={compression} onChange={setCompression} />
             <div className="pt-2">
               <ToggleControl label="Preserve_PBR_Materials" active={preserveMaterials} onClick={() => setPreserveMaterials(!preserveMaterials)} />
               <ToggleControl label="Export_UV_Layouts" active={true} onClick={() => {}} />
               <ToggleControl label="Draco_Optimized" active={format === 'GLTF'} onClick={() => {}} />
             </div>
          </div>
        </div>

        <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[7px] font-mono text-white/20 uppercase tracking-tighter">Est_Size</span>
            <span className="text-[10px] text-white/60 font-mono">~14.2MB</span>
          </div>
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="px-8 py-2.5 rounded-md bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-gold relative overflow-hidden group"
          >
            {exporting ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              'Initiate_Compile'
            )}
            {exporting && (
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 2.5, ease: "linear" }}
                className="absolute inset-0 bg-gold/30"
              />
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
