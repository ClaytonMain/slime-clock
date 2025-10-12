import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useRef } from "react";

import { produce } from "immer";
import InteractionListener from "../../InteractionListener";
import PresetsChangeListener from "../../PresetsChangeListener";
import useSlimeStore from "../../stores/useSlimeStore";
import PostProcessing from "../PostProcessing";
import SlimeClock from "./SlimeClock";
import StatsComponent from "./StatsComponent";

export default function SlimeClockScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const interactionState = useSlimeStore((state) => state.interactionState);
  const isOpen = useSlimeStore((state) => state.controlsState.isOpen);
  const debugConsoleLogger = useSlimeStore((state) => state.debugConsoleLogger);

  function handleKeydown(e: KeyboardEvent) {
    const controlsAreOpen = useSlimeStore.getState().controlsState.isOpen;
    if (controlsAreOpen) return;
    if (e.code === "Space") {
      useSlimeStore.setState(
        produce((state) => {
          state.randomizationState.agentRandomizationRequestedAt = Date.now();
          state.randomizationState.trailRandomizationRequestedAt = Date.now();
          state.randomizationState.colorRandomizationRequestedAt = Date.now();
        }),
      );
    }
  }
  useLayoutEffect(() => {
    const unsub = useSlimeStore.subscribe(
      (state) => state.colorSettings.backgroundColor,
      (newColor) => {
        if (canvasRef.current) {
          debugConsoleLogger("Updating background color to", newColor);
          canvasRef.current.style.backgroundColor = newColor;
          document.body.style.backgroundColor = newColor;
        }
      },
    );
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

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
          cursor: interactionState === "active" || isOpen ? "default" : "none",
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
          <StatsComponent />
          <SlimeClock />
          <InteractionListener />
          <PresetsChangeListener />
        </Suspense>
        <PostProcessing />
      </Canvas>
      <Loader />
    </>
  );
}
