import { produce } from "immer";
import { motion } from "motion/react";
import { Popover } from "radix-ui";
import { useState, type ChangeEvent } from "react";
import { LuArrowUpFromLine } from "react-icons/lu";
import { PiFloppyDisk } from "react-icons/pi";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  LoadableSlimeStoreSettings,
  SimulationPresetType,
} from "../../types/types";
import TooltipWrapper from "./TooltipWrapper";

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
  const portalContainer = useSlimeStore((state) => state.portalContainer);
  const [presetName, setPresetName] = useState<string>(settings.name);

  function onChangePresetNameInput(e: ChangeEvent<HTMLInputElement>) {
    setPresetName(e.currentTarget.value.replace(/\s\s+/g, " "));
  }

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
          state.toast.title = "Settings Loaded";
          state.toast.description = `"${settings.name}" loaded successfully.`;
          state.toast.type = "success";
          state.toast.lastTriggeredAt = Date.now();
        }
      }),
    );
    setOpen(false);
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

    if (
      !includeSettings.clockSettings &&
      !includeSettings.simulationSettings &&
      !includeSettings.colorSettings
    ) {
      useSlimeStore.setState(
        produce((state) => {
          state.toast.title = "No Settings Selected!";
          state.toast.description =
            "Select at least one settings category to save.";
          state.toast.type = "error";
          state.toast.lastTriggeredAt = Date.now();
        }),
      );
      return;
    }

    let presetType: SimulationPresetType = "Combination";
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
        trimmedPresetName === preset.name && preset.presetType === presetType,
    );
    if (duplicate) {
      useSlimeStore.setState(
        produce((state) => {
          state.toast.title = "Duplicate Preset Name!";
          state.toast.description = `A ${presetType} preset with the name "${trimmedPresetName}" already exists.`;
          state.toast.type = "error";
          state.toast.lastTriggeredAt = Date.now();
        }),
      );
      return;
    }

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
      if (buttonType === "save") {
        handleOnSave();
      }
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal>
      <TooltipWrapper
        tooltipText={buttonType === "load" ? "Load Settings" : "Save as Preset"}
      >
        <Popover.Trigger asChild>
          <motion.button
            className="flex h-7 w-7 cursor-pointer flex-col items-center justify-center border border-sky-800 p-1"
            style={{ backgroundColor: "#18181b" }}
            whileHover={{ backgroundColor: "#27272a" }}
          >
            <motion.div
              className="relative"
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.05 }}
            >
              <motion.div
                className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2"
                transition={{ duration: 0.2 }}
              >
                {buttonType === "load" ? (
                  <LuArrowUpFromLine className="h-full w-full scale-[0.8]" />
                ) : (
                  <PiFloppyDisk className="h-full w-full scale-[0.8]" />
                )}
              </motion.div>
            </motion.div>
          </motion.button>
        </Popover.Trigger>
      </TooltipWrapper>
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
                  onKeyUp={handleKeyUp}
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
                onClick={buttonType === "load" ? loadSettings : handleOnSave}
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
          </div>
          <Popover.Arrow className="fill-zinc-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
