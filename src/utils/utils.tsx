import * as THREE from "three";
import {
  AGENT_START_TYPE_DROPDOWN_OPTIONS,
  DEFAULT_COLOR_RANDOMIZATION_SETTINGS_PRESET_NAME,
  DEFAULT_SIMULATION_RANDOMIZATION_SETTINGS_PRESET_NAME,
} from "../constants/constants";
import useSlimeStore from "../stores/useSlimeStore";
import type {
  DisplayTextureAspectRatio,
  LoadableSlimeStoreSettings,
  RandomizationPreset,
  SimulationPresetType,
  SimulationRandomizationSettings,
  SortedSimulationPresets,
} from "../types/types";

export function roundToFixed(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function randBetween(
  min: number,
  max: number,
  decimals?: number,
): number {
  const value = Math.random() * (max - min) + min;
  return decimals !== undefined ? roundToFixed(value, decimals) : value;
}

export function getDisplayTextureResolution(
  aspectRatio: DisplayTextureAspectRatio,
  targetQuality: number, // Approximate megapixel value.
): { width: number; height: number } {
  const resolution: { width: number; height: number } = {
    width: -1,
    height: -1,
  };
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  let aspectValue: number;

  if (aspectRatio === "Window") {
    aspectValue = windowWidth / windowHeight;
  } else {
    const [aspectWidth, aspectHeight] = aspectRatio.split(":").map(Number);
    aspectValue = aspectWidth / aspectHeight;
  }

  resolution.width = Math.round(
    Math.sqrt(targetQuality * 1000000 * aspectValue),
  );
  resolution.height = Math.round(
    Math.sqrt((targetQuality * 1000000) / aspectValue),
  );

  return resolution;
}

// TODO: Improve this function so that it always returns a valid color.
export function generateRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export function getSortedSimulationPresets(
  simulationPresets: LoadableSlimeStoreSettings[],
  presetTypes?: SimulationPresetType[],
): SortedSimulationPresets {
  const sortedPresets = [...simulationPresets].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  return sortedPresets.reduce((acc, preset) => {
    if (presetTypes && !presetTypes.includes(preset.presetType)) {
      return acc;
    }
    if (!acc[preset.presetType]) {
      acc[preset.presetType] = [];
    }
    acc[preset.presetType].push(preset);
    return acc;
  }, {} as SortedSimulationPresets);
}

function getAgentData(
  gpuTextureWidth: number,
  gpuTextureHeight: number,
  displayWidth: number,
  displayHeight: number,
  startType: number,
) {
  const data = new Float32Array(gpuTextureWidth * gpuTextureHeight * 4);
  const choice = startType === -1 ? Math.floor(Math.random() * 6) : startType;
  for (let i = 0; i < gpuTextureWidth * gpuTextureHeight; i++) {
    let x = 0.0;
    let y = 0.0;
    let z = 0.0;

    if (choice === 0) {
      // Center
      x = 0.5;
      y = 0.5;
      z = Math.random();
    } else if (choice === 1) {
      // Ring
      z = Math.random();
      x =
        0.5 + (Math.cos(z * Math.PI * 2) * 0.4 * displayHeight) / displayWidth;
      y = 0.5 + Math.sin(z * Math.PI * 2) * 0.4;
      if (Math.random() > 0.1) {
        z = (z + 0.5) % 1;
      }
    } else if (choice === 2) {
      // 9 Rings
      x = Math.round(Math.random() * 2) * 0.5;
      y = Math.round(Math.random() * 2) * 0.5;
      z = Math.random();
    } else if (choice === 3) {
      // Circle
      const p = Math.random();
      const r = Math.random() * 0.4;
      x = 0.5 + (Math.cos(p * Math.PI * 2) * r * displayHeight) / displayWidth;
      y = 0.5 + Math.sin(p * Math.PI * 2) * r;
      z = Math.random();
    } else if (choice === 4) {
      // Spiral
      const a = 20;
      const r = Math.random() * 0.45;
      x = 0.5 + (Math.cos(r * Math.PI * a) * r * displayHeight) / displayWidth;
      y = 0.5 + Math.sin(r * Math.PI * a) * r;
      z = Math.random();
    } else if (choice === 5) {
      // Fill
      x = Math.random();
      y = Math.random();
      z = Math.random();
    }

    const i4 = i * 4;
    data[i4 + 0] = x;
    data[i4 + 1] = y;
    data[i4 + 2] = z;
    data[i4 + 3] = 1.0;
  }
  return data;
}
function getRandomAllowedStartType(): number | null {
  const enabledOptions = Object.values(
    useSlimeStore.getState().randomizationSettings.simulation.agentStartType
      .options,
  ).filter((opt) => opt.enabled);
  if (enabledOptions.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * enabledOptions.length);
  return Number(enabledOptions[randomIndex].value);
}
export function getAgentDataTexture(
  gpuTextureWidth: number,
  gpuTextureHeight: number,
  displayTextureWidth: number,
  displayTextureHeight: number,
  startType: number = -1,
) {
  console.log("getAgentDataTexture called with startType:", startType);
  let effectiveStartType = startType;
  const agentStartTypeIndexOfRandom =
    AGENT_START_TYPE_DROPDOWN_OPTIONS.findIndex(
      (option) => option.label === "Random",
    );
  console.log("agentStartTypeIndexOfRandom:", agentStartTypeIndexOfRandom);
  console.log(AGENT_START_TYPE_DROPDOWN_OPTIONS[agentStartTypeIndexOfRandom]);
  console.log(
    AGENT_START_TYPE_DROPDOWN_OPTIONS[agentStartTypeIndexOfRandom].value,
  );
  if (
    AGENT_START_TYPE_DROPDOWN_OPTIONS[agentStartTypeIndexOfRandom].value ===
    String(startType)
  ) {
    console.log("Getting random allowed start type");
    const randomStartType = getRandomAllowedStartType();
    if (randomStartType !== null) {
      effectiveStartType = randomStartType;
    }
  }
  const data = getAgentData(
    gpuTextureWidth,
    gpuTextureHeight,
    displayTextureWidth,
    displayTextureHeight,
    effectiveStartType,
  );
  const agentDataTexture = new THREE.DataTexture(
    data,
    gpuTextureWidth,
    gpuTextureHeight,
    THREE.RGBAFormat,
    THREE.FloatType,
  );
  agentDataTexture.needsUpdate = true;
  return agentDataTexture;
}

function getAgentPositionsData(
  displayTextureWidth: number,
  displayTextureHeight: number,
) {
  const data = new Float32Array(displayTextureWidth * displayTextureHeight * 4);
  for (let i = 0; i < displayTextureWidth * displayTextureHeight; i++) {
    const i4 = i * 4;
    data[i4 + 0] = 0.0;
    data[i4 + 1] = 0.0;
    data[i4 + 2] = 0.0;
    data[i4 + 3] = 1.0;
  }
  return data;
}
export function getAgentPositionsTexture(
  displayTextureWidth: number,
  displayTextureHeight: number,
) {
  const data = getAgentPositionsData(displayTextureWidth, displayTextureHeight);
  const agentPositionsTexture = new THREE.DataTexture(
    data,
    displayTextureWidth,
    displayTextureHeight,
    THREE.RGBAFormat,
    THREE.FloatType,
  );
  agentPositionsTexture.needsUpdate = true;
  return agentPositionsTexture;
}

function getTrailData(
  displayTextureWidth: number,
  displayTextureHeight: number,
) {
  const data = new Float32Array(displayTextureWidth * displayTextureHeight * 4);
  for (let i = 0; i < displayTextureWidth * displayTextureHeight; i++) {
    const i4 = i * 4;
    data[i4 + 0] = 0.0;
    data[i4 + 1] = 0.0;
    data[i4 + 2] = 0.0;
    data[i4 + 3] = 1.0;
  }
  return data;
}

export function getTrailTexture(
  displayTextureWidth: number,
  displayTextureHeight: number,
) {
  const data = getTrailData(displayTextureWidth, displayTextureHeight);
  const trailTexture = new THREE.DataTexture(
    data,
    displayTextureWidth,
    displayTextureHeight,
    THREE.RGBAFormat,
    THREE.FloatType,
  );
  trailTexture.needsUpdate = true;
  return trailTexture;
}

export function getDisplayTextureResolutionVector(
  displayTextureWidth: number,
  displayTextureHeight: number,
): THREE.Vector2 {
  return new THREE.Vector2(displayTextureWidth, displayTextureHeight);
}

export function getWindowResolutionVector(): THREE.Vector2 {
  return new THREE.Vector2(window.innerWidth, window.innerHeight);
}

export function getHeightScaledPixelValue(
  value: number,
  decimals: number = 4,
): number {
  const height =
    useSlimeStore.getState().simulationSettings.displayTextureHeight;
  return roundToFixed(value * (height / 100), decimals);
}

export function getDisplayScaleVector(
  displayTextureWidth: number,
  displayTextureHeight: number,
): THREE.Vector2 {
  const targetAspect = displayTextureWidth / displayTextureHeight;
  const windowAspect = window.innerWidth / window.innerHeight;

  // If windowAspect > targetAspect scale x, otherwise scale y
  if (windowAspect > targetAspect) {
    return new THREE.Vector2((targetAspect * 2) / windowAspect, 2);
  } else {
    return new THREE.Vector2(2, (windowAspect * 2) / targetAspect);
  }
}

export function getGaussRandomInControlBounds(
  min: number,
  max: number,
  mu: number,
  sigma: number,
) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return Math.max(min, Math.min(max, mu + z * sigma));
}

