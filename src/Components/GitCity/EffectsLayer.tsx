import { useState, useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { CityBuilding } from '@/lib/gitCity/github';
import type { BuildingColors } from './types';
import { ClaimedGlow, BuildingItemEffects } from './Building3D';
import { StreakFlame, NeonOutline, ParticleAura, SpotlightEffect } from './BuildingEffects';

const ActiveBuildingEffects = memo(function ActiveBuildingEffects({
  building,
  accentColor,
  isFocused,
  isDimmed,
  isGhostTarget,
  ghostEffectId,
}: {
  building: CityBuilding;
  accentColor: string;
  isFocused: boolean;
  isDimmed: boolean;
  isGhostTarget: boolean;
  ghostEffectId: number;
}) {
  return (
    <group position={[building.position[0], 0, building.position[2]]} visible={!isDimmed}>
      {building.claimed && (
        <ClaimedGlow
          height={building.height}
          width={building.width}
          depth={building.depth}
          color={accentColor}
        />
      )}
      <BuildingItemEffects building={building} accentColor={accentColor} focused={isFocused} />
      {isGhostTarget &&
        (ghostEffectId === 0 ? (
          <NeonOutline width={building.width} height={building.height} depth={building.depth} color={accentColor} />
        ) : ghostEffectId === 1 ? (
          <ParticleAura width={building.width} height={building.height} depth={building.depth} color={accentColor} />
        ) : (
          <SpotlightEffect height={building.height} width={building.width} depth={building.depth} color={accentColor} />
        ))}
      {building.app_streak > 0 && (
        <StreakFlame
          height={building.height}
          width={building.width}
          depth={building.depth}
          streakDays={building.app_streak}
          color={accentColor}
        />
      )}
    </group>
  );
});

interface GridIndex {
  cells: Map<string, number[]>;
  cellSize: number;
}

function querySpatialGrid(grid: GridIndex, x: number, z: number, radius: number): number[] {
  const result: number[] = [];
  const minCx = Math.floor((x - radius) / grid.cellSize);
  const maxCx = Math.floor((x + radius) / grid.cellSize);
  const minCz = Math.floor((z - radius) / grid.cellSize);
  const maxCz = Math.floor((z + radius) / grid.cellSize);
  for (let cx = minCx; cx <= maxCx; cx++) {
    for (let cz = minCz; cz <= maxCz; cz++) {
      const arr = grid.cells.get(`${cx},${cz}`);
      if (arr) for (let i = 0; i < arr.length; i++) result.push(arr[i]);
    }
  }
  return result;
}

const EFFECTS_RADIUS = 300;
const EFFECTS_RADIUS_HYSTERESIS = 380;
const EFFECTS_UPDATE_INTERVAL = 0.3;
const MAX_ACTIVE_EFFECTS = 25;

interface EffectsLayerProps {
  buildings: CityBuilding[];
  grid: GridIndex;
  colors: BuildingColors;
  accentColor: string;
  focusedBuilding?: string | null;
  focusedBuildingB?: string | null;
  hideEffectsFor?: string | null;
  introMode?: boolean;
  flyMode?: boolean;
  ghostPreviewLogin?: string | null;
}

export default function EffectsLayer({
  buildings,
  grid,
  accentColor,
  focusedBuilding,
  focusedBuildingB,
  hideEffectsFor,
  introMode,
  flyMode,
  ghostPreviewLogin,
}: EffectsLayerProps) {
  const lastUpdate = useRef(-1);
  const activeSetRef = useRef(new Set<number>());
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const prevCamPos = useRef<[number, number]>([0, 0]);
  const prevCamTime = useRef(0);
  const smoothVel = useRef<[number, number]>([0, 0]);

  const focusedLower = focusedBuilding?.toLowerCase() ?? null;
  const focusedBLower = focusedBuildingB?.toLowerCase() ?? null;
  const hideLower = hideEffectsFor?.toLowerCase() ?? null;
  const loginToIdx = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 0; i < buildings.length; i++) map.set(buildings[i].login.toLowerCase(), i);
    return map;
  }, [buildings]);

  useFrame(({ camera, clock }) => {
    if (introMode) return;

    const elapsed = clock.elapsedTime;
    const interval = flyMode ? 0.15 : EFFECTS_UPDATE_INTERVAL;
    if (elapsed - lastUpdate.current < interval) return;
    lastUpdate.current = elapsed;

    const rawCx = camera.position.x;
    const rawCz = camera.position.z;
    let cx = rawCx;
    let cz = rawCz;

    const dt = elapsed - prevCamTime.current;
    if (flyMode && dt > 0.01) {
      const vxRaw = (rawCx - prevCamPos.current[0]) / dt;
      const vzRaw = (rawCz - prevCamPos.current[1]) / dt;
      const SMOOTH = 0.3;
      smoothVel.current[0] += (vxRaw - smoothVel.current[0]) * SMOOTH;
      smoothVel.current[1] += (vzRaw - smoothVel.current[1]) * SMOOTH;
      const LOOK_AHEAD_SECS = 2.0;
      cx += smoothVel.current[0] * LOOK_AHEAD_SECS;
      cz += smoothVel.current[1] * LOOK_AHEAD_SECS;
    }
    prevCamPos.current[0] = rawCx;
    prevCamPos.current[1] = rawCz;
    prevCamTime.current = elapsed;

    const flyHyst = flyMode ? 450 : EFFECTS_RADIUS_HYSTERESIS;
    const candidates = querySpatialGrid(grid, cx, cz, flyHyst);

    const nearSq = EFFECTS_RADIUS * EFFECTS_RADIUS;
    const farSq = flyHyst * flyHyst;
    const newSet = new Set<number>();

    for (let c = 0; c < candidates.length; c++) {
      const idx = candidates[c];
      const b = buildings[idx];
      const hasEffects =
        b.claimed ||
        (b.owned_items && b.owned_items.length > 0) ||
        b.app_streak > 0 ||
        b.rabbit_completed;
      if (!hasEffects) continue;

      const dx = cx - b.position[0];
      const dz = cz - b.position[2];
      const distSq = dx * dx + dz * dz;
      const alreadyActive = activeSetRef.current.has(idx);
      if (distSq < nearSq || (alreadyActive && distSq < farSq)) newSet.add(idx);
    }

    if (focusedLower) {
      const fi = loginToIdx.get(focusedLower);
      if (fi !== undefined) newSet.add(fi);
    }
    if (focusedBLower) {
      const fi = loginToIdx.get(focusedBLower);
      if (fi !== undefined) newSet.add(fi);
    }

    if (newSet.size > MAX_ACTIVE_EFFECTS) {
      const withDist = Array.from(newSet).map((idx) => {
        const b = buildings[idx];
        const dx = cx - b.position[0];
        const dz = cz - b.position[2];
        return { idx, distSq: dx * dx + dz * dz };
      });
      withDist.sort((a, b) => a.distSq - b.distSq);
      newSet.clear();
      for (let i = 0; i < MAX_ACTIVE_EFFECTS && i < withDist.length; i++) newSet.add(withDist[i].idx);
      if (focusedLower) {
        const fi = loginToIdx.get(focusedLower);
        if (fi !== undefined) newSet.add(fi);
      }
      if (focusedBLower) {
        const fi = loginToIdx.get(focusedBLower);
        if (fi !== undefined) newSet.add(fi);
      }
    }

    let changed = newSet.size !== activeSetRef.current.size;
    if (!changed) {
      for (const idx of newSet) {
        if (!activeSetRef.current.has(idx)) {
          changed = true;
          break;
        }
      }
    }
    if (changed) {
      activeSetRef.current = newSet;
      setActiveIndices(Array.from(newSet));
    }
  });

  const ghostLower = ghostPreviewLogin?.toLowerCase() ?? null;
  const ghostIdx = ghostLower ? loginToIdx.get(ghostLower) : undefined;
  const ghostBuilding = ghostIdx != null ? buildings[ghostIdx] : null;
  const ghostEffectId = useMemo(() => {
    if (!ghostLower) return 0;
    let h = 0;
    for (let i = 0; i < ghostLower.length; i++) h = (h * 31 + ghostLower.charCodeAt(i)) | 0;
    return Math.abs(h) % 3;
  }, [ghostLower]);

  if (introMode) return null;

  return (
    <>
      {activeIndices.map((idx) => {
        const b = buildings[idx];
        if (!b) return null;
        const loginLower = b.login.toLowerCase();
        if (hideLower === loginLower) return null;
        const isFocused = focusedLower === loginLower || focusedBLower === loginLower;
        const isDimmed = !!focusedLower && !isFocused;
        const isGhostTarget = ghostLower === loginLower;
        return (
          <ActiveBuildingEffects
            key={b.login}
            building={b}
            accentColor={accentColor}
            isFocused={isFocused}
            isDimmed={isDimmed}
            isGhostTarget={isGhostTarget}
            ghostEffectId={ghostEffectId}
          />
        );
      })}
      {ghostBuilding && ghostIdx != null && !activeIndices.includes(ghostIdx) && (
        <group position={[ghostBuilding.position[0], 0, ghostBuilding.position[2]]}>
          {ghostEffectId === 0 ? (
            <NeonOutline width={ghostBuilding.width} height={ghostBuilding.height} depth={ghostBuilding.depth} color={accentColor} />
          ) : ghostEffectId === 1 ? (
            <ParticleAura width={ghostBuilding.width} height={ghostBuilding.height} depth={ghostBuilding.depth} color={accentColor} />
          ) : (
            <SpotlightEffect height={ghostBuilding.height} width={ghostBuilding.width} depth={ghostBuilding.depth} color={accentColor} />
          )}
        </group>
      )}
    </>
  );
}
