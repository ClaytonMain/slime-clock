import { motion, usePresenceData } from "motion/react";
import { forwardRef, type Ref } from "react";
import type { FooterTabName } from "../../types/types";
import ClockSettings from "./ClockSettings";
import ColorSettings from "./ColorSettings";
import SimulationSettings from "./SimulationSettings";

/**
 * Referenced https://examples.motion.dev/react/use-presence-data
 * for the footer tab content animation.
 */

const FooterTabContent = forwardRef(function FooterTabContent(
  {
    selectedTab,
  }: {
    selectedTab: FooterTabName;
  },
  ref: Ref<HTMLDivElement>,
) {
  const direction = usePresenceData();

  return (
    <motion.div
      ref={ref}
      className="flex h-auto w-full justify-center overflow-x-clip overflow-y-auto"
      initial={{ opacity: 0, x: direction * 100 }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: direction * -100,
      }}
      style={{
        scrollbarGutter: "stable",
        scrollbarWidth: "thin",
        scrollbarColor: "var(--color-red-200) #f8717111",
      }}
      transition={{
        x: { type: "spring", stiffness: 200, damping: 15 },
        opacity: { duration: 0.2 },
      }}
    >
      <>
        {selectedTab === "clock-settings" && <ClockSettings />}
        {selectedTab === "color-settings" && <ColorSettings />}
        {selectedTab === "simulation-settings" && <SimulationSettings />}
      </>
    </motion.div>
  );
});

export default FooterTabContent;
