import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import { type ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { SelectOption } from "../../types/types";
import SlimeStoreSelect from "./SlimeStoreSelect";

export default function SlimeStoreSelectControl({
  label,
  labelHoverTabContentDisplay,
  baseInputId,
  placeholder,
  storePath,
  options,
  onValueChange,
  listen = true,
  valueType = "string",
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  baseInputId?: string;
  placeholder?: string;
  storePath: string[];
  options: SelectOption<string>[];
  onValueChange?: (value: string) => void;
  listen?: boolean;
  valueType?: "string" | "number";
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
      className="flex w-full items-center gap-1 py-2"
    >
      <div className="flex flex-col items-center p-0.5">
        {label && (
          <Label.Root
            className="h-full w-(--footer-left-label-width) flex-none place-content-center p-0.5 text-right text-xs leading-none font-medium"
            htmlFor={baseInputId}
          >
            {label}
          </Label.Root>
        )}
      </div>
      <SlimeStoreSelect
        baseInputId={baseInputId}
        placeholder={placeholder}
        storePath={storePath}
        options={options}
        onValueChange={onValueChange}
        listen={listen}
        valueType={valueType}
      />
    </motion.div>
  );
}
