import { produce } from "immer";
import { useEffect } from "react";
import {
  PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS,
  SIMULATION_CONTROLS_CONFIGS,
} from "../../constants/constants.tsx";
import useSlimeStore from "../../stores/useSlimeStore.tsx";
import type {
  ColorRandomizationSettings,
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
      numericRangeRandConfig.mu,
      numericRangeRandConfig.sigma,
    );
  }
  if (step) {
    randValue = UTILS.roundToFixed(Math.round(randValue / step) * step, 4);
  }
  return randValue;
}

function getOptionListRandomValue(
  optionListRandConfig: OptionListRandomizationSetting,
): string | null {
  const enabledOptions = optionListRandConfig.options.filter(
    (opt) => opt.enabled,
  );
  if (enabledOptions.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * enabledOptions.length);
  return enabledOptions[randomIndex].value;
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
              } else if (randConfig.type === "optionList") {
                const randomValue = getOptionListRandomValue(randConfig);
                if (randomValue !== null) {
                  state.simulationSettings[settingKey] = randomValue;
                }
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
              } else if (randConfig.type === "optionList") {
                const randomValue = getOptionListRandomValue(randConfig);
                if (randomValue !== null) {
                  state.simulationSettings[settingKey] = randomValue;
                }
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
      randomizationState.proceduralColorPaletteRandomizationRequestedAt <=
      randomizationState.proceduralColorPaletteRandomizationCompletedAt
    )
      return;
    useSlimeStore.setState(
      produce((state) => {
        state.randomizationState.proceduralColorPaletteRandomizationCompletedAt =
          Date.now();
        if (randomizationSettings.allowProceduralColorPaletteRandomization) {
          state.colorSettings.slimeColorChangedAt = Date.now();
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
                    randConfig.mu,
                    randConfig.sigma,
                  );
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
        }
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomizationState.proceduralColorPaletteRandomizationRequestedAt]);

  // Background color randomization listener.
  useEffect(() => {
    if (
      randomizationState.backgroundColorRandomizationRequestedAt <=
      randomizationState.backgroundColorRandomizationCompletedAt
    )
      return;
    useSlimeStore.setState(
      produce((state) => {
        state.randomizationState.backgroundColorRandomizationCompletedAt =
          Date.now();
        if (randomizationSettings.allowBackgroundColorRandomization) {
          state.colorSettings.backgroundColor = UTILS.generateRandomColor();
        }
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomizationState.backgroundColorRandomizationRequestedAt]);

  return null;
}
