import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  ClockDigitStyleValue,
  ClockHourFormatValue,
} from "../../types/types";

const SCALE_FACTORS: Record<ClockDigitStyleValue, number> = {
  "7segment": 1.0,
  "14segment": 1.0,
  dotmatrix: 1.42,
  syne: 1.5,
  roboto: 1.3,
};

function getDigitFontUrl(style: ClockDigitStyleValue): string {
  switch (style) {
    case "7segment":
      return "../../fonts/DSEG7ClassicMini-Regular.woff";
    case "14segment":
      return "../../fonts/DSEG14Modern-Regular.woff";
    case "dotmatrix":
      return "../../fonts/5by7/5by7.ttf";
    case "syne":
      return "../../fonts/Syne_Mono/SyneMono-Regular.ttf";
    case "roboto":
      return "../../fonts/Roboto_Mono/RobotoMono-VariableFont_wght.ttf";
    // return "https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff";
    default:
      return "../../fonts/DSEG14Modern-Regular.woff";
  }
}

function getFormattedDigitTime({
  hourFormat,
  digitLayout = "horizontal",
  showSeconds = false,
  showAmPm = false,
  padHours = true,
}: {
  hourFormat: ClockHourFormatValue;
  digitLayout?: "horizontal" | "vertical";
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
  if (digitLayout === "horizontal") {
    return `${[hours, minutes, seconds].filter(Boolean).join(":")}${amPm}`;
  } else {
    return `${hours}\n${minutes}`;
  }
}

export default function ClockDisplay() {
  const clockSettings = useSlimeStore((state) => state.clockSettings);
  const [displayText1, setDisplayText1] = useState<string>(
    Math.random() > 0.99 &&
      clockSettings.digitStyle === "14segment" &&
      clockSettings.digitLayout === "horizontal"
      ? "ME:OW"
      : getFormattedDigitTime({
          hourFormat: clockSettings.hourFormat,
          // @ts-expect-error Should always be valid.
          digitLayout: clockSettings.digitLayout,
          showSeconds: false,
          showAmPm: false,
          padHours: clockSettings.padHours,
        }),
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
  const minutePingPongRef = useRef(Math.floor(Date.now() / 1000 / 60) % 2);

  useFrame((_, delta) => {
    const formattedTime = getFormattedDigitTime({
      hourFormat: clockSettings.hourFormat,
      // @ts-expect-error Should always be valid.
      digitLayout: clockSettings.digitLayout,
      showSeconds: false,
      showAmPm: false,
      padHours: clockSettings.padHours,
    });

    const currentMinutes = Math.floor(Date.now() / 1000 / 60);
    if (currentMinutes % 2 !== minutePingPongRef.current) {
      minutePingPongRef.current = currentMinutes % 2;
    }
    // TODO: Condense this.
    if (minutePingPongRef.current === 0) {
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
      setDisplayText1(formattedTime);
    } else if (minutePingPongRef.current === 1) {
      if (opacityRef.current > 0.0) {
        opacityRef.current -= delta * 0.1;
      } else if (opacityRef.current < 0.0) {
        opacityRef.current = 0.0;
      }

      if (material1Ref.current) {
        material1Ref.current.opacity = opacityRef.current;
      }
      if (material2Ref.current) {
        material2Ref.current.opacity = 1.0 - opacityRef.current;
      }

      if (displayText2 === formattedTime) return;
      setDisplayText2(formattedTime);
    }
  });

  useEffect(() => {
    setFontUrl(getDigitFontUrl(clockSettings.digitStyle));
  }, [clockSettings.digitStyle]);

  return (
    <>
      <Text
        position={[displayTextureWidth / 2, displayTextureHeight / 2, 0.0]}
        scale={
          ((displayTextureHeight * clockSettings.size) / 100) *
          SCALE_FACTORS[clockSettings.digitStyle]
        }
        font={fontUrl}
      >
        <meshBasicMaterial ref={material1Ref} transparent />
        {displayText1}
      </Text>
      <Text
        position={[displayTextureWidth / 2, displayTextureHeight / 2, -0.1]}
        scale={
          ((displayTextureHeight * clockSettings.size) / 100) *
          SCALE_FACTORS[clockSettings.digitStyle]
        }
        font={fontUrl}
      >
        <meshBasicMaterial ref={material2Ref} transparent />
        {displayText2}
      </Text>
    </>
  );
}
