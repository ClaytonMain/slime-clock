import { produce } from "immer";
import { motion } from "motion/react";
import { Popover } from "radix-ui";
import { useState } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { SlimeStoreSettingsHistory } from "../../types/types";

export default function LoadSettingsPopoverButton({
  settings,
}: {
  settings: SlimeStoreSettingsHistory;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [includeClockSettings, setIncludeClockSettings] =
    useState<boolean>(true);
  const [includeSimulationSettings, setIncludeSimulationSettings] =
    useState<boolean>(true);
  const [includeColorSettings, setIncludeColorSettings] =
    useState<boolean>(true);
  const portalContainer = useSlimeStore((state) => state.portalContainer);

  function loadSettings() {
    const storeState = useSlimeStore.getState();
    useSlimeStore.setState(
      produce((state) => {
        if (includeClockSettings) {
          state.clockSettings = {
            ...storeState.clockSettings,
            ...settings.clockSettings,
          };
        }
        if (includeSimulationSettings) {
          state.simulationSettings = {
            ...storeState.simulationSettings,
            ...settings.simulationSettings,
          };
        }
        if (includeColorSettings) {
          state.colorSettings = {
            ...storeState.colorSettings,
            ...settings.colorSettings,
          };
        }
        if (
          includeClockSettings ||
          includeSimulationSettings ||
          includeColorSettings
        ) {
          state.presetLoadedAt = Date.now();
        }
      }),
    );
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
          Load
        </motion.button>
      </Popover.Trigger>
      <Popover.Portal container={portalContainer}>
        <Popover.Content align="start" alignOffset={-20}>
          <div className="flex flex-col gap-2 bg-zinc-800 p-2 text-sm text-sky-50">
            <div className="flex gap-2">
              <input
                checked={includeClockSettings}
                onChange={(e) => setIncludeClockSettings(e.target.checked)}
                type="checkbox"
                id={`load-preset-include-clock-settings-${settings.timestamp}`}
              />
              <label
                htmlFor={`load-preset-include-clock-settings-${settings.timestamp}`}
              >
                Include Clock Settings
              </label>
            </div>
            <div className="flex gap-2">
              <input
                checked={includeSimulationSettings}
                onChange={(e) => setIncludeSimulationSettings(e.target.checked)}
                type="checkbox"
                id={`load-preset-include-simulation-settings-${settings.timestamp}`}
              />
              <label
                htmlFor={`load-preset-include-simulation-settings-${settings.timestamp}`}
              >
                Include Simulation Settings
              </label>
            </div>
            <div className="flex gap-2">
              <input
                checked={includeColorSettings}
                onChange={(e) => setIncludeColorSettings(e.target.checked)}
                type="checkbox"
                id={`load-preset-include-color-settings-${settings.timestamp}`}
              />
              <label
                htmlFor={`load-preset-include-color-settings-${settings.timestamp}`}
              >
                Include Color Settings
              </label>
            </div>
            <div className="flex justify-center gap-1">
              <motion.button
                className="flex cursor-pointer border border-sky-800 px-2 py-1"
                style={{ backgroundColor: "#18181b" }}
                whileHover={{ backgroundColor: "#27272a" }}
                onClick={loadSettings}
              >
                Load
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
