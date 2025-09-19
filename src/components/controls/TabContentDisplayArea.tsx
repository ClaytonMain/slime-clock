import { produce } from "immer";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
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

  return (
    <motion.div
      key="tab-content-display-area"
      className="flex h-48 w-full flex-none items-center px-3 pt-3 pb-3 lg:h-8/12 lg:w-4/12 lg:pt-0 lg:pb-0"
    >
      <motion.div
        ref={displayAreaRef}
        className="flex h-full w-full items-center border border-dashed border-sky-50"
        onViewportEnter={handleViewportEnter}
      >
        <TabContentDisplayAreaHtmlContent />
      </motion.div>
    </motion.div>
  );
}
