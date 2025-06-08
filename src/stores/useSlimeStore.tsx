import { produce } from "immer";
import * as R from "ramda";
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import {
  DEFAULT_CLOCK_SETTINGS,
  DEFAULT_COLOR_SETTINGS,
  DEFAULT_SIMULATION_SETTINGS,
} from "../constants/constants";
import type {
  ClockSettings,
  ColorSettings,
  FooterTabName,
  SimulationSettings,
} from "../types/types";

interface FooterState {
  selectedTab: FooterTabName;
  footerIsOpen: boolean;
}

interface SlimeStore {
  ramdaSet: (storePath: string[], fn: (value: unknown) => unknown) => void;
  clockSettings: ClockSettings;
  setClockSettings: (settings: Partial<ClockSettings>) => void;
  simulationSettings: SimulationSettings;
  setSimulationSettings: (settings: Partial<SimulationSettings>) => void;
  colorSettings: ColorSettings;
  setColorSettings: (settings: Partial<ColorSettings>) => void;
  resetSettings: () => void;
  footerState: FooterState;
  footerStateSetSelectedTab: (tabName: FooterTabName) => void;
  footerStateSetFooterIsOpen: (isOpen: boolean) => void;
  footerStateOpenFooterOntoTab: (tabName: FooterTabName) => void;
}

const persistOmit: (keyof SlimeStore)[] = ["footerState"];

const useSlimeStore = create<SlimeStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        ramdaSet: (storePath, fn) => set(R.over(R.lensPath(storePath), fn)),
        clockSettings: DEFAULT_CLOCK_SETTINGS,
        setClockSettings: (newSettings) => {
          set((state) => ({
            clockSettings: {
              ...state.clockSettings,
              ...newSettings,
            },
          }));
        },

        simulationSettings: DEFAULT_SIMULATION_SETTINGS,
        setSimulationSettings: (newSettings) => {
          set((state) => ({
            simulationSettings: {
              ...state.simulationSettings,
              ...newSettings,
            },
          }));
        },

        colorSettings: DEFAULT_COLOR_SETTINGS,
        setColorSettings: (newSettings) => {
          set((state) => ({
            colorSettings: {
              ...state.colorSettings,
              ...newSettings,
            },
          }));
        },

        resetSettings: () => {
          set({
            clockSettings: DEFAULT_CLOCK_SETTINGS,
            simulationSettings: DEFAULT_SIMULATION_SETTINGS,
            colorSettings: DEFAULT_COLOR_SETTINGS,
          });
        },

        footerState: {
          selectedTab: "clock-settings",
          footerIsOpen: false,
        },
        footerStateSetSelectedTab: (tabName) =>
          set(
            produce((state: SlimeStore) => {
              state.footerState.selectedTab = tabName;
            }),
          ),
        footerStateSetFooterIsOpen: (isOpen) =>
          set(
            produce((state: SlimeStore) => {
              state.footerState.footerIsOpen = isOpen;
            }),
          ),
        footerStateOpenFooterOntoTab: (tabName) =>
          set(
            produce((state: SlimeStore) => {
              state.footerState.selectedTab = tabName;
              state.footerState.footerIsOpen = true;
            }),
          ),
      }),
      {
        name: "slime-storage",
        version: 0,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) => !persistOmit.includes(key as keyof SlimeStore),
            ),
          ),
      },
    ),
  ),
);

export default useSlimeStore;
