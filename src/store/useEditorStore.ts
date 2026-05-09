import { create } from 'zustand';
import { temporal } from 'zundo';

interface EditorState {
  mode: 'fashion' | 'carpentry';
  setMode: (mode: 'fashion' | 'carpentry') => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  texture: string | null;
  setTexture: (url: string | null) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  // Fashion Specifics
  garmentSize: number;
  setGarmentSize: (size: number) => void;
  clothDeformation: number;
  setClothDeformation: (v: number) => void;
  showMannequin: boolean;
  setShowMannequin: (show: boolean) => void;
  showStitching: boolean;
  setShowStitching: (show: boolean) => void;
  garmentType: 'tshirt' | 'dress' | 'hoodie' | 'pants';
  setGarmentType: (type: 'tshirt' | 'dress' | 'hoodie' | 'pants') => void;
  // Mannequin Customization
  mannequinBodyType: 'slender' | 'athletic' | 'curvy';
  setMannequinBodyType: (type: 'slender' | 'athletic' | 'curvy') => void;
  mannequinSkinTone: string;
  setMannequinSkinTone: (tone: string) => void;
  mannequinHairStyle: 'none' | 'short' | 'long' | 'bob';
  setMannequinHairStyle: (style: 'none' | 'short' | 'long' | 'bob') => void;
  // Carpenter Specifics
  furnitureWidth: number;
  setFurnitureWidth: (w: number) => void;
  furnitureHeight: number;
  setFurnitureHeight: (h: number) => void;
  furnitureDepth: number;
  setFurnitureDepth: (d: number) => void;
  furnitureType: 'shelf' | 'table' | 'chair' | 'cabinet';
  setFurnitureType: (type: 'shelf' | 'table' | 'chair' | 'cabinet') => void;
  isExploded: boolean;
  setIsExploded: (v: boolean) => void;
  woodTexture: string;
  setWoodTexture: (v: string) => void;
  wireframe: boolean;
  setWireframe: (v: boolean) => void;
  autoRotate: boolean;
  setAutoRotate: (v: boolean) => void;
  cameraView: 'perspective' | 'front' | 'top' | 'iso';
  setCameraView: (v: 'perspective' | 'front' | 'top' | 'iso') => void;
  // Grid Settings
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  // Scene Environment
  environment: 'studio' | 'city' | 'park' | 'lobby';
  setEnvironment: (env: 'studio' | 'city' | 'park' | 'lobby') => void;
  environmentIntensity: number;
  setEnvironmentIntensity: (v: number) => void;
  // Rendering Settings
  isRendering: boolean;
  setIsRendering: (rendering: boolean) => void;
  renderSamples: number;
  setRenderSamples: (samples: number) => void;
  renderProgress: number;
  setRenderProgress: (progress: number) => void;
  // Asset Library Settings
  isAssetLibraryOpen: boolean;
  setIsAssetLibraryOpen: (open: boolean) => void;
  activeAssetCategory: 'models' | 'textures' | 'components';
  setActiveAssetCategory: (category: 'models' | 'textures' | 'components') => void;
  // History Settings
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
  // Outliner Settings
  isOutlinerOpen: boolean;
  setIsOutlinerOpen: (open: boolean) => void;
  // Placed Assets for 3D Scene
  placedAssets: { id: string, assetId: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number, number], asset: any }[];
  addPlacedAsset: (asset: any, position: [number, number, number]) => void;
  updatePlacedAsset: (id: string, updates: Partial<{ position: [number, number, number], rotation: [number, number, number], scale: [number, number, number] }>) => void;
  removePlacedAsset: (id: string) => void;
  selectedPlacedAssetId: string | null;
  setSelectedPlacedAssetId: (id: string | null) => void;
  // Visibility & Naming
  sceneObjectVisibility: Record<string, boolean>;
  toggleObjectVisibility: (id: string) => void;
  sceneObjectNames: Record<string, string>;
  renameObject: (id: string, name: string) => void;
  reorderPlacedAssets: (startIndex: number, endIndex: number) => void;
  transformMode: 'translate' | 'rotate' | 'scale';
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
  // Camera Settings
  cameraFov: number;
  setCameraFov: (fov: number) => void;
  cameraNear: number;
  setCameraNear: (near: number) => void;
  cameraFar: number;
  setCameraFar: (far: number) => void;
  // Pattern Data (for undo/redo of 2D editor)
  patternData: any;
  setPatternData: (data: any) => void;
}

