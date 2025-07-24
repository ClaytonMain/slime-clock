import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import { type ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import SlimeStoreSlider from "./SlimeStoreSlider";

export default function SlimeStoreSliderControl({
  label,
  labelHoverTabContentDisplay,
  baseInputId,
  min,
  max,
  step,
  storePath,
  onValueChange,
  listen = true,
  type = "slider",
  hideSlider = false,
  boundValue = true,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  baseInputId?: string;
  min: number;
  max: number;
  step?: number;
  storePath: string[];
  onValueChange?: (value: number[]) => void;
  listen?: boolean;
  type?: "slider" | "range";
  hideSlider?: boolean;
  boundValue?: boolean;
}) {
  const inputId = `${baseInputId}-input`;

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
      className="flex w-full items-center gap-1 py-2"
    >
      <div className="flex flex-none items-center gap-1 p-0.5">
        {label && (
          <Label.Root
            className="h-full w-(--footer-left-label-width) flex-none place-content-center p-0.5 text-right text-xs leading-none font-medium select-none"
            htmlFor={inputId}
          >
            {label}
          </Label.Root>
        )}
        {type === "range" && (
          <div className="flex w-18 flex-none items-center justify-center border border-transparent px-2 py-1" />
        )}
      </div>
      <SlimeStoreSlider
        baseInputId={inputId}
        min={min}
        max={max}
        step={step}
        storePath={storePath}
        onValueChange={onValueChange}
        listen={listen}
        type={type}
        hideSlider={hideSlider}
        boundValue={boundValue}
      />
    </motion.div>
  );
}
