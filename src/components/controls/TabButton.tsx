import {
  BlendingModeIcon,
  ClockIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import { produce } from "immer";
import { motion } from "motion/react";
import { Tabs } from "radix-ui";
import { useRef } from "react";
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
  const tabButtonDivRef = useRef<HTMLDivElement>(null);

  function handleTabChange(value: ControlsTabName) {
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.selectedTab = value;
        if (tabButtonDivRef.current) {
          state.controlsState.selectedTabButtonClientRect =
            tabButtonDivRef.current.getBoundingClientRect();
        }
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
          ref={tabButtonDivRef}
          whileHover={{
            backgroundColor: "var(--color-tab-button-hover-background)",
          }}
          transition={{ duration: 0.2 }}
          className="relative top-0 left-0 m-0.5 flex h-8 w-8 cursor-pointer flex-col items-center"
          onViewportEnter={(enter) => {
            if (!enter || !enter.boundingClientRect) return;
            if (selectedTab === tabName) {
              useSlimeStore.setState(
                produce((state) => {
                  state.controlsState.selectedTabButtonClientRect =
                    enter.boundingClientRect;
                }),
              );
            }
          }}
        >
          <motion.div className="self-end p-1">
            {/* {selectedTab === tabName ? (
              <motion.div
                className="text-ui-text-a absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 transform bg-transparent"
                layoutId="tab-button-selected-indicator"
                id="tab-button-selected-indicator"
              >
                <PlusIcon className="stroke-ui-text-a absolute top-0 left-0 z-[1] h-2 w-2 -translate-x-2/3 -translate-y-2/3 transform" />
                <PlusIcon className="stroke-ui-text-a absolute top-0 right-0 z-[1] h-2 w-2 translate-x-2/3 -translate-y-2/3 transform" />
                <PlusIcon className="stroke-ui-text-a absolute bottom-0 left-0 z-[1] h-2 w-2 -translate-x-2/3 translate-y-2/3 transform" />
                <PlusIcon className="stroke-ui-text-a absolute right-0 bottom-0 z-[1] h-2 w-2 translate-x-2/3 translate-y-2/3 transform" />
              </motion.div>
            ) : null} */}
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
