import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import { useEffect, useState, type ReactNode } from "react";
import { LuClipboardCopy } from "react-icons/lu";
import { PiCheck } from "react-icons/pi";
import useSlimeStore from "../../stores/useSlimeStore";
import type { RandomizationPreset } from "../../types/types";
import SlimeStoreSwitch from "./SlimeStoreSwitch";
import TooltipWrapper from "./TooltipWrapper";

function getRandomizationPresetIndex(preset: RandomizationPreset) {
  const presets = useSlimeStore.getState().randomizationPresets;
  return (
    presets.findIndex(
      (storePreset) =>
        storePreset.name === preset.name &&
        storePreset.presetType === preset.presetType,
    ) || -1
  );
}

export default function RandomizationPresetLoadSaveControl({
  label,
  labelHoverTabContentDisplay,
  preset,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  preset: RandomizationPreset;
}) {
  const [deletePresetText, setDeletePresetText] = useState<string>("Delete");
  const [copyState, setCopyState] = useState<string>("ready");
  const [presetIndex, setPresetIndex] = useState<number>(
    getRandomizationPresetIndex(preset),
  );

  useEffect(() => {
    setPresetIndex(getRandomizationPresetIndex(preset));
  }, [preset]);

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
        <motion.div className="flex flex-col items-center justify-center bg-[#0002] p-1">
          <Label.Root
            className="w-full text-center text-xs"
            htmlFor={`randomization-preset-${preset.name}-${preset.presetType}-enabled-switch`}
          >
            Can Load on Rand.
          </Label.Root>
          <SlimeStoreSwitch
            baseId={`randomization-preset-${preset.name}-enabled-switch`}
            storePath={["randomizationPresets", presetIndex, "enabled"]}
          />
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
