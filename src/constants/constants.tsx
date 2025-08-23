import type {
  AgentStartTypeDropdownOption,
  ClockSettings,
  ColorRandomizationSettings,
  ColorSettings,
  DisplayTextureAspectRatioDropdownOption,
  LoadableClockSettings,
  LoadableColorSettings,
  LoadableSimulationSettings,
  LoadableSlimeStoreSettings,
  MultiplePresetType,
  PaletteCycleTypeOption,
  ProceduralColorPaletteChannel,
  RandomizationSetting,
  SimulationRandomizationSettings,
  SimulationSettings,
  SinglePresetType,
} from "../types/types";

type ControlsConfigs<T> = {
  [K in keyof T]?: { min: T[K]; max: T[K]; step: number };
};

export const DEFAULT_CLOCK_SETTINGS: ClockSettings = {
  show: true,
  size: 50,
  digitLayout: "not set",
  hourFormat: "24h",
  digitStyle: "14segment",
  padHours: true,
  showClockShadow: true,
  clockShadowOpacity: 0.25,
  clockShadowColor: "#6f6f6f",
};
export const CLOCK_CONTROLS_CONFIGS: ControlsConfigs<ClockSettings> = {
  size: { min: 1, max: 100, step: 1 },
  clockShadowOpacity: { min: 0, max: 1, step: 0.01 },
};

export const DEFAULT_SIMULATION_SETTINGS_PRESET_NAME = "Slimy 01";
// TODO: Replace the values in DEFAULT_SIMULATION_SETTINGS that get set
// by the `InitializationHandler` component with some sort of easily-identifiable
// placeholder values (like -1 or -999 or something). Consider commenting on these
// values too so you don't have to keep looking them up.
export const DEFAULT_SIMULATION_SETTINGS: SimulationSettings = {
  settingsSetPreviously: false,

  speed: 3.3,

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

  showTextureDisplayPlanes: true,
};

export const SIMULATION_CONTROLS_CONFIGS: ControlsConfigs<SimulationSettings> =
  {
    speed: { min: 0.1, max: 10, step: 0.1 },

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
      flatRange: [0.01, 0.3],
      mu: 0.15,
      sigma: 0.05,
      mode: "gaussian",
    },
    agentClockDepositRate: {
      enabled: true,
      flatRange: [2.0, 15.0],
      mu: 8.5,
      sigma: 2,
      mode: "gaussian",
    },
    agentBackgroundDepositRate: {
      enabled: true,
      flatRange: [2.0, 15.0],
      mu: 8.5,
      sigma: 2,
      mode: "gaussian",
    },
    agentSensorDegrees: {
      enabled: true,
      flatRange: [15, 75],
      mu: 45,
      sigma: 20,
      mode: "gaussian",
    },
    agentRotationRate: {
      enabled: true,
      flatRange: [1.0, 5.0],
      mu: 3,
      sigma: 1,
      mode: "gaussian",
    },
    agentSensorOffset: {
      enabled: true,
      flatRange: [0.5, 2.5],
      mu: 1.5,
      sigma: 0.5,
      mode: "gaussian",
    },
    agentSensorWidth: {
      enabled: true,
      flatRange: [0.2, 0.8],
      mu: 0.5,
      sigma: 0.2,
      mode: "gaussian",
    },
    agentStepSize: {
      enabled: true,
      flatRange: [0.5, 2.5],
      mu: 1.5,
      sigma: 0.5,
      mode: "gaussian",
    },
    agentCrowdAvoidance: {
      enabled: true,
      flatRange: [0.05, 0.5],
      mu: 0.3,
      sigma: 0.1,
      mode: "gaussian",
    },
    agentWanderStrength: {
      enabled: true,
      flatRange: [0.1, 10.0],
      mu: 5.5,
      sigma: 2.0,
      mode: "gaussian",
    },

    trailClockDecayRate: {
      enabled: true,
      flatRange: [0.01, 0.5],
      mu: 0.25,
      sigma: 0.1,
      mode: "gaussian",
    },
    trailClockDiffuseRate: {
      enabled: true,
      flatRange: [2.0, 10.0],
      mu: 6,
      sigma: 2,
      mode: "gaussian",
    },
    trailBackgroundDecayRate: {
      enabled: true,
      flatRange: [0.01, 0.5],
      mu: 0.25,
      sigma: 0.1,
      mode: "gaussian",
    },
    trailBackgroundDiffuseRate: {
      enabled: true,
      flatRange: [2.0, 15.0],
      mu: 8.5,
      sigma: 2,
      mode: "gaussian",
    },
  };
