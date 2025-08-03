export type ControlsTabName =
  | "randomization-controls"
  | "clock-controls"
  | "simulation-controls"
  | "color-controls"
  | "presets-controls";

export type SelectOption<T> = {
  value: T;
  label: string;
};

export interface LoadableClockSettings {
  show: boolean;
  size: number;
  digitLayout: "vertical" | "horizontal";
  hourFormat: ClockHourFormatValue;
  digitStyle: ClockDigitStyleValue;
  padHours: boolean;
  showClockShadow: boolean;
  clockShadowOpacity: number;
  clockShadowColor: string;
}
// To match the SimulationSettings and ColorSettings interface layout.
export type ClockSettings = LoadableClockSettings;

export interface LoadableSimulationSettings {
  speed: number;

  boundaryBehavior: 0 | 1; // 0: Wrap, 1: Bounce

  agentDensity: number;
  agentStartType: number;
  agentClockAttraction: number;
  agentClockDepositRate: number;
  agentBackgroundDepositRate: number;
  agentSensorDegrees: number;
  agentRotationRate: number;
  agentSensorOffset: number;
  agentSensorWidth: number;
  agentStepSize: number;
  agentCrowdAvoidance: number;
  agentWanderStrength: number;

  displayTextureAspectRatio: DisplayTextureAspectRatio;
  displayTextureTargetQuality: number;
  trailClockDecayRate: number;
  trailClockDiffuseRate: number;
  trailBackgroundDecayRate: number;
  trailBackgroundDiffuseRate: number;
}

export interface SimulationSettings extends LoadableSimulationSettings {
  preset: string;

  // TODO: Move these randomization settings somewhere else.
  allowAgentsRandomization: boolean;
  allowTrailRandomization: boolean;
  agentsNeedRandomization: boolean;
  trailNeedsRandomization: boolean;

  autoRandomizationEnabled: boolean;
  autoRandomizationInterval: number;
  autoRestartEnabled: boolean;
  autoRestartInterval: number;

  simulationNeedsRestart: boolean;

  gpuTextureWidth: number;
  gpuTextureHeight: number;

  displayTextureWidth: number;
  displayTextureHeight: number;
}

export interface RandomizationSetting {
  enabled: boolean;
  range: [number, number];
}

export interface SimulationRandomizationSettings {
  agentClockAttraction: RandomizationSetting;
  agentClockDepositRate: RandomizationSetting;
  agentBackgroundDepositRate: RandomizationSetting;
  agentSensorDegrees: RandomizationSetting;
  agentRotationRate: RandomizationSetting;
  agentSensorOffset: RandomizationSetting;
  agentSensorWidth: RandomizationSetting;
  agentStepSize: RandomizationSetting;
  agentCrowdAvoidance: RandomizationSetting;
  agentWanderStrength: RandomizationSetting;

  trailClockDecayRate: RandomizationSetting;
  trailClockDiffuseRate: RandomizationSetting;
  trailBackgroundDecayRate: RandomizationSetting;
  trailBackgroundDiffuseRate: RandomizationSetting;
}

export interface ProceduralColorPaletteChannel {
  yOffset: number;
  amplitude: number;
  frequency: number;
  phase: number;
}

export interface ProceduralColorPalette {
  r: ProceduralColorPaletteChannel;
  g: ProceduralColorPaletteChannel;
  b: ProceduralColorPaletteChannel;
}

export type SlimeColorMode = "Procedural" | "Single";

export interface LoadableColorSettings {
  backgroundColor: string;
  slimeColorMode: SlimeColorMode;
  proceduralColorPalette: ProceduralColorPalette;
  intensitySmoothing: number;
  agentDirectionSmoothing: number;
  agentDirectionColorOffset: number;
  clockColorOffset: number;
  xColorOffset: number;
  yColorOffset: number;
  paletteCycleSpeed: number;
  paletteCycleScale: number;
  paletteCycleType: number;
}
export interface ColorSettings extends LoadableColorSettings {
  slimeColorChangedAt: number;
  currentProceduralColorPalettePreset: ProceduralColorPaletteName | "Custom";
  proceduralColorPaletteNeedsRandomization: boolean;
  backgroundColorNeedsRandomization: boolean;
  allowProceduralColorPaletteRandomization: boolean;
  allowBackgroundColorRandomization: boolean;
}

/**
 * Clock Settings Types
 */
export type ClockDigitStyleValue =
  | "7segment"
  | "14segment"
  | "dotmatrix"
  | "opticbot";
export type ClockHourFormatValue = "12h" | "24h";

/**
 * Simulation Settings Types
 */
export type SimulationQuality =
  | "Very Low"
  | "Low"
  | "Medium"
  | "High"
  | "Very High"
  | "Custom";
export type AgentStartType =
  | "Random"
  | "Center"
  | "Ring"
  | "9 Rings"
  | "Circle"
  | "Spiral"
  | "Fill";
export type TrailDisplayTextureResolution =
  | "426 x 240"
  | "640 x 360"
  | "854 x 480"
  | "1280 x 720"
  | "1920 x 1080"
  | "2560 x 1440"
  | "3840 x 2160";
export type DisplayTextureAspectRatio =
  | "Window"
  | "16:10"
  | "16:9"
  | "4:3"
  | "3:2"
  | "1:1"
  | "2:3"
  | "3:4"
  | "9:16"
  | "10:16";

export type ProceduralColorPaletteName =
  | "Rainbow"
  | "Red"
  | "B"
  | "C"
  | "D"
  | "E";

export type ProceduralColorPalettePresets = Record<
  ProceduralColorPaletteName,
  ProceduralColorPalette
>;

export type AgentStartTypeDropdownOption = {
  value: string;
  label: AgentStartType;
};

export type DisplayTextureAspectRatioDropdownOption = {
  value: string;
  label: DisplayTextureAspectRatio;
};
export type TailwindItemsAlignOption =
  | "baseline"
  | "baseline-last"
  | "center"
  | "center-safe"
  | "end"
  | "end-safe"
  | "start"
  | "stretch";
export type TailwindJustifyContentOption =
  | "start"
  | "end"
  | "end-safe"
  | "center"
  | "center-safe"
  | "between"
  | "around"
  | "evenly"
  | "stretch"
  | "baseline"
  | "normal";

export type PaletteCycleType = "Oscillating" | "Repeating" | "Continuous";
export type PaletteCycleTypeOption = {
  value: string;
  label: PaletteCycleType;
};

export type LoadableSlimeStoreSettings = {
  name: string;
  clockSettings?: LoadableClockSettings;
  simulationSettings?: LoadableSimulationSettings;
  colorSettings?: LoadableColorSettings;
};
