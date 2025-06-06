import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useCallback, useEffect } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import ClockSettings from "./ClockSettings";
import FooterTabButton from "./FooterTabButton";
import FooterTabContent from "./FooterTabContent";

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

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
    [setIsOpen]
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
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
      }}
      animate={{
        backgroundColor: isOpen ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0)",
      }}
      onClick={() => setIsOpen(false)}
    >
      <LayoutGroup>
        <motion.div
          layout
          className="fixed left-0 bottom-0 flex flex-col justify-center w-full"
          key="footer-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Then a container for the tab buttons */}
          <motion.div
            className="flex w-full justify-center items-end p-2 backdrop-blur-sm"
            animate={{
              backgroundColor: isOpen ? "#f87171ff" : "#f8717100",
            }}
            key="footer-tab-buttons-container"
          >
            {/* <motion.div
              className="grow flex bg-blue-300 rounded-br-3xl w-full"
              key="footer-tab-left-padding"
            /> */}
            <FooterTabButton tabName="clock-settings" />
            <FooterTabButton tabName="simulation-settings" />
            <FooterTabButton tabName="color-settings" />
            {/* <motion.div
              className="grow flex bg-blue-300 rounded-bl-3xl w-full"
              key="footer-tab-right-padding"
            /> */}
          </motion.div>
          {/* Then a container for the tab content */}
          <motion.div
            className="flex justify-center w-full bg-red-400 overflow-y-auto overflow-x-hidden backdrop-blur-sm"
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
                      {"Simulation Settings ".repeat(10)}
                      {`${loremIpsum} `.repeat(3)}
                    </FooterTabContent>
                  )}
                  {selectedTab === "color-settings" && (
                    <FooterTabContent
                      tabName="color-settings"
                      key="color-settings"
                    >
                      {"Color Settings ".repeat(10)}
                      {`${loremIpsum} `.repeat(3)}
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
