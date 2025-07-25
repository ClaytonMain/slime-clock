export type ControlsTabName =
  | "clock-controls"
  | "simulation-controls"
  | "color-controls";

export type SelectOption<T> = {
  value: T;
  label: string;
};

export interface ClockSettings {
  show: boolean;
  size: number;
  digitLayout: "vertical" | "horizontal";
  // yPosition: number;
  // xPosition: number;
  hourFormat: ClockHourFormatValue;
  // showAmPm: boolean;
  // amPmYPosition: number;
  // amPmXPosition: number;
  // amPmSize: number;
  // showSeconds: boolean;
  // type: "Analog" | "Digital";
  // Analog settings
  // TODO: Add analog settings
  // Digital settings
  digitStyle: ClockDigitStyleValue;
  padHours: boolean;
  // secondsYPosition: number;
  // secondsXPosition: number;
  // secondsSize: number;
}

export interface SimulationSettings {
  preset: string;

  agentsNeedRandomization: boolean;
  trailNeedsRandomization: boolean;

  speed: number;
  randomizationEnabled: boolean;
  randomizationInterval: number;

  boundaryBehavior: 0 | 1; // 0: Wrap, 1: Bounce

  // agentCount: AgentCount;
  agentDensity: number;
  gpuTextureWidth: number;
  gpuTextureHeight: number;
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

  displayTextureAspectRatio: TrailDisplayTextureAspectRatio;
  displayTextureTargetQuality: number;
  displayTextureWidth: number;
  displayTextureHeight: number;
  trailClockDecayRate: number;
  trailClockDiffuseRate: number;
  trailBackgroundDecayRate: number;
  trailBackgroundDiffuseRate: number;
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

export interface ColorSettings {
  backgroundColor: string;
  slimeColorMode: SlimeColorMode;
  slimeColorChangedAt: number;
  currentProceduralColorPalettePreset: ProceduralColorPaletteName | "Custom";
  proceduralColorPalette: ProceduralColorPalette;
  proceduralColorPaletteNeedsRandomization: boolean;
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
export type TrailDisplayTextureAspectRatio =
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

export type ProceduralColorPaletteName = "Rainbow" | "B" | "C" | "D" | "E";

export type ProceduralColorPalettePresets = Record<
  ProceduralColorPaletteName,
  ProceduralColorPalette
>;

export type AgentStartTypeDropdownOption = {
  value: string;
  label: AgentStartType;
};

export type TrailDisplayTextureAspectRatioDropdownOption = {
  label: string;
  value: TrailDisplayTextureAspectRatio;
};
