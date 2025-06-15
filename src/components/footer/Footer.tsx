import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useDragControls,
  useMotionValue,
  useTransform,
  useVelocity,
} from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import ClockSettings from "./ClockSettings";
import ColorSettings from "./ColorSettings";
import FooterTabButton from "./FooterTabButton";
import FooterTabContent from "./FooterTabContent";
import SimulationSettings from "./SimulationSettings";

const MIN_FOOTER_HEIGHT = window.innerHeight * 0.1;
const MAX_FOOTER_HEIGHT = window.innerHeight * 0.9;

function getValueInFooterBounds(value: number): number {
  return Math.max(MIN_FOOTER_HEIGHT, Math.min(MAX_FOOTER_HEIGHT, value));
}

export default function Footer() {
  const isOpen = useSlimeStore((state) => state.footerState.footerIsOpen);
  const setIsOpen = useSlimeStore((state) => state.footerStateSetFooterIsOpen);
  const selectedTab = useSlimeStore((state) => state.footerState.selectedTab);
  const isDimmedForEdit = useSlimeStore(
    (state) => state.footerState.isDimmedForEdit,
  );
  const lastDragRef = useRef<number>(Date.now());
  const draggedMaxHeightRef = useRef<number>(256);
  const dragDistanceRef = useRef<number>(0);

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

  const controls = useDragControls();
  const dragOffset = useMotionValue(0);
  const dragVelocity = useVelocity(dragOffset);
  const draggedMaxHeight = useTransform(() => {
    const current = dragOffset.get();
    const previous = dragOffset.getPrevious();
    const delta = current - (previous || 0);
    console.log("dragDistanceRef.current", dragDistanceRef.current);
    dragDistanceRef.current -= delta;
    let newHeight = draggedMaxHeightRef.current;
    if (isOpen) {
      newHeight = getValueInFooterBounds(draggedMaxHeightRef.current - delta);
      draggedMaxHeightRef.current = newHeight;
    }
    return newHeight;
  });

  return (
    <motion.div
      className="fixed bottom-0 left-0 h-full w-full"
      animate={{
        backgroundColor: isOpen ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0)",
      }}
      onClick={() => {
        if (isOpen && Date.now() - lastDragRef.current > 100) {
          setIsOpen(false);
        }
      }}
    >
      <motion.div
        className="pointer-events-none absolute bottom-1/2 left-1/2 -z-[999999] h-8 w-8 rounded-2xl bg-red-400"
        drag="y"
        dragControls={controls}
        dragListener={false}
        onDrag={() => (lastDragRef.current = Date.now())}
        // dragMomentum={false}
        onDragEnd={() => {
          if (
            (dragVelocity.get() < -500 || dragDistanceRef.current > -100) &&
            !isOpen
          ) {
            setIsOpen(true);
          } else if (dragVelocity.get() > 500 && isOpen) {
            setIsOpen(false);
          }
          dragDistanceRef.current = 0;
        }}
        style={{
          y: dragOffset,
        }}
      />
      <LayoutGroup>
        <motion.div
          layout
          className="fixed bottom-0 left-0 flex w-full flex-col justify-center"
          key="footer-container"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxHeight: draggedMaxHeight,
          }}
        >
          {/* Then a container for the tab buttons */}
          <motion.div
            className={
              "flex w-full touch-none items-end justify-center p-2" +
              (isDimmedForEdit ? "" : " backdrop-blur-sm")
            }
            onPointerDown={(e) => controls.start(e)}
            animate={{
              backgroundColor: isOpen ? "#f87171dd" : "#00000000",
              opacity: isDimmedForEdit ? 0.1 : 1,
            }}
            key="footer-tab-buttons-container"
          >
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
          </motion.div>
          {/* Then a container for the tab content */}
          <motion.div
            className={
              "flex w-full grow justify-center overflow-x-hidden overflow-y-auto" +
              (isDimmedForEdit ? "" : " backdrop-blur-sm")
            }
            key="footer-tab-content-container"
            animate={{
              backgroundColor: isOpen ? "#f87171dd" : "#00000000",
              opacity: isDimmedForEdit ? 0.1 : 1,
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
