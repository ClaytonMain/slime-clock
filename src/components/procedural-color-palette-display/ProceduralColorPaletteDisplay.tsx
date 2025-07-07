import { Plane, type ShapeProps } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import useSlimeStore from "../../stores/useSlimeStore";
import fragmentShader from "./shaders/paletteDisplay.frag";
import vertexShader from "./shaders/paletteDisplay.vert";

const yMax = 9 / 16;
const yMin = 0.1;
const yAmp = yMax - yMin;
const yMid = (yMax + yMin) / 2;

const uniforms = {
  uYMax: new THREE.Uniform(yMax),
  uYMin: new THREE.Uniform(yMin),
  uYAmp: new THREE.Uniform(yAmp),
  uYMid: new THREE.Uniform(yMid),
  uPaletteA: new THREE.Uniform(new THREE.Vector3(0, 0, 0)),
  uPaletteB: new THREE.Uniform(new THREE.Vector3(0, 0, 0)),
  uPaletteC: new THREE.Uniform(new THREE.Vector3(0, 0, 0)),
  uPaletteD: new THREE.Uniform(new THREE.Vector3(0, 0, 0)),
  uAlpha: new THREE.Uniform(1.0),
};

function updateUniforms() {
  const colorSettings = useSlimeStore.getState().colorSettings;
  if (colorSettings.slimeColorMode === "Procedural") {
    const palette = colorSettings.proceduralColorPalette;

    uniforms.uPaletteA.value = new THREE.Vector3(
      palette.r.yOffset,
      palette.g.yOffset,
      palette.b.yOffset,
    );
    uniforms.uPaletteB.value = new THREE.Vector3(
      palette.r.amplitude,
      palette.g.amplitude,
      palette.b.amplitude,
    );
    uniforms.uPaletteC.value = new THREE.Vector3(
      palette.r.frequency,
      palette.g.frequency,
      palette.b.frequency,
    );
    uniforms.uPaletteD.value = new THREE.Vector3(
      palette.r.phase,
      palette.g.phase,
      palette.b.phase,
    );
  }
}

export default function ProceduralColorPaletteDisplay({
  props,
}: {
  props?: ShapeProps<typeof THREE.PlaneGeometry>;
}) {
  const slimeColorChangedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    updateUniforms();
  }, []);

  useEffect(() => {
    const unsubSlimeColorChangedAt = useSlimeStore.subscribe(
      (state) => state.colorSettings.slimeColorChangedAt,
      () => {
        updateUniforms();
        slimeColorChangedAtRef.current = Date.now();
      },
    );
    return () => {
      unsubSlimeColorChangedAt();
    };
  }, []);

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
