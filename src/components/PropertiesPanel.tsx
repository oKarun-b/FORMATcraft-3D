import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings2, 
  Maximize, 
  Rotate3d, 
  Move,
  Sun,
  Grid as GridIcon,
  Box,
  Trash2,
  Cpu,
  Layers,
  Zap,
  Magnet
} from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { PropertySection, RangeControl, ToggleControl } from './ui/StudioPrimitives';

export const PropertiesPanel = () => {
  const { 
    selectedPlacedAssetId, 
    placedAssets, 
    updatePlacedAsset, 
    removePlacedAsset,
    environment,
    setEnvironment,
    showEnvironmentBackground,
    setShowEnvironmentBackground,
    environmentIntensity,
    setEnvironmentIntensity,
    gridSize,
    setGridSize,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
    mode,
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
    setAutoRotate,
    garmentType,
    setGarmentType,
    furnitureType,
    setFurnitureType,
    mannequinBodyType,
    setMannequinBodyType,
    mannequinSkinTone,
    setMannequinSkinTone,
    mannequinHairStyle,
    setMannequinHairStyle,
    cameraFov,
    setCameraFov,
    cameraNear,
    setCameraNear,
    cameraFar,
    setCameraFar
  } = useEditorStore();

  const selectedAsset = placedAssets.find(a => a.id === selectedPlacedAssetId);

  const handleTransformChange = (axis: number, value: number, type: 'position' | 'rotation' | 'scale') => {
    if (!selectedAsset) return;
    const current = [...selectedAsset[type]] as [number, number, number];
    current[axis] = value;
    updatePlacedAsset(selectedAsset.id, { [type]: current });
  };

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <Settings2 size={14} className="text-gold" />
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40 font-mono">Properties_Inspector</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-10 no-scrollbar pb-32">
        {selectedAsset ? (
          <motion.div 
            key="asset-props"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Entity Identity */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Box size={12} className="text-gold" />
                  <span className="text-[9px] font-mono font-bold text-white uppercase">{selectedAsset.asset.name}</span>
                </div>
                <button 
                  onClick={() => removePlacedAsset(selectedAsset.id)}
                  className="text-white/20 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest leading-none">UUID: {selectedAsset.id}</span>
            </div>

            {/* Transform Controls */}
            <TransformGroup 
              label="Position" 
              icon={<Move size={12} />} 
              values={selectedAsset.position} 
              onChange={(axis, val) => handleTransformChange(axis, val, 'position')}
              step={0.1}
            />

            <TransformGroup 
              label="Rotation" 
              icon={<Rotate3d size={12} />} 
              values={selectedAsset.rotation} 
              onChange={(axis, val) => handleTransformChange(axis, val, 'rotation')}
              step={0.1}
            />

            <TransformGroup 
              label="Scale" 
              icon={<Maximize size={12} />} 
              values={selectedAsset.scale} 
              onChange={(axis, val) => handleTransformChange(axis, val, 'scale')}
              step={0.01}
            />

          </motion.div>
        ) : (
          <motion.div 
            key="global-props"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
          >
            {/* Mode Specifics */}
            <div className="space-y-8">
               <PropertySection title="Base Material">
                  <div className="grid grid-cols-5 gap-2">
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
                   <PropertySection title="Base Garment">
                      <div className="grid grid-cols-2 gap-1 px-1">
                        {(['tshirt', 'dress', 'hoodie', 'pants'] as const).map(type => (
                          <button 
                            key={type}
                            onClick={() => setGarmentType(type)}
                            className={`py-1.5 rounded-sm text-[8px] font-mono border transition-all uppercase ${garmentType === type ? 'bg-gold/10 border-gold text-gold' : 'bg-white/5 border-white/5 text-white/20 hover:border-white/10'}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                   </PropertySection>

                   <PropertySection title="Garment Simulation">
                      <div className="space-y-6">
                        <RangeControl 
                          label="Main Scale" 
                          value={Math.round(garmentSize * 100)} 
                          onChange={(v) => setGarmentSize(v / 100)}
                        />
                        <RangeControl 
                          label="Physics Distortion" 
                          value={Math.round(clothDeformation * 100)} 
                          onChange={(v) => setClothDeformation(v / 100)}
                        />
                      </div>
                   </PropertySection>

                   <PropertySection title="Layers">
                      <div className="space-y-1">
                        <ToggleControl label="Mannequin" active={showMannequin} onClick={() => setShowMannequin(!showMannequin)} />
                        {showMannequin && (
                          <div className="pt-4 pb-2 space-y-6">
                            <PropertySection title="Mannequin Skin">
                              <div className="grid grid-cols-5 gap-2">
                                {['#222222', '#4a3728', '#8d5524', '#c68642', '#e0ac69'].map(tone => (
                                  <button
                                    key={tone}
                                    onClick={() => setMannequinSkinTone(tone)}
                                    className={`aspect-square rounded-full border-2 transition-all ${mannequinSkinTone === tone ? 'border-gold scale-110' : 'border-white/5 hover:border-white/20'}`}
                                    style={{ backgroundColor: tone }}
                                  />
                                ))}
                              </div>
                            </PropertySection>

                            <div className="space-y-4">
                              <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Body Frame</span>
                              <div className="grid grid-cols-3 gap-1">
                                {(['slender', 'athletic', 'curvy'] as const).map(type => (
                                  <button
                                    key={type}
                                    onClick={() => setMannequinBodyType(type)}
                                    className={`py-1.5 rounded-sm border text-[7px] uppercase tracking-widest transition-all ${mannequinBodyType === type ? 'bg-gold/10 border-gold text-gold' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-4">
                               <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Head Style</span>
                               <div className="grid grid-cols-3 gap-1">
                                {(['none', 'short', 'bob', 'long'] as const).map(style => (
                                  <button
                                    key={style}
                                    onClick={() => setMannequinHairStyle(style)}
                                    className={`py-1.5 rounded-sm border text-[7px] uppercase tracking-widest transition-all ${mannequinHairStyle === style ? 'bg-gold/10 border-gold text-gold' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
                                  >
                                    {style === 'none' ? 'bald' : style}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2">
                               <span className="text-[8px] font-mono text-gold/40 uppercase tracking-[0.2em] block mb-3">Quick Presets</span>
                               <div className="grid grid-cols-2 gap-2">
                                  <button 
                                    onClick={() => {
                                      setMannequinBodyType('athletic');
                                      setMannequinSkinTone('#4a3728');
                                      setMannequinHairStyle('short');
                                    }}
                                    className="p-2 bg-white/[0.02] border border-white/10 rounded-sm text-[7px] font-mono uppercase tracking-widest text-white/60 hover:bg-gold/10 hover:border-gold/30 hover:text-white transition-all text-left"
                                  >
                                    01_Urban_Fit
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setMannequinBodyType('slender');
                                      setMannequinSkinTone('#e0ac69');
                                      setMannequinHairStyle('long');
                                    }}
                                    className="p-2 bg-white/[0.02] border border-white/10 rounded-sm text-[7px] font-mono uppercase tracking-widest text-white/60 hover:bg-gold/10 hover:border-gold/30 hover:text-white transition-all text-left"
                                  >
                                    02_Ethereal
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setMannequinBodyType('curvy');
                                      setMannequinSkinTone('#222222');
                                      setMannequinHairStyle('bob');
                                    }}
                                    className="p-2 bg-white/[0.02] border border-white/10 rounded-sm text-[7px] font-mono uppercase tracking-widest text-white/60 hover:bg-gold/10 hover:border-gold/30 hover:text-white transition-all text-left"
                                  >
                                    03_Nocturnal
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setMannequinBodyType('slender');
                                      setMannequinSkinTone('#8d5524');
                                      setMannequinHairStyle('none');
                                    }}
                                    className="p-2 bg-white/[0.02] border border-white/10 rounded-sm text-[7px] font-mono uppercase tracking-widest text-white/60 hover:bg-gold/10 hover:border-gold/30 hover:text-white transition-all text-left"
                                  >
                                    04_Brutalist
                                  </button>
                               </div>
                            </div>
                          </div>
                        )}
                        <ToggleControl label="Stitching" active={showStitching} onClick={() => setShowStitching(!showStitching)} />
                        <ToggleControl label="Wireframe" active={wireframe} onClick={() => setWireframe(!wireframe)} />
                      </div>
                   </PropertySection>
                 </>
               ) : (
                 <>
                   <PropertySection title="Furniture Type">
                      <div className="grid grid-cols-2 gap-1 px-1">
                        {(['shelf', 'table', 'chair', 'cabinet'] as const).map(type => (
                          <button 
                            key={type}
                            onClick={() => setFurnitureType(type)}
                            className={`py-1.5 rounded-sm text-[8px] font-mono border transition-all uppercase ${furnitureType === type ? 'bg-gold/10 border-gold text-gold' : 'bg-white/5 border-white/5 text-white/20 hover:border-white/10'}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                   </PropertySection>

                   <PropertySection title="Geometry Logic">
                      <div className="space-y-6">
                        <RangeControl label="Width" value={Math.round(furnitureWidth * 40)} onChange={(v) => setFurnitureWidth(v / 40)} />
                        <RangeControl label="Height" value={Math.round(furnitureHeight * 50)} onChange={(v) => setFurnitureHeight(v / 50)} />
                        <RangeControl label="Depth" value={Math.round(furnitureDepth * 80)} onChange={(v) => setFurnitureDepth(v / 80)} />
                      </div>
                   </PropertySection>

                   <PropertySection title="Wood Texture">
                      <div className="grid grid-cols-3 gap-1">
                        {['oak', 'walnut', 'pine'].map(t => (
                          <button
                            key={t}
                            onClick={() => setWoodTexture(t)}
                            className={`py-1.5 rounded-sm border text-[8px] uppercase tracking-widest transition-all ${woodTexture === t ? 'bg-gold/10 border-gold text-gold' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                   </PropertySection>

                   <PropertySection title="Structural view">
                      <div className="space-y-1">
                        <ToggleControl label="Exploded Mode" active={isExploded} onClick={() => setIsExploded(!isExploded)} />
                        <ToggleControl label="Wireframe" active={wireframe} onClick={() => setWireframe(!wireframe)} />
                      </div>
                   </PropertySection>
                 </>
               )}
            </div>

            <div className="h-px bg-white/5 mx-[-1rem]" />

            {/* Global Scene Controls */}
            <div className="space-y-8">
               <PropertySection title="Environment Lighting">
                 <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-1 px-1">
                      {(['studio', 'city', 'park', 'lobby', 'apartment', 'forest', 'dawn', 'sunset', 'warehouse'] as const).map(env => (
                        <button 
                          key={env}
                          onClick={() => setEnvironment(env)}
                          className={`py-1.5 rounded-sm text-[7px] font-mono border transition-all uppercase ${environment === env ? 'bg-gold/10 border-gold text-gold shadow-[0_0_10px_rgba(212,175,55,0.1)]' : 'bg-white/5 border-white/5 text-white/20 hover:border-white/10'}`}
                        >
                          {env}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <ToggleControl 
                        label="Draw Background" 
                        active={showEnvironmentBackground} 
                        onClick={() => setShowEnvironmentBackground(!showEnvironmentBackground)} 
                        icon={<Sun size={10} />}
                      />
                      
                      <RangeControl 
                        label="HDRI Intensity" 
                        value={Math.round(environmentIntensity * 50)} 
                        onChange={(v) => setEnvironmentIntensity(v / 50)} 
                      />
                    </div>
                 </div>
               </PropertySection>

               <PropertySection title="Viewport Grid">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                       <ToggleControl label="Show Grid" active={showGrid} onClick={() => setShowGrid(!showGrid)} />
                    </div>
                    
                    {showGrid && (
                       <>
                         <RangeControl label="Grid Density" value={gridSize} onChange={setGridSize} />
                         <ToggleControl label="Snap to Grid" active={snapToGrid} onClick={() => setSnapToGrid(!snapToGrid)} icon={<Magnet size={10} />} />
                       </>
                    )}
                  </div>
               </PropertySection>

               <PropertySection title="Camera Precision">
                  <div className="space-y-6">
                    <RangeControl 
                      label="Field of View" 
                      value={cameraFov} 
                      onChange={setCameraFov} 
                      min={10} 
                      max={120} 
                    />
                    <RangeControl 
                      label="Near Clipping" 
                      value={Math.round(cameraNear * 100)} 
                      onChange={(v) => setCameraNear(v / 100)} 
                      min={1} 
                      max={100} 
                    />
                    <RangeControl 
                      label="Far Clipping" 
                      value={Math.round(cameraFar / 10)} 
                      onChange={(v) => setCameraFar(v * 10)} 
                      min={10} 
                      max={200} 
                    />
                  </div>
               </PropertySection>

               <PropertySection title="Automation">
                  <ToggleControl label="Auto Rotation" active={autoRotate} onClick={() => setAutoRotate(!autoRotate)} />
               </PropertySection>
            </div>

            <div className="pt-4">
               <div className="p-4 rounded-sm bg-gold/5 border border-gold/10 space-y-4">
                  <div className="flex items-center gap-2">
                    <Cpu size={12} className="text-gold" />
                    <span className="text-[9px] font-bold text-white/60 uppercase tracking-[0.2em] italic">Intelligence_Active</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[7px] font-mono text-white/40 uppercase tracking-widest">
                       <span>Optimization_Pass</span>
                       <span>OK</span>
                    </div>
                    <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-gold/40" style={{ width: '85%' }} />
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Compile Button */}
      <div className="p-4 bg-black/40 backdrop-blur-xl border-t border-white/5">
         <button className="w-full py-3 bg-white text-black font-bold text-[9px] tracking-[0.3em] uppercase rounded-sm hover:bg-gold transition-all active:scale-95 shadow-xl">
            Compile_Final_Output
         </button>
      </div>
    </div>
  );
};

const TransformGroup = ({ label, icon, values, onChange, step = 0.1 }: { 
  label: string, 
  icon: React.ReactNode, 
  values: [number, number, number], 
  onChange: (axis: number, val: number) => void,
  step?: number
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-1">
      <div className="text-gold/60">{icon}</div>
      <span className="text-[9px] font-mono font-black text-white/30 uppercase tracking-widest">{label}</span>
      <div className="h-px bg-white/5 flex-1" />
    </div>
    <div className="grid grid-cols-3 gap-2 px-1">
      {['X', 'Y', 'Z'].map((axis, i) => (
        <div key={axis} className="space-y-1.5 p-2 bg-white/[0.03] border border-white/5 rounded-sm">
          <span className="text-[7px] font-mono text-white/20 uppercase block">{axis}</span>
          <input 
            type="number"
            step={step}
            value={values[i].toFixed(2)}
            onChange={(e) => onChange(i, parseFloat(e.target.value))}
            className="w-full bg-transparent p-0 text-[10px] font-mono text-white outline-none"
          />
        </div>
      ))}
    </div>
  </div>
);
