import { Cross2Icon, GearIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { produce } from "immer";
import { AnimatePresence, motion } from "motion/react";
import { Dialog, Separator, Tabs, VisuallyHidden } from "radix-ui";
import { useEffect, useRef, useState } from "react";
import { ANIMATION_CONFIGS } from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import ClockControls from "./ClockControls";
import ColorControls from "./ColorControls";
import DebugControls from "./DebugControls";
import DivCornerPlusIcon from "./DivCornerPlusIcon";
import DivDashedEdge from "./DivDashedEdge";
import InfoControls from "./InfoControls";
import PresetsControls from "./PresetsControls";
import RandomizationControls from "./RandomizationControls";
import SelectedTabCornerIcons from "./SelectedTabCornerIcons";
import SimulationControls from "./SimulationControls";
import TabButton from "./TabButton";
import TabContentDisplayArea from "./TabContentDisplayArea";
import TooltipWrapper from "./TooltipWrapper";

export default function Controls() {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );
  const isOpen = useSlimeStore((state) => state.controlsState.isOpen);
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);
  const interactionState = useSlimeStore((state) => state.interactionState);

  const controlsContentOuterContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    useSlimeStore.setState(
      produce((state) => {
        state.portalContainer = portalContainer;
      }),
    );
  }, [portalContainer]);

  function handleControlsContentOuterContainerViewportEnter(
    enter: IntersectionObserverEntry | null,
  ) {
    if (!enter || !enter.boundingClientRect) return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.controlsAreaBoundingClientRect =
          enter.boundingClientRect;
      }),
    );
  }

  function handleViewportResize() {
    const boundingClientRect =
      controlsContentOuterContainerRef.current?.getBoundingClientRect();
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.controlsAreaBoundingClientRect =
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

  function handleOpenChange(open: boolean) {
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.isOpen = open;
      }),
    );
  }

  function handleTabChange(value: string) {
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.selectedTab = value;
      }),
    );
  }

  return (
    <div>
      <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
        <div className="absolute bottom-0 left-0 flex w-full justify-center gap-3 p-4 text-sky-50">
          <TooltipWrapper tooltipText="Open Controls">
            <Dialog.Trigger asChild>
              <motion.div
                className="inline-flex cursor-pointer appearance-none items-center rounded-full p-1"
                animate={{
                  backgroundColor: "var(--color-zinc-950-60)",
                  opacity: interactionState === "active" || isOpen ? 1 : 0.0,
                }}
                whileHover={{
                  backgroundColor: "var(--color-sky-950-60)",
                }}
              >
                <GearIcon className="h-6 w-6" />
                <span className="text-2xl font-thin">/</span>
                <InfoCircledIcon className="h-6 w-6" />
              </motion.div>
            </Dialog.Trigger>
          </TooltipWrapper>
        </div>

        <AnimatePresence>
          {isOpen && (
            <Dialog.Portal
              key="controls-dialog-portal"
              forceMount
              container={portalContainer}
            >
              <Dialog.Overlay key="controls-dialog-overlay" asChild forceMount>
                <motion.div className="fixed inset-0" />
              </Dialog.Overlay>

              <motion.div
                ref={controlsContentOuterContainerRef}
                onViewportEnter={
                  handleControlsContentOuterContainerViewportEnter
                }
                key="controls-dialog-content-outer-container"
                className="fixed top-1/2 left-1/2 flex h-full w-full max-w-[1000px] -translate-1/2 flex-col rounded-xs text-sky-50 sm:h-10/12 sm:w-10/12 md:h-10/12 md:py-0 lg:w-9/12 xl:h-9/12 xl:w-7/12"
                exit={{
                  transition: { duration: 0.3, when: "afterChildren" },
                }}
                onAnimationEnd={(definition) => {
                  console.log("Animation ended:", definition);
                }}
              >
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index}>
                    <DivCornerPlusIcon
                      key={`controls-dialog-corner-plus-icon-${index}`}
                      index={index}
                    />
                    <DivDashedEdge
                      key={`controls-dialog-dashed-edge-${index}`}
                      index={index}
                    />
                  </div>
                ))}
                <Dialog.Content
                  forceMount
                  asChild
                  key="controls-dialog-content"
                >
                  <motion.div
                    key="controls-dialog-content-inner-container"
                    className="fixed top-0 left-0 flex h-full w-full flex-col"
                    initial={{ opacity: 0 }}
                    animate={{
                      ...ANIMATION_CONFIGS.flickerIn,
                      transition: {
                        ...ANIMATION_CONFIGS.flickerIn.transition,
                        delay: 0.1,
                      },
                    }}
                    exit={ANIMATION_CONFIGS.flickerOut}
                  >
                    <VisuallyHidden.Root key="controls-visually-hidden-root">
                      <Dialog.Title key="controls-dialog-title">
                        Controls
                      </Dialog.Title>
                      <Dialog.Description key="controls-dialog-description">
                        This dialog contains various controls for the
                        application.
                      </Dialog.Description>
                    </VisuallyHidden.Root>

                    <Tabs.Root
                      key="controls-tabs-root"
                      value={selectedTab}
                      onValueChange={handleTabChange}
                      className="flex h-full flex-col items-center"
                    >
                      <AnimatePresence propagate>
                        <motion.div
                          key="controls-content-inner-container"
                          className="flex w-full grow flex-col-reverse items-center lg:flex-row"
                          initial={{ opacity: 0 }}
                          animate={ANIMATION_CONFIGS.flickerIn}
                          exit={ANIMATION_CONFIGS.flickerOut}
                        >
                          <motion.div
                            key="tab-content-controls-content-inner-container"
                            className="flex w-full grow items-center px-3 py-3 lg:h-full"
                            initial={{ opacity: 0 }}
                            animate={ANIMATION_CONFIGS.flickerIn}
                            exit={ANIMATION_CONFIGS.flickerOut}
                          >
                            <RandomizationControls key="randomization-controls" />
                            <ClockControls key="clock-controls" />
                            <SimulationControls key="simulation-controls" />
                            <ColorControls key="color-controls" />
                            <PresetsControls key="presets-controls" />
                            <InfoControls key="info-controls" />
                            {window.location.hash === "#debug" && (
                              <DebugControls key="debug-controls" />
                            )}
                          </motion.div>
                          <Separator.Root
                            key="tab-content-separator"
                            className="flex h-px w-10/12 border-b border-sky-50 lg:h-10/12 lg:w-px lg:border-l"
                          />
                          <TabContentDisplayArea key="tab-content-display-area" />
                        </motion.div>

                        <Separator.Root
                          key="tab-content-separator"
                          className="h-px w-10/12 border-b border-sky-50"
                        />

                        <Tabs.List
                          key="controls-tabs-list"
                          className="flex w-full justify-center py-2"
                        >
                          <div className="bg-zinc-950-60 relative flex items-center gap-0.5 rounded-xs p-0.5">
                            <TabButton
                              key="tab-button-randomization-controls"
                              tabName="randomization-controls"
                              tooltipText="Randomization Controls"
                            />
                            <Separator.Root
                              key="tab-button-separator-01"
                              className="flex h-2/3 w-px border-l border-sky-50"
                            />
                            <TabButton
                              key="tab-button-clock-controls"
                              tabName="clock-controls"
                              tooltipText="Clock Controls"
                            />
                            <Separator.Root
                              key="tab-button-separator-02"
                              className="flex h-2/3 w-px border-l border-sky-50"
                            />
                            <TabButton
                              key="tab-button-simulation-controls"
                              tabName="simulation-controls"
                              tooltipText="Simulation Controls"
                            />
                            <Separator.Root
                              key="tab-button-separator-03"
                              className="flex h-2/3 w-px border-l border-sky-50"
                            />
                            <TabButton
                              key="tab-button-color-controls"
                              tabName="color-controls"
                              tooltipText="Color Controls"
                            />
                            <Separator.Root
                              key="tab-button-separator-04"
                              className="flex h-2/3 w-px border-l border-sky-50"
                            />
                            <TabButton
                              key="tab-button-presets"
                              tabName="presets-controls"
                              tooltipText="Presets"
                            />
                            <Separator.Root
                              key="tab-button-separator-05"
                              className="flex h-2/3 w-px border-l border-sky-50"
                            />
                            <TabButton
                              key="tab-button-info-controls"
                              tabName="info-controls"
                              tooltipText="Information"
                            />
                            {window.location.hash === "#debug" && (
                              <>
                                <Separator.Root
                                  key="tab-button-separator-06"
                                  className="flex h-2/3 w-px border-l border-sky-50"
                                />
                                <TabButton
                                  key="tab-button-debug-controls"
                                  tabName="debug-controls"
                                  tooltipText="Debug Controls"
                                />
                              </>
                            )}
                            <SelectedTabCornerIcons />
                          </div>
                        </Tabs.List>
                      </AnimatePresence>
                    </Tabs.Root>

                    <Dialog.Close
                      asChild
                      key="controls-dialog-close-button"
                      aria-label="Close"
                    >
                      <motion.div
                        className="absolute top-1.5 right-1.5 z-[1] inline-flex cursor-pointer appearance-none rounded-full p-1"
                        animate={{
                          backgroundColor: "var(--color-zinc-950-60)",
                        }}
                        whileHover={{
                          backgroundColor: "var(--color-sky-950-60)",
                        }}
                      >
                        <Cross2Icon className="h-6 w-6" />
                      </motion.div>
                    </Dialog.Close>
                  </motion.div>
                </Dialog.Content>
              </motion.div>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
      <div ref={setPortalContainer} />
    </div>
  );
}
