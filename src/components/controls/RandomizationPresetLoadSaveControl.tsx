import { Cross2Icon } from "@radix-ui/react-icons";
import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import * as R from "ramda";
import { useEffect, useState, type ReactNode } from "react";
import { LuArrowUpFromLine, LuClipboardCopy } from "react-icons/lu";
import { PiDiceFive } from "react-icons/pi";
import useSlimeStore from "../../stores/useSlimeStore";
import type { RandomizationPreset } from "../../types/types";
import EditPresetNamePopoverButton from "./EditPresetNamePopoverButton";
import TooltipWrapper from "./TooltipWrapper";

export default function RandomizationPresetLoadSaveControl({
  label,
  labelHoverTabContentDisplay,
  preset,
  index,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  preset: RandomizationPreset;
  index: number;
}) {
  const [deletePresetText, setDeletePresetText] = useState<string>("Delete");
  const [canLoadOnAutoRand, setCanLoadOnAutoRand] = useState<boolean>(
    R.view(
      R.lensPath(["randomizationPresets", index, "enabled"]),
      useSlimeStore.getState(),
    ),
  );

  useEffect(() => {
    setCanLoadOnAutoRand(
      R.view(
        R.lensPath(["randomizationPresets", index, "enabled"]),
        useSlimeStore.getState(),
      ),
    );
  }, [index]);

  useEffect(() => {
    const unsub = useSlimeStore.subscribe(
      (state) =>
        R.view(R.lensPath(["randomizationPresets", index, "enabled"]), state),
      (newValue) => {
        setCanLoadOnAutoRand(newValue);
      },
    );
    return () => unsub();
  }, [index]);

  function handleCanLoadOnAutoRandChange(newValue: boolean) {
    useSlimeStore.setState(
      R.over(
        R.lensPath(["randomizationPresets", index, "enabled"]),
        () => newValue,
      ),
    );
    useSlimeStore.setState(
      produce((state) => {
        state.toast.title = "Load on Auto-Randomization";
        state.toast.description = `Preset "${preset.name}" ${newValue ? "now" : "no longer"} has a chance to load during auto-randomization.`;
        state.toast.type = "info";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
    setCanLoadOnAutoRand(newValue);
  }

  function handleCopyToClipboard() {
    useSlimeStore.setState(
      produce((state) => {
        state.toast.title = "Settings Copied";
        state.toast.description = `Randomization preset "${preset.name}" copied to clipboard.`;
        state.toast.type = "success";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
    navigator.clipboard.writeText(JSON.stringify(preset, null, 2));
  }

  function handlePointerOver() {
    if (labelHoverTabContentDisplay) {
      useSlimeStore.setState(
        produce((state) => {
          state.controlsState.displayAreaContentUpdatedAt = Date.now();
          state.controlsState.displayAreaContentName = null;
          state.controlsState.displayAreaHtmlContent =
            labelHoverTabContentDisplay;
          state.controlsState.displayAreaContentType = "html";
        }),
      );
    }
  }

  function loadSettings() {
    const storeState = useSlimeStore.getState();
    useSlimeStore.setState(
      produce((state) => {
        state.randomizationSettings.simulation = {
          ...storeState.randomizationSettings.simulation,
          ...preset.settings,
        };
        state.toast.title = "Settings Loaded";
        state.toast.description = `Preset "${preset.name}" loaded successfully.`;
        state.toast.type = "success";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
  }

  useEffect(() => {
    if (deletePresetText !== "Are you sure?") return;
    const timeoutId = setTimeout(() => {
      setDeletePresetText("Delete");
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [deletePresetText]);

  function deletePreset() {
    if (deletePresetText === "Delete") {
      setDeletePresetText("Are you sure?");
      return;
    }
    let presets = useSlimeStore.getState().randomizationPresets;
    presets = presets.filter(
      (storePreset) =>
        !(
          storePreset.name === preset.name &&
          storePreset.presetType === preset.presetType
        ),
    );
    useSlimeStore.setState(
      produce((state) => {
        state.randomizationPresets = presets;
      }),
    );
  }

  function handleEditPresetName(newName: string): boolean {
    const randomizationPresets = useSlimeStore.getState().randomizationPresets;
    // `newName` should be trimmed already, but just in case.
    const trimmedNewName = newName.trim();
    if (trimmedNewName.length === 0) {
      useSlimeStore.setState(
        produce((state) => {
          state.toast.title = "Invalid Preset Name";
          state.toast.description = "Preset name cannot be empty.";
          state.toast.type = "error";
          state.toast.lastTriggeredAt = Date.now();
        }),
      );
      return false;
    }
    const duplicate = randomizationPresets.some(
      (storePreset, storeIndex) =>
        storePreset.name === trimmedNewName &&
        storePreset.presetType === preset.presetType &&
        storeIndex !== index,
    );
    if (duplicate) {
      useSlimeStore.setState(
        produce((state) => {
          state.toast.title = "Duplicate Preset Name";
          state.toast.description = `A ${preset.presetType} randomization preset with this name already exists.`;
          state.toast.type = "error";
          state.toast.lastTriggeredAt = Date.now();
        }),
      );
      return false;
    }

    useSlimeStore.setState(
      R.over(
        R.lensPath(["randomizationPresets", index, "name"]),
        () => newName,
      ),
    );
    useSlimeStore.setState(
      produce((state) => {
        state.toast.title = "Preset Renamed";
        state.toast.description = `Preset "${preset.name}" renamed to "${newName}".`;
        state.toast.type = "info";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
    return true;
  }

  return (
    <motion.div
      onPointerOver={handlePointerOver}
      whileHover={{ backgroundColor: "#0004" }}
      className={`flex w-full gap-1 py-2`}
    >
      {label && (
        <div className="flex items-center p-1">
          <Label.Root className="w-24 flex-none p-0.5 text-xs leading-none font-medium">
            {label}
          </Label.Root>
        </div>
      )}
      <div
        className={"flex w-full flex-wrap items-center justify-start gap-1"}
        style={{
          paddingRight: "calc(var(--spacing) * 2)",
          paddingLeft: label ? undefined : "calc(var(--spacing) * 2)",
        }}
      >
        <TooltipWrapper tooltipText="Toggle Load on Auto-Randomization">
          <motion.button
            className="flex h-7 w-7 cursor-pointer flex-col items-center justify-center border border-sky-800 p-1"
            onClick={() => handleCanLoadOnAutoRandChange(!canLoadOnAutoRand)}
            style={{ backgroundColor: "#18181b" }}
            whileHover={{ backgroundColor: "#27272a" }}
          >
            <motion.div
              className="relative"
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.05 }}
            >
              <motion.div className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2">
                <PiDiceFive className="h-full w-full" />
              </motion.div>
              <motion.div
                className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2"
                animate={{ opacity: canLoadOnAutoRand ? 0 : 1 }}
                transition={{ duration: 0.1 }}
              >
                <Cross2Icon className="h-full w-full scale-[1.15] stroke-rose-600 text-rose-600" />
              </motion.div>
            </motion.div>
          </motion.button>
        </TooltipWrapper>
        <TooltipWrapper tooltipText="Copy to Clipboard">
          <motion.button
            className="flex h-7 w-7 cursor-pointer flex-col items-center justify-center border border-sky-800 p-1"
            onClick={handleCopyToClipboard}
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
                <LuClipboardCopy className="h-full w-full scale-[0.8]" />
              </motion.div>
            </motion.div>
          </motion.button>
        </TooltipWrapper>
        <TooltipWrapper tooltipText="Load Preset Settings">
          <motion.button
            className="flex h-7 w-7 cursor-pointer flex-col items-center justify-center border border-sky-800 p-1"
            onClick={loadSettings}
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
                <LuArrowUpFromLine className="h-full w-full scale-[0.8]" />
              </motion.div>
            </motion.div>
          </motion.button>
        </TooltipWrapper>
        {!preset.isBasePreset && (
          <>
            <EditPresetNamePopoverButton
              oldName={preset.name}
              onSave={handleEditPresetName}
            />
            <div className="flex flex-1" />
            <motion.button
              className="mr-5 flex cursor-pointer border border-rose-800 px-2 py-1"
              onClick={deletePreset}
              style={{
                backgroundColor: "#4d0218",
              }}
              whileHover={{ backgroundColor: "#8b0836" }}
            >
              {deletePresetText}
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}
