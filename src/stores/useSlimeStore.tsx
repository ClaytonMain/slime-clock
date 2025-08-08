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
  DEFAULT_PRESETS,
  DEFAULT_SIMULATION_RANDOMIZATION_SETTINGS,
  DEFAULT_SIMULATION_SETTINGS,
} from "../constants/constants";
import type {
  ClockSettings,
  ColorSettings,
  ControlsTabName,
  LoadableSlimeStoreSettings,
  SimulationRandomizationSettings,
  SimulationSettings,
  SortedPresets,
  ToastState,
} from "../types/types";

interface ControlsState {
  selectedTab: ControlsTabName;
  isOpen: boolean;
  displayAreaContentUpdatedAt: number;
  displayAreaContentName: string | null;
  displayAreaHtmlContent: string | [string, string] | ReactNode | null;
  displayAreaContentType: "html" | "three";
  displayAreaBoundingClientRect: DOMRect | null;
  controlsAreaBoundingClientRect: DOMRect | null;
  selectedTabButtonClientRect: DOMRect | null;
  showSelectedTabCornerIcons: boolean;
  controlsEditStoppedAt: number;
  accordionValues: Record<string, string | string[]>;
}

interface SlimeStore {
  placeholderSetFunction: () => void;
  portalContainer: HTMLDivElement | null;
  resolutionsSet: boolean;
  initialized: boolean;
  clockSettings: ClockSettings;
  simulationSettings: SimulationSettings;
  simulationRandomizationSettings: SimulationRandomizationSettings;
  colorSettings: ColorSettings;
  controlsState: ControlsState;
  history: LoadableSlimeStoreSettings[];
  presets: LoadableSlimeStoreSettings[];
  sortedPresets: SortedPresets;
  presetLoadedAt: number;
  lastInteractionAt: number;
  interactionState: "active" | "inactive";
  toast: ToastState;
}

const persistOmit: (keyof SlimeStore)[] = [
  "portalContainer",
  "resolutionsSet",
  "initialized",
  "controlsState",
  "presetLoadedAt",
  "lastInteractionAt",
  "interactionState",
  "toast",
];

const useSlimeStore = create<SlimeStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        placeholderSetFunction: () => {
          set({});
        },

        portalContainer: null,

        resolutionsSet: false,

        initialized: false,

        clockSettings: DEFAULT_CLOCK_SETTINGS,

        simulationSettings: DEFAULT_SIMULATION_SETTINGS,

        simulationRandomizationSettings:
          DEFAULT_SIMULATION_RANDOMIZATION_SETTINGS,

        colorSettings: DEFAULT_COLOR_SETTINGS,

        controlsState: {
          selectedTab: "randomization-controls",
          isOpen: false,
          displayAreaContentUpdatedAt: Date.now(),
          displayAreaContentName: null,
          displayAreaHtmlContent: null,
          displayAreaContentType: "html",
          displayAreaBoundingClientRect: null,
          controlsAreaBoundingClientRect: null,
          selectedTabButtonClientRect: null,
          showSelectedTabCornerIcons: false,
          controlsEditStoppedAt: Date.now(),
          accordionValues: {},
        },
        history: [],
        presets: DEFAULT_PRESETS,
        sortedPresets: {
          "Clock Only": [],
          "Simulation Only": [],
          "Color Only": [],
          Combination: [],
        },
        presetLoadedAt: Date.now(),
        lastInteractionAt: Date.now(),
        interactionState: "active",
        toast: {
          title: null,
          description: null,
          type: null,
          lastTriggeredAt: 0,
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
