import {
  ClockIcon,
  Cross2Icon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import { produce } from "immer";
import { motion } from "motion/react";
import * as R from "ramda";
import { useEffect, useState, type ReactNode } from "react";
import { LuArrowUpFromLine, LuClipboardCopy } from "react-icons/lu";
import { PiDiceFive, PiPalette } from "react-icons/pi";
import {
  MULTIPLE_PRESET_TYPES,
  SINGLE_PRESET_TYPES,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  LoadableSlimeStoreSettings,
  TailwindItemsAlignOption,
  TailwindJustifyContentOption,
} from "../../types/types";
import ControlGroup from "./ControlGroup";
import EditPresetNamePopoverButton from "./EditPresetNamePopoverButton";
import LoadOrSaveSettingsPopoverButton from "./LoadOrSaveSettingsPopoverButton";
import TooltipWrapper from "./TooltipWrapper";

export default function SimulationPresetLoadSaveControl({
  label,
  labelHoverTabContentDisplay,
  justifyContent,
  itemsAlign,
  labelWidth = "w-24",
  labelTextAlign = "text-left",
  onPointerOver,
  settings,
  controlType,
  index,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  justifyContent?: TailwindJustifyContentOption;
  itemsAlign?: TailwindItemsAlignOption;
  labelWidth?: string;
  labelTextAlign?: string;
  onPointerOver?: () => void;
  settings: LoadableSlimeStoreSettings;
  controlType: "history" | "presets";
  index: number;
}) {
  const [deletePresetText, setDeletePresetText] = useState<string>("Delete");
  const [presetIndicationIcons, setPresetIndicationIcons] = useState<
    ReactNode[]
  >([]);
  const [canLoadOnAutoRand, setCanLoadOnAutoRand] = useState<
    boolean | undefined
  >(
    controlType === "presets"
      ? R.view(
          R.lensPath(["simulationPresets", index, "enabled"]),
          useSlimeStore.getState(),
        )
      : undefined,
  );

  useEffect(() => {
    if (controlType !== "presets") {
      setCanLoadOnAutoRand(undefined);
    } else {
      setCanLoadOnAutoRand(
        R.view(
          R.lensPath(["simulationPresets", index, "enabled"]),
          useSlimeStore.getState(),
        ),
      );
    }
  }, [index, controlType]);

  useEffect(() => {
    const unsub = useSlimeStore.subscribe(
      (state) =>
        R.view(R.lensPath(["simulationPresets", index, "enabled"]), state),
      (newValue) => {
        setCanLoadOnAutoRand(newValue);
      },
    );
    return () => unsub();
  }, [index]);

  function handleCanLoadOnAutoRandChange(newValue: boolean) {
    useSlimeStore.setState(
      R.over(
        R.lensPath(["simulationPresets", index, "enabled"]),
        () => newValue,
      ),
    );
    useSlimeStore.setState(
      produce((state) => {
        state.toast.title = "Load on Auto-Randomization";
        state.toast.description = `Preset "${settings.name}" ${newValue ? "now" : "no longer"} has a chance to load during auto-randomization.`;
        state.toast.type = "info";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
    setCanLoadOnAutoRand(newValue);
  }

  function loadSettings() {
    const storeState = useSlimeStore.getState();
    useSlimeStore.setState(
      produce((state) => {
        state.clockSettings = {
          ...storeState.clockSettings,
          ...(settings.clockSettings || {}),
        };
        state.simulationSettings = {
          ...storeState.simulationSettings,
          ...(settings.simulationSettings || {}),
        };
        state.colorSettings = {
          ...storeState.colorSettings,
          ...(settings.colorSettings || {}),
          slimeColorChangedAt: Date.now(),
        };
        state.presetLoadedAt = Date.now();
        state.toast.title = "Settings Loaded";
        state.toast.description = `Preset "${settings.name}" loaded successfully.`;
        state.toast.type = "success";
        state.toast.lastTriggeredAt = Date.now();
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
    let simulationPresets = useSlimeStore.getState().simulationPresets;
    simulationPresets = simulationPresets.filter(
      (preset) =>
        !(
          preset.name === settings.name &&
          preset.presetType === settings.presetType
        ),
    );

    useSlimeStore.setState(
      produce((state) => {
        state.simulationPresets = simulationPresets;
      }),
    );
  }

  function handleCopyToClipboard() {
    useSlimeStore.setState(
      produce((state) => {
        state.toast.title = "Settings Copied";
        state.toast.description = `Simulation ${controlType === "presets" ? "preset" : "settings"} "${settings.name}" copied to clipboard.`;
        state.toast.type = "success";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
    navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
  }

  function handleEditPresetName(newName: string): boolean {
    const simulationPresets = useSlimeStore.getState().simulationPresets;
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
    const duplicate = simulationPresets.some(
      (storePreset, storeIndex) =>
        storePreset.name === trimmedNewName &&
        storePreset.presetType === settings.presetType &&
        storeIndex !== index,
    );
    if (duplicate) {
      useSlimeStore.setState(
        produce((state) => {
          state.toast.title = "Duplicate Preset Name";
          state.toast.description = `A "${settings.presetType.toLowerCase()}" simulation preset with this name already exists.`;
          state.toast.type = "error";
          state.toast.lastTriggeredAt = Date.now();
        }),
      );
      return false;
    }

    useSlimeStore.setState(
      R.over(R.lensPath(["simulationPresets", index, "name"]), () => newName),
    );
    useSlimeStore.setState(
      produce((state) => {
        state.toast.title = "Preset Renamed";
        state.toast.description = `Preset "${settings.name}" renamed to "${newName}".`;
        state.toast.type = "info";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
    return true;
  }

  return (
    <ControlGroup
      label={label}
      labelHoverTabContentDisplay={labelHoverTabContentDisplay}
      justifyContent={justifyContent}
      itemsAlign={itemsAlign}
      labelWidth={labelWidth}
      labelTextAlign={labelTextAlign}
      onPointerOver={onPointerOver}
      adjustContainerFlexOnSmall={false}
    >
      <div className="flex items-center">
        {controlType === "presets" && (
          <TooltipWrapper tooltipText={settings.presetType}>
            <motion.div
              whileHover={{ backgroundColor: "#0004" }}
              className="flex h-8 w-8 flex-none flex-col items-center justify-center gap-0.5"
            >
              <div className="flex items-center justify-center gap-0.5">
                {presetIndicationIcons[0]}
              </div>
              {presetIndicationIcons.length > 1 && (
                <div className="flex items-center justify-center gap-0.5">
                  {presetIndicationIcons[1]}
                  {presetIndicationIcons[2] || null}
                </div>
              )}
            </motion.div>
          </TooltipWrapper>
        )}
      </div>
      {settings.presetType !== "Clock Only" && controlType === "presets" && (
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
      )}
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
      {SINGLE_PRESET_TYPES.some((type) => type === settings.presetType) && (
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
      {!settings.isBasePreset && controlType === "presets" && (
        <>
          <EditPresetNamePopoverButton
            oldName={settings.name}
            onSave={handleEditPresetName}
          />
          <div className="flex flex-1" />
          <motion.button
            className="flex cursor-pointer border border-rose-800 p-1 text-xs sm:px-2 sm:py-1 sm:text-sm"
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
    </ControlGroup>
  );
}
