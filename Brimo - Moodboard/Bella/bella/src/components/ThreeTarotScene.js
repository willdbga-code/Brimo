import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export default function ThreeTarotScene({ onCardSelect, selectedCards, drawState, drawnCards }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cardsRef = useRef([]);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const cardMaterialsRef = useRef([]); // Hold front materials to update textures dynamically
  
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Helper to draw a gorgeous, high-resolution procedural card back
  const createCardBackTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');

    // Mystic dark purple background radial gradient
    const grad = ctx.createRadialGradient(256, 384, 50, 256, 384, 400);
    grad.addColorStop(0, '#1a0d33');
    grad.addColorStop(1, '#070211');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 768);

    // Golden metallic double borders
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, 472, 728);
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, 432, 688);

    // Alchemical corner ornaments
    ctx.fillStyle = '#d4af37';
    ctx.font = '24px Outfit, serif';
    ctx.fillText('✦', 55, 75);
    ctx.fillText('✦', 435, 75);
    ctx.fillText('✦', 55, 715);
    ctx.fillText('✦', 435, 715);

    // Outer astronomical orbit rings
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(256, 384, 150, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(139, 50, 204, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(256, 384, 170, 0, Math.PI * 2);
    ctx.stroke();

    // Central Mystic Moon
    ctx.fillStyle = '#d4af37';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '110px Outfit, serif';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
    ctx.shadowBlur = 15;
    ctx.fillText('☾', 256, 380);

    // Central sunburst lines (dashed)
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.arc(256, 384, 100, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]); // Reset

    // Stars floating inside
    ctx.font = '28px Outfit, serif';
    ctx.fillText('✦', 256, 170);
    ctx.fillText('✦', 256, 598);
    ctx.fillText('★', 110, 384);
    ctx.fillText('★', 402, 384);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  // Helper to draw a custom tarot card front dynamically
  const createCardFrontTexture = (cardName, cardSymbol, cardType) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');

    // Ancient aged parchment card paper background
    const grad = ctx.createLinearGradient(0, 0, 0, 768);
    grad.addColorStop(0, '#fbf8eb');
    grad.addColorStop(0.5, '#f4ecd0');
    grad.addColorStop(1, '#e8dcba');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 768);

    // Subtle dark noise/vignette on the parchment
    ctx.fillStyle = 'rgba(139, 105, 50, 0.05)';
    for (let i = 0; i < 800; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 768;
      const rs = Math.random() * 3 + 1;
      ctx.fillRect(rx, ry, rs, rs);
    }

    // Elegant gold border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, 472, 728);
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, 442, 698);

    // Woodblock print dark outlines
    ctx.strokeStyle = '#241435';
    ctx.lineWidth = 4;
    ctx.strokeRect(45, 45, 422, 678);

    // Card Type Header (Passado, Presente, Futuro)
    ctx.fillStyle = 'rgba(36, 20, 53, 0.7)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'italic bold 20px Outfit, sans-serif';
    ctx.fillText((cardType || 'FUTURO').toUpperCase(), 256, 75);

    // Central magical illustration area
    ctx.strokeStyle = '#241435';
    ctx.lineWidth = 3;
    ctx.strokeRect(65, 110, 382, 480);

    // Illustration background (cosmic dark purple sketch field)
    ctx.fillStyle = '#0f071c';
    ctx.fillRect(68, 113, 376, 474);

    // Draw alchemical glyphs in the sketch area
    ctx.fillStyle = '#d4af37';
    ctx.font = '180px Outfit, serif';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
    ctx.shadowBlur = 20;
    ctx.fillText(cardSymbol || '✦', 256, 340);
    ctx.shadowBlur = 0;

    // Draw alchemical circular grid around the symbol
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(256, 340, 130, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(256, 340, 150, 0, Math.PI * 2);
    ctx.stroke();

    // Runic line rays from the center
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.setLineDash([4, 10]);
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
      ctx.beginPath();
      ctx.moveTo(256 + Math.cos(angle) * 30, 340 + Math.sin(angle) * 30);
      ctx.lineTo(256 + Math.cos(angle) * 160, 340 + Math.sin(angle) * 160);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Card Name Title Footer
    ctx.fillStyle = '#241435';
    ctx.font = 'bold 36px "Pirata One", Outfit, serif';
    ctx.fillText(cardName || 'MISTÉRIO', 256, 640);

    // Astrological coordinates in gold footer corners
    ctx.fillStyle = '#d4af37';
    ctx.font = '16px monospace';
    ctx.fillText('☾ ALCH', 105, 640);
    ctx.fillText('SYS ✦', 407, 640);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#06020f');
    scene.fog = new THREE.FogExp2('#06020f', 0.04);

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 12, 12);
    cameraRef.current = camera;

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    containerRef.current.appendChild(renderer.domElement);

    // --- Orbit Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1; // Limit looking from below the table
    controls.minDistance = 6;
    controls.maxDistance = 25;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // --- Dynamic Resizing ---
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Lighting Design ---
    const ambientLight = new THREE.AmbientLight(0x28054a, 1.8);
    scene.add(ambientLight);

    // Candlelight glow left
    const candleLeft = new THREE.PointLight(0xffa233, 8.0, 15);
    candleLeft.position.set(-5, 3, -1);
    candleLeft.castShadow = true;
    candleLeft.shadow.bias = -0.002;
    candleLeft.shadow.mapSize.width = 1024;
    candleLeft.shadow.mapSize.height = 1024;
    scene.add(candleLeft);

    // Candlelight glow right
    const candleRight = new THREE.PointLight(0xff7722, 6.0, 12);
    candleRight.position.set(5, 2.5, -2);
    candleRight.castShadow = true;
    candleRight.shadow.bias = -0.002;
    candleRight.shadow.mapSize.width = 1024;
    candleRight.shadow.mapSize.height = 1024;
    scene.add(candleRight);

    // Alchemical overhead spotlight (for gold details)
    const spotlight = new THREE.SpotLight(0xdfbd6c, 15.0, 20, Math.PI / 4, 0.5, 1);
    spotlight.position.set(0, 8, 3);
    spotlight.target.position.set(0, 0, 0);
    spotlight.castShadow = true;
    scene.add(spotlight);
    scene.add(spotlight.target);

    // Add glowing candle dust particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 60;
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;     // x
      positions[i * 3 + 1] = Math.random() * 4 + 0.2;     // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;  // z
      particleSpeeds.push({
        y: Math.random() * 0.008 + 0.002,
        swingSpeed: Math.random() * 0.02 + 0.005,
        swingAmp: Math.random() * 0.005 + 0.002,
        seed: Math.random() * 100
      });
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffaa44,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Load Altar Model (FBX) ---
    const fbxLoader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();
    const texture1 = textureLoader.load('/models/Diorama_Abledo_1.tga.png');
    const texture2 = textureLoader.load('/models/Diorama_Abledo_2.tga.png');
    
    texture1.colorSpace = THREE.SRGBColorSpace;
    texture2.colorSpace = THREE.SRGBColorSpace;

    fbxLoader.load(
      '/models/Tarottable.fbx',
      (object) => {
        modelRef.current = object;
        
        object.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            if (child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((mat) => {
                if (mat && mat.name && mat.name.toLowerCase().includes('2')) {
                  mat.map = texture2;
                } else if (child && child.name && child.name.toLowerCase().includes('2')) {
                  mat.map = texture2;
                } else {
                  mat.map = texture1;
                }
                
                if (mat) {
                  mat.roughness = 0.75;
                  mat.metalness = 0.15;
                  mat.needsUpdate = true;
                }
              });
            }
          }
        });

        // Compute Bounding Box to perfectly center and auto-scale model
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        object.position.x -= center.x;
        object.position.y -= center.y;
        object.position.z -= center.z;

        const maxDimension = Math.max(size.x, size.y, size.z);
        const targetSize = 9.5; 
        const scaleFactor = targetSize / maxDimension;
        object.scale.set(scaleFactor, scaleFactor, scaleFactor);
        object.position.y += 0.25;

        scene.add(object);
        
        buildTarotCards(scene);
        setLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadingProgress(Math.floor((xhr.loaded / xhr.total) * 100));
        }
      },
      (error) => {
        console.error('An error happened while loading the 3D altar FBX model:', error);
        buildTarotCards(scene);
        setLoading(false);
      }
    );

    // --- Build 3D Cards ---
    const buildTarotCards = (targetScene) => {
      // Clear previous if any
      cardsRef.current.forEach(c => {
        if (c && c.group) targetScene.remove(c.group);
      });
      cardsRef.current = [];
      cardMaterialsRef.current = [];

      const cardBackTexture = createCardBackTexture();
      const positionsX = [-2.4, 0, 2.4]; 
      
      // We render 3 card placeholders initially
      for (let idx = 0; idx < 3; idx++) {
        const cardGroup = new THREE.Group();
        
        const isIdle = drawState === 'idle';
        const startX = 0;
        const startZ = 0;
        const startY = 1.25 + idx * 0.05; // Stack Y hierarchy

        cardGroup.position.set(startX, startY, startZ); 
        cardGroup.rotation.set(-Math.PI / 2, 0, 0); // Flat on the table

        const cardWidth = 1.35;
        const cardHeight = 2.05;
        const geomFront = new THREE.PlaneGeometry(cardWidth, cardHeight);
        const geomBack = new THREE.PlaneGeometry(cardWidth, cardHeight);

        // Blank placeholder/front initially
        const placeholderName = (drawnCards && drawnCards[idx]?.name) || 'MISTÉRIO';
        const placeholderSymbol = (drawnCards && drawnCards[idx]?.symbol) || '✦';
        const placeholderType = (drawnCards && drawnCards[idx]?.type) || (idx === 0 ? 'Passado' : idx === 1 ? 'Presente' : 'Futuro');
        
        const cardFrontTexture = createCardFrontTexture(placeholderName, placeholderSymbol, placeholderType);
        
        const matFront = new THREE.MeshStandardMaterial({
          map: cardFrontTexture,
          roughness: 0.4,
          metalness: 0.05,
          side: THREE.FrontSide
        });

        const matBack = new THREE.MeshStandardMaterial({
          map: cardBackTexture,
          roughness: 0.5,
          metalness: 0.2,
          side: THREE.FrontSide
        });

        const meshFront = new THREE.Mesh(geomFront, matFront);
        meshFront.rotation.y = Math.PI; 
        meshFront.position.y = 0.002;
        meshFront.castShadow = true;
        meshFront.receiveShadow = true;

        const meshBack = new THREE.Mesh(geomBack, matBack);
        meshBack.position.y = -0.002;
        meshBack.castShadow = true;
        meshBack.receiveShadow = true;

        cardGroup.add(meshFront);
        cardGroup.add(meshBack);
        
        // Random slight rotation offset
        const randRotZ = (Math.random() - 0.5) * 0.05;
        cardGroup.rotation.z = randRotZ;

        targetScene.add(cardGroup);

        cardsRef.current.push({
          group: cardGroup,
          index: idx,
          baseY: 1.25,
          baseRotZ: randRotZ,
          isFlipped: false,
          isHovered: false,
          targetX: isIdle ? 0 : positionsX[idx],
          targetZ: isIdle ? 0 : 0.4,
          targetY: startY,
          targetRotY: 0
        });

        // Store material ref to update texture dynamically
        cardMaterialsRef.current.push(matFront);
      }
    };

    // --- Raycasting / Hover / Click Detection ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredCardIdx = null;

    const onPointerMove = (event) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);

      const intersectableMeshes = [];
      cardsRef.current.forEach(c => {
        if (c && c.group && drawState !== 'idle') {
          c.group.traverse(child => {
            if (child && child.isMesh) {
              intersectableMeshes.push(child);
              child.userData = { cardIndex: c.index };
            }
          });
        }
      });

      const intersects = raycaster.intersectObjects(intersectableMeshes);
      
      if (intersects.length > 0) {
        const clickedIndex = intersects[0].object.userData.cardIndex;
        
        if (hoveredCardIdx !== clickedIndex) {
          hoveredCardIdx = clickedIndex;
          containerRef.current.style.cursor = 'pointer';
        }
        
        cardsRef.current.forEach((c) => {
          if (c) c.isHovered = c.index === clickedIndex;
        });
      } else {
        if (hoveredCardIdx !== null) {
          hoveredCardIdx = null;
          containerRef.current.style.cursor = 'default';
        }
        cardsRef.current.forEach((c) => {
          if (c) c.isHovered = false;
        });
      }
    };

    const onPointerDown = (event) => {
      if (drawState === 'idle') return; // Cards are stacked in deck, no flip allowed
      
      let mouseMoved = false;
      const onMove = () => { mouseMoved = true; };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        
        if (mouseMoved) return; 
        
        raycaster.setFromCamera(mouse, camera);
        
        const intersectableMeshes = [];
        cardsRef.current.forEach(c => {
          if (c && c.group) {
            c.group.traverse(child => {
              if (child && child.isMesh) {
                intersectableMeshes.push(child);
                child.userData = { cardIndex: c.index };
              }
            });
          }
        });

        const intersects = raycaster.intersectObjects(intersectableMeshes);
        if (intersects.length > 0) {
          const cardIdx = intersects[0].object.userData.cardIndex;
          const card = cardsRef.current[cardIdx];
          
          if (card && !card.isFlipped && drawnCards && drawnCards[cardIdx]) {
            card.isFlipped = true;
            card.targetRotY = Math.PI;
            card.targetY = 1.9;
            onCardSelect(cardIdx, drawnCards[cardIdx]);
          }
        }
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    };

    containerRef.current.addEventListener('mousemove', onPointerMove);
    containerRef.current.addEventListener('mousedown', onPointerDown);

    // --- Core Animation Loop ---
    const clock = new THREE.Clock();
    let animId = null;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      
      const elapsed = clock.getElapsedTime();
      controls.update();

      // Animate alchemical particles
      const particlePos = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const speed = particleSpeeds[i];
        particlePos[i * 3 + 1] += speed.y;
        particlePos[i * 3] += Math.sin(elapsed * speed.swingSpeed + speed.seed) * speed.swingAmp;
        
        if (particlePos[i * 3 + 1] > 4.5) {
          particlePos[i * 3 + 1] = 0.2;
          particlePos[i * 3] = (Math.random() - 0.5) * 12;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Animate Card Positions / Rotations (Lerp mechanics)
      const positionsX = [-2.4, 0, 2.4];
      cardsRef.current.forEach((c) => {
        if (!c) return;
        let targetX = 0;
        let targetZ = 0;
        let targetHeight = c.baseY;

        if (drawState === 'idle') {
          targetX = 0;
          targetZ = 0;
          targetHeight = c.baseY + c.index * 0.05; // Stacked
          c.targetRotY = 0;
          c.group.rotation.x = THREE.MathUtils.lerp(c.group.rotation.x, -Math.PI / 2, 0.1);
        } else {
          targetX = positionsX[c.index];
          targetZ = 0.4;
          
          if (c.isHovered && !c.isFlipped) {
            targetHeight = c.baseY + 0.35;
            c.group.rotation.x = THREE.MathUtils.lerp(c.group.rotation.x, -Math.PI / 2 - 0.15, 0.12);
          } else if (c.isFlipped) {
            targetHeight = 1.9;
            c.group.rotation.x = THREE.MathUtils.lerp(c.group.rotation.x, -Math.PI / 2, 0.12);
          } else {
            c.group.rotation.x = THREE.MathUtils.lerp(c.group.rotation.x, -Math.PI / 2, 0.12);
          }
          c.targetRotY = c.isFlipped ? Math.PI : 0;
        }

        // Apply smooth lerp
        c.group.position.x = THREE.MathUtils.lerp(c.group.position.x, targetX, 0.08);
        c.group.position.z = THREE.MathUtils.lerp(c.group.position.z, targetZ, 0.08);

        const breatheOffset = drawState === 'idle' ? 0 : Math.sin(elapsed * 2.2 + c.index * 2) * 0.04;
        c.group.position.y = THREE.MathUtils.lerp(c.group.position.y, targetHeight + breatheOffset, 0.08);
        c.group.rotation.y = THREE.MathUtils.lerp(c.group.rotation.y, c.targetRotY, 0.08);
      });

      // Candle light flickering
      candleLeft.intensity = 8.0 + Math.sin(elapsed * 12) * 0.8 + Math.cos(elapsed * 7) * 0.4;
      candleRight.intensity = 6.0 + Math.cos(elapsed * 10) * 0.6 + Math.sin(elapsed * 6) * 0.3;

      renderer.render(scene, camera);
    };
    
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', onPointerMove);
        containerRef.current.removeEventListener('mousedown', onPointerDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.removeChild(renderer.domElement);
      }
      
      scene.traverse((obj) => {
        if (obj && obj.isMesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach(m => { if (m) m.dispose(); });
            } else {
              obj.material.dispose();
            }
          }
        }
      });
    };
  }, [onCardSelect, drawState]);

  // --- Dynamic card front texture updating when drawnCards change ---
  useEffect(() => {
    if (drawnCards && drawnCards.length === 3 && cardMaterialsRef.current && cardMaterialsRef.current.length === 3) {
      drawnCards.forEach((card, idx) => {
        const mat = cardMaterialsRef.current[idx];
        if (mat && card) {
          // Dispose old texture to free GPU memory
          if (mat.map) mat.map.dispose();
          
          // Re-generate texture
          const newTex = createCardFrontTexture(card.name, card.symbol, card.type);
          mat.map = newTex;
          mat.needsUpdate = true;
        }
      });
    }

    // Reset flipped states visually inside cardsRef if drawState goes back to idle
    if (drawState === 'idle' && cardsRef.current && cardsRef.current.length === 3) {
      cardsRef.current.forEach((c) => {
        if (c) {
          c.isFlipped = false;
          c.isHovered = false;
          c.targetRotY = 0;
        }
      });

      // Smoothly reset camera to deck overview position
      if (controlsRef.current && cameraRef.current) {
        let elapsed = 0;
        const resetInterval = setInterval(() => {
          elapsed += 0.05;
          if (cameraRef.current) {
            cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, 0, 0.1);
            cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, 12, 0.1);
            cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, 12, 0.1);
          }
          if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0);
          }
          
          if (elapsed > 1.2) {
            clearInterval(resetInterval);
          }
        }, 30);
      }
    }
  }, [drawnCards, drawState]);

  // --- Camera focus transition when card flipped ---
  useEffect(() => {
    if (selectedCards && selectedCards.length > 0 && cameraRef.current && controlsRef.current && drawState !== 'idle') {
      const latestCardIdx = selectedCards[selectedCards.length - 1];
      if (cardsRef.current) {
        const targetCard = cardsRef.current[latestCardIdx];
        
        if (targetCard && targetCard.group) {
          const cardX = targetCard.group.position.x;
          
          let elapsed = 0;
          const zoomInterval = setInterval(() => {
            elapsed += 0.05;
            if (controlsRef.current) {
              controlsRef.current.target.x = THREE.MathUtils.lerp(controlsRef.current.target.x, cardX, 0.08);
              controlsRef.current.target.y = THREE.MathUtils.lerp(controlsRef.current.target.y, 1.8, 0.08);
              controlsRef.current.target.z = THREE.MathUtils.lerp(controlsRef.current.target.z, 0.3, 0.08);
            }
            if (cameraRef.current) {
              cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, cardX, 0.08);
              cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, 6.5, 0.08);
              cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, 5.0, 0.08);
            }

            if (elapsed > 1.0) {
              clearInterval(zoomInterval);
            }
          }, 30);
        }
      }
    }
  }, [selectedCards, drawState]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#06020f] z-[99] flex flex-col items-center justify-center text-center p-4">
          <div className="loading-sigil">☾</div>
          <h3 className="gothic-title text-2xl text-[#d4af37] mb-2 uppercase tracking-[0.2em] font-bold">
            Carregando Altar Alquímico 3D
          </h3>
          <div className="w-[280px] h-[3px] bg-[rgba(212,175,55,0.15)] rounded-full overflow-hidden mb-3 relative">
            <div 
              className="h-full bg-gradient-to-r from-[#8b32cc] to-[#dfbd6c] transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-[#b19ffb] uppercase tracking-[0.1em]">
            Purificando malhas e alinhando órbitas ({loadingProgress}%)
          </span>
        </div>
      )}

      {/* Mounting point for the canvas */}
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '100%', outline: 'none' }}
      />

      <style jsx>{`
        .absolute { position: absolute; }
        .inset-0 { top: 0; left: 0; right: 0; bottom: 0; }
        .z-\[99\] { z-index: 99; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .text-center { text-align: center; }
        .text-[#d4af37] { color: var(--accent-gold); }
        .text-\[11px\] { font-size: 11px; }
        .text-[#b19ffb] { color: var(--text-lavender); }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .w-\[280px\] { width: 280px; }
        .h-\[3px\] { height: 3px; }
        .bg-\[rgba\(212\,175\,55\,0\.15\)\] { background: rgba(212, 175, 55, 0.15); }
        .rounded-full { border-radius: 9999px; }
        .overflow-hidden { overflow: hidden; }
        .h-full { height: 100%; }
        .bg-gradient-to-r { background: linear-gradient(to right, var(--accent-purple-bright), var(--accent-gold)); }
        .transition-all { transition: all 0.3s ease; }
        .duration-300 { transition-duration: 300ms; }
        .tracking-\[0\.2em\] { letter-spacing: 0.2em; }
        .tracking-\[0\.1em\] { letter-spacing: 0.1em; }
        .font-bold { font-weight: bold; }

        .loading-sigil {
          font-size: 3.5rem;
          color: var(--accent-gold-bright);
          text-shadow: 0 0 20px var(--accent-gold);
          animation: spin-pulse 3s infinite ease-in-out;
          margin-bottom: 1.5rem;
        }

        @keyframes spin-pulse {
          0% { transform: rotate(0deg) scale(1); opacity: 0.7; }
          50% { transform: rotate(180deg) scale(1.15); opacity: 1; text-shadow: 0 0 35px var(--accent-gold-bright); }
          100% { transform: rotate(360deg) scale(1); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
