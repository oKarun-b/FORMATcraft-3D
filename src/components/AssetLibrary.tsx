import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Box, Image as ImageIcon, Cpu, X, Download, Plus } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';

interface Asset {
  id: string;
  name: string;
  category: 'models' | 'textures' | 'components';
  thumbnail: string;
  url: string;
}

const ASSETS: Asset[] = [
  // Models
  {
    id: 'm1',
    name: 'Industrial Chair',
    category: 'models',
    thumbnail: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=300',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb'
  },
  {
    id: 'm2',
    name: 'Minimal Lamp',
    category: 'models',
    thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=300',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb'
  },
  {
    id: 'm4',
    name: 'Wooden Table',
    category: 'models',
    thumbnail: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=300',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb' // Placeholder
  },
  {
    id: 'm5',
    name: 'Studio Stool',
    category: 'models',
    thumbnail: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=300',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SimpleMeshes/glTF-Binary/SimpleMeshes.glb'
  },
  
  // Textures
  {
    id: 't1',
    name: 'Raw Denim',
    category: 'textures',
    thumbnail: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=300',
    url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1080'
  },
  {
    id: 't2',
    name: 'Heavy Cotton',
    category: 'textures',
    thumbnail: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=300',
    url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1080'
  },
  {
    id: 't3',
    name: 'Aged Oak',
    category: 'textures',
    thumbnail: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=300',
    url: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=1080'
  },
  {
    id: 't4',
    name: 'Brushed Steel',
    category: 'textures',
    thumbnail: 'https://images.unsplash.com/photo-1530260626688-0482da93740e?q=80&w=300',
    url: 'https://images.unsplash.com/photo-1530260626688-0482da93740e?q=80&w=1080'
  },

  // Components
  {
    id: 'c1',
    name: 'Hardware Kit',
    category: 'components',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/HardwareKit/glTF-Binary/HardwareKit.glb'
  },
  {
    id: 'c2',
    name: 'Brass Fitting',
    category: 'components',
    thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=300',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb'
  },
];

export const AssetLibrary = () => {
  const [search, setSearch] = useState('');
  const setIsAssetLibraryOpen = useEditorStore((state) => state.setIsAssetLibraryOpen);
  const activeCategory = useEditorStore((state) => state.activeAssetCategory);
  const setActiveCategory = useEditorStore((state) => state.setActiveAssetCategory);

  const filteredAssets = useMemo(() => {
    return ASSETS.filter(asset => 
      asset.category === activeCategory &&
      asset.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [activeCategory, search]);

  const handleDragStart = (e: React.DragEvent, asset: Asset) => {
    e.dataTransfer.setData('application/x-asset', JSON.stringify(asset));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <Database size={14} className="text-gold" />
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40 font-mono">Asset_Library.db</span>
        </div>
        <button 
          onClick={() => setIsAssetLibraryOpen(false)}
          className="text-white/20 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/5">
        <div className="relative group">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" />
          <input 
            type="text"
            placeholder="Search_Assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-sm py-2 pl-9 pr-4 text-[9px] font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex border-b border-white/5">
        <CategoryTab 
          active={activeCategory === 'models'} 
          onClick={() => setActiveCategory('models')}
          icon={<Box size={14} />}
          label="MODELS"
        />
        <CategoryTab 
          active={activeCategory === 'textures'} 
          onClick={() => setActiveCategory('textures')}
          icon={<ImageIcon size={14} />}
          label="TEX"
        />
        <CategoryTab 
          active={activeCategory === 'components'} 
          onClick={() => setActiveCategory('components')}
          icon={<Cpu size={14} />}
          label="COMP"
        />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <div className="grid grid-cols-2 gap-3 pb-24">
          <AnimatePresence mode="popLayout">
            {filteredAssets.map((asset) => (
              <motion.div
                layout
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                draggable
                onDragStart={(e) => handleDragStart(e, asset)}
                className="group cursor-grab active:cursor-grabbing"
              >
                <div className="relative aspect-square rounded-sm overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-gold/30 bg-white/[0.02]">
                  <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover transition-all duration-700 scale-110 group-hover:scale-100 opacity-60 group-hover:opacity-100" />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end gap-1">
                    <span className="text-[7px] font-mono font-bold text-white uppercase tracking-widest leading-tight">{asset.name}</span>
                    <div className="flex justify-between items-center">
                       <span className="text-[6px] font-mono text-gold/60 uppercase">Ready_to_Drop</span>
                       <Plus size={8} className="text-gold" />
                    </div>
                  </div>

                  {/* Icon Indicator */}
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-sm bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center pointer-events-none transition-all group-hover:scale-110 group-hover:bg-gold/20 group-hover:border-gold/40">
                    {asset.category === 'models' && <Box size={10} className="text-white/40 group-hover:text-gold" />}
                    {asset.category === 'textures' && <ImageIcon size={10} className="text-white/40 group-hover:text-gold" />}
                    {asset.category === 'components' && <Cpu size={10} className="text-white/40 group-hover:text-gold" />}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredAssets.length === 0 && (
            <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-dashed border-white/10">
                <Search size={16} className="text-white/10" />
              </div>
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Zero_Matches_Found</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[7px] font-mono text-white/20 uppercase tracking-tighter">Total_Library</span>
          <span className="text-[9px] text-white/40 font-mono italic">{ASSETS.length} Assets_Available</span>
        </div>
        <button className="p-2 text-white/20 hover:text-gold transition-colors">
          <Download size={12} />
        </button>
      </div>
    </div>
  );
};

const CategoryTab = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 flex flex-col items-center gap-1.5 transition-all relative overflow-hidden ${active ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
  >
    {active && (
      <motion.div 
        layoutId="activeTab"
        className="absolute inset-0 bg-white/[0.02]"
      />
    )}
    {icon}
    <span className="text-[7px] font-mono font-bold tracking-[0.3em] uppercase">{label}</span>
    {active && (
      <motion.div 
        layoutId="activeTabUnderline"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
      />
    )}
  </button>
);

const Database = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>
  </svg>
);
