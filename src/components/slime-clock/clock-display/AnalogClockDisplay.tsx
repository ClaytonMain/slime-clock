import { Circle, Ring } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { DateTime } from "luxon";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import useSlimeStore from "../../../stores/useSlimeStore";

export default function AnalogClockDisplay() {
  const clockSettings = useSlimeStore((state) => state.clockSettings);
  const displayTextureWidth = useSlimeStore(
    (state) => state.simulationSettings.displayTextureWidth,
  );
  const displayTextureHeight = useSlimeStore(
    (state) => state.simulationSettings.displayTextureHeight,
  );
  const hourGroupRef = useRef<THREE.Group>(null!);
  const minuteGroupRef = useRef<THREE.Group>(null!);
  const secondGroupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (
      hourGroupRef.current &&
      minuteGroupRef.current &&
      secondGroupRef.current
    ) {
      const date = DateTime.now()
        .setZone(clockSettings.timeZone)
        .plus({ milliseconds: clockSettings.timeOffsetTotal });
      const hours =
        (date.hour % 12) +
        date.minute / 60 +
        date.second / 3600 +
        date.millisecond / 3.6e6;
      const minutes = date.minute + date.second / 60 + date.millisecond / 3.6e5;
      const seconds = date.second + date.millisecond / 1e3;
      hourGroupRef.current.rotation.z = -(hours * (Math.PI / 6));
      minuteGroupRef.current.rotation.z = -(minutes * (Math.PI / 30));
      secondGroupRef.current.rotation.z = -(seconds * (Math.PI / 30));
    }
  });

  const material = useMemo(() => new THREE.MeshBasicMaterial(), []);
  const geometry = useMemo(() => new THREE.PlaneGeometry(), []);

  return (
    <group
      position={[
        Math.floor(displayTextureWidth / 4) / 2,
        Math.floor(displayTextureHeight / 4) / 2,
        0.0,
      ]}
      scale={
        (Math.floor(displayTextureHeight / 4) * clockSettings.analogClockSize) /
        100
      }
    >
      <Ring args={[0.475, 0.5, 64, 1]} material={material} />
      <group ref={hourGroupRef} position={[0, 0, 0]}>
        <mesh
          geometry={geometry}
          material={material}
          scale={[0.04, 0.45, 1]}
          position={[0, 0.15, 0]}
        />
      </group>
      <group ref={minuteGroupRef} position={[0, 0, 0]}>
        <mesh
          geometry={geometry}
          material={material}
          scale={[0.04, 0.55, 1]}
          position={[0, 0.2, 0]}
        />
      </group>
      <group ref={secondGroupRef} position={[0, 0, 0]}>
        <mesh
          geometry={geometry}
          material={material}
          scale={[0.02, 0.55, 1]}
          position={[0, 0.2, 0]}
        />
      </group>
      <Circle args={[0.04, 64]} material={material} />
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        const factor = index % 3 === 0 ? 0 : 0.025;
        const x = Math.sin(angle) * (0.44 + factor);
        const y = Math.cos(angle) * (0.44 + factor);
        return (
          <mesh
            key={index}
            geometry={geometry}
            material={material}
            position={[x, y, 0]}
            scale={[0.04, 0.08 * (index % 3 === 0 ? 1 : 0.7), 1]}
            rotation-z={-angle}
          />
        );
      })}
    </group>
  );
}
