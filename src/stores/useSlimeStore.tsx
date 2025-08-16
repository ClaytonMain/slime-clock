import type { ReactNode } from "react";
import * as THREE from "three";
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
  AgentDataUniforms,
  AgentPositionsUniforms,
  ClockSettings,
  ColorSettings,
  ControlsTabName,
  LoadableSlimeStoreSettings,
  SimulationRandomizationSettings,
  SimulationSettings,
  SlimeMoldDisplayPlaneUniforms,
  SortedPresets,
  TexturePlaneUniforms,
  ToastState,
  TrailUniforms,
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
  debug: boolean;
  debugConsoleLogger: (...data: unknown[]) => void;
  initialization: {
    lastUpdatedAt: number;
    controlsDisplayStatus: "initializing" | "ready";
    slimeClockDisplayStatus: "initializing" | "ready";
    all: {
      initialized: boolean;
      requestedAt: number;
      completedAt: number;
    };
    storeSettings: {
      initialized: boolean;
      requestedAt: number;
      completedAt: number;
    };
    resolutions: {
      initialized: boolean;
      requestedAt: number;
      completedAt: number;
    };
    uniforms: {
      initialized: boolean;
      requestedAt: number;
      completedAt: number;
    };
  };
  uniforms: {
    texturePlane: TexturePlaneUniforms;
    slimeMoldDisplayPlane: SlimeMoldDisplayPlaneUniforms;
    agentData: AgentDataUniforms;
    agentPositions: AgentPositionsUniforms;
    trail: TrailUniforms;
  };

  portalContainer: HTMLDivElement | null;
  resolutionsSet: boolean;
  resolutionsRequestedSetAt: number;
  resolutionsSetAt: number;
  initialized: boolean;
  initializationRequestedAt: number;
  initializedAt: number;
  agentsNeedRandomization: boolean;
  trailNeedsRandomization: boolean;
  simulationNeedsRestart: boolean;
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
  showFPS: boolean;
  settingsLastChangedAt: number;
}

const persistOmit: (keyof SlimeStore)[] = [
  "debug",
  "debugConsoleLogger",
  "initialization",
  "uniforms",

  "portalContainer",
  "resolutionsSet",
  "resolutionsRequestedSetAt",
  "resolutionsSetAt",
  "initialized",
  "initializationRequestedAt",
  "initializedAt",
  "controlsState",
  "presetLoadedAt",
  "lastInteractionAt",
  "interactionState",
  "toast",
  "settingsLastChangedAt",
];

const useSlimeStore = create<SlimeStore>()(
  subscribeWithSelector(
    persist(
      (_, get) => ({
        debug: true,
        debugConsoleLogger: (...data: unknown[]) => {
          if (get().debug) {
            console.log(...data);
          }
        },
        initialization: {
          lastUpdatedAt: Date.now(),
          controlsDisplayStatus: "initializing",
          slimeClockDisplayStatus: "initializing",
          // Updating "all" requestedAt should trigger a complete re-initialization.
          all: {
            initialized: false,
            requestedAt: Date.now(), // Setting to Date.now() to trigger initialization on load.
            completedAt: 0,
          },
          storeSettings: {
            initialized: false,
            requestedAt: 0, // Setting to 0 for better control over initialization timing.
            completedAt: 0,
          },
          resolutions: {
            initialized: false,
            requestedAt: 0,
            completedAt: 0,
          },
          uniforms: {
            initialized: false,
            requestedAt: 0,
            completedAt: 0,
          },
        },
        uniforms: {
          texturePlane: {
            uWindowResolution: new THREE.Uniform(null),
            uShowTexture: new THREE.Uniform(null),
          },
          slimeMoldDisplayPlane: {
            uTrailTexture: new THREE.Uniform(null),
            uClockTexture: new THREE.Uniform(null),
            uDisplayTextureResolution: new THREE.Uniform(null),
            uDisplayScale: new THREE.Uniform(null),
            uTime: new THREE.Uniform(null),
            uDelta: new THREE.Uniform(null),
            uPaletteA: new THREE.Uniform(null),
            uPaletteB: new THREE.Uniform(null),
            uPaletteC: new THREE.Uniform(null),
            uPaletteD: new THREE.Uniform(null),
            uShowClockShadow: new THREE.Uniform(null),
            uClockShadowOpacity: new THREE.Uniform(null),
            uClockShadowColor: new THREE.Uniform(null),
            uIntensitySmoothing: new THREE.Uniform(null),
            uAgentDirectionSmoothing: new THREE.Uniform(null),
            uAgentDirectionColorOffset: new THREE.Uniform(null),
            uClockColorOffset: new THREE.Uniform(null),
            uXColorOffset: new THREE.Uniform(null),
            uYColorOffset: new THREE.Uniform(null),
            uPaletteCycleTime: new THREE.Uniform(null),
            uPaletteCycleScale: new THREE.Uniform(null),
            uPaletteCycleType: new THREE.Uniform(null),
          },
          agentData: {
            uAgentDataTexture: new THREE.Uniform(null),
            uClockTexture: new THREE.Uniform(null),
            uTrailTexture: new THREE.Uniform(null),
            uDisplayTextureResolution: new THREE.Uniform(null),
            uClockAttraction: new THREE.Uniform(null),
            uSensorAngle: new THREE.Uniform(null),
            uRotationRate: new THREE.Uniform(null),
            uSensorOffset: new THREE.Uniform(null),
            uSensorWidth: new THREE.Uniform(null),
            uStepSize: new THREE.Uniform(null),
            uCrowdAvoidance: new THREE.Uniform(null),
            uWanderStrength: new THREE.Uniform(null),
            uBoundaryBehavior: new THREE.Uniform(null),
            uTime: new THREE.Uniform(null),
            uDelta: new THREE.Uniform(null),
          },
          agentPositions: {
            uAgentDataTexture: new THREE.Uniform(null),
            uDisplayTextureResolution: new THREE.Uniform(null),
          },
          trail: {
            uAgentPositionsTexture: new THREE.Uniform(null),
            uClockTexture: new THREE.Uniform(null),
            uTrailTexture: new THREE.Uniform(null),
            uDisplayTextureResolution: new THREE.Uniform(null),
            uClockDepositRate: new THREE.Uniform(null),
            uBackgroundDepositRate: new THREE.Uniform(null),
            uClockDecayRate: new THREE.Uniform(null),
            uClockDiffuseRate: new THREE.Uniform(null),
            uBackgroundDecayRate: new THREE.Uniform(null),
            uBackgroundDiffuseRate: new THREE.Uniform(null),
            uBoundaryBehavior: new THREE.Uniform(null),
            uDelta: new THREE.Uniform(null),
            uTime: new THREE.Uniform(null),
          },
        },

        portalContainer: null,

        resolutionsSet: false,
        resolutionsRequestedSetAt: Date.now(),
        resolutionsSetAt: 0,

        initialized: false,
        initializationRequestedAt: Date.now(),
        initializedAt: 0,

        agentsNeedRandomization: false,
        trailNeedsRandomization: false,
        simulationNeedsRestart: false,

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
        showFPS: true,
        settingsLastChangedAt: Date.now(),
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
