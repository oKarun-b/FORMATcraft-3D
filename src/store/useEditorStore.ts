import { create } from 'zustand';

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
  // Carpenter Specifics
  furnitureWidth: number;
  setFurnitureWidth: (w: number) => void;
  furnitureHeight: number;
  setFurnitureHeight: (h: number) => void;
  furnitureDepth: number;
  setFurnitureDepth: (d: number) => void;
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
}

export const useEditorStore = create<EditorState>((set) => ({
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
  furnitureWidth: 1.2,
  setFurnitureWidth: (furnitureWidth) => set({ furnitureWidth }),
  furnitureHeight: 0.8,
  setFurnitureHeight: (furnitureHeight) => set({ furnitureHeight }),
  furnitureDepth: 0.6,
  setFurnitureDepth: (furnitureDepth) => set({ furnitureDepth }),
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
}));
