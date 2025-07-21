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
