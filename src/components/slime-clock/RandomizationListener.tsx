import { produce } from "immer";
import { useEffect } from "react";
import {
  COLOR_CONTROLS_CONFIGS,
  PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS,
  SIMULATION_CONTROLS_CONFIGS,
} from "../../constants/constants.tsx";
import useSlimeStore from "../../stores/useSlimeStore.tsx";
import type {
  ColorRandomizationSettings,
  ColorSettings,
  NumericRangeRandomizationSetting,
  OptionListRandomizationSetting,
  ProceduralColorPaletteChannelRandomizationSettings,
  SimulationSettings,
} from "../../types/types.tsx";
import * as UTILS from "../../utils/utils.tsx";

function getNumericRangeRandomValue(
  numericRangeRandConfig: NumericRangeRandomizationSetting,
  min: number,
  max: number,
  step?: number,
): number {
  let randValue: number = -999.0;
  if (numericRangeRandConfig.mode === "flat") {
    randValue = UTILS.randBetween(...numericRangeRandConfig.flatRange);
  } else if (numericRangeRandConfig.mode === "gaussian") {
    randValue = UTILS.getGaussRandomInControlBounds(
      min,
      max,
      numericRangeRandConfig.gaussMu,
      numericRangeRandConfig.gaussSigma,
    );
  } else if (numericRangeRandConfig.mode === "pert") {
    randValue = UTILS.getPertRandom(...numericRangeRandConfig.pertMinModeMax);
  }
  if (step) {
    randValue = UTILS.roundToFixed(Math.round(randValue / step) * step, 4);
  }
  return randValue;
}

export default function RandomizationListener() {
  const randomizationState = useSlimeStore((state) => state.randomizationState);
  const randomizationSettings = useSlimeStore(
    (state) => state.randomizationSettings,
  );
  const debugConsoleLogger = useSlimeStore((state) => state.debugConsoleLogger);

  // Agent randomization listener.
  useEffect(() => {
    debugConsoleLogger(
      "Agent randomization requested",
      randomizationState.agentRandomizationRequestedAt,
      randomizationState.agentRandomizationCompletedAt,
    );
    if (
      randomizationState.agentRandomizationRequestedAt <=
      randomizationState.agentRandomizationCompletedAt
    )
      return;

    useSlimeStore.setState(
      produce((state) => {
        state.randomizationState.agentRandomizationCompletedAt = Date.now();
        if (randomizationSettings.allowAgentRandomization) {
          Object.entries(randomizationSettings.simulation).forEach(
            ([key, value]) => {
              const settingKey = key as keyof SimulationSettings;
              const randConfig = value as
                | NumericRangeRandomizationSetting
                | OptionListRandomizationSetting;
              if (!settingKey.startsWith("agent") || !randConfig.enabled)
                return;
              if (randConfig.type === "numericRange") {
                state.simulationSettings[settingKey] =
                  getNumericRangeRandomValue(
                    randConfig,
                    SIMULATION_CONTROLS_CONFIGS[settingKey]!.min as number,
                    SIMULATION_CONTROLS_CONFIGS[settingKey]!.max as number,
                    SIMULATION_CONTROLS_CONFIGS[settingKey]!.step,
                  );
              }
            },
          );
        }
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomizationState.agentRandomizationRequestedAt]);

  // Trail randomization listener.
  useEffect(() => {
    if (
      randomizationState.trailRandomizationRequestedAt <=
      randomizationState.trailRandomizationCompletedAt
    )
      return;
    useSlimeStore.setState(
      produce((state) => {
        state.randomizationState.trailRandomizationCompletedAt = Date.now();
        if (randomizationSettings.allowTrailRandomization) {
          Object.entries(randomizationSettings.simulation).forEach(
            ([key, value]) => {
              const settingKey = key as keyof SimulationSettings;
              const randConfig = value as
                | NumericRangeRandomizationSetting
                | OptionListRandomizationSetting;
              if (!settingKey.startsWith("trail") || !randConfig.enabled)
                return;
              if (randConfig.type === "numericRange") {
                state.simulationSettings[settingKey] =
                  getNumericRangeRandomValue(
                    randConfig,
                    SIMULATION_CONTROLS_CONFIGS[settingKey]!.min as number,
                    SIMULATION_CONTROLS_CONFIGS[settingKey]!.max as number,
                    SIMULATION_CONTROLS_CONFIGS[settingKey]!.step,
                  );
              }
            },
          );
        }
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomizationState.trailRandomizationRequestedAt]);

  // Procedural color palette randomization listener.
  useEffect(() => {
    if (
      randomizationState.colorRandomizationRequestedAt <=
      randomizationState.colorRandomizationCompletedAt
    )
      return;
    useSlimeStore.setState(
      produce((state) => {
        state.randomizationState.colorRandomizationCompletedAt = Date.now();
        if (randomizationSettings.allowColorRandomization) {
          state.colorSettings.slimeColorChangedAt = Date.now();

          // Color Palette
          const paletteRandomizationSettings =
            randomizationSettings.color.proceduralColorPalette;
          Object.entries(paletteRandomizationSettings).forEach(
            ([key, value]) => {
              const channelKey =
                key as keyof ColorRandomizationSettings["proceduralColorPalette"];
              const channelConfig =
                value as ProceduralColorPaletteChannelRandomizationSettings;
              Object.entries(channelConfig).forEach(([subKey, subValue]) => {
                const settingKey =
                  subKey as keyof ProceduralColorPaletteChannelRandomizationSettings;
                const randConfig = subValue as NumericRangeRandomizationSetting;
                let randValue: number = -999.0;
                if (randConfig.mode === "flat") {
                  randValue = UTILS.randBetween(...randConfig.flatRange);
                } else if (randConfig.mode === "gaussian") {
                  randValue = UTILS.getGaussRandomInControlBounds(
                    PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS[settingKey]!
                      .min as number,
                    PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS[settingKey]!
                      .max as number,
                    randConfig.gaussMu,
                    randConfig.gaussSigma,
                  );
                } else if (randConfig.mode === "pert") {
                  randValue = UTILS.getPertRandom(...randConfig.pertMinModeMax);
                }
                const step =
                  PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS[settingKey]!.step;
                if (step) {
                  randValue = UTILS.roundToFixed(
                    Math.round(randValue / step) * step,
                    4,
                  );
                }
                state.colorSettings.proceduralColorPalette[channelKey][
                  settingKey
                ] = randValue;
              });
            },
          );

          // Background Color
          if (randomizationSettings.color.backgroundColor.enabled) {
            state.colorSettings.backgroundColor = UTILS.generateRandomColor();
          }

          // Tweaks & offsets
          const tweaksAndOffsetsRandomizationSettings = {
            ...randomizationSettings.color,
          };
          Object.entries(tweaksAndOffsetsRandomizationSettings).forEach(
            ([key, value]) => {
              if (["proceduralColorPalette", "backgroundColor"].includes(key)) {
                return;
              }
              const settingKey = key as keyof ColorSettings;
              const randConfig = value as NumericRangeRandomizationSetting;
              if (!randConfig.enabled) return;
              if (randConfig.type === "numericRange") {
                state.colorSettings[settingKey] = getNumericRangeRandomValue(
                  randConfig,
                  COLOR_CONTROLS_CONFIGS[settingKey]!.min as number,
                  COLOR_CONTROLS_CONFIGS[settingKey]!.max as number,
                  COLOR_CONTROLS_CONFIGS[settingKey]!.step as number,
                );
              }
            },
          );
        }
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomizationState.colorRandomizationRequestedAt]);

  return null;
}
