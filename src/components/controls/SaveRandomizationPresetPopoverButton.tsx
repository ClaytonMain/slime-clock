import { produce } from "immer";
import { motion } from "motion/react";
import { Popover } from "radix-ui";
import { useEffect, useState, type ChangeEvent } from "react";
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
  const [displayMessage, setDisplayMessage] = useState<string | null>(null);

  function onChangePresetNameInput(e: ChangeEvent<HTMLInputElement>) {
    setPresetName(e.currentTarget.value.replace(/\s\s+/g, " "));
  }

  useEffect(() => {
    setDisplayMessage(null);
  }, [open]);

  function saveRandomizationPreset() {
    let randomizationPresets = [
      ...useSlimeStore.getState().randomizationPresets,
    ];
    const randomizationSettings =
      useSlimeStore.getState().randomizationSettings;
    const presetTypeRandomizationSettings =
      randomizationSettings[randomizationPresetType];

    if (randomizationPresets.length >= 999) {
      setDisplayMessage("Unable to save: too many custom presets!");
      return;
    }

    const trimmedPresetName = presetName.trim();
    const duplicate = randomizationPresets.some((preset) => {
      if (
        trimmedPresetName === preset.name &&
        preset.presetType === randomizationPresetType
      ) {
        setDisplayMessage(
          `Unable to save: a "${randomizationPresetType}" randomization preset with this name already exists!`,
        );
        return true;
      }
      return false;
    });
    if (duplicate) return;

    // @ts-expect-error Be silent.
    const processedPreset: RandomizationPreset = {
      presetType: randomizationPresetType,
      name: trimmedPresetName,
      settings: presetTypeRandomizationSettings,
    };

    randomizationPresets = [...randomizationPresets, processedPreset];

    console.log(randomizationPresets);

    randomizationPresets.sort((a, b) => a.name.localeCompare(b.name));

    useSlimeStore.setState(
      produce((state) => {
        state.randomizationPresets = randomizationPresets;
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
              />
            </div>
            <div className="flex justify-center gap-1">
              <motion.button
                className="flex cursor-pointer border border-sky-800 px-2 py-1"
                style={{ backgroundColor: "#18181b" }}
                whileHover={{ backgroundColor: "#27272a" }}
                onClick={saveRandomizationPreset}
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
