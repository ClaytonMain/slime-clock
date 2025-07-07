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
import TooltipWrapper from "./TooltipWrapper";

export default function TabButton({
  tabName,
  tooltipText,
}: {
  tabName: ControlsTabName;
  tooltipText: string;
}) {
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
      <TooltipWrapper tooltipText={tooltipText}>
        <motion.div
          whileHover={{ border: "2px solid var(--color-ui-icon-background-b)" }}
          className="bg-ui-icon-background-a relative top-0 left-0 m-0.5 flex h-8 w-8 cursor-pointer flex-col items-center rounded-full p-0.5"
        >
          <motion.div className="self-end rounded-full p-1">
            {selectedTab === tabName ? (
              <motion.div
                style={{
                  backgroundColor: "var(--color-ui-icon-background-c)",
                }}
                className="absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 transform rounded-full"
                layoutId="tab-button-selected-indicator"
                id="tab-button-selected-indicator"
              />
            ) : null}
            {tabName === "clock-controls" && (
              <ClockIcon className="absolute top-1/2 left-1/2 z-[1] h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
            )}
            {tabName === "simulation-controls" && (
              <MixerHorizontalIcon className="absolute top-1/2 left-1/2 z-[1] h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform" />
            )}
            {tabName === "color-controls" && (
              <BlendingModeIcon className="absolute top-1/2 left-1/2 z-[1] h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform" />
            )}
          </motion.div>
        </motion.div>
      </TooltipWrapper>
    </Tabs.Trigger>
  );
}
