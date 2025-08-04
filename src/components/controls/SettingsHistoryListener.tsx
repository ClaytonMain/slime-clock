import { produce } from "immer";
import { useEffect } from "react";
import {
  LOADABLE_CLOCK_SETTINGS_KEYS,
  LOADABLE_COLOR_SETTINGS_KEYS,
  LOADABLE_SIMULATION_SETTINGS_KEYS,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  LoadableClockSettings,
  LoadableColorSettings,
  LoadableSimulationSettings,
  LoadableSlimeStoreSettings,
} from "../../types/types";

export default function SettingsHistoryListener() {
  const simulationSettings = useSlimeStore((state) => state.simulationSettings);
  const clockSettings = useSlimeStore((state) => state.clockSettings);
  const colorSettings = useSlimeStore((state) => state.colorSettings);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const presetLoadedAt = useSlimeStore.getState().presetLoadedAt;
      if (Date.now() - presetLoadedAt < 1500) return;

      const previousEntry: Partial<LoadableSlimeStoreSettings> =
        [...useSlimeStore.getState().history][0] || {};
      let hasChanges = false;

      const previousClockSettings: Partial<LoadableClockSettings> =
        previousEntry.clockSettings || {};
      const newClockSettings: Partial<LoadableClockSettings> = {};
      LOADABLE_CLOCK_SETTINGS_KEYS.forEach((key) => {
        const currentKey = key as keyof LoadableClockSettings;
        if (previousClockSettings[currentKey] !== clockSettings[currentKey]) {
          // @ts-expect-error These are compatible.
          newClockSettings[currentKey] = clockSettings[currentKey];
          hasChanges = true;
        } else {
          // @ts-expect-error These are compatible.
          newClockSettings[currentKey] = previousClockSettings[currentKey];
        }
      });

      const previousSimulationSettings: Partial<LoadableSimulationSettings> =
        previousEntry.simulationSettings || {};
      const newSimulationSettings: Partial<LoadableSimulationSettings> = {};
      LOADABLE_SIMULATION_SETTINGS_KEYS.forEach((key) => {
        const currentKey = key as keyof LoadableSimulationSettings;
        if (
          previousSimulationSettings[currentKey] !==
          simulationSettings[currentKey]
        ) {
          // @ts-expect-error These are compatible.
          newSimulationSettings[currentKey] = simulationSettings[currentKey];
          hasChanges = true;
        } else {
          // @ts-expect-error These are compatible.
          newSimulationSettings[currentKey] =
            previousSimulationSettings[currentKey];
        }
      });

      const previousColorSettings: Partial<LoadableColorSettings> =
        previousEntry.colorSettings || {};
      const newColorSettings: Partial<LoadableColorSettings> = {};
      LOADABLE_COLOR_SETTINGS_KEYS.forEach((key) => {
        const currentKey = key as keyof LoadableColorSettings;
        if (previousColorSettings[currentKey] !== colorSettings[currentKey]) {
          // @ts-expect-error These are compatible.
          newColorSettings[currentKey] = colorSettings[currentKey];
          hasChanges = true;
        } else {
          // @ts-expect-error These are compatible.
          newColorSettings[currentKey] = previousColorSettings[currentKey];
        }
      });

      if (hasChanges) {
        const newEntry: LoadableSlimeStoreSettings = {
          name: new Date().toLocaleString(),
          presetType: "Combination",
          clockSettings: newClockSettings as LoadableClockSettings,
          simulationSettings:
            newSimulationSettings as LoadableSimulationSettings,
          colorSettings: newColorSettings as LoadableColorSettings,
        };
        console.log("Settings history changes detected:", newEntry);

        const history = [newEntry, ...useSlimeStore.getState().history];
        if (history.length > 100) {
          history.pop();
        }
        useSlimeStore.setState(
          produce((state) => {
            state.history = [...history];
          }),
        );
      } else {
        console.log("No changes detected in settings history.");
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [simulationSettings, clockSettings, colorSettings]);

  return null;
}
