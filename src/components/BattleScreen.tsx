import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Sparkles, Sword, Zap, RefreshCw, ChevronRight, Activity, 
  HelpCircle, Trophy, EyeOff, Crosshair, Target, Heart, Skull, 
  AlertTriangle, Wind, Navigation, Award, Plus, Flame, User, Play,
  ShoppingBag, Check, ShieldAlert, ZapOff, RefreshCcw, ChevronsUp, Map, Award as Crown
} from 'lucide-react';
import { Character, Skill, CombatUnit, Faction, CampaignDifficulty } from '../types';
import * as THREE from 'three';
import Lobby3DPreview from './Lobby3DPreview';
import { getRandomTaunt } from '../data/taunts';

interface BattleScreenProps {
  playerFaction: Faction;
  playerTeam: Character[];
  enemyIds: string[];
  allCharacters: Character[];
  onBattleEnd: (victory: boolean, survivalState: Character[]) => void;
  missionName: string;
  rewards: {
    cash?: number;
    compoundV?: number;
    intel?: number;
    pr?: number;
    controlBonus?: number;
  };
  difficulty?: CampaignDifficulty;
}

// 1. Outfits / Skins Custom Dress Configs (Garena Free Fire theme)
interface LegendOutfit {
  id: string;
  name: string;
  color: string;
  defenseBoost: number;
  speedBoost: number;
  flavor: string;
  epicRarity: 'MYSTICAL' | 'LEGENDARY' | 'EPIC' | 'COMMON';
  styleHex: string;
}

const LEGEND_OUTFITS: LegendOutfit[] = [
  {
    id: 'crimson_ninja',
    name: 'Crimson Ninja Cyber-Dress',
    color: 'from-red-600 to-black',
    defenseBoost: 18,
    speedBoost: 4,
    flavor: 'Vibrant neon crimson nanotech thread armor.',
    epicRarity: 'MYSTICAL',
    styleHex: '#ef4444'
  },
  {
    id: 'golden_alok',
    name: 'Golden Alok Aura Suit',
    color: 'from-amber-500 to-yellow-600',
    defenseBoost: 12,
    speedBoost: 8,
    flavor: 'Emits a sacred solar trail, increasing movement speeds.',
    epicRarity: 'LEGENDARY',
    styleHex: '#f59e0b'
  },
  {
    id: 'glacier_hunter',
    name: 'Glacier Hunter Exosuit',
    color: 'from-cyan-400 to-blue-600',
    defenseBoost: 24,
    speedBoost: -1,
    flavor: 'Heavy, frosted armor plates that mitigate bullet impacts.',
    epicRarity: 'EPIC',
    styleHex: '#06b6d4'
  },
  {
    id: 'shadow_reaper',
    name: 'Shadow Reaper Cloak',
    color: 'from-neutral-800 to-neutral-950',
    defenseBoost: 8,
    speedBoost: 6,
    flavor: 'Lightweight tactical weave designed for stealth and high critical rates.',
    epicRarity: 'COMMON',
    styleHex: '#3b82f6'
  }
];

// 2. PUBG / Garena Weapon Models with Weapon Skins
interface WeaponSkin {
  id: string;
  name: string;
  weaponType: 'M416' | 'AWM' | 'Groza' | 'M1887';
  damageMultiplier: number;
  colorHex: string;
  aestheticName: string;
  unlocked: boolean;
  cost: number;
}

const INITIAL_WEAPON_SKINS: WeaponSkin[] = [
  { id: 'm416_gold', name: 'M416 Tactical Rifle', weaponType: 'M416', damageMultiplier: 1.0, colorHex: '#eab308', aestheticName: 'Golden Viper', unlocked: true, cost: 0 },
  { id: 'groza_draco', name: 'Groza Bullpup', weaponType: 'Groza', damageMultiplier: 1.45, colorHex: '#ef4444', aestheticName: 'Flaming Draco', unlocked: false, cost: 600 },
  { id: 'awm_glacier', name: 'AWM Sniper Bolt', weaponType: 'AWM', damageMultiplier: 2.50, colorHex: '#06b6d4', aestheticName: 'Glacier Freeze', unlocked: false, cost: 1200 },
  { id: 'm1887_inferno', name: 'M1887 Shotgun', weaponType: 'M1887', damageMultiplier: 1.95, colorHex: '#f97316', aestheticName: 'Infernal Melt', unlocked: false, cost: 800 }
];

