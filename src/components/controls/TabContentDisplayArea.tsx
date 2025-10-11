import { produce } from "immer";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import TabContentDisplayAreaHtmlContent from "./TabContentDisplayAreaHtmlContent";

export default function TabContentDisplayArea() {
  const portraitOrLandscape = useSlimeStore(
    (state) => state.controlsState.portraitOrLandscape,
  );
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
      className={`flex flex-none items-center p-3 ${portraitOrLandscape === "portrait" ? "h-40 w-full px-11 sm:h-48" : "h-8/12 w-4/12"}`}
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
