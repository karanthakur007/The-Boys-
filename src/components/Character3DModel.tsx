import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Character3DModelProps {
  characterId: string;
  className?: string;
}

export default function Character3DModel({ characterId, className = '' }: Character3DModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [poseTrigger, setPoseTrigger] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 300;
    const height = containerRef.current.clientHeight || 280;

    // SCENE & AMBIENCE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040409);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 3.8);
    camera.lookAt(new THREE.Vector3(0, 0.85, 0));

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 1.3);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    // Character Rim Lights based on character thematic colors
    const themeColors: Record<string, { rim: number; base: number; secondary: number; particles: number }> = {
      // THE BOYS
      butcher: { rim: 0x06b6d4, base: 0x1c1917, secondary: 0x44403c, particles: 0x0284c7 },
      hughie: { rim: 0x10b981, base: 0x064e3b, secondary: 0x047857, particles: 0x34d399 },
      mm: { rim: 0xeab308, base: 0x78350f, secondary: 0x1e3a8a, particles: 0xfacc15 },
      frenchie: { rim: 0x6366f1, base: 0x1e1b4b, secondary: 0x4f46e5, particles: 0x818cf8 },
      kimiko: { rim: 0xe11d48, base: 0x4c0519, secondary: 0x881337, particles: 0xf43f5e },
      starlight: { rim: 0xfacc15, base: 0xfef08a, secondary: 0xa16207, particles: 0xffffff },

      // THE SEVEN
      homelander: { rim: 0xef4444, base: 0x1e3a8a, secondary: 0xb91c1c, particles: 0xfacc15 },
      maeve: { rim: 0xd97706, base: 0x451a03, secondary: 0xb45309, particles: 0xfbbf24 },
      atrain: { rim: 0x0284c7, base: 0x0c4a6e, secondary: 0x38bdf8, particles: 0xffffff },
      blacknoir: { rim: 0x71717a, base: 0x18181b, secondary: 0x27272a, particles: 0xef4444 },
      thedeep: { rim: 0x14b8a6, base: 0x042f2e, secondary: 0x0f766e, particles: 0x2dd4bf },
      sagesister: { rim: 0xa855f7, base: 0x3b0764, secondary: 0x581c87, particles: 0xc084fc }
    };

    const currentTheme = themeColors[characterId] || { rim: 0x64748b, base: 0x334155, secondary: 0x1e293b, particles: 0x94a3b8 };

    const sideLight = new THREE.DirectionalLight(currentTheme.rim, 1.8);
    sideLight.position.set(-3, 2, -2);
    scene.add(sideLight);

    // MAIN GROUP
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // PEDESTAL PLATFORM
    const pedestalGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.12, 16);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0b0d13,
      emissive: currentTheme.base,
      emissiveIntensity: 0.15,
      roughness: 0.4,
      metalness: 0.8
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(0, -0.06, 0);
    mainGroup.add(pedestal);

    // Glowing Scanner Ring
    const ringGeo = new THREE.RingGeometry(0.86, 0.93, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: currentTheme.rim,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 0.012, 0);
    mainGroup.add(ring);

    // CHARACTER ROOT GROUP
    const charRoot = new THREE.Group();
    mainGroup.add(charRoot);

    // LEGS
    const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.6, 8);
    const legMat = new THREE.MeshStandardMaterial({
      color: currentTheme.base,
      roughness: 0.6
    });

    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.16, 0.3, 0);
    charRoot.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.16, 0.3, 0);
    charRoot.add(rightLeg);

    // TORSO BODY
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.22, 0.8, 10);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: currentTheme.base,
      roughness: 0.2,
      metalness: 0.3
    });
    const torso = new THREE.Mesh(bodyGeo, bodyMat);
    torso.position.set(0, 0.9, 0);
    charRoot.add(torso);

    // HEAD
    const headGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({
      color: characterId === 'blacknoir' ? 0x09090b : 0xffdbc5,
      roughness: 0.4
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 1.4, 0);
    charRoot.add(head);

    // ARMS
    const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.55, 8);
    const armMat = new THREE.MeshStandardMaterial({
      color: currentTheme.secondary,
      roughness: 0.3
    });

    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.38, 1.0, 0);
    leftArm.rotation.z = 0.15;
    charRoot.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.38, 1.0, 0);
    rightArm.rotation.z = -0.15;
    charRoot.add(rightArm);

    // CHARACTER SPECIFIC EXTRAS
    const extrasGroup = new THREE.Group();
    charRoot.add(extrasGroup);

    // 1. BILLY BUTCHER: Long Trenchcoat (boxes enveloping back) + Glowing Temp V blue Laser eyes lasers
    if (characterId === 'butcher') {
      const coatGeo1 = new THREE.BoxGeometry(0.5, 0.8, 0.05);
      const coatMat = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.8 });
      const coat1 = new THREE.Mesh(coatGeo1, coatMat);
      coat1.position.set(0, 0.72, 0.12);
      coat1.rotation.y = 0.05;
      extrasGroup.add(coat1);

      // Crowbar
      const barGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 6);
      const barMat = new THREE.MeshStandardMaterial({ color: 0x57534e, metalness: 0.9, roughness: 0.1 });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(0.42, 0.8, -0.15);
      bar.rotation.x = -Math.PI / 4;
      extrasGroup.add(bar);

      // Laser Eyes
      const laserGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.2, 5);
      laserGeo.rotateX(Math.PI / 2);
      const laserMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      
      const leftLaser = new THREE.Mesh(laserGeo, laserMat);
      leftLaser.position.set(-0.06, 1.42, -0.6);
      extrasGroup.add(leftLaser);

      const rightLaser = new THREE.Mesh(laserGeo, laserMat);
      rightLaser.position.set(0.06, 1.42, -0.6);
      extrasGroup.add(rightLaser);
    }

    // 2. HUGHIE CAMPBELL: Emerald speed rings
    if (characterId === 'hughie') {
      const ringGeoLine = new THREE.RingGeometry(0.35, 0.38, 16);
      ringGeoLine.rotateX(-Math.PI / 2);
      const ringMatHughie = new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide });
      const hRing = new THREE.Mesh(ringGeoLine, ringMatHughie);
      hRing.position.set(0, 0.9, 0);
      extrasGroup.add(hRing);

      // Taser Gun
      const taserGeo = new THREE.BoxGeometry(0.06, 0.06, 0.22);
      const taserMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x047857 });
      const taser = new THREE.Mesh(taserGeo, taserMat);
      taser.position.set(0.42, 0.8, -0.15);
      extrasGroup.add(taser);
    }

    // 3. MOTHER'S MILK: Heavy Tactical Golden Badges
    if (characterId === 'mm') {
      const vestGeo = new THREE.BoxGeometry(0.45, 0.5, 0.3);
      const vestMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.6, roughness: 0.5 });
      const vest = new THREE.Mesh(vestGeo, vestMat);
      vest.position.set(0, 0.95, 0);
      extrasGroup.add(vest);

      // Gold badge star
      const goldBadgeGeo = new THREE.BoxGeometry(0.08, 0.08, 0.03);
      const badgeMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9 });
      const badge = new THREE.Mesh(goldBadgeGeo, badgeMat);
      badge.position.set(0, 1.05, 0.16);
      extrasGroup.add(badge);

      // Special weapon
      const customPistolGeo = new THREE.BoxGeometry(0.04, 0.08, 0.25);
      const customPistolMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.8 });
      const pistol = new THREE.Mesh(customPistolGeo, customPistolMat);
      pistol.position.set(0.42, 0.8, -0.15);
      extrasGroup.add(pistol);
    }

    // 4. FRENCHIE: Floating Green Gas and beaker
    if (characterId === 'frenchie') {
      const beakerGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.18, 8);
      const beakerMat = new THREE.MeshStandardMaterial({ color: 0x818cf8, transparent: true, opacity: 0.7, roughness: 0.1 });
      const beaker = new THREE.Mesh(beakerGeo, beakerMat);
      beaker.position.set(0.43, 0.88, -0.1);
      extrasGroup.add(beaker);

      // Green floating chemical core
      const chemicalGeo = new THREE.SphereGeometry(0.04, 6, 6);
      const chemicalMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const chemistry = new THREE.Mesh(chemicalGeo, chemicalMat);
      chemistry.position.set(0.43, 0.88, -0.1);
      extrasGroup.add(chemistry);
    }

    // 5. KIMIKO: Razor Claw marks + wild hair block
    if (characterId === 'kimiko') {
      const hairGeo = new THREE.BoxGeometry(0.46, 0.26, 0.42);
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 1.0 });
      const hair = new THREE.Mesh(hairGeo, hairMat);
      hair.position.set(0, 1.5, 0.05);
      extrasGroup.add(hair);

      // Red razor energy sweeps surrounding hands
      const clawSweepGeo = new THREE.TorusGeometry(0.18, 0.015, 4, 12, Math.PI);
      const clawMat = new THREE.MeshBasicMaterial({ color: 0xe11d48 });
      
      const sweepLeft = new THREE.Mesh(clawSweepGeo, clawMat);
      sweepLeft.position.set(-0.42, 0.7, -0.1);
      sweepLeft.rotation.z = Math.PI / 3;
      extrasGroup.add(sweepLeft);

      const sweepRight = new THREE.Mesh(clawSweepGeo, clawMat);
      sweepRight.position.set(0.42, 0.7, -0.1);
      sweepRight.rotation.z = -Math.PI / 3;
      extrasGroup.add(sweepRight);
    }

    // 6. STARLIGHT: Solar halo backing + glowing yellow power hands
    if (characterId === 'starlight') {
      // Golden Halo disc behind back
      const haloGeo = new THREE.TorusGeometry(0.38, 0.02, 4, 24);
      const haloMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(0, 1.0, 0.16);
      extrasGroup.add(halo);

      // White flow of cape/skirt
      const whiteCapeGeo = new THREE.BoxGeometry(0.62, 0.75, 0.04);
      const capeMatS = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.9 });
      const whiteCape = new THREE.Mesh(whiteCapeGeo, capeMatS);
      whiteCape.position.set(0, 0.65, 0.12);
      extrasGroup.add(whiteCape);

      // Golden solar hand sparks
      const sparkG = new THREE.SphereGeometry(0.065, 5, 5);
      const sparkM = new THREE.MeshBasicMaterial({ color: 0xffffff });
      
      const leftHSpark = new THREE.Mesh(sparkG, sparkM);
      leftHSpark.position.set(-0.42, 0.75, -0.05);
      extrasGroup.add(leftHSpark);

      const rightHSpark = new THREE.Mesh(sparkG, sparkM);
      rightHSpark.position.set(0.42, 0.75, -0.05);
      extrasGroup.add(rightHSpark);
    }

    // 7. HOMELANDER: Red flowing cape, blazing red eye lasers, stars
    if (characterId === 'homelander') {
      // Magnificent cape
      const capeGeo = new THREE.BoxGeometry(0.68, 1.05, 0.04);
      const capeMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 });
      const hCape = new THREE.Mesh(capeGeo, capeMat);
      hCape.position.set(0, 0.62, 0.15);
      hCape.rotation.x = 0.06;
      extrasGroup.add(hCape);

      // Golden shoulders/Epaulets
      const shoulderGeo = new THREE.BoxGeometry(0.18, 0.08, 0.18);
      const shoulderMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8 });
      const epauletLeft = new THREE.Mesh(shoulderGeo, shoulderMat);
      epauletLeft.position.set(-0.35, 1.24, 0);
      extrasGroup.add(epauletLeft);

      const epauletRight = new THREE.Mesh(shoulderGeo, shoulderMat);
      epauletRight.position.set(0.35, 1.24, 0);
      extrasGroup.add(epauletRight);

      // Firing Laser Blasts
      const laserGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.4, 5);
      laserGeo.rotateX(Math.PI / 2);
      const laserMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      
      const lLeft = new THREE.Mesh(laserGeo, laserMat);
      lLeft.position.set(-0.06, 1.42, -0.7);
      extrasGroup.add(lLeft);

      const lRight = new THREE.Mesh(laserGeo, laserMat);
      lRight.position.set(0.06, 1.42, -0.7);
      extrasGroup.add(lRight);
    }

    // 8. QUEEN MAEVE: Heavy Broadsword and Amazon crown
    if (characterId === 'maeve') {
      // Golden Crown / Headband
      const tiaraGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.05, 12, 1, true);
      const tiaraMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 });
      const crown = new THREE.Mesh(tiaraGeo, tiaraMat);
      crown.position.set(0, 1.45, 0);
      extrasGroup.add(crown);

      // Shiny broadsword
      const swordBladeGeo = new THREE.BoxGeometry(0.04, 0.015, 0.92);
      const swordBladeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
      const broadsword = new THREE.Mesh(swordBladeGeo, swordBladeMat);
      broadsword.position.set(0.42, 0.85, -0.42);
      broadsword.rotation.x = -Math.PI / 3;
      extrasGroup.add(broadsword);
    }

    // 9. A-TRAIN: Supersonic neon light trails and visor
    if (characterId === 'atrain') {
      // Blue sports visor
      const visorGeo = new THREE.BoxGeometry(0.18, 0.05, 0.16);
      const visorMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 1.44, -0.13);
      extrasGroup.add(visor);

      // Rings of supersonic draft trails
      const speedTrailGeo = new THREE.TorusGeometry(0.48, 0.015, 4, 16);
      speedTrailGeo.rotateX(Math.PI / 2);
      const speedTrailMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });
      const trail = new THREE.Mesh(speedTrailGeo, speedTrailMat);
      trail.position.set(0, 0.75, 0);
      extrasGroup.add(trail);
    }

    // 10. BLACK NOIR: Total dark shadow armor, red sensor eye
    if (characterId === 'blacknoir') {
      const armorGeo = new THREE.CylinderGeometry(0.31, 0.23, 0.81, 10);
      const armorMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.95, metalness: 0.1 });
      const armor = new THREE.Mesh(armorGeo, armorMat);
      armor.position.set(0, 0.9, 0);
      extrasGroup.add(armor);

      // Glowing red visual eye
      const eyeSensorGeo = new THREE.BoxGeometry(0.12, 0.04, 0.04);
      const eyeSensorMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const sensor = new THREE.Mesh(eyeSensorGeo, eyeSensorMat);
      sensor.position.set(0, 1.41, -0.18);
      extrasGroup.add(sensor);

      // Two ninja daggers on back
      const daggerGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.52, 5);
      const daggerMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.9 });
      
      const daggerL = new THREE.Mesh(daggerGeo, daggerMat);
      daggerL.position.set(-0.16, 1.1, 0.15);
      daggerL.rotation.z = Math.PI / 4;
      extrasGroup.add(daggerL);

      const daggerR = new THREE.Mesh(daggerGeo, daggerMat);
      daggerR.position.set(0.16, 1.1, 0.15);
      daggerR.rotation.z = -Math.PI / 4;
      extrasGroup.add(daggerR);
    }

    // 11. THE DEEP: Sea trident & wave ring
    if (characterId === 'thedeep') {
      // Golden Trident staff
      const staffGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.35, 8);
      const staffMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.96 });
      const tridentStaff = new THREE.Mesh(staffGeo, staffMat);
      tridentStaff.position.set(0.42, 0.9, -0.15);
      extrasGroup.add(tridentStaff);

      // Trident crown head
      const tHeadGeo = new THREE.BoxGeometry(0.15, 0.15, 0.03);
      const tHead = new THREE.Mesh(tHeadGeo, staffMat);
      tHead.position.set(0.42, 1.6, -0.15);
      extrasGroup.add(tHead);
    }

    // 12. SISTER SAGE: Orbiting intellect neuron constellation
    if (characterId === 'sagesister') {
      // Glowing purple brain aura halo
      const sagHaloG = new THREE.TorusGeometry(0.24, 0.01, 4, 16);
      sagHaloG.rotateX(Math.PI / 2);
      const sagHaloM = new THREE.MeshBasicMaterial({ color: 0xc084fc });
      const sagHalo = new THREE.Mesh(sagHaloG, sagHaloM);
      sagHalo.position.set(0, 1.7, 0);
      extrasGroup.add(sagHalo);

      // Orbiting node sphere
      const nodeGeo = new THREE.SphereGeometry(0.045, 5, 5);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xe9d5ff });
      const node1 = new THREE.Mesh(nodeGeo, nodeMat);
      node1.position.set(0.42, 1.6, 0.1);
      extrasGroup.add(node1);
    }

    // NEON DUST ENVIRONMENT PARTICLES
    const pCount = 35;
    const pGeometry = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 2.2;
      pPositions[i * 3 + 1] = Math.random() * 1.9;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
    }
    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMaterial = new THREE.PointsMaterial({
      color: currentTheme.particles,
      size: 0.05,
      transparent: true,
      opacity: 0.8
    });
    const particles = new THREE.Points(pGeometry, pMaterial);
    scene.add(particles);

    // INTERACTION - MOUSE ORBIT / HOVER ROTATION
    let isDragging = false;
    let targetRotationY = 0;
    let currentRotationY = 0;
    let targetRotationX = 0;
    let currentRotationX = 0;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const canvasElement = renderer.domElement;
    canvasElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // DYNAMIC ANIMATIONS
    let frameId: number;
    const clock = new THREE.Clock();

    const animateLoop = () => {
      frameId = requestAnimationFrame(animateLoop);
      const elapsed = clock.getElapsedTime();

      // Slow idle rotation + user drag combined
      if (!isDragging) {
        targetRotationY += 0.01;
      }

      // Smooth interpolation for feel
      currentRotationY += (targetRotationY - currentRotationY) * 0.1;
      currentRotationX += (targetRotationX - currentRotationX) * 0.1;

      mainGroup.rotation.y = currentRotationY;
      
      // Clamp X rotation to prevent flipping upside down
      const clampedX = Math.max(-0.4, Math.min(0.4, currentRotationX));
      mainGroup.rotation.x = clampedX;

      // Breathe effect
      charRoot.position.y = Math.sin(elapsed * 2.2) * 0.038;

      // Specific animation details
      if (characterId === 'hughie' && extrasGroup.children[0]) {
        // Spin speed rings
        extrasGroup.children[0].rotation.z = elapsed * 1.5;
      }
      if (characterId === 'sagesister' && extrasGroup.children[1]) {
        // Orbit neuron nodes
        extrasGroup.children[1].position.x = Math.sin(elapsed * 2) * 0.45;
        extrasGroup.children[1].position.z = Math.cos(elapsed * 2) * 0.455;
        extrasGroup.children[1].position.y = 1.3 + Math.sin(elapsed * 3) * 0.12;
      }
      if (characterId === 'frenchie' && extrasGroup.children[0]) {
        // chemical flask levitation
        extrasGroup.children[0].position.y = 0.85 + Math.sin(elapsed * 3.5) * 0.04;
        if (extrasGroup.children[1]) {
          extrasGroup.children[1].position.y = 0.85 + Math.sin(elapsed * 3.5) * 0.04;
        }
      }

      // Slowly rotate dust particles env
      particles.rotation.y = -elapsed * 0.08;

      renderer.render(scene, camera);
    };

    animateLoop();

    // CLEANUP
    return () => {
      cancelAnimationFrame(frameId);
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.dispose();
    };
  }, [characterId, poseTrigger]);

  const triggerStrikePose = () => {
    setPoseTrigger(prev => prev + 1);
  };

  return (
    <div className={`relative ${className} group`}>
      <div ref={containerRef} className="w-full h-full min-h-[260px] relative rounded-none overflow-hidden cursor-move border border-white/5 bg-black/80" />
      
      {/* 3D Holo-Scanner Grid overlays */}
      <div className="absolute inset-x-0 bottom-1 flex justify-between px-3 items-center pointer-events-none text-white/40">
        <span className="text-[7.5px] font-mono tracking-widest uppercase">🌌 SYSTEM HOLO-GRID READY</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerStrikePose();
          }}
          className="pointer-events-auto bg-neutral-900 hover:bg-neutral-800 border border-white/20 hover:border-white text-white font-mono text-[8px] uppercase font-black px-1.5 py-0.5 rounded-none transition-all cursor-pointer"
        >
          ⚡ CHARGE
        </button>
      </div>

      <div className="absolute top-2 left-2 pointer-events-none border border-red-500/30 px-1.5 py-0.5 bg-black/60 font-mono text-[7px] text-red-500 font-bold uppercase tracking-wider animate-pulse">
        LOCKED-ON
      </div>
    </div>
  );
}
