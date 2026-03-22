import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import CityScene from './CityScene';
import InstancedDecorations from './InstancedDecorations';
import type { FocusInfo } from './CityScene';
import type {
  CityBuilding,
  CityPlaza,
  CityDecoration,
  CityRiver,
  CityBridge,
} from '@/lib/gitCity/github';
import type { BuildingColors } from './types';

export type { BuildingColors };
export { THEME_NAMES } from './types';

interface CityTheme {
  sky: [number, string][];
  fogColor: string;
  fogNear: number;
  fogFar: number;
  ambientColor: string;
  ambientIntensity: number;
  sunColor: string;
  sunIntensity: number;
  sunPos: [number, number, number];
  fillColor: string;
  fillIntensity: number;
  fillPos: [number, number, number];
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  groundColor: string;
  grid1: string;
  grid2: string;
  roadMarkingColor: string;
  sidewalkColor: string;
  building: BuildingColors;
}

const THEMES: CityTheme[] = [
  {
    sky: [
      [0, '#000206'],
      [0.15, '#020814'],
      [0.3, '#061428'],
      [0.45, '#0c2040'],
      [0.55, '#102850'],
      [0.65, '#0c2040'],
      [0.8, '#061020'],
      [1, '#020608'],
    ],
    fogColor: '#0a1428',
    fogNear: 400,
    fogFar: 2500,
    ambientColor: '#4060b0',
    ambientIntensity: 0.55,
    sunColor: '#7090d0',
    sunIntensity: 0.75,
    sunPos: [300, 120, -200],
    fillColor: '#304080',
    fillIntensity: 0.3,
    fillPos: [-200, 60, 200],
    hemiSky: '#5080a0',
    hemiGround: '#202830',
    hemiIntensity: 0.5,
    groundColor: '#242c38',
    grid1: '#344050',
    grid2: '#2c3848',
    roadMarkingColor: '#8090a0',
    sidewalkColor: '#484c58',
    building: {
      windowLit: ['#a0c0f0', '#80a0e0', '#6080c8', '#c0d8f8', '#e0e8ff'],
      windowOff: '#0c0e18',
      face: '#101828',
      roof: '#2a3858',
      accent: '#6090e0',
    },
  },
  {
    sky: [
      [0, '#0c0614'],
      [0.15, '#1c0e30'],
      [0.28, '#3a1850'],
      [0.38, '#6a3060'],
      [0.46, '#a05068'],
      [0.52, '#d07060'],
      [0.57, '#e89060'],
      [0.62, '#f0b070'],
      [0.68, '#f0c888'],
      [0.75, '#c08060'],
      [0.85, '#603030'],
      [1, '#180c10'],
    ],
    fogColor: '#80405a',
    fogNear: 400,
    fogFar: 2500,
    ambientColor: '#e0a080',
    ambientIntensity: 0.7,
    sunColor: '#f0b070',
    sunIntensity: 1.0,
    sunPos: [400, 120, -300],
    fillColor: '#6050a0',
    fillIntensity: 0.35,
    fillPos: [-200, 80, 200],
    hemiSky: '#d09080',
    hemiGround: '#4a2828',
    hemiIntensity: 0.55,
    groundColor: '#3a3038',
    grid1: '#504048',
    grid2: '#443838',
    roadMarkingColor: '#d0a840',
    sidewalkColor: '#585058',
    building: {
      windowLit: ['#f8d880', '#f0b860', '#e89840', '#d07830', '#f0c060'],
      windowOff: '#1a1018',
      face: '#281828',
      roof: '#604050',
      accent: '#c8e64a',
    },
  },
  {
    sky: [
      [0, '#06001a'],
      [0.15, '#100028'],
      [0.3, '#200440'],
      [0.42, '#380650'],
      [0.52, '#500860'],
      [0.6, '#380648'],
      [0.75, '#180230'],
      [0.9, '#0c0118'],
      [1, '#06000c'],
    ],
    fogColor: '#1a0830',
    fogNear: 400,
    fogFar: 2500,
    ambientColor: '#8040c0',
    ambientIntensity: 0.6,
    sunColor: '#c050e0',
    sunIntensity: 0.85,
    sunPos: [300, 100, -200],
    fillColor: '#00c0d0',
    fillIntensity: 0.4,
    fillPos: [-250, 60, 200],
    hemiSky: '#9040d0',
    hemiGround: '#201028',
    hemiIntensity: 0.5,
    groundColor: '#2c2038',
    grid1: '#3c2c50',
    grid2: '#342440',
    roadMarkingColor: '#c060e0',
    sidewalkColor: '#484058',
    building: {
      windowLit: ['#ff40c0', '#c040ff', '#00e0ff', '#40ff80', '#ff8040'],
      windowOff: '#0a0814',
      face: '#180830',
      roof: '#3c1858',
      accent: '#e040c0',
    },
  },
  {
    sky: [
      [0, '#000804'],
      [0.15, '#001408'],
      [0.3, '#002810'],
      [0.42, '#003c1c'],
      [0.52, '#004828'],
      [0.6, '#003820'],
      [0.75, '#002014'],
      [0.9, '#001008'],
      [1, '#000604'],
    ],
    fogColor: '#0a2014',
    fogNear: 400,
    fogFar: 2500,
    ambientColor: '#40a060',
    ambientIntensity: 0.55,
    sunColor: '#70d090',
    sunIntensity: 0.75,
    sunPos: [300, 100, -250],
    fillColor: '#20a080',
    fillIntensity: 0.35,
    fillPos: [-200, 60, 200],
    hemiSky: '#50b068',
    hemiGround: '#183020',
    hemiIntensity: 0.5,
    groundColor: '#1e3020',
    grid1: '#2c4838',
    grid2: '#243828',
    roadMarkingColor: '#60c080',
    sidewalkColor: '#404848',
    building: {
      windowLit: ['#0e4429', '#006d32', '#26a641', '#39d353', '#c8e64a'],
      windowOff: '#060e08',
      face: '#0c1810',
      roof: '#1e4028',
      accent: '#f0c060',
    },
  },
];

