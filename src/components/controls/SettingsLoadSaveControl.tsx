import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import { useEffect, useState, type ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { LoadableSlimeStoreSettings } from "../../types/types";
import LoadOrSaveSettingsPopoverButton from "./LoadOrSaveSettingsPopoverButton";

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
        <div className="flex flex-col items-center p-0.5">
          <Label.Root className="h-full w-(--footer-left-label-width) flex-none place-content-center p-0.5 text-right text-xs leading-none font-medium">
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
        <LoadOrSaveSettingsPopoverButton
          settings={settings}
          buttonType="load"
        />
        {controlType === "history" && (
          <LoadOrSaveSettingsPopoverButton
            settings={settings}
            buttonType="save"
          />
        )}
        {controlType === "presets" && (
          <motion.button
            className="flex cursor-pointer border border-rose-800 bg-rose-950 px-2 py-1"
            onClick={deletePreset}
          >
            {deletePresetText}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
