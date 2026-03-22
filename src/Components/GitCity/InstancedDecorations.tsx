import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import type { CityDecoration } from '@/lib/gitCity/github';

const _dBox = new THREE.BoxGeometry(1, 1, 1);
const _dPlane = new THREE.PlaneGeometry(1, 1);

const _dMatrix = new THREE.Matrix4();
const _dPos = new THREE.Vector3();
const _dQuat = new THREE.Quaternion();
const _dScale = new THREE.Vector3();
const _dEuler = new THREE.Euler();
const _dLocalPos = new THREE.Vector3();
const _dPartQuat = new THREE.Quaternion();

interface InstancedDecorationsProps {
  items: CityDecoration[];
  roadMarkingColor: string;
  sidewalkColor: string;
}

export default function InstancedDecorations({
  items,
  roadMarkingColor,
  sidewalkColor,
}: InstancedDecorationsProps) {
  const trees = useMemo(() => items.filter((d) => d.type === 'tree'), [items]);
  const lamps = useMemo(() => items.filter((d) => d.type === 'streetLamp'), [items]);
  const cars = useMemo(() => items.filter((d) => d.type === 'car'), [items]);
  const roadMarkings = useMemo(() => items.filter((d) => d.type === 'roadMarking'), [items]);
  const benches = useMemo(() => items.filter((d) => d.type === 'bench'), [items]);
  const fountains = useMemo(() => items.filter((d) => d.type === 'fountain'), [items]);
  const sidewalks = useMemo(() => items.filter((d) => d.type === 'sidewalk'), [items]);

  const treeTrunkRef = useRef<THREE.InstancedMesh>(null);
  const treeCanopyRef = useRef<THREE.InstancedMesh>(null);
  const lampPoleRef = useRef<THREE.InstancedMesh>(null);
  const lampLightRef = useRef<THREE.InstancedMesh>(null);
  const carBodyRef = useRef<THREE.InstancedMesh>(null);
  const carCabinRef = useRef<THREE.InstancedMesh>(null);
  const roadMarkingRef = useRef<THREE.InstancedMesh>(null);
  const benchSeatRef = useRef<THREE.InstancedMesh>(null);
  const benchBackRef = useRef<THREE.InstancedMesh>(null);
  const benchLegLRef = useRef<THREE.InstancedMesh>(null);
  const benchLegRRef = useRef<THREE.InstancedMesh>(null);
  const fountainBasinRef = useRef<THREE.InstancedMesh>(null);
  const fountainMidRef = useRef<THREE.InstancedMesh>(null);
  const fountainUpperRef = useRef<THREE.InstancedMesh>(null);
  const fountainWaterRef = useRef<THREE.InstancedMesh>(null);
  const sidewalkRef = useRef<THREE.InstancedMesh>(null);

  const geos = useMemo(
    () => ({
      treeTrunk: new THREE.CylinderGeometry(1, 1.3, 1, 6),
      treeCanopy: new THREE.ConeGeometry(1, 1, 8),
      lampPole: new THREE.CylinderGeometry(0.3, 0.45, 18, 6),
      lampLight: new THREE.BoxGeometry(1.5, 0.8, 1.5),
      carBody: new THREE.BoxGeometry(8, 2.5, 3.5),
      carCabin: new THREE.BoxGeometry(5, 2, 3.2),
      roadMarking: new THREE.PlaneGeometry(1, 1),
      fountainBasin: new THREE.CylinderGeometry(8, 8.5, 2.4, 16),
      fountainMid: new THREE.CylinderGeometry(5, 5.5, 2, 12),
      fountainUpper: new THREE.CylinderGeometry(2.5, 3.2, 2, 10),
      fountainWater: new THREE.CylinderGeometry(1.8, 2, 1.2, 10),
    }),
    []
  );

  const mats = useMemo(
    () => ({
      treeTrunk: new THREE.MeshStandardMaterial({
        color: '#5a3a1e',
        emissive: '#5a3a1e',
        emissiveIntensity: 0.35,
      }),
      treeCanopy: new THREE.MeshStandardMaterial({
        color: '#2d5a1e',
        emissive: '#2d5a1e',
        emissiveIntensity: 0.45,
      }),
      lampPole: new THREE.MeshStandardMaterial({
        color: '#4a4a4a',
        emissive: '#4a4a4a',
        emissiveIntensity: 0.3,
      }),
      lampLight: new THREE.MeshStandardMaterial({
        color: '#f0d870',
        emissive: '#f0d870',
        emissiveIntensity: 2.0,
        toneMapped: false,
      }),
      carBody: new THREE.MeshStandardMaterial({
        color: '#808080',
        emissive: '#808080',
        emissiveIntensity: 0.2,
      }),
      carCabin: new THREE.MeshStandardMaterial({
        color: '#808080',
        emissive: '#808080',
        emissiveIntensity: 0.2,
      }),
      roadMarking: new THREE.MeshStandardMaterial({
        color: roadMarkingColor,
        emissive: roadMarkingColor,
        emissiveIntensity: 0.8,
      }),
      benchWood: new THREE.MeshStandardMaterial({
        color: '#6b4226',
        emissive: '#6b4226',
        emissiveIntensity: 0.3,
      }),
      benchMetal: new THREE.MeshStandardMaterial({
        color: '#3a3a3a',
        emissive: '#3a3a3a',
        emissiveIntensity: 0.3,
      }),
      fountainStone1: new THREE.MeshStandardMaterial({
        color: '#707070',
        emissive: '#707070',
        emissiveIntensity: 0.25,
      }),
      fountainStone2: new THREE.MeshStandardMaterial({
        color: '#808080',
        emissive: '#808080',
        emissiveIntensity: 0.25,
      }),
      fountainStone3: new THREE.MeshStandardMaterial({
        color: '#909090',
        emissive: '#909090',
        emissiveIntensity: 0.25,
      }),
      fountainWater: new THREE.MeshStandardMaterial({
        color: '#4090d0',
        emissive: '#2060a0',
        emissiveIntensity: 2.0,
        toneMapped: false,
        transparent: true,
        opacity: 0.7,
      }),
      sidewalk: new THREE.MeshStandardMaterial({
        color: sidewalkColor,
        emissive: sidewalkColor,
        emissiveIntensity: 0.2,
        roughness: 0.85,
      }),
    }),
    [roadMarkingColor, sidewalkColor]
  );

  useEffect(() => {
    if (!treeTrunkRef.current || !treeCanopyRef.current || trees.length === 0) return;
    const greens = [
      new THREE.Color('#2d5a1e'),
      new THREE.Color('#1e6b2e'),
      new THREE.Color('#3a7a2a'),
    ];

    for (let i = 0; i < trees.length; i++) {
      const d = trees[i];
      const trunkH = 8 + d.variant * 1.5;
      const canopyH = 10 + d.variant * 2;
      const canopyR = 6 + d.variant * 0.8;

      _dQuat.identity();
      _dPos.set(d.position[0], d.position[1] + trunkH / 2, d.position[2]);
      _dScale.set(1, trunkH, 1);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      treeTrunkRef.current.setMatrixAt(i, _dMatrix);

      _dPos.set(
        d.position[0],
        d.position[1] + trunkH + canopyH / 2 - 1,
        d.position[2]
      );
      _dScale.set(canopyR, canopyH, canopyR);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      treeCanopyRef.current.setMatrixAt(i, _dMatrix);
      treeCanopyRef.current.setColorAt!(i, greens[d.variant % greens.length]);
    }

    treeTrunkRef.current.instanceMatrix.needsUpdate = true;
    treeCanopyRef.current.instanceMatrix.needsUpdate = true;
    if (treeCanopyRef.current.instanceColor)
      treeCanopyRef.current.instanceColor.needsUpdate = true;
  }, [trees]);

  useEffect(() => {
    if (!lampPoleRef.current || !lampLightRef.current || lamps.length === 0) return;
    _dQuat.identity();
    _dScale.set(1, 1, 1);

    for (let i = 0; i < lamps.length; i++) {
      const d = lamps[i];
      _dPos.set(d.position[0], d.position[1] + 9, d.position[2]);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      lampPoleRef.current.setMatrixAt(i, _dMatrix);

      _dPos.set(d.position[0], d.position[1] + 18.5, d.position[2]);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      lampLightRef.current.setMatrixAt(i, _dMatrix);
    }

    lampPoleRef.current.instanceMatrix.needsUpdate = true;
    lampLightRef.current.instanceMatrix.needsUpdate = true;
  }, [lamps]);

  useEffect(() => {
    if (!carBodyRef.current || !carCabinRef.current || cars.length === 0) return;
    const carColors = [
      new THREE.Color('#c03030'),
      new THREE.Color('#3050a0'),
      new THREE.Color('#d0d0d0'),
      new THREE.Color('#2a2a2a'),
    ];

    for (let i = 0; i < cars.length; i++) {
      const d = cars[i];
      _dEuler.set(0, d.rotation, 0);
      _dQuat.setFromEuler(_dEuler);
      _dScale.set(1, 1, 1);

      _dPos.set(d.position[0], d.position[1] + 1.25, d.position[2]);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      carBodyRef.current.setMatrixAt(i, _dMatrix);
      carBodyRef.current.setColorAt!(i, carColors[d.variant % carColors.length]);

      _dPos.set(d.position[0], d.position[1] + 3.1, d.position[2]);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      carCabinRef.current.setMatrixAt(i, _dMatrix);
      carCabinRef.current.setColorAt!(i, carColors[d.variant % carColors.length]);
    }

    carBodyRef.current.instanceMatrix.needsUpdate = true;
    carCabinRef.current.instanceMatrix.needsUpdate = true;
    if (carBodyRef.current.instanceColor)
      carBodyRef.current.instanceColor.needsUpdate = true;
    if (carCabinRef.current.instanceColor)
      carCabinRef.current.instanceColor.needsUpdate = true;
  }, [cars]);

  useEffect(() => {
    if (!roadMarkingRef.current || roadMarkings.length === 0) return;

    for (let i = 0; i < roadMarkings.length; i++) {
      const d = roadMarkings[i];
      const w = d.size?.[0] ?? 2;
      const h = d.size?.[1] ?? 6;

      _dEuler.set(-Math.PI / 2, d.rotation, 0);
      _dQuat.setFromEuler(_dEuler);
      _dPos.set(d.position[0], d.position[1], d.position[2]);
      _dScale.set(w, h, 1);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      roadMarkingRef.current.setMatrixAt(i, _dMatrix);
    }

    roadMarkingRef.current.instanceMatrix.needsUpdate = true;
  }, [roadMarkings]);

  useEffect(() => {
    if (
      !benchSeatRef.current ||
      !benchBackRef.current ||
      !benchLegLRef.current ||
      !benchLegRRef.current ||
      benches.length === 0
    )
      return;

    for (let i = 0; i < benches.length; i++) {
      const d = benches[i];
      _dEuler.set(0, d.rotation, 0);
      _dQuat.setFromEuler(_dEuler);

      _dLocalPos.set(0, 0.9, 0).applyQuaternion(_dQuat);
      _dPos.set(
        d.position[0] + _dLocalPos.x,
        d.position[1] + _dLocalPos.y,
        d.position[2] + _dLocalPos.z
      );
      _dScale.set(5, 0.3, 1.5);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      benchSeatRef.current.setMatrixAt(i, _dMatrix);

      _dLocalPos.set(0, 1.7, -0.65).applyQuaternion(_dQuat);
      _dPos.set(
        d.position[0] + _dLocalPos.x,
        d.position[1] + _dLocalPos.y,
        d.position[2] + _dLocalPos.z
      );
      _dEuler.set(0.15, 0, 0);
      _dPartQuat.setFromEuler(_dEuler);
      _dPartQuat.premultiply(_dQuat);
      _dScale.set(5, 1.3, 0.2);
      _dMatrix.compose(_dPos, _dPartQuat, _dScale);
      benchBackRef.current.setMatrixAt(i, _dMatrix);

      _dEuler.set(0, d.rotation, 0);
      _dQuat.setFromEuler(_dEuler);
      _dLocalPos.set(-2, 0.45, 0).applyQuaternion(_dQuat);
      _dPos.set(
        d.position[0] + _dLocalPos.x,
        d.position[1] + _dLocalPos.y,
        d.position[2] + _dLocalPos.z
      );
      _dScale.set(0.3, 0.9, 1.2);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      benchLegLRef.current.setMatrixAt(i, _dMatrix);

      _dLocalPos.set(2, 0.45, 0).applyQuaternion(_dQuat);
      _dPos.set(
        d.position[0] + _dLocalPos.x,
        d.position[1] + _dLocalPos.y,
        d.position[2] + _dLocalPos.z
      );
      _dScale.set(0.3, 0.9, 1.2);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      benchLegRRef.current.setMatrixAt(i, _dMatrix);
    }

    benchSeatRef.current.instanceMatrix.needsUpdate = true;
    benchBackRef.current.instanceMatrix.needsUpdate = true;
    benchLegLRef.current.instanceMatrix.needsUpdate = true;
    benchLegRRef.current.instanceMatrix.needsUpdate = true;
  }, [benches]);

  useEffect(() => {
    if (
      !fountainBasinRef.current ||
      !fountainMidRef.current ||
      !fountainUpperRef.current ||
      !fountainWaterRef.current ||
      fountains.length === 0
    )
      return;
    _dQuat.identity();
    _dScale.set(1, 1, 1);

    for (let i = 0; i < fountains.length; i++) {
      const d = fountains[i];

      _dPos.set(d.position[0], d.position[1] + 1.2, d.position[2]);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      fountainBasinRef.current.setMatrixAt(i, _dMatrix);

      _dPos.set(d.position[0], d.position[1] + 3.4, d.position[2]);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      fountainMidRef.current.setMatrixAt(i, _dMatrix);

      _dPos.set(d.position[0], d.position[1] + 5.6, d.position[2]);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      fountainUpperRef.current.setMatrixAt(i, _dMatrix);

      _dPos.set(d.position[0], d.position[1] + 7.2, d.position[2]);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      fountainWaterRef.current.setMatrixAt(i, _dMatrix);
    }

    fountainBasinRef.current.instanceMatrix.needsUpdate = true;
    fountainMidRef.current.instanceMatrix.needsUpdate = true;
    fountainUpperRef.current.instanceMatrix.needsUpdate = true;
    fountainWaterRef.current.instanceMatrix.needsUpdate = true;
  }, [fountains]);

  useEffect(() => {
    if (!sidewalkRef.current || sidewalks.length === 0) return;

    for (let i = 0; i < sidewalks.length; i++) {
      const d = sidewalks[i];
      const w = d.size?.[0] ?? 1;
      const h = d.size?.[1] ?? 1;

      _dEuler.set(-Math.PI / 2, 0, 0);
      _dQuat.setFromEuler(_dEuler);
      _dPos.set(d.position[0], d.position[1], d.position[2]);
      _dScale.set(w, h, 1);
      _dMatrix.compose(_dPos, _dQuat, _dScale);
      sidewalkRef.current.setMatrixAt(i, _dMatrix);
    }

    sidewalkRef.current.instanceMatrix.needsUpdate = true;
  }, [sidewalks]);

  useEffect(
    () => () => {
      Object.values(geos).forEach((g) => g.dispose());
      Object.values(mats).forEach((m) => m.dispose());
    },
    [geos, mats]
  );

  return (
    <>
      {trees.length > 0 && (
        <>
          <instancedMesh
            ref={treeTrunkRef}
            args={[geos.treeTrunk, mats.treeTrunk, trees.length]}
          />
          <instancedMesh
            ref={treeCanopyRef}
            args={[geos.treeCanopy, mats.treeCanopy, trees.length]}
          />
        </>
      )}
      {lamps.length > 0 && (
        <>
          <instancedMesh
            ref={lampPoleRef}
            args={[geos.lampPole, mats.lampPole, lamps.length]}
          />
          <instancedMesh
            ref={lampLightRef}
            args={[geos.lampLight, mats.lampLight, lamps.length]}
          />
        </>
      )}
      {cars.length > 0 && (
        <>
          <instancedMesh
            ref={carBodyRef}
            args={[geos.carBody, mats.carBody, cars.length]}
          />
          <instancedMesh
            ref={carCabinRef}
            args={[geos.carCabin, mats.carCabin, cars.length]}
          />
        </>
      )}
      {roadMarkings.length > 0 && (
        <instancedMesh
          ref={roadMarkingRef}
          args={[geos.roadMarking, mats.roadMarking, roadMarkings.length]}
        />
      )}
      {benches.length > 0 && (
        <>
          <instancedMesh
            ref={benchSeatRef}
            args={[_dBox, mats.benchWood, benches.length]}
          />
          <instancedMesh
            ref={benchBackRef}
            args={[_dBox, mats.benchWood, benches.length]}
          />
          <instancedMesh
            ref={benchLegLRef}
            args={[_dBox, mats.benchMetal, benches.length]}
          />
          <instancedMesh
            ref={benchLegRRef}
            args={[_dBox, mats.benchMetal, benches.length]}
          />
        </>
      )}
      {fountains.length > 0 && (
        <>
          <instancedMesh
            ref={fountainBasinRef}
            args={[geos.fountainBasin, mats.fountainStone1, fountains.length]}
          />
          <instancedMesh
            ref={fountainMidRef}
            args={[geos.fountainMid, mats.fountainStone2, fountains.length]}
          />
          <instancedMesh
            ref={fountainUpperRef}
            args={[geos.fountainUpper, mats.fountainStone3, fountains.length]}
          />
          <instancedMesh
            ref={fountainWaterRef}
            args={[geos.fountainWater, mats.fountainWater, fountains.length]}
          />
        </>
      )}
      {sidewalks.length > 0 && (
        <instancedMesh
          ref={sidewalkRef}
          args={[_dPlane, mats.sidewalk, sidewalks.length]}
        />
      )}
    </>
  );
}
