import { ClockIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import { useEffect, useState, type ReactNode } from "react";
import { LuClipboardCopy } from "react-icons/lu";
import { PiCheck, PiPalette } from "react-icons/pi";
import {
  MULTIPLE_PRESET_TYPES,
  SINGLE_PRESET_TYPES,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type { LoadableSlimeStoreSettings } from "../../types/types";
import LoadOrSaveSettingsPopoverButton from "./LoadOrSaveSettingsPopoverButton";
import TooltipWrapper from "./TooltipWrapper";

export default function SettingsLoadSaveControl({
  label,
  labelHoverTabContentDisplay,
  settings,
  controlType,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  settings: LoadableSlimeStoreSettings;
  controlType: "history" | "presets";
}) {
  const [deletePresetText, setDeletePresetText] = useState<string>("Delete");
  const [copyState, setCopyState] = useState<string>("ready");
  const [presetIndicationIcons, setPresetIndicationIcons] = useState<
    ReactNode[]
  >([]);

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
        if (settings.clockSettings) {
          state.clockSettings = {
            ...storeState.clockSettings,
            ...settings.clockSettings,
          };
        }
        if (settings.simulationSettings) {
          state.simulationSettings = {
            ...storeState.simulationSettings,
            ...settings.simulationSettings,
          };
        }
        if (settings.colorSettings) {
          state.colorSettings = {
            ...storeState.colorSettings,
            ...settings.colorSettings,
            slimeColorChangedAt: Date.now(),
          };
        }
        state.presetLoadedAt = Date.now();
        state.toast = {
          title: "Settings Loaded",
          description: `Preset "${settings.name}" loaded successfully.`,
          type: "success",
          lastTriggeredAt: Date.now(),
        };
      }),
    );
  }

  useEffect(() => {
    if (controlType !== "presets") return;
    const icons: ReactNode[] = [];
    if (settings.clockSettings) {
      icons.push(<ClockIcon key="clock-icon" className="h-3 w-3" />);
    }
    if (settings.simulationSettings) {
      icons.push(
        <MixerHorizontalIcon key="simulation-icon" className="h-3 w-3" />,
      );
    }
    if (settings.colorSettings) {
      icons.push(<PiPalette key="color-icon" className="h-3 w-3" />);
    }
    setPresetIndicationIcons(icons);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    let presets = useSlimeStore.getState().presets;
    presets = presets.filter((preset) => preset.name !== settings.name);
    useSlimeStore.setState(
      produce((state) => {
        state.presets = presets;
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
          {controlType === "presets" && (
            <div className="flex w-6 flex-none flex-col items-center justify-center gap-1">
              <div className="flex items-center justify-center gap-1">
                {presetIndicationIcons[0]}
              </div>
              {presetIndicationIcons.length > 1 && (
                <div className="flex items-center justify-center gap-1">
                  {presetIndicationIcons[1]}
                  {presetIndicationIcons[2] || null}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div
        className={"flex w-full flex-wrap items-center justify-start gap-1"}
        style={{
          paddingRight: "calc(var(--spacing) * 2)",
          paddingLeft: label ? undefined : "calc(var(--spacing) * 2)",
        }}
      >
        {SINGLE_PRESET_TYPES.some((type) => type === settings.presetType) && (
          <motion.button
            className="flex cursor-pointer border border-sky-800 px-2 py-1"
            style={{ backgroundColor: "#18181b" }}
            whileHover={{ backgroundColor: "#27272a" }}
            onClick={loadSettings}
          >
            Load
          </motion.button>
        )}
        {MULTIPLE_PRESET_TYPES.some((type) => type === settings.presetType) && (
          <LoadOrSaveSettingsPopoverButton
            settings={settings}
            buttonType="load"
          />
        )}
        {controlType === "history" && (
          <LoadOrSaveSettingsPopoverButton
            settings={settings}
            buttonType="save"
          />
        )}
        {controlType === "presets" && !settings.isBasePreset && (
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
                navigator.clipboard.writeText(
                  JSON.stringify(settings, null, 2),
                );
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
