import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useEditorStore } from '../store/useEditorStore';

export const PatternEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const isInternalChange = useRef(false);
  const mode = useEditorStore((state) => state.mode);
  const selectedColor = useEditorStore((state) => state.selectedColor);
  const setTexture = useEditorStore((state) => state.setTexture);
  const patternData = useEditorStore((state) => state.patternData);
  const setPatternData = useEditorStore((state) => state.setPatternData);
  const lastTexture = useRef<string | null>(null);

  const [uploadedTextures, setUploadedTextures] = React.useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fabricPresets = [
    { name: 'Silk', color: '#f8fafc', texture: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1080' },
    { name: 'Denim', color: '#1e3a8a', texture: 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?q=80&w=1080' },
    { name: 'Linen', color: '#f5f5f4', texture: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=1080' },
    { name: 'Velvet', color: '#4c1d95', texture: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1080' },
  ];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setUploadedTextures(prev => [url, ...prev]);
        handleFabricDrop(url); // Auto-apply to selection
      };
      reader.readAsDataURL(file);
    }
  };

  // Initialize Canvas
  useEffect(() => {
    // Global Fabric Settings to prevent tainted canvas issue
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.objectCaching = false;
    (fabric.Image.prototype as any).crossOrigin = 'anonymous';
    
    if (canvasRef.current && !fabricCanvas.current) {
      fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
        width: 450,
        height: 650,
        backgroundColor: '#000',
      });

      const updateStore = () => {
        if (!fabricCanvas.current || isInternalChange.current) return;
        const currentData = fabricCanvas.current.toJSON();
        
        isInternalChange.current = true;
        setPatternData(currentData);
        setTimeout(() => { isInternalChange.current = false; }, 200);
      };

      // Add a default pattern piece (Front Panel) if no patternData exists
      if (!patternData) {
        const frontPanel = new fabric.Polygon([
          { x: 150, y: 50 },
          { x: 350, y: 50 },
          { x: 400, y: 400 },
          { x: 100, y: 400 },
        ], {
          left: 50,
          top: 50,
          fill: selectedColor + '33',
          stroke: selectedColor,
          strokeWidth: 2,
          strokeDashArray: [5, 5],
        });

        fabricCanvas.current.add(frontPanel);
        setPatternData(fabricCanvas.current.toJSON());
      } else {
        isInternalChange.current = true;
        fabricCanvas.current.loadFromJSON(patternData, () => {
          fabricCanvas.current?.renderAll();
          setTimeout(() => { isInternalChange.current = false; }, 200);
        });
      }

      fabricCanvas.current.on('object:modified', updateStore);
      fabricCanvas.current.on('object:added', updateStore);
      fabricCanvas.current.on('object:removed', updateStore);
    }

    return () => {
      // fabricCanvas.current?.dispose(); // Keep it for now to avoid re-init issues in dev
    };
  }, []);

  // Sync from patternData (Undo/Redo)
  useEffect(() => {
    if (fabricCanvas.current && patternData && !isInternalChange.current) {
      const currentJSON = JSON.stringify(fabricCanvas.current.toJSON());
      const newJSON = JSON.stringify(patternData);
      
      if (currentJSON !== newJSON) {
        isInternalChange.current = true;
        fabricCanvas.current.loadFromJSON(patternData, () => {
          fabricCanvas.current?.renderAll();
          setTimeout(() => { isInternalChange.current = false; }, 100);
        });
      }
    }
  }, [patternData]);

  useEffect(() => {
    if (fabricCanvas.current) {
      const activeObject = fabricCanvas.current.getActiveObject();
      if (activeObject) {
        activeObject.set('stroke', selectedColor);
        activeObject.set('fill', selectedColor + '33');
        fabricCanvas.current.renderAll();
        // Update store for color change too
        if (!isInternalChange.current) {
          isInternalChange.current = true;
          setPatternData(fabricCanvas.current.toJSON());
          setTimeout(() => { isInternalChange.current = false; }, 50);
        }
      } else {
        const firstObj = fabricCanvas.current.getObjects()[0];
        if (firstObj) {
          firstObj.set('stroke', selectedColor);
          firstObj.set('fill', selectedColor + '33');
          fabricCanvas.current.renderAll();
        }
      }
    }
  }, [selectedColor]);

  const handleFabricDrop = (textureUrl: string) => {
    lastTexture.current = textureUrl;
    if (fabricCanvas.current) {
      const activeObject = fabricCanvas.current.getActiveObject() || fabricCanvas.current.getObjects()[0];
      if (activeObject) {
        fabric.Image.fromURL(textureUrl, (img) => {
          img.scale(0.5);
          const patternSourceCanvas = new fabric.StaticCanvas(null, { width: 100, height: 100 });
          patternSourceCanvas.add(img);
          const pattern = new fabric.Pattern({
            source: patternSourceCanvas.getElement() as HTMLCanvasElement,
            repeat: 'repeat'
          });
          activeObject.set('fill', pattern);
          fabricCanvas.current?.renderAll();
          
          if (!isInternalChange.current) {
            isInternalChange.current = true;
            setPatternData(fabricCanvas.current?.toJSON());
            setTimeout(() => { isInternalChange.current = false; }, 50);
          }
        }, { crossOrigin: 'anonymous' });
      }
    }
  };

  const [syncing, setSyncing] = React.useState(false);
  const handleSync = () => {
    setSyncing(true);
    
    // For this prototype, syncing means "committing" changes to the 3D view
    setTimeout(() => {
      if (lastTexture.current) {
        setTexture(lastTexture.current);
      }
      setSyncing(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] border-r border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black relative">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-1.5 rounded-full ${syncing ? 'bg-gold animate-ping' : 'bg-gold/20'}`} />
          <span className="text-[9px] font-mono text-white/30 tracking-[0.4em] uppercase font-bold">
            Project_Stream // CAD_L01
          </span>
        </div>
        <div className="flex gap-2">
          <button className="text-[8px] font-mono font-bold text-white/10 uppercase hover:text-white transition-colors tracking-[0.2em] px-2 py-1">UV_XPORT</button>
          <div className="w-px h-3 bg-white/5 self-center" />
          <button 
            onClick={handleSync}
            className={`text-[8px] font-mono font-bold uppercase transition-all tracking-[0.2em] px-3 py-1 rounded-sm ${syncing ? 'bg-gold text-black' : 'text-gold/60 hover:text-gold border border-gold/20 hover:border-gold/40'}`}
          >
            {syncing ? 'SYNC_PUSH' : 'RE_SYNC'}
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* Left Vertical Micro-Toolbar */}
        <div className="w-12 border-r border-white/5 flex flex-col items-center py-4 gap-4 bg-black">
          {[
            { icon: '✂️', label: 'CUT' },
            { icon: '📏', label: 'MEAS' },
            { icon: '🧵', label: 'SEW' },
            { icon: '🖊️', label: 'DRAW' },
            { icon: '✨', label: 'AUTO' }
          ].map((tool, i) => (
            <button 
              key={i} 
              className="group relative w-8 h-8 rounded-md bg-white/5 border border-white/5 flex items-center justify-center text-sm hover:border-gold/40 transition-all"
            >
              <span className="grayscale contrast-125 group-hover:grayscale-0">{tool.icon}</span>
              <div className="absolute left-full ml-4 px-2 py-1 rounded bg-black border border-white/10 text-[7px] font-mono text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {tool.label}
              </div>
            </button>
          ))}
        </div>

        {/* Main Drafting Workspace */}
        <div className="flex-1 flex items-center justify-center bg-[#070707] overflow-hidden cad-grid relative p-4">
          <div className="relative shadow-2xl border border-white/10 bg-[#000]">
            <canvas ref={canvasRef} />
            
            {/* Viewport Anchors */}
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-mono text-gold tracking-widest bg-gold/5 border border-gold/20 px-1">L01_FRONT_PANEL</span>
                  <span className="text-[7px] font-mono text-white/20 tracking-widest">LAYER: ACTIVE_SPLINE</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">COORD: X154 Y291</span>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[7px] font-mono text-white/10 uppercase tracking-[0.4em]">Grid_Step: 10mm</span>
                <span className="text-[7px] font-mono text-white/10 uppercase tracking-[0.4em]">1:1.000_REAL_SCALE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Library Panel */}
        <div className="w-40 border-l border-white/5 bg-black overflow-y-auto no-scrollbar flex flex-col">
          <div className="p-4 border-b border-white/5">
             <span className="text-[8px] font-mono font-bold text-white/20 tracking-[0.3em] uppercase">Materials.lib</span>
          </div>
          <div className="flex-1 p-3 space-y-4 overflow-y-auto no-scrollbar">
            {/* Upload Section */}
            <div className="space-y-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 border border-dashed border-white/10 rounded-sm hover:border-gold/30 hover:bg-white/[0.02] transition-all group flex flex-col items-center justify-center gap-2"
              >
                <div className="text-white/20 group-hover:text-gold transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                </div>
                <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest group-hover:text-white/60">Upload_Source</span>
              </button>
            </div>

            {/* Custom Textures */}
            {uploadedTextures.length > 0 && (
              <div className="space-y-3">
                <span className="text-[7px] font-mono text-white/10 uppercase tracking-widest block border-b border-white/5 pb-1">User_Assets</span>
                <div className="grid grid-cols-1 gap-3">
                  {uploadedTextures.map((url, i) => (
                    <div 
                      key={i}
                      onClick={() => handleFabricDrop(url)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-video rounded-sm overflow-hidden border border-white/10 transition-all duration-500 group-hover:border-gold/30">
                        <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover transition-all duration-700 scale-110 group-hover:scale-100" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-end p-2">
                          <span className="text-[7px] font-mono font-bold text-white/20 group-hover:text-white uppercase tracking-widest">DRIVE_0{i+1}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Presets */}
            <div className="space-y-3">
              <span className="text-[7px] font-mono text-white/10 uppercase tracking-widest block border-b border-white/5 pb-1">Library_Ref</span>
              <div className="grid grid-cols-1 gap-3">
                {fabricPresets.map((f) => (
                  <div 
                    key={f.name}
                    onClick={() => handleFabricDrop(f.texture)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-video rounded-sm overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-gold/30">
                      <img src={f.texture} alt={f.name} className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-100" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-end p-2">
                        <span className="text-[7px] font-mono font-bold text-white/20 group-hover:text-white uppercase tracking-widest">{f.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-14 border-t border-white/5 bg-[#050505] flex justify-between items-center px-5 shrink-0">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest mb-0.5">Complexity</span>
            <span className="text-[10px] text-white/40 font-mono">1.2k_VERTS</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest mb-0.5">UV_Density</span>
            <span className="text-[10px] text-white/40 font-mono">82%_OPT</span>
          </div>
        </div>
        <button 
          onClick={handleSync}
          className={`px-6 py-2 rounded-sm text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-500 active:scale-95 flex items-center gap-2 ${syncing ? 'bg-gold text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-white/5 text-white/40 hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]'}`}
        >
          {syncing ? 'UPLOADING...' : 'COMMIT_MESH'}
        </button>
      </div>
    </div>
  );
};
