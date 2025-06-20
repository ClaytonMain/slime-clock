import { produce } from "immer";
import {
  animate,
  AnimatePresence,
  LayoutGroup,
  motion,
  useDragControls,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useState } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { FooterTabName } from "../../types/types";
import Tooltip from "../tooltip/Tooltip";
import FooterTabButton from "./FooterTabButton";
import FooterTabContent from "./FooterTabContent";

/**
 * Referenced https://examples.motion.dev/react/use-presence-data
 * for the footer tab content animation.
 */
const HEADER_HEIGHT = 64;

const TAB_ORDER: FooterTabName[] = [
  "clock-settings",
  "simulation-settings",
  "color-settings",
];

function getDirection(
  currentTab: FooterTabName,
  previousTab: FooterTabName,
): number {
  const currentIndex = TAB_ORDER.indexOf(currentTab);
  const previousIndex = TAB_ORDER.indexOf(previousTab);
  if (currentIndex === -1 || previousIndex === -1) return 0;
  return currentIndex - previousIndex;
}

function getFooterBounds(): {
  minHeight: number;
  maxHeight: number;
  openHeight: number;
} {
  const minHeight = 64;
  const maxHeight = window.innerHeight - HEADER_HEIGHT;
  const openHeight = 3.0 * minHeight;
  return { minHeight, maxHeight, openHeight };
}

function getValueInFooterBounds(value: number): number {
  const { minHeight, maxHeight } = getFooterBounds();
  return Math.max(minHeight, Math.min(maxHeight, value));
}

export default function Footer() {
  /**
   * Footer open/close/edit state stuff.
   */
  const isOpen = useSlimeStore((state) => state.footerState.footerIsOpen);
  const storeFooterOpenHeight = useSlimeStore(
    (state) => state.footerState.openHeight,
  );
  const setIsOpen = useSlimeStore((state) => state.footerStateSetFooterIsOpen);
  const isDimmedForEdit = useSlimeStore(
    (state) => state.footerState.isDimmedForEdit,
  );
  const [dragging, setDragging] = useState(false);

  function handleFooterChange(open: boolean) {
    const { minHeight, openHeight } = getFooterBounds();
    if (open) {
      const newHeight = getValueInFooterBounds(
        Math.max(
          useSlimeStore.getState().footerState.openHeight,
          openHeight,
          draggedHeight.get(),
        ),
      );
      if (!isOpen) {
        animate(draggedHeight, newHeight, {
          type: "spring",
          duration: 0.5,
          bounce: 0.2,
        });
        setIsOpen(true);
      }
    } else {
      animate(draggedHeight, minHeight, {
        type: "spring",
        duration: 0.5,
        bounce: 0.2,
      });
      if (isOpen) {
        setIsOpen(false);
      }
    }
  }

  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      handleFooterChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  /**
   * Footer tab selection stuff.
   */
  const [selectedTab, setSelectedTab] = useState<FooterTabName>(
    useSlimeStore.getState().footerState.selectedTab,
  );
  const [direction, setDirection] = useState<number>(0);
  function handleTabButtonClick(clickedOn: FooterTabName) {
    const direction = getDirection(clickedOn, selectedTab);
    setSelectedTab(clickedOn);
    setDirection(direction);
    handleFooterChange(true);
    useSlimeStore.setState(
      produce((state) => {
        state.footerState.selectedTab = clickedOn;
      }),
    );
  }

  /**
   * Footer drag stuff.
   */
  const controls = useDragControls();
  const dragOffset = useMotionValue(0);
  const draggedHeight = useMotionValue(storeFooterOpenHeight);

  const heightBasedOpacityControl = useTransform(() => {
    const { openHeight, minHeight } = getFooterBounds();
    const currentHeight = draggedHeight.get();
    const returnValue = Math.min(
      1,
      Math.max(0, (currentHeight - minHeight) / (openHeight - minHeight)),
    );
    return returnValue;
  });
  const backdropBgColor = useTransform(
    heightBasedOpacityControl,
    [0, 1],
    ["rgba(0, 0, 0, 0.0)", "rgba(0, 0, 0, 0.1)"],
  );
  const footerBgColor = useTransform(
    heightBasedOpacityControl,
    [0, 1],
    ["#00000000", "#f87171dd"],
  );

  // useMotionValueEvent(dragDelta, "change", (value) => {
  //   draggedHeight.set(getValueInFooterBounds(draggedHeight.get() - value));
  // });

  return (
    <motion.div
      className="fixed bottom-0 left-0 h-full w-full"
      style={{
        backgroundColor: backdropBgColor,
      }}
      onClick={() => {
        if (!dragging) {
          handleFooterChange(false);
        }
      }}
    >
      <Tooltip />
      <motion.div
        className="pointer-events-none absolute bottom-1/2 -left-1/2 -z-[999999] h-8 w-8"
        id="there-has-got-to-be-a-better-way-to-do-this"
        drag="y"
        dragControls={controls}
        dragListener={false}
        onDragStart={() => setDragging(true)}
        onDrag={(_, info) => {
          const newDraggedHeight = getValueInFooterBounds(
            draggedHeight.get() - info.delta.y,
          );
          draggedHeight.set(newDraggedHeight);
        }}
        onDragEnd={() => {
          const { openHeight } = getFooterBounds();
          const currentHeight = draggedHeight.get();
          if (currentHeight < openHeight) {
            handleFooterChange(false);
          } else {
            handleFooterChange(true);
          }
          useSlimeStore.setState(
            produce((state) => {
              state.footerState.openHeight = Math.max(
                currentHeight,
                openHeight,
              );
            }),
          );
          setDragging(false);
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
          animate={{
            opacity: isDimmedForEdit ? 0.1 : 1,
            transition: isDimmedForEdit ? { duration: 0.5 } : { duration: 1.5 },
          }}
          style={{
            height: draggedHeight,
          }}
        >
          {/* Drag handle */}
          <motion.div
            className="absolute -top-[6px] z-[999999] h-[12px] w-full"
            key="footer-drag-handle"
            whileHover={{
              cursor: "ns-resize",
              backgroundColor: "#fff2",
            }}
            style={{ backgroundColor: "#fff0" }}
            onPointerDown={(e) => controls.start(e)}
          />
          {/* Then a container for the tab buttons */}
          <motion.div
            className={
              "flex w-full touch-none items-end justify-center p-2" +
              (isDimmedForEdit ? "" : " backdrop-blur-sm")
            }
            style={{
              backgroundColor: footerBgColor,
            }}
            key="footer-tab-buttons-container"
          >
            <FooterTabButton
              tabName="clock-settings"
              displayName="Clock Settings"
              onClick={handleTabButtonClick}
            />
            <FooterTabButton
              tabName="simulation-settings"
              displayName="Simulation Settings"
              onClick={handleTabButtonClick}
            />
            <FooterTabButton
              tabName="color-settings"
              displayName="Color Settings"
              onClick={handleTabButtonClick}
            />
          </motion.div>

          {/* Then a container for the tab content */}
          <motion.div
            className={
              "flex w-full grow justify-center overflow-hidden" +
              (isDimmedForEdit ? "" : " backdrop-blur-sm")
            }
            key="footer-tab-content-container"
            style={{
              backgroundColor: footerBgColor,
              opacity: heightBasedOpacityControl,
            }}
            transition={{
              when: "beforeChildren",
            }}
          >
            <AnimatePresence
              custom={direction}
              initial={false}
              mode="popLayout"
            >
              <FooterTabContent key={selectedTab} selectedTab={selectedTab} />
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </LayoutGroup>
    </motion.div>
  );
}
