import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { WebGLPathTracer } from 'three-gpu-pathtracer';
import { useEditorStore } from '@/src/store/useEditorStore';

export const StudioRenderer = () => {
  const { gl, scene, camera, size } = useThree();
  const isRendering = useEditorStore((state) => state.isRendering);
  const setIsRendering = useEditorStore((state) => state.setIsRendering);
  const setRenderProgress = useEditorStore((state) => state.setRenderProgress);
  const setRenderSamples = useEditorStore((state) => state.setRenderSamples);
  
  const pathTracer = useMemo(() => {
    const tracer = new WebGLPathTracer(gl);
    tracer.renderScale = 1;
    tracer.tiles.set(1, 1);
    return tracer;
  }, [gl]);

  useEffect(() => {
    let timeoutId: any;
    
    if (pathTracer && scene && camera && isRendering) {
      // Small delay to ensure helpers like TransformControls and Html 
      // are unmounted before path tracer traverses the scene
      timeoutId = setTimeout(() => {
        try {
          pathTracer.setScene(scene, camera);
          pathTracer.reset();
        } catch (err) {
          console.error('PathTracer setScene error:', err);
        }
      }, 100);
    }
    
    return () => clearTimeout(timeoutId);
  }, [pathTracer, scene, camera, isRendering]);

  useFrame(() => {
    if (pathTracer && isRendering) {
      try {
        pathTracer.updateCamera();
        pathTracer.renderSample();
        
        const samples = Math.floor(pathTracer.samples || 0);
        setRenderSamples(samples);
        
        const progress = Math.min((samples / 50) * 100, 100);
        setRenderProgress(progress);
      } catch (err) {
        console.error('PathTracer render error:', err);
        // Fallback or stop rendering if it's a fatal error
      }
    }
  }, 1);

  // Overlay for rendering state
  return null;
};
