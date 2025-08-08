import type {
  DisplayTextureAspectRatio,
  LoadableSlimeStoreSettings,
  PresetType,
  SortedPresets,
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

export function generateRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export function getSortedPresets(
  presets: LoadableSlimeStoreSettings[],
  presetTypes?: PresetType[],
): SortedPresets {
  const sortedPresets = [...presets].sort((a, b) => {
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
  }, {} as SortedPresets);
}
