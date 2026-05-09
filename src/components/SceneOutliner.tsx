import React, { useState } from 'react';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ChevronDown, 
  Box, 
  Type, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { useEditorStore } from '@/src/store/useEditorStore';
import { motion, AnimatePresence } from 'motion/react';

interface OutlinerItemProps {
  id: string;
  name: string;
  type: string;
  isVisible: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onRename: (newName: string) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const OutlinerItem = ({ 
  id, 
  name, 
  type, 
  isVisible, 
  isSelected, 
  onSelect, 
  onToggleVisibility, 
  onRename,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast
}: OutlinerItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);

  const handleStartEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(name);
  };

  const handleConfirmRename = () => {
    if (editValue.trim()) {
      onRename(editValue);
    }
    setIsEditing(false);
  };

  const handleCancelRename = () => {
    setIsEditing(false);
    setEditValue(name);
  };

  return (
    <div 
      className={`group flex items-center px-4 py-2 border-b border-white/5 transition-all cursor-pointer ${isSelected ? 'bg-gold/10' : 'hover:bg-white/[0.02]'}`}
      onClick={onSelect}
    >
      <button 
        className={`mr-3 transition-colors ${isVisible ? 'text-white/40 hover:text-white' : 'text-gold/60'}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility();
        }}
      >
        {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
      </button>

      <div className="mr-3 text-white/20">
        <Box size={12} />
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center" onClick={e => e.stopPropagation()}>
            <input
              autoFocus
              className="w-full bg-white/10 border-none text-[10px] py-0.5 px-1 outline-none text-white font-mono"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleConfirmRename();
                if (e.key === 'Escape') handleCancelRename();
              }}
            />
            <button onClick={handleConfirmRename} className="ml-1 text-gold"><Check size={10} /></button>
            <button onClick={handleCancelRename} className="ml-1 text-white/40"><X size={10} /></button>
          </div>
        ) : (
          <div className="flex items-center">
            <span className={`text-[10px] font-mono truncate mr-2 ${isSelected ? 'text-gold' : 'text-white/60'}`}>
              {name}
            </span>
            <button 
              className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white"
              onClick={handleStartEditing}
            >
              <Edit2 size={8} />
            </button>
          </div>
        )}
        <div className="text-[7px] text-white/20 uppercase tracking-widest leading-none mt-0.5">
          {type}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onMoveUp && (
          <button 
            disabled={isFirst}
            className={`p-1 rounded-sm hover:bg-white/10 transition-colors ${isFirst ? 'text-white/5 cursor-not-allowed' : 'text-white/40'}`}
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
          >
            <ArrowUp size={10} />
          </button>
        )}
        {onMoveDown && (
          <button 
            disabled={isLast}
            className={`p-1 rounded-sm hover:bg-white/10 transition-colors ${isLast ? 'text-white/5 cursor-not-allowed' : 'text-white/40'}`}
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
          >
            <ArrowDown size={10} />
          </button>
        )}
        {onRemove && (
          <button 
            className="p-1 rounded-sm hover:bg-red-500/20 text-white/20 hover:text-red-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 size={10} />
          </button>
        )}
      </div>
    </div>
  );
};

export const SceneOutliner = () => {
  const { 
    isOutlinerOpen, 
    setIsOutlinerOpen,
    mode,
    placedAssets,
    selectedPlacedAssetId,
    setSelectedPlacedAssetId,
    sceneObjectVisibility,
    toggleObjectVisibility,
    sceneObjectNames,
    renameObject,
    reorderPlacedAssets,
    removePlacedAsset,
    garmentType,
    furnitureType
  } = useEditorStore();

  const [isAssetsExpanded, setIsAssetsExpanded] = useState(true);

  if (!isOutlinerOpen) return null;

  const mainObjectId = mode === 'fashion' ? 'main_garment' : 'main_furniture';
  const mainObjectName = sceneObjectNames[mainObjectId] || (mode === 'fashion' ? garmentType.toUpperCase() : furnitureType.toUpperCase());
  const mainObjectVisible = sceneObjectVisibility[mainObjectId] ?? true;

  return (
    <div 
      className="h-full bg-black/40 flex flex-col"
    >
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-gold" />
          <h2 className="text-[10px] font-mono text-white/80 uppercase tracking-[0.2em] font-medium">Scene Outliner</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {/* Main Object Section */}
        <div className="mb-6 px-1">
          <div className="flex items-center px-4 py-2 text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">
            Primary Object
          </div>
          <OutlinerItem
            id={mainObjectId}
            name={mainObjectName}
            type={mode === 'fashion' ? 'Garment' : 'Furniture'}
            isVisible={mainObjectVisible}
            isSelected={selectedPlacedAssetId === mainObjectId}
            onSelect={() => setSelectedPlacedAssetId(mainObjectId)}
            onToggleVisibility={() => toggleObjectVisibility(mainObjectId)}
            onRename={(name) => renameObject(mainObjectId, name)}
          />
        </div>

        {/* Placed Assets Section */}
        <div className="px-1">
          <button 
            className="flex items-center px-4 py-2 w-full text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] hover:text-white/40 transition-colors"
            onClick={() => setIsAssetsExpanded(!isAssetsExpanded)}
          >
            {isAssetsExpanded ? <ChevronDown size={10} className="mr-2" /> : <ChevronRight size={10} className="mr-2" />}
            Placed Assets ({placedAssets.length})
          </button>
          
          <AnimatePresence>
            {isAssetsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {placedAssets.length === 0 ? (
                  <div className="px-8 py-8 text-center">
                    <p className="text-[8px] font-mono text-white/10 uppercase tracking-widest italic">No assets placed</p>
                  </div>
                ) : (
                  placedAssets.map((asset, index) => (
                    <OutlinerItem
                      key={asset.id}
                      id={asset.id}
                      name={sceneObjectNames[asset.id] || asset.asset.name}
                      type={asset.asset.category}
                      isVisible={sceneObjectVisibility[asset.id] ?? true}
                      isSelected={selectedPlacedAssetId === asset.id}
                      onSelect={() => setSelectedPlacedAssetId(asset.id)}
                      onToggleVisibility={() => toggleObjectVisibility(asset.id)}
                      onRename={(name) => renameObject(asset.id, name)}
                      onRemove={() => removePlacedAsset(asset.id)}
                      onMoveUp={() => reorderPlacedAssets(index, index - 1)}
                      onMoveDown={() => reorderPlacedAssets(index, index + 1)}
                      isFirst={index === 0}
                      isLast={index === placedAssets.length - 1}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 bg-white/[0.01] border-t border-white/5">
        <div className="flex items-center gap-2 text-[8px] font-mono text-white/20 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
          {placedAssets.length + 1} Total Entities
        </div>
      </div>
    </div>
  );
};
