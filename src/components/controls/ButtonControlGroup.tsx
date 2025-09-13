import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import type { ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  TailwindItemsAlignOption,
  TailwindJustifyContentOption,
} from "../../types/types";

export default function ButtonControlGroup({
  label,
  labelHoverTabContentDisplay,
  justifyContent = "start",
  itemsAlign = "center",
  buttonConfigs,
}: {
  label?: string; // If you want to label the row containing the buttons.
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  justifyContent?: TailwindJustifyContentOption;
  itemsAlign?: TailwindItemsAlignOption;
  buttonConfigs: {
    label: string;
    baseId?: string;
    onClick: () => void;
    color?: "danger";
  }[];
}) {
  function handlePointerOver() {
    if (labelHoverTabContentDisplay) {
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
      className={`flex w-full gap-1 py-2`}
    >
      {label && (
        <div className="flex flex-col items-center p-0.5">
          <Label.Root className="h-full w-(--footer-left-label-width) flex-none place-content-center p-0.5 text-right text-xs leading-none font-medium">
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
        {buttonConfigs.map((buttonConfig, index) => (
          <motion.button
            key={index}
            className={[
              "flex cursor-pointer border px-2 py-1",
              buttonConfig.color === "danger"
                ? "border-red-800"
                : "border-sky-800",
            ].join(" ")}
            id={
              (buttonConfig.baseId ?? label)
                ? `${label}-${index}`
                : `button-${index}`
            }
            onClick={buttonConfig.onClick}
            style={{
              backgroundColor:
                buttonConfig.color === "danger" ? "#3b0a0a" : "#18181b",
            }}
            whileHover={{
              backgroundColor:
                buttonConfig.color === "danger" ? "#5c0d0d" : "#27272a",
            }}
          >
            {buttonConfig.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
