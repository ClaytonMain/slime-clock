import * as THREE from "three";

export type ControlsTabName =
  | "randomization-controls"
  | "clock-controls"
  | "simulation-controls"
  | "color-controls"
  | "presets-controls"
  | "debug-controls"
  | "info-controls";

export type SelectOption<T> = {
  value: T;
  label: string;
};

export interface LoadableClockSettings {
  clockStyle: "digital" | "analog";
  show: boolean;
  digitalClockSize: number;
  analogClockSize: number;
  digitLayout: "vertical" | "horizontal" | "not set";
  hourFormat: ClockHourFormatValue;
  digitStyle: ClockDigitStyleValue;
  padHours: boolean;
  showClockShadow: boolean;
  clockShadowOpacity: number;
  clockShadowColor: string;
  digitFadeSpeed: number;
  showDigitSeconds: boolean;
  showDigitAmPm: boolean;
}
export interface ClockSettings extends LoadableClockSettings {
  syncTimeOffsetsAutomatically: boolean;
  timeZone: string;
  timeOffsetMinutesOnly: number;
  timeOffsetSecondsOnly: number;
  timeOffsetMsOnly: number;
  timeOffsetTotal: number;
  automaticTimeOffsetRequestedAt: number;
}

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

export type NumericRangeRandomizationSettingMode = "flat" | "gaussian" | "pert";

export interface NumericRangeRandomizationSetting {
  type: "numericRange";
  enabled: boolean;
  flatRange: [number, number];
  gaussMu: number;
  gaussSigma: number;
  pertMinModeMax: [number, number, number];
  mode: NumericRangeRandomizationSettingMode;
}

export type OptionListRandomizationSettings = {
  type: "optionList";
  enabled: boolean;
  options: Record<string, { enabled: boolean; value: string; label: string }>;
};

export interface SimulationRandomizationSettings {
  agentClockAttraction: NumericRangeRandomizationSetting;
  agentClockDepositRate: NumericRangeRandomizationSetting;
  agentBackgroundDepositRate: NumericRangeRandomizationSetting;
  agentSensorDegrees: NumericRangeRandomizationSetting;
  agentRotationRate: NumericRangeRandomizationSetting;
  agentSensorOffset: NumericRangeRandomizationSetting;
  agentSensorWidth: NumericRangeRandomizationSetting;
  agentStepSize: NumericRangeRandomizationSetting;
  agentCrowdAvoidance: NumericRangeRandomizationSetting;
  agentWanderStrength: NumericRangeRandomizationSetting;

  trailClockDecayRate: NumericRangeRandomizationSetting;
  trailClockDiffuseRate: NumericRangeRandomizationSetting;
  trailBackgroundDecayRate: NumericRangeRandomizationSetting;
  trailBackgroundDiffuseRate: NumericRangeRandomizationSetting;
}
export type SimulationRandomizationPreset = {
  presetType: "simulation";
  name: string;
  isBasePreset?: boolean;
  enabled: boolean;
  settings: SimulationRandomizationSettings;
};

export interface ProceduralColorPaletteChannelRandomizationSettings {
  yOffset: NumericRangeRandomizationSetting;
  amplitude: NumericRangeRandomizationSetting;
  frequency: NumericRangeRandomizationSetting;
  phase: NumericRangeRandomizationSetting;
}
export interface ColorRandomizationSettings {
  backgroundColor: { type: "color"; enabled: boolean };
  proceduralColorPalette: {
    r: ProceduralColorPaletteChannelRandomizationSettings;
    g: ProceduralColorPaletteChannelRandomizationSettings;
    b: ProceduralColorPaletteChannelRandomizationSettings;
  };
  intensitySmoothing: NumericRangeRandomizationSetting;
  agentDirectionSmoothing: NumericRangeRandomizationSetting;
  agentDirectionColorOffset: NumericRangeRandomizationSetting;
  clockColorOffset: NumericRangeRandomizationSetting;
  xColorOffset: NumericRangeRandomizationSetting;
  yColorOffset: NumericRangeRandomizationSetting;
  paletteCycleSpeed: NumericRangeRandomizationSetting;
  paletteCycleScale: NumericRangeRandomizationSetting;
}
export type ColorRandomizationPreset = {
  presetType: "color";
  name: string;
  isBasePreset?: boolean;
  enabled: boolean;
  settings: ColorRandomizationSettings;
};

export type RandomizationPreset =
  | SimulationRandomizationPreset
  | ColorRandomizationPreset;

export interface ProceduralColorPaletteChannel {
  yOffset: number;
  amplitude: number;
  frequency: number;
  phase: number;
}

interface ProceduralColorPalette {
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
  | "dm80"
  | "roboto"
  | "her";
export type ClockHourFormatValue = "12h" | "24h";

type AgentStartType =
  | "Random"
  | "Center"
  | "Ring"
  | "9 Rings"
  | "Circle"
  | "Spiral"
  | "Fill"
  | "Hexagonal Grid";

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

type PaletteCycleType = "Oscillating" | "Repeating" | "Continuous";
export type PaletteCycleTypeOption = {
  value: string;
  label: PaletteCycleType;
};

export type SingleSimulationPresetType =
  | "Clock Only"
  | "Simulation Only"
  | "Color Only";
export type MultipleSimulationPresetType = "Combination";
export type SimulationPresetType =
  | SingleSimulationPresetType
  | MultipleSimulationPresetType;
export type LoadableSlimeStoreSettings = {
  name: string;
  presetType: SimulationPresetType;
  enabled?: boolean;
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

export type SortedSimulationPresets = Record<
  SimulationPresetType,
  LoadableSlimeStoreSettings[]
>;

type TexturePlaneUniformsKey = "uWindowResolution" | "uShowTexture";
export type TexturePlaneUniforms = Record<
  TexturePlaneUniformsKey,
  THREE.Uniform
>;

type SlimeMoldDisplayPlaneUniformsKey =
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

type AgentDataUniformsKey =
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

type TrailUniformsKey =
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
  | "uSensorWidth"
  | "uBoundaryBehavior"
  | "uDelta"
  | "uTime";
export type TrailUniforms = Record<TrailUniformsKey, THREE.Uniform>;

export type DisplayAreaPdfValues = {
  currentSettingTitle: string;
  currentSettingValue: number;
  controlConfig: { min: number; max: number; step: number };
  numericRangeRandomizationSettings: NumericRangeRandomizationSetting;
};
