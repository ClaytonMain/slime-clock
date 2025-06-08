import type {
  ClockSettings,
  ColorSettings,
  SimulationSettings,
} from "../types/types";

type ControlsBounds<T> = {
  [K in keyof T]?: { min: T[K]; max: T[K] };
};

/**
 * Clock Settings
 */
export const DEFAULT_CLOCK_SETTINGS: ClockSettings = {
  style: "7segment",
  format: "24h",
  size: 50,
};
export const CLOCK_CONTROLS_BOUNDS: ControlsBounds<ClockSettings> = {
  size: { min: 1, max: 100 },
};

export const DEFAULT_SIMULATION_SETTINGS: SimulationSettings = {
  quality: "Medium",

  speed: 2.7,
  randomizationEnabled: false,
  randomizationInterval: 120,

  agentCount: "147456",
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
export const SIMULATION_CONTROLS_BOUNDS: ControlsBounds<SimulationSettings> = {
  speed: { min: 0.1, max: 10 },

  randomizationInterval: { min: 1, max: 1200 },
  agentDepositRate: { min: 0.0, max: 30.0 },
  agentSensorDegrees: { min: 0.0, max: 180.0 },
  agentRotationRate: { min: 0.0, max: 10.0 },
  agentSensorOffset: { min: 0.0, max: 40.0 },
  agentSensorWidth: { min: 0.0, max: 20.0 },
  agentStepSize: { min: 0.0, max: 100.0 },
  agentCrowdAvoidance: { min: 0.0, max: 1.0 },
  agentWanderStrength: { min: 0.0, max: 20.0 },

  trailDecayRate: { min: 0.0, max: 2.0 },
  trailDiffuseRate: { min: 0.0, max: 30.0 },
  trailTextDecayRate: { min: 0.0, max: 2.0 },
  trailTextDiffuseRate: { min: 0.0, max: 30.0 },
  trailNegativeSpaceDecayRate: { min: 0.0, max: 2.0 },
  trailNegativeSpaceDiffuseRate: { min: 0.0, max: 30.0 },
};

export const DEFAULT_COLOR_SETTINGS: ColorSettings = {
  backgroundColor: "#060808",
};
