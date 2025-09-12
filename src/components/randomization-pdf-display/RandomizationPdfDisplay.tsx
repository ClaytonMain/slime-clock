import { Plane, type ShapeProps } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import useSlimeStore from "../../stores/useSlimeStore";
import type { DisplayAreaPdfValues } from "../../types/types";
import fragmentShader from "./shaders/pdfDisplay.frag";
import vertexShader from "./shaders/pdfDisplay.vert";

const uniforms = {
  uCurrentSettingValue: new THREE.Uniform(0.0),
  uUniformMinMax: new THREE.Uniform(new THREE.Vector2(0.0, 1.0)),
  uGaussMuSigma: new THREE.Uniform(new THREE.Vector2(0.0, 0.1)),
  uBetaAB: new THREE.Uniform(new THREE.Vector2(0.0, 0.0)),
  uPertGamma: new THREE.Uniform(4.0),
  uPdfType: new THREE.Uniform(0), // 0: Uniform, 1: Gaussian, 2: PERT (beta)
};

function updateUniforms(displayAreaPdfValues: DisplayAreaPdfValues) {
  // Normalize values to 0-1 range for shader.
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
