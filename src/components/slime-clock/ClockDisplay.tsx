import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import useSlimeStore from "../../stores/useSlimeStore";

export default function ClockDisplay() {
  const [displayText1, setDisplayText1] = useState<string>("00:00");
  const [displayText2, setDisplayText2] = useState<string>(displayText1);
  const [fontUrl] = useState("fonts/DSEG14Modern-Regular.woff");
  // const [fontUrl] = useState("fonts/Doto.ttf");
  const simulationSettings = useSlimeStore((state) => state.simulationSettings);

  const material1Ref = useRef<THREE.ShaderMaterial>(null!);
  const material2Ref = useRef<THREE.ShaderMaterial>(null!);
  const opacityRef = useRef(0.0);

  useFrame((_, delta) => {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, "0");
    const minutes = String(currentTime.getMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    if (opacityRef.current < 1.0) {
      opacityRef.current += delta * 0.1;
    } else if (opacityRef.current > 1.0) {
      opacityRef.current = 1.0;
    }

    if (material1Ref.current) {
      material1Ref.current.opacity = opacityRef.current;
    }
    if (material2Ref.current) {
      material2Ref.current.opacity = 1.0 - opacityRef.current;
    }

    if (displayText1 === formattedTime) return;

    opacityRef.current = 0.0;

    setDisplayText2(displayText1);
    setDisplayText1(formattedTime);
  });

  return (
    <>
      <Text
        position={[
          simulationSettings.displayTextureWidth / 2,
          simulationSettings.displayTextureHeight / 2,
          0.0,
        ]}
        scale={550}
        font={fontUrl}
      >
        <meshBasicMaterial ref={material1Ref} transparent />
        {displayText1}
      </Text>
      <Text
        position={[
          simulationSettings.displayTextureWidth / 2,
          simulationSettings.displayTextureHeight / 2,
          -0.1,
        ]}
        scale={550}
        font={fontUrl}
      >
        <meshBasicMaterial ref={material2Ref} transparent />
        {displayText2}
      </Text>
    </>
  );
}
