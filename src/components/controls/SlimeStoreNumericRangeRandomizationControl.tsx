import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import * as R from "ramda";
import { useEffect, useMemo, useState } from "react";
import {
  COLOR_CONTROLS_CONFIGS,
  PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS,
  SIMULATION_CONTROLS_CONFIGS,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  TailwindItemsAlignOption,
  TailwindJustifyContentOption,
} from "../../types/types";
import RandomizationPdfDisplayHtml from "../randomization-pdf-display/RandomizationPdfDisplayHtml";
import ControlGroup from "./ControlGroup";
import SlimeStoreSelect from "./SlimeStoreSelect";
import SlimeStoreSlider from "./SlimeStoreSlider";
import SlimeStoreSwitch from "./SlimeStoreSwitch";

type RandomizationSettingsStorePath = [
  "simulation" | "color",
  ...string[],
  (
    | keyof typeof SIMULATION_CONTROLS_CONFIGS
    | keyof typeof PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS
    | keyof typeof COLOR_CONTROLS_CONFIGS
  ),
];

export default function SlimeStoreNumericRangeRandomizationControl({
  label,
  justifyContent,
  itemsAlign,
  labelWidth,
  labelTextAlign,
  baseId,
  randomizationSettingsStorePath,
  settingStorePath,
  onCheckedChange,
  onRangeChange,
  listen,
}: {
  label?: string;
  justifyContent?: TailwindJustifyContentOption;
  itemsAlign?: TailwindItemsAlignOption;
  labelWidth?: string;
  labelTextAlign?: string;
  baseId?: string;
  randomizationSettingsStorePath: RandomizationSettingsStorePath;
  settingStorePath?: string[];
  onCheckedChange?: (value: boolean) => void;
  onRangeChange?: (
    value: [number] | [number, number] | [number, number, number],
  ) => void;
  listen?: boolean;
}) {
  const [currentValue, setCurrentValue] = useState<number>(
    settingStorePath
      ? (R.view(
          R.lensPath(settingStorePath),
          useSlimeStore.getState(),
        ) as number)
      : -999.0,
  );
  const settingType = randomizationSettingsStorePath[0];
  const controlName =
    randomizationSettingsStorePath[randomizationSettingsStorePath.length - 1];
  const controlConfig = useMemo(() => {
    if (settingType === "simulation") {
      return SIMULATION_CONTROLS_CONFIGS[
        controlName as keyof typeof SIMULATION_CONTROLS_CONFIGS
      ];
    } else if (settingType === "color") {
      if (randomizationSettingsStorePath.includes("proceduralColorPalette")) {
        return PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS[
          controlName as keyof typeof PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS
        ];
      } else {
        return COLOR_CONTROLS_CONFIGS[
          controlName as keyof typeof COLOR_CONTROLS_CONFIGS
        ];
      }
    }
    return null;
  }, [controlName, settingType, randomizationSettingsStorePath]);
  const [editing, setEditing] = useState(false);

  const randomizationSettings = useSlimeStore((state) =>
    R.view(
      R.lensPath(["randomizationSettings", ...randomizationSettingsStorePath]),
      state,
    ),
  );
  useEffect(() => {
    if (!editing) return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaContentUpdatedAt = Date.now();
        state.controlsState.displayAreaContentName = "randomization-pdf";
        state.controlsState.displayAreaHtmlContent = (
          <RandomizationPdfDisplayHtml />
        );
        state.controlsState.hideDisplayAreaBackground = true;
        state.controlsState.displayAreaPdfValues = {
          currentSettingTitle: label || controlName,
          currentSettingValue: currentValue,
          controlConfig: controlConfig,
          numericRangeRandomizationSettings: randomizationSettings,
        };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomizationSettings]);

  useEffect(() => {
    if (!settingStorePath) return;
    const unsubSetting = useSlimeStore.subscribe(
      (state) => R.view(R.lensPath(settingStorePath), state),
      (newValue) => {
        setCurrentValue(newValue as number);
      },
    );
    return () => {
      unsubSetting();
    };
  }, [settingStorePath]);

  function handlePointerOver() {
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaContentUpdatedAt = Date.now();
        state.controlsState.displayAreaContentName = "randomization-pdf";
        state.controlsState.displayAreaHtmlContent = (
          <RandomizationPdfDisplayHtml />
        );
        state.controlsState.hideDisplayAreaBackground = true;
        state.controlsState.displayAreaPdfValues = {
          currentSettingTitle: label || controlName,
          currentSettingValue: currentValue,
          controlConfig: controlConfig,
          numericRangeRandomizationSettings: randomizationSettings,
        };
      }),
    );
  }

  function handlePointerDown() {
    setEditing(true);
  }

  function handlePointerUp() {
    setEditing(false);
  }

  return (
    <ControlGroup
      label={label}
      justifyContent={justifyContent}
      itemsAlign={itemsAlign}
      labelWidth={labelWidth}
      labelTextAlign={labelTextAlign}
      onPointerOver={handlePointerOver}
    >
      <motion.div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="flex w-full items-center gap-1"
      >
        <div className="flex flex-none flex-col">
          <div className="flex flex-none flex-col-reverse items-center justify-center sm:flex-row">
            <Label.Root
              className="w-11 flex-none py-0.5 text-center text-xs sm:text-right"
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
          <div className="flex flex-none flex-col-reverse items-center justify-center sm:flex-row">
            <Label.Root
              className="w-11 flex-none py-0.5 text-center text-xs sm:text-right"
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
                  { label: "PERT", value: "pert" },
                ]}
              />
            </div>
          </div>
        </div>
        {randomizationSettings.mode === "flat" && (
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
        {randomizationSettings.mode === "gaussian" && (
          <div className="flex w-full flex-col gap-1">
            <div className="flex h-full gap-1">
              <Label.Root className="flex w-4 flex-none items-center justify-end text-right text-xs">
                μ
              </Label.Root>
              <SlimeStoreSlider
                baseInputId={`${baseId}-gaussian-mu-range-slider`}
                min={controlConfig!.min as number}
                max={controlConfig!.max as number}
                step={controlConfig!.step as number}
                storePath={[
                  "randomizationSettings",
                  ...randomizationSettingsStorePath,
                  "gaussMu",
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
                min={0}
                max={
                  (controlConfig!.max as number) -
                  (controlConfig!.min as number)
                }
                step={controlConfig!.step as number}
                storePath={[
                  "randomizationSettings",
                  ...randomizationSettingsStorePath,
                  "gaussSigma",
                ]}
                listen={listen}
                type="slider"
              />
            </div>
          </div>
        )}
        {randomizationSettings.mode === "pert" && (
          <SlimeStoreSlider
            baseInputId={`${baseId}-flat-range-slider`}
            min={controlConfig!.min as number}
            max={controlConfig!.max as number}
            step={controlConfig!.step as number}
            storePath={[
              "randomizationSettings",
              ...randomizationSettingsStorePath,
              "pertMinModeMax",
            ]}
            onValueChange={onRangeChange}
            listen={listen}
            type="minModeMax"
          />
        )}
      </motion.div>
    </ControlGroup>
  );
}
