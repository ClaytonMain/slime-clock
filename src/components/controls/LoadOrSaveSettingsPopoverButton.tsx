import { produce } from "immer";
import { motion } from "motion/react";
import { Popover } from "radix-ui";
import { useEffect, useState, type ChangeEvent } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { LoadableSlimeStoreSettings } from "../../types/types";

export default function LoadOrSaveSettingsPopoverButton({
  settings,
  buttonType,
}: {
  settings: LoadableSlimeStoreSettings;
  buttonType: "load" | "save";
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [includeClockSettings, setIncludeClockSettings] = useState<boolean>(
    settings.clockSettings ? true : false,
  );
  const [includeSimulationSettings, setIncludeSimulationSettings] =
    useState<boolean>(settings.simulationSettings ? true : false);
  const [includeColorSettings, setIncludeColorSettings] = useState<boolean>(
    settings.colorSettings ? true : false,
  );
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
        if (includeClockSettings) {
          state.clockSettings = {
            ...storeState.clockSettings,
            ...settings.clockSettings,
          };
        }
        if (includeSimulationSettings) {
          state.simulationSettings = {
            ...storeState.simulationSettings,
            ...settings.simulationSettings,
          };
        }
        if (includeColorSettings) {
          state.colorSettings = {
            ...storeState.colorSettings,
            ...settings.colorSettings,
          };
        }
        if (
          includeClockSettings ||
          includeSimulationSettings ||
          includeColorSettings
        ) {
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

    const trimmedPresetName = presetName.trim();
    const duplicate = presets.some((preset) => {
      if (trimmedPresetName === preset.name) {
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
      clockSettings: includeClockSettings ? settings.clockSettings : undefined,
      simulationSettings: includeSimulationSettings
        ? settings.simulationSettings
        : undefined,
      colorSettings: includeColorSettings ? settings.colorSettings : undefined,
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
                  checked={includeClockSettings}
                  onChange={(e) => setIncludeClockSettings(e.target.checked)}
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
                  checked={includeSimulationSettings}
                  onChange={(e) =>
                    setIncludeSimulationSettings(e.target.checked)
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
                  checked={includeColorSettings}
                  onChange={(e) => setIncludeColorSettings(e.target.checked)}
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
