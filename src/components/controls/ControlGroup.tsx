import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import type { ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  TailwindItemsAlignOption,
  TailwindJustifyContentOption,
} from "../../types/types";

export default function ControlGroup({
  label,
  labelHoverTabContentDisplay,
  justifyContent = "start",
  itemsAlign = "center",
  labelWidth = "w-(--footer-left-label-width)",
  labelTextAlign = "text-right",
  onPointerOver,
  children,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  justifyContent?: TailwindJustifyContentOption;
  itemsAlign?: TailwindItemsAlignOption;
  labelWidth?: string;
  labelTextAlign?: string;
  onPointerOver?: () => void;
  children?: ReactNode;
}) {
  function handlePointerOver() {
    if (onPointerOver) {
      onPointerOver();
    } else if (labelHoverTabContentDisplay) {
      useSlimeStore.setState(
        produce((state) => {
          state.controlsState.displayAreaContentUpdatedAt = Date.now();
          state.controlsState.displayAreaContentName = null;
          state.controlsState.displayAreaHtmlContent =
            labelHoverTabContentDisplay;
          state.controlsState.hideDisplayAreaBackground = false;
        }),
      );
    }
  }

  return (
    <motion.div
      onPointerOver={handlePointerOver}
      whileHover={{ backgroundColor: "#0004" }}
      className="flex w-full gap-1 py-2 pr-3"
    >
      {label && (
        <div className="flex flex-col items-center px-1 py-0.5">
          <Label.Root
            className={`h-full ${labelWidth} flex-none place-content-center p-0.5 ${labelTextAlign} text-xs leading-none font-medium`}
          >
            {label}
          </Label.Root>
        </div>
      )}
      <div
        className={`flex w-full flex-wrap items-${itemsAlign} justify-${justifyContent} gap-1`}
        style={{
          paddingRight: "calc(var(--spacing) * 2)",
          paddingLeft: label ? undefined : "calc(var(--spacing) * 2)",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