const DEFAULT_PROCEDURAL_COLOR_PALETTE_RANDOMIZATION_SETTINGS: {
  yOffset: RandomizationSetting;
  amplitude: RandomizationSetting;
  frequency: RandomizationSetting;
  phase: RandomizationSetting;
} = {
  yOffset: {
    enabled: true,
    flatRange: [0.0, 1.0],
    mu: 0.5,
    sigma: 0.3,
    mode: "gaussian",
  },
  amplitude: {
    enabled: true,
    flatRange: [0.05, 0.95],
    mu: 0.5,
    sigma: 0.3,
    mode: "gaussian",
  },
  frequency: {
    enabled: true,
    flatRange: [0.1, 3.0],
    mu: 1.0,
    sigma: 0.75,
    mode: "gaussian",
  },
  phase: {
    enabled: true,
    flatRange: [0.0, 3.14],
    mu: 1.57,
    sigma: 0.7,
    mode: "gaussian",
  },
};
export const DEFAULT_COLOR_RANDOMIZATION_SETTINGS: ColorRandomizationSettings =
  {
    proceduralColorPalette: {
      r: DEFAULT_PROCEDURAL_COLOR_PALETTE_RANDOMIZATION_SETTINGS,
      g: DEFAULT_PROCEDURAL_COLOR_PALETTE_RANDOMIZATION_SETTINGS,
      b: DEFAULT_PROCEDURAL_COLOR_PALETTE_RANDOMIZATION_SETTINGS,
    },
  };

export const DEFAULT_COLOR_SETTINGS_PRESET_NAME = "Rainbow";
export const DEFAULT_COLOR_SETTINGS: ColorSettings = {
  settingsSetPreviously: false,
  slimeColorChangedAt: 0,

  backgroundColor: "#70f3eb",
  slimeColorMode: "Procedural",
  proceduralColorPalette: {
    r: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.0 },
    g: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.33 },
    b: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.66 },
  },
  intensitySmoothing: 0.59,
  agentDirectionSmoothing: 0.68,
  agentDirectionColorOffset: 0.42,
  clockColorOffset: 0.64,
  xColorOffset: 0.65,
  yColorOffset: 0.8,
  paletteCycleSpeed: 0.54,
  paletteCycleScale: 0.1,
  paletteCycleType: 1,
};

export const COLOR_CONTROLS_CONFIGS: ControlsConfigs<ColorSettings> = {
  intensitySmoothing: { min: 0.0, max: 1.0, step: 0.01 },
  agentDirectionSmoothing: { min: 0.0, max: 1.0, step: 0.01 },
  agentDirectionColorOffset: { min: -1.0, max: 1.0, step: 0.01 },
  clockColorOffset: { min: -1.0, max: 1.0, step: 0.01 },
  xColorOffset: { min: -1.0, max: 1.0, step: 0.01 },
  yColorOffset: { min: -1.0, max: 1.0, step: 0.01 },
  paletteCycleSpeed: { min: 0.0, max: 1.0, step: 0.01 },
  paletteCycleScale: { min: 0.01, max: 1.0, step: 0.01 },
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

export const DISPLAY_TEXTURE_ASPECT_RATIO_OPTIONS: DisplayTextureAspectRatioDropdownOption[] =
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
  ] as const;

export const PALETTE_CYCLE_TYPE_OPTIONS: PaletteCycleTypeOption[] = [
  { value: "0", label: "Oscillating" },
  { value: "1", label: "Repeating" },
  { value: "2", label: "Continuous" },
] as const;

