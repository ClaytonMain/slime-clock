import { Cross2Icon, GearIcon, PlusIcon } from "@radix-ui/react-icons";
import { produce } from "immer";
import { AnimatePresence, motion } from "motion/react";
import { Dialog, Separator, Tabs, VisuallyHidden } from "radix-ui";
import { useEffect, useRef, useState } from "react";
import { ANIMATION_CONFIGS } from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import ClockControls from "./ClockControls";
import ColorControls from "./ColorControls";
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
                className="inline-flex cursor-pointer appearance-none rounded-full p-1"
                animate={{
                  backgroundColor: "var(--color-zinc-950-60)",
                  opacity: interactionState === "active" || isOpen ? 1 : 0.0,
                }}
                whileHover={{
                  backgroundColor: "var(--color-sky-950-60)",
                }}
              >
                <GearIcon className="h-6 w-6" />
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
                className="fixed top-1/2 left-1/2 flex h-full max-h-[50rem] w-full -translate-1/2 flex-col rounded-xs text-sky-50 sm:h-10/12 sm:w-10/12 md:h-10/12 md:py-0 lg:w-8/12 xl:h-9/12 xl:w-7/12 2xl:h-7/12 2xl:w-5/12"
                exit={{
                  transition: { duration: 0.3, when: "afterChildren" },
                }}
                onAnimationEnd={(definition) => {
                  console.log("Animation ended:", definition);
                }}
              >
                {Array.from({ length: 4 }).map((_, index) => {
                  const topBottom = index % 2 === 0 ? "top-0" : "bottom-0";
                  const leftRight = index < 2 ? "left-0" : "right-0";
                  const translateX =
                    index < 2 ? "-translate-x-1/2" : "translate-x-1/2";
                  const translateY =
                    index % 2 === 0 ? "-translate-y-1/2" : "translate-y-1/2";
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
                            times:
                              ANIMATION_CONFIGS.flickerOut.transition.times,
                          },
                        },
                      }}
                    >
                      <PlusIcon className="scale-150" />
                    </motion.div>
                  );
                })}
                {Array.from({ length: 4 }).map((_, index) => {
                  const topBottom = ["top-0", "top-0", "bottom-0", "bottom-0"][
                    index
                  ];
                  const leftRight = ["left-0", "left-0", "right-0", "right-0"][
                    index
                  ];
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
                            times:
                              ANIMATION_CONFIGS.flickerOut.transition.times,
                          },
                        },
                      }}
                    />
                  );
                })}
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
                          className="flex w-full grow flex-col-reverse items-center md:flex-row"
                          initial={{ opacity: 0 }}
                          animate={ANIMATION_CONFIGS.flickerIn}
                          exit={ANIMATION_CONFIGS.flickerOut}
                        >
                          <motion.div
                            key="tab-content-controls-content-inner-container"
                            className="flex w-full grow items-center px-3 py-3 md:h-full"
                            initial={{ opacity: 0 }}
                            animate={ANIMATION_CONFIGS.flickerIn}
                            exit={ANIMATION_CONFIGS.flickerOut}
                          >
                            <RandomizationControls key="randomization-controls" />
                            <ClockControls key="clock-controls" />
                            <SimulationControls key="simulation-controls" />
                            <ColorControls key="color-controls" />
                            <PresetsControls key="presets-controls" />
                          </motion.div>
                          <Separator.Root
                            key="tab-content-separator"
                            className="flex h-px w-10/12 border-b border-sky-50 md:h-10/12 md:w-px md:border-l"
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
