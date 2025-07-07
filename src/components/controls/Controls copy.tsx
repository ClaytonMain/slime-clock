import { Cross2Icon, GearIcon, PlusIcon } from "@radix-ui/react-icons";
import { produce } from "immer";
import { AnimatePresence, motion } from "motion/react";
import { Dialog, Separator, Tabs, VisuallyHidden } from "radix-ui";
import { useEffect } from "react";
import { ANIMATION_CONFIGS } from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import ClockControls from "./ClockControls";
import ColorControls from "./ColorControls";
import SimulationControls from "./SimulationControls";
import TabButton from "./TabButton";
import TabContentDisplayArea from "./TabContentDisplayArea";
import TabContentVerticalSeparator from "./TabContentVerticalSeparator";
import TooltipWrapper from "./TooltipWrapper";

export default function Controls() {
  // Important to remember that `isOpen` is passed to `Dialog.Root`,
  // so even "opening" and "closing" are considered "open" states.
  const isOpen = useSlimeStore((state) => state.controlsState.isOpen);
  const showContent = useSlimeStore((state) => state.controlsState.showContent);
  const animationState = useSlimeStore(
    (state) => state.controlsState.animationState,
  );
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);

  function handleOpenChange(open: boolean) {
    const currentControlsState = useSlimeStore.getState().controlsState;
    let newAnimationState: "open" | "closed" | "opening" | "closing";
    if (open && currentControlsState.animationState === "closed") {
      newAnimationState = "opening";
    } else if (!open && currentControlsState.animationState === "open") {
      newAnimationState = "closing";
    }
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.animationState = newAnimationState;
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

  const dialogContentVariants = {
    opening: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.3,
        when: "afterChildren",
      },
    },
    open: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.0,
        when: "afterChildren",
      },
    },
    closing: {
      scale: 0.99,
      opacity: 0,
      transition: {
        delay: 0.1,
        duration: 0.3,
        when: "afterChildren",
      },
    },
    closed: {
      scale: 0.99,
      opacity: 0,
      transition: {
        delay: 0.1,
        duration: 0.0,
        when: "afterChildren",
      },
    },
  };

  useEffect(() => {
    let newIsOpen: boolean;
    let newShowContent: boolean;
    if (animationState === "opening") {
      newIsOpen = true;
      newShowContent = false;
    } else if (animationState === "open") {
      newIsOpen = true;
      newShowContent = true;
    } else if (animationState === "closing") {
      newIsOpen = true;
      newShowContent = false;
    } else if (animationState === "closed") {
      newIsOpen = false;
      newShowContent = false;
    }
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.isOpen = newIsOpen;
        state.controlsState.showContent = newShowContent;
      }),
    );
  }, [animationState]);

  return (
    <div className="absolute bottom-0 left-0 h-full w-full">
      <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
        <div className="text-control-container-text absolute bottom-0 left-0 flex w-full justify-center gap-3 p-4">
          <TooltipWrapper tooltipText="Open Controls">
            <Dialog.Trigger asChild>
              <motion.div
                className="bg-tab-button-background inline-flex cursor-pointer appearance-none rounded-full p-1"
                whileHover={{
                  backgroundColor: "var(--color-tab-button-hover-background)",
                }}
              >
                <GearIcon className="h-6 w-6" />
              </motion.div>
            </Dialog.Trigger>
          </TooltipWrapper>
        </div>

        <AnimatePresence>
          {isOpen && (
            <Dialog.Portal key="controls-dialog-portal">
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0"
                  style={{
                    pointerEvents: animationState === "open" ? "auto" : "none",
                  }}
                />
              </Dialog.Overlay>
              <Dialog.Content
                asChild
                onInteractOutside={(event) => {
                  event.preventDefault();
                  if (animationState === "opening") {
                    useSlimeStore.setState(
                      produce((state) => {
                        state.controlsState.animationState = "open";
                      }),
                    );
                  } else if (animationState === "open") {
                    useSlimeStore.setState(
                      produce((state) => {
                        state.controlsState.animationState = "closing";
                      }),
                    );
                  } else if (animationState === "closing") {
                    useSlimeStore.setState(
                      produce((state) => {
                        state.controlsState.animationState = "closed";
                      }),
                    );
                  }
                }}
              >
                <motion.div
                  className="text-control-container-text fixed top-1/2 left-1/2 flex h-96 max-h-11/12 w-9/12 max-w-2xl -translate-1/2 flex-col rounded-xs"
                  variants={dialogContentVariants}
                  initial="closed"
                  animate={animationState}
                  exit="closed"
                  onAnimationComplete={(definition) => {
                    if (definition === "opening") {
                      useSlimeStore.setState(
                        produce((state) => {
                          state.controlsState.animationState = "open";
                        }),
                      );
                    } else if (definition === "closing") {
                      useSlimeStore.setState(
                        produce((state) => {
                          state.controlsState.animationState = "closed";
                        }),
                      );
                    }
                  }}
                >
                  <AnimatePresence propagate>
                    {isOpen &&
                      Array.from({ length: 4 }).map((_, index) => {
                        const topBottom =
                          index % 2 === 0 ? "top-0" : "bottom-0";
                        const leftRight = index < 2 ? "left-0" : "right-0";
                        const translateX =
                          index < 2 ? "-translate-x-1/2" : "translate-x-1/2";
                        const translateY =
                          index % 2 === 0
                            ? "-translate-y-1/2"
                            : "translate-y-1/2";
                        return (
                          <motion.div
                            key={index}
                            className={`absolute ${topBottom} ${leftRight} z-[2] ${translateX} ${translateY}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{
                              opacity: ANIMATION_CONFIGS.flickerIn.opacity,
                              scale: 1,
                              transition: {
                                duration: 0.4,
                                opacity: {
                                  duration: 0.6,
                                  delay: 0.5 + Math.random() * 0.5,
                                  times:
                                    ANIMATION_CONFIGS.flickerIn.transition
                                      .times,
                                },
                              },
                            }}
                            exit={{ opacity: 0, scale: 0.95 }}
                          >
                            <PlusIcon className="scale-200" />
                          </motion.div>
                        );
                      })}
                  </AnimatePresence>
                  <VisuallyHidden.Root>
                    <Dialog.Title>Controls</Dialog.Title>
                    <Dialog.Description>
                      This dialog contains various controls for the application.
                    </Dialog.Description>
                  </VisuallyHidden.Root>

                  <Tabs.Root
                    value={selectedTab}
                    onValueChange={handleTabChange}
                    className="flex h-full flex-col items-center"
                  >
                    <Dialog.Close
                      aria-label="Close"
                      className="bg-tab-button-background absolute top-1.5 right-3 z-[1] inline-flex cursor-pointer appearance-none rounded-full p-1"
                    >
                      <Cross2Icon className="h-6 w-6" />
                    </Dialog.Close>
                    <AnimatePresence propagate>
                      {showContent && (
                        <motion.div
                          key="controls-dialog-content"
                          className="flex w-full grow items-center"
                          initial={{ opacity: 0 }}
                          animate={ANIMATION_CONFIGS.flickerIn}
                          exit={ANIMATION_CONFIGS.flickerOut}
                        >
                          <div className="flex h-full grow items-center px-2 py-3 backdrop-blur-sm">
                            <ClockControls />
                            <SimulationControls />
                            <ColorControls />
                          </div>
                          <TabContentVerticalSeparator />
                          <TabContentDisplayArea />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Separator.Root className="border-control-container-text h-px w-11/12 border-b" />

                    <Tabs.List className="flex w-full justify-center gap-3 py-2 backdrop-blur-sm">
                      <TabButton
                        tabName="clock-controls"
                        tooltipText="Clock Controls"
                      />
                      <TabButton
                        tabName="simulation-controls"
                        tooltipText="Simulation Controls"
                      />
                      <TabButton
                        tabName="color-controls"
                        tooltipText="Color Controls"
                      />
                    </Tabs.List>
                  </Tabs.Root>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}
