import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import { type ReactNode } from "react";
import { SIMULATION_CONTROLS_CONFIGS } from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import SlimeStoreSlider from "./SlimeStoreSlider";
import SlimeStoreSwitch from "./SlimeStoreSwitch";

export default function SlimeStoreRandomizationControl({
  label,
  labelHoverTabContentDisplay,
  baseId,
  controlName,
  onCheckedChange,
  onRangeChange,
  listen,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  baseId?: string;
  controlName: keyof typeof SIMULATION_CONTROLS_CONFIGS;
  onCheckedChange?: (value: boolean) => void;
  onRangeChange?: (value: [number] | [number, number]) => void;
  listen?: boolean;
}) {
  const controlConfig = SIMULATION_CONTROLS_CONFIGS[controlName];

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
      <div className="flex flex-col items-center p-0.5">
        {label && (
          <Label.Root
            className="h-full w-(--footer-left-label-width) flex-none place-content-center p-0.5 text-right text-xs leading-none font-medium select-none"
            htmlFor={baseId}
          >
            {label}
          </Label.Root>
        )}
      </div>
      <div className="flex w-full items-center gap-1">
        <div className="flex w-18 flex-none items-center justify-center border border-transparent px-2 py-1">
          <SlimeStoreSwitch
            baseId={`${baseId}-switch`}
            storePath={[
              "simulationRandomizationSettings",
              controlName,
              "enabled",
            ]}
            onCheckedChange={onCheckedChange}
            listen={listen}
          />
        </div>
        <SlimeStoreSlider
          baseInputId={`${baseId}-slider`}
          min={controlConfig!.min as number}
          max={controlConfig!.max as number}
          step={controlConfig!.step as number}
          storePath={["simulationRandomizationSettings", controlName, "range"]}
          onValueChange={onRangeChange}
          listen={listen}
          type="range"
        />
      </div>
    </motion.div>
  );
}