function SkyDome({ stops }: { stops: [number, string][] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 4;
    c.height = 512;
    const ctx = c.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    for (const [stop, color] of stops) g.addColorStop(stop, color);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 512);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.BackSide,
      fog: false,
      depthWrite: false,
    });
  }, [stops]);

  useFrame(({ camera }) => {
    if (meshRef.current) meshRef.current.position.copy(camera.position);
  });

  useEffect(
    () => () => {
      mat.map?.dispose();
      mat.dispose();
    },
    [mat]
  );

  return (
    <mesh ref={meshRef} material={mat} renderOrder={-1}>
      <sphereGeometry args={[3500, 32, 48]} />
    </mesh>
  );
}

function Ground({ color, grid1, grid2 }: { color: string; grid1: string; grid2: string }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20000, 20000]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} roughness={0.95} />
      </mesh>
      <gridHelper args={[4000, 200, grid1, grid2]} position={[0, -0.5, 0]} />
    </group>
  );
}

const TARGET_X = 100;
const TARGET_Z = -100;
const TARGET_Y = 300;
const INTRO_DURATION = 10;

const INTRO_WAYPOINTS: [number, number, number][] = [
  [-800, 500, 900],
  [-400, 400, 600],
  [0, 350, 500],
  [300, 400, 550],
  [500, 500, 700],
  [600, 600, 850],
];

const INTRO_LOOK: [number, number, number] = [TARGET_X, TARGET_Y, TARGET_Z];

const _introPos = new THREE.Vector3();

function introEase(t: number): number {
  const s = Math.max(0, Math.min(1, t));
  return s * s * s * (s * (s * 6 - 15) + 10);
}

function IntroFlyover({ onEnd }: { onEnd: () => void }) {
  const { camera } = useThree();
  const elapsed = useRef(0);
  const ended = useRef(false);

  const posCurve = useMemo(() => {
    const pts = INTRO_WAYPOINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    curve.getLength();
    return curve;
  }, []);

  useEffect(() => {
    camera.position.set(...INTRO_WAYPOINTS[0]);
    camera.lookAt(...INTRO_LOOK);
  }, [camera]);

  useFrame((_, delta) => {
    if (ended.current) return;
    elapsed.current += delta;
    const rawT = Math.min(elapsed.current / INTRO_DURATION, 1);
    const t = introEase(rawT);
    posCurve.getPointAt(t, _introPos);
    camera.position.copy(_introPos);
    camera.lookAt(TARGET_X, TARGET_Y, TARGET_Z);
    if (elapsed.current >= INTRO_DURATION) {
      ended.current = true;
      onEnd();
    }
  });

  return null;
}

