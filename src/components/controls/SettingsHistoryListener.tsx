import { produce } from "immer";
import { useEffect } from "react";
import {
  CLOCK_SETTINGS_HISTORY_KEYS,
  COLOR_SETTINGS_HISTORY_KEYS,
  SIMULATION_SETTINGS_HISTORY_KEYS,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  ClockSettingsHistory,
  ColorSettingsHistory,
  SimulationSettingsHistory,
  SlimeStoreSettingsHistory,
} from "../../types/types";

export default function SettingsHistoryListener() {
  const simulationSettings = useSlimeStore((state) => state.simulationSettings);
  const clockSettings = useSlimeStore((state) => state.clockSettings);
  const colorSettings = useSlimeStore((state) => state.colorSettings);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const previousEntry: Partial<SlimeStoreSettingsHistory> =
        [...useSlimeStore.getState().history][0] || {};
      let hasChanges = false;

      const previousClockSettings: Partial<ClockSettingsHistory> =
        previousEntry.clockSettings || {};
      const newClockSettings: Partial<ClockSettingsHistory> = {};
      CLOCK_SETTINGS_HISTORY_KEYS.forEach((key) => {
        const currentKey = key as keyof ClockSettingsHistory;
        if (previousClockSettings[currentKey] !== clockSettings[currentKey]) {
          // @ts-expect-error These are compatible.
          newClockSettings[currentKey] = clockSettings[currentKey];
          hasChanges = true;
        } else {
          // @ts-expect-error These are compatible.
          newClockSettings[currentKey] = previousClockSettings[currentKey];
        }
      });

      const previousSimulationSettings: Partial<SimulationSettingsHistory> =
        previousEntry.simulationSettings || {};
      const newSimulationSettings: Partial<SimulationSettingsHistory> = {};
      SIMULATION_SETTINGS_HISTORY_KEYS.forEach((key) => {
        const currentKey = key as keyof SimulationSettingsHistory;
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

      const previousColorSettings: Partial<ColorSettingsHistory> =
        previousEntry.colorSettings || {};
      const newColorSettings: Partial<ColorSettingsHistory> = {};
      COLOR_SETTINGS_HISTORY_KEYS.forEach((key) => {
        const currentKey = key as keyof ColorSettingsHistory;
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
        const newEntry: SlimeStoreSettingsHistory = {
          clockSettings: newClockSettings as ClockSettingsHistory,
          simulationSettings:
            newSimulationSettings as SimulationSettingsHistory,
          colorSettings: newColorSettings as ColorSettingsHistory,
        };
        console.log("Settings history changes detected:", newEntry);

        const history = [newEntry, ...useSlimeStore.getState().history];
        if (history.length > 100) {
          history.pop(); // Keep the history size manageable
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
