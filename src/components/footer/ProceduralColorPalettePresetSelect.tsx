import { produce } from "immer";
import { useEffect } from "react";
import { PROCEDURAL_COLOR_PALETTE_PRESETS } from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type { ProceduralColorPaletteName } from "../../types/types";
import { roundToFixed } from "../../utils/utils";
import SlimeStoreSelect from "../slime-store-select/SlimeStoreSelect";

export default function ProceduralColorPalettePresetSelect() {
  const slimeColorChangedAt = useSlimeStore(
    (state) => state.colorSettings.slimeColorChangedAt,
  );
  const currentProceduralColorPalettePreset = useSlimeStore(
    (state) => state.colorSettings.currentProceduralColorPalettePreset,
  );
  const options = [
    ...Object.keys(PROCEDURAL_COLOR_PALETTE_PRESETS),
    "Custom",
  ].map((key) => ({
    value: key,
    label: key,
  }));

  function handlePresetChange(value: ProceduralColorPaletteName) {
    useSlimeStore.setState(
      produce((state) => {
        const palette = PROCEDURAL_COLOR_PALETTE_PRESETS[value];
        state.colorSettings.proceduralColorPalette = palette;
        state.colorSettings.slimeColorChangedAt = Date.now();
        state.footerState.isDimmedForEdit = true;
        state.colorSettings.currentProceduralColorPalettePreset = value;
      }),
    );
  }

  function handleSlimeColorChangedAt() {
    const currentPalette =
      useSlimeStore.getState().colorSettings.proceduralColorPalette;
    let currentMatchesPreset: boolean = true;
    for (const [key, preset] of Object.entries(
      PROCEDURAL_COLOR_PALETTE_PRESETS,
    )) {
      currentMatchesPreset = true;
      for (const channel of ["r", "g", "b"] as const) {
        for (const property of [
          "yOffset",
          "amplitude",
          "frequency",
          "phase",
        ] as const) {
          const currentValue = roundToFixed(
            currentPalette[channel][property],
            4,
          );
          const presetValue = roundToFixed(preset[channel][property], 4);
          if (currentValue !== presetValue) {
            currentMatchesPreset = false;
            break;
          }
        }
        if (!currentMatchesPreset) {
          break;
        }
      }
      if (currentMatchesPreset) {
        console.log(`Current palette matches preset: ${key}`);
        console.log("Setting presetText to the matching preset key");
        useSlimeStore.setState(
          produce((state) => {
            state.colorSettings.currentProceduralColorPalettePreset =
              key as ProceduralColorPaletteName;
          }),
        );
        break;
      }
    }
    if (
      !currentMatchesPreset &&
      currentProceduralColorPalettePreset !== "Custom"
    ) {
      useSlimeStore.setState(
        produce((state) => {
          state.colorSettings.currentProceduralColorPalettePreset = "Custom";
        }),
      );
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSlimeColorChangedAt();
    }, 1000);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slimeColorChangedAt]);

  return (
    <SlimeStoreSelect
      label="Presets"
      selectedOptionValue={currentProceduralColorPalettePreset}
      options={options}
      onChange={(e) =>
        handlePresetChange(e.value as ProceduralColorPaletteName)
      }
    />
  );
}
