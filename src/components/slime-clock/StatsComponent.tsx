import { Stats } from "@react-three/drei";
import { AnimatePresence } from "motion/react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function StatsComponent() {
  const showFPS = useSlimeStore((state) => state.showFPS);
  const interactionState = useSlimeStore((state) => state.interactionState);
  const isOpen = useSlimeStore((state) => state.controlsState.isOpen);

  return (
    <>
      <AnimatePresence>
        {showFPS && (interactionState === "active" || isOpen) && <Stats />}
      </AnimatePresence>
    </>
  );
}
