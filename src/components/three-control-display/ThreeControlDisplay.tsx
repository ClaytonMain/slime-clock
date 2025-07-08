/**
 * The name is jank, but this is the component that displays
 * Three.js-specific control elements. It'll need to coordinate
 * with the controls state to determine what to display, and when
 * to display it. Make sure to also allow regular HTML elements
 * to be displayed, though those will (probably) be handled in
 * the TabContentDisplayArea component. Maybe.
 */
import { Box, Plane, RenderTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useSlimeStore from "../../stores/useSlimeStore";
import ProceduralColorPaletteDisplay from "../procedural-color-palette-display/ProceduralColorPaletteDisplay";

const displayPlaneUniforms = {
  uPositionOffset: new THREE.Uniform(new THREE.Vector2(0, 0)),
  uPositionScale: new THREE.Uniform(new THREE.Vector2(1, 1)),
};

function updateDisplayPlaneUniforms() {
  const boundingClientRect =
    useSlimeStore.getState().controlsState.displayAreaBoundingClientRect;
  if (!boundingClientRect) return;

  const boundingWidth = boundingClientRect.width;
  const boundingHeight = boundingClientRect.height;
  const boundingLeft = boundingClientRect.left;
  const boundingTop = boundingClientRect.top;

  const windowWidth = window.innerWidth - 0.5;
  const windowHeight = window.innerHeight - 0.5;

  const boundingCenter = new THREE.Vector2(
    boundingLeft + boundingWidth / 2,
    windowHeight - boundingTop - boundingHeight / 2,
  );
  const positionOffset = new THREE.Vector2(
    ((boundingCenter.x - windowWidth / 2) * 2) / windowWidth,
    ((boundingCenter.y - windowHeight / 2) * 2) / windowHeight,
  );
  const positionScale = new THREE.Vector2(
    (boundingWidth / windowWidth) * 2,
    (boundingHeight / windowHeight) * 2,
  );

  displayPlaneUniforms.uPositionOffset.value = positionOffset;
  displayPlaneUniforms.uPositionScale.value = positionScale;
}

export default function ThreeControlDisplay() {
  const displayPlaneRef = useRef<THREE.Mesh>(null!);
  const controlBackgroundRef = useRef<THREE.Mesh>(null!);
  const controlBackgroundMaterialRef = useRef<THREE.MeshPhysicalMaterial>(
    null!,
  );
  const [controlBackgroundVisible, setControlBackgroundVisible] =
    useState<boolean>(false);
  const [displayPlaneVisible, setDisplayPlaneVisible] =
    useState<boolean>(false);
  const [contentName, setContentName] = useState<string | null>(null);
  const [renderTextureResolution, setRenderTextureResolution] = useState({
    width: 200,
    height: 200,
  });

  useEffect(() => {
    updateDisplayPlaneUniforms();
  }, []);

  useEffect(() => {
    const unsubControlsState = useSlimeStore.subscribe(
      (state) => state.controlsState,
      (newControlsState) => {
        // Handle control background visibility.
        if (newControlsState.isOpen) {
          setControlBackgroundVisible(true);
        } else {
          setControlBackgroundVisible(false);
        }
        if (
          controlBackgroundRef.current &&
          newControlsState.controlsAreaBoundingClientRect
        ) {
          controlBackgroundRef.current.scale.set(
            (newControlsState.controlsAreaBoundingClientRect.width * 2) /
              window.innerWidth || 1,
            (newControlsState.controlsAreaBoundingClientRect.height * 2) /
              window.innerHeight || 1,
            1,
          );
        }

        // Handle display plane visibility.
        if (
          newControlsState.isOpen &&
          newControlsState.displayAreaContentType === "three"
        ) {
          setDisplayPlaneVisible(true);
        } else {
          setDisplayPlaneVisible(false);
        }
        // Update the display plane uniforms.
        updateDisplayPlaneUniforms();
        // Update the display area content name.
        if (newControlsState.displayAreaContentName !== contentName) {
          setContentName(newControlsState.displayAreaContentName);
        }
        // Update the render texture resolution.
        if (
          newControlsState.displayAreaBoundingClientRect &&
          (newControlsState.displayAreaBoundingClientRect.width !==
            renderTextureResolution.width ||
            newControlsState.displayAreaBoundingClientRect.height !==
              renderTextureResolution.height)
        ) {
          setRenderTextureResolution({
            width: Math.floor(
              newControlsState.displayAreaBoundingClientRect.width,
            ),
            height: Math.floor(
              newControlsState.displayAreaBoundingClientRect.height,
            ),
          });
        }
      },
    );
    return () => {
      unsubControlsState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    if (!controlBackgroundMaterialRef.current) return;
    if (
      controlBackgroundVisible &&
      controlBackgroundMaterialRef.current.opacity < 1
    ) {
      controlBackgroundMaterialRef.current.opacity = Math.min(
        controlBackgroundMaterialRef.current.opacity + delta * 0.9,
        1,
      );
    } else if (
      !controlBackgroundVisible &&
      controlBackgroundMaterialRef.current.opacity > 0
    ) {
      controlBackgroundMaterialRef.current.opacity = Math.max(
        controlBackgroundMaterialRef.current.opacity - delta * 0.9,
        0,
      );
    }
  });

  return (
    <group key="three-control-display-group">
      <ambientLight intensity={5.5} />
      <Box
        args={[1, 1, 0.1]}
        position={[0, 0, 0]}
        key="control-background"
        ref={controlBackgroundRef}
      >
        <meshPhysicalMaterial
          ref={controlBackgroundMaterialRef}
          transmission={0.9}
          thickness={0.1}
          roughness={0.4}
          opacity={0}
          attach="material"
          transparent={true}
          depthTest={true}
          color={"#bae6fd"}
        />
      </Box>
      <Plane
        position={[0, 0, 2.0]}
        key="display-plane"
        ref={displayPlaneRef}
        visible={displayPlaneVisible}
        renderOrder={1000}
        onBeforeRender={(renderer) => {
          renderer.clearDepth();
        }}
      >
        <meshBasicMaterial
          attach="material"
          transparent={true}
          depthTest={true}
          onBeforeCompile={(shader) => {
            shader.uniforms.uPositionOffset =
              displayPlaneUniforms.uPositionOffset;
            shader.uniforms.uPositionScale =
              displayPlaneUniforms.uPositionScale;
            shader.vertexShader = shader.vertexShader.replace(
              "#include <common>",
              /* glsl */ `
              #include <common>
              uniform vec2 uPositionOffset;
              uniform vec2 uPositionScale;
              `,
            );
            shader.vertexShader = shader.vertexShader.replace(
              "#include <project_vertex>",
              /* glsl */ `
              #include <project_vertex>
              gl_Position = vec4(position.xy * uPositionScale + uPositionOffset, position.z, 1.0);
              `,
            );
          }}
        >
          <RenderTexture
            attach="map"
            width={renderTextureResolution.width}
            height={renderTextureResolution.height}
          >
            {contentName === "procedural-color-palette" && (
              <ProceduralColorPaletteDisplay />
            )}
          </RenderTexture>
        </meshBasicMaterial>
      </Plane>
    </group>
  );
}
