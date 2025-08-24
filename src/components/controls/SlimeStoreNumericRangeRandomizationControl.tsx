import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import * as R from "ramda";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS,
  SIMULATION_CONTROLS_CONFIGS,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type { NumericRangeRandomizationSettingMode } from "../../types/types";
import SlimeStoreSelect from "./SlimeStoreSelect";
import SlimeStoreSlider from "./SlimeStoreSlider";
import SlimeStoreSwitch from "./SlimeStoreSwitch";

type RandomizationSettingsStorePath = [
  "simulation" | "color",
  ...string[],
  (
    | keyof typeof SIMULATION_CONTROLS_CONFIGS
    | keyof typeof PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS
  ),
];

export default function SlimeStoreNumericRangeRandomizationControl({
  label,
  labelHoverTabContentDisplay,
  baseId,
  randomizationSettingsStorePath,
  onCheckedChange,
  onRangeChange,
  listen,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  baseId?: string;
  randomizationSettingsStorePath: RandomizationSettingsStorePath;
  onCheckedChange?: (value: boolean) => void;
  onRangeChange?: (value: [number] | [number, number]) => void;
  listen?: boolean;
}) {
  const settingType = randomizationSettingsStorePath[0];
  const controlName =
    randomizationSettingsStorePath[randomizationSettingsStorePath.length - 1];
  const controlConfig = useMemo(() => {
    if (settingType === "simulation") {
      return SIMULATION_CONTROLS_CONFIGS[
        controlName as keyof typeof SIMULATION_CONTROLS_CONFIGS
      ];
    } else if (settingType === "color") {
      return PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS[
        controlName as keyof typeof PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS
      ];
    }
    return null;
  }, [controlName, settingType]);
  const randomizationModeStorePath = useMemo(
    () => ["randomizationSettings", ...randomizationSettingsStorePath, "mode"],
    [randomizationSettingsStorePath],
  );
  const [randomizationMode, setRandomizationMode] =
    useState<NumericRangeRandomizationSettingMode>(
      R.view(R.lensPath(randomizationModeStorePath), useSlimeStore.getState()),
    );

  useEffect(() => {
    const unsubRandomizationMode = useSlimeStore.subscribe(
      (state) => R.view(R.lensPath(randomizationModeStorePath), state),
      (newValue) => {
        setRandomizationMode(newValue);
      },
    );
    return () => {
      unsubRandomizationMode();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <div className="flex flex-none flex-col">
          <div className="flex flex-none items-center justify-center gap-2 p-1">
            <Label.Root
              className="w-11 flex-none py-0.5 text-right text-xs"
              htmlFor={`${baseId}-enabled-switch`}
            >
              Enabled
            </Label.Root>
            <div className="flex w-24 flex-none items-center justify-center">
              <SlimeStoreSwitch
                baseId={`${baseId}-enabled-switch`}
                storePath={[
                  "randomizationSettings",
                  ...randomizationSettingsStorePath,
                  "enabled",
                ]}
                onCheckedChange={onCheckedChange}
                listen={listen}
              />
            </div>
          </div>
          <div className="flex flex-none items-center justify-center gap-2 p-1">
            <Label.Root
              className="w-11 flex-none py-0.5 text-right text-xs"
              htmlFor={`${baseId}-randomization-mode-select`}
            >
              Mode
            </Label.Root>
            <div className="flex w-24 flex-none items-center justify-center">
              <SlimeStoreSelect
                baseInputId={`${baseId}-randomization-mode-select`}
                storePath={[
                  "randomizationSettings",
                  ...randomizationSettingsStorePath,
                  "mode",
                ]}
                options={[
                  { label: "Flat", value: "flat" },
                  { label: "Gaussian", value: "gaussian" },
                ]}
              />
            </div>
          </div>
        </div>
        {randomizationMode === "flat" && (
          <SlimeStoreSlider
            baseInputId={`${baseId}-flat-range-slider`}
            min={controlConfig!.min as number}
            max={controlConfig!.max as number}
            step={controlConfig!.step as number}
            storePath={[
              "randomizationSettings",
              ...randomizationSettingsStorePath,
              "flatRange",
            ]}
            onValueChange={onRangeChange}
            listen={listen}
            type="range"
          />
        )}
        {randomizationMode === "gaussian" && (
          <div className="flex w-full flex-col gap-1">
            <div className="flex h-full gap-1">
              <Label.Root className="flex w-4 flex-none items-center justify-end text-right text-xs">
                μ
              </Label.Root>
              <SlimeStoreSlider
                baseInputId={`${baseId}-gaussian-mu-range-slider`}
                min={0}
                max={
                  (controlConfig!.max as number) -
                  (controlConfig!.min as number)
                }
                step={controlConfig!.step as number}
                storePath={[
                  "randomizationSettings",
                  ...randomizationSettingsStorePath,
                  "mu",
                ]}
                listen={listen}
                type="slider"
              />
            </div>
            <div className="flex gap-1">
              <Label.Root className="flex w-4 flex-none items-center justify-end text-right text-xs">
                σ
              </Label.Root>
              <SlimeStoreSlider
                baseInputId={`${baseId}-gaussian-sigma-range-slider`}
                min={controlConfig!.min as number}
                max={controlConfig!.max as number}
                step={controlConfig!.step as number}
                storePath={[
                  "randomizationSettings",
                  ...randomizationSettingsStorePath,
                  "sigma",
                ]}
                listen={listen}
                type="slider"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
