import { useRef, useMemo, useEffect, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const _box = new THREE.BoxGeometry(1, 1, 1);
const _plane = new THREE.PlaneGeometry(1, 1);

// ─── Claimed Glow ────────────────────────────────────────────

export const ClaimedGlow = memo(function ClaimedGlow({
  height,
  width,
  depth,
  color = '#c8e64a',
}: {
  height: number;
  width: number;
  depth: number;
  color?: string;
}) {
  const trimThickness = 1.2;
  const trimHeight = 2;
  const hw = width / 2 + trimThickness / 2;
  const hd = depth / 2 + trimThickness / 2;

  return (
    <group>
      <group position={[0, height - trimHeight / 2, 0]}>
        <mesh position={[0, 0, hd]}>
          <boxGeometry args={[width + trimThickness * 2, trimHeight, trimThickness]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -hd]}>
          <boxGeometry args={[width + trimThickness * 2, trimHeight, trimThickness]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
        </mesh>
        <mesh position={[-hw, 0, 0]}>
          <boxGeometry args={[trimThickness, trimHeight, depth]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
        </mesh>
        <mesh position={[hw, 0, 0]}>
          <boxGeometry args={[trimThickness, trimHeight, depth]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
});

// ─── Neon Outline ────────────────────────────────────────────

export const NeonOutline = memo(function NeonOutline({
  width,
  height,
  depth,
  color = '#c8e64a',
}: {
  width: number;
  height: number;
  depth: number;
  color?: string;
}) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const frameCount = useRef(0);

  useFrame((state) => {
    if (!lineRef.current) return;
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
  });

  const geometry = useMemo(() => {
    const box = new THREE.BoxGeometry(width + 1, height + 1, depth + 1);
    const edges = new THREE.EdgesGeometry(box);
    box.dispose();
    return edges;
  }, [width, height, depth]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments ref={lineRef} geometry={geometry} position={[0, height / 2, 0]}>
      <lineBasicMaterial color={color} transparent opacity={0.8} />
    </lineSegments>
  );
});

// ─── Particle Aura ───────────────────────────────────────────

const AURA_COUNT = 60;

export const ParticleAura = memo(function ParticleAura({
  width,
  height,
  depth,
  color = '#c8e64a',
}: {
  width: number;
  height: number;
  depth: number;
  color?: string;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const frameCount = useRef(0);

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(AURA_COUNT * 3);
    const spd = new Float32Array(AURA_COUNT);
    const spread = Math.max(width, depth) * 0.8;

    for (let i = 0; i < AURA_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = spread / 2 + Math.random() * spread * 0.4;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.random() * height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      spd[i] = 5 + Math.random() * 15;
    }
    return { positions: pos, speeds: spd };
  }, [width, height, depth]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    frameCount.current++;
    if (frameCount.current % 2 !== 0) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < AURA_COUNT; i++) {
      arr[i * 3 + 1] += speeds[i] * 0.032;
      if (arr[i * 3 + 1] > height * 1.2) arr[i * 3 + 1] = 0;
      arr[i * 3] += Math.sin(t + i) * 0.02;
      arr[i * 3 + 2] += Math.cos(t + i * 0.7) * 0.02;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={2.5} transparent opacity={0.7} depthWrite={false} sizeAttenuation />
    </points>
  );
});

// ─── Spotlight Effect ────────────────────────────────────────

export const SpotlightEffect = memo(function SpotlightEffect({
  height,
  width,
  depth,
  color = '#c8e64a',
}: {
  height: number;
  width: number;
  depth: number;
  color?: string;
}) {
  const beam1 = useRef<THREE.Group>(null);
  const beam2 = useRef<THREE.Group>(null);
  const frameCount = useRef(0);

  const beamH = height * 3;
  const topR = Math.max(width, depth) * 0.4;
  const spread = Math.max(width, depth) * 0.25;

  useFrame((state) => {
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return;
    const t = state.clock.elapsedTime;
    if (beam1.current) {
      beam1.current.rotation.x = Math.sin(t * 0.4) * 0.08;
      beam1.current.rotation.z = Math.cos(t * 0.3) * 0.06;
    }
    if (beam2.current) {
      beam2.current.rotation.x = Math.cos(t * 0.35) * 0.07;
      beam2.current.rotation.z = Math.sin(t * 0.45) * 0.08;
    }
  });

  const beamMat = (
    <meshBasicMaterial color={color} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
  );
  const glowMat = (
    <meshBasicMaterial color={color} transparent opacity={0.04} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
  );

  return (
    <group position={[0, height, 0]}>
      <group ref={beam1} position={[-spread, 0, -spread * 0.5]}>
        <mesh position={[0, 0.6, 0]} geometry={_box} scale={[2, 1.2, 2]}>
          <meshStandardMaterial color="#333340" emissive="#666666" emissiveIntensity={2} toneMapped={false} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, beamH / 2 + 1, 0]}>
          <coneGeometry args={[topR, beamH, 8, 1, true]} />
          {beamMat}
        </mesh>
        <mesh position={[0, beamH / 2 + 1, 0]}>
          <coneGeometry args={[topR * 1.6, beamH * 0.95, 8, 1, true]} />
          {glowMat}
        </mesh>
      </group>
      <group ref={beam2} position={[spread, 0, spread * 0.5]}>
        <mesh position={[0, 0.6, 0]} geometry={_box} scale={[2, 1.2, 2]}>
          <meshStandardMaterial color="#333340" emissive="#666666" emissiveIntensity={2} toneMapped={false} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, beamH / 2 + 1, 0]}>
          <coneGeometry args={[topR, beamH, 8, 1, true]} />
          {beamMat}
        </mesh>
        <mesh position={[0, beamH / 2 + 1, 0]}>
          <coneGeometry args={[topR * 1.6, beamH * 0.95, 8, 1, true]} />
          {glowMat}
        </mesh>
      </group>
    </group>
  );
});

