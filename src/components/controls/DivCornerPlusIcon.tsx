import { PlusIcon } from "@radix-ui/react-icons";
import { motion } from "motion/react";
import { ANIMATION_CONFIGS } from "../../constants/constants";

export default function DivCornerPlusIcon({ index }: { index: number }) {
  const topBottom = index % 2 === 0 ? "top-0" : "bottom-0";
  const leftRight = index < 2 ? "left-0" : "right-0";
  const translateX = index < 2 ? "-translate-x-1/2" : "translate-x-1/2";
  const translateY = index % 2 === 0 ? "-translate-y-1/2" : "translate-y-1/2";
  return (
    <motion.div
      key={`controls-dialog-content-outer-container-plus-icon-${index}`}
      className={`absolute ${topBottom} ${leftRight} z-[2] ${translateX} ${translateY}`}
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
    >
      <PlusIcon className="scale-150" />
    </motion.div>
  );
}