export const LOADABLE_CLOCK_SETTINGS_KEYS: (keyof LoadableClockSettings)[] = [
  "show",
  "size",
  "digitLayout",
  "hourFormat",
  "digitStyle",
  "padHours",
  "showClockShadow",
  "clockShadowOpacity",
  "clockShadowColor",
];
export const LOADABLE_SIMULATION_SETTINGS_KEYS: (keyof LoadableSimulationSettings)[] =
  [
    "speed",
    "boundaryBehavior",
    "agentDensity",
    "agentStartType",
    "agentClockAttraction",
    "agentClockDepositRate",
    "agentBackgroundDepositRate",
    "agentSensorDegrees",
    "agentRotationRate",
    "agentSensorOffset",
    "agentSensorWidth",
    "agentStepSize",
    "agentCrowdAvoidance",
    "agentWanderStrength",
    "trailClockDecayRate",
    "trailClockDiffuseRate",
    "trailBackgroundDecayRate",
    "trailBackgroundDiffuseRate",
  ];
export const LOADABLE_COLOR_SETTINGS_KEYS: (keyof LoadableColorSettings)[] = [
  "backgroundColor",
  "slimeColorMode",
  "proceduralColorPalette",
  "intensitySmoothing",
  "agentDirectionSmoothing",
  "agentDirectionColorOffset",
  "clockColorOffset",
  "xColorOffset",
  "yColorOffset",
  "paletteCycleSpeed",
  "paletteCycleScale",
  "paletteCycleType",
];

