import { Loader, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";

import useSlimeStore from "../../stores/useSlimeStore";
import SlimeClock from "./SlimeClock";

export default function SlimeClockScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  useEffect(() => {
    const unsub = useSlimeStore.subscribe(
      (state) => state.colorSettings.backgroundColor,
      (newColor) => {
        canvasRef.current.style.backgroundColor = newColor;
      },
    );
    return () => unsub();
  });

  return (
    <>
      <Canvas
        linear
        flat
        ref={canvasRef}
        gl={{
          precision: "lowp",
          // preserveDrawingBuffer: true,
        }}
        style={{
          touchAction: "none",
          backgroundColor:
            useSlimeStore.getState().colorSettings.backgroundColor,
          height: "100vh",
        }}
        dpr={1.0}
        orthographic
        camera={{
          left: -1,
          right: 1,
          top: 1,
          bottom: -1,
          position: [0, 0, 10],
          near: 0.1,
          far: 30,
        }}
      >
        <Suspense fallback={null}>
          <Stats />
          <SlimeClock />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
