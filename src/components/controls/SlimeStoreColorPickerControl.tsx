import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import type { ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import SlimeStoreColorPicker from "./SlimeStoreColorPicker";

export default function SlimeStoreColorPickerControl({
  label,
  labelHoverTabContentDisplay,
  baseId,
  storePath,
  onValueChange,
  listen = true,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  baseId?: string;
  storePath: string[];
  onValueChange?: (newColor: string) => void;
  listen?: boolean;
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
            htmlFor={baseId}
          >
            {label}
          </Label.Root>
        )}
      </div>
      <SlimeStoreColorPicker
        baseId={baseId}
        storePath={storePath}
        onValueChange={onValueChange}
        listen={listen}
      />
    </motion.div>
  );
}
