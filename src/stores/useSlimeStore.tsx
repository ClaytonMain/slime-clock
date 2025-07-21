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
  DEFAULT_SIMULATION_RANDOMIZATION_SETTINGS,
  DEFAULT_SIMULATION_SETTINGS,
} from "../constants/constants";
import type {
  ClockSettings,
  ColorSettings,
  ControlsTabName,
  SimulationRandomizationSettings,
  SimulationSettings,
} from "../types/types";

interface ControlsState {
  selectedTab: ControlsTabName;
  isOpen: boolean;
  controlsTriggerDisplayState: "show" | "hide" | "dimmed";
  displayAreaContentUpdatedAt: number;
  displayAreaContentName: string | null;
  displayAreaHtmlContent: string | [string, string] | ReactNode | null;
  displayAreaContentType: "html" | "three";
  displayAreaBoundingClientRect: DOMRect | null;
  controlsAreaBoundingClientRect: DOMRect | null;
  selectedTabButtonClientRect: DOMRect | null;
  showSelectedTabCornerIcons: boolean;
}

interface SlimeStore {
  portalContainer: HTMLDivElement | null;
  resolutionsSet: boolean;
  initialized: boolean;
  clockSettings: ClockSettings;
  simulationSettings: SimulationSettings;
  simulationRandomizationSettings: SimulationRandomizationSettings;
  colorSettings: ColorSettings;
  resetSettings: () => void;
  controlsState: ControlsState;
}

const persistOmit: (keyof SlimeStore)[] = [
  "portalContainer",
  "colorSettings",
  "initialized",
  "controlsState",
  "resolutionsSet",
];

const useSlimeStore = create<SlimeStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        portalContainer: null,

        resolutionsSet: false,

        initialized: false,

        clockSettings: DEFAULT_CLOCK_SETTINGS,

        simulationSettings: DEFAULT_SIMULATION_SETTINGS,

        simulationRandomizationSettings:
          DEFAULT_SIMULATION_RANDOMIZATION_SETTINGS,

        colorSettings: DEFAULT_COLOR_SETTINGS,

        resetSettings: () => {
          set({
            clockSettings: DEFAULT_CLOCK_SETTINGS,
            simulationSettings: DEFAULT_SIMULATION_SETTINGS,
            colorSettings: DEFAULT_COLOR_SETTINGS,
          });
        },
        controlsState: {
          selectedTab: "color-controls",
          isOpen: false,
          controlsTriggerDisplayState: "show", // "show" | "hide" | "dimmed"
          displayAreaContentUpdatedAt: Date.now(),
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
