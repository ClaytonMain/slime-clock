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
  DEFAULT_COLOR_RANDOMIZATION_SETTINGS_PRESET_NAME,
  DEFAULT_COLOR_SETTINGS,
  DEFAULT_PRESETS,
  DEFAULT_SIMULATION_RANDOMIZATION_SETTINGS_PRESET_NAME,
  DEFAULT_SIMULATION_SETTINGS,
  RANDOMIZATION_PRESETS,
} from "../constants/constants";
import {
  type AgentDataUniforms,
  type AgentPositionsUniforms,
  type ClockSettings,
  type ColorRandomizationPreset,
  type ColorRandomizationSettings,
  type ColorSettings,
  type ControlsTabName,
  type LoadableSlimeStoreSettings,
  type RandomizationPreset,
  type SimulationRandomizationPreset,
  type SimulationRandomizationSettings,
  type SimulationSettings,
  type SlimeMoldDisplayPlaneUniforms,
  type SortedSimulationPresets,
  type TexturePlaneUniforms,
  type ToastState,
  type TrailUniforms,
} from "../types/types";
import * as UTILS from "../utils/utils";

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
  controlsClosedAt: number;
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
    agentData: AgentDataUniforms;
    agentPositions: AgentPositionsUniforms;
    trail: TrailUniforms;
    slimeMoldDisplayPlane: SlimeMoldDisplayPlaneUniforms;
    texturePlane: TexturePlaneUniforms;
  };

  portalContainer: HTMLDivElement | null;

  clockSettings: ClockSettings;
  simulationSettings: SimulationSettings;
  colorSettings: ColorSettings;

  randomizationState: {
    simulationRestartRequestedAt: number;
    agentRandomizationRequestedAt: number;
    agentRandomizationCompletedAt: number;
    trailRandomizationRequestedAt: number;
    trailRandomizationCompletedAt: number;
    proceduralColorPaletteRandomizationRequestedAt: number;
    proceduralColorPaletteRandomizationCompletedAt: number;
    backgroundColorRandomizationRequestedAt: number;
    backgroundColorRandomizationCompletedAt: number;
  };
  randomizationSettings: {
    autoRandomizationEnabled: boolean;
    autoRandomizationInterval: number;
    autoRestartEnabled: boolean;
    autoRestartInterval: number;
    allowAgentRandomization: boolean;
    allowTrailRandomization: boolean;
    allowProceduralColorPaletteRandomization: boolean;
    allowBackgroundColorRandomization: boolean;
    simulation: SimulationRandomizationSettings;
    simulationAutoRandomizationMode:
      | "useRandomPreset"
      | "useCurrentRandSettings";
    color: ColorRandomizationSettings;
    colorAutoRandomizationMode: "useRandomPreset" | "useCurrentRandSettings";
  };

  randomizationPresets: RandomizationPreset[];

  controlsState: ControlsState;
  history: LoadableSlimeStoreSettings[];
  simulationPresets: LoadableSlimeStoreSettings[];
  sortedSimulationPresets: SortedSimulationPresets;
  simulationPresetLoadedAt: number;
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

  "randomizationState",

  "controlsState",
  "simulationPresetLoadedAt",
  "lastInteractionAt",
  "interactionState",
  "toast",
  "settingsLastChangedAt",
];

