import { ClockIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { produce } from "immer";
import { motion } from "motion/react";
import { Tabs } from "radix-ui";
import { useEffect, useRef } from "react";
import { MdBugReport } from "react-icons/md";
import { PiDiceFive, PiFloppyDisk, PiPalette } from "react-icons/pi";
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
      }),
    );
  }

  function handlePointerEnter() {
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.showSelectedTabCornerIcons = true;
        if (tabButtonDivRef.current) {
          state.controlsState.selectedTabButtonClientRect =
            tabButtonDivRef.current.getBoundingClientRect();
        }
      }),
    );
  }

  function handlePointerLeave() {
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.showSelectedTabCornerIcons = false;
      }),
    );
  }

  function handleViewportResize() {
    const boundingClientRect = tabButtonDivRef.current?.getBoundingClientRect();
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.selectedTabButtonClientRect =
          boundingClientRect || null;
      }),
    );
  }

  useEffect(() => {
    window.addEventListener("resize", handleViewportResize);
    return () => {
      window.removeEventListener("resize", handleViewportResize);
    };
  }, []);

  return (
    <Tabs.Trigger
      value={tabName}
      onPointerDown={() => handleTabChange(tabName)}
    >
      <TooltipWrapper tooltipText={tooltipText}>
        <motion.div
          ref={tabButtonDivRef}
          animate={{
            backgroundColor:
              selectedTab === tabName
                ? "var(--color-sky-500-60)"
                : "var(--color-animatable-transparent)",
          }}
          transition={{ duration: 0.2 }}
          className="relative top-0 left-0 m-0.5 flex h-8 w-10 cursor-pointer flex-col items-center"
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
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <motion.div className="self-end p-1">
            {tabName === "randomization-controls" && (
              <PiDiceFive className="absolute top-1/2 left-1/2 z-[1] h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
            )}
            {tabName === "clock-controls" && (
              <ClockIcon className="absolute top-1/2 left-1/2 z-[1] h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
            )}
            {tabName === "simulation-controls" && (
              <MixerHorizontalIcon className="absolute top-1/2 left-1/2 z-[1] h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform" />
            )}
            {tabName === "color-controls" && (
              <PiPalette className="absolute top-1/2 left-1/2 z-[1] h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform" />
            )}
            {tabName === "presets-controls" && (
              <PiFloppyDisk className="absolute top-1/2 left-1/2 z-[1] h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
            )}
            {tabName === "debug-controls" && (
              <MdBugReport className="absolute top-1/2 left-1/2 z-[1] h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
            )}
          </motion.div>
        </motion.div>
      </TooltipWrapper>
    </Tabs.Trigger>
  );
}
