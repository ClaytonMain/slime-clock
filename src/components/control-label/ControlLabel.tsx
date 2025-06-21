import { produce } from "immer";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

const DISPLAY_VARIANT_CLASS_NAMES = {
  left: "me-1 h-full w-(--footer-left-label-width) flex-none place-content-center rounded-xs p-0.5 text-right text-xs font-medium text-label-text-a",
};

export default function ControlLabel({
  labelText,
  htmlFor,
  tooltipText,
  hoverState,
  displayVariant = "left",
}: {
  labelText: string;
  htmlFor?: string;
  tooltipText?: string;
  hoverState?: boolean;
  displayVariant?: "left";
}) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!tooltipText) return;
    if ((hoverState !== undefined && hoverState) || hovered) {
      useSlimeStore.setState(
        produce((state) => {
          state.tooltipActive = true;
          state.tooltipText = tooltipText;
        }),
      );
    } else {
      const currentTooltipText = useSlimeStore.getState().tooltipText;
      if (currentTooltipText === tooltipText) {
        useSlimeStore.setState(
          produce((state) => {
            state.tooltipActive = false;
          }),
        );
      }
    }
  }, [hoverState, hovered, tooltipText]);

  return (
    <motion.div
      className="me-1 flex flex-col items-center rounded-xs p-0.5"
      onMouseEnter={() => (hoverState === undefined ? setHovered(true) : null)}
      onMouseLeave={() => (hoverState === undefined ? setHovered(false) : null)}
      whileHover={{
        cursor: tooltipText ? "pointer" : "default",
        backgroundColor: tooltipText
          ? "rgba(0, 0, 0, 0.2)"
          : "rgba(0, 0, 0, 0)",
      }}
    >
      {displayVariant === "left" && (
        <label className={DISPLAY_VARIANT_CLASS_NAMES.left} htmlFor={htmlFor}>
          {labelText}
        </label>
      )}
    </motion.div>
  );
}
