import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
   OrbitControls, 
  ContactShadows, 
  Environment, 
  Float, 
  MeshDistortMaterial, 
  PerspectiveCamera,
  useTexture,
  Html,
  useGLTF,
  Loader as DreiLoader,
  Grid,
  TransformControls
} from '@react-three/drei';
import { RotateCcw, X } from 'lucide-react';
import TWEEN from '@tweenjs/tween.js';

// Advanced Model Loader with Draco support
// Example Usage: <AdvancedModel url="/models/cabinet-draco.glb" />
export const AdvancedModel = ({ url, ...props }: { url: string } & any) => {
  const { scene } = useGLTF(url, true) as any; // Draco is enabled by default in useGLTF if provided
  return <primitive object={scene} {...props} />;
};

// Preload assets for better UX
// useGLTF.preload('/models/cabinet-draco.glb');
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useEditorStore } from '@/src/store/useEditorStore';
import { StudioRenderer } from './StudioRenderer';

const Mannequin = () => {
  const { 
    showMannequin, 
    mannequinBodyType, 
    mannequinSkinTone, 
    mannequinHairStyle 
  } = useEditorStore();
  if (!showMannequin) return null;

  const getBodyParams = () => {
    switch (mannequinBodyType) {
      case 'athletic':
        return { torso: [0.22, 0.16, 0.6], shoulders: [0.14, 0.32] };
      case 'curvy':
        return { torso: [0.24, 0.18, 0.65], shoulders: [0.13, 0.3] };
      case 'slender':
      default:
        return { torso: [0.2, 0.15, 0.6], shoulders: [0.12, 0.28] };
    }
  };

  const params = getBodyParams();
  
  return (
    <group position={[0, -0.6, 0]}>
      {/* Base/Stand */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 16]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Body Parts */}
      <group position={[0, 0, 0]}>
        {/* Legs */}
        {[-1, 1].map(side => (
          <mesh key={side} position={[side * (0.08 + (mannequinBodyType === 'curvy' ? 0.04 : 0)), 0.4, 0]}>
            <cylinderGeometry args={[0.07 + (mannequinBodyType !== 'slender' ? 0.02 : 0), 0.05, 0.8, 16]} />
            <meshStandardMaterial color={mannequinSkinTone} roughness={0.8} />
          </mesh>
        ))}
        {/* Torso */}
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[params.torso[0], params.torso[1], params.torso[2], 32]} />
          <meshStandardMaterial color={mannequinSkinTone} roughness={0.8} />
        </mesh>
        {/* Chest/Shoulders */}
        <mesh position={[0, 1.45, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[params.shoulders[0], params.shoulders[1], 4, 16]} />
          <meshStandardMaterial color={mannequinSkinTone} roughness={0.8} />
        </mesh>
        
        {/* Head & Hair */}
        <group position={[0, 1.7, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color={mannequinSkinTone} roughness={0.8} />
          </mesh>
          
          {mannequinHairStyle === 'short' && (
            <mesh position={[0, 0.05, 0]}>
              <sphereGeometry args={[0.13, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
              <meshStandardMaterial color="#1a120b" roughness={0.9} />
            </mesh>
          )}
          
          {mannequinHairStyle === 'bob' && (
            <group>
              <mesh position={[0, 0.05, 0]}>
                <sphereGeometry args={[0.13, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
                <meshStandardMaterial color="#4a3728" roughness={0.9} />
              </mesh>
              <mesh position={[0, -0.05, 0]}>
                <cylinderGeometry args={[0.135, 0.14, 0.15, 32, 1, true]} />
                <meshStandardMaterial color="#4a3728" roughness={0.9} side={THREE.DoubleSide} />
              </mesh>
            </group>
          )}

          {mannequinHairStyle === 'long' && (
            <group>
              <mesh position={[0, 0.05, 0]}>
                <sphereGeometry args={[0.13, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
                <meshStandardMaterial color="#2d1d0d" roughness={0.9} />
              </mesh>
              <mesh position={[0, -0.2, -0.05]} rotation={[0.1, 0, 0]}>
                 <boxGeometry args={[0.24, 0.4, 0.1]} />
                 <meshStandardMaterial color="#2d1d0d" roughness={0.9} />
              </mesh>
            </group>
          )}
        </group>

        {/* Arms */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * (params.shoulders[1] + 0.02), 1.3, 0]} rotation={[0, 0, side * 0.2]}>
            <cylinderGeometry args={[0.05, 0.04, 0.7, 16]} />
            <meshStandardMaterial color={mannequinSkinTone} roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const Garment = ({ type, color, textureMap, roughness, wireframe, distort, isRendering }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mannequinBodyType } = useEditorStore();

  const getCollisionParams = () => {
    switch (mannequinBodyType) {
      case 'athletic':
        return { width: 0.025, height: 1.0, bulge: 0.02, waist: 0.22 };
      case 'curvy':
        return { width: 0.05, height: 1.05, bulge: 0.05, waist: 0.25 };
      case 'slender':
      default:
        return { width: 0, height: 1.0, bulge: 0, waist: 0.2 };
    }
  };

  const collision = getCollisionParams();

  const materialProps = {
    map: textureMap,
    color,
    roughness,
    metalness: 0.05,
    side: THREE.DoubleSide,
    wireframe
  };

  return (
    <group position={[0, 1.1, 0]}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {type === 'pants' ? (
          <group position={[0, -0.7, 0]}>
             {/* Left Leg */}
             <mesh position={[-(0.1 + collision.width * 0.5), 0, 0]}>
                <cylinderGeometry args={[0.09 + collision.width, 0.08 + collision.width, 0.8, 32, 16, true]} />
                {isRendering ? <meshPhysicalMaterial {...materialProps} /> : <MeshDistortMaterial {...materialProps} distort={distort} speed={2} />}
             </mesh>
             {/* Right Leg */}
             <mesh position={[0.1 + collision.width * 0.5, 0, 0]}>
                <cylinderGeometry args={[0.09 + collision.width, 0.08 + collision.width, 0.8, 32, 16, true]} />
                {isRendering ? <meshPhysicalMaterial {...materialProps} /> : <MeshDistortMaterial {...materialProps} distort={distort} speed={2} />}
             </mesh>
             {/* Waist */}
             <mesh position={[0, 0.42, 0]}>
                <cylinderGeometry args={[collision.waist + 0.02, collision.waist + 0.01, 0.35, 32, 16, true]} />
                {isRendering ? <meshPhysicalMaterial {...materialProps} /> : <MeshDistortMaterial {...materialProps} distort={distort} speed={2} />}
             </mesh>
          </group>
        ) : type === 'dress' ? (
          <group position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.22 + collision.width, 0.55 + collision.bulge, 1.3 * collision.height, 32, 16, true]} />
            {isRendering ? <meshPhysicalMaterial {...materialProps} /> : <MeshDistortMaterial {...materialProps} distort={distort} speed={2} />}
          </group>
        ) : type === 'hoodie' ? (
          <group>
            <mesh>
              <cylinderGeometry args={[0.26 + collision.width, 0.26 + collision.width, 0.8, 32, 16, true]} />
              {isRendering ? <meshPhysicalMaterial {...materialProps} /> : <MeshDistortMaterial {...materialProps} distort={distort} speed={2} />}
            </mesh>
            {/* Sleeves */}
            {[-1, 1].map(side => (
               <mesh key={side} position={[side * (0.35 + collision.width), 0.1, 0]} rotation={[0, 0, side * 0.2]}>
                  <cylinderGeometry args={[0.075 + collision.width * 0.5, 0.065 + collision.width * 0.5, 0.7, 32, 8, true]} />
                  {isRendering ? <meshPhysicalMaterial {...materialProps} /> : <MeshDistortMaterial {...materialProps} distort={distort} speed={2} />}
               </mesh>
            ))}
            {/* Hood */}
            <mesh position={[0, 0.45, 0]} rotation={[0.4, 0, 0]}>
              <sphereGeometry args={[0.21, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
              {isRendering ? <meshPhysicalMaterial {...materialProps} /> : <MeshDistortMaterial {...materialProps} distort={distort} speed={2} />}
            </mesh>
          </group>
        ) : (
          <group>
            <mesh>
              <cylinderGeometry args={[0.25 + collision.width, 0.25 + collision.width, 0.8, 32, 16, true]} />
              {isRendering ? <meshPhysicalMaterial {...materialProps} /> : <MeshDistortMaterial {...materialProps} distort={distort} speed={2} />}
            </mesh>
            {/* Sleeves */}
            {[-1, 1].map(side => (
               <mesh key={side} position={[side * (0.32 + collision.width), 0.25, 0]} rotation={[0, 0, side * 0.4]}>
                  <cylinderGeometry args={[0.08 + collision.width * 0.5, 0.08 + collision.width * 0.5, 0.35, 32, 4, true]} />
                  {isRendering ? <meshPhysicalMaterial {...materialProps} /> : <MeshDistortMaterial {...materialProps} distort={distort} speed={2} />}
               </mesh>
            ))}
          </group>
        )}
      </mesh>
    </group>
  );
};

const Model = ({ scale = 1, roughness = 0.2 }: { scale?: number, roughness?: number }) => {
  const { 
    mode, 
    selectedColor, 
    garmentSize, 
    clothDeformation, 
    showMannequin, 
    showStitching, 
    texture,
    wireframe,
    autoRotate,
    isRendering,
    garmentType
  } = useEditorStore();
  const clothRef = useRef<THREE.Group>(null);
  const textureMap = useTexture(texture || 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=1080');

  useEffect(() => {
    if (textureMap) {
      textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
      textureMap.repeat.set(2, 2);
      textureMap.needsUpdate = true;
    }
  }, [textureMap]);

  useFrame((state) => {
    if (autoRotate && clothRef.current) {
      clothRef.current.rotation.y += 0.002;
    }
  });

  const clothColor = texture ? '#ffffff' : (selectedColor || '#ffffff');
  
  return (
    <group scale={scale}>
      {mode === 'fashion' ? (
        <group>
          <Mannequin />
          
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
            <group ref={clothRef} scale={garmentSize}>
              <Garment 
                type={garmentType}
                color={clothColor}
                textureMap={texture ? textureMap : null}
                roughness={roughness}
                wireframe={wireframe}
                distort={clothDeformation}
                isRendering={isRendering}
              />
              
              {showStitching && !isRendering && (
                <group scale={1.01}>
                   <Garment 
                    type={garmentType}
                    color="#ffffff"
                    textureMap={null}
                    roughness={1}
                    wireframe={true}
                    distort={clothDeformation}
                    isRendering={false}
                  />
                </group>
              )}
            </group>
          </Float>
        </group>
      ) : null}
    </group>
  );
};

const CarpenterModel = () => {
  const { 
    furnitureWidth, 
    furnitureHeight, 
    furnitureDepth, 
    isExploded, 
    woodTexture,
    selectedColor,
    mode,
    wireframe,
    furnitureType
  } = useEditorStore();

  const woodTextures: Record<string, string> = {
    oak: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=1080',
    walnut: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=1080',
    pine: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1080'
  };

  const textureMap = useTexture(woodTextures[woodTexture] || woodTextures.oak);
  
  if (textureMap) {
    textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
    textureMap.repeat.set(2, 2);
  }

  useEffect(() => {
    if (textureMap) {
      textureMap.needsUpdate = true;
    }
  }, [textureMap]);

  const explodeOffset = isExploded ? 0.4 : 0;
  const carpentryMode = mode === 'carpentry';
  if (!carpentryMode) return null;

  const matProps = {
    map: textureMap,
    color: selectedColor === '#ffffff' ? '#ffffff' : selectedColor,
    roughness: 0.4,
    envMapIntensity: 1.5,
    wireframe
  };

  if (furnitureType === 'table') {
    return (
      <group position={[0, -0.2, 0]}>
        {/* Table Top */}
        <mesh position={[0, furnitureHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[furnitureWidth, 0.05, furnitureDepth]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        {/* Legs */}
        {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z], i) => (
          <mesh key={i} position={[x * (furnitureWidth / 2 - 0.05), furnitureHeight / 4, z * (furnitureDepth / 2 - 0.05)]}>
            <cylinderGeometry args={[0.03, 0.03, furnitureHeight / 2, 16]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
        ))}
      </group>
    );
  }

  if (furnitureType === 'chair') {
    return (
      <group position={[0, -0.4, 0]} scale={0.7}>
        {/* Seat */}
        <mesh position={[0, furnitureHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, furnitureHeight, -0.225]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.6, 0.04]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        {/* Legs */}
        {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z], i) => (
          <mesh key={i} position={[x * 0.2, furnitureHeight / 4, z * 0.2]}>
            <cylinderGeometry args={[0.02, 0.02, furnitureHeight / 2, 8]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
        ))}
      </group>
    );
  }

  if (furnitureType === 'cabinet') {
    return (
      <group>
        {/* Main Box */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[furnitureWidth, furnitureHeight, furnitureDepth]} />
          <meshPhysicalMaterial {...matProps} transparent opacity={0.1} />
        </mesh>
        {/* Frame */}
        <mesh>
           <boxGeometry args={[furnitureWidth, furnitureHeight, furnitureDepth]} />
           <meshPhysicalMaterial color={selectedColor} wireframe />
        </mesh>
        {/* Panels */}
        {[-1, 1].map((side) => (
           <mesh key={side} position={[side * (furnitureWidth / 4 + explodeOffset), 0, furnitureDepth / 2]} castShadow>
              <boxGeometry args={[furnitureWidth / 2 - 0.02, furnitureHeight - 0.02, 0.02]} />
              <meshPhysicalMaterial {...matProps} />
           </mesh>
        ))}
      </group>
    );
  }

  return (
    <group>
      {/* Top Panel */}
      <mesh position={[0, (furnitureHeight / 2) + explodeOffset, 0]} castShadow receiveShadow>
        <boxGeometry args={[furnitureWidth, 0.05, furnitureDepth]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>

      {/* Bottom Panel */}
      <mesh position={[0, -(furnitureHeight / 2) - explodeOffset, 0]} castShadow receiveShadow>
        <boxGeometry args={[furnitureWidth, 0.05, furnitureDepth]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>

      {/* Side Panels */}
      {[-(furnitureWidth / 2) - explodeOffset, (furnitureWidth / 2) + explodeOffset].map((pos, i) => (
        <mesh key={i} position={[pos, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.05, furnitureHeight, furnitureDepth]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
      ))}

      {/* Back Panel */}
      <mesh position={[0, 0, -(furnitureDepth / 2) - explodeOffset]} castShadow receiveShadow>
        <boxGeometry args={[furnitureWidth - 0.05, furnitureHeight - 0.05, 0.02]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>

      {/* Shelf */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[furnitureWidth - 0.05, 0.02, furnitureDepth - 0.05]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
    </group>
  );
};

const CameraController = () => {
  const { camera, controls } = useThree() as any;
  const cameraView = useEditorStore((state) => state.cameraView);

  useEffect(() => {
    let targetPos = [4, 3, 6];
    let targetLookAt = [0, 0, 0];

    switch (cameraView) {
      case 'front': targetPos = [0, 0.8, 8]; break;
      case 'top': targetPos = [0, 10, 0]; break;
      case 'iso': targetPos = [6, 6, 6]; break;
      case 'perspective': default: targetPos = [4, 3, 6]; break;
    }

    new TWEEN.Tween(camera.position)
      .to({ x: targetPos[0], y: targetPos[1], z: targetPos[2] }, 800)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        if (controls) controls.update();
      })
      .start();
  }, [cameraView, camera, controls]);

  useFrame(() => TWEEN.update());
  return null;
};

export const Scene3D = ({ exposure = 1, environment: environmentProp, scale = 1, roughness = 0.2 }: { exposure?: number, environment?: string, scale?: number, roughness?: number }) => {
  const mode = useEditorStore((state) => state.mode);
  const showGrid = useEditorStore((state) => state.showGrid);
  const gridSize = useEditorStore((state) => state.gridSize);
  const isRendering = useEditorStore((state) => state.isRendering);
  const storeEnvironment = useEditorStore((state) => state.environment);
  const environment = environmentProp || storeEnvironment;
  const environmentIntensity = useEditorStore((state) => state.environmentIntensity);
  
  const cameraFov = useEditorStore((state) => state.cameraFov);
  const cameraNear = useEditorStore((state) => state.cameraNear);
  const cameraFar = useEditorStore((state) => state.cameraFar);
  
  const snapToGrid = useEditorStore((state) => state.snapToGrid);
  
  const setTexture = useEditorStore((state) => state.setTexture);
  const placedAssets = useEditorStore((state) => state.placedAssets);
  const addPlacedAsset = useEditorStore((state) => state.addPlacedAsset);
  const updatePlacedAsset = useEditorStore((state) => state.updatePlacedAsset);
  const removePlacedAsset = useEditorStore((state) => state.removePlacedAsset);
  const selectedPlacedAssetId = useEditorStore((state) => state.selectedPlacedAssetId);
  const setSelectedPlacedAssetId = useEditorStore((state) => state.setSelectedPlacedAssetId);
  const transformMode = useEditorStore((state) => state.transformMode);
  const setTransformMode = useEditorStore((state) => state.setTransformMode);
  const sceneObjectVisibility = useEditorStore((state) => state.sceneObjectVisibility);
  
  const controlsRef = useRef<any>(null);
  const transformRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'w': setTransformMode('translate'); break;
        case 'e': setTransformMode('rotate'); break;
        case 'r': setTransformMode('scale'); break;
        case 'escape': setSelectedPlacedAssetId(null); break;
        case 'delete':
        case 'backspace':
          if (selectedPlacedAssetId) removePlacedAsset(selectedPlacedAssetId);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlacedAssetId, removePlacedAsset, setTransformMode, setSelectedPlacedAssetId]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/x-asset');
    if (!data) return;

    try {
      const asset = JSON.parse(data);
      if (asset.category === 'textures') {
        setTexture(asset.url);
      } else if (asset.category === 'models' || asset.category === 'components') {
        // Place at center with slight variation
        const offset = (placedAssets.length * 0.5) % 2;
        addPlacedAsset(asset, [0, -0.65, offset]);
      }
    } catch (err) {
      console.error('Failed to parse dropped asset', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const onTransform = () => {
    if (transformRef.current && selectedPlacedAssetId) {
      const { position, rotation, scale } = transformRef.current.object;
      
      let finalPos = [position.x, position.y, position.z];
      if (snapToGrid && transformMode === 'translate') {
        const snap = gridSize / 20 * 0.5; // Match grid calculation
        finalPos = finalPos.map(v => Math.round(v / snap) * snap);
      }

      updatePlacedAsset(selectedPlacedAssetId, {
        position: finalPos as [number, number, number],
        rotation: [rotation.x, rotation.y, rotation.z],
        scale: [scale.x, scale.y, scale.z]
      });
    }
  };

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div 
      className="w-full h-full bg-[radial-gradient(circle_at_center,#111111_0%,#000000_100%)] overflow-hidden relative group/canvas"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => setSelectedPlacedAssetId(null)}
    >
      <Canvas shadows={{ type: THREE.PCFShadowMap }} dpr={[1, 2]} gl={{ antialias: false, stencil: false, depth: true }} onPointerMissed={() => setSelectedPlacedAssetId(null)}>
        <PerspectiveCamera makeDefault position={[4, 3, 6]} fov={cameraFov} near={cameraNear} far={cameraFar} />
        <CameraController />
        
        {/* Cinematic Lighting Setup */}
        <ambientLight intensity={0.4 * exposure} />
        <spotLight 
          position={[10, 15, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={2 * exposure} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5 * exposure} />
        
        <Suspense fallback={null}>
          {mode === 'fashion' && (sceneObjectVisibility['main_garment'] ?? true) && (
            <Model scale={scale} roughness={roughness} />
          )}
          {mode === 'carpentry' && (sceneObjectVisibility['main_furniture'] ?? true) && (
            <CarpenterModel />
          )}

          {/* Render Placed Assets */}
          {placedAssets.map((pa) => (sceneObjectVisibility[pa.id] ?? true) && (
            <group 
              key={pa.id} 
              position={pa.position}
              rotation={pa.rotation}
              scale={pa.scale}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlacedAssetId(pa.id);
              }}
            >
              <AdvancedModel url={pa.asset.url} />
              {!isRendering && selectedPlacedAssetId === pa.id && (
                <TransformControls 
                  ref={transformRef}
                  object={undefined} 
                  mode={transformMode}
                  onMouseUp={onTransform}
                  size={0.6}
                  translationSnap={snapToGrid ? (gridSize / 20 * 0.5) : null}
                />
              )}
              {!isRendering && (
                <Html position={[0, 1, 0]}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removePlacedAsset(pa.id);
                    }}
                    className={`bg-black/60 border border-white/10 rounded-full p-1 transition-all
                      ${selectedPlacedAssetId === pa.id ? 'text-gold border-gold scale-110' : 'text-white/40 hover:text-red-500 opacity-0 group-hover:opacity-100'}
                    `}
                  >
                    <X size={10} />
                  </button>
                </Html>
              )}
            </group>
          ))}
          
          <Environment preset={environment as any} blur={0.8} />
          
          {showGrid && !isRendering && (
            <Grid
              position={[0, -0.65, 0]}
              infiniteGrid
              fadeDistance={20}
              fadeStrength={5}
              cellSize={gridSize / 20 * 0.5}
              sectionSize={gridSize / 20 * 2.5}
              sectionThickness={1.5}
              sectionColor="#ffffff"
              cellThickness={1}
              cellColor="#222222"
            />
          )}
          
          {!isRendering && (
            <ContactShadows 
              position={[0, -0.6, 0]} 
              opacity={0.7} 
              scale={12} 
              blur={2.5} 
              far={4.5} 
              color="#000000"
            />
          )}

          {isRendering && <StudioRenderer />}

          {/* Advanced Visual Effects */}
          {!isRendering && (
            <EffectComposer>
              <Bloom 
                luminanceThreshold={1} 
                mipmapBlur 
                intensity={0.5} 
                radius={0.4} 
              />
              <Noise opacity={0.02} />
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
          )}
        </Suspense>
        
        <OrbitControls 
          ref={controlsRef}
          enableZoom={true} 
          enablePan={true} 
          maxDistance={10} 
          minDistance={2.5} 
          makeDefault
        />
      </Canvas>
      <DreiLoader />
      
      {/* Studio Info Overlay */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-1 pointer-events-none">
        <span className="text-[10px] font-mono text-gold tracking-widest uppercase animate-pulse">Rendering_Engine_v4.2</span>
        <span className="text-[9px] text-white/20 font-mono tracking-tighter">PBR_ENABLED | POST_PROCESS_ACTIVE</span>
      </div>

      {/* Camera Actions */}
      <div className="absolute bottom-12 right-6 flex flex-col items-end gap-2">
        <div className="flex gap-1 mb-2">
          {['translate', 'rotate', 'scale'].map((m) => (
            <button
              key={m}
              onClick={(e) => {
                e.stopPropagation();
                setTransformMode(m as any);
              }}
              className={`px-2 py-1 rounded-sm text-[8px] font-mono border transition-all ${
                transformMode === m 
                  ? 'bg-gold text-black border-gold' 
                  : 'bg-black/60 text-white/40 border-white/10 hover:border-white/20'
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
        <button 
          onClick={resetCamera}
          className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-black/60 border border-white/10 text-[9px] font-mono text-white/40 hover:text-gold transition-all duration-300 backdrop-blur-md group"
        >
          <span className="tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">Reset_Camera</span>
          <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
};