export const useEditorStore = create<EditorState>()(
  temporal(
    (set) => ({
      mode: 'fashion',
      setMode: (mode) => set({ mode }),
      selectedColor: '#ffffff',
      setSelectedColor: (selectedColor) => set({ selectedColor }),
      texture: null,
      setTexture: (texture) => set({ texture }),
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      zoom: 1,
      setZoom: (zoom) => set({ zoom }),
      garmentSize: 1,
      setGarmentSize: (garmentSize) => set({ garmentSize }),
      clothDeformation: 0.2,
      setClothDeformation: (clothDeformation) => set({ clothDeformation }),
      showMannequin: true,
      setShowMannequin: (showMannequin) => set({ showMannequin }),
      showStitching: true,
      setShowStitching: (showStitching) => set({ showStitching }),
      garmentType: 'tshirt',
      setGarmentType: (garmentType) => set({ garmentType }),
      mannequinBodyType: 'slender',
      setMannequinBodyType: (mannequinBodyType) => set({ mannequinBodyType }),
      mannequinSkinTone: '#222222',
      setMannequinSkinTone: (mannequinSkinTone) => set({ mannequinSkinTone }),
      mannequinHairStyle: 'none',
      setMannequinHairStyle: (mannequinHairStyle) => set({ mannequinHairStyle }),
      furnitureWidth: 1.2,
      setFurnitureWidth: (furnitureWidth) => set({ furnitureWidth }),
      furnitureHeight: 0.8,
      setFurnitureHeight: (furnitureHeight) => set({ furnitureHeight }),
      furnitureDepth: 0.6,
      setFurnitureDepth: (furnitureDepth) => set({ furnitureDepth }),
      furnitureType: 'shelf',
      setFurnitureType: (furnitureType) => set({ furnitureType }),
      isExploded: false,
      setIsExploded: (isExploded) => set({ isExploded }),
      woodTexture: 'oak',
      setWoodTexture: (woodTexture) => set({ woodTexture }),
      wireframe: false,
      setWireframe: (wireframe) => set({ wireframe }),
      autoRotate: true,
      setAutoRotate: (autoRotate) => set({ autoRotate }),
      cameraView: 'perspective',
      setCameraView: (cameraView) => set({ cameraView }),
      showGrid: true,
      setShowGrid: (showGrid) => set({ showGrid }),
      gridSize: 20,
      setGridSize: (gridSize) => set({ gridSize }),
      snapToGrid: false,
      setSnapToGrid: (snapToGrid) => set({ snapToGrid }),
      environment: 'studio',
      setEnvironment: (environment) => set({ environment }),
      environmentIntensity: 1,
      setEnvironmentIntensity: (environmentIntensity) => set({ environmentIntensity }),
      isRendering: false,
      setIsRendering: (isRendering) => set({ isRendering }),
      renderSamples: 0,
      setRenderSamples: (renderSamples) => set({ renderSamples }),
      renderProgress: 0,
      setRenderProgress: (renderProgress) => set({ renderProgress }),
      isAssetLibraryOpen: false,
      setIsAssetLibraryOpen: (isAssetLibraryOpen) => set({ isAssetLibraryOpen }),
      activeAssetCategory: 'models',
      setActiveAssetCategory: (activeAssetCategory) => set({ activeAssetCategory }),
      isHistoryOpen: false,
      setIsHistoryOpen: (isHistoryOpen) => set({ isHistoryOpen }),
      isOutlinerOpen: false,
      setIsOutlinerOpen: (isOutlinerOpen) => set({ isOutlinerOpen }),
      placedAssets: [],
      addPlacedAsset: (asset, position) => set((state) => {
        const id = Math.random().toString(36).substr(2, 9);
        return { 
          placedAssets: [...state.placedAssets, { 
            id, 
            assetId: asset.id, 
            position, 
            rotation: [0, 0, 0], 
            scale: [0.5, 0.5, 0.5], 
            asset 
          }],
          selectedPlacedAssetId: id
        };
      }),
      updatePlacedAsset: (id, updates) => set((state) => ({
        placedAssets: state.placedAssets.map(a => a.id === id ? { ...a, ...updates } : a)
      })),
      removePlacedAsset: (id) => set((state) => ({ 
        placedAssets: state.placedAssets.filter((a) => a.id !== id),
        selectedPlacedAssetId: state.selectedPlacedAssetId === id ? null : state.selectedPlacedAssetId
      })),
      selectedPlacedAssetId: null,
      setSelectedPlacedAssetId: (selectedPlacedAssetId) => set({ selectedPlacedAssetId }),
      transformMode: 'translate',
      setTransformMode: (transformMode) => set({ transformMode }),
      cameraFov: 35,
      setCameraFov: (cameraFov) => set({ cameraFov }),
      cameraNear: 0.1,
      setCameraNear: (cameraNear) => set({ cameraNear }),
      cameraFar: 1000,
      setCameraFar: (cameraFar) => set({ cameraFar }),
      // Scene Management implementations
      sceneObjectVisibility: {},
      toggleObjectVisibility: (id) => set((state) => ({
        sceneObjectVisibility: {
          ...state.sceneObjectVisibility,
          [id]: !(state.sceneObjectVisibility[id] ?? true)
        }
      })),
      sceneObjectNames: {},
      renameObject: (id, name) => set((state) => ({
        sceneObjectNames: {
          ...state.sceneObjectNames,
          [id]: name
        }
      })),
      reorderPlacedAssets: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.placedAssets);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { placedAssets: result };
      }),
      patternData: null,
      setPatternData: (patternData) => set({ patternData }),
    }),
    {
      partialize: (state) => {
        const {
          setMode,
          setSelectedColor,
          setTexture,
          toggleSidebar,
          setZoom,
          setGarmentSize,
          setClothDeformation,
          setShowMannequin,
          setShowStitching,
          setGarmentType,
          setMannequinBodyType,
          setMannequinSkinTone,
          setMannequinHairStyle,
          setFurnitureWidth,
          setFurnitureHeight,
          setFurnitureDepth,
          setFurnitureType,
          setIsExploded,
          setWoodTexture,
          setWireframe,
          setAutoRotate,
          setCameraView,
          setShowGrid,
          setGridSize,
          setEnvironment,
          setEnvironmentIntensity,
          setIsRendering,
          setRenderSamples,
          setRenderProgress,
          setIsAssetLibraryOpen,
          setActiveAssetCategory,
          setIsHistoryOpen,
          setIsOutlinerOpen,
          toggleObjectVisibility,
          renameObject,
          reorderPlacedAssets,
          addPlacedAsset,
          updatePlacedAsset,
          removePlacedAsset,
          setSelectedPlacedAssetId,
          setCameraFov,
          setCameraNear,
          setCameraFar,
          setPatternData,
          ...rest
        } = state;
        const { isRendering, renderSamples, renderProgress, isAssetLibraryOpen, activeAssetCategory, isHistoryOpen, isOutlinerOpen, placedAssets, selectedPlacedAssetId, ...restState } = rest;
        return restState;
      },
    }
  )
);
