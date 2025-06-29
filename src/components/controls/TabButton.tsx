import {
  BlendingModeIcon,
  ClockIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import { produce } from "immer";
import { motion } from "motion/react";
import { Tabs } from "radix-ui";
import useSlimeStore from "../../stores/useSlimeStore";
import type { ControlsTabName } from "../../types/types";

export default function TabButton({ tabName }: { tabName: ControlsTabName }) {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);

  function handleTabChange(value: ControlsTabName) {
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.selectedTab = value;
      }),
    );
  }

  return (
    <Tabs.Trigger
      value={tabName}
      onPointerDown={() => handleTabChange(tabName)}
    >
      <motion.div
        className="bg-tab-button-background flex cursor-pointer flex-col items-center rounded-full"
        animate={{
          backgroundColor:
            selectedTab === tabName
              ? "var(--color-tab-button-hover-background)"
              : "var(--color-tab-button-background)",
        }}
      >
        <div className="self-end rounded-full border border-dashed border-amber-400 p-1">
          {tabName === "clock-controls" && <ClockIcon className="h-6 w-6" />}
          {tabName === "simulation-controls" && (
            <MixerHorizontalIcon className="h-6 w-6" />
          )}
          {tabName === "color-controls" && (
            <BlendingModeIcon className="h-6 w-6" />
          )}
        </div>
      </motion.div>
    </Tabs.Trigger>
  );
}
