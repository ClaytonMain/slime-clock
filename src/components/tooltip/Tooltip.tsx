import { motion } from "motion/react";
import { useRef } from "react";
import { useFollowCursor } from "../../hooks/useFollowCursor";
import useSlimeStore from "../../stores/useSlimeStore";

export default function Tooltip() {
  const ref = useRef<HTMLDivElement>(null!);
  const { x, y } = useFollowCursor(ref);

  const tooltipText = useSlimeStore((state) => state.tooltipText);

  return (
    <motion.div
      className="pointer-events-none fixed -top-5 left-1/2 z-10000 max-w-64 rounded-lg bg-blue-200/70 p-3 leading-none tracking-tight text-slate-800 backdrop-blur-md select-none"
      ref={ref}
      style={{ x, y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: tooltipText ? 1 : 0 }}
      transition={{ duration: tooltipText ? 0.2 : 0 }}
    >
      {tooltipText}
    </motion.div>
  );
}
