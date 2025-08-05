import { produce } from "immer";
import { motion } from "motion/react";
import { Popover } from "radix-ui";
import { useEffect, useState, type ChangeEvent } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { LoadableSlimeStoreSettings, PresetType } from "../../types/types";

export default function LoadOrSaveSettingsPopoverButton({
  settings,
  buttonType,
}: {
  settings: LoadableSlimeStoreSettings;
  buttonType: "load" | "save";
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [includeSettings, setIncludedSettings] = useState<{
    clockSettings: boolean;
    simulationSettings: boolean;
    colorSettings: boolean;
  }>({
    clockSettings: !!settings.clockSettings,
    simulationSettings: !!settings.simulationSettings,
    colorSettings: !!settings.colorSettings,
  });
  // const [includeClockSettings, setIncludeClockSettings] = useState<boolean>(
  //   settings.clockSettings ? true : false,
  // );
  // const [includeSimulationSettings, setIncludeSimulationSettings] =
  //   useState<boolean>(settings.simulationSettings ? true : false);
  // const [includeColorSettings, setIncludeColorSettings] = useState<boolean>(
  //   settings.colorSettings ? true : false,
  // );
  const portalContainer = useSlimeStore((state) => state.portalContainer);
  const [presetName, setPresetName] = useState<string>(settings.name);
  const [displayMessage, setDisplayMessage] = useState<string | null>(null);

  function onChangePresetNameInput(e: ChangeEvent<HTMLInputElement>) {
    setPresetName(e.currentTarget.value.replace(/\s\s+/g, " "));
  }

  useEffect(() => {
    setDisplayMessage(null);
  }, [open]);

  function loadSettings() {
    const storeState = useSlimeStore.getState();
    useSlimeStore.setState(
      produce((state) => {
        if (includeSettings.clockSettings) {
          state.clockSettings = {
            ...storeState.clockSettings,
            ...settings.clockSettings,
          };
        }
        if (includeSettings.simulationSettings) {
          state.simulationSettings = {
            ...storeState.simulationSettings,
            ...settings.simulationSettings,
          };
        }
        if (includeSettings.colorSettings) {
          state.colorSettings = {
            ...storeState.colorSettings,
            ...settings.colorSettings,
            slimeColorChangedAt: Date.now(),
          };
        }
        if (Object.values(includeSettings).some(Boolean)) {
          state.presetLoadedAt = Date.now();
        }
      }),
    );
    setOpen(false);
  }

  function saveSettings() {
    let presets = [...useSlimeStore.getState().presets];

    if (presets.length >= 100) {
      setDisplayMessage("Unable to save: too many custom presets!");
      return;
    }

    let presetType: PresetType = "Combination";
    if (Object.values(includeSettings).filter(Boolean).length === 1) {
      if (includeSettings.clockSettings) {
        presetType = "Clock Only";
      } else if (includeSettings.simulationSettings) {
        presetType = "Simulation Only";
      } else if (includeSettings.colorSettings) {
        presetType = "Color Only";
      }
    }

    const trimmedPresetName = presetName.trim();
    const duplicate = presets.some((preset) => {
      if (
        trimmedPresetName === preset.name &&
        preset.presetType === presetType
      ) {
        setDisplayMessage(
          "Unable to save: custom preset with this name already exists!",
        );
        return true;
      }
      return false;
    });
    if (duplicate) return;

    const processedPreset: LoadableSlimeStoreSettings = {
      name: trimmedPresetName,
      presetType,
      clockSettings: includeSettings.clockSettings
        ? settings.clockSettings
        : undefined,
      simulationSettings: includeSettings.simulationSettings
        ? settings.simulationSettings
        : undefined,
      colorSettings: includeSettings.colorSettings
        ? settings.colorSettings
        : undefined,
    };

    presets = [...presets, processedPreset];

    presets.sort((a, b) => a.name.localeCompare(b.name));

    useSlimeStore.setState(
      produce((state) => {
        state.presets = presets;
      }),
    );
    setDisplayMessage(null);
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal>
      <Popover.Trigger asChild>
        <motion.button
          className="flex cursor-pointer border border-sky-800 px-2 py-1"
          style={{ backgroundColor: "#18181b" }}
          whileHover={{ backgroundColor: "#27272a" }}
        >
          {buttonType === "load" ? "Load" : "Save as Preset"}
        </motion.button>
      </Popover.Trigger>
      <Popover.Portal container={portalContainer}>
        <Popover.Content align="start" alignOffset={-20}>
          <div className="flex flex-col gap-2 bg-zinc-800 p-2 text-sm text-sky-50">
            {buttonType === "save" && (
              <div className="flex items-center gap-2">
                <label htmlFor={`save-as-preset-name-${settings.name}`}>
                  Preset Name:
                </label>
                <input
                  className="border border-sky-800 bg-zinc-700 p-1"
                  type="text"
                  id={`save-as-preset-name-${settings.name}`}
                  value={presetName}
                  onChange={onChangePresetNameInput}
                  maxLength={30}
                  size={20}
                />
              </div>
            )}
            {settings.clockSettings && (
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
                  id={`${buttonType}-preset-include-clock-settings-${settings.name}`}
                  disabled={!settings.clockSettings}
                />
                <label
                  htmlFor={`${buttonType}-preset-include-clock-settings-${settings.name}`}
                >
                  Include Clock Settings
                </label>
              </div>
            )}
            {settings.simulationSettings && (
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
                  id={`${buttonType}-preset-include-simulation-settings-${settings.name}`}
                  disabled={!settings.simulationSettings}
                />
                <label
                  htmlFor={`${buttonType}-preset-include-simulation-settings-${settings.name}`}
                >
                  Include Simulation Settings
                </label>
              </div>
            )}
            {settings.colorSettings && (
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
                  id={`${buttonType}-preset-include-color-settings-${settings.name}`}
                  disabled={!settings.colorSettings}
                />
                <label
                  htmlFor={`${buttonType}-preset-include-color-settings-${settings.name}`}
                >
                  Include Color Settings
                </label>
              </div>
            )}
            <div className="flex justify-center gap-1">
              <motion.button
                className="flex cursor-pointer border border-sky-800 px-2 py-1"
                style={{ backgroundColor: "#18181b" }}
                whileHover={{ backgroundColor: "#27272a" }}
                onClick={buttonType === "load" ? loadSettings : saveSettings}
              >
                {buttonType === "load" ? "Load" : "Save as Preset"}
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
            <div className="flex justify-center gap-1">
              {displayMessage && (
                <span className="text-red-500">{displayMessage}</span>
              )}
            </div>
          </div>
          <Popover.Arrow className="fill-zinc-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
