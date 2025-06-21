import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { ANIMATION_CONFIGS } from "../../constants/constants";
import { useFollowCursor } from "../../hooks/useFollowCursor";
import useSlimeStore from "../../stores/useSlimeStore";

export default function Tooltip() {
  const ref = useRef<HTMLDivElement>(null!);
  const { x, y } = useFollowCursor(ref);

  const tooltipText = useSlimeStore((state) => state.tooltipText);
  const tooltipActive = useSlimeStore((state) => state.tooltipActive);

  return (
    <motion.div
      className="border-tooltip-border bg-tooltip-background text-tooltip-text pointer-events-none fixed -top-5 left-1/2 z-10000 max-w-64 rounded-xs border p-3 leading-none tracking-tight backdrop-blur-md select-none"
      ref={ref}
      style={{ x, y }}
      initial={{ opacity: 0 }}
      animate={
        tooltipActive
          ? ANIMATION_CONFIGS.flickerIn
          : ANIMATION_CONFIGS.flickerOut
      }
      transition={{ when: "afterChildren" }}
    >
      <AnimatePresence mode="wait">
        {tooltipActive && (
          <motion.div
            key="tooltip-text"
            className="text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {tooltipText}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
