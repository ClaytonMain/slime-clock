import * as THREE from "three";
import type {
  AgentStartTypeDropdownOption,
  ClockSettings,
  ColorSettings,
  ProceduralColorPalettePresets,
  SimulationSettings,
  SlimeColorMode,
} from "../types/types";

type ControlsConfigs<T> = {
  [K in keyof T]?: { min: T[K]; max: T[K]; step: number };
};

/**
 * Clock Settings
 */
export const DEFAULT_CLOCK_SETTINGS: ClockSettings = {
  // Shared settings
  show: true,
  size: 50,
  position: new THREE.Vector2(0, 0),
  hourFormat: "24h",
  showAmPm: false,
  amPmPosition: new THREE.Vector2(0.5, -0.5),
  amPmSize: 10,
  showSeconds: false,
  type: "Digital",
  // Analog settings
  // TODO: Add analog settings
  // Digital settings
  digitStyle: "14segment",
  padHours: true,
  secondsPosition: new THREE.Vector2(0.5, -0.5),
  secondsSize: 10,
};
export const CLOCK_CONTROLS_CONFIGS: ControlsConfigs<ClockSettings> = {
  size: { min: 1, max: 100, step: 1 },
};

export const DEFAULT_SIMULATION_SETTINGS: SimulationSettings = {
  quality: "Medium",

  speed: 3.3,
  randomizationEnabled: false,
  randomizationInterval: 120,

  boundaryBehavior: 0, // 0: Wrap, 1: Bounce

  agentDensity: 0.25,
  gpuTextureWidth: Math.floor(Math.sqrt(1920 * 1080 * 0.25)),
  gpuTextureHeight: Math.floor(Math.sqrt(1920 * 1080 * 0.25)),
  agentStartType: 5,
  agentDepositRate: 6.5,
  agentSensorDegrees: 25,
  agentRotationRate: 2.2,
  agentSensorOffset: 1.85,
  agentSensorWidth: 0.42,
  agentStepSize: 1.52,
  agentCrowdAvoidance: 0.1,
  agentWanderStrength: 5.3,

  trailDisplayTextureResolution: "1920 x 1080",
  displayTextureWidth: 1920,
  displayTextureHeight: 1080,
  trailDecayRate: 0.05,
  trailDiffuseRate: 4.5,
  trailTextDecayRate: 0.39,
  trailTextDiffuseRate: 11.7,
  trailNegativeSpaceDecayRate: 1.8,
  trailNegativeSpaceDiffuseRate: 19.7,
};
export const SIMULATION_CONTROLS_CONFIGS: ControlsConfigs<SimulationSettings> =
  {
    speed: { min: 0.1, max: 10, step: 0.1 },
    randomizationInterval: { min: 1, max: 1200, step: 1 },

    agentDepositRate: { min: 0.0, max: 30.0, step: 0.1 },
    agentSensorDegrees: { min: 0.0, max: 180.0, step: 1.0 },
    agentRotationRate: { min: 0.0, max: 10.0, step: 0.1 },
    agentSensorOffset: { min: 0.0, max: 30.0, step: 0.01 },
    agentSensorWidth: { min: 0.0, max: 30.0, step: 0.01 },
    agentStepSize: { min: 0.0, max: 30.0, step: 0.01 },
    agentCrowdAvoidance: { min: 0.0, max: 1.0, step: 0.01 },
    agentWanderStrength: { min: 0.0, max: 20.0, step: 0.1 },

    trailDecayRate: { min: 0.0, max: 2.0, step: 0.01 },
    trailDiffuseRate: { min: 0.0, max: 30.0, step: 0.1 },
    trailTextDecayRate: { min: 0.0, max: 2.0, step: 0.01 },
    trailTextDiffuseRate: { min: 0.0, max: 30.0, step: 0.1 },
    trailNegativeSpaceDecayRate: { min: 0.0, max: 2.0, step: 0.01 },
    trailNegativeSpaceDiffuseRate: { min: 0.0, max: 30.0, step: 0.1 },
  };

export const SLIME_COLOR_MODES: SlimeColorMode[] = ["Procedural", "Single"];

export const DEFAULT_FOOTER_HEIGHT = 300;

export const PROCEDURAL_COLOR_PALETTE_PRESETS: ProceduralColorPalettePresets = {
  Rainbow: {
    r: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.0 },
    g: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.33 },
    b: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.66 },
  },
  B: {
    r: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.0 },
    g: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.1 },
    b: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.2 },
  },
  C: {
    r: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.0 },
    g: { yOffset: 0.2, amplitude: 0.85, frequency: 0.5, phase: 0.5 },
    b: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.4 },
  },
  D: {
    r: { yOffset: 0.5, amplitude: 0.5, frequency: 3.0, phase: 0.0 },
    g: { yOffset: 0.5, amplitude: 0.5, frequency: 6.0, phase: 0.0 },
    b: { yOffset: 0.5, amplitude: 0.5, frequency: 9.0, phase: 0.0 },
  },
  E: {
    r: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.0 },
    g: { yOffset: 0.8, amplitude: 0.1, frequency: 2.0, phase: 0.0 },
    b: { yOffset: 0.2, amplitude: 0.1, frequency: 3.0, phase: 0.8 },
  },
};

export const DEFAULT_COLOR_SETTINGS: ColorSettings = {
  backgroundColor: "#060808",
  slimeColorMode: "Procedural",
  slimeColorChangedAt: Date.now(),
  currentProceduralColorPalettePreset: "Rainbow",
  proceduralColorPalette: PROCEDURAL_COLOR_PALETTE_PRESETS.Rainbow,
};

const flickerPoints = Array.from({ length: 11 }, (_, i) => i / 10);
const flickerInOpacity = flickerPoints.map((point) =>
  Math.min(
    1,
    Math.max(
      0,
      Math.sin(6 * Math.PI * point) * Math.sin(Math.PI * point) * 0.4 + point,
    ),
  ),
);

export const ANIMATION_CONFIGS = {
  flickerIn: {
    opacity: flickerInOpacity,
    transition: {
      duration: 0.3,
      times: flickerPoints,
      when: "beforeChildren",
    },
  },
  flickerOut: {
    opacity: flickerInOpacity.slice().reverse(),
    transition: {
      duration: 0.3,
      times: flickerPoints,
      when: "afterChildren",
    },
  },
};

export const ANIMATABLE_COLORS = {
  footer: {
    backgroundOpen: "#060709aa",
    backgroundClosed: "#06070900",
  },
};

export const AGENT_START_TYPE_DROPDOWN_OPTIONS: AgentStartTypeDropdownOption[] =
  [
    { value: "-1", label: "Random" },
    { value: "0", label: "Center" },
    { value: "1", label: "Ring" },
    { value: "2", label: "9 Rings" },
    { value: "3", label: "Circle" },
    { value: "4", label: "Spiral" },
    { value: "5", label: "Fill" },
  ] as const;
