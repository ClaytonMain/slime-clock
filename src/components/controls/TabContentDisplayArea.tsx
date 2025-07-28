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
    <motion.div
      key="tab-content-display-area"
      className="flex h-48 w-full flex-none items-center px-3 pt-3 pb-3 md:h-8/12 md:w-4/12 md:pt-0 md:pb-0"
    >
      <motion.div
        ref={displayAreaRef}
        className="flex h-full w-full items-center border border-dashed border-sky-50"
        onViewportEnter={handleViewportEnter}
      >
        {displayAreaContentType === "html" && (
          <TabContentDisplayAreaHtmlContent />
        )}
      </motion.div>
    </motion.div>
  );
}
