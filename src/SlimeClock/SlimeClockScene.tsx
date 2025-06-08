import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import useSlimeStore from "../stores/useSlimeStore";
import SlimeClock from "./SlimeClock";

export default function SlimeClockScene() {
  const backgroundColorRef = useRef(
    useSlimeStore.getState().colorSettings.backgroundColor,
  );

  useEffect(() => {
    const unsub = useSlimeStore.subscribe(
      (state) => state.colorSettings.backgroundColor,
      (newColor) => {
        console.log("Background color changed to:", newColor);
        backgroundColorRef.current = newColor;
      },
    );
    return () => unsub();
  });

  // useEffect(() => {
  //   document.body.style.background = backgroundColor;
  // }, [backgroundColor]);

  return (
    <>
      <Canvas
        gl={{
          preserveDrawingBuffer: true,
        }}
        style={{
          touchAction: "none",
          backgroundColor: backgroundColorRef.current,
          height: "100vh",
        }}
        dpr={1.0}
      >
        <Suspense fallback={null}>
          <SlimeClock />
        </Suspense>
      </Canvas>
    </>
  );
}
