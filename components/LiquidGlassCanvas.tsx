
import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { LiquidGlassParameters, ShaderUniforms } from '../types';
import { VERTEX_SHADER, FRAGMENT_SHADER } from '../constants';

export const LiquidGlassCanvas: React.FC<LiquidGlassParameters> = (params) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const backgroundMeshRef = useRef<THREE.Mesh | null>(null); // This mesh is not added to scene in current code.
  const hdriTextureRef = useRef<THREE.Texture | null>(null);
  const bgTextureRef = useRef<THREE.Texture | null>(null);
  const mousePosRef = useRef<[number, number]>([0,0]);
  const animationFrameIdRef = useRef<number | null>(null);


  const uniformsRef = useRef<ShaderUniforms>({
    uTime: { value: 0 },
    uResolution: { value: [0, 0] },
    uMouse: { value: [0, 0] },
    uBgTexture: { value: null },
    uEnvMap: { value: null },
    uIor: { value: params.webGLior },
    uThickness: { value: params.webGLthickness },
    uRoughness: { value: params.webGLroughness },
    uChromaticAberration: { value: params.webGLchromaticAberration },
    uDistortionStrength: { value: params.distortionStrength },
    uMouseEffectStrength: { value: params.mouseEffectStrength },
    uGlassColor: { value: new THREE.Color(params.glassColor) },
  });
  
  // Update uniforms when props change
  useEffect(() => {
    if (materialRef.current) {
      uniformsRef.current.uIor.value = params.webGLior;
      uniformsRef.current.uThickness.value = params.webGLthickness;
      uniformsRef.current.uRoughness.value = params.webGLroughness;
      uniformsRef.current.uChromaticAberration.value = params.webGLchromaticAberration;
      uniformsRef.current.uDistortionStrength.value = params.distortionStrength;
      uniformsRef.current.uMouseEffectStrength.value = params.mouseEffectStrength;
      uniformsRef.current.uGlassColor.value.set(params.glassColor);
    }
  }, [
    params.webGLior, params.webGLthickness, params.webGLroughness, params.webGLchromaticAberration,
    params.distortionStrength, params.mouseEffectStrength, params.glassColor
  ]);

  // Load HDRI
  useEffect(() => {
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(params.hdriUrl, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      hdriTextureRef.current = texture;
      if (sceneRef.current) sceneRef.current.environment = texture; // Set as environment for general scene reflections if needed
      if (materialRef.current) uniformsRef.current.uEnvMap.value = texture;
    }, undefined, (error) => {
      console.error('Error loading HDRI:', error);
       // Fallback if HDRI fails to load
      const fallbackEnvMap = new THREE.CubeTextureLoader().load([
        'https://picsum.photos/256/256?random=10', 'https://picsum.photos/256/256?random=11',
        'https://picsum.photos/256/256?random=12', 'https://picsum.photos/256/256?random=13',
        'https://picsum.photos/256/256?random=14', 'https://picsum.photos/256/256?random=15',
      ]);
      fallbackEnvMap.mapping = THREE.CubeReflectionMapping; // CubeTexture mapping
      hdriTextureRef.current = fallbackEnvMap;
      if (sceneRef.current) sceneRef.current.environment = fallbackEnvMap;
      if (materialRef.current) uniformsRef.current.uEnvMap.value = fallbackEnvMap;
    });
  }, [params.hdriUrl]);

  // Load background image
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(params.imageUrl, (texture) => {
      bgTextureRef.current = texture;
      if (materialRef.current) uniformsRef.current.uBgTexture.value = texture;
      
      // The background image is used as a texture in the shader, 
      // its aspect ratio handling is done via UVs or shader logic,
      // not by scaling a physical background plane in this setup.
    }, undefined, (error) => {
      console.error('Error loading background image:', error);
      // Fallback if image fails to load
      textureLoader.load('https://picsum.photos/1024/768?random=1', (fallbackTexture) => {
        bgTextureRef.current = fallbackTexture;
        if (materialRef.current) uniformsRef.current.uBgTexture.value = fallbackTexture;
      });
    });
  }, [params.imageUrl]);


  const initThree = useCallback(() => {
    if (!mountRef.current) return { cleanup: () => {} };

    const currentMount = mountRef.current;
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(rendererRef.current.domElement);

    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current.position.z = 2; // Adjusted camera Z for a 2x2 plane

    uniformsRef.current.uResolution.value = [width, height];
    if (hdriTextureRef.current && sceneRef.current) { // Ensure sceneRef.current exists
        sceneRef.current.environment = hdriTextureRef.current; // This is good for overall scene lighting if other objects existed
        uniformsRef.current.uEnvMap.value = hdriTextureRef.current;
    }
    if (bgTextureRef.current) {
        uniformsRef.current.uBgTexture.value = bgTextureRef.current;
    }
    
    // The shader uses uBgTexture for the background, so a physical background plane mesh is not strictly necessary
    // if the glass mesh fills the viewport and is what samples uBgTexture.
    // The `backgroundMeshRef` was initialized but not added to the scene in the original code, which is fine.

    // Glass plane
    // The plane size should ideally fill the camera's view at its Z position.
    // A common approach is to make it large enough, e.g., 2x2 units if camera is at z=1 and FoV allows.
    // Or, calculate based on FoV: const planeHeight = 2 * Math.tan(THREE.MathUtils.degToRad(cameraRef.current.fov / 2)) * cameraRef.current.position.z;
    // const planeWidth = planeHeight * cameraRef.current.aspect;
    // For simplicity, using a fixed size and adjusting camera.
    const planeAspect = width / height;
    const glassGeometry = new THREE.PlaneGeometry(2 * planeAspect, 2, 32, 32); // Plane fills viewport horizontally if cam at z=2, fov 45

    materialRef.current = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: uniformsRef.current,
      transparent: true, // Assuming shader might output alpha
    });
    const glassMesh = new THREE.Mesh(glassGeometry, materialRef.current);
    sceneRef.current.add(glassMesh);

    const handleMouseMove = (event: MouseEvent) => {
      if (!currentMount) return; // currentMount might be null if component unmounted
      const rect = currentMount.getBoundingClientRect();
      mousePosRef.current = [event.clientX - rect.left, event.clientY - rect.top];
      // Pass mouse coords in pixel values, with Y inverted (0,0 at bottom-left for shader)
      uniformsRef.current.uMouse.value = [mousePosRef.current[0], currentMount.clientHeight - mousePosRef.current[1]];
    };
    currentMount.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
        if (!rendererRef.current || !cameraRef.current || !mountRef.current || !sceneRef.current) return;
        const newWidth = mountRef.current.clientWidth;
        const newHeight = mountRef.current.clientHeight;

        rendererRef.current.setSize(newWidth, newHeight);
        cameraRef.current.aspect = newWidth / newHeight;
        cameraRef.current.updateProjectionMatrix();
        uniformsRef.current.uResolution.value = [newWidth, newHeight];
        
        const oldGlassMesh = sceneRef.current.getObjectByProperty('material', materialRef.current) as THREE.Mesh;
        if(oldGlassMesh) {
            oldGlassMesh.geometry.dispose();
            const newPlaneAspect = newWidth / newHeight;
            oldGlassMesh.geometry = new THREE.PlaneGeometry(2 * newPlaneAspect, 2, 32, 32);
        }
    };
    window.addEventListener('resize', handleResize);
    
    const cleanup = () => {
      currentMount.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        // Check if domElement is still a child before removing
        if (rendererRef.current.domElement.parentNode === currentMount) {
            currentMount.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
      materialRef.current?.dispose();
      glassGeometry.dispose();
      // Dispose textures if they are solely managed here and not potentially reused.
      // bgTextureRef.current?.dispose(); // Typically managed by loaders or if explicitly created
      // hdriTextureRef.current?.dispose();
    };
    return { cleanup }; // Return an object with a cleanup function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.webGLior, params.webGLthickness, params.webGLroughness, params.webGLchromaticAberration, params.distortionStrength, params.mouseEffectStrength, params.glassColor]); 


  useEffect(() => {
    if (materialRef.current) {
        if (bgTextureRef.current) uniformsRef.current.uBgTexture.value = bgTextureRef.current;
        if (hdriTextureRef.current) uniformsRef.current.uEnvMap.value = hdriTextureRef.current;
    }
  }, [bgTextureRef.current, hdriTextureRef.current]); 


  useEffect(() => {
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !materialRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(animate); // Keep trying if not ready
        return;
      }
      
      if(params.animating) {
        uniformsRef.current.uTime.value += 0.01;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if(animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [params.animating]);

  useEffect(() => {
    const initResult = initThree(); // initThree now returns an object { cleanup: Function }
    return initResult.cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initThree]);


  return <div ref={mountRef} className="w-full h-full" />;
};