export function getRandomizationPresetByNameAndType<
  T extends RandomizationPreset,
>(
  name: string,
  type: "simulation" | "color",
  presets?: RandomizationPreset[],
): T {
  if (!presets) {
    presets = useSlimeStore.getState().randomizationPresets;
  }
  let preset = presets.find((p) => p.name === name && p.presetType === type);
  if (!preset) {
    const defaultName =
      type === "simulation"
        ? DEFAULT_SIMULATION_RANDOMIZATION_SETTINGS_PRESET_NAME
        : DEFAULT_COLOR_RANDOMIZATION_SETTINGS_PRESET_NAME;
    preset = presets.find(
      (p) => p.name === defaultName && p.presetType === type,
    );
  }
  if (!preset) {
    throw new Error(
      `Randomization preset not found: ${name} of type ${type}, and default preset also not found.`,
    );
  }
  return preset as T;
}

export function getAutoRandomizationSimulationRandomizationSettings() {
  const randomizationSettings = useSlimeStore.getState().randomizationSettings;
  let simulationRandomizationSettings = randomizationSettings.simulation;
  if (
    randomizationSettings.simulationAutoRandomizationMode === "useRandomPreset"
  ) {
    const simulationRandomizationPresets = useSlimeStore
      .getState()
      .randomizationPresets.filter(
        (preset) => preset.presetType === "simulation" && preset.enabled,
      );
    if (simulationRandomizationPresets.length > 0) {
      simulationRandomizationSettings = simulationRandomizationPresets[
        Math.floor(Math.random() * simulationRandomizationPresets.length)
      ].settings as SimulationRandomizationSettings;
    }
  }
  return simulationRandomizationSettings;
}
