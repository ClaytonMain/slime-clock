import { Plane, type ShapeProps } from "@react-three/drei";
// @ts-expect-error no types for jstat
import { beta, normal, uniform } from "jstat";
import { useEffect } from "react";
import * as THREE from "three";
import useSlimeStore from "../../stores/useSlimeStore";
import type { DisplayAreaPdfValues } from "../../types/types";
import fragmentShader from "./shaders/pdfDisplay.frag";
import vertexShader from "./shaders/pdfDisplay.vert";

const N_BINS = 1000;
const uniforms = {
  uCurrentSettingValue: new THREE.Uniform(0.0),
  uPdfValues: new THREE.Uniform(new Array(N_BINS).fill(0.0)),
  uNBins: new THREE.Uniform(N_BINS),
};

function normalizeBetween(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

function roundToFixed(value: number, digits: number) {
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
}

function getBetaABFromPert(
  min: number,
  mode: number,
  max: number,
  gamma: number,
) {
  const a = 1 + (gamma * (mode - min)) / (max - min);
  const b = 1 + (gamma * (max - mode)) / (max - min);
  return { a, b };
}

function scaleToMax(values: number[], maxVal: number) {
  const currentMax = Math.max(...values);
  if (currentMax === 0) return values.map(() => 0);
  return values.map((v) => (v / currentMax) * maxVal);
}

function updateUniforms(displayAreaPdfValues: DisplayAreaPdfValues) {
  const min = displayAreaPdfValues.controlConfig.min;
  const max = displayAreaPdfValues.controlConfig.max;
  const randSettings = displayAreaPdfValues.numericRangeRandomizationSettings;

  uniforms.uCurrentSettingValue.value = roundToFixed(
    normalizeBetween(displayAreaPdfValues.currentSettingValue, min, max),
    6,
  );

  if (randSettings.mode === "flat") {
    const flatMin = normalizeBetween(randSettings.flatRange[0], min, max);
    const flatMax = normalizeBetween(randSettings.flatRange[1], min, max);
    const flatPdfValues: number[] = [];
    for (let i = 0; i < N_BINS; i++) {
      const x = i / N_BINS;
      flatPdfValues[i] = roundToFixed(uniform.pdf(x, flatMin, flatMax), 6);
    }

    uniforms.uPdfValues.value = flatPdfValues;
  } else if (randSettings.mode === "gaussian") {
    const gaussMu = normalizeBetween(randSettings.gaussMu, min, max);
    const gaussSigma = randSettings.gaussSigma / (max - min);
    const gaussPdfValues: number[] = [];
    for (let i = 0; i < N_BINS; i++) {
      const x = i / N_BINS;
      gaussPdfValues[i] = roundToFixed(normal.pdf(x, gaussMu, gaussSigma), 6);
    }
    uniforms.uPdfValues.value = gaussPdfValues;
  } else if (randSettings.mode === "pert") {
    const betaAB = getBetaABFromPert(
      randSettings.pertMinModeMax[0],
      randSettings.pertMinModeMax[1],
      randSettings.pertMinModeMax[2],
      4.0,
    );
    const scaledMin = normalizeBetween(
      randSettings.pertMinModeMax[0],
      min,
      max,
    );
    const scaledMax = normalizeBetween(
      randSettings.pertMinModeMax[2],
      min,
      max,
    );
    const pertPdfValues: number[] = [];
    for (let i = 0; i < N_BINS; i++) {
      const x = i / N_BINS;
      pertPdfValues[i] = roundToFixed(
        beta.pdf(normalizeBetween(x, scaledMin, scaledMax), betaAB.a, betaAB.b),
        6,
      );
    }
    uniforms.uPdfValues.value = pertPdfValues;
  }
  uniforms.uPdfValues.value = scaleToMax(uniforms.uPdfValues.value, 0.8);
}

export default function RandomizationPdfDisplay({
  props,
}: {
  props?: ShapeProps<typeof THREE.PlaneGeometry>;
}) {
  const displayAreaPdfValues = useSlimeStore(
    (state) => state.controlsState.displayAreaPdfValues,
  );

  useEffect(() => {
    updateUniforms(displayAreaPdfValues);
  }, [displayAreaPdfValues]);

  return (
    <Plane {...props}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={false}
        depthWrite={true}
        toneMapped={false}
      />
    </Plane>
  );
}
