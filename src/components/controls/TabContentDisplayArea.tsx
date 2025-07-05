import { produce } from "immer";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import TabContentDisplayAreaHtmlContent from "./TabContentDisplayAreaHtmlContent";

export default function TabContentDisplayArea() {
  /**
   * Positioning.
   */
  const displayAreaRef = useRef<HTMLDivElement>(null);

  function handleViewportEnter(enter: IntersectionObserverEntry | null) {
    if (!enter || !enter.boundingClientRect) return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaBoundingClientRect =
          enter.boundingClientRect;
      }),
    );
  }

  function handleViewportResize() {
    const boundingClientRect = displayAreaRef.current?.getBoundingClientRect();
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaBoundingClientRect =
          boundingClientRect || null;
      }),
    );
  }

  useEffect(() => {
    window.addEventListener("resize", handleViewportResize);
    return () => {
      window.removeEventListener("resize", handleViewportResize);
    };
  }, []);

  /**
   * HTML content.
   */
  const [displayAreaContentType, setDisplayAreaContentType] = useState<
    "html" | "three"
  >(useSlimeStore.getState().controlsState.displayAreaContentType);
  useEffect(() => {
    const unsubControlsState = useSlimeStore.subscribe(
      (state) => state.controlsState,
      (newControlsState) => {
        setDisplayAreaContentType(newControlsState.displayAreaContentType);
      },
    );
    return () => {
      unsubControlsState();
    };
  }, []);

  return (
    <div className="flex h-full w-56 flex-none flex-col items-center">
      <div className="h-14 w-full flex-none backdrop-blur-sm" />
      <div className="flex w-full grow">
        <div className="h-full w-3 flex-none backdrop-blur-sm" />
        <motion.div
          ref={displayAreaRef}
          className="border-control-container-text h-64 w-full border border-dashed"
          onViewportEnter={handleViewportEnter}
        >
          {displayAreaContentType === "html" && (
            <TabContentDisplayAreaHtmlContent />
          )}
        </motion.div>
        <div className="h-full w-3 flex-none backdrop-blur-sm" />
      </div>
      <div className="h-3 w-full flex-none backdrop-blur-sm" />
    </div>
  );
}
