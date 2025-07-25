import type {
  AgentStartTypeDropdownOption,
  ClockSettings,
  ColorSettings,
  ProceduralColorPaletteChannel,
  ProceduralColorPalettePresets,
  SimulationRandomizationSettings,
  SimulationSettings,
  SlimeColorMode,
  TrailDisplayTextureAspectRatioDropdownOption,
} from "../types/types";

type ControlsConfigs<T> = {
  [K in keyof T]?: { min: T[K]; max: T[K]; step: number };
};

export const DEFAULT_CLOCK_SETTINGS: ClockSettings = {
  // Shared settings
  show: true,
  size: 50,
  digitLayout: "horizontal",
  // position: new THREE.Vector2(0, 0),
  hourFormat: "24h",
  // showAmPm: false,
  // amPmPosition: new THREE.Vector2(0.5, -0.5),
  // amPmSize: 10,
  // showSeconds: false,
  // type: "Digital",
  // Analog settings
  // TODO: Add analog settings
  // Digital settings
  digitStyle: "14segment",
  padHours: true,
  // secondsPosition: new THREE.Vector2(0.5, -0.5),
  // secondsSize: 10,
};
export const CLOCK_CONTROLS_CONFIGS: ControlsConfigs<ClockSettings> = {
  size: { min: 1, max: 100, step: 1 },
};

export const DEFAULT_SIMULATION_SETTINGS: SimulationSettings = {
  preset: "Default",

  agentsNeedRandomization: false,
  trailNeedsRandomization: false,

  speed: 3.3,
  randomizationEnabled: true,
  randomizationInterval: 120,

  boundaryBehavior: 0, // 0: Wrap, 1: Bounce

  agentDensity: 0.25,
  gpuTextureWidth: 16,
  gpuTextureHeight: 16,
  agentStartType: 5,
  agentClockAttraction: 0.05,
  agentClockDepositRate: 6.5,
  agentBackgroundDepositRate: 6.5,
  agentSensorDegrees: 25,
  agentRotationRate: 2.2,
  agentSensorOffset: 1.85,
  agentSensorWidth: 0.42,
  agentStepSize: 1.52,
  agentCrowdAvoidance: 0.1,
  agentWanderStrength: 5.3,

  displayTextureAspectRatio: "Window",
  displayTextureTargetQuality: 1.0,
  displayTextureWidth: -1,
  displayTextureHeight: -1,
  trailClockDecayRate: 0.05,
  trailClockDiffuseRate: 4.5,
  trailBackgroundDecayRate: 0.39,
  trailBackgroundDiffuseRate: 11.7,
};

export const SIMULATION_CONTROLS_CONFIGS: ControlsConfigs<SimulationSettings> =
  {
    speed: { min: 0.1, max: 10, step: 0.1 },
    randomizationInterval: { min: 1, max: 1200, step: 1 },

    agentClockAttraction: { min: 0.0, max: 1.0, step: 0.01 },
    agentClockDepositRate: { min: 0.0, max: 30.0, step: 0.1 },
    agentBackgroundDepositRate: { min: 0.0, max: 30.0, step: 0.1 },
    agentSensorDegrees: { min: 0.0, max: 180.0, step: 1.0 },
    agentRotationRate: { min: 0.0, max: 10.0, step: 0.1 },
    agentSensorOffset: { min: 0.0, max: 30.0, step: 0.01 },
    agentSensorWidth: { min: 0.0, max: 30.0, step: 0.01 },
    agentStepSize: { min: 0.0, max: 30.0, step: 0.01 },
    agentCrowdAvoidance: { min: 0.0, max: 1.0, step: 0.01 },
    agentWanderStrength: { min: 0.0, max: 20.0, step: 0.1 },

    displayTextureTargetQuality: { min: 0.1, max: 10.0, step: 0.1 },
    trailClockDecayRate: { min: 0.0, max: 2.0, step: 0.01 },
    trailClockDiffuseRate: { min: 0.0, max: 30.0, step: 0.1 },
    trailBackgroundDecayRate: { min: 0.0, max: 2.0, step: 0.01 },
    trailBackgroundDiffuseRate: { min: 0.0, max: 30.0, step: 0.1 },
  };

export const DEFAULT_SIMULATION_RANDOMIZATION_SETTINGS: SimulationRandomizationSettings =
  {
    agentClockAttraction: {
      enabled: true,
      range: [0.01, 0.3],
    },
    agentClockDepositRate: {
      enabled: true,
      range: [2.0, 15.0],
    },
    agentBackgroundDepositRate: {
      enabled: true,
      range: [2.0, 15.0],
    },
    agentSensorDegrees: {
      enabled: true,
      range: [15, 75],
    },
    agentRotationRate: {
      enabled: true,
      range: [1.0, 5.0],
    },
    agentSensorOffset: {
      enabled: true,
      range: [0.5, 2.5],
    },
    agentSensorWidth: {
      enabled: true,
      range: [0.2, 0.8],
    },
    agentStepSize: {
      enabled: true,
      range: [0.5, 2.5],
    },
    agentCrowdAvoidance: {
      enabled: true,
      range: [0.05, 0.5],
    },
    agentWanderStrength: {
      enabled: true,
      range: [0.1, 10.0],
    },

    trailClockDecayRate: {
      enabled: true,
      range: [0.01, 0.5],
    },
    trailClockDiffuseRate: {
      enabled: true,
      range: [2.0, 10.0],
    },
    trailBackgroundDecayRate: {
      enabled: true,
      range: [0.01, 0.5],
    },
    trailBackgroundDiffuseRate: {
      enabled: true,
      range: [2.0, 15.0],
    },
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
  proceduralColorPaletteNeedsRandomization: false,
};

export const PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS: ControlsConfigs<ProceduralColorPaletteChannel> =
  {
    yOffset: { min: 0.0, max: 1.0, step: 0.01 },
    amplitude: { min: 0.0, max: 5.0, step: 0.01 },
    frequency: { min: 0.0, max: 5.0, step: 0.01 },
    phase: {
      min: 0.0,
      max: Math.round(Math.PI * 100) / 100,
      step: 0.01,
    },
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

export const SIMULATION_PRESETS: Record<string, Partial<SimulationSettings>> = {
  Default: {},
  "Inverted Gooey": {
    speed: 3.3,
    randomizationEnabled: false,
    agentDensity: 0.25,
    agentStartType: 5,
    agentClockAttraction: 0.09,
    agentClockDepositRate: 5.6,
    agentBackgroundDepositRate: 2.5,
    agentSensorDegrees: 19,
    agentRotationRate: 2.3,
    agentSensorOffset: 1.77,
    agentSensorWidth: 0.52,
    agentStepSize: 2.34,
    agentCrowdAvoidance: 0.22,
    agentWanderStrength: 2.9,
    trailClockDecayRate: 0.28,
    trailClockDiffuseRate: 6.4,
    trailBackgroundDecayRate: 0.07,
    trailBackgroundDiffuseRate: 2.9,
  },
};

export const TRAIL_DISPLAY_TEXTURE_ASPECT_RATIO_OPTIONS: TrailDisplayTextureAspectRatioDropdownOption[] =
  [
    { value: "Window", label: "Window" },
    { value: "16:10", label: "16:10" },
    { value: "16:9", label: "16:9" },
    { value: "4:3", label: "4:3" },
    { value: "3:2", label: "3:2" },
    { value: "1:1", label: "1:1" },
    { value: "2:3", label: "2:3" },
    { value: "3:4", label: "3:4" },
    { value: "9:16", label: "9:16" },
    { value: "10:16", label: "10:16" },
  ];
