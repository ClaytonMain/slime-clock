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
        ref={canvasRef}
        gl={{
          preserveDrawingBuffer: true,
        }}
        style={{
          touchAction: "none",
          backgroundColor:
            useSlimeStore.getState().colorSettings.backgroundColor,
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
