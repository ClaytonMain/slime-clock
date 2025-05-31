import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import SlimeClock from "./SlimeClock";

export default function SlimeClockScene() {
  const [backgroundColor] = useLocalStorage("background-color", "#060808");

  useEffect(() => {
    document.body.style.background = backgroundColor;
  }, [backgroundColor]);

  return (
    <>
      <Canvas
        gl={{
          preserveDrawingBuffer: true,
        }}
        style={{
          touchAction: "none",
          backgroundColor: backgroundColor,
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
