import { produce } from "immer";
import { useEffect, useState } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import { type LoadableSlimeStoreSettings } from "../../types/types";
import SlimeStoreSelectControl from "./SlimeStoreSelectControl";

export default function ProceduralColorPalettePresetSelect() {
  const presets = useSlimeStore((state) => state.presets);
  const [presetColorSettings, setPresetColorSettings] = useState<
    LoadableSlimeStoreSettings[]
  >([]);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    [],
  );
  const colorSettings = useSlimeStore((state) => state.colorSettings);

  useEffect(() => {
    const presetLoadedAt = useSlimeStore.getState().presetLoadedAt;
    if (Date.now() - presetLoadedAt > 1500) {
      setOptions([
        ...presets.map((preset) => ({
          value: preset.name,
          label: preset.name,
        })),
        { value: "Custom", label: "Custom" },
      ]);
      useSlimeStore.setState(
        produce((state) => {
          state.colorSettings.currentProceduralColorPalettePreset = "Custom";
        }),
      );
    }
  }, [colorSettings]);

  useEffect(() => {
    const newPresetColorSettings = presets.filter(
      (preset) => preset.colorSettings,
    );
    setPresetColorSettings(newPresetColorSettings);
    setOptions(
      newPresetColorSettings.map((preset) => ({
        value: preset.name,
        label: preset.name,
      })),
    );
  }, [presets]);

  function handlePresetChange(value: string) {
    const selectedPreset = presetColorSettings.find(
      (preset) => preset.name === value,
    );
    if (!selectedPreset || !selectedPreset.colorSettings) return;
    useSlimeStore.setState(
      produce((state) => {
        state.colorSettings = {
          ...state.colorSettings,
          ...selectedPreset.colorSettings,
          slimeColorChangedAt: Date.now(),
          currentProceduralColorPalettePreset: value,
        };
        state.controlsState.displayAreaContentName = "procedural-color-palette";
        state.controlsState.displayAreaContentType = "three";
        state.presetLoadedAt = Date.now();
      }),
    );
  }

  return (
    <SlimeStoreSelectControl
      label="Presets"
      placeholder="Select a preset"
      baseInputId="procedural-color-palette-preset-select"
      storePath={["colorSettings", "currentProceduralColorPalettePreset"]}
      options={options}
      onValueChange={handlePresetChange}
    />
  );
}
