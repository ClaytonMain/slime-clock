import { PlusIcon } from "@radix-ui/react-icons";
import { animate, AnimatePresence, motion, useMotionValue } from "motion/react";
import { useEffect } from "react";
import { ANIMATION_CONFIGS } from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";

export default function SelectedTabCornerIcons() {
  const showSelectedTabCornerIcons = useSlimeStore(
    (state) => state.controlsState.showSelectedTabCornerIcons,
  );
  const selectedTabButtonClientRect = useSlimeStore(
    (state) => state.controlsState.selectedTabButtonClientRect,
  );
  const controlsAreaBoundingClientRect = useSlimeStore(
    (state) => state.controlsState.controlsAreaBoundingClientRect,
  );

  const left = useMotionValue(0);
  const right = useMotionValue(0);
  const bottom = useMotionValue(0);
  const top = useMotionValue(0);

  useEffect(() => {
    if (!selectedTabButtonClientRect || !controlsAreaBoundingClientRect) return;
    animate(
      top,
      selectedTabButtonClientRect.top - controlsAreaBoundingClientRect.top,
      { delay: Math.random() * 0.1, duration: 0.3, type: "spring" },
    );
    animate(
      right,
      selectedTabButtonClientRect.right - controlsAreaBoundingClientRect.left,
      { delay: Math.random() * 0.1, duration: 0.3, type: "spring" },
    );
    animate(
      bottom,
      selectedTabButtonClientRect.bottom - controlsAreaBoundingClientRect.top,
      { delay: Math.random() * 0.1, duration: 0.3, type: "spring" },
    );
    animate(
      left,
      selectedTabButtonClientRect.left - controlsAreaBoundingClientRect.left,
      { delay: Math.random() * 0.1, duration: 0.3, type: "spring" },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTabButtonClientRect, controlsAreaBoundingClientRect]);

  return (
    <AnimatePresence>
      {showSelectedTabCornerIcons && (
        <>
          <motion.div
            key={"selected-tab-corner-icons-top-left"}
            initial={{ opacity: 0 }}
            animate={ANIMATION_CONFIGS.flickerIn}
            exit={ANIMATION_CONFIGS.flickerOut}
            transition={{ duration: 0.4, delay: Math.random() * 0.1 }}
            style={{ left: left, top: top }}
            className="fixed z-[1] h-3 w-3 -translate-1/2"
          >
            <PlusIcon className="h-3 w-3" />
          </motion.div>
          <motion.div
            key={"selected-tab-corner-icons-top-right"}
            initial={{ opacity: 0 }}
            animate={ANIMATION_CONFIGS.flickerIn}
            exit={ANIMATION_CONFIGS.flickerOut}
            transition={{ duration: 0.4, delay: Math.random() * 0.1 }}
            style={{ left: right, top: top }}
            className="fixed z-[1] h-3 w-3 -translate-1/2"
          >
            <PlusIcon className="h-3 w-3" />
          </motion.div>
          <motion.div
            key={"selected-tab-corner-icons-bottom-left"}
            initial={{ opacity: 0 }}
            animate={ANIMATION_CONFIGS.flickerIn}
            exit={ANIMATION_CONFIGS.flickerOut}
            transition={{ duration: 0.4, delay: Math.random() * 0.1 }}
            style={{ left: left, top: bottom }}
            className="fixed z-[1] h-3 w-3 -translate-1/2"
          >
            <PlusIcon className="h-3 w-3" />
          </motion.div>
          <motion.div
            key={"selected-tab-corner-icons-bottom-right"}
            initial={{ opacity: 0 }}
            animate={ANIMATION_CONFIGS.flickerIn}
            exit={ANIMATION_CONFIGS.flickerOut}
            transition={{ duration: 0.4, delay: Math.random() * 0.1 }}
            style={{ left: right, top: bottom }}
            className="fixed z-[1] h-3 w-3 -translate-1/2"
          >
            <PlusIcon className="h-3 w-3" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