// ─── Flag ────────────────────────────────────────────────────

export const Flag = memo(function Flag({
  height,
  width,
  depth,
  color = '#c8e64a',
}: {
  height: number;
  width: number;
  depth: number;
  color?: string;
}) {
  const flagRef = useRef<THREE.Mesh>(null);
  const frameCount = useRef(0);

  useFrame((state) => {
    if (!flagRef.current) return;
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return;
    const t = state.clock.elapsedTime;
    flagRef.current.rotation.y = Math.sin(t * 2) * 0.2;
    flagRef.current.position.x = Math.sin(t * 3) * 0.2 + 2.5;
  });

  const poleHeight = 10;

  return (
    <group position={[width * 0.45, height, depth * 0.45]}>
      <mesh position={[0, poleHeight / 2, 0]}>
        <cylinderGeometry args={[0.25, 0.35, poleHeight, 6]} />
        <meshStandardMaterial color="#888899" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh ref={flagRef} position={[2.5, poleHeight - 1.5, 0]} geometry={_plane} scale={[5, 3, 1]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, poleHeight + 0.4, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#ccccdd" metalness={0.8} />
      </mesh>
    </group>
  );
});

// ─── Streak Flame ─────────────────────────────────────────────

export const StreakFlame = memo(function StreakFlame({
  height,
  width,
  depth,
  streakDays,
  color = '#c8e64a',
}: {
  height: number;
  width: number;
  depth: number;
  streakDays: number;
  color?: string;
}) {
  const fillPct = Math.min(1, streakDays <= 1 ? 0.1 : streakDays < 7 ? streakDays / 30 : streakDays < 14 ? 0.5 : streakDays < 30 ? 0.75 : 1);
  const stripH = height * fillPct;
  const intensity = streakDays >= 30 ? 5 : streakDays >= 14 ? 4 : streakDays >= 7 ? 3 : 2;
  const stripW = 1.2;

  const corners = useMemo(() => {
    const hw = width / 2;
    const hd = depth / 2;
    return [
      { x: -hw, z: -hd },
      { x: hw, z: -hd },
      { x: hw, z: hd },
      { x: -hw, z: hd },
    ];
  }, [width, depth]);

  return (
    <group>
      {corners.map((c, i) => (
        <mesh key={i} position={[c.x, stripH / 2, c.z]} geometry={_box} scale={[stripW, stripH, stripW]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} transparent opacity={0.85} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
});