function CameraFocus({
  buildings,
  focusedBuilding,
  focusedBuildingB,
  controlsRef,
}: {
  buildings: CityBuilding[];
  focusedBuilding: string | null;
  focusedBuildingB?: string | null;
  controlsRef: React.RefObject<{ target: THREE.Vector3; update: () => void } | null>;
}) {
  const { camera } = useThree();
  const startPos = useRef(new THREE.Vector3());
  const startLook = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3());
  const endLook = useRef(new THREE.Vector3());
  const progress = useRef(1);
  const active = useRef(false);
  const buildingsRef = useRef(buildings);
  buildingsRef.current = buildings;

  useEffect(() => {
    if (!focusedBuilding && !focusedBuildingB) {
      if (controlsRef.current) controlsRef.current.autoRotate = true;
      return;
    }
    const bA = buildingsRef.current.find(
      (b) => b.login.toLowerCase() === (focusedBuilding ?? focusedBuildingB ?? '').toLowerCase()
    );
    if (!bA) return;

    startPos.current.copy(camera.position);
    if (controlsRef.current) startLook.current.copy(controlsRef.current.target);

    const dist = 180;
    const bx = bA.position[0];
    const bz = bA.position[2];
    const bLen = Math.sqrt(bx * bx + bz * bz) || 1;
    endPos.current.set(
      bx + (bx / bLen) * dist,
      bA.height + 120,
      bz + (bz / bLen) * dist
    );
    endLook.current.set(bx, Math.max(0, bA.height + 15), bz);

    progress.current = 0;
    active.current = true;
    if (controlsRef.current) controlsRef.current.autoRotate = false;
  }, [focusedBuilding, focusedBuildingB, camera, controlsRef]);

  useFrame((_, delta) => {
    if (!active.current || progress.current >= 1) return;
    progress.current = Math.min(1, progress.current + delta * 0.7);
    const t = 1 - Math.pow(1 - progress.current, 3);
    camera.position.lerpVectors(startPos.current, endPos.current, t);
    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(startLook.current, endLook.current, t);
      controlsRef.current.update();
    }
    if (progress.current >= 1) active.current = false;
  });

  return null;
}

function OrbitScene({
  buildings,
  focusedBuilding,
  focusedBuildingB,
}: {
  buildings: CityBuilding[];
  focusedBuilding: string | null;
  focusedBuildingB?: string | null;
}) {
  const controlsRef = useRef<{ target: THREE.Vector3; update: () => void; autoRotate: boolean } | null>(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(600, 550, 700);
    camera.lookAt(TARGET_X, TARGET_Y, TARGET_Z);
  }, [camera]);

  return (
    <>
      <CameraFocus
        buildings={buildings}
        focusedBuilding={focusedBuilding}
        focusedBuildingB={focusedBuildingB}
        controlsRef={controlsRef}
      />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.06}
        minDistance={40}
        maxDistance={2500}
        maxPolarAngle={Math.PI / 2.1}
        target={[TARGET_X, TARGET_Y, TARGET_Z]}
        autoRotate
        autoRotateSpeed={0.15}
      />
    </>
  );
}

