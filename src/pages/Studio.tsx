import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Zap,
  Undo2,
  Redo2,
  Library,
  History as HistoryIcon
} from 'lucide-react';
import { Scene3D } from '../components/Scene3D';
import { PatternEditor } from '../components/PatternEditor';
import { AssetLibrary } from '../components/AssetLibrary';
import { VersionHistory } from '../components/VersionHistory';
import { SceneOutliner } from '../components/SceneOutliner';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { RangeControl, ToggleControl } from '../components/ui/StudioPrimitives';
import { useEditorStore } from '../store/useEditorStore';
import { useStore } from 'zustand';

export const StudioPage = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const undo = useStore(useEditorStore.temporal, (state) => state.undo);
  const redo = useStore(useEditorStore.temporal, (state) => state.redo);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);
  
  const mode = useEditorStore((state) => state.mode);
  const setMode = useEditorStore((state) => state.setMode);
  const isAssetLibraryOpen = useEditorStore((state) => state.isAssetLibraryOpen);
  const setIsAssetLibraryOpen = useEditorStore((state) => state.setIsAssetLibraryOpen);
  const isHistoryOpen = useEditorStore((state) => state.isHistoryOpen);
  const setIsHistoryOpen = useEditorStore((state) => state.setIsHistoryOpen);
  const isOutlinerOpen = useEditorStore((state) => state.isOutlinerOpen);
  const setIsOutlinerOpen = useEditorStore((state) => state.setIsOutlinerOpen);
  const selectedColor = useEditorStore((state) => state.selectedColor);
  const setSelectedColor = useEditorStore((state) => state.setSelectedColor);
  const garmentSize = useEditorStore((state) => state.garmentSize);
  const setGarmentSize = useEditorStore((state) => state.setGarmentSize);
  const clothDeformation = useEditorStore((state) => state.clothDeformation);
  const setClothDeformation = useEditorStore((state) => state.setClothDeformation);
  const showMannequin = useEditorStore((state) => state.showMannequin);
  const setShowMannequin = useEditorStore((state) => state.setShowMannequin);
  const showStitching = useEditorStore((state) => state.showStitching);
  const setShowStitching = useEditorStore((state) => state.setShowStitching);
  const furnitureWidth = useEditorStore((state) => state.furnitureWidth);
  const setFurnitureWidth = useEditorStore((state) => state.setFurnitureWidth);
  const furnitureHeight = useEditorStore((state) => state.furnitureHeight);
  const setFurnitureHeight = useEditorStore((state) => state.setFurnitureHeight);
  const furnitureDepth = useEditorStore((state) => state.furnitureDepth);
  const setFurnitureDepth = useEditorStore((state) => state.setFurnitureDepth);
  const isExploded = useEditorStore((state) => state.isExploded);
  const setIsExploded = useEditorStore((state) => state.setIsExploded);
  const woodTexture = useEditorStore((state) => state.woodTexture);
  const setWoodTexture = useEditorStore((state) => state.setWoodTexture);
  const wireframe = useEditorStore((state) => state.wireframe);
  const setWireframe = useEditorStore((state) => state.setWireframe);
  const autoRotate = useEditorStore((state) => state.autoRotate);
  const setAutoRotate = useEditorStore((state) => state.setAutoRotate);
  const showGrid = useEditorStore((state) => state.showGrid);
  const setShowGrid = useEditorStore((state) => state.setShowGrid);
  const gridSize = useEditorStore((state) => state.gridSize);
  const setGridSize = useEditorStore((state) => state.setGridSize);
  
  const isRendering = useEditorStore((state) => state.isRendering);
  const setIsRendering = useEditorStore((state) => state.setIsRendering);
  const renderProgress = useEditorStore((state) => state.renderProgress);
  const renderSamples = useEditorStore((state) => state.renderSamples);

  const handleStartRender = () => {
    setIsRendering(true);
  };

  const handleStopRender = () => {
    setIsRendering(false);
  };

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
            <StudioTool 
              active={isAssetLibraryOpen} 
              onClick={() => setIsAssetLibraryOpen(!isAssetLibraryOpen)}
              icon={<Library size={18} />}
              label="ASSETS"
            />
            <StudioTool 
              active={isHistoryOpen} 
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              icon={<HistoryIcon size={18} />}
              label="HISTORY"
            />
            <StudioTool 
              active={isOutlinerOpen} 
              onClick={() => setIsOutlinerOpen(!isOutlinerOpen)}
              icon={<Layers size={18} />}
              label="SCENE"
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
        {mode === 'fashion' && !isAssetLibraryOpen && !isHistoryOpen && (
          <div className="hidden lg:block w-[450px] border-r border-white/5 bg-[#050505]">
            <PatternEditor />
          </div>
        )}

        {/* Asset Library Workspace */}
        {isAssetLibraryOpen && !isHistoryOpen && !isOutlinerOpen && (
          <div className="hidden lg:block w-[320px] border-r border-white/5 bg-[#050505]">
            <AssetLibrary />
          </div>
        )}

        {/* Version History Workspace */}
        {isHistoryOpen && !isOutlinerOpen && (
          <div className="hidden lg:block w-[320px] border-r border-white/5 bg-[#050505]">
            <VersionHistory />
          </div>
        )}

        {/* Scene Outliner Workspace */}
        {isOutlinerOpen && (
          <div className="hidden lg:block w-[320px] border-r border-white/5 bg-[#050505]">
            <SceneOutliner />
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
              <button 
                onClick={() => undo()}
                className="p-2 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-all"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={14} />
              </button>
              <button 
                onClick={() => redo()}
                className="p-2 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-all"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 size={14} />
              </button>
              <div className="w-px h-full bg-white/10 mx-1" />
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
              <button 
                onClick={handleStartRender}
                className="px-4 py-1.5 rounded-md bg-white/10 text-white font-bold text-[9px] flex items-center gap-2 hover:bg-white/20 transition-all tracking-widest"
              >
                <Zap size={14} className="text-gold" /> STUDIO_RENDER
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isRendering && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-[#000]/90 backdrop-blur-xl flex flex-col items-center justify-center p-12"
              >
                <div className="w-full max-w-md space-y-8 text-center">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
                    <Zap size={48} className="text-gold relative animate-pulse" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold tracking-[0.5em] text-white uppercase italic">Studio_Path_Tracer</h2>
                    <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Accumulating_Samples // HQ_PASS_ACTIVE</p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className="absolute h-full bg-gold"
                        initial={{ width: 0 }}
                        animate={{ width: `${renderProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between font-mono text-[9px] text-white/20">
                      <span>PROGRESS: {Math.round(renderProgress)}%</span>
                      <span>SAMPLES: {renderSamples} / 50</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleStopRender}
                    className="px-10 py-3 border border-white/10 rounded-sm text-[10px] font-bold text-white/40 hover:text-white hover:border-gold/40 transition-all uppercase tracking-[0.3em]"
                  >
                    Exit_Renderer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
          <PropertiesPanel />
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