export default function BattleScreen({
  playerFaction,
  playerTeam,
  enemyIds,
  allCharacters,
  onBattleEnd,
  missionName,
  rewards,
  difficulty = CampaignDifficulty.OPERATIVE
}: BattleScreenProps) {
  // Survival Battle States
  const [battlePhase, setBattlePhase] = useState<'lobby' | 'dropping' | 'combat' | 'gameover'>('lobby');
  
  // Customization Dress & Weapon Weapon skins State
  const [selectedOutfit, setSelectedOutfit] = useState<LegendOutfit>(LEGEND_OUTFITS[0]);
  const [weaponSkins, setWeaponSkins] = useState<WeaponSkin[]>(INITIAL_WEAPON_SKINS);
  const [equippedSkin, setEquippedSkin] = useState<WeaponSkin>(INITIAL_WEAPON_SKINS[0]);
  const [selectedMapPath, setSelectedMapPath] = useState<string>('Pochinki Containment Grids');
  
  // Battle royale rewards cash wallet for current lobby session
  const [lobbyCash, setLobbyCash] = useState<number>(3000);

  // Parachute Flight Telemetry
  const [dropAltitude, setDropAltitude] = useState<number>(3000);
  const [parachuteDeployed, setParachuteDeployed] = useState<boolean>(false);
  const [dropSpeedMultiplier, setDropSpeedMultiplier] = useState<number>(1);
  const [gainedItems, setGainedItems] = useState<string[]>([]);
  
  // Player Tactical Combat stats inside 3D
  const [playerHp, setPlayerHp] = useState<number>(200);
  const [playerMaxHp, setPlayerMaxHp] = useState<number>(200);
  const [playerAttack, setPlayerAttack] = useState<number>(35);
  const [playerDefense, setPlayerDefense] = useState<number>(15);
  const [vesselsEliminated, setVesselsEliminated] = useState<number>(0);

  // Inventories mapped
  const [glooWalls, setGlooWalls] = useState<number>(3);
  const [medkits, setMedkits] = useState<number>(4);
  const [isHealCooling, setIsHealCooling] = useState<boolean>(false);

  // Playzone Contract states
  const [playzoneRadius, setPlayzoneRadius] = useState<number>(150); // initial boundaries
  const [playzoneTimer, setPlayzoneTimer] = useState<number>(30);
  const [stormActive, setStormActive] = useState<boolean>(false);
  
  // Logs & Interactive feeds
  const [combatLogs, setCombatLogs] = useState<string[]>(['🎖️ Welcome to Elite 3D Duel Lobby! Customize clothes & guns.']);
  const [killFeed, setKillFeed] = useState<string[]>([
    '📢 Safe Zone designated inside Arena Coordinates',
    '✈️ Cargo plane holding 100 soldiers cruising altitude'
  ]);

  // Three.js 3D canvas renderer elements
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [is3DReady, setIs3DReady] = useState<boolean>(false);
  const [isPointerLocked, setIsPointerLocked] = useState<boolean>(false);

  // Control Keyboards flags
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  
  // Three.js instances stored in refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerMeshRef = useRef<THREE.Group | null>(null);
  const playzoneRingRef = useRef<THREE.LineLoop | null>(null);
  
  // Enemy elements storage in Three
  interface Enemy3D {
    id: string;
    mesh: THREE.Group;
    hp: number;
    maxHp: number;
    speed: number;
    shootCooldown: number;
    vX: number;
    vZ: number;
    codename: string;
  }
  const enemies3D = useRef<Enemy3D[]>([]);

  // Gloo wall custom elements storage
  interface GlooWall3D {
    mesh: THREE.Mesh;
    hp: number;
    createdAt: number;
  }
  const glooWalls3D = useRef<GlooWall3D[]>([]);
  
  // Visual bullet lines
  const bulletLines3D = useRef<{ line: THREE.Line; age: number }[]>([]);

  // 3. Audio simulated textual popups
  const [visualShootFlash, setVisualShootFlash] = useState<boolean>(false);
  const [glooWallCooldown, setGlooWallCooldown] = useState<boolean>(false);
  const [crosshairColor, setCrosshairColor] = useState<string>('border-white');

  // Triggering visual popup on hits
  const [scopedDamages, setScopedDamages] = useState<{ value: number; isHeadshot: boolean; x: number; y: number } | null>(null);

  // Combat Specific Speech Bubble Taunt State
  const [playerTaunt, setPlayerTaunt] = useState<{ codename: string; quote: string } | null>(null);
  const [enemyTaunt, setEnemyTaunt] = useState<{ codename: string; quote: string } | null>(null);

  const triggerCombatTaunt = () => {
    if (playerTeam && playerTeam.length > 0) {
      const randPlayer = playerTeam[Math.floor(Math.random() * playerTeam.length)];
      const pQuote = getRandomTaunt(randPlayer.id);
      setPlayerTaunt({
        codename: randPlayer.codename,
        quote: pQuote
      });
      addLog(`📢 ${randPlayer.codename} shouted: "${pQuote}"`);
    }

    // Enemy responds 1 second later verbally!
    setTimeout(() => {
      const enemyRoster = ['Vought Guard Executive', 'Security Drone Squad', 'Supe Enforcer Force', 'Homelander Duplicate', 'Black Noir Echo'];
      const randEnemy = enemyRoster[Math.floor(Math.random() * enemyRoster.length)];
      const eQuote = getRandomTaunt(randEnemy);
      setEnemyTaunt({
        codename: randEnemy,
        quote: eQuote
      });
      addLog(`📢 ${randEnemy} retaliated: "${eQuote}"`);
    }, 1000);
  };

  // Lobby Upgrade handler
  const handleUpgradeWeaponSkin = (skin: WeaponSkin) => {
    if (skin.unlocked) {
      setEquippedSkin(skin);
      addLog(`🔫 Equipped skin weapon [${skin.aestheticName} ${skin.weaponType}]`);
      return;
    }
    if (lobbyCash >= skin.cost) {
      setLobbyCash(prev => prev - skin.cost);
      setWeaponSkins(prev => prev.map(s => s.id === skin.id ? { ...s, unlocked: true } : s));
      addLog(`✨ Unlocked luxury skin [${skin.aestheticName} ${skin.weaponType}]!`);
    } else {
      addLog(`❌ Insufficient gold cash! Fight in playzones to earn more gold.`);
    }
  };

  const addLog = (msg: string) => {
    setCombatLogs(prev => [msg, ...prev].slice(0, 15));
  };

  const pushKillFeed = (msg: string) => {
    setKillFeed(prev => [msg, ...prev].slice(0, 5));
  };

  // Skip Parachute Air drop directly
  const handleSkipOrForceLand = () => {
    setDropAltitude(0);
    // Grant randomized loot based on selected sector map
    let bonusLoot: string[] = [];
    if (selectedMapPath.includes('Pochinki')) {
      bonusLoot = ['M416 Elite Grip', 'Level 2 Armor Jacket (+15 Defense)'];
      setPlayerDefense(prev => prev + 15);
      setGlooWalls(prev => prev + 2);
    } else if (selectedMapPath.includes('School')) {
      bonusLoot = ['AWM Heavy Barrel (+12 Attack)', 'Level 3 Crimson Helmet'];
      setPlayerAttack(prev => prev + 12);
      setMedkits(prev => prev + 2);
    } else {
      bonusLoot = ['Double Shot M1887 Spreader', 'Adrenaline Speed Injections'];
      setPlayerAttack(prev => prev + 8);
      setPlayerDefense(prev => prev + 8);
    }
    setGainedItems(bonusLoot);
    addLog(`🪂 Landed on coordinates in [${selectedMapPath}]! Equipping dynamic ${bonusLoot.join(', ')}`);
    setBattlePhase('combat');
    pushKillFeed(`✈️ Solo squad landed in ${selectedMapPath}`);
  };

  // Launch real skydiving sequence
  const startSkydivingRun = () => {
    setDropAltitude(3000);
    setParachuteDeployed(false);
    setBattlePhase('dropping');
    addLog('✈️ JUMP TRIGGERED! Skydiving out of high-altitude transport carrier!');
  };

  // Skydiving altitude loop
  useEffect(() => {
    if (battlePhase !== 'dropping') return;
    const interval = setInterval(() => {
      setDropAltitude(prev => {
        const fallRate = (parachuteDeployed ? 160 : 340) * dropSpeedMultiplier;
        const next = prev - fallRate;
        if (next <= 0) {
          clearInterval(interval);
          handleSkipOrForceLand();
          return 0;
        }
        return next;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [battlePhase, parachuteDeployed, dropSpeedMultiplier, selectedMapPath]);

  // Trigger initial combat speech bubble taunt upon entering combat
  useEffect(() => {
    if (battlePhase === 'combat') {
      const timer = setTimeout(() => {
        triggerCombatTaunt();
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setPlayerTaunt(null);
      setEnemyTaunt(null);
    }
  }, [battlePhase]);

  // Main combat loops: ThreeJS Initialization and Animation Frames
  useEffect(() => {
    if (battlePhase !== 'combat') return;

    // Build the fully immersive 3D scene representation
    const width = canvasContainerRef.current?.clientWidth || 800;
    const height = canvasContainerRef.current?.clientHeight || 550;

    // Define scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06060c);
    scene.fog = new THREE.FogExp2(0x07070f, 0.007);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    // Orbit camera directly behind player coordinates
    camera.position.set(0, 6, 12);
    cameraRef.current = camera;

    // Renderer structure
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    
    // Clear old canvases
    if (canvasContainerRef.current) {
      canvasContainerRef.current.innerHTML = '';
      canvasContainerRef.current.appendChild(renderer.domElement);
    }
    rendererRef.current = renderer;

    // Setup Atmospheric Lights
    const ambientLight = new THREE.AmbientLight(0x223344, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.8);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    // Build Physical Grid Terrain representing Selected Battlegrounds
    const gridHelper = new THREE.GridHelper(300, 60, 0xef4444, 0x1e293b);
    gridHelper.position.y = 0.05;
    scene.add(gridHelper);

    // Giant colored circular ring representing shrinking Garena Playzone boundaries
    const playzoneMaterial = new THREE.LineBasicMaterial({ color: 0x06b6d4, linewidth: 3 });
    const playzoneGeometry = new THREE.BufferGeometry();
    const points: THREE.Vector3[] = [];
    for (let theta = 0; theta <= 360; theta += 5) {
      const rad = (theta * Math.PI) / 180;
      points.push(new THREE.Vector3(Math.cos(rad) * playzoneRadius, 0.2, Math.sin(rad) * playzoneRadius));
    }
    playzoneGeometry.setFromPoints(points);
    const playzoneRing = new THREE.LineLoop(playzoneGeometry, playzoneMaterial);
    scene.add(playzoneRing);
    playzoneRingRef.current = playzoneRing;

    // Ground plane styling
    const groundGeo = new THREE.PlaneGeometry(600, 600);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: 0x090d16, 
      roughness: 0.9, 
      metalness: 0.1 
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Scattered Warehouse Obstacles (Red military shipping containers or wooden crates)
    // Create actual 3D boxes
    for (let i = 0; i < 28; i++) {
      const sizeX = Math.random() * 4 + 3;
      const sizeY = Math.random() * 5 + 3;
      const sizeZ = Math.random() * 4 + 3;
      const boxGeo = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
      const isContainer = Math.random() > 0.4;
      
      const obstacleMat = new THREE.MeshStandardMaterial({
        color: isContainer ? (Math.random() > 0.5 ? 0xef4444 : 0x2563eb) : 0x78350f,
        roughness: 0.4,
        metalness: isContainer ? 0.8 : 0.0,
      });
      const obstacle = new THREE.Mesh(boxGeo, obstacleMat);
      
      // Rand position
      const signX = Math.random() > 0.5 ? 1 : -1;
      const signZ = Math.random() > 0.5 ? 1 : -1;
      obstacle.position.set(
        (Math.random() * 80 + 15) * signX,
        sizeY / 2,
        (Math.random() * 80 + 15) * signZ
      );
      obstacle.name = 'OBSTACLE_BOX';
      scene.add(obstacle);
    }

    // Spawn 3D Animated capsule meshes representing Custom dressed Player character
    const playerGroup = new THREE.Group();
    playerGroup.position.set(0, 0, 0);

    // Head Sphere for actual visual facial presence
    const pHeadGeo = new THREE.SphereGeometry(0.32, 10, 10);
    const pHeadMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.4 });
    const pHead = new THREE.Mesh(pHeadGeo, pHeadMat);
    pHead.position.set(0, 1.8, 0);
    playerGroup.add(pHead);

    // Glowing Visor / tactical glasses
    const pVisorGeo = new THREE.BoxGeometry(0.55, 0.12, 0.14);
    const pVisorMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const pVisor = new THREE.Mesh(pVisorGeo, pVisorMat);
    pVisor.position.set(0, 1.84, -0.26);
    playerGroup.add(pVisor);

    // Hair or hat model matching the selected outfit custom skins
    const capGeo = new THREE.BoxGeometry(0.9, 0.35, 0.9);
    const capMat = new THREE.MeshStandardMaterial({ color: selectedOutfit.styleHex });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, 2.05, 0);
    playerGroup.add(cap);

    // Body capsule (torso outfit)
    const torsoGeo = new THREE.CylinderGeometry(0.5, 0.4, 1.4, 8);
    const torsoMat = new THREE.MeshStandardMaterial({ 
      color: selectedOutfit.styleHex === '#ef4444' ? 0xbc1a1a : selectedOutfit.styleHex === '#f59e0b' ? 0xd97706 : 0x0284c7,
      roughness: 0.2
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.set(0, 1.1, 0);
    playerGroup.add(torso);

    // Back flowing translucent epic cape
    const pCapeGeo = new THREE.BoxGeometry(0.75, 1.15, 0.05);
    const pCapeMat = new THREE.MeshStandardMaterial({
      color: selectedOutfit.styleHex,
      transparent: true,
      opacity: 0.85,
      roughness: 0.15
    });
    const pCape = new THREE.Mesh(pCapeGeo, pCapeMat);
    pCape.position.set(0, 1.0, 0.32);
    pCape.rotation.x = 0.08;
    playerGroup.add(pCape);

    // Gun physical model pointing straight out
    const barrelGeo = new THREE.BoxGeometry(0.2, 0.2, 1.5);
    const barrelMat = new THREE.MeshStandardMaterial({ color: equippedSkin.colorHex, metalness: 0.9 });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.position.set(0.4, 1.1, -0.6);
    playerGroup.add(barrel);

    scene.add(playerGroup);
    playerMeshRef.current = playerGroup;

    // Spawn 3D Hostile Vought Defenders (Red capsules with glowing eyes)
    enemies3D.current = [];
    const enemyRoster = ['Vought Guard Executive', 'Security Drone Squad', 'Supe Enforcer Force', 'Homelander Duplicate', 'Black Noir Echo'];
    
    // Spawn 5 hostiles
    for (let idx = 0; idx < 6; idx++) {
      const exGroup = new THREE.Group();
      
      const signX = Math.random() > 0.5 ? 1 : -1;
      const signZ = Math.random() > 0.5 ? 1 : -1;
      exGroup.position.set(
        (Math.random() * 65 + 15) * signX,
        0,
        (Math.random() * 65 + 15) * signZ
      );

      const enemyName = enemyRoster[idx % enemyRoster.length];

      if (enemyName === 'Vought Guard Executive') {
        // Black executive suit
        const suitGeo = new THREE.CylinderGeometry(0.48, 0.38, 1.35, 8);
        const suitMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 }); // Charcoal suit
        const suit = new THREE.Mesh(suitGeo, suitMat);
        suit.position.y = 1.0;
        exGroup.add(suit);

        // White collar patch and brilliant red tie
        const tieGeo = new THREE.BoxGeometry(0.12, 0.45, 0.1);
        const tieMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.1 });
        const tie = new THREE.Mesh(tieGeo, tieMat);
        tie.position.set(0, 1.25, -0.42);
        exGroup.add(tie);

        // Individual flesh head
        const eHeadGeo = new THREE.SphereGeometry(0.25, 8, 8);
        const eHeadMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.4 });
        const eHead = new THREE.Mesh(eHeadGeo, eHeadMat);
        eHead.position.set(0, 1.82, 0);
        exGroup.add(eHead);
        
        // Agent dark sunglasses
        const glassesGeo = new THREE.BoxGeometry(0.42, 0.12, 0.12);
        const glassesMat = new THREE.MeshBasicMaterial({ color: 0x030712 });
        const glasses = new THREE.Mesh(glassesGeo, glassesMat);
        glasses.position.set(0, 1.85, -0.22);
        exGroup.add(glasses);

      } else if (enemyName === 'Security Drone Squad') {
        // Floating high-tech security drone
        const coreGeo = new THREE.SphereGeometry(0.45, 12, 12);
        const coreMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.1 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.position.y = 1.3;
        exGroup.add(core);

        // Hover jet nozzle underneath
        const nozzleGeo = new THREE.CylinderGeometry(0.18, 0.12, 0.28, 8);
        const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
        const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
        nozzle.position.set(0, 0.98, 0);
        exGroup.add(nozzle);

        // Glowing scanning ocular visor
        const eyeGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 8);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 }); // Glowing cyan lens
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        eye.position.set(0, 1.3, -0.42);
        eye.rotation.x = Math.PI / 2;
        exGroup.add(eye);

        // Stabilizer wings
        const leftWingGeo = new THREE.BoxGeometry(0.65, 0.08, 0.22);
        const wingMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
        const leftWing = new THREE.Mesh(leftWingGeo, wingMat);
        leftWing.position.set(-0.62, 1.3, 0);
        leftWing.rotation.z = 0.2;
        exGroup.add(leftWing);

        const rightWingGeo = new THREE.BoxGeometry(0.65, 0.08, 0.22);
        const rightWing = new THREE.Mesh(rightWingGeo, wingMat);
        rightWing.position.set(0.62, 1.3, 0);
        rightWing.rotation.z = -0.2;
        exGroup.add(rightWing);

      } else if (enemyName === 'Supe Enforcer Force') {
        // Orange spiked heavy brute
        const enTorsoGeo = new THREE.CylinderGeometry(0.58, 0.46, 1.45, 8);
        const enTorsoMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35, metalness: 0.25 }); // Hot orange
        const enTorso = new THREE.Mesh(enTorsoGeo, enTorsoMat);
        enTorso.position.y = 1.05;
        exGroup.add(enTorso);

        // Heavy armor pads
        const padGeo = new THREE.BoxGeometry(0.38, 0.26, 0.38);
        const padMat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
        
        const enPadL = new THREE.Mesh(padGeo, padMat);
        enPadL.position.set(-0.58, 1.45, 0);
        exGroup.add(enPadL);

        const enPadR = new THREE.Mesh(padGeo, padMat);
        enPadR.position.set(0.58, 1.45, 0);
        exGroup.add(enPadR);

        // Flame helmet spikes
        const spikeGeo = new THREE.ConeGeometry(0.24, 0.52, 6);
        const spikeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(0, 1.9, -0.05);
        exGroup.add(spike);

        // Glowing hazard visor
        const enVisorGeo = new THREE.BoxGeometry(0.68, 0.16, 0.12);
        const enVisorMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
        const enVisor = new THREE.Mesh(enVisorGeo, enVisorMat);
        enVisor.position.set(0, 1.68, -0.46);
        exGroup.add(enVisor);

      } else if (enemyName === 'Homelander Duplicate') {
        // Royal Blue supe armor Suit
        const suitGeo = new THREE.CylinderGeometry(0.5, 0.42, 1.4, 8);
        const suitMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.12, metalness: 0.4 }); // Patriot Blue
        const suit = new THREE.Mesh(suitGeo, suitMat);
        suit.position.y = 1.1;
        exGroup.add(suit);

        // Golden patriotic chest crest
        const crestGeo = new THREE.BoxGeometry(0.24, 0.24, 0.1);
        const crestMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.95 });
        const crest = new THREE.Mesh(crestGeo, crestMat);
        crest.position.set(0, 1.25, -0.4);
        exGroup.add(crest);

        // Brilliant Red Flowing Cape
        const capeGeo = new THREE.BoxGeometry(0.78, 1.35, 0.05);
        const capeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45 });
        const cape = new THREE.Mesh(capeGeo, capeMat);
        cape.position.set(0, 0.9, 0.35);
        cape.rotation.x = 0.12;
        exGroup.add(cape);

        // Hair head base
        const headGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.28, 8);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 }); // Blonde
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(0, 1.84, 0);
        exGroup.add(head);

        // RED lasers visor eyes
        const enLaserGeo = new THREE.BoxGeometry(0.48, 0.12, 0.1);
        const enLaserMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const enLaser = new THREE.Mesh(enLaserGeo, enLaserMat);
        enLaser.position.set(0, 1.68, -0.41);
        exGroup.add(enLaser);

      } else if (enemyName === 'Black Noir Echo') {
        // Pure opaque tactical ninja garb
        const ninjaGeo = new THREE.CylinderGeometry(0.48, 0.4, 1.4, 8);
        const ninjaMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 }); // Coal Slate
        const ninja = new THREE.Mesh(ninjaGeo, ninjaMat);
        ninja.position.y = 1.1;
        exGroup.add(ninja);

        // Dark grey composite shoulder guards
        const shoulderGeo = new THREE.BoxGeometry(0.32, 0.18, 0.32);
        const shoulderMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
        
        const guardL = new THREE.Mesh(shoulderGeo, shoulderMat);
        guardL.position.set(-0.54, 1.4, 0);
        exGroup.add(guardL);

        const guardR = new THREE.Mesh(shoulderGeo, shoulderMat);
        guardR.position.set(0.54, 1.4, 0);
        exGroup.add(guardR);

        // Dual stealth steel swords crossed on the back
        const steelGeo = new THREE.BoxGeometry(0.06, 1.15, 0.06);
        const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 });
        
        const bSword1 = new THREE.Mesh(steelGeo, steelMat);
        bSword1.position.set(-0.25, 1.25, 0.36);
        bSword1.rotation.z = 0.5;
        exGroup.add(bSword1);

        const bSword2 = new THREE.Mesh(steelGeo, steelMat);
        bSword2.position.set(0.25, 1.25, 0.36);
        bSword2.rotation.z = -0.5;
        exGroup.add(bSword2);

        // Pure white visors
        const noirVisorGeo = new THREE.BoxGeometry(0.44, 0.12, 0.1);
        const noirVisorMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
        const noirVisor = new THREE.Mesh(noirVisorGeo, noirVisorMat);
        noirVisor.position.set(0, 1.66, -0.41);
        exGroup.add(noirVisor);

      } else {
        // Default standard cylinder and visor
        const eTorsoGeo = new THREE.CylinderGeometry(0.5, 0.4, 1.4, 8);
        const eTorsoMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.1 });
        const eTorso = new THREE.Mesh(eTorsoGeo, eTorsoMat);
        eTorso.position.y = 1.1;
        exGroup.add(eTorso);

        const eyeGeo = new THREE.BoxGeometry(0.8, 0.2, 0.2);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        eye.position.set(0, 1.7, -0.45);
        exGroup.add(eye);
      }

      scene.add(exGroup);

      const diffMult = difficulty === CampaignDifficulty.RECRUIT ? 0.7 : (difficulty === CampaignDifficulty.SUPE ? 1.4 : 1.0);
      enemies3D.current.push({
        id: `enemy_${idx}`,
        mesh: exGroup,
        hp: Math.round((150 + idx * 25) * diffMult),
        maxHp: Math.round((150 + idx * 25) * diffMult),
        speed: (0.1 + Math.random() * 0.08) * (difficulty === CampaignDifficulty.SUPE ? 1.25 : (difficulty === CampaignDifficulty.RECRUIT ? 0.8 : 1.0)),
        shootCooldown: (10 + Math.random() * 80) / (difficulty === CampaignDifficulty.SUPE ? 1.25 : (difficulty === CampaignDifficulty.RECRUIT ? 0.75 : 1.0)),
        vX: (Math.random() - 0.5) * 5,
        vZ: (Math.random() - 0.5) * 5,
        codename: enemyRoster[idx % enemyRoster.length]
      });
    }

    addLog('🎮 Space-bar to shoot! WASD keys to move around the 3D map bounds.');
    setIs3DReady(true);

    // Keyboard controls action listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code;
      keysPressed.current[code] = true;
      if (code === 'Space') {
        // Spacebar fire override
        e.preventDefault();
        fireActiveWeapon3D();
      }
      if (code === 'KeyG') {
        // Hotkey Gloo wall
        triggerGlooWallDeployment();
      }
      if (code === 'KeyT') {
        // Hotkey Taunt
        triggerCombatTaunt();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Pointer move listener inside canvas to rotate camera/player
    let rotY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      // Rotate player group if dragging or pointerlocked
      if (!playerMeshRef.current) return;
      
      // Calculate rotation offset
      const rotSpeed = 0.006;
      rotY -= e.movementX * rotSpeed;
      playerMeshRef.current.rotation.y = rotY;
    };

    const canvasElem = renderer.domElement;
    canvasElem.addEventListener('mousemove', handleMouseMove);

    // Resize observer to scale high-definition canvas dynamically
    const handleResize = () => {
      const w = canvasContainerRef.current?.clientWidth || 800;
      const h = canvasContainerRef.current?.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation frames execution ticking
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);
      const delta = clock.getDelta();

      if (playerMeshRef.current && cameraRef.current) {
        const player = playerMeshRef.current;
        const cam = cameraRef.current;

        // Player WASD Movement vectors
        const moveSpeed = (0.24 + selectedOutfit.speedBoost * 0.01) * 60 * delta;
        const moveVector = new THREE.Vector3();

        if (keysPressed.current['KeyW'] || keysPressed.current['ArrowUp']) {
          moveVector.z -= moveSpeed;
        }
        if (keysPressed.current['KeyS'] || keysPressed.current['ArrowDown']) {
          moveVector.z += moveSpeed;
        }
        if (keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft']) {
          moveVector.x -= moveSpeed;
        }
        if (keysPressed.current['KeyD'] || keysPressed.current['ArrowRight']) {
          moveVector.x += moveSpeed;
        }

        // Project movement vector into world orientation based on player current rotation Y
        moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation.y);
        
        // Boundaries lock
        const nextX = player.position.x + moveVector.x;
        const nextZ = player.position.z + moveVector.z;
        
        if (Math.abs(nextX) < 145 && Math.abs(nextZ) < 145) {
          player.position.x = nextX;
          player.position.z = nextZ;
        }

        // Camera follow (3rd person chase camera offset behind player coordinates)
        const relativeCameraOffset = new THREE.Vector3(0, 5, 8.5);
        const cameraOffset = relativeCameraOffset.applyMatrix4(player.matrixWorld);
        
        cam.position.lerp(cameraOffset, 0.2);
        cam.lookAt(new THREE.Vector3(player.position.x, player.position.y + 1.2, player.position.z - 1.5));

        // 1. Storm playzone shrinking damage verification
        const distanceToCenter = Math.sqrt(player.position.x * player.position.x + player.position.z * player.position.z);
        if (distanceToCenter > playzoneRadius) {
          setStormActive(true);
          // Storm inflicts heavy health bleeding over time
          setPlayerHp(cur => {
            const nextHp = Math.max(0, cur - 0.25);
            if (nextHp <= 0) {
              setBattlePhase('gameover');
              handleFinishBattlePlay(false);
            }
            return nextHp;
          });
        } else {
          setStormActive(false);
        }

        // 2. Continuous Hostile enemies seeking and tracking intelligence
        enemies3D.current.forEach((en) => {
          if (en.hp <= 0) return;

          // Simple path movement towards player
          const dx = player.position.x - en.mesh.position.x;
          const dz = player.position.z - en.mesh.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          // Face the player
          en.mesh.lookAt(player.position.x, en.mesh.position.y, player.position.z);

          if (dist > 8) {
            // Move forward
            const stepMultiplier = en.speed * 60 * delta;
            en.mesh.position.x += (dx / dist) * stepMultiplier;
            en.mesh.position.z += (dz / dist) * stepMultiplier;
          }

          // Enemy attack counter cooldown tick
          en.shootCooldown -= 1;
          if (en.shootCooldown <= 0) {
            const cooldownBase = difficulty === CampaignDifficulty.SUPE ? 65 : (difficulty === CampaignDifficulty.RECRUIT ? 130 : 95);
            en.shootCooldown = cooldownBase + Math.random() * 95;
            executeEnemyShootsPlayer3D(en);
          }
        });

        // 3. Bullets age decaying loop
        bulletLines3D.current = bulletLines3D.current.filter((b) => {
          b.age += delta;
          if (b.age >= 0.12) {
            scene.remove(b.line);
            b.line.geometry.dispose();
            return false;
          }
          return true;
        });
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    // Cleanup continuous elements
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [battlePhase, selectedOutfit, equippedSkin, playzoneRadius]);

  // Playzone shrinking loop trigger
  useEffect(() => {
    if (battlePhase !== 'combat') return;
    const zoneTimer = setInterval(() => {
      setPlayzoneTimer(prev => {
        if (prev <= 1) {
          // Shrink radius bounds
          setPlayzoneRadius(r => {
            const nextR = Math.max(25, r - 25);
            addLog(`❗ WARNING: safe Playzone border shrunk to ${nextR} meters!`);
            pushKillFeed(`☣️ Storm warning: bluezone collapsed further`);
            
            // Re-render Ring geometry loop helper
            if (sceneRef.current && playzoneRingRef.current) {
              sceneRef.current.remove(playzoneRingRef.current);
              const playzoneMaterial = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
              const playzoneGeometry = new THREE.BufferGeometry();
              const points: THREE.Vector3[] = [];
              for (let theta = 0; theta <= 360; theta += 6) {
                const rad = (theta * Math.PI) / 180;
                points.push(new THREE.Vector3(Math.cos(rad) * nextR, 0.25, Math.sin(rad) * nextR));
              }
              playzoneGeometry.setFromPoints(points);
              const newRing = new THREE.LineLoop(playzoneGeometry, playzoneMaterial);
              sceneRef.current.add(newRing);
              playzoneRingRef.current = newRing;
            }
            return nextR;
          });
          return 30; // reset
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(zoneTimer);
  }, [battlePhase]);

  // Physical 3D Shoot Raycast from player weapon vector
  const fireActiveWeapon3D = () => {
    if (!playerMeshRef.current || !sceneRef.current) return;
    setVisualShootFlash(true);
    setTimeout(() => setVisualShootFlash(false), 90);

    const player = playerMeshRef.current;
    
    // Shoot direction is vector based on player orientation Y
    const shootDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation.y).normalize();
    const origin = new THREE.Vector3(player.position.x, player.position.y + 1.1, player.position.z);

    // Draw solid laser bullet tracer in ThreeJS
    const tracerPoints: THREE.Vector3[] = [];
    tracerPoints.push(origin.clone());
    
    // Check if we hit any active enemy!
    let targetDistance = 120;
    let hitEnemy: Enemy3D | null = null;
    let isHeadshot = Math.random() < 0.32; // custom head hitbox chance simulation

    enemies3D.current.forEach((en) => {
      if (en.hp <= 0) return;
      
      const toEnemy = new THREE.Vector3().subVectors(en.mesh.position, origin);
      // Project distance on direction vector
      const projLength = toEnemy.dot(shootDir);
      if (projLength < 0) return; // enemy is behind player

      const projPoint = origin.clone().addScaledVector(shootDir, projLength);
      const perpDist = projPoint.distanceTo(new THREE.Vector3(en.mesh.position.x, en.mesh.position.y + 1.1, en.mesh.position.z));

      // Capsule hitbox check (approx 1.8 width bounds)
      if (perpDist < 1.95 && projLength < targetDistance) {
        targetDistance = projLength;
        hitEnemy = en;
      }
    });

    // Check collision with physical wooden Boxes
    let hitObstacle = false;
    sceneRef.current.traverse((child) => {
      if (child.name === 'OBSTACLE_BOX' || child.name === 'GLOO_WALL_MESH') {
        const toObstacle = new THREE.Vector3().subVectors(child.position, origin);
        const projLen = toObstacle.dot(shootDir);
        if (projLen < 0) return;
        const projPoint = origin.clone().addScaledVector(shootDir, projLen);
        const perpDist = projPoint.distanceTo(child.position);
        if (perpDist < 3.2 && projLen < targetDistance) {
          targetDistance = projLen;
          hitObstacle = true;
          hitEnemy = null; // bullet absorbed by crate box obstacle
        }
      }
    });

    // Compute tracer line endpoint
    const endPoint = origin.clone().addScaledVector(shootDir, targetDistance);
    tracerPoints.push(endPoint);

    // Create yellow light beam for projectile path
    const tracerMat = new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 2 });
    const tracerGeo = new THREE.BufferGeometry().setFromPoints(tracerPoints);
    const laserLine = new THREE.Line(tracerGeo, tracerMat);
    sceneRef.current.add(laserLine);
    bulletLines3D.current.push({ line: laserLine, age: 0 });

    // Handle bullet impact outcome
    if (hitEnemy) {
      const eMatch = hitEnemy as Enemy3D;
      
      // Calculate attack damage based on active equipped skin damage multiplier
      let baseDmg = Math.round((playerAttack + 15) * equippedSkin.damageMultiplier);
      if (isHeadshot) baseDmg = Math.round(baseDmg * 2.2);

      // Decrement enemy HP
      eMatch.hp = Math.max(0, eMatch.hp - baseDmg);

      // Trigger crosshair red hit indicator on HUD
      setCrosshairColor('border-red-500 scale-125');
      setTimeout(() => setCrosshairColor('border-white'), 180);

      // Place 3D Floating floating indicator
      setScopedDamages({ value: baseDmg, isHeadshot, x: window.innerWidth / 2 - 40, y: window.innerHeight / 2 - 100 });
      setTimeout(() => setScopedDamages(null), 950);

      addLog(`🎯 HIT! Shot ${eMatch.codename} in the ${isHeadshot ? '👑 HEAD' : '👕 BODY'} dealing ${baseDmg} raw physical damage!`);

      if (eMatch.hp <= 0) {
        addLog(`💀 ELIMINATED! Neutralized ${eMatch.codename} in live field!`);
        pushKillFeed(`👑 Player killed ${eMatch.codename} with ${equippedSkin.aestheticName}`);
        setVesselsEliminated(prev => prev + 1);
        
        // Physically remove or fade dead enemy representation from 3D space
        sceneRef.current.remove(eMatch.mesh);
        
        // Verify if all hostiles vanished
        const allDead = enemies3D.current.every(e => e.hp <= 0);
        if (allDead) {
          setBattlePhase('gameover');
          handleFinishBattlePlay(true);
        }
      }
    } else if (hitObstacle) {
      addLog('🛡️ Bullet absorbed! Hostile was fully cover of solid crates shield.');
    } else {
      addLog('💨 MISSED! Shot strayed into empty sector terrain.');
    }
  };

  // Vought enemy firing intelligence towards Player
  const executeEnemyShootsPlayer3D = (enemy: Enemy3D) => {
    if (!playerMeshRef.current || !sceneRef.current) return;
    const player = playerMeshRef.current;
    const origin = enemy.mesh.position.clone().setY(1.1);

    // Bullet direction vector towards player coordinates
    const toPlayer = new THREE.Vector3().subVectors(player.position, enemy.mesh.position).normalize();
    const tracerPoints = [origin.clone()];

    // Verify if player has any active GLOO WALL physically in front of them
    let bulletAbsorbedByGloo = false;
    let hitDistance = origin.distanceTo(player.position);

    glooWalls3D.current.forEach((gw) => {
      if (gw.hp <= 0) return;
      const toWall = new THREE.Vector3().subVectors(gw.mesh.position, origin);
      const projL = toWall.dot(toPlayer);
      if (projL < 0) return;

      const projPoint = origin.clone().addScaledVector(toPlayer, projL);
      const distToWallCenter = projPoint.distanceTo(gw.mesh.position);
      if (distToWallCenter < 4.5 && projL < hitDistance) {
        bulletAbsorbedByGloo = true;
        hitDistance = projL; // blocked
        gw.hp = Math.max(0, gw.hp - 45); // deplete Gloo integrity
        if (gw.hp <= 0) {
          sceneRef.current?.remove(gw.mesh);
          addLog('💥 GLOO WALL DESTROYED under heavy incoming bullets!');
          pushKillFeed('⚠️ Player tactical gloo wall collapsed');
        }
      }
    });

    const endPoint = origin.clone().addScaledVector(toPlayer, hitDistance);
    tracerPoints.push(endPoint);

    // Generate physical red tracer beam
    const tracerMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
    const tracerGeo = new THREE.BufferGeometry().setFromPoints(tracerPoints);
    const line = new THREE.Line(tracerGeo, tracerMat);
    sceneRef.current.add(line);
    bulletLines3D.current.push({ line, age: 0 });

    if (bulletAbsorbedByGloo) {
      addLog(`🛡️ Gloo wall absorbed laser shot from ${enemy.codename}!`);
      return;
    }

    // Bullet registers hit on player
    const isCritical = Math.random() < 0.24; // 24% incoming critical threat
    let dmg = Math.round((22 + Math.random() * 8) - (playerDefense * 0.15));
    if (isCritical) {
      dmg = Math.round(dmg * 1.5);
    }
    const diffMult = difficulty === CampaignDifficulty.RECRUIT ? 0.7 : (difficulty === CampaignDifficulty.SUPE ? 1.4 : 1.0);
    dmg = Math.round(dmg * diffMult);
    dmg = Math.max(6, dmg);

    setPlayerHp((cur) => {
      const nextHp = Math.max(0, cur - dmg);
      if (nextHp <= 0) {
        setBattlePhase('gameover');
        handleFinishBattlePlay(false);
      }
      return nextHp;
    });

    if (isCritical) {
      addLog(`⚠️ CRITICAL THREAT! Received headshot from ${enemy.codename} dealing -${dmg} HP!`);
    } else {
      addLog(`💥 HIT! Armed sentinel ${enemy.codename} hit your vest for -${dmg} vitality.`);
    }
  };

  // Instantly deploy Free fire Gloo Wall grenade
  const triggerGlooWallDeployment = () => {
    if (glooWalls <= 0) {
      addLog('❌ Out of Gloo Wall micro-grenades! Need to find resource barrels.');
      return;
    }
    if (glooWallCooldown) return;
    if (!playerMeshRef.current || !sceneRef.current) return;

    setGlooWalls(prev => prev - 1);
    setGlooWallCooldown(true);
    setTimeout(() => setGlooWallCooldown(false), 1200);

    const player = playerMeshRef.current;
    const forwardVec = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation.y).normalize();
    
    // Spawn Gloo wall physical box 3 meters in front of player
    const wallGeo = new THREE.BoxGeometry(7, 4.5, 0.4);
    const wallMat = new THREE.MeshStandardMaterial({ 
      color: 0x06b6d4, 
      transparent: true, 
      opacity: 0.65,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x0891b2
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    
    // Align wall rotation with player rotation
    wallMesh.rotation.y = player.rotation.y;
    wallMesh.position.set(
      player.position.x + forwardVec.x * 3.8,
      2.25,
      player.position.z + forwardVec.z * 3.8
    );
    wallMesh.name = 'GLOO_WALL_MESH';

    sceneRef.current.add(wallMesh);
    glooWalls3D.current.push({
      mesh: wallMesh,
      hp: 200,
      createdAt: Date.now()
    });

    addLog('🛡️ GLOO WALL DEPLOYED! Physical 3D barrier shielding you from front bullets!');
    pushKillFeed('🛡️ Tactical gloo wall erected in 3D arena');
  };

  // Interactive heal channeling medkit
  const handleActivateMedkitHeal = () => {
    if (medkits <= 0) {
      addLog('❌ Out of Medkits!');
      return;
    }
    if (isHealCooling) return;
    if (playerHp >= playerMaxHp) {
      addLog('❌ HP already completely full!');
      return;
    }

    setIsHealCooling(true);
    addLog('🩹 Applying Medkit... Please stay behind 3D Gloo wall barriers for 3 seconds!');
    
    setTimeout(() => {
      setPlayerHp(cur => Math.min(playerMaxHp, cur + 105));
      setMedkits(prev => prev - 1);
      setIsHealCooling(false);
      addLog('🩹 Medkit injected! Recovered +105 HP instantly.');
    }, 2500);
  };

  // Terminate match and notify main framework state
  const handleFinishBattlePlay = (victory: boolean) => {
    // Return updated survivor hp mapping
    const survivors = playerTeam.map((c) => {
      // Scale down survival healths
      return {
        ...c,
        currentHp: victory ? Math.max(40, Math.round(playerHp * 0.75)) : 25
      };
    });
    setTimeout(() => {
      onBattleEnd(victory, survivors);
    }, 2800);
  };

  // Manual touch move helpers for 100% Mobile UI action compatibility
  const pressMoveDir = (dir: 'W' | 'A' | 'S' | 'D' | 'STOP') => {
    keysPressed.current['KeyW'] = dir === 'W';
    keysPressed.current['KeyA'] = dir === 'A';
    keysPressed.current['KeyS'] = dir === 'S';
    keysPressed.current['KeyD'] = dir === 'D';
  };

  return (
    <div className="relative min-h-[660px] bg-neutral-950 text-white rounded-none border border-white/10 overflow-hidden flex flex-col justify-between selection:bg-red-500 font-mono tracking-wider">
      
      {/* 2.1 PRE-MATCH EXQUISITE LOBBY & SKINS SHOP */}
      {battlePhase === 'lobby' && (
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs">
                <Skull size={14} className="animate-pulse" /> FREE FIRE & PUBG LIVE 3D ARENA
              </div>
              <h2 className="text-2xl font-black italic uppercase text-white font-display flex items-center gap-3">
                🏆 BATTLE DUEL PREPARATION ROOM
              </h2>
            </div>
            
            {/* Wallet Cash Balance */}
            <div className="bg-black/90 p-3 border border-white/15 rounded-none flex items-center gap-4 text-xs font-bold uppercase">
              <div>
                <span className="text-white/40 block text-[9px]">Lobby Gold Funds:</span>
                <span className="text-amber-400 text-sm font-black">${lobbyCash} GOLD</span>
              </div>
              <div className="h-6 w-[1.5px] bg-white/10" />
              <div>
                <span className="text-white/40 block text-[9px]">Playground Map:</span>
                <span className="text-white text-xs">{selectedMapPath}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* LOBBY ITEM ONE: DRESS UP OUTIFT CLOTHES */}
            <div className="lg:col-span-5 bg-black/50 p-4 border border-white/10 rounded-none space-y-3">
              <span className="text-[10px] text-red-550 font-black block border-b border-white/5 pb-1 flex items-center gap-1">
                <ShoppingBag size={12} /> SELECT COMBAT OUTFIT (FREE FIRE DRESSUP)
              </span>
              
              <div className="grid grid-cols-2 gap-3 pt-1">
                {LEGEND_OUTFITS.map((out) => {
                  const isSelected = selectedOutfit.id === out.id;
                  return (
                    <button
                      key={out.id}
                      type="button"
                      onClick={() => setSelectedOutfit(out)}
                      className={`p-3 text-left border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'border-red-500 bg-red-950/20 text-white shadow-xl scale-[1.02]' 
                          : 'border-white/10 bg-neutral-900/40 text-slate-400 hover:border-white'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] bg-red-500/10 text-red-500 px-1 font-black">{out.epicRarity}</span>
                          {isSelected && <Check size={11} className="text-red-500" />}
                        </div>
                        <h4 className="text-xs font-black uppercase text-white mt-1 leading-tight">{out.name}</h4>
                        <span className="text-[9.5px] text-white/40 block mt-1 leading-normal">{out.flavor}</span>
                      </div>
                      
                      <div className="border-t border-white/5 mt-2.5 pt-1 flex justify-between text-[8px] uppercase">
                        <span className="text-green-400">DEF +{out.defenseBoost}</span>
                        <span className="text-blue-400">SPD +{out.speedBoost}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Character previews */}
              <div className="bg-black/95 p-3.5 border border-white/15 h-48 flex flex-col justify-between uppercase tracking-wider relative overflow-hidden">
                <div className={`absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r ${selectedOutfit.color}`} />
                <div className="flex justify-between items-center text-[9px] font-mono border-b border-white/5 pb-1 w-full">
                  <span className="text-white/50 block">LIVE WebGL SKIN PREVIEW</span>
                  <span className="text-emerald-400 font-bold animate-pulse">● ENGINE ACTIVE</span>
                </div>
                
                <div className="flex-1 w-full min-h-[90px] relative my-1">
                  <Lobby3DPreview styleHex={selectedOutfit.styleHex} weaponColor={equippedSkin.colorHex} />
                </div>

                <div className="text-center pb-1 w-full">
                  <span className="text-xs text-white font-black block">{selectedOutfit.name}</span>
                </div>
              </div>
            </div>

            {/* LOBBY ITEM TWO: GUN CAROUSEL & UPGRADE SYSTEM */}
            <div className="lg:col-span-4 bg-black/50 p-4 border border-white/10 rounded-none space-y-3">
              <span className="text-[10px] text-red-550 font-black block border-b border-white/5 pb-1 flex items-center gap-1">
                <Flame size={12} /> EQUIP AND RETROFIT GUN WEAPON skins
              </span>

              <div className="flex flex-col gap-2.5">
                {weaponSkins.map((ws) => {
                  const isEquipped = equippedSkin.id === ws.id;
                  return (
                    <div 
                      key={ws.id} 
                      className={`p-2.5 border flex justify-between items-center transition-all ${
                        isEquipped 
                          ? 'border-yellow-500 bg-yellow-950/10' 
                          : 'border-white/5 bg-black'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase">
                          <span style={{ color: ws.colorHex }} className="font-black">{ws.aestheticName}</span>
                          <span className="text-white/40">[{ws.weaponType}]</span>
                        </div>
                        <span className="text-[10px] font-bold text-white block mt-0.5">{ws.name}</span>
                        <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">💥 x{ws.damageMultiplier} Force dmg</span>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => handleUpgradeWeaponSkin(ws)}
                          className={`px-3 py-1.5 text-[8.5px] font-black cursor-pointer uppercase transition-all whitespace-nowrap ${
                            isEquipped 
                              ? 'bg-yellow-500 text-black border border-yellow-500' 
                              : ws.unlocked 
                                ? 'bg-black text-white hover:bg-neutral-800 border border-white/25'
                                : 'bg-amber-600 text-white hover:bg-amber-500 border border-amber-600'
                          }`}
                        >
                          {isEquipped ? 'EQUIPPED' : ws.unlocked ? 'EQUIP SKIN' : `BUY: $${ws.cost}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LOBBY ITEM THREE: BATTLE ROYALE MAP PATH SELECTOR */}
            <div className="lg:col-span-3 bg-black/50 p-4 border border-white/10 rounded-none space-y-3">
              <span className="text-[10px] text-red-550 font-black block border-b border-white/5 pb-1 flex items-center gap-1">
                <Map size={12} /> BATTLE ROYALE SECTOR MAPS
              </span>

              <div className="space-y-2">
                {[
                  { name: 'Pochinki Containment Grids', desc: 'Dense tactical corridors. High defense crates loot drop zones.' },
                  { name: 'School Weapon Compound', desc: 'Open arena design. Heavy sniper drops with critical scopes.' },
                  { name: 'Sentinels Container Docks', desc: 'Shipping cargo layouts. Optimal speed Gloo Wall setups.' }
                ].map((m) => {
                  const isMapSelected = selectedMapPath === m.name;
                  return (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setSelectedMapPath(m.name)}
                      className={`w-full p-2.5 text-left border cursor-pointer uppercase transition-all block ${
                        isMapSelected ? 'border-red-500 bg-neutral-900' : 'border-white/5 bg-black hover:border-white/30'
                      }`}
                    >
                      <span className="text-[10px] font-black text-white block">{m.name}</span>
                      <span className="text-[9px] text-white/40 block mt-1 leading-normal">{m.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Event quests */}
              <div className="bg-red-950/20 border border-red-500/20 p-2.5 rounded-none space-y-1 text-[9px] leading-relaxed select-none">
                <span className="text-red-500 font-black flex items-center gap-1">🎖️ ELITE BOOYAH PASS QUESTS</span>
                <div className="text-white/70">✓ Kill 2 Vought Hostiles under playzone: <strong className="text-amber-400">+$300 GOLD</strong></div>
                <div className="text-white/70">✓ Build a Gloo Wall defense shield: <strong className="text-amber-400">+$200 GOLD</strong></div>
              </div>
            </div>
          </div>

          {/* Lobby navigation bottom */}
          <div className="bg-neutral-900/60 p-4 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/50 text-center md:text-left leading-normal uppercase">
              Ready to jump into realistic 3D movement bounds? <strong>[{selectedOutfit.name}]</strong> equipped with <strong>[{equippedSkin.aestheticName} {equippedSkin.weaponType}]</strong>.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={startSkydivingRun}
                className="px-8 py-4 bg-red-600 hover:bg-red-500 hover:text-white text-white font-black italic uppercase rounded-none tracking-widest text-sm cursor-pointer shadow-lg hover:shadow-red-500/10 flex items-center gap-2"
              >
                <Play size={15} /> LOAD REAL 3D arena
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2.2 PARACHUTE SQUAD DROP SECTOR */}
      {battlePhase === 'dropping' && (
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center items-center text-center max-w-2xl mx-auto py-12">
          <div className="w-full bg-neutral-950 border border-white/10 p-6 space-y-6">
            <h2 className="text-xl font-display font-black text-white tracking-widest flex items-center justify-center gap-3 animate-pulse">
              ✈️ HIGH ALTITUDE JUMP TELEMETRY
            </h2>

            {/* Altitude meter meter */}
            <div className="bg-black border border-white/10 p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span>PARACHUTE JET VELOCITY:</span>
                <span className="text-red-500 font-bold block">{Math.max(0, Math.round(dropAltitude))} METERS</span>
              </div>
              
              <div className="w-full h-4 bg-neutral-900 border border-white/5 relative overflow-hidden">
                <div 
                  className={`h-full ${parachuteDeployed ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'} transition-all`}
                  style={{ width: `${(dropAltitude / 3000) * 100}%` }}
                />
                <span className="absolute inset-0 text-[10px] font-black flex items-center justify-center text-white/95">
                  {parachuteDeployed ? '🪂 PARACHUTE DEPLOYED (GLIDING SLOWER)' : '✈️ FREE FALL PHASE (SPEED 340 M/S)'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left font-mono text-[10px] text-white/40 border-t border-white/5 pt-3">
                <div>
                  <span>Equipped Dress: <strong className="text-white block">{selectedOutfit.name}</strong></span>
                </div>
                <div>
                  <span>Tactical Weapon: <strong className="text-white block">{equippedSkin.aestheticName} Skin</strong></span>
                </div>
              </div>
            </div>

            {/* Action hotkey sliders */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                type="button"
                onClick={() => setParachuteDeployed(prev => !prev)}
                className={`flex-1 py-3.5 text-xs font-black transition-all border cursor-pointer uppercase ${
                  parachuteDeployed ? 'bg-emerald-800 text-white border-emerald-500' : 'bg-black text-white/60 border-white/10 hover:border-white'
                }`}
              >
                🪂 {parachuteDeployed ? 'CLOSE PARACHUTE' : 'OPEN PARACHUTE'}
              </button>

              <button
                type="button"
                onClick={() => setDropSpeedMultiplier(prev => prev === 1 ? 2.2 : 1)}
                className={`px-6 py-3.5 text-xs font-black transition-all border cursor-pointer uppercase ${
                  dropSpeedMultiplier > 1 ? 'bg-amber-600 text-black border-white' : 'bg-black text-white/60 border-white/10'
                }`}
              >
                ⏩ CRUISE DESCENT
              </button>

              <button
                type="button"
                onClick={handleSkipOrForceLand}
                className="px-6 py-3.5 bg-white text-black text-xs font-black uppercase tracking-wider cursor-pointer font-sans"
              >
                LAND ON MAP ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2.3 THE GENUINE 3D SURVIVAL SHOOTER BATTLEGROUND */}
      {battlePhase === 'combat' && (
        <div className="flex-1 flex flex-col relative">
          
          {/* TOP HUD ROW */}
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2 font-mono uppercase bg-neutral-950/90 p-4 border border-white/10">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-red-500">
                <AlertTriangle size={12} className="animate-pulse" /> PLAYZONE CONTRACT HAZARD
              </div>
              <h2 className="text-sm font-black text-white italic tracking-wide">{selectedMapPath} // ARENA</h2>
            </div>

            {/* Timers & Counters */}
            <div className="flex items-center gap-4 text-xs font-bold whitespace-nowrap">
              <div className="bg-black/80 px-3 py-1.5 border border-white/10">
                <span className="text-[9px] text-white/40 block">SHRINK TIMER</span>
                <span className="text-red-500 text-sm font-black">{playzoneTimer}s</span>
              </div>
              
              <div className="bg-black/80 px-3 py-1.5 border border-white/10 text-right">
                <span className="text-[9px] text-white/40 block">KILLS ELIMINATIONS</span>
                <span className="text-white text-sm font-black">💀 {vesselsEliminated} KILLS</span>
              </div>

              <div className="bg-black/80 px-3 py-1.5 border border-white/10 text-right">
                <span className="text-[9px] text-white/40 block">GLOO WALL STORAGE</span>
                <span className="text-cyan-400 text-sm font-black">🧱 {glooWalls} LEFT</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC THREE.JS WEBGL RENDER CANVAS CONTAINMENT GRID */}
          <div 
            ref={canvasContainerRef} 
            className="w-full h-[580px] bg-black relative flex items-center justify-center select-none"
          >
            {!is3DReady && (
              <div className="flex flex-col items-center gap-3.5 justify-center font-mono">
                <RefreshCw size={36} className="animate-spin text-red-500" />
                <span className="text-xs uppercase font-black tracking-widest text-white/40">COMPILING 3D REAL-TIME SHADER NETWORKS...</span>
              </div>
            )}

            {/* REAL-TIME FPS RETICLE CHASER OVERLAY */}
            {is3DReady && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Tactical FPS Circular scope reticle */}
                <div className={`w-14 h-14 rounded-full border-2 border-dashed ${crosshairColor} transition-all duration-300 relative flex items-center justify-center`}>
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  <div className="absolute -top-3 w-[1.5px] h-2 bg-red-500" />
                  <div className="absolute -bottom-3 w-[1.5px] h-2 bg-red-500" />
                  <div className="absolute -left-3 w-2 h-[1.5px] bg-red-500" />
                  <div className="absolute -right-3 w-2 h-[1.5px] bg-red-500" />
                </div>
              </div>
            )}

            {/* 3D FLOATING SCORE DAMAGE POPUPS */}
            {scopedDamages && (
              <div 
                className="absolute z-30 pointer-events-none font-black italic scale-125 select-none animate-bounce"
                style={{ left: scopedDamages.x, top: scopedDamages.y }}
              >
                <div className={`${scopedDamages.isHeadshot ? 'text-red-500 text-3xl font-display' : 'text-amber-400 text-xl'}`}>
                  {scopedDamages.isHeadshot ? '💥 CRIT HEADSHOT' : '🎯 HIT'}
                </div>
                <div className="text-white text-2xl font-black">{scopedDamages.value} DMG</div>
              </div>
            )}

            {/* MOBILE COMPATIBILITY: ON-SCREEN CONTROL BUTTON PADS OVERLAY */}
            <div className="absolute bottom-6 left-6 z-20 pointer-events-auto bg-black/40 p-4 border border-white/5 rounded-none grid grid-cols-3 gap-1 select-none w-35 h-35">
              <div />
              <button
                type="button"
                onMouseDown={() => pressMoveDir('W')}
                onMouseUp={() => pressMoveDir('STOP')}
                onTouchStart={() => pressMoveDir('W')}
                onTouchEnd={() => pressMoveDir('STOP')}
                className="bg-neutral-900 border border-white/20 active:bg-red-500 text-white font-black text-xs p-2 uppercase"
              >
                ▲ W
              </button>
              <div />
              <button
                type="button"
                onMouseDown={() => pressMoveDir('A')}
                onMouseUp={() => pressMoveDir('STOP')}
                onTouchStart={() => pressMoveDir('A')}
                onTouchEnd={() => pressMoveDir('STOP')}
                className="bg-neutral-900 border border-white/20 active:bg-red-500 text-white font-black text-xs p-2 uppercase"
              >
                ◀ A
              </button>
              <button
                type="button"
                className="bg-neutral-850 text-[10px] text-white/50 flex items-center justify-center leading-none"
              >
                D-PAD
              </button>
              <button
                type="button"
                onMouseDown={() => pressMoveDir('D')}
                onMouseUp={() => pressMoveDir('STOP')}
                onTouchStart={() => pressMoveDir('D')}
                onTouchEnd={() => pressMoveDir('STOP')}
                className="bg-neutral-900 border border-white/20 active:bg-red-500 text-white font-black text-xs p-2 uppercase"
              >
                ▶ D
              </button>
              <div />
              <button
                type="button"
                onMouseDown={() => pressMoveDir('S')}
                onMouseUp={() => pressMoveDir('STOP')}
                onTouchStart={() => pressMoveDir('S')}
                onTouchEnd={() => pressMoveDir('STOP')}
                className="bg-neutral-900 border border-white/20 active:bg-red-500 text-white font-black text-xs p-2 uppercase"
              >
                ▼ S
              </button>
              <div />
            </div>

            {/* Allied Speech Bubble */}
            <AnimatePresence>
              {is3DReady && playerTaunt && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, x: -20 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="absolute bottom-48 left-6 z-35 max-w-xs bg-neutral-950/95 border border-red-500/40 p-3 rounded-none shadow-2xl pointer-events-auto"
                >
                  <div className="relative">
                    {/* Speech pointer */}
                    <div className="absolute -bottom-4 left-4 w-3.5 h-3.5 bg-neutral-950 border-r border-b border-red-500/40 rotate-45" />
                    
                    <button 
                      onClick={() => setPlayerTaunt(null)}
                      className="absolute -top-1 -right-1 text-[9px] font-bold text-white/30 hover:text-white cursor-pointer w-4 h-4 flex items-center justify-center bg-black/50 hover:bg-black rounded-full"
                    >
                      ✕
                    </button>
                    
                    <span className="font-mono text-[8px] text-amber-400 font-black uppercase tracking-widest block mb-0.5">
                      📢 {playerTaunt.codename} (ALLIED)
                    </span>
                    <p className="text-[11px] text-slate-100 font-sans italic leading-relaxed">
                      "{playerTaunt.quote}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hostile Speech Bubble */}
            <AnimatePresence>
              {is3DReady && enemyTaunt && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, x: 20 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="absolute top-28 right-6 z-35 max-w-xs bg-red-950/95 border border-red-500 p-3 rounded-none shadow-2xl pointer-events-auto"
                >
                  <div className="relative">
                    {/* Speech pointer */}
                    <div className="absolute -top-4 right-4 w-3 h-3 bg-red-950 border-l border-t border-red-500 rotate-45" />

                    <button 
                      onClick={() => setEnemyTaunt(null)}
                      className="absolute -top-1 -right-1 text-[9px] font-bold text-white/40 hover:text-white cursor-pointer w-4 h-4 flex items-center justify-center bg-black/50 hover:bg-black rounded-full"
                    >
                      ✕
                    </button>

                    <span className="font-mono text-[8px] text-red-400 font-black uppercase tracking-widest block mb-0.5">
                      ⚠️ HOSTILE RESPONSE
                    </span>
                    <span className="font-mono text-[10px] text-white font-black block mb-1">
                      {enemyTaunt.codename}
                    </span>
                    <p className="text-[11px] text-red-100 font-sans italic leading-relaxed">
                      "{enemyTaunt.quote}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* RIGHT SIDE SHOOT CONTROLS FOR MOBILE AND MOUSE SENSITIVE USERS */}
            <div className="absolute bottom-6 right-6 z-20 pointer-events-auto flex flex-col gap-3">
              <button
                type="button"
                onClick={fireActiveWeapon3D}
                className={`h-16 w-16 bg-red-600 hover:bg-red-500 text-white font-black italic border-2 border-white rounded-full flex flex-col items-center justify-center text-center shadow-lg transform active:scale-95 cursor-pointer leading-none ${visualShootFlash ? 'scale-110 bg-yellow-500' : ''}`}
              >
                <Crosshair size={18} />
                <span className="text-[8px] font-black block mt-0.5">SHOOT</span>
              </button>

              <button
                type="button"
                disabled={glooWallCooldown}
                onClick={triggerGlooWallDeployment}
                className="py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black italic text-[10px] uppercase border border-cyan-400 cursor-pointer w-28 whitespace-nowrap leading-tight text-center"
              >
                🧱 GLOO WALL (G)
              </button>

              <button
                type="button"
                onClick={triggerCombatTaunt}
                className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-black italic text-[10px] uppercase border border-amber-400 cursor-pointer w-28 whitespace-nowrap leading-tight text-center"
              >
                📢 TAUNT (T)
              </button>
            </div>

            {/* BLUEZONE SCREEN STATIC OVERLAYS */}
            {stormActive && (
              <div className="absolute inset-0 z-10 pointer-events-none bg-blue-500/10 border-4 border-cyan-500 animate-pulse flex items-center justify-center">
                <span className="text-cyan-400 font-black italic tracking-widest text-sm animate-bounce text-center bg-black/80 px-4 py-2 border border-cyan-550 inline-block">
                  ⚡ OUTSIDE PLAYZONE BOUNDARIES! RECEIVING BLUEZONE RADIATION ⚡
                </span>
              </div>
            )}
          </div>

          {/* LOWER INTERACTION TACTICAL GRID PANEL */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-neutral-900 border-t border-white/10 p-4">
            {/* Player Survival Vitals meters */}
            <div className="md:col-span-5 bg-black p-3.5 border border-white/10 space-y-2 font-mono uppercase">
              <div className="flex justify-between text-xs font-black">
                <span className="text-white flex items-center gap-1">
                  <User size={13} className="text-red-500" /> HP HEALTH STATUS:
                </span>
                <span className={playerHp < 50 ? 'text-red-500 font-bold animate-pulse' : 'text-green-400'}>
                  {Math.round(playerHp)} / {playerMaxHp} HP
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-neutral-900 border border-white/5 relative overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    playerHp < 60 ? 'bg-red-650 animate-pulse' : 'bg-green-500'
                  }`}
                  style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-[10px] text-white/50 pt-2 border-t border-white/5">
                <div>
                  <span>Equipped outfit armor: <strong className="text-white block">{selectedOutfit.name}</strong></span>
                </div>
                <div>
                  <span>Weapon Skin Damage: <strong className="text-yellow-400 block">{equippedSkin.aestheticName} (x{equippedSkin.damageMultiplier})</strong></span>
                </div>
              </div>
            </div>

            {/* Medkit heal trigger slots */}
            <div className="md:col-span-3 bg-black p-3.5 border border-white/10 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[10px] font-mono text-white/40 uppercase">
                <span>🎒 Survival Backpack:</span>
                <span className="text-white font-bold">{medkits} medkits</span>
              </div>

              <button
                type="button"
                disabled={medkits <= 0 || isHealCooling}
                onClick={handleActivateMedkitHeal}
                className="w-full py-2.5 bg-green-750 hover:bg-green-700 hover:text-white text-white font-black italic rounded-none border border-green-500 uppercase tracking-wider text-xs cursor-pointer mt-1"
              >
                {isHealCooling ? '🩹 SYRINGE FLOWING (2S)...' : `🩹 CONSUME MEDKIT`}
              </button>
            </div>

            {/* Dual mini map kill list feed */}
            <div className="md:col-span-4 bg-[#110101]/60 p-3.5 border border-red-900/30 flex flex-col justify-between">
              <span className="text-red-500 font-black text-[9px] block uppercase tracking-wider border-b border-red-500/10 pb-1 flex items-center gap-1 mb-1">
                <Skull size={10} /> SQUAD LIVE KILL FEED
              </span>
              <div className="space-y-1 text-[9.5px] uppercase max-h-[50px] overflow-y-auto leading-tight text-white/70">
                {killFeed.map((kf, idx) => (
                  <div key={idx} className="truncate select-none font-bold">✓ {kf}</div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2.4 GAMEOVER SCREEN */}
      {battlePhase === 'gameover' && (
        <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 text-center relative z-10 max-w-2xl mx-auto py-16 uppercase font-mono bg-black">
          <div className="border border-white/10 bg-neutral-950 p-8 shadow-2xl space-y-6 w-full">
            <Trophy size={48} className="mx-auto text-yellow-500 animate-bounce" />
            
            <div>
              <h2 className="text-2xl font-black italic text-white flex items-center justify-center gap-3">
                🏆 BATTLEGROUND DUEL TERMINAL 🏆
              </h2>
              <p className="text-xs text-white/50 mt-1">Live status report computed successfully</p>
            </div>

            <div className="bg-black/90 p-5 border border-white/15 space-y-3.5 text-xs text-left text-white/80">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Playground Selected Land:</span>
                <span className="font-bold text-white">{selectedMapPath}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Custom dress selection:</span>
                <span className="font-bold text-white">{selectedOutfit.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Vought Enemies dispatched in 3D:</span>
                <span className="font-bold text-red-500">{vesselsEliminated} neutralized</span>
              </div>
              <div className="flex justify-between text-yellow-500 font-black border-t border-white/10 pt-3">
                <span>Chicken Dinner gold rewards:</span>
                <span>+${rewards.cash || 900} cash gold bonus</span>
              </div>
            </div>

            <p className="text-xs text-yellow-500 block italic leading-normal animate-pulse">
              🎉 MATCH TERMINATING! SYNCHRONIZING ACCREDITATIONS & GOLD REWARDS TO CAMPAIGN HOUSES...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
