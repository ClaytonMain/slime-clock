import { produce } from "immer";
import { motion } from "motion/react";
import { Popover } from "radix-ui";
import { useState, type ChangeEvent } from "react";
import {
  LOADABLE_CLOCK_SETTINGS_KEYS,
  LOADABLE_COLOR_SETTINGS_KEYS,
  LOADABLE_SIMULATION_SETTINGS_KEYS,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  LoadableClockSettings,
  LoadableColorSettings,
  LoadableSimulationSettings,
  LoadableSlimeStoreSettings,
  SimulationPresetType,
} from "../../types/types";

export default function SaveCurrentSettingsAsPresetPopoverButton({
  presetType,
}: {
  presetType: SimulationPresetType;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [includeSettings, setIncludedSettings] = useState<{
    clockSettings: boolean;
    simulationSettings: boolean;
    colorSettings: boolean;
  }>({
    clockSettings: ["Clock Only", "Combination"].includes(presetType),
    simulationSettings: ["Simulation Only", "Combination"].includes(presetType),
    colorSettings: ["Color Only", "Combination"].includes(presetType),
  });
  const portalContainer = useSlimeStore((state) => state.portalContainer);
  const [presetName, setPresetName] = useState<string>("New Preset");

  function onChangePresetNameInput(e: ChangeEvent<HTMLInputElement>) {
    setPresetName(e.currentTarget.value.replace(/\s\s+/g, " "));
  }

  function handleOnSave() {
    let simulationPresets = [...useSlimeStore.getState().simulationPresets];

    if (simulationPresets.length >= 999) {
      useSlimeStore.setState(
        produce((state) => {
          state.toast.title = "Too Many Presets!";
          state.toast.description =
            "Please delete some presets before adding more.";
          state.toast.type = "error";
          state.toast.lastTriggeredAt = Date.now();
        }),
      );
      return;
    }

    let saveAsPresetType: SimulationPresetType = presetType;
    if (Object.values(includeSettings).filter(Boolean).length === 1) {
      if (includeSettings.clockSettings) {
        saveAsPresetType = "Clock Only";
      } else if (includeSettings.simulationSettings) {
        saveAsPresetType = "Simulation Only";
      } else if (includeSettings.colorSettings) {
        saveAsPresetType = "Color Only";
      }
    }

    const trimmedPresetName = presetName.trim();
    if (trimmedPresetName.length === 0) {
      useSlimeStore.setState(
        produce((state) => {
          state.toast.title = "Invalid Preset Name!";
          state.toast.description = "Preset name cannot be empty.";
          state.toast.type = "error";
          state.toast.lastTriggeredAt = Date.now();
        }),
      );
      return;
    }

    setPresetName(trimmedPresetName);

    const duplicate = simulationPresets.some(
      (preset) =>
        trimmedPresetName === preset.name &&
        preset.presetType === saveAsPresetType,
    );
    if (duplicate) {
      useSlimeStore.setState(
        produce((state) => {
          state.toast.title = "Duplicate Preset Name!";
          state.toast.description = `A ${saveAsPresetType} preset with the name "${trimmedPresetName}" already exists.`;
          state.toast.type = "error";
          state.toast.lastTriggeredAt = Date.now();
        }),
      );
      return;
    }

    const currentState = useSlimeStore.getState();
    const currentLoadableSettings: Partial<LoadableSlimeStoreSettings> = {
      // @ts-expect-error This is fine.
      clockSettings: {},
      // @ts-expect-error This is fine.
      simulationSettings: {},
      // @ts-expect-error This is fine.
      colorSettings: {},
    };
    LOADABLE_CLOCK_SETTINGS_KEYS.forEach((key) => {
      const typedKey = key as keyof LoadableClockSettings;
      // @ts-expect-error This is fine.
      currentLoadableSettings.clockSettings[typedKey] =
        currentState.clockSettings[typedKey];
    });
    LOADABLE_SIMULATION_SETTINGS_KEYS.forEach((key) => {
      const typedKey = key as keyof LoadableSimulationSettings;
      // @ts-expect-error This if also fine.
      currentLoadableSettings.simulationSettings[typedKey] =
        currentState.simulationSettings[typedKey];
    });
    LOADABLE_COLOR_SETTINGS_KEYS.forEach((key) => {
      const typedKey = key as keyof LoadableColorSettings;
      // @ts-expect-error Hey, guess what this is.
      currentLoadableSettings.colorSettings[typedKey] =
        currentState.colorSettings[typedKey];
    });

    const processedPreset: LoadableSlimeStoreSettings = {
      name: trimmedPresetName,
      presetType,
      clockSettings: includeSettings.clockSettings
        ? currentLoadableSettings.clockSettings
        : undefined,
      simulationSettings: includeSettings.simulationSettings
        ? currentLoadableSettings.simulationSettings
        : undefined,
      colorSettings: includeSettings.colorSettings
        ? currentLoadableSettings.colorSettings
        : undefined,
    };

    simulationPresets = [...simulationPresets, processedPreset];

    simulationPresets.sort((a, b) => a.name.localeCompare(b.name));

    useSlimeStore.setState(
      produce((state) => {
        state.simulationPresets = simulationPresets;
        state.toast.title = "Preset Saved";
        state.toast.description = `Preset "${trimmedPresetName}" saved successfully.`;
        state.toast.type = "success";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
    setOpen(false);
  }

  function handleKeyUp(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleOnSave();
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal>
      <Popover.Trigger asChild>
        <motion.button
          className="flex h-7 cursor-pointer flex-col items-center justify-center border border-sky-800 px-2 py-1"
          style={{ backgroundColor: "#18181b" }}
          whileHover={{ backgroundColor: "#27272a" }}
        >
          Save Current Settings as Preset
        </motion.button>
      </Popover.Trigger>
      <Popover.Portal container={portalContainer}>
        <Popover.Content align="start" alignOffset={-20}>
          <div className="flex flex-col gap-2 bg-zinc-800 p-2 text-sm text-sky-50">
            <div className="flex items-center gap-2">
              <label
                htmlFor={`save-as-preset-name-${presetName.toLowerCase().replace(/\s+/g, "-")}`}
              >
                Preset Name:
              </label>
              <input
                className="border border-sky-800 bg-zinc-700 p-1"
                type="text"
                id={`save-as-preset-name-${presetName.toLowerCase().replace(/\s+/g, "-")}`}
                value={presetName}
                onChange={onChangePresetNameInput}
                maxLength={30}
                size={20}
                onKeyUp={handleKeyUp}
              />
            </div>
            {presetType === "Combination" && (
              <>
                <div className="flex gap-2">
                  <input
                    checked={includeSettings.clockSettings}
                    onChange={(e) =>
                      setIncludedSettings((prev) => ({
                        ...prev,
                        clockSettings: e.target.checked,
                      }))
                    }
                    type="checkbox"
                    id={`save-preset-include-clock-settings-${presetName.toLowerCase().replace(/\s+/g, "-")}`}
                  />
                  <label
                    htmlFor={`save-preset-include-clock-settings-${presetName.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    Include Clock Settings
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    checked={includeSettings.simulationSettings}
                    onChange={(e) =>
                      setIncludedSettings((prev) => ({
                        ...prev,
                        simulationSettings: e.target.checked,
                      }))
                    }
                    type="checkbox"
                    id={`save-preset-include-simulation-settings-${presetName.toLowerCase().replace(/\s+/g, "-")}`}
                  />
                  <label
                    htmlFor={`save-preset-include-simulation-settings-${presetName.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    Include Simulation Settings
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    checked={includeSettings.colorSettings}
                    onChange={(e) =>
                      setIncludedSettings((prev) => ({
                        ...prev,
                        colorSettings: e.target.checked,
                      }))
                    }
                    type="checkbox"
                    id={`save-preset-include-color-settings-${presetName.toLowerCase().replace(/\s+/g, "-")}`}
                  />
                  <label
                    htmlFor={`save-preset-include-color-settings-${presetName.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    Include Color Settings
                  </label>
                </div>
              </>
            )}
            <div className="flex justify-center gap-1">
              <motion.button
                className="flex cursor-pointer border border-sky-800 px-2 py-1"
                style={{ backgroundColor: "#18181b" }}
                whileHover={{ backgroundColor: "#27272a" }}
                onClick={handleOnSave}
              >
                {"Save as Preset"}
              </motion.button>
              <motion.button
                className="flex cursor-pointer border border-sky-800 px-2 py-1"
                style={{ backgroundColor: "#18181b" }}
                whileHover={{ backgroundColor: "#27272a" }}
                onClick={() => setOpen(false)}
              >
                Cancel
              </motion.button>
            </div>
          </div>
          <Popover.Arrow className="fill-zinc-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
