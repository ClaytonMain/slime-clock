import { Plane, type ShapeProps } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useSlimeStore from "../../stores/useSlimeStore";
import fragmentShader from "./shaders/paletteDisplay.frag";
import vertexShader from "./shaders/paletteDisplay.vert";

const yMax = 9 / 16;
const yMin = 0.1;
const yAmp = yMax - yMin;
const yMid = (yMax + yMin) / 2;

const uniforms = {
  uDisplayScale: new THREE.Uniform(new THREE.Vector2(1, 1)),
  uTargetAspect: new THREE.Uniform(new THREE.Vector2(16, 9)),
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

function updateUDisplayScale() {
  const targetAspect = 16 / 9;
  const windowAspect = window.innerWidth / window.innerHeight;

  if (windowAspect > targetAspect) {
    uniforms.uDisplayScale.value = new THREE.Vector2(
      targetAspect / windowAspect,
      1,
    );
  } else {
    uniforms.uDisplayScale.value = new THREE.Vector2(
      1,
      windowAspect / targetAspect,
    );
  }
}

function updateUniforms() {
  updateUDisplayScale();
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    updateUniforms();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateUDisplayScale);
    return () => {
      window.removeEventListener("resize", updateUDisplayScale);
    };
  }, []);

  useEffect(() => {
    const unsubSlimeColorChangedAt = useSlimeStore.subscribe(
      (state) => state.colorSettings.slimeColorChangedAt,
      () => {
        updateUniforms();
        slimeColorChangedAtRef.current = Date.now();
        if (!visible) {
          setVisible(true);
        }
      },
    );
    return () => {
      unsubSlimeColorChangedAt();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    const currentTime = Date.now();
    if (currentTime - slimeColorChangedAtRef.current < 3000) {
      uniforms.uAlpha.value = Math.min(uniforms.uAlpha.value + delta * 4, 1.0);
    } else if (currentTime - slimeColorChangedAtRef.current < 6000) {
      uniforms.uAlpha.value = Math.max(uniforms.uAlpha.value - delta * 1, 0.0);
    } else if (uniforms.uAlpha.value !== 0.0) {
      uniforms.uAlpha.value = 0.0;
      if (visible) {
        setVisible(false);
      }
    }
  });

  return (
    <Plane {...props} visible={visible}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        // depthWrite={false}
      />
    </Plane>
  );
}
