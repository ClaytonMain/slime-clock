export type FooterTabName =
  | "clock-settings"
  | "simulation-settings"
  | "color-settings";

export type SelectOption<T> = {
  value: T;
  label: string;
};

export interface ClockSettings {
  style: ClockStyleValue;
  format: ClockFormatValue;
  size: number;
}

export interface SimulationSettings {
  quality: SimulationQuality;

  speed: number;
  randomizationEnabled: boolean;
  randomizationInterval: number;

  agentCount: AgentCount;
  agentStartType: AgentStartType;
  agentDepositRate: number;
  agentSensorDegrees: number;
  agentRotationRate: number;
  agentSensorOffset: number;
  agentSensorWidth: number;
  agentStepSize: number;
  agentCrowdAvoidance: number;
  agentWanderStrength: number;

  trailDisplayTextureResolution: TrailDisplayTextureResolution;
  trailDecayRate: number;
  trailDiffuseRate: number;
  trailTextDecayRate: number;
  trailTextDiffuseRate: number;
  trailNegativeSpaceDecayRate: number;
  trailNegativeSpaceDiffuseRate: number;
}

interface ProceduralColorPaletteChannel {
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
}

/**
 * Clock Settings Types
 */
export type ClockStyleValue = "7segment" | "dotmatrix";
export type ClockFormatValue = "12h" | "24h";

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
export type AgentCount =
  | "16384" // 128^2
  | "65536" // 256^2
  | "147456" // 384^2
  | "262144" // 512^2
  | "409600" // 640^2
  | "589824" // 768^2
  | "802816" // 896^2
  | "1048576" // 1024^2
  | "1327104" // 1152^2
  | "1638400" // 1280^2
  | "1982464" // 1408^2
  | "2359296" // 1536^2
  | "2768896" // 1664^2
  | "3211264" // 1792^2
  | "3686400" // 1920^2
  | "4194304"; // 2048^2
export type AgentStartType =
  | "Random"
  | "Center"
  | "Ring"
  | "9 Rings"
  | "Circle"
  | "Spiral"
  | "Fill";
export type TrailDisplayTextureResolution =
  | "640 x 480"
  | "800 x 600"
  | "1280 x 720"
  | "1920 x 1080"
  | "2560 x 1440"
  | "3840 x 2160";

export type ProceduralColorPaletteName = "Rainbow" | "B" | "C" | "D" | "E";

export type ProceduralColorPalettePresets = Record<
  ProceduralColorPaletteName,
  ProceduralColorPalette
>;