export const DEFAULT_PRESETS: LoadableSlimeStoreSettings[] = [
  {
    name: "Horizontal",
    presetType: "Clock Only",
    isBasePreset: true,
    clockSettings: {
      show: true,
      size: 50,
      digitLayout: "horizontal",
      hourFormat: "24h",
      digitStyle: "14segment",
      padHours: true,
      showClockShadow: true,
      clockShadowOpacity: 0.25,
      clockShadowColor: "#6f6f6f",
    },
  },
  {
    name: "Vertical",
    presetType: "Clock Only",
    isBasePreset: true,
    clockSettings: {
      show: true,
      size: 30,
      digitLayout: "vertical",
      hourFormat: "24h",
      digitStyle: "14segment",
      padHours: true,
      showClockShadow: true,
      clockShadowOpacity: 0.25,
      clockShadowColor: "#6f6f6f",
    },
  },
  {
    name: "Extra Gooey 01",
    presetType: "Simulation Only",
    isBasePreset: true,
    simulationSettings: {
      speed: 3.3,
      boundaryBehavior: 0,
      agentDensity: 0.25,
      agentStartType: 5,
      agentClockAttraction: 0.2,
      agentClockDepositRate: 12.1,
      agentBackgroundDepositRate: 3.2,
      agentSensorDegrees: 52,
      agentRotationRate: 3.3,
      agentSensorOffset: 0.91,
      agentSensorWidth: 0.28,
      agentStepSize: 1.45,
      agentCrowdAvoidance: 0.16,
      agentWanderStrength: 9.6,
      trailClockDecayRate: 0.05,
      trailClockDiffuseRate: 5.2,
      trailBackgroundDecayRate: 0.07,
      trailBackgroundDiffuseRate: 4.9,
    },
  },
  {
    name: "Extra Gooey 02",
    presetType: "Simulation Only",
    isBasePreset: true,
    simulationSettings: {
      speed: 3.3,
      boundaryBehavior: 0,
      agentDensity: 0.25,
      agentStartType: 5,
      agentClockAttraction: 0.11,
      agentClockDepositRate: 7.4,
      agentBackgroundDepositRate: 14.8,
      agentSensorDegrees: 60,
      agentRotationRate: 4.6,
      agentSensorOffset: 0.74,
      agentSensorWidth: 0.24,
      agentStepSize: 2.26,
      agentCrowdAvoidance: 0.47,
      agentWanderStrength: 2,
      trailClockDecayRate: 0.04,
      trailClockDiffuseRate: 5.7,
      trailBackgroundDecayRate: 0.39,
      trailBackgroundDiffuseRate: 3.7,
    },
  },
  {
    name: "Fuzzy 01",
    presetType: "Simulation Only",
    isBasePreset: true,
    simulationSettings: {
      speed: 3.3,
      boundaryBehavior: 0,
      agentDensity: 0.25,
      agentStartType: 5,
      agentClockAttraction: 0.04,
      agentClockDepositRate: 11,
      agentBackgroundDepositRate: 12.6,
      agentSensorDegrees: 22,
      agentRotationRate: 2.7,
      agentSensorOffset: 2.43,
      agentSensorWidth: 0.35,
      agentStepSize: 1.34,
      agentCrowdAvoidance: 0.33,
      agentWanderStrength: 9.4,
      trailClockDecayRate: 0.02,
      trailClockDiffuseRate: 9.2,
      trailBackgroundDecayRate: 0.28,
      trailBackgroundDiffuseRate: 10.2,
    },
  },
  {
    name: "Inverted Roiling",
    presetType: "Simulation Only",
    isBasePreset: true,
    simulationSettings: {
      speed: 3.3,
      boundaryBehavior: 0,
      agentDensity: 0.25,
      agentStartType: 5,
      agentClockAttraction: 0.2,
      agentClockDepositRate: 3.1,
      agentBackgroundDepositRate: 11.9,
      agentSensorDegrees: 24,
      agentRotationRate: 4.3,
      agentSensorOffset: 2.08,
      agentSensorWidth: 0.43,
      agentStepSize: 2.16,
      agentCrowdAvoidance: 0.37,
      agentWanderStrength: 3.8,
      trailClockDecayRate: 0.47,
      trailClockDiffuseRate: 2.4,
      trailBackgroundDecayRate: 0.07,
      trailBackgroundDiffuseRate: 9.9,
    },
  },
  {
    name: "Slimy 01",
    presetType: "Simulation Only",
    isBasePreset: true,
    simulationSettings: {
      speed: 3.3,
      boundaryBehavior: 0,
      agentDensity: 0.25,
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
      trailClockDecayRate: 0.05,
      trailClockDiffuseRate: 4.5,
      trailBackgroundDecayRate: 0.39,
      trailBackgroundDiffuseRate: 11.7,
    },
  },
  {
    name: "Slimy 02",
    presetType: "Simulation Only",
    isBasePreset: true,
    simulationSettings: {
      speed: 3.3,
      boundaryBehavior: 0,
      agentDensity: 0.25,
      agentStartType: 5,
      agentClockAttraction: 0.18,
      agentClockDepositRate: 7.6,
      agentBackgroundDepositRate: 9.4,
      agentSensorDegrees: 17,
      agentRotationRate: 2.8,
      agentSensorOffset: 1.59,
      agentSensorWidth: 0.31,
      agentStepSize: 2.24,
      agentCrowdAvoidance: 0.41,
      agentWanderStrength: 0.4,
      trailClockDecayRate: 0.05,
      trailClockDiffuseRate: 5,
      trailBackgroundDecayRate: 0.41,
      trailBackgroundDiffuseRate: 12.9,
    },
  },
  {
    name: "Slimy 03",
    presetType: "Simulation Only",
    isBasePreset: true,
    simulationSettings: {
      speed: 3.3,
      boundaryBehavior: 0,
      agentDensity: 0.25,
      agentStartType: 5,
      agentClockAttraction: 0.03,
      agentClockDepositRate: 14.5,
      agentBackgroundDepositRate: 5.9,
      agentSensorDegrees: 47,
      agentRotationRate: 1.5,
      agentSensorOffset: 2.22,
      agentSensorWidth: 0.41,
      agentStepSize: 1.33,
      agentCrowdAvoidance: 0.33,
      agentWanderStrength: 0.4,
      trailClockDecayRate: 0.01,
      trailClockDiffuseRate: 4.5,
      trailBackgroundDecayRate: 0.21,
      trailBackgroundDiffuseRate: 5.2,
    },
  },
  {
    name: "Slimy 04",
    presetType: "Simulation Only",
    isBasePreset: true,
    simulationSettings: {
      speed: 3.3,
      boundaryBehavior: 0,
      agentDensity: 0.25,
      agentStartType: 5,
      agentClockAttraction: 0.07,
      agentClockDepositRate: 9.3,
      agentBackgroundDepositRate: 12.7,
      agentSensorDegrees: 72,
      agentRotationRate: 2.4,
      agentSensorOffset: 1.66,
      agentSensorWidth: 0.25,
      agentStepSize: 1.76,
      agentCrowdAvoidance: 0.17,
      agentWanderStrength: 1.1,
      trailClockDecayRate: 0.06,
      trailClockDiffuseRate: 4.3,
      trailBackgroundDecayRate: 0.43,
      trailBackgroundDiffuseRate: 2,
    },
  },
  {
    name: "Slimy 05",
    presetType: "Simulation Only",
    isBasePreset: true,
    simulationSettings: {
      speed: 3.3,
      boundaryBehavior: 0,
      agentDensity: 0.25,
      agentStartType: 5,
      agentClockAttraction: 0.05,
      agentClockDepositRate: 10.2,
      agentBackgroundDepositRate: 12.2,
      agentSensorDegrees: 20,
      agentRotationRate: 3.2,
      agentSensorOffset: 1.05,
      agentSensorWidth: 0.3,
      agentStepSize: 2.17,
      agentCrowdAvoidance: 0.12,
      agentWanderStrength: 8,
      trailClockDecayRate: 0.08,
      trailClockDiffuseRate: 9.5,
      trailBackgroundDecayRate: 0.49,
      trailBackgroundDiffuseRate: 4.5,
    },
  },
  {
    name: "Slimy 06",
    presetType: "Simulation Only",
    isBasePreset: true,
    simulationSettings: {
      speed: 3.3,
      boundaryBehavior: 0,
      agentDensity: 0.25,
      agentStartType: -1,
      agentClockAttraction: 0.27,
      agentClockDepositRate: 3.3,
      agentBackgroundDepositRate: 11,
      agentSensorDegrees: 47,
      agentRotationRate: 3.8,
      agentSensorOffset: 0.99,
      agentSensorWidth: 0.26,
      agentStepSize: 2.23,
      agentCrowdAvoidance: 0.3,
      agentWanderStrength: 4.6,
      trailClockDecayRate: 0.02,
      trailClockDiffuseRate: 3.5,
      trailBackgroundDecayRate: 0.45,
      trailBackgroundDiffuseRate: 8.7,
    },
  },
  {
    name: "Inverted Gooey",
    presetType: "Simulation Only",
    isBasePreset: true,
    simulationSettings: {
      speed: 3.3,
      boundaryBehavior: 0,
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
  },
  {
    name: "Rainbow",
    presetType: "Color Only",
    isBasePreset: true,
    colorSettings: {
      backgroundColor: "#70f3eb",
      slimeColorMode: "Procedural",
      proceduralColorPalette: {
        r: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.0 },
        g: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.33 },
        b: { yOffset: 0.5, amplitude: 0.5, frequency: 1.0, phase: 0.66 },
      },
      intensitySmoothing: 0.59,
      agentDirectionSmoothing: 0.68,
      agentDirectionColorOffset: 0.42,
      clockColorOffset: 0.64,
      xColorOffset: 0.65,
      yColorOffset: 0.8,
      paletteCycleSpeed: 0.54,
      paletteCycleScale: 0.1,
      paletteCycleType: 1,
    },
  },
  {
    name: "Bi",
    presetType: "Color Only",
    isBasePreset: true,
    colorSettings: {
      backgroundColor: "#510c43",
      slimeColorMode: "Procedural",
      proceduralColorPalette: {
        r: { yOffset: 0.52, amplitude: 0.46, frequency: 1.0, phase: 0.78 },
        g: { yOffset: 0.14, amplitude: 0.07, frequency: 1.0, phase: 0.33 },
        b: { yOffset: 0.74, amplitude: 0.16, frequency: 1.0, phase: 0.2 },
      },
      intensitySmoothing: 0.59,
      agentDirectionSmoothing: 0.68,
      agentDirectionColorOffset: 0.42,
      clockColorOffset: 0.64,
      xColorOffset: 0.65,
      yColorOffset: 0.8,
      paletteCycleSpeed: 0.54,
      paletteCycleScale: 0.1,
      paletteCycleType: 1,
    },
  },
];
export const SINGLE_PRESET_TYPES: SinglePresetType[] = [
  "Clock Only",
  "Simulation Only",
  "Color Only",
];
export const MULTIPLE_PRESET_TYPES: MultiplePresetType[] = ["Combination"];

