import { motion } from "motion/react";
import { ANIMATION_CONFIGS } from "../../constants/constants";

export default function DivDashedEdge({ index }: { index: number }) {
  const topBottom = ["top-0", "top-0", "bottom-0", "bottom-0"][index];
  const leftRight = ["left-0", "left-0", "right-0", "right-0"][index];
  const border = [
    "border-t-1 border-dashed w-[calc(100%_-_var(--spacing)_*_12)] mx-6 h-[4px]",
    "border-l-1 border-dashed w-[4px] h-[calc(100%_-_var(--spacing)_*_12)] my-6",
    "border-b-1 border-dashed w-[calc(100%_-_var(--spacing)_*_12)] mx-6 h-[4px]",
    "border-r-1 border-dashed w-[4px] h-[calc(100%_-_var(--spacing)_*_12)] my-6",
  ][index];
  return (
    <motion.div
      key={`controls-dialog-content-outer-container-border-${index}`}
      className={`absolute ${topBottom} ${leftRight} z-[2] ${border}`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: ANIMATION_CONFIGS.flickerIn.opacity,
        transition: {
          opacity: {
            delay: 0.01 * Math.random() + index * 0.025,
            duration: 0.4,
            times: ANIMATION_CONFIGS.flickerIn.transition.times,
          },
        },
      }}
      exit={{
        opacity: ANIMATION_CONFIGS.flickerOut.opacity,
        transition: {
          opacity: {
            duration: 0.4,
            delay: 0.3 + index * 0.1,
            times: ANIMATION_CONFIGS.flickerOut.transition.times,
          },
        },
      }}
    />
  );
}
