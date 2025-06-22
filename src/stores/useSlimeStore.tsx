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
  openHeight: number;
  selectedTab: FooterTabName;
  footerIsOpen: boolean;
  isDimmedForEdit: boolean;
  tabButtonVisibility: "show" | "hide" | "dimmed";
}

interface SlimeStore {
  clockSettings: ClockSettings;
  simulationSettings: SimulationSettings;
  colorSettings: ColorSettings;
  resetSettings: () => void;
  footerState: FooterState;
  footerStateSetSelectedTab: (tabName: FooterTabName) => void;
  footerStateSetFooterIsOpen: (isOpen: boolean) => void;
  footerStateOpenFooterOntoTab: (tabName: FooterTabName) => void;
  tooltipText: string | null;
  tooltipActive: boolean;
}

const persistOmit: (keyof SlimeStore)[] = ["footerState", "colorSettings"];

const useSlimeStore = create<SlimeStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        clockSettings: DEFAULT_CLOCK_SETTINGS,

        simulationSettings: DEFAULT_SIMULATION_SETTINGS,

        colorSettings: DEFAULT_COLOR_SETTINGS,

        resetSettings: () => {
          set({
            clockSettings: DEFAULT_CLOCK_SETTINGS,
            simulationSettings: DEFAULT_SIMULATION_SETTINGS,
            colorSettings: DEFAULT_COLOR_SETTINGS,
          });
        },

        footerState: {
          // TODO: Make this dynamic based on window size
          openHeight: DEFAULT_FOOTER_HEIGHT * 2,
          selectedTab: "color-settings",
          footerIsOpen: false,
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

        tooltipText: null,
        tooltipActive: false,
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
