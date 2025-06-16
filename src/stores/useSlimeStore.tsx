import { produce } from "immer";
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import {
  DEFAULT_CLOCK_SETTINGS,
  DEFAULT_COLOR_SETTINGS,
  DEFAULT_FOOTER_HEIGHT,
  DEFAULT_SIMULATION_SETTINGS,
} from "../constants/constants";
import type {
  ClockSettings,
  ColorSettings,
  FooterTabName,
  SimulationSettings,
} from "../types/types";

interface FooterState {
  height: number;
  selectedTab: FooterTabName;
  footerIsOpen: boolean;
  isDimmedForEdit: boolean;
  tabButtonVisibility: "show" | "hide" | "dimmed";
}

interface SlimeStore {
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

const persistOmit: (keyof SlimeStore)[] = ["footerState", "colorSettings"];

const useSlimeStore = create<SlimeStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
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
          height: DEFAULT_FOOTER_HEIGHT,
          selectedTab: "color-settings",
          footerIsOpen: true,
          isDimmedForEdit: false, // Dims the entire footer when editing certain settings
          tabButtonVisibility: "show",
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
