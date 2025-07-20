import { produce } from "immer";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function ControlButton({
  label,
  labelHoverTabContentDisplay,
  baseId,
  onClick,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  baseId?: string;
  onClick?: () => void;
}) {
  function handlePointerOver() {
    if (labelHoverTabContentDisplay) {
      useSlimeStore.setState(
        produce((state) => {
          state.controlsState.displayAreaContentUpdatedAt = Date.now();
          state.controlsState.displayAreaContentName = null;
          state.controlsState.displayAreaHtmlContent =
            labelHoverTabContentDisplay;
          state.controlsState.displayAreaContentType = "html";
        }),
      );
    }
  }

  return (
    <motion.div
      onPointerOver={handlePointerOver}
      whileHover={{ backgroundColor: "#0004" }}
      className="flex w-full items-center justify-center gap-1 py-2"
    >
      <motion.button
        className="flex cursor-pointer border border-sky-800 px-2 py-1"
        id={baseId}
        onClick={onClick}
        style={{ backgroundColor: "#18181b" }}
        whileHover={{ backgroundColor: "#27272a" }}
      >
        {label}
      </motion.button>
    </motion.div>
  );
}
