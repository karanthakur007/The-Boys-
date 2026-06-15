import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Lobby3DPreviewProps {
  styleHex: string;
  weaponColor: string;
}

export default function Lobby3DPreview({ styleHex, weaponColor }: Lobby3DPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get containment size bounds safely
    const width = containerRef.current.clientWidth || 240;
    const height = containerRef.current.clientHeight || 150;

    // Setup Scene
    const scene = new THREE.Scene();
    // Warm custom neon ambient color matching the control terminal mood
    scene.background = new THREE.Color(0x06060c);

    // Setup Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.7, 4.4);
    camera.lookAt(new THREE.Vector3(0, 1.05, 0));

    // Setup WebGL Renderer with antialiasing
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Clear previous containers before mounting the Canvas
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Add Ambient and Directional Key lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffeedd, 1.4);
    dirLight1.position.set(4, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 0.9);
    dirLight2.position.set(-4, 3, -2);
    scene.add(dirLight2);

    // Character container Group to run continuous orbit animations
    const charGroup = new THREE.Group();
    scene.add(charGroup);

    // Pedestal floor platform
    const platformGeo = new THREE.CylinderGeometry(1.0, 1.1, 0.14, 16);
    const platformMat = new THREE.MeshStandardMaterial({ 
      color: 0x111827, 
      roughness: 0.5, 
      metalness: 0.2 
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.set(0, -0.07, 0);
    charGroup.add(platform);

    // Sleek outfit body torso
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.28, 1.25, 10);
    const torsoMat = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(styleHex),
      roughness: 0.12,
      metalness: 0.4
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.set(0, 0.75, 0);
    charGroup.add(torso);

    // Face / Head Sphere
    const headGeo = new THREE.SphereGeometry(0.28, 12, 12);
    const headMat = new THREE.MeshStandardMaterial({ 
      color: 0xfbcfe8, // soft human skin base
      roughness: 0.4 
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 1.48, 0);
    charGroup.add(head);

    // Custom hat / helmet matching active skin color
    const helmetGeo = new THREE.BoxGeometry(0.62, 0.26, 0.62);
    const helmetMat = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(styleHex),
      roughness: 0.15 
    });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.set(0, 1.64, 0.04);
    charGroup.add(helmet);

    // Golden Visor
    const visorGeo = new THREE.BoxGeometry(0.48, 0.12, 0.14);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.49, -0.22);
    charGroup.add(visor);

    // Sleek tactical flowing back Cape
    const capeGeo = new THREE.BoxGeometry(0.72, 1.15, 0.04);
    const capeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(styleHex),
      transparent: true,
      opacity: 0.75,
      roughness: 0.2
    });
    const cape = new THREE.Mesh(capeGeo, capeMat);
    cape.position.set(0, 0.65, 0.24);
    cape.rotation.x = 0.08;
    charGroup.add(cape);

    // Weapon skin equipped model in right hand
    const rightGunGeo = new THREE.BoxGeometry(0.12, 0.12, 0.95);
    const rightGunMat = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(weaponColor), 
      metalness: 0.85, 
      roughness: 0.15 
    });
    const rightGun = new THREE.Mesh(rightGunGeo, rightGunMat);
    rightGun.position.set(0.36, 0.72, -0.32);
    charGroup.add(rightGun);

    // Left auxiliary gadget
    const leftGadgetGeo = new THREE.BoxGeometry(0.1, 0.15, 0.15);
    const leftGadgetMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, emissive: 0x991b1b });
    const leftGadget = new THREE.Mesh(leftGadgetGeo, leftGadgetMat);
    leftGadget.position.set(-0.36, 0.65, -0.15);
    charGroup.add(leftGadget);

    // Ambient dust background particles
    const dustCount = 18;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 4;
      dustPositions[i * 3 + 1] = Math.random() * 2.2;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({ 
      color: 0xef4444, 
      size: 0.045, 
      transparent: true, 
      opacity: 0.6 
    });
    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);

    let frameId: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      frameId = requestAnimationFrame(renderLoop);
      const elapsed = clock.getElapsedTime();

      // Continuous rotation of character
      charGroup.rotation.y = elapsed * 0.75;
      
      // Floating breathe effect
      charGroup.position.y = Math.sin(elapsed * 2) * 0.035;

      // Rotate dust particles slowly
      dustParticles.rotation.y = elapsed * 0.05;

      renderer.render(scene, camera);
    };

    renderLoop();

    // Resize handler
    const resizeListener = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', resizeListener);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resizeListener);
      renderer.dispose();
    };
  }, [styleHex, weaponColor]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[140px] relative overflow-hidden flex items-center justify-center"
    />
  );
}
