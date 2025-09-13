import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import type { ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  TailwindItemsAlignOption,
  TailwindJustifyContentOption,
} from "../../types/types";
import SlimeStoreSwitch from "./SlimeStoreSwitch";

export default function SwitchControlGroup({
  label,
  labelHoverTabContentDisplay,
  justifyContent = "start",
  itemsAlign = "center",
  switchConfigs,
}: {
  label?: string; // If you want to label the row containing the switches.
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  justifyContent?: TailwindJustifyContentOption;
  itemsAlign?: TailwindItemsAlignOption;
  switchConfigs: {
    label: string;
    baseId?: string;
    storePath: string[];
    onCheckedChange?: (value: boolean) => void;
    listen?: boolean;
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
        {switchConfigs.map((switchConfig, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center justify-center bg-[#0002] p-1"
          >
            <Label.Root
              className="w-full text-center"
              htmlFor={switchConfig.baseId}
            >
              {switchConfig.label}
            </Label.Root>
            <SlimeStoreSwitch
              baseId={switchConfig.baseId}
              storePath={switchConfig.storePath}
              onCheckedChange={switchConfig.onCheckedChange}
              listen={switchConfig.listen}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
