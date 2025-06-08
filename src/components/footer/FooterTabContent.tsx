import { motion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { FooterTabName } from "../../types/types";

const tabOrder: FooterTabName[] = [
  "clock-settings",
  "simulation-settings",
  "color-settings",
];

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : direction < 0 ? -1000 : 0,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : direction > 0 ? -1000 : 0,
      opacity: 0,
    };
  },
};

function getDirection(
  currentTab: FooterTabName,
  previousTab: FooterTabName,
): number {
  const currentIndex = tabOrder.indexOf(currentTab);
  const previousIndex = tabOrder.indexOf(previousTab);
  if (currentIndex === -1 || previousIndex === -1) return 0;
  return currentIndex - previousIndex;
}

const references = {
  direction: 0,
};

export default function FooterTabContent({
  tabName,
  children,
}: {
  tabName: FooterTabName;
  children: ReactNode;
}) {
  useEffect(() => {
    const unsubSelectedTab = useSlimeStore.subscribe(
      (state) => state.footerState.selectedTab,
      (selectedTab, previousSelectedTab) => {
        console.log(
          `Selected tab changed from ${previousSelectedTab} to ${selectedTab}`,
        );
        references.direction = getDirection(selectedTab, previousSelectedTab);
      },
      { fireImmediately: true },
    );
    return () => {
      unsubSelectedTab();
    };
  }, []);

  return (
    <motion.div
      className="flex h-auto w-full justify-center overflow-x-clip overflow-y-auto"
      style={{
        scrollbarGutter: "stable",
        scrollbarWidth: "thin",
        scrollbarColor: "var(--color-red-200) var(--color-red-400)",
      }}
      layout
      key={tabName}
      custom={references.direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
}
