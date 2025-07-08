import { produce } from "immer";
import type { ReactNode } from "react";
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
  ControlsTabName,
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

interface ControlsState {
  selectedTab: ControlsTabName;
  isOpen: boolean;
  controlsTriggerDisplayState: "show" | "hide" | "dimmed";
  displayAreaContentName: string | null;
  displayAreaHtmlContent: string | [string, string] | ReactNode | null;
  displayAreaContentType: "html" | "three";
  displayAreaBoundingClientRect: DOMRect | null;
  controlsAreaBoundingClientRect: DOMRect | null;
  selectedTabButtonClientRect: DOMRect | null;
  showSelectedTabCornerIcons: boolean;
}

interface SlimeStore {
  initialized: boolean;
  clockSettings: ClockSettings;
  simulationSettings: SimulationSettings;
  colorSettings: ColorSettings;
  resetSettings: () => void;
  footerState: FooterState;
  footerStateSetSelectedTab: (tabName: FooterTabName) => void;
  footerStateSetFooterIsOpen: (isOpen: boolean) => void;
  footerStateOpenFooterOntoTab: (tabName: FooterTabName) => void;
  controlsState: ControlsState;
}

const persistOmit: (keyof SlimeStore)[] = [
  "footerState",
  "colorSettings",
  "initialized",
  "controlsState",
];

const useSlimeStore = create<SlimeStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        initialized: false,

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

        controlsState: {
          selectedTab: "color-controls",
          isOpen: false,
          controlsTriggerDisplayState: "show", // "show" | "hide" | "dimmed"
          displayAreaContentName: null,
          displayAreaHtmlContent: null,
          displayAreaContentType: "html",
          displayAreaBoundingClientRect: null,
          controlsAreaBoundingClientRect: null,
          selectedTabButtonClientRect: null,
          showSelectedTabCornerIcons: false,
        },
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