const useSlimeStore = create<SlimeStore>()(
  subscribeWithSelector(
    persist(
      (_, get) => ({
        debug: false,
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
            // The rest of the "requestedAt" values will be set at the appropriate time.
            // Handled in the "InitializationHandler" component.
            requestedAt: 0,
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
          texturePlane: {
            uWindowResolution: new THREE.Uniform(null),
            uShowTexture: new THREE.Uniform(null),
          },
        },

        portalContainer: null,

        // I'm declaring the default values for each of the settings objects
        // spread out like this to make it easier to see what's included in each
        // settings object. Some of the default values are overridden inside
        // the "InitializationHandler" component.
        clockSettings: {
          show: DEFAULT_CLOCK_SETTINGS.show,
          // Size is overridden in the "InitializationHandler" component if
          // "digitLayout" is set to "not set".
          size: DEFAULT_CLOCK_SETTINGS.size,
          // Default digitLayout is "not set", which will trigger the
          // "InitializationHandler" to set it to a valid value.
          digitLayout: DEFAULT_CLOCK_SETTINGS.digitLayout,
          hourFormat: DEFAULT_CLOCK_SETTINGS.hourFormat,
          digitStyle: DEFAULT_CLOCK_SETTINGS.digitStyle,
          padHours: DEFAULT_CLOCK_SETTINGS.padHours,
          showClockShadow: DEFAULT_CLOCK_SETTINGS.showClockShadow,
          clockShadowOpacity: DEFAULT_CLOCK_SETTINGS.clockShadowOpacity,
          clockShadowColor: DEFAULT_CLOCK_SETTINGS.clockShadowColor,
        },
        simulationSettings: {
          // Nearly all of these values will be overridden in the
          // "InitializationHandler" component based on the default preset,
          // if they have not been set previously.
          settingsSetPreviously:
            DEFAULT_SIMULATION_SETTINGS.settingsSetPreviously,

          speed: DEFAULT_SIMULATION_SETTINGS.speed,

          boundaryBehavior: DEFAULT_SIMULATION_SETTINGS.boundaryBehavior,

          agentDensity: DEFAULT_SIMULATION_SETTINGS.agentDensity,
          gpuTextureWidth: DEFAULT_SIMULATION_SETTINGS.gpuTextureWidth,
          gpuTextureHeight: DEFAULT_SIMULATION_SETTINGS.gpuTextureHeight,
          agentStartType: DEFAULT_SIMULATION_SETTINGS.agentStartType,
          agentClockAttraction:
            DEFAULT_SIMULATION_SETTINGS.agentClockAttraction,
          agentClockDepositRate:
            DEFAULT_SIMULATION_SETTINGS.agentClockDepositRate,
          agentBackgroundDepositRate:
            DEFAULT_SIMULATION_SETTINGS.agentBackgroundDepositRate,
          agentSensorDegrees: DEFAULT_SIMULATION_SETTINGS.agentSensorDegrees,
          agentRotationRate: DEFAULT_SIMULATION_SETTINGS.agentRotationRate,
          agentSensorOffset: DEFAULT_SIMULATION_SETTINGS.agentSensorOffset,
          agentSensorWidth: DEFAULT_SIMULATION_SETTINGS.agentSensorWidth,
          agentStepSize: DEFAULT_SIMULATION_SETTINGS.agentStepSize,
          agentCrowdAvoidance: DEFAULT_SIMULATION_SETTINGS.agentCrowdAvoidance,
          agentWanderStrength: DEFAULT_SIMULATION_SETTINGS.agentWanderStrength,

          displayTextureAspectRatio:
            DEFAULT_SIMULATION_SETTINGS.displayTextureAspectRatio,
          displayTextureTargetQuality:
            DEFAULT_SIMULATION_SETTINGS.displayTextureTargetQuality,
          displayTextureWidth: DEFAULT_SIMULATION_SETTINGS.displayTextureWidth,
          displayTextureHeight:
            DEFAULT_SIMULATION_SETTINGS.displayTextureHeight,
          trailClockDecayRate: DEFAULT_SIMULATION_SETTINGS.trailClockDecayRate,
          trailClockDiffuseRate:
            DEFAULT_SIMULATION_SETTINGS.trailClockDiffuseRate,
          trailBackgroundDecayRate:
            DEFAULT_SIMULATION_SETTINGS.trailBackgroundDecayRate,
          trailBackgroundDiffuseRate:
            DEFAULT_SIMULATION_SETTINGS.trailBackgroundDiffuseRate,

          showTextureDisplayPlanes: false,
        },
        colorSettings: {
          settingsSetPreviously: DEFAULT_COLOR_SETTINGS.settingsSetPreviously,
          slimeColorChangedAt: DEFAULT_COLOR_SETTINGS.slimeColorChangedAt,

          backgroundColor: DEFAULT_COLOR_SETTINGS.backgroundColor,
          slimeColorMode: DEFAULT_COLOR_SETTINGS.slimeColorMode,
          proceduralColorPalette: DEFAULT_COLOR_SETTINGS.proceduralColorPalette,
          intensitySmoothing: DEFAULT_COLOR_SETTINGS.intensitySmoothing,
          agentDirectionSmoothing:
            DEFAULT_COLOR_SETTINGS.agentDirectionSmoothing,
          agentDirectionColorOffset:
            DEFAULT_COLOR_SETTINGS.agentDirectionColorOffset,
          clockColorOffset: DEFAULT_COLOR_SETTINGS.clockColorOffset,
          xColorOffset: DEFAULT_COLOR_SETTINGS.xColorOffset,
          yColorOffset: DEFAULT_COLOR_SETTINGS.yColorOffset,
          paletteCycleSpeed: DEFAULT_COLOR_SETTINGS.paletteCycleSpeed,
          paletteCycleScale: DEFAULT_COLOR_SETTINGS.paletteCycleScale,
          paletteCycleType: DEFAULT_COLOR_SETTINGS.paletteCycleType,
        },

        randomizationState: {
          simulationRestartRequestedAt: 0,
          agentRandomizationRequestedAt: 0,
          agentRandomizationCompletedAt: 0,
          trailRandomizationRequestedAt: 0,
          trailRandomizationCompletedAt: 0,
          proceduralColorPaletteRandomizationRequestedAt: 0,
          proceduralColorPaletteRandomizationCompletedAt: 0,
          backgroundColorRandomizationRequestedAt: 0,
          backgroundColorRandomizationCompletedAt: 0,
        },
        randomizationSettings: {
          autoRandomizationEnabled: true,
          autoRandomizationInterval: 1,
          autoRestartEnabled: true,
          autoRestartInterval: 15,
          allowAgentRandomization: true,
          allowTrailRandomization: true,
          allowProceduralColorPaletteRandomization: true,
          allowBackgroundColorRandomization: true,
          simulation:
            UTILS.getRandomizationPresetByNameAndType<SimulationRandomizationPreset>(
              DEFAULT_SIMULATION_RANDOMIZATION_SETTINGS_PRESET_NAME,
              "simulation",
              RANDOMIZATION_PRESETS,
            ).settings,
          simulationAutoRandomizationMode: "useRandomPreset",
          color:
            UTILS.getRandomizationPresetByNameAndType<ColorRandomizationPreset>(
              DEFAULT_COLOR_RANDOMIZATION_SETTINGS_PRESET_NAME,
              "color",
              RANDOMIZATION_PRESETS,
            ).settings,
          colorAutoRandomizationMode: "useRandomPreset",
        },

        randomizationPresets: RANDOMIZATION_PRESETS,

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
          controlsClosedAt: Date.now(),
        },
        history: [],
        simulationPresets: DEFAULT_PRESETS,
        sortedSimulationPresets: {
          "Clock Only": [],
          "Simulation Only": [],
          "Color Only": [],
          Combination: [],
        },
        simulationPresetLoadedAt: Date.now(),
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
