import * as THREE from "three";

export type ControlsTabName =
  | "randomization-controls"
  | "clock-controls"
  | "simulation-controls"
  | "color-controls"
  | "presets-controls"
  | "debug-controls";

export type SelectOption<T> = {
  value: T;
  label: string;
};

export interface LoadableClockSettings {
  show: boolean;
  size: number;
  digitLayout: "vertical" | "horizontal" | "not set";
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

  trailClockDecayRate: number;
  trailClockDiffuseRate: number;
  trailBackgroundDecayRate: number;
  trailBackgroundDiffuseRate: number;
}

export interface SimulationSettings extends LoadableSimulationSettings {
  settingsSetPreviously: boolean;

  gpuTextureWidth: number;
  gpuTextureHeight: number;

  displayTextureWidth: number;
  displayTextureHeight: number;

  showTextureDisplayPlanes: boolean;

  displayTextureAspectRatio: DisplayTextureAspectRatio;
  displayTextureTargetQuality: number;
}

export type RandomizationSettingMode = "flat" | "gaussian";

export interface RandomizationSetting {
  enabled: boolean;
  flatRange: [number, number];
  mu: number;
  sigma: number;
  mode: RandomizationSettingMode;
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
export interface ProceduralColorPaletteChannelRandomizationSettings {
  yOffset: RandomizationSetting;
  amplitude: RandomizationSetting;
  frequency: RandomizationSetting;
  phase: RandomizationSetting;
}
export interface ColorRandomizationSettings {
  proceduralColorPalette: {
    r: ProceduralColorPaletteChannelRandomizationSettings;
    g: ProceduralColorPaletteChannelRandomizationSettings;
    b: ProceduralColorPaletteChannelRandomizationSettings;
  };
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
  settingsSetPreviously: boolean;
  slimeColorChangedAt: number;
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

export type SinglePresetType = "Clock Only" | "Simulation Only" | "Color Only";
export type MultiplePresetType = "Combination";
export type PresetType = SinglePresetType | MultiplePresetType;
export type LoadableSlimeStoreSettings = {
  name: string;
  presetType: PresetType;
  isBasePreset?: boolean;
  clockSettings?: LoadableClockSettings;
  simulationSettings?: LoadableSimulationSettings;
  colorSettings?: LoadableColorSettings;
};

export type ToastState = {
  title: string | null;
  description: string | null;
  type: "success" | "error" | "info" | null;
  lastTriggeredAt: number;
};

export type SortedPresets = Record<PresetType, LoadableSlimeStoreSettings[]>;

export type TexturePlaneUniformsKey = "uWindowResolution" | "uShowTexture";
export type TexturePlaneUniforms = Record<
  TexturePlaneUniformsKey,
  THREE.Uniform
>;

export type SlimeMoldDisplayPlaneUniformsKey =
  | "uTrailTexture"
  | "uClockTexture"
  | "uDisplayTextureResolution"
  | "uDisplayScale"
  | "uTime"
  | "uDelta"
  | "uPaletteA"
  | "uPaletteB"
  | "uPaletteC"
  | "uPaletteD"
  | "uShowClockShadow"
  | "uClockShadowOpacity"
  | "uClockShadowColor"
  | "uIntensitySmoothing"
  | "uAgentDirectionSmoothing"
  | "uAgentDirectionColorOffset"
  | "uClockColorOffset"
  | "uXColorOffset"
  | "uYColorOffset"
  | "uPaletteCycleTime"
  | "uPaletteCycleScale"
  | "uPaletteCycleType";
export type SlimeMoldDisplayPlaneUniforms = Record<
  SlimeMoldDisplayPlaneUniformsKey,
  THREE.Uniform
>;

export type AgentDataUniformsKey =
  | "uAgentDataTexture"
  | "uClockTexture"
  | "uTrailTexture"
  | "uDisplayTextureResolution"
  | "uClockAttraction"
  | "uSensorAngle"
  | "uRotationRate"
  | "uSensorOffset"
  | "uSensorWidth"
  | "uStepSize"
  | "uCrowdAvoidance"
  | "uWanderStrength"
  | "uBoundaryBehavior"
  | "uTime"
  | "uDelta";
export type AgentDataUniforms = Record<AgentDataUniformsKey, THREE.Uniform>;

export type AgentPositionsUniformsKey =
  | "uAgentDataTexture"
  | "uDisplayTextureResolution";
export type AgentPositionsUniforms = Record<
  AgentPositionsUniformsKey,
  THREE.Uniform
>;

export type TrailUniformsKey =
  | "uAgentPositionsTexture"
  | "uClockTexture"
  | "uTrailTexture"
  | "uDisplayTextureResolution"
  | "uClockDepositRate"
  | "uBackgroundDepositRate"
  | "uClockDecayRate"
  | "uClockDiffuseRate"
  | "uBackgroundDecayRate"
  | "uBackgroundDiffuseRate"
  | "uBoundaryBehavior"
  | "uDelta"
  | "uTime";
export type TrailUniforms = Record<TrailUniformsKey, THREE.Uniform>;