function RiverPlane({ river, color }: { river: CityRiver; color: string }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[river.x + river.width / 2, 0.3, river.centerZ]}
    >
      <planeGeometry args={[river.width, river.length]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

const _dBox = new THREE.BoxGeometry(1, 1, 1);

function Bridge({ bridge }: { bridge: CityBridge }) {
  const [bx, , bz] = bridge.position;
  const deckLength = bridge.width;
  const deckWidth = 18;
  const deckHeight = 1;
  const deckY = 6;
  const pillarCount = 3;
  const pillarSpacing = deckLength / (pillarCount + 1);

  return (
    <group position={[bx, 0, bz]} rotation={[0, bridge.rotation ?? 0, 0]}>
      <mesh position={[0, deckY, 0]} geometry={_dBox} scale={[deckLength, deckHeight, deckWidth]}>
        <meshStandardMaterial color="#505860" emissive="#404850" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, deckY + 1, deckWidth / 2 - 0.2]} geometry={_dBox} scale={[deckLength, 1.5, 0.4]}>
        <meshStandardMaterial color="#606870" emissive="#505860" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, deckY + 1, -(deckWidth / 2 - 0.2)]} geometry={_dBox} scale={[deckLength, 1.5, 0.4]}>
        <meshStandardMaterial color="#606870" emissive="#505860" emissiveIntensity={0.3} />
      </mesh>
      {Array.from({ length: pillarCount }, (_, i) => {
        const px = -deckLength / 2 + pillarSpacing * (i + 1);
        return (
          <mesh key={i} position={[px, deckY / 2, 0]} geometry={_dBox} scale={[2.5, deckY, 2.5]}>
            <meshStandardMaterial color="#404848" emissive="#303838" emissiveIntensity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

interface CityCanvasProps {
  buildings: CityBuilding[];
  plazas: CityPlaza[];
  decorations: CityDecoration[];
  river: CityRiver;
  bridges: CityBridge[];
  themeIndex?: number;
  introMode?: boolean;
  onIntroEnd?: () => void;
  focusedBuilding?: string | null;
  focusedBuildingB?: string | null;
  onBuildingClick?: (building: CityBuilding) => void;
  onFocusInfo?: (info: FocusInfo) => void;
  holdRise?: boolean;
}

export default function CityCanvas({
  buildings,
  plazas,
  decorations,
  river,
  bridges,
  themeIndex = 0,
  introMode = true,
  onIntroEnd,
  focusedBuilding,
  focusedBuildingB,
  onBuildingClick,
  onFocusInfo,
  holdRise,
}: CityCanvasProps) {
  const t = THEMES[themeIndex] ?? THEMES[0];
  const [bloomEnabled, setBloomEnabled] = useState(true);

  return (
    <Canvas
      camera={{ position: [400, 450, 600], fov: 55, near: 0.5, far: 4000 }}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh' }}
    >
      <fog attach="fog" args={[t.fogColor, t.fogNear, t.fogFar]} key={`fog-${themeIndex}`} />

      <ambientLight intensity={t.ambientIntensity * 3} color={t.ambientColor} />
      <directionalLight position={t.sunPos} intensity={t.sunIntensity * 3.5} color={t.sunColor} />
      <directionalLight position={t.fillPos} intensity={t.fillIntensity * 3} color={t.fillColor} />
      <hemisphereLight
        args={[t.hemiSky, t.hemiGround, t.hemiIntensity * 3.5]}
        key={`hemi-${themeIndex}`}
      />

      <SkyDome key={`sky-${themeIndex}`} stops={t.sky} />

      {introMode && <IntroFlyover onEnd={onIntroEnd ?? (() => {})} />}

      {!introMode && (
        <OrbitScene
          buildings={buildings}
          focusedBuilding={focusedBuilding ?? null}
          focusedBuildingB={focusedBuildingB}
        />
      )}

      <Ground key={`ground-${themeIndex}`} color={t.groundColor} grid1={t.grid1} grid2={t.grid2} />

      {river && <RiverPlane river={river} color="#0a1830" />}

      {bridges?.map((b, i) => (
        <Bridge key={`bridge-${i}`} bridge={b} />
      ))}

      {decorations.length > 0 && (
        <InstancedDecorations
          items={decorations}
          roadMarkingColor={t.roadMarkingColor}
          sidewalkColor={t.sidewalkColor}
        />
      )}

      <CityScene
        buildings={buildings}
        colors={t.building}
        focusedBuilding={focusedBuilding}
        focusedBuildingB={focusedBuildingB}
        accentColor={t.building.accent}
        onBuildingClick={onBuildingClick}
        onFocusInfo={onFocusInfo}
        introMode={introMode}
        holdRise={holdRise}
      />

      {bloomEnabled && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.3} intensity={1.0} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
