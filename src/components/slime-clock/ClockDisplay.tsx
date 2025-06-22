import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";
import useSlimeStore from "../../stores/useSlimeStore";

export default function ClockDisplay() {
  const [displayText, setDisplayText] = useState("00:00");
  const [fontUrl] = useState("fonts/DSEG7ClassicMini-Regular.woff");
  // const [fontUrl] = useState("fonts/Doto.ttf");
  const simulationSettings = useSlimeStore((state) => state.simulationSettings);
  const textMaterial = new THREE.MeshBasicMaterial();

  useFrame(() => {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, "0");
    const minutes = String(currentTime.getMinutes()).padStart(2, "0");
    // const seconds = String(currentTime.getSeconds()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    if (displayText === formattedTime) return; // Avoid unnecessary updates
    setDisplayText(formattedTime);
  });

  return (
    <>
      <Text
        position={[
          simulationSettings.displayTextureWidth / 2,
          simulationSettings.displayTextureHeight / 2,
          0.0,
        ]}
        scale={600}
        material={textMaterial}
        font={fontUrl}
      >
        {displayText}
      </Text>
    </>
  );
}
