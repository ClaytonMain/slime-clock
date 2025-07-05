/**
 * The name is jank, but this is the component that displays
 * Three.js-specific control elements. It'll need to coordinate
 * with the controls state to determine what to display, and when
 * to display it. Make sure to also allow regular HTML elements
 * to be displayed, though those will (probably) be handled in
 * the TabContentDisplayArea component. Maybe.
 */
import { Plane, RenderTexture } from "@react-three/drei";
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
  const [visible, setVisible] = useState<boolean>(false);
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
        // Handle visibility.
        console.log("controlsState changed:", newControlsState);
        if (
          newControlsState.isOpen &&
          newControlsState.displayAreaContentType === "three"
        ) {
          if (!visible) setVisible(true);
        } else {
          setVisible(false);
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

  return (
    <Plane ref={displayPlaneRef} visible={visible}>
      <meshBasicMaterial
        attach="material"
        depthWrite={false}
        transparent={true}
        // toneMapped={false}
        // blending={THREE.AdditiveBlending}
        onBeforeCompile={(shader) => {
          shader.uniforms.uPositionOffset =
            displayPlaneUniforms.uPositionOffset;
          shader.uniforms.uPositionScale = displayPlaneUniforms.uPositionScale;
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
            gl_Position = vec4(position.xy * uPositionScale + uPositionOffset, 0.0, 1.0);
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
  );
}
