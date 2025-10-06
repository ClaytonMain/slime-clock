import { Plane, Ring } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
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

  const hoursOffset = new Date().getTimezoneOffset() / 60;

  useFrame(() => {
    if (
      hourGroupRef.current &&
      minuteGroupRef.current &&
      secondGroupRef.current
    ) {
      const date = Date.now();
      const hours = date / 36e5 - hoursOffset;
      const minutes = date / 6e4;
      const seconds = date / 1e3;
      hourGroupRef.current.rotation.z = -(hours * (Math.PI / 6));
      minuteGroupRef.current.rotation.z = -(minutes * (Math.PI / 30));
      secondGroupRef.current.rotation.z = -(seconds * (Math.PI / 30));
    }
  });

  return (
    <group
      position={[displayTextureWidth / 2, displayTextureHeight / 2, 0.0]}
      scale={(displayTextureHeight * clockSettings.size) / 100}
    >
      <Ring args={[0.475, 0.5, 64, 1]}>
        <meshBasicMaterial />
      </Ring>
      <group ref={hourGroupRef} position={[0, 0, 0]}>
        <Plane args={[0.06, 0.36]} position={[0, 0.18, 0]}>
          <meshBasicMaterial />
        </Plane>
      </group>
      <group ref={minuteGroupRef} position={[0, 0, 0]}>
        <Plane args={[0.04, 0.48]} position={[0, 0.24, 0]}>
          <meshBasicMaterial />
        </Plane>
      </group>
      <group ref={secondGroupRef} position={[0, 0, 0]}>
        <Plane args={[0.02, 0.49]} position={[0, 0.245, 0]}>
          <meshBasicMaterial />
        </Plane>
      </group>
    </group>
  );
}
