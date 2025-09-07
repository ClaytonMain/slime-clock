import { produce } from "immer";
import { motion } from "motion/react";
import { Popover } from "radix-ui";
import { useState, type ChangeEvent } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { RandomizationPreset } from "../../types/types";

export default function SaveRandomizationPresetPopoverButton({
  randomizationPresetType,
}: {
  randomizationPresetType: "simulation" | "color";
}) {
  const [open, setOpen] = useState<boolean>(false);
  const portalContainer = useSlimeStore((state) => state.portalContainer);
  const [presetName, setPresetName] = useState<string>(
    "New Randomization Preset",
  );

  function onChangePresetNameInput(e: ChangeEvent<HTMLInputElement>) {
    setPresetName(e.currentTarget.value.replace(/\s\s+/g, " "));
  }

  function handleOnSave() {
    let randomizationPresets = [
      ...useSlimeStore.getState().randomizationPresets,
    ];
    const randomizationSettings =
      useSlimeStore.getState().randomizationSettings;
    const presetTypeRandomizationSettings =
      randomizationSettings[randomizationPresetType];

    if (randomizationPresets.length >= 999) {
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

    const duplicate = randomizationPresets.some(
      (preset) =>
        trimmedPresetName === preset.name &&
        preset.presetType === randomizationPresetType,
    );
    if (duplicate) {
      useSlimeStore.setState(
        produce((state) => {
          state.toast.title = "Duplicate Preset Name!";
          state.toast.description = `A ${randomizationPresetType} randomization preset with the name "${trimmedPresetName}" already exists.`;
          state.toast.type = "error";
          state.toast.lastTriggeredAt = Date.now();
        }),
      );
      return;
    }

    // @ts-expect-error Be silent.
    const processedPreset: RandomizationPreset = {
      presetType: randomizationPresetType,
      name: trimmedPresetName,
      enabled: true,
      settings: presetTypeRandomizationSettings,
    };

    randomizationPresets = [...randomizationPresets, processedPreset];

    randomizationPresets.sort((a, b) => a.name.localeCompare(b.name));

    useSlimeStore.setState(
      produce((state) => {
        state.randomizationPresets = randomizationPresets;
        state.toast.title = "Preset Saved";
        state.toast.description = `Randomization preset "${trimmedPresetName}" saved successfully.`;
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
          className="flex cursor-pointer border border-sky-800 px-2 py-1"
          style={{ backgroundColor: "#18181b" }}
          whileHover={{ backgroundColor: "#27272a" }}
        >
          {`Save Current ${randomizationPresetType === "simulation" ? "Sim." : "Color"} Rand. Settings as Preset`}
        </motion.button>
      </Popover.Trigger>
      <Popover.Portal container={portalContainer}>
        <Popover.Content align="start" alignOffset={-20}>
          <div className="flex flex-col gap-2 bg-zinc-800 p-2 text-sm text-sky-50">
            <div className="flex items-center gap-2">
              <label
                htmlFor={`save-randomization-preset-name-${randomizationPresetType}`}
              >
                Preset Name:
              </label>
              <input
                className="border border-sky-800 bg-zinc-700 p-1"
                type="text"
                id={`save-randomization-preset-name-${randomizationPresetType}`}
                value={presetName}
                onChange={onChangePresetNameInput}
                maxLength={30}
                size={20}
                onKeyUp={handleKeyUp}
              />
            </div>
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