// {
//   "clockSettings": {
//     "show": true,
//     "size": 20,
//     "digitLayout": "vertical",
//     "hourFormat": "24h",
//     "digitStyle": "14segment",
//     "padHours": true,
//     "showClockShadow": true,
//     "clockShadowOpacity": 0.25,
//     "clockShadowColor": "#6f6f6f"
//   },
//   "simulationSettings": {
//     "speed": 3.3,
//     "boundaryBehavior": 0,
//     "agentDensity": 0.25,
//     "agentStartType": -1,
//     "agentClockAttraction": 0.13,
//     "agentClockDepositRate": 7.9,
//     "agentBackgroundDepositRate": 5.6,
//     "agentSensorDegrees": 59,
//     "agentRotationRate": 3,
//     "agentSensorOffset": 1.02,
//     "agentSensorWidth": 0.14,
//     "agentStepSize": 1.05,
//     "agentCrowdAvoidance": 0.33,
//     "agentWanderStrength": 6.4,
//     "displayTextureAspectRatio": "Window",
//     "displayTextureTargetQuality": 2.1,
//     "trailClockDecayRate": 0.12,
//     "trailClockDiffuseRate": 5.1,
//     "trailBackgroundDecayRate": 0.39,
//     "trailBackgroundDiffuseRate": 11.2
//   },
//   "colorSettings": {
//     "backgroundColor": "#93e0d3",
//     "slimeColorMode": "Procedural",
//     "proceduralColorPalette": {
//       "r": {
//         "yOffset": 1,
//         "amplitude": 0.02,
//         "frequency": 0.09,
//         "phase": 1.07
//       },
//       "g": {
//         "yOffset": 0.08,
//         "amplitude": 0.71,
//         "frequency": 0.11,
//         "phase": 0.8
//       },
//       "b": {
//         "yOffset": 0.16,
//         "amplitude": 0.25,
//         "frequency": 2.1,
//         "phase": 1.43
//       }
//     },
//     "intensitySmoothing": 0.59,
//     "agentDirectionSmoothing": 0.68,
//     "agentDirectionColorOffset": 0.42,
//     "clockColorOffset": 0.64,
//     "xColorOffset": 0.65,
//     "yColorOffset": 0.8,
//     "paletteCycleSpeed": 0.54,
//     "paletteCycleScale": 0.1,
//     "paletteCycleType": 1
//   }
// }

