import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export default function ThreeDioramaScene() {
  const containerRef = useRef(null);
  const router = useRouter();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // States to drive interactive HTML overlays
  // States to drive interactive HTML overlays
  const [activeSection, setActiveSection] = useState(null); // 'tarot', 'rituals', 'portal', or null
  const [currentProgressState, setCurrentProgressState] = useState(0);
  const [sectionInfluences, setSectionInfluences] = useState({ tarot: 0, rituals: 0, portal: 0 });
  const prevInfluences = useRef({ tarot: 0, rituals: 0, portal: 0 });

  // Refs to store animation scroll progress without re-renders
  const targetProgress = useRef(0.0);
  const currentProgress = useRef(0.0);
  const isMouseDown = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const pointerMoveAccum = useRef(0);
  
  // Parallax coordinates ref for natural micro-movements
  const mousePos = useRef({ x: 0, y: 0 });

  // Floating labels coordinate state projected from 3D coords
  const [labelCoords, setLabelCoords] = useState({
    tarot: { x: 0, y: 0, visible: false },
    rituals: { x: 0, y: 0, visible: false },
    portal: { x: 0, y: 0, visible: false },
  });

  // Spline Keyframes for the camera path
  const cameraKeyframes = [
    { p: 0.0,  cam: new THREE.Vector3(15.5, 11.5, 15.5),  tar: new THREE.Vector3(0, 1.5, 0) },       // 0: Full isometric diorama view
    { p: 0.33, cam: new THREE.Vector3(4.8, 3.4, 4.8),     tar: new THREE.Vector3(0, 1.25, 0.45) },   // 1: Focused close-up on Tarot Table
    { p: 0.66, cam: new THREE.Vector3(-4.0, 4.2, 4.2),    tar: new THREE.Vector3(-1.6, 2.0, -1.5) }, // 2: Focused close-up on Alchemy Bookshelf
    { p: 1.0,  cam: new THREE.Vector3(3.8, 3.2, -1.2),    tar: new THREE.Vector3(1.8, 1.8, -1.5) }   // 3: Focused close-up on Portal/Crystal Skull
  ];

  // Helper to interpolate vectors along progress
  const getInterpolatedState = (p, outCam, outTar) => {
    const clampedP = Math.max(0, Math.min(1, p));
    
    // Find keyframe boundaries
    let index = 0;
    for (let i = 0; i < cameraKeyframes.length - 1; i++) {
      if (clampedP >= cameraKeyframes[i].p && clampedP <= cameraKeyframes[i + 1].p) {
        index = i;
        break;
      }
    }
    
    const kf1 = cameraKeyframes[index];
    const kf2 = cameraKeyframes[index + 1];
    
    // Calculate local segment progress factor
    const segmentRange = kf2.p - kf1.p;
    const factor = segmentRange > 0 ? (clampedP - kf1.p) / segmentRange : 0;
    
    // Smooth step easing for luxurious, buttery transitions
    const smoothFactor = factor * factor * (3 - 2 * factor);
    
    outCam.lerpVectors(kf1.cam, kf2.cam, smoothFactor);
    outTar.lerpVectors(kf1.tar, kf2.tar, smoothFactor);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. SETUP THREE.JS RENDERER & SCENE ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#050209', 0.02);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.copy(cameraKeyframes[0].cam);

    // Enabled alpha to allow background CSS stars to display behind diorama
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    containerRef.current.appendChild(renderer.domElement);

    // --- 2. AMBIENT & DIRECTIONAL MOONLIGHTS ---
    const ambientLight = new THREE.AmbientLight('#2a124d', 2.0);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight('#9381ff', 0.9);
    moonLight.position.set(-10, 15, -10);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.bias = -0.001;
    scene.add(moonLight);

    // --- 3. DYNAMIC CANDLELIGHT & POTION LIGHTS ---
    const candleLight = new THREE.PointLight('#ffd700', 3.8, 12);
    candleLight.position.set(0.5, 2.3, 0.5);
    candleLight.castShadow = true;
    candleLight.shadow.bias = -0.002;
    scene.add(candleLight);

    const potionLight = new THREE.PointLight('#b866ff', 3.2, 8);
    potionLight.position.set(-2.0, 1.8, -1.8);
    scene.add(potionLight);

    const skullLight = new THREE.PointLight('#00f2fe', 2.5, 6);
    skullLight.position.set(1.8, 2.0, -1.5);
    scene.add(skullLight);

    // --- 4. RISING GOLDEN ALCHEMICAL EMBERS ---
    const particleCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8.5;     // X
      positions[i * 3 + 1] = Math.random() * 6;           // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8.5; // Z

      particleSpeeds.push({
        y: Math.random() * 0.012 + 0.004,
        x: (Math.random() - 0.5) * 0.006,
        z: (Math.random() - 0.5) * 0.006,
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255, 215, 0, 1)');
      grad.addColorStop(0.3, 'rgba(184, 102, 255, 0.7)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
      return new THREE.CanvasTexture(canvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.18,
      map: createParticleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- 5. LOADING MANAGER AND URL INTERCEPTOR (BLOCKING TGA 404 WARNINGS) ---
    const manager = new THREE.LoadingManager();
    
    // Intercept default FBX attempts to fetch .tga texture assets, returning blank pixel instead.
    // This completely silences browser console 404 warnings while keeping PNG textures functional!
    manager.setURLModifier((url) => {
      if (url.endsWith('.tga') || url.includes('.tga')) {
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      }
      return url;
    });

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      setLoadingProgress(Math.round((itemsLoaded / itemsTotal) * 100));
    };
    
    manager.onLoad = () => {
      setIsLoading(false);
    };

    const textureLoader = new THREE.TextureLoader(manager);
    const texture1 = textureLoader.load('/models/Diorama_Abledo_1.tga.png');
    const texture2 = textureLoader.load('/models/Diorama_Abledo_2.tga.png');

    texture1.colorSpace = THREE.SRGBColorSpace;
    texture2.colorSpace = THREE.SRGBColorSpace;

    const fbxLoader = new FBXLoader(manager);
    const dioramaGroup = new THREE.Group();
    scene.add(dioramaGroup);

    const interactiveMeshes = [];

    const configureDioramaMaterials = (model, isTarotTable = false) => {
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          const meshName = child.name ? child.name.toLowerCase() : '';
          
          if (child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            
            materials.forEach((mat) => {
              const matName = mat.name ? mat.name.toLowerCase() : '';
              let originalMapName = '';
              if (mat.map && mat.map.name) {
                originalMapName = mat.map.name.toLowerCase();
              }

              const usesTexture2 = 
                isTarotTable || 
                meshName.includes('table') || 
                meshName.includes('tarot') || 
                meshName.includes('candle') || 
                meshName.includes('vela') ||
                meshName.includes('crystal') || 
                meshName.includes('skull') || 
                meshName.includes('potion') || 
                meshName.includes('book') || 
                meshName.includes('scroll') ||
                matName.includes('abled_2') || 
                matName.includes('abledo_2') || 
                matName.includes('table') || 
                originalMapName.includes('abled_2') || 
                originalMapName.includes('abledo_2');

              mat.map = usesTexture2 ? texture2 : texture1;
              mat.roughness = 0.85;
              mat.metalness = 0.08;
              mat.bumpScale = 0.05;
              
              mat.emissive = new THREE.Color('#000000');
              mat.emissiveIntensity = 0.0;
              
              child.userData = {
                ...child.userData,
                originalEmissive: mat.emissive.getHex(),
                isInteractive: true,
                isTarot: isTarotTable || meshName.includes('table') || meshName.includes('tarot') || meshName.includes('board'),
                isRituals: meshName.includes('shelf') || meshName.includes('book') || meshName.includes('potion') || meshName.includes('cauldron') || meshName.includes('estante') || meshName.includes('vidro'),
                isPortal: meshName.includes('portal') || meshName.includes('mirror') || meshName.includes('skull') || meshName.includes('cristal') || meshName.includes('gate') || meshName.includes('door'),
              };
            });
          }

          interactiveMeshes.push(child);
        }
      });
    };

    // Load Mesh 1: Witch's Potion Room Diorama
    fbxLoader.load('/models/rooms isometric.fbx', (room) => {
      room.scale.set(0.015, 0.015, 0.015);
      room.position.set(0, 0, 0);
      configureDioramaMaterials(room, false);
      dioramaGroup.add(room);
    });

    // Load Mesh 2: Tarot Table Diorama
    fbxLoader.load('/models/Tarottable.fbx', (table) => {
      table.scale.set(0.015, 0.015, 0.015);
      table.position.set(0, 0, 0);
      configureDioramaMaterials(table, true);
      dioramaGroup.add(table);
    });

    // --- 6. PARALLAX AND INTERACTIVE CONTROLS ---
    const handleMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Store current pointer pos for parallax interpolation
      mousePos.current.x = x;
      mousePos.current.y = y;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- 7. TOUCH / MOUSE SWIPE PROGRESS HANDLERS WITH SMART SCROLL LOCK ---
    // Smooth scroll wheel transition modifier
    const handleWheel = (event) => {
      const isAtTop = window.scrollY === 0;
      const deltaY = event.deltaY;
      const sensitivity = 0.0012;

      if (isAtTop) {
        if (deltaY > 0) {
          // Scrolling down
          if (targetProgress.current < 1.0) {
            event.preventDefault();
            targetProgress.current = Math.max(0.0, Math.min(1.0, targetProgress.current + deltaY * sensitivity));
          }
        } else if (deltaY < 0) {
          // Scrolling up
          if (targetProgress.current > 0.0) {
            event.preventDefault();
            targetProgress.current = Math.max(0.0, Math.min(1.0, targetProgress.current + deltaY * sensitivity));
          }
        }
      } else {
        // Scrolling back up, capture wheel to slide back once hitting top
        if (deltaY < 0 && window.scrollY <= 5 && targetProgress.current > 0.0) {
          targetProgress.current = Math.max(0.0, Math.min(1.0, targetProgress.current + deltaY * sensitivity));
        }
      }
    };

    // Mouse drag swiping handlers (Desktop fallbacks)
    const handleMouseDown = (event) => {
      isMouseDown.current = true;
      pointerStart.current = { x: event.clientX, y: event.clientY };
      pointerMoveAccum.current = 0;
    };

    const handleMouseMoveDrag = (event) => {
      if (!isMouseDown.current) return;
      const deltaY = pointerStart.current.y - event.clientY;
      const sensitivity = 0.0025;
      
      const isAtTop = window.scrollY === 0;

      if (isAtTop) {
        if (deltaY > 0) {
          if (targetProgress.current < 1.0) {
            targetProgress.current = Math.max(0.0, Math.min(1.0, targetProgress.current + deltaY * sensitivity));
            pointerMoveAccum.current += Math.abs(pointerStart.current.x - event.clientX) + Math.abs(deltaY);
          }
        } else if (deltaY < 0) {
          if (targetProgress.current > 0.0) {
            targetProgress.current = Math.max(0.0, Math.min(1.0, targetProgress.current + deltaY * sensitivity));
            pointerMoveAccum.current += Math.abs(pointerStart.current.x - event.clientX) + Math.abs(deltaY);
          }
        }
      } else {
        if (deltaY < 0 && window.scrollY <= 10 && targetProgress.current > 0.0) {
          targetProgress.current = Math.max(0.0, Math.min(1.0, targetProgress.current + deltaY * sensitivity));
          pointerMoveAccum.current += Math.abs(pointerStart.current.x - event.clientX) + Math.abs(deltaY);
        }
      }
      
      pointerStart.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = (event) => {
      isMouseDown.current = false;
      
      // If user dragged less than 6px total, treat it as a tactical click!
      if (pointerMoveAccum.current < 6) {
        handleTactileClick(event.clientX, event.clientY);
      }
    };

    // Touch swiping handlers (Mobile optimized swipe glide with active passive scroll locking)
    const handleTouchStart = (event) => {
      isMouseDown.current = true;
      pointerStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      pointerMoveAccum.current = 0;
    };

    const handleTouchMove = (event) => {
      if (!isMouseDown.current) return;
      const deltaY = pointerStart.current.y - event.touches[0].clientY;
      const sensitivity = 0.0045; // Enhanced swipe speed for responsiveness on mobile viewports
      
      const isAtTop = window.scrollY === 0;

      if (isAtTop) {
        if (deltaY > 0) {
          // Swiping up / scrolling down the animation path
          if (targetProgress.current < 1.0) {
            if (event.cancelable) event.preventDefault();
            targetProgress.current = Math.max(0.0, Math.min(1.0, targetProgress.current + deltaY * sensitivity));
            pointerMoveAccum.current += Math.abs(pointerStart.current.x - event.touches[0].clientX) + Math.abs(deltaY);
          }
        } else if (deltaY < 0) {
          // Swiping down / scrolling up the animation path
          if (targetProgress.current > 0.0) {
            if (event.cancelable) event.preventDefault();
            targetProgress.current = Math.max(0.0, Math.min(1.0, targetProgress.current + deltaY * sensitivity));
            pointerMoveAccum.current += Math.abs(pointerStart.current.x - event.touches[0].clientX) + Math.abs(deltaY);
          }
        }
      } else {
        // If page is scrolled, lock touch swipe if we pull back down to top to trigger reverse animation
        if (deltaY < 0 && window.scrollY <= 10 && targetProgress.current > 0.0) {
          if (event.cancelable) event.preventDefault();
          targetProgress.current = Math.max(0.0, Math.min(1.0, targetProgress.current + deltaY * sensitivity));
          pointerMoveAccum.current += Math.abs(pointerStart.current.x - event.touches[0].clientX) + Math.abs(deltaY);
        }
      }
      
      pointerStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    };

    const handleTouchEnd = (event) => {
      isMouseDown.current = false;
      
      // Tactical click on tap if minimal drag occurred
      if (pointerMoveAccum.current < 10 && event.changedTouches && event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        handleTactileClick(touch.clientX, touch.clientY);
      }
    };

    // --- 8. TACTILE CLICK / RAYCAST NAVIGATION ---
    const raycaster = new THREE.Raycaster();
    const rayMouse = new THREE.Vector2();

    const handleTactileClick = (clientX, clientY) => {
      const rect = renderer.domElement.getBoundingClientRect();
      rayMouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      rayMouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(rayMouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, true);

      if (intersects.length > 0) {
        let current = intersects[0].object;
        while (current) {
          if (current.userData) {
            if (current.userData.isTarot) {
              router.push('/tarot');
              return;
            }
            if (current.userData.isRituals) {
              router.push('/rituais');
              return;
            }
            if (current.userData.isPortal) {
              router.push('/login');
              return;
            }
          }
          current = current.parent;
        }
      }
    };

    // Attach interaction listeners to the canvas container
    const canvasDom = renderer.domElement;
    canvasDom.addEventListener('wheel', handleWheel, { passive: false });
    canvasDom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMoveDrag);
    window.addEventListener('mouseup', handleMouseUp);
    
    canvasDom.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvasDom.addEventListener('touchmove', handleTouchMove, { passive: false }); // Allow preventDefault() to lock page scrolling
    canvasDom.addEventListener('touchend', handleTouchEnd);

    // --- 9. HOTSPOT POSITIONS DEFINITIONS ---
    const hotspots = {
      tarot: new THREE.Vector3(0, 0.95, 0.5),      // Sits directly on the Tarot table surface
      rituals: new THREE.Vector3(-1.8, 1.65, -1.8), // Sits right in the center shelf/cauldron area
      portal: new THREE.Vector3(1.8, 1.35, -1.5),   // Sits right above the skull/portal pedestal
    };

    // --- 10. RESIZE HANDLER ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- 11. BUTTERY-SMOOTH ANIMATION LOOP ---
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Organic flickering lights
      candleLight.intensity = 3.8 + Math.sin(time * 12) * 0.18 + Math.random() * 0.1;
      potionLight.intensity = 3.2 + Math.cos(time * 8) * 0.2;

      // Animate alchemical rising embers
      const particlePos = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        particlePos[i * 3 + 1] += particleSpeeds[i].y;
        particlePos[i * 3] += particleSpeeds[i].x;
        particlePos[i * 3 + 2] += particleSpeeds[i].z;

        if (particlePos[i * 3 + 1] > 6) {
          particlePos[i * 3 + 1] = 0;
          particlePos[i * 3] = (Math.random() - 0.5) * 8.5;
          particlePos[i * 3 + 2] = (Math.random() - 0.5) * 8.5;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Organic floating anti-gravity drift of diorama group
      dioramaGroup.position.y = Math.sin(time * 0.8) * 0.08;

      // 1. LERP CAMERA AND TARGET ALONG THE CINEMATIC SCENE SPLINE
      // Luxurious interpolation factor for maximum buttery-smooth tactile glide
      currentProgress.current += (targetProgress.current - currentProgress.current) * 0.07;
      setCurrentProgressState(currentProgress.current);

      const computedCam = new THREE.Vector3();
      const computedTar = new THREE.Vector3();
      getInterpolatedState(currentProgress.current, computedCam, computedTar);

      // 2. ADD SUBTLE ELEGANT PARALLAX MOUSE LOOK
      // Apply parallax relative to focal distance
      const parallaxFactor = 0.5;
      const targetParallaxX = mousePos.current.x * parallaxFactor;
      const targetParallaxY = mousePos.current.y * parallaxFactor * 0.7;

      computedCam.x += targetParallaxX;
      computedCam.y += targetParallaxY;

      // Update camera and looking matrix manually
      camera.position.copy(computedCam);
      camera.lookAt(computedTar);

      // Calculate continuous influence factors based on camera scroll progress
      const getSectionInfluence = (progressVal, milestone) => {
        const distance = Math.abs(progressVal - milestone);
        const threshold = 0.15;
        if (distance > threshold) return 0;
        const factor = 1 - (distance / threshold);
        return factor * factor * (3 - 2 * factor); // Smoothstep easing
      };

      const p = currentProgress.current;
      const influences = {
        tarot: getSectionInfluence(p, 0.33),
        rituals: getSectionInfluence(p, 0.66),
        portal: getSectionInfluence(p, 1.0),
      };

      if (
        Math.abs(influences.tarot - prevInfluences.current.tarot) > 0.005 ||
        Math.abs(influences.rituals - prevInfluences.current.rituals) > 0.005 ||
        Math.abs(influences.portal - prevInfluences.current.portal) > 0.005
      ) {
        setSectionInfluences(influences);
        prevInfluences.current = influences;
      }

      // Render updated frame
      renderer.render(scene, camera);

      // 3. IDENTIFY WHICH SECTION IS CURRENTLY DELIVERED/FOCUSED
      let detectedSection = null;
      if (p > 0.16 && p < 0.48) {
        detectedSection = 'tarot';
      } else if (p >= 0.48 && p < 0.82) {
        detectedSection = 'rituals';
      } else if (p >= 0.82) {
        detectedSection = 'portal';
      }
      
      setActiveSection((prev) => {
        if (prev !== detectedSection) return detectedSection;
        return prev;
      });

      // 4. PROJECT 3D HOTSPOT LOCATIONS ONTO 2D SCREEN PIXELS WITH OFF-SCREEN CLAMPING
      const domWidth = renderer.domElement.clientWidth;
      const domHeight = renderer.domElement.clientHeight;
      const wHalf = domWidth / 2;
      const hHalf = domHeight / 2;
      const tempV = new THREE.Vector3();
      const updatedCoords = {};

      Object.entries(hotspots).forEach(([key, spotVec]) => {
        tempV.copy(spotVec);
        tempV.y += dioramaGroup.position.y;
        tempV.project(camera);

        let x = (tempV.x * wHalf) + wHalf;
        let y = -(tempV.y * hHalf) + hHalf;
        const isBehind = tempV.z > 1;

        // Show hotspot only when camera is far, or hide as camera gets super close
        const distanceToTarget = camera.position.distanceTo(spotVec);
        const shouldHideBecauseClose = distanceToTarget < 3.0;

        // Check if hotspot is off-screen
        const isOffScreen = tempV.x < -1 || tempV.x > 1 || tempV.y < -1 || tempV.y > 1;

        let isClamped = false;
        let clampSide = null; // 'left', 'right', 'top', 'bottom'

        if (isOffScreen && !isBehind) {
          isClamped = true;
          // Clamping limits with safety margins
          // Mobile responsive safety margins
          const isMobile = domWidth <= 768;
          const paddingX = isMobile ? 75 : 110; // Centralize a bit more (clear the left bar at ~57px and right edge)
          const paddingY = isMobile ? 135 : 115; // Keep away from top navbar and bottom panel

          // Determine which side it went off-screen
          if (tempV.x < -1) clampSide = 'left';
          else if (tempV.x > 1) clampSide = 'right';
          else if (tempV.y < -1) clampSide = 'bottom';
          else if (tempV.y > 1) clampSide = 'top';

          x = Math.max(paddingX, Math.min(domWidth - paddingX, x));
          y = Math.max(paddingY, Math.min(domHeight - paddingY, y));
        }

        updatedCoords[key] = {
          x,
          y,
          isClamped,
          clampSide,
          visible: !isBehind && !shouldHideBecauseClose,
        };
      });

      setLabelCoords(updatedCoords);
    };

    animate();

    // --- 12. UNMOUNT DISPOSAL CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMoveDrag);
      window.removeEventListener('mouseup', handleMouseUp);
      
      canvasDom.removeEventListener('wheel', handleWheel);
      canvasDom.removeEventListener('mousedown', handleMouseDown);
      canvasDom.removeEventListener('touchstart', handleTouchStart);
      canvasDom.removeEventListener('touchmove', handleTouchMove);
      canvasDom.removeEventListener('touchend', handleTouchEnd);

      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }

      scene.clear();
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      texture1.dispose();
      texture2.dispose();
      document.body.style.cursor = 'default';
    };
  }, [router]);

  // Handler to jump dynamically between options
  const handleMilestoneClick = (progressVal) => {
    targetProgress.current = progressVal;
  };

  return (
    <div className="diorama-canvas-wrapper">
      {/* 3D Container Viewport */}
      <div ref={containerRef} className="webgl-canvas-container" />

      {/* Runic Medieval Loader Screen */}
      {isLoading && (
        <div className="diorama-loader">
          <div className="grimoire-loading-ring"></div>
          <p className="loading-title font-vintage animate-pulse">Consagrando Templo de Bella</p>
          <div className="loading-bar-outer">
            <div className="loading-bar-inner" style={{ width: `${loadingProgress}%` }}></div>
          </div>
          <span className="loading-percentage font-vintage">{loadingProgress}%</span>
        </div>
      )}

      {/* Runic Side Milestone Navigation Dot Bar */}
      {!isLoading && (
        <div className="diorama-vertical-milestones">
          <button 
            className={`milestone-dot-btn ${currentProgressState < 0.16 ? 'active' : ''}`}
            onClick={() => handleMilestoneClick(0.0)}
            title="Visão Geral"
          >
            <span className="milestone-sigil font-vintage">◈</span>
            <span className="milestone-desc-txt">Início</span>
          </button>
          
          <button 
            className={`milestone-dot-btn ${activeSection === 'tarot' ? 'active' : ''}`}
            onClick={() => handleMilestoneClick(0.33)}
            title="Mesa de Tarot"
          >
            <span className="milestone-sigil font-vintage">Ⅰ</span>
            <span className="milestone-desc-txt">O Oráculo</span>
          </button>

          <button 
            className={`milestone-dot-btn ${activeSection === 'rituals' ? 'active' : ''}`}
            onClick={() => handleMilestoneClick(0.66)}
            title="Grimório & Feitiços"
          >
            <span className="milestone-sigil font-vintage">Ⅱ</span>
            <span className="milestone-desc-txt">Os Rituais</span>
          </button>

          <button 
            className={`milestone-dot-btn ${activeSection === 'portal' ? 'active' : ''}`}
            onClick={() => handleMilestoneClick(1.0)}
            title="Portal de Salem"
          >
            <span className="milestone-sigil font-vintage">Ⅲ</span>
            <span className="milestone-desc-txt">O Portal</span>
          </button>
        </div>
      )}

      {/* Delivered Focused Options Parchment Card Overlay - DIRECTLY DRIVEN BY SCROLL INFLUENCE */}
      {!isLoading && (
        <div className="diorama-focused-panel-wrap">
          {/* Tarot card */}
          {sectionInfluences.tarot > 0.01 && (
            <div 
              className="parchment-focused-card medieval-ink-border"
              style={{
                opacity: sectionInfluences.tarot,
                transform: `translate3d(${(1 - sectionInfluences.tarot) * 50}px, 0, 0)`,
                pointerEvents: sectionInfluences.tarot > 0.5 ? 'auto' : 'none',
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '100%',
              }}
            >
              <span className="focused-tag font-vintage">Arcano Oráculo</span>
              <h3 className="focused-title font-vintage">MESA DE TAROT</h3>
              <p className="focused-synopsis">
                Tire suas cartas em 2D de alta definição. Revelações do Tarot e respostas diretas da Quimbanda para ativar sua força espiritual.
              </p>
              <button onClick={() => router.push('/tarot')} className="focused-cta-btn font-vintage primary-gold">
                🔮 ABRIR ORÁCULO ☾
              </button>
            </div>
          )}

          {/* Rituals card */}
          {sectionInfluences.rituals > 0.01 && (
            <div 
              className="parchment-focused-card medieval-ink-border theme-purple"
              style={{
                opacity: sectionInfluences.rituals,
                transform: `translate3d(${(1 - sectionInfluences.rituals) * 50}px, 0, 0)`,
                pointerEvents: sectionInfluences.rituals > 0.5 ? 'auto' : 'none',
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '100%',
              }}
            >
              <span className="focused-tag font-vintage text-purple">Feitiços e Ritos</span>
              <h3 className="focused-title font-vintage text-purple">GRIMÓRIO ALQUÍMICO</h3>
              <p className="focused-synopsis">
                Trilhas e feitiços potentes para ampliação de caminhos na terra e blindagem contra ataques espirituais.
              </p>
              <button onClick={() => router.push('/rituais')} className="focused-cta-btn font-vintage primary-purple">
                🔑 CONJURAR FEITIÇOS ✦
              </button>
            </div>
          )}

          {/* Portal card */}
          {sectionInfluences.portal > 0.01 && (
            <div 
              className="parchment-focused-card medieval-ink-border theme-cyan"
              style={{
                opacity: sectionInfluences.portal,
                transform: `translate3d(${(1 - sectionInfluences.portal) * 50}px, 0, 0)`,
                pointerEvents: sectionInfluences.portal > 0.5 ? 'auto' : 'none',
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '100%',
              }}
            >
              <span className="focused-tag font-vintage text-cyan">Círculo Secreto</span>
              <h3 className="focused-title font-vintage text-cyan">PORTAL DA BRUXA</h3>
              <p className="focused-synopsis">
                Acesse o seu portal particular consagrado para acompanhar a evolução de seus pactos e rituais dedicados.
              </p>
              <button onClick={() => router.push('/login')} className="focused-cta-btn font-vintage primary-cyan">
                🛡 ABRIR PORTAL OCULTO ◈
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Projected Hotspot Labels */}
      {!isLoading && Object.entries(labelCoords).map(([key, data]) => {
        if (!data.visible) return null;

        // Hide floating markers if their section is currently focused, to avoid visual clutter
        if (activeSection === key) return null;

        // Sequential hotspot visibility logic:
        // Click 1 (tarot) makes 2 (rituals) appear, Click 2 makes 3 (portal) appear, Click 3 makes 1 (tarot) appear.
        let shouldRender = false;
        if (!activeSection) {
          shouldRender = key === 'tarot'; // Start of the chain
        } else if (activeSection === 'tarot') {
          shouldRender = key === 'rituals';
        } else if (activeSection === 'rituals') {
          shouldRender = key === 'portal';
        } else if (activeSection === 'portal') {
          shouldRender = key === 'tarot';
        }

        if (!shouldRender) return null;

        const labels = {
          tarot: { name: 'Ⅰ', icon: '🔮' },
          rituals: { name: 'Ⅱ', icon: '🔑' },
          portal: { name: 'Ⅲ', icon: '🛡' },
        };

        const activeLabel = labels[key];

        return (
          <div
            key={key}
            className={`diorama-hotspot-label ${data.isClamped ? 'is-clamped' : ''} ${data.clampSide ? `clamp-${data.clampSide}` : ''}`}
            style={{
              left: `${data.x}px`,
              top: `${data.y}px`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'auto',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              const progressMap = { tarot: 0.33, rituals: 0.66, portal: 1.0 };
              handleMilestoneClick(progressMap[key]);
            }}
          >
            <div className="hotspot-pulse animate-pulse">
              <span className="pulse-text font-vintage">{activeLabel.name}</span>
              {data.isClamped && (
                <span className="clamped-indicator-arrow font-vintage">
                  {data.clampSide === 'left' && '‹'}
                  {data.clampSide === 'right' && '›'}
                  {data.clampSide === 'top' && '▴'}
                  {data.clampSide === 'bottom' && '▾'}
                </span>
              )}
            </div>
          </div>
        );
      })}


      <style jsx>{`
        .diorama-canvas-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .webgl-canvas-container {
          width: 100%;
          height: 100%;
          outline: none;
          cursor: grab;
        }

        .webgl-canvas-container:active {
          cursor: grabbing;
        }

        /* Loading Screen Screen */
        .diorama-loader {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #050209;
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }

        .grimoire-loading-ring {
          width: 65px;
          height: 65px;
          border: 2px solid var(--accent-gold);
          border-radius: 50%;
          border-top: 2px dashed var(--accent-purple-bright);
          animation: spin-clockwise 2.5s linear infinite;
          position: relative;
        }

        .grimoire-loading-ring::before {
          content: '✦';
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          color: var(--accent-gold-bright);
          font-size: 10px;
        }

        .loading-title {
          color: var(--accent-gold);
          font-size: 1.1rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
          animation: pulse-magic 2s ease-in-out infinite alternate;
        }

        .loading-bar-outer {
          width: 220px;
          height: 4px;
          background: rgba(184, 102, 255, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .loading-bar-inner {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-purple-bright), var(--accent-gold));
          transition: width 0.3s ease;
        }

        .loading-percentage {
          font-size: 0.85rem;
          color: var(--text-lavender);
          opacity: 0.8;
        }

        /* Hotspot pulser */
        .hotspot-pulse {
          width: 28px;
          height: 28px;
          background: rgba(12, 4, 20, 0.9);
          border: 1.5px solid var(--accent-gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px var(--accent-gold-bright);
          position: relative;
        }

        .hotspot-pulse::before {
          content: '';
          position: absolute;
          top: -4px; left: -4px; right: -4px; bottom: -4px;
          border: 1px dashed var(--accent-gold);
          border-radius: 50%;
          animation: pulse-ring 2s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
        }

        .pulse-text {
          font-size: 0.75rem;
          color: var(--accent-gold-bright);
          font-weight: bold;
          text-shadow: 0 0 5px var(--accent-gold-bright);
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        /* Dynamic Vertical Indicator Milestone Panel */
        .diorama-vertical-milestones {
          position: absolute;
          left: 35px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
          background: rgba(8, 3, 15, 0.78);
          backdrop-filter: blur(8px);
          padding: 1.8rem 1rem;
          border-radius: 40px;
          border: 1px solid rgba(212, 175, 55, 0.22);
          box-shadow: 0 10px 40px rgba(0,0,0,0.85);
        }

        .milestone-dot-btn {
          background: none;
          border: none;
          color: var(--text-lavender);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          position: relative;
          transition: all 0.3s ease;
          padding: 0;
          outline: none;
        }

        .milestone-sigil {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid rgba(194, 157, 56, 0.3);
          background: #09030f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          color: var(--text-secondary);
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
        }

        .milestone-desc-txt {
          font-family: var(--font-gothic);
          font-size: 0.75rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
          white-space: nowrap;
          pointer-events: none;
          color: var(--accent-gold);
        }

        .milestone-dot-btn:hover .milestone-desc-txt {
          opacity: 1;
          transform: translateX(0);
        }

        .milestone-dot-btn:hover .milestone-sigil {
          border-color: var(--accent-gold-bright);
          color: var(--accent-gold-bright);
          box-shadow: 0 0 12px var(--accent-gold);
          transform: scale(1.1);
        }

        .milestone-dot-btn.active .milestone-sigil {
          border-color: var(--accent-purple-bright);
          color: var(--accent-purple-bright);
          box-shadow: 0 0 15px var(--accent-purple-bright);
          transform: scale(1.15);
        }

        .milestone-dot-btn.active .milestone-desc-txt {
          opacity: 1;
          transform: translateX(0);
          color: var(--accent-purple-bright);
          font-weight: 700;
        }

        /* Delivered Focused Options Parchment Card Overlay */
        .diorama-focused-panel-wrap {
          position: absolute;
          right: 45px;
          bottom: 45px;
          z-index: 50;
          width: 380px;
          max-width: 90%;
          min-height: 250px;
        }

        .parchment-focused-card {
          padding: 2rem;
          background-color: var(--bg-parchment);
          box-shadow: 0 25px 50px rgba(0,0,0,0.95);
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          border-color: var(--text-ink);
          will-change: transform, opacity;
          position: relative;
        }

        .focused-tag {
          font-size: 0.75rem;
          color: var(--accent-gold);
          letter-spacing: 1px;
          text-transform: uppercase;
          display: block;
        }

        .focused-title {
          font-size: 1.6rem;
          color: var(--text-ink);
          letter-spacing: 1px;
          margin: 0;
          line-height: 1.1;
        }

        .focused-synopsis {
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--text-ink);
          font-style: italic;
          opacity: 0.88;
          font-weight: 500;
          margin: 0;
        }

        .focused-cta-btn {
          margin-top: 0.5rem;
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid var(--text-ink);
          font-size: 0.85rem;
          font-weight: bold;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        /* Colors themes matching sections for immersive gameplay */
        .focused-cta-btn.primary-gold {
          background: var(--text-ink);
          color: var(--bg-parchment);
        }
        .focused-cta-btn.primary-gold:hover {
          background: var(--bg-parchment-dark);
          color: var(--text-ink);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(194, 157, 56, 0.3);
        }

        /* Purple theme */
        .parchment-focused-card.theme-purple {
          border-color: #2e0854;
        }
        .text-purple {
          color: #8b32cc !important;
        }
        .focused-cta-btn.primary-purple {
          background: #2e0854;
          color: var(--bg-parchment);
          border-color: #2e0854;
        }
        .focused-cta-btn.primary-purple:hover {
          background: var(--bg-parchment-dark);
          color: #2e0854;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(139, 50, 204, 0.35);
        }

        /* Cyan theme */
        .parchment-focused-card.theme-cyan {
          border-color: #084c54;
        }
        .text-cyan {
          color: #00b4cc !important;
        }
        .focused-cta-btn.primary-cyan {
          background: #084c54;
          color: var(--bg-parchment);
          border-color: #084c54;
        }
        .focused-cta-btn.primary-cyan:hover {
          background: var(--bg-parchment-dark);
          color: #084c54;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 180, 204, 0.35);
        }

        /* Beautiful Slide-in animations */
        .animate-card-slide {
          animation: card-slide-in 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        @keyframes card-slide-in {
          0% {
            transform: translate3d(40px, 0, 0) scale(0.96);
            opacity: 0;
            filter: blur(5px);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }

        @keyframes spin-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse-magic {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }

        .diorama-hotspot-label {
          position: absolute;
          pointer-events: auto;
          z-index: 40;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .diorama-hotspot-label.is-clamped {
          animation: clamped-bounce 2s infinite ease-in-out;
        }

        .clamped-indicator-arrow {
          position: absolute;
          color: var(--accent-gold-bright);
          font-size: 1.25rem;
          font-weight: bold;
          text-shadow: 0 0 10px var(--accent-gold-bright);
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clamp-right .clamped-indicator-arrow {
          right: -15px;
          top: 50%;
          transform: translateY(-50%);
          animation: arrow-nudge-right 1.5s infinite alternate ease-in-out;
        }

        .clamp-left .clamped-indicator-arrow {
          left: -15px;
          top: 50%;
          transform: translateY(-50%);
          animation: arrow-nudge-left 1.5s infinite alternate ease-in-out;
        }

        .clamp-top .clamped-indicator-arrow {
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          animation: arrow-nudge-top 1.5s infinite alternate ease-in-out;
        }

        .clamp-bottom .clamped-indicator-arrow {
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          animation: arrow-nudge-bottom 1.5s infinite alternate ease-in-out;
        }

        @keyframes arrow-nudge-right {
          0% { transform: translateY(-50%) translateX(0); opacity: 0.7; }
          100% { transform: translateY(-50%) translateX(4px); opacity: 1; }
        }

        @keyframes arrow-nudge-left {
          0% { transform: translateY(-50%) translateX(0); opacity: 0.7; }
          100% { transform: translateY(-50%) translateX(-4px); opacity: 1; }
        }

        @keyframes arrow-nudge-top {
          0% { transform: translateX(-50%) translateY(0); opacity: 0.7; }
          100% { transform: translateX(-50%) translateY(-4px); opacity: 1; }
        }

        @keyframes arrow-nudge-bottom {
          0% { transform: translateX(-50%) translateY(0); opacity: 0.7; }
          100% { transform: translateX(-50%) translateY(4px); opacity: 1; }
        }

        @keyframes clamped-bounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.4)); }
          50% { transform: translate(-50%, -50%) scale(1.1); filter: drop-shadow(0 0 15px var(--accent-gold-bright)) brightness(1.2); }
        }


        /* Mobile Responsive Adaptations */
        @media (max-width: 768px) {
          .diorama-vertical-milestones {
            left: 15px;
            top: 90px; /* Position at the top-left on mobile, completely clear of the bottom card */
            transform: none;
            padding: 1rem 0.5rem;
            gap: 1rem;
          }

          .milestone-sigil {
            width: 26px;
            height: 26px;
            font-size: 0.75rem;
          }

          .milestone-desc-txt {
            display: none; /* Hide labels completely on mobile dot bar */
          }

          .diorama-focused-panel-wrap {
            right: 5%;
            left: 5%;
            bottom: 80px; /* Position above mobile sticky app navigation bar */
            width: 90%;
            min-height: 215px;
          }

          .parchment-focused-card {
            padding: 1.2rem 1.4rem;
            gap: 0.5rem;
          }

          .focused-title {
            font-size: 1.25rem;
          }

          .focused-synopsis {
            font-size: 0.72rem;
            line-height: 1.35;
          }

          .focused-cta-btn {
            padding: 0.65rem 0.8rem;
            font-size: 0.78rem;
            letter-spacing: 1px;
          }

      `}</style>
    </div>
  );
}
