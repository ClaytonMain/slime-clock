import { produce } from "immer";
import { motion } from "motion/react";
import { Label } from "radix-ui";
import type { ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { SlimeStoreSettingsHistory } from "../../types/types";
import LoadSettingsPopoverButton from "./LoadSettingsPopoverButton";

export default function SettingsLoadSaveControl({
  label,
  labelHoverTabContentDisplay,
  settings,
}: {
  label?: string; // If you want to label the row containing the buttons.
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  settings: SlimeStoreSettingsHistory;
}) {
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
        <LoadSettingsPopoverButton settings={settings} />
      </div>
    </motion.div>
  );
}