// {
//   "clockSettings": {
//     "show": true,
//     "size": 20,
//     "digitLayout": "vertical",
//     "hourFormat": "24h",
//     "digitStyle": "14segment",
//     "padHours": true,
//     "showClockShadow": true,
//     "clockShadowOpacity": 0.25,
//     "clockShadowColor": "#6f6f6f"
//   },
//   "simulationSettings": {
//     "speed": 3.3,
//     "boundaryBehavior": 0,
//     "agentDensity": 0.25,
//     "agentStartType": -1,
//     "agentClockAttraction": 0.12,
//     "agentClockDepositRate": 8.2,
//     "agentBackgroundDepositRate": 5.7,
//     "agentSensorDegrees": 37,
//     "agentRotationRate": 2.3,
//     "agentSensorOffset": 0.51,
//     "agentSensorWidth": 0.26,
//     "agentStepSize": 2.04,
//     "agentCrowdAvoidance": 0.52,
//     "agentWanderStrength": 3,
//     "displayTextureAspectRatio": "Window",
//     "displayTextureTargetQuality": 2.1,
//     "trailClockDecayRate": 0.24,
//     "trailClockDiffuseRate": 3.4,
//     "trailBackgroundDecayRate": 0.21,
//     "trailBackgroundDiffuseRate": 9
//   },
//   "colorSettings": {
//     "backgroundColor": "#e45526",
//     "slimeColorMode": "Procedural",
//     "proceduralColorPalette": {
//       "r": {
//         "yOffset": 0.46,
//         "amplitude": 0.84,
//         "frequency": 1.2,
//         "phase": 0.89
//       },
//       "g": {
//         "yOffset": 0.39,
//         "amplitude": 0.25,
//         "frequency": 1.42,
//         "phase": 1.04
//       },
//       "b": {
//         "yOffset": 0.41,
//         "amplitude": 1.34,
//         "frequency": 1.22,
//         "phase": 1.55
//       }
//     },
//     "intensitySmoothing": 0.59,
//     "agentDirectionSmoothing": 0.68,
//     "agentDirectionColorOffset": 0.42,
//     "clockColorOffset": 0.64,
//     "xColorOffset": 0.65,
//     "yColorOffset": 0.8,
//     "paletteCycleSpeed": 0.54,
//     "paletteCycleScale": 0.1,
//     "paletteCycleType": 1
//   }
// }
