import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useCallback, useEffect } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import ClockSettings from "./ClockSettings";
import ColorSettings from "./ColorSettings";
import FooterTabButton from "./FooterTabButton";
import FooterTabContent from "./FooterTabContent";
import SimulationSettings from "./SimulationSettings";

export default function Footer() {
  const isOpen = useSlimeStore((state) => state.footerState.footerIsOpen);
  const setIsOpen = useSlimeStore((state) => state.footerStateSetFooterIsOpen);
  const selectedTab = useSlimeStore((state) => state.footerState.selectedTab);

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    },
    [setIsOpen],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", escFunction, false);
    } else {
      document.removeEventListener("keydown", escFunction, false);
    }
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [isOpen, escFunction]);

  return (
    <motion.div
      className="fixed bottom-0 left-0 h-full w-full"
      animate={{
        backgroundColor: isOpen ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0)",
      }}
      onClick={() => setIsOpen(false)}
    >
      <LayoutGroup>
        <motion.div
          layout
          className="fixed bottom-0 left-0 flex w-full flex-col justify-center"
          key="footer-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Then a container for the tab buttons */}
          <motion.div
            className="flex w-full items-end justify-center border-b-1 border-amber-950 p-2 backdrop-blur-sm"
            animate={{
              backgroundColor: isOpen ? "#f87171ff" : "#f8717100",
            }}
            key="footer-tab-buttons-container"
          >
            {/* <motion.div
              className="grow flex bg-blue-300 rounded-br-3xl w-full"
              key="footer-tab-left-padding"
            /> */}
            <FooterTabButton
              tabName="clock-settings"
              displayName="Clock Settings"
            />
            <FooterTabButton
              tabName="simulation-settings"
              displayName="Simulation Settings"
            />
            <FooterTabButton
              tabName="color-settings"
              displayName="Color Settings"
            />
            {/* <motion.div
              className="grow flex bg-blue-300 rounded-bl-3xl w-full"
              key="footer-tab-right-padding"
            /> */}
          </motion.div>
          {/* Then a container for the tab content */}
          <motion.div
            className="flex w-full justify-center overflow-x-hidden overflow-y-auto bg-red-400 backdrop-blur-sm"
            key="footer-tab-content-container"
            animate={{
              height: `calc(var(--spacing) * ${isOpen ? "64" : "0"})`,
            }}
            layout
          >
            <AnimatePresence initial={false}>
              {isOpen && (
                <>
                  {selectedTab === "clock-settings" && (
                    <FooterTabContent
                      tabName="clock-settings"
                      key="clock-settings"
                    >
                      <ClockSettings />
                    </FooterTabContent>
                  )}
                  {selectedTab === "simulation-settings" && (
                    <FooterTabContent
                      tabName="simulation-settings"
                      key="simulation-settings"
                    >
                      <SimulationSettings />
                    </FooterTabContent>
                  )}
                  {selectedTab === "color-settings" && (
                    <FooterTabContent
                      tabName="color-settings"
                      key="color-settings"
                    >
                      <ColorSettings />
                    </FooterTabContent>
                  )}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </LayoutGroup>
    </motion.div>
  );
}
