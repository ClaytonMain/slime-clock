import { Cross2Icon } from "@radix-ui/react-icons";
import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import * as R from "ramda";
import { useEffect, useState, type ReactNode } from "react";
import { LuClipboardCopy } from "react-icons/lu";
import { PiCheck, PiDiceFive } from "react-icons/pi";
import useSlimeStore from "../../stores/useSlimeStore";
import type { RandomizationPreset } from "../../types/types";
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
  const [copyState, setCopyState] = useState<string>("ready");
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
        state.toast = {
          title: "Settings Loaded",
          description: `Preset "${preset.name}" loaded successfully.`,
          type: "success",
          lastTriggeredAt: Date.now(),
        };
      }),
    );
  }

  useEffect(() => {
    if (copyState === "copied") {
      const timeoutId = setTimeout(() => {
        setCopyState("ready");
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [copyState]);

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
        <motion.div
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
            <PiDiceFive className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
            {!canLoadOnAutoRand && (
              <Cross2Icon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[2.1] stroke-rose-600 text-rose-600" />
            )}
          </motion.div>
        </motion.div>
        <motion.button
          className="flex cursor-pointer border border-sky-800 px-2 py-1"
          style={{ backgroundColor: "#18181b" }}
          whileHover={{ backgroundColor: "#27272a" }}
          onClick={loadSettings}
        >
          Load
        </motion.button>
        {!preset.isBasePreset && (
          <motion.button
            className="flex cursor-pointer border border-rose-800 px-2 py-1"
            onClick={deletePreset}
            style={{
              backgroundColor: "#4d0218",
            }}
            whileHover={{ backgroundColor: "#8b0836" }}
          >
            {deletePresetText}
          </motion.button>
        )}
        <motion.div className="mr-5 flex flex-1 items-center justify-end">
          <TooltipWrapper tooltipText="Copy to Clipboard">
            <motion.button
              className="relative flex h-7 w-7 cursor-pointer p-0.5"
              style={{ backgroundColor: "#18181baa" }}
              whileHover={{ backgroundColor: "#27272aaa" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCopyState("copied");
                useSlimeStore.setState(
                  produce((state) => {
                    state.toast = {
                      title: "Settings Copied",
                      description: `Randomization preset "${preset.name}" copied to clipboard.`,
                      type: "success",
                      lastTriggeredAt: Date.now(),
                    };
                  }),
                );
                navigator.clipboard.writeText(JSON.stringify(preset, null, 2));
              }}
            >
              <motion.div
                className="absolute top-1/2 left-1/2 z-[1] -translate-x-1/2 -translate-y-1/2"
                animate={{ opacity: copyState === "ready" ? 1 : 0 }}
              >
                <LuClipboardCopy className="h-5 w-5" />
              </motion.div>
              <motion.div
                className="absolute top-1/2 left-1/2 z-[1] -translate-x-1/2 -translate-y-1/2"
                animate={{ opacity: copyState === "copied" ? 1 : 0 }}
              >
                <PiCheck className="h-5 w-5 text-green-500" />
              </motion.div>
            </motion.button>
          </TooltipWrapper>
        </motion.div>
      </div>
    </motion.div>
  );
}
