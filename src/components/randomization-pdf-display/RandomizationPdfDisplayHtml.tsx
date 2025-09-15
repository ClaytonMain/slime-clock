import { motion } from "motion/react";
import { useMemo } from "react";
import { ANIMATION_CONFIGS } from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type { DisplayAreaPdfValues } from "../../types/types";

const markerColors = [
  "#18181b",
  "#18181b",
  "#fecdd3",
  "#fb923c",
  "#f97316",
  "#f97316",
];

function normalizeBetween(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

type PositionValue = {
  x: number;
  y: number;
  label: string | null;
  displayValue: string | null;
};

function updatePositionValues(
  displayAreaPdfValues: DisplayAreaPdfValues,
): PositionValue[] {
  const positionValues: PositionValue[] = [];

  const min = displayAreaPdfValues.controlConfig.min;
  const max = displayAreaPdfValues.controlConfig.max;
  const randSettings = displayAreaPdfValues.numericRangeRandomizationSettings;

  positionValues.push({
    x: 0,
    y: 0,
    label: "Ctrl. Min",
    displayValue: min.toFixed(2),
  });
  positionValues.push({
    x: 1,
    y: 0,
    label: "Ctrl. Max",
    displayValue: max.toFixed(2),
  });
  positionValues.push({
    x: normalizeBetween(displayAreaPdfValues.currentSettingValue, min, max),
    y: 0,
    label: "Sim. Current",
    displayValue: displayAreaPdfValues.currentSettingValue.toFixed(2),
  });
  if (randSettings.mode === "flat") {
    const flatMin = normalizeBetween(randSettings.flatRange[0], min, max);
    const flatMax = normalizeBetween(randSettings.flatRange[1], min, max);
    positionValues.push({
      x: -1,
      y: -1,
      label: null,
      displayValue: null,
    });
    positionValues.push({
      x: flatMin,
      y: 0,
      label: "Rng. Min",
      displayValue: randSettings.flatRange[0].toFixed(2),
    });
    positionValues.push({
      x: flatMax,
      y: 0,
      label: "Rng. Max",
      displayValue: randSettings.flatRange[1].toFixed(2),
    });
  } else if (randSettings.mode === "gaussian") {
    const gaussMu = normalizeBetween(randSettings.gaussMu, min, max);
    const gaussSigma = randSettings.gaussSigma / (max - min);
    positionValues.push({
      x: gaussMu,
      y: 0,
      label: "μ",
      displayValue: randSettings.gaussMu.toFixed(2),
    });
    positionValues.push({
      x: gaussMu + gaussSigma,
      y: 0,
      label: "μ + σ",
      displayValue: (gaussMu + gaussSigma).toFixed(2),
    });
    positionValues.push({
      x: gaussMu - gaussSigma,
      y: 0,
      label: "μ - σ",
      displayValue: (gaussMu - gaussSigma).toFixed(2),
    });
  } else if (randSettings.mode === "pert") {
    const scaledMode = normalizeBetween(
      randSettings.pertMinModeMax[1],
      min,
      max,
    );
    const scaledMin = normalizeBetween(
      randSettings.pertMinModeMax[0],
      min,
      max,
    );
    const scaledMax = normalizeBetween(
      randSettings.pertMinModeMax[2],
      min,
      max,
    );
    positionValues.push({
      x: scaledMode,
      y: 0,
      label: "Mode",
      displayValue: randSettings.pertMinModeMax[1].toFixed(2),
    });
    positionValues.push({
      x: scaledMin,
      y: 0,
      label: "Min",
      displayValue: randSettings.pertMinModeMax[0].toFixed(2),
    });
    positionValues.push({
      x: scaledMax,
      y: 0,
      label: "Max",
      displayValue: randSettings.pertMinModeMax[2].toFixed(2),
    });
  }

  return positionValues;
}

export default function RandomizationPdfDisplayHtml() {
  const displayAreaPdfValues = useSlimeStore(
    (state) => state.controlsState.displayAreaPdfValues,
  );
  const positionValues: PositionValue[] = useMemo(
    () => updatePositionValues(displayAreaPdfValues),
    [displayAreaPdfValues],
  );

  return (
    <>
      <motion.div
        className="flex h-full grow flex-col justify-center"
        initial={{ opacity: 0 }}
        animate={ANIMATION_CONFIGS.flickerIn}
        exit={ANIMATION_CONFIGS.flickerOut}
        transition={{ delay: Math.random() * 0.1 + 0.3 }}
      >
        <div
          style={{ fontSize: "1.0rem" }}
          className="font-display w-full flex-none bg-zinc-950/80 py-1 text-center text-sky-300 select-none"
        >
          {displayAreaPdfValues.currentSettingTitle + " PDF"}
        </div>
        <div className="h-full overflow-hidden bg-zinc-900/0">
          <div className="flex size-full flex-col p-2 text-xs text-sky-50">
            {positionValues.map((pos, i) => {
              if (pos.label === null || pos.displayValue === null) return null;
              return (
                <div
                  key={pos.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className="mr-1 inline-block h-0.5 w-3"
                      style={{ backgroundColor: markerColors[i] }}
                    />
                    <span>{pos.label}</span>
                  </div>
                  <span>{pos.displayValue}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
