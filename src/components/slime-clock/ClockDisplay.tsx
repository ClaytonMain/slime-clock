import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  ClockDigitStyleValue,
  ClockHourFormatValue,
} from "../../types/types";

function getDigitFontUrl(style: ClockDigitStyleValue): string {
  switch (style) {
    case "7segment":
      return "fonts/DSEG7ClassicMini-Regular.woff";
    case "14segment":
      return "fonts/DSEG14Modern-Regular.woff";
    case "dotmatrix":
      return "fonts/Doto.ttf";
    default:
      return "fonts/DSEG14Modern-Regular.woff";
  }
}

function getFormattedDigitTime({
  hourFormat,
  showSeconds = false,
  showAmPm = false,
  padHours = true,
}: {
  hourFormat: ClockHourFormatValue;
  showSeconds?: boolean;
  showAmPm?: boolean;
  padHours?: boolean;
}): string {
  const currentTime = new Date();
  const nHours = currentTime.getHours() % (hourFormat === "24h" ? 24 : 12);
  const hours = padHours ? String(nHours).padStart(2, "0") : String(nHours);
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");
  const seconds = showSeconds
    ? String(currentTime.getSeconds()).padStart(2, "0")
    : null;
  const amPm =
    showAmPm && hourFormat === "12h"
      ? currentTime.getHours() >= 12
        ? "PM"
        : "AM"
      : "";
  return `${[hours, minutes, seconds].filter(Boolean).join(":")}${amPm}`;
}

export default function ClockDisplay() {
  const clockSettings = useSlimeStore((state) => state.clockSettings);
  const [displayText1, setDisplayText1] = useState<string>(
    Math.random() > 0.99 && clockSettings.digitStyle === "14segment"
      ? "ME:OW"
      : "00:00",
  );
  const [displayText2, setDisplayText2] = useState<string>(displayText1);
  const [fontUrl, setFontUrl] = useState(
    getDigitFontUrl(clockSettings.digitStyle),
  );
  const displayTextureWidth = useSlimeStore(
    (state) => state.simulationSettings.displayTextureWidth,
  );
  const displayTextureHeight = useSlimeStore(
    (state) => state.simulationSettings.displayTextureHeight,
  );

  const material1Ref = useRef<THREE.ShaderMaterial>(null!);
  const material2Ref = useRef<THREE.ShaderMaterial>(null!);
  const opacityRef = useRef(0.0);

  // PLASMODIMETER

  useFrame((_, delta) => {
    const formattedTime = getFormattedDigitTime({
      hourFormat: clockSettings.hourFormat,
      showSeconds: false,
      showAmPm: true,
      padHours: true,
    });

    // TODO: ping pong between displayText1 and displayText2 to make the fade effect smoother.
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

  useEffect(() => {
    setFontUrl(getDigitFontUrl(clockSettings.digitStyle));
  }, [clockSettings.digitStyle]);

  return (
    <>
      <Text
        position={[displayTextureWidth / 2, displayTextureHeight / 2, 0.0]}
        scale={(displayTextureHeight * clockSettings.size) / 100}
        font={fontUrl}
      >
        <meshBasicMaterial ref={material1Ref} transparent />
        {displayText1}
      </Text>
      <Text
        position={[displayTextureWidth / 2, displayTextureHeight / 2, -0.1]}
        scale={(displayTextureHeight * clockSettings.size) / 100}
        font={fontUrl}
      >
        <meshBasicMaterial ref={material2Ref} transparent />
        {displayText2}
      </Text>
    </>
  );
}
