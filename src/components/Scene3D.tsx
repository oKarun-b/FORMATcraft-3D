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
  Loader as DreiLoader
} from '@react-three/drei';
import { RotateCcw } from 'lucide-react';
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

const Mannequin = () => (
  <group>
    {/* Torso */}
    <mesh position={[0, 0.8, 0]}>
      <cylinderGeometry args={[0.3, 0.25, 1.2, 32]} />
      <meshStandardMaterial color="#222" roughness={0.8} />
    </mesh>
    {/* Shoulders/Chest */}
    <mesh position={[0, 1.3, 0]} rotation={[0, 0, Math.PI / 2]}>
      <capsuleGeometry args={[0.25, 0.3, 4, 16]} />
      <meshStandardMaterial color="#222" roughness={0.8} />
    </mesh>
    {/* Head */}
    <mesh position={[0, 1.7, 0]}>
      <sphereGeometry args={[0.18, 32, 32]} />
      <meshStandardMaterial color="#222" roughness={0.8} />
    </mesh>
    {/* Waist/Hips */}
    <mesh position={[0, 0.2, 0]}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color="#222" roughness={0.8} />
    </mesh>
    {/* Arms */}
    {[-1, 1].map((side) => (
      <mesh key={side} position={[side * 0.45, 1, 0]} rotation={[0, 0, side * 0.1]}>
        <cylinderGeometry args={[0.08, 0.06, 1, 16]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>
    ))}
  </group>
);

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
    autoRotate
  } = useEditorStore();
  const clothRef = useRef<THREE.Mesh>(null);
  const structureRef = useRef<THREE.Group>(null);
  const textureMap = useTexture(texture || 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=1080');

  useEffect(() => {
    if (textureMap) {
      textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
      textureMap.repeat.set(2, 2);
      textureMap.needsUpdate = true;
    }
  }, [textureMap]);

  useFrame((state) => {
    if (autoRotate) {
      if (clothRef.current) {
        clothRef.current.rotation.y += 0.002;
      }
      if (structureRef.current) {
        structureRef.current.rotation.y += 0.002;
      }
    }
  });

  return (
    <group scale={scale}>
      {mode === 'fashion' ? (
        <group>
          {showMannequin && <Mannequin />}
          
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
            {/* Inner Lining Layer */}
            <mesh position={[0, 0.8, 0]} scale={garmentSize - 0.02} castShadow receiveShadow>
              <cylinderGeometry args={[0.44, 0.54, 1.28, 32, 16, true]} />
              <meshPhysicalMaterial 
                color="#111" 
                roughness={1}
                side={THREE.DoubleSide}
                transmission={0}
                thickness={0}
                wireframe={wireframe}
              />
            </mesh>

            {/* Main Outer Garment Layer */}
            <mesh ref={clothRef} position={[0, 0.8, 0]} scale={garmentSize} castShadow receiveShadow>
              <cylinderGeometry args={[0.45, 0.55, 1.3, 32, 16, true]} />
              <MeshDistortMaterial 
                map={texture ? textureMap : null}
                color={texture ? '#ffffff' : selectedColor} 
                speed={2} 
                distort={clothDeformation} 
                roughness={roughness}
                metalness={0.05}
                side={THREE.DoubleSide}
                wireframe={wireframe}
              />
            </mesh>
            
            {/* Stitching Layer (Special Visualization) */}
            {showStitching && (
              <mesh position={[0, 0.8, 0]} scale={garmentSize + 0.005}>
                <cylinderGeometry args={[0.45, 0.55, 1.3, 32, 16, true]} />
                <meshStandardMaterial 
                  color="#ffffff" 
                  opacity={0.4}
                  transparent
                  wireframe
                  wireframeLinewidth={0.5}
                />
              </mesh>
            )}
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
    wireframe
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

  return (
    <group>
      {/* Top Panel */}
      <mesh position={[0, (furnitureHeight / 2) + explodeOffset, 0]} castShadow receiveShadow>
        <boxGeometry args={[furnitureWidth, 0.05, furnitureDepth]} />
        <meshPhysicalMaterial 
          map={textureMap} 
          color={selectedColor === '#ffffff' ? '#ffffff' : selectedColor} 
          roughness={0.4}
          envMapIntensity={1.5}
          wireframe={wireframe}
        />
      </mesh>

      {/* Bottom Panel */}
      <mesh position={[0, -(furnitureHeight / 2) - explodeOffset, 0]} castShadow receiveShadow>
        <boxGeometry args={[furnitureWidth, 0.05, furnitureDepth]} />
        <meshPhysicalMaterial 
          map={textureMap} 
          color={selectedColor === '#ffffff' ? '#ffffff' : selectedColor} 
          roughness={0.4}
          envMapIntensity={1.5}
          wireframe={wireframe}
        />
      </mesh>

      {/* Side Panels */}
      {[-(furnitureWidth / 2) - explodeOffset, (furnitureWidth / 2) + explodeOffset].map((pos, i) => (
        <mesh key={i} position={[pos, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.05, furnitureHeight, furnitureDepth]} />
          <meshPhysicalMaterial 
            map={textureMap} 
            color={selectedColor === '#ffffff' ? '#ffffff' : selectedColor} 
            roughness={0.4}
            envMapIntensity={1.5}
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* Back Panel */}
      <mesh position={[0, 0, -(furnitureDepth / 2) - explodeOffset]} castShadow receiveShadow>
        <boxGeometry args={[furnitureWidth - 0.05, furnitureHeight - 0.05, 0.02]} />
        <meshPhysicalMaterial 
          map={textureMap} 
          color={selectedColor === '#ffffff' ? '#999' : selectedColor} 
          roughness={0.6}
          envMapIntensity={1}
          wireframe={wireframe}
        />
      </mesh>

      {/* Shelf */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[furnitureWidth - 0.05, 0.02, furnitureDepth - 0.05]} />
        <meshPhysicalMaterial 
          map={textureMap} 
          color={selectedColor === '#ffffff' ? '#ffffff' : selectedColor} 
          roughness={0.4}
          envMapIntensity={1.2}
          wireframe={wireframe}
        />
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

export const Scene3D = ({ exposure = 1, environment = 'studio', scale = 1, roughness = 0.2 }: { exposure?: number, environment?: string, scale?: number, roughness?: number }) => {
  const mode = useEditorStore((state) => state.mode);
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="w-full h-full bg-[#000] overflow-hidden relative group/canvas">
      <Canvas shadows={{ type: THREE.PCFShadowMap }} dpr={[1, 2]} gl={{ antialias: false, stencil: false, depth: true }}>
        <PerspectiveCamera makeDefault position={[4, 3, 6]} fov={35} />
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
          {mode === 'fashion' ? (
            <Model scale={scale} roughness={roughness} />
          ) : (
            <CarpenterModel />
          )}
          
          <Environment preset={environment as any} blur={0.8} />
          
          <gridHelper args={[20, 20, '#ffffff', '#222222']} position={[0, -0.65, 0]} rotation={[0, 0, 0]} />
          
          <ContactShadows 
            position={[0, -0.6, 0]} 
            opacity={0.7} 
            scale={12} 
            blur={2.5} 
            far={4.5} 
            color="#000000"
          />

          {/* Advanced Visual Effects */}
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
