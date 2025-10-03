import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import useSlimeStore from "../../../stores/useSlimeStore";
import type {
  ClockDigitStyleValue,
  ClockHourFormatValue,
} from "../../../types/types";
import characterDataRobotoMono from "./character-data/character_data_roboto_mono.json";

function ClockDigit({
  index,
  position,
  digitPixelSize,
}: {
  index: number;
  position: [number, number, number];
  digitPixelSize: number;
}) {
  const clockSettings = useSlimeStore((state) => state.clockSettings);

  const pixelPositionsAttribute = useMemo(() => {
    const length = digitPixelSize * digitPixelSize;
    const attributes = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      attributes[i3 + 0] = (i % digitPixelSize) / digitPixelSize;
      attributes[i3 + 1] = Math.floor(i / digitPixelSize) / digitPixelSize;
      attributes[i3 + 2] = 0;
    }
    return attributes;
  }, [digitPixelSize]);

  return (
    <points position={[position[0] - 0.5, position[1] - 0.5, position[2]]}>
      <pointsMaterial
        attach="material"
        size={5}
        sizeAttenuation={false}
        color={"white"}
      />
      <bufferGeometry attach="geometry">
        <bufferAttribute
          args={[pixelPositionsAttribute, 3]}
          attach="attributes-position"
          array={pixelPositionsAttribute}
          count={pixelPositionsAttribute.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
    </points>
  );
}

export default function ClockDisplay() {
  const clockSettings = useSlimeStore((state) => state.clockSettings);
  const displayTextureWidth = useSlimeStore(
    (state) => state.simulationSettings.displayTextureWidth,
  );
  const displayTextureHeight = useSlimeStore(
    (state) => state.simulationSettings.displayTextureHeight,
  );

  useFrame((_, delta) => {
    const currentMinutes = Math.floor(Date.now() / 1000 / 60);
  });

  return (
    <>
      {clockSettings.clockStyle === "digital" && (
        <group
          position={[displayTextureWidth / 2, displayTextureHeight / 2, 0]}
          scale={[100, 100, 1]}
        >
          <ClockDigit index={0} position={[-0.5, 0.5, 0]} digitPixelSize={32} />
          <ClockDigit index={1} position={[0.5, 0.5, 0]} digitPixelSize={32} />
          <ClockDigit
            index={2}
            position={[-0.5, -0.5, 0]}
            digitPixelSize={32}
          />
          <ClockDigit index={3} position={[0.5, -0.5, 0]} digitPixelSize={32} />
        </group>
      )}
    </>
  );
}
