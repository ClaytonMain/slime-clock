import type { TrailDisplayTextureAspectRatio } from "../types/types";

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

export function getTrailDisplayTextureResolution(
  aspectRatio: TrailDisplayTextureAspectRatio,
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
