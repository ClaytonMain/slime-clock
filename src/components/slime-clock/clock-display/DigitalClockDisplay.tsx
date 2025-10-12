import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useSlimeStore from "../../../stores/useSlimeStore";
import type { ClockDigitStyleValue, ClockSettings } from "../../../types/types";

const SCALE_FACTORS: Record<ClockDigitStyleValue, number> = {
  "7segment": 1.0,
  "14segment": 1.0,
  dm80: 1.3,
  roboto: 1.3,
  her: 1.0,
};

function getDigitFontUrl(style: ClockDigitStyleValue): string {
  switch (style) {
    case "7segment":
      return "./fonts/fonts-DSEG_v046/DSEG7-Classic/DSEG7Classic-Regular.woff";
    case "14segment":
      return "./fonts/fonts-DSEG_v046/DSEG14-Classic/DSEG14Classic-Regular.woff";
    case "dm80":
      return "./fonts/dm_80/DM-80-Regular.woff";
    case "roboto":
      return "./fonts/Roboto_Mono/static/RobotoMono-Regular.ttf";
    // return "https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff";
    case "her":
      return "./fonts/fonts-DSEG_v046/DSEG7-7SEGG-CHAN/DSEG7SEGGCHAN-Regular.woff";
    default:
      return "./fonts/DSEG14Modern-Regular.woff";
  }
}

function getFormattedDigitTime(
  clockSettings: ClockSettings,
  getClockDateTime: () => DateTime,
): string {
  const date = getClockDateTime();
  const nHours =
    date.hour % (clockSettings.hourFormat === "24h" ? 24 : 12) || 12;
  const hours = clockSettings.padHours
    ? String(nHours).padStart(2, "0")
    : String(nHours).padStart(2, " ");
  const minutes = String(date.minute).padStart(2, "0");
  const seconds = clockSettings.showDigitSeconds
    ? String(date.second).padStart(2, "0")
    : null;
  const amPm =
    clockSettings.showDigitAmPm && clockSettings.hourFormat === "12h"
      ? date.hour >= 12
        ? "PM"
        : "AM"
      : "";
  if (clockSettings.digitLayout === "horizontal") {
    return `${[hours, minutes, seconds].filter(Boolean).join(":")}${amPm}`;
  } else {
    return `${hours}\n${minutes}`;
  }
}

export default function DigitalClockDisplay() {
  const clockSettings = useSlimeStore((state) => state.clockSettings);
  const getClockDateTime = useSlimeStore((state) => state.getClockDateTime);
  const [previousDisplayText, setPreviousDisplayText] = useState<string>(
    getFormattedDigitTime(clockSettings, getClockDateTime) || "",
  );
  const [displayText1, setDisplayText1] = useState<string>(previousDisplayText);
  const [displayText2, setDisplayText2] = useState<string>(previousDisplayText);
  const [fontUrl, setFontUrl] = useState(
    getDigitFontUrl(clockSettings.digitStyle),
  );
  const displayTextureWidth = useSlimeStore(
    (state) => state.simulationSettings.displayTextureWidth,
  );
  const displayTextureHeight = useSlimeStore(
    (state) => state.simulationSettings.displayTextureHeight,
  );

  const clockDigitStyle = useSlimeStore(
    (state) => state.clockSettings.digitStyle,
  );
  useEffect(() => {
    setFontUrl(getDigitFontUrl(clockDigitStyle));
  }, [clockDigitStyle]);

  const materialRef01 = useRef<THREE.ShaderMaterial>(null!);
  const materialRef02 = useRef<THREE.ShaderMaterial>(null!);
  const opacityRef = useRef(0.0);
  const minutesRef = useRef(new Date().getMinutes() % 2);

  useFrame((_, delta) => {
    if (materialRef01.current && materialRef02.current) {
      materialRef01.current.opacity = opacityRef.current;
      materialRef02.current.opacity = 1.0 - opacityRef.current;

      if (opacityRef.current > 0 && minutesRef.current % 2 === 0) {
        opacityRef.current = Math.max(
          0,
          opacityRef.current - delta * clockSettings.digitFadeSpeed * 0.1,
        );
      } else if (opacityRef.current < 1 && minutesRef.current % 2 === 1) {
        opacityRef.current = Math.min(
          1,
          opacityRef.current + delta * clockSettings.digitFadeSpeed * 0.1,
        );
      }
    }

    const formattedTime = getFormattedDigitTime(
      clockSettings,
      getClockDateTime,
    );
    if (formattedTime === previousDisplayText) return;
    const date = new Date();
    const minutes = date.getMinutes();
    minutesRef.current = minutes;
    if (materialRef01.current && materialRef02.current) {
      if (minutesRef.current % 2 === 0) {
        setDisplayText2(formattedTime);
      } else {
        setDisplayText1(formattedTime);
      }
      setPreviousDisplayText(formattedTime);
    }
  });

  return (
    <>
      <Text
        position={[displayTextureWidth / 2, displayTextureHeight / 2, 0.0]}
        scale={
          ((displayTextureHeight * clockSettings.digitalClockSize) / 100) *
          SCALE_FACTORS[clockSettings.digitStyle]
        }
        font={fontUrl}
      >
        <meshBasicMaterial ref={materialRef01} transparent />
        {displayText1}
      </Text>
      <Text
        position={[displayTextureWidth / 2, displayTextureHeight / 2, -0.1]}
        scale={
          ((displayTextureHeight * clockSettings.digitalClockSize) / 100) *
          SCALE_FACTORS[clockSettings.digitStyle]
        }
        font={fontUrl}
      >
        <meshBasicMaterial ref={materialRef02} transparent />
        {displayText2}
      </Text>
    </>
  );
}
