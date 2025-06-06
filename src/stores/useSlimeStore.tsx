import { produce } from "immer";
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import type {
  ClockFormatValue,
  ClockStyleValue,
  FooterTabName,
} from "../types/types";

type AgentStartType =
  | "Random"
  | "Center"
  | "Ring"
  | "9 Rings"
  | "Circle"
  | "Spiral"
  | "Fill";
type trailDisplayTextureResolution =
  | "640 x 480"
  | "800 x 600"
  | "1280 x 720"
  | "1920 x 1080"
  | "2560 x 1440"
  | "3840 x 2160";

interface ClockSettings {
  style: ClockStyleValue;
  format: ClockFormatValue;
  size: number;
}

interface SimulationSettings {
  quality: "Very Low" | "Low" | "Medium" | "High" | "Very High" | "Custom";

  speed: number;
  randomizationEnabled: boolean;
  randomizationInterval: number;

  agentCount: number;
  agentStartType: AgentStartType;
  agentDepositRate: number;
  agentSensorDegrees: number;
  agentRotationRate: number;
  agentSensorOffset: number;
  agentSensorWidth: number;
  agentStepSize: number;
  agentCrowdAvoidance: number;
  agentWanderStrength: number;

  trailDisplayTextureResolution: trailDisplayTextureResolution;
  trailDecayRate: number;
  trailDiffuseRate: number;
  trailTextDecayRate: number;
  trailTextDiffuseRate: number;
  trailNegativeSpaceDecayRate: number;
  trailNegativeSpaceDiffuseRate: number;
}

interface ColorSettings {
  backgroundColor: string;
}

interface FooterState {
  selectedTab: FooterTabName;
  footerIsOpen: boolean;
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

const defaultClockSettings: ClockSettings = {
  style: "7segment",
  format: "24h",
  size: 100,
};

const defaultSimulationSettings: SimulationSettings = {
  quality: "Medium",

  speed: 2.7,
  randomizationEnabled: false,
  randomizationInterval: 120,

  agentCount: 256 * 256,
  agentStartType: "Random",
  agentDepositRate: 6.1,
  agentSensorDegrees: 24,
  agentRotationRate: 1.7,
  agentSensorOffset: 17.2,
  agentSensorWidth: 3.0,
  agentStepSize: 10.0,
  agentCrowdAvoidance: 0.21,
  agentWanderStrength: 4.1,

  trailDisplayTextureResolution: "1280 x 720",
  trailDecayRate: 0.39,
  trailDiffuseRate: 11.7,
  trailTextDecayRate: 0.39,
  trailTextDiffuseRate: 11.7,
  trailNegativeSpaceDecayRate: 0.79,
  trailNegativeSpaceDiffuseRate: 19.7,
};

const defaultColorSettings: ColorSettings = {
  backgroundColor: "#060808",
};

const persistOmit: (keyof SlimeStore)[] = ["footerState"];

const useSlimeStore = create<SlimeStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        clockSettings: defaultClockSettings,
        setClockSettings: (newSettings) => {
          set((state) => ({
            clockSettings: {
              ...state.clockSettings,
              ...newSettings,
            },
          }));
        },

        simulationSettings: defaultSimulationSettings,
        setSimulationSettings: (newSettings) => {
          set((state) => ({
            simulationSettings: {
              ...state.simulationSettings,
              ...newSettings,
            },
          }));
        },

        colorSettings: defaultColorSettings,
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
            clockSettings: defaultClockSettings,
            simulationSettings: defaultSimulationSettings,
            colorSettings: defaultColorSettings,
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
            })
          ),
        footerStateSetFooterIsOpen: (isOpen) =>
          set(
            produce((state: SlimeStore) => {
              state.footerState.footerIsOpen = isOpen;
            })
          ),
        footerStateOpenFooterOntoTab: (tabName) =>
          set(
            produce((state: SlimeStore) => {
              state.footerState.selectedTab = tabName;
              state.footerState.footerIsOpen = true;
            })
          ),
      }),
      {
        name: "slime-storage",
        version: 0,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) => !persistOmit.includes(key as keyof SlimeStore)
            )
          ),
      }
    )
  )
);

export default useSlimeStore;
