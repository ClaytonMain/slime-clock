import { Plane, useFBO } from "@react-three/drei";
import { createPortal, extend, useFrame } from "@react-three/fiber";
import { produce } from "immer";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import useSlimeStore from "../../stores/useSlimeStore.tsx";
import SettingsHistoryListener from "../controls/SettingsHistoryListener.tsx";
import ThreeControlDisplay from "../three-control-display/ThreeControlDisplay.tsx";
import AgentDataMaterial from "./AgentDataMaterial.tsx";
import AgentPositionsMaterial from "./AgentPositionsMaterial.tsx";
import ClockDisplay from "./ClockDisplay.tsx";
import InitializationHandler from "./InitializationHandler.tsx";
import RandomizationListener from "./RandomizationListener.tsx";
import displayFragmentShader from "./shaders/display/display.frag";
import displayVertexShader from "./shaders/display/display.vert";
import TrailMaterial from "./TrailMaterial.tsx";
import UniformListeners from "./UniformListeners.tsx";

extend({ AgentDataMaterial, AgentPositionsMaterial, TrailMaterial });

function SlimeClockRenderer() {
  const simulationSettings = useSlimeStore((state) => state.simulationSettings);

  const prevMinutesRef = useRef(0);
  const lastRandomizedAtMinutesRef = useRef(Math.floor(Date.now() / 60000));
  const lastRestartedAtMinutesRef = useRef(Math.floor(Date.now() / 60000));

  const showGpuTextures = true;

  const agentDataMaterialRefA = useRef<AgentDataMaterial>(null!);
  const agentDataMaterialRefB = useRef<AgentDataMaterial>(null!);
  const agentPositionsMaterialRef = useRef<AgentPositionsMaterial>(null!);
  const trailMaterialRefA = useRef<TrailMaterial>(null!);
  const trailMaterialRefB = useRef<TrailMaterial>(null!);

  const agentDataDisplayPlaneRef = useRef<THREE.Mesh>(null!);
  const agentPositionsDisplayPlaneRef = useRef<THREE.Mesh>(null!);
  const clockDisplayPlaneRef = useRef<THREE.Mesh>(null!);
  const trailDisplayPlaneRef = useRef<THREE.Mesh>(null!);

  const slimeMoldDisplayShaderRef = useRef<THREE.ShaderMaterial>(null!);

  const agentDataSceneA = useMemo(() => new THREE.Scene(), []);
  const agentDataSceneB = useMemo(() => new THREE.Scene(), []);
  const agentPositionsScene = useMemo(() => new THREE.Scene(), []);
  const clockScene = useMemo(() => new THREE.Scene(), []);
  const trailSceneA = useMemo(() => new THREE.Scene(), []);
  const trailSceneB = useMemo(() => new THREE.Scene(), []);

  const cameraA = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1),
    [],
  );
  const cameraB = useMemo(
    () =>
      new THREE.OrthographicCamera(
        0,
        simulationSettings.displayTextureWidth,
        simulationSettings.displayTextureHeight,
        0,
        1 / Math.pow(2, 53),
        1,
      ),
    [
      simulationSettings.displayTextureWidth,
      simulationSettings.displayTextureHeight,
    ],
  );

  const renderPlanePositions = useMemo(
    () =>
      new Float32Array([
        -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
      ]),
    [],
  );
  const renderPlaneUvs = useMemo(
    () => new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]),
    [],
  );

  const agentDataRenderTargetA = useFBO(
    simulationSettings.gpuTextureWidth,
    simulationSettings.gpuTextureHeight,
    {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      type: THREE.FloatType,
    },
  );
  const agentDataRenderTargetB = useFBO(
    simulationSettings.gpuTextureWidth,
    simulationSettings.gpuTextureHeight,
    {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      type: THREE.FloatType,
    },
  );
  const agentPositionsRenderTarget = useFBO(
    simulationSettings.displayTextureWidth,
    simulationSettings.displayTextureHeight,
    {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      type: THREE.FloatType,
    },
  );
  const clockRenderTarget = useFBO(
    simulationSettings.displayTextureWidth,
    simulationSettings.displayTextureHeight,
    {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      type: THREE.FloatType,
    },
  );
  const trailRenderTargetA = useFBO(
    simulationSettings.displayTextureWidth,
    simulationSettings.displayTextureHeight,
    {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      type: THREE.FloatType,
    },
  );
  const trailRenderTargetB = useFBO(
    simulationSettings.displayTextureWidth,
    simulationSettings.displayTextureHeight,
    {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      type: THREE.FloatType,
    },
  );

  const agentPositionsAttribute = useMemo(() => {
    const agentDensity = simulationSettings.agentDensity;
    const displayTextureWidth = simulationSettings.displayTextureWidth;
    const displayTextureHeight = simulationSettings.displayTextureHeight;
    const length = Math.floor(
      displayTextureWidth * displayTextureHeight * agentDensity,
    );
    const attributes = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      attributes[i3 + 0] =
        (i % simulationSettings.displayTextureWidth) /
        simulationSettings.displayTextureHeight;
      attributes[i3 + 1] =
        Math.floor(i / simulationSettings.displayTextureWidth) /
        simulationSettings.displayTextureHeight;
      attributes[i3 + 2] = 0;
    }
    return attributes;
  }, [
    simulationSettings.displayTextureWidth,
    simulationSettings.displayTextureHeight,
    simulationSettings.agentDensity,
  ]);

  const agentDataUniforms = useSlimeStore((state) => state.uniforms.agentData);
  const agentPositionsUniforms = useSlimeStore(
    (state) => state.uniforms.agentPositions,
  );
  const trailUniforms = useSlimeStore((state) => state.uniforms.trail);
  const slimeMoldDisplayPlaneUniforms = useSlimeStore(
    (state) => state.uniforms.slimeMoldDisplayPlane,
  );
  const texturePlaneUniforms = useSlimeStore(
    (state) => state.uniforms.texturePlane,
  );

  const debugConsoleLogger = useSlimeStore((state) => state.debugConsoleLogger);

  const pingPongRef = useRef(true);
  const uDeltaRef = useRef(0.0);
  const uTimeRef = useRef(0.0);
  const uPaletteCycleTimeRef = useRef(0.0);

  const controlsAreOpen = useSlimeStore((state) => state.controlsState.isOpen);
  const controlsClosedAt = useSlimeStore(
    (state) => state.controlsState.controlsClosedAt,
  );
  const colorSettings = useSlimeStore((state) => state.colorSettings);
  const randomizationSettings = useSlimeStore(
    (state) => state.randomizationSettings,
  );

  useFrame(({ gl }, delta) => {
    const currentMinutes = Math.floor(Date.now() / 1000 / 60);
    const controlsClosedAtMinutes = Math.floor(controlsClosedAt / 1000 / 60);
    if (currentMinutes !== prevMinutesRef.current) {
      prevMinutesRef.current = currentMinutes;
    }

    if (controlsAreOpen) {
      lastRestartedAtMinutesRef.current = currentMinutes;
      lastRandomizedAtMinutesRef.current = currentMinutes;
    } else if (
      !controlsAreOpen &&
      (lastRestartedAtMinutesRef.current < controlsClosedAtMinutes ||
        lastRandomizedAtMinutesRef.current < controlsClosedAtMinutes)
    ) {
      lastRandomizedAtMinutesRef.current = currentMinutes;
      lastRestartedAtMinutesRef.current = currentMinutes;
    }

    if (
      !controlsAreOpen &&
      randomizationSettings.autoRestartEnabled &&
      currentMinutes % randomizationSettings.autoRestartInterval === 0 &&
      currentMinutes !== lastRestartedAtMinutesRef.current
    ) {
      lastRestartedAtMinutesRef.current = currentMinutes;
      useSlimeStore.setState(
        produce((state) => {
          state.randomizationState.simulationRestartRequestedAt = Date.now();
          if (randomizationSettings.autoRandomizationEnabled) {
            lastRandomizedAtMinutesRef.current = currentMinutes;
            state.randomizationState.agentRandomizationRequestedAt = Date.now();
            state.randomizationState.trailRandomizationRequestedAt = Date.now();
            state.randomizationState.proceduralColorPaletteRandomizationRequestedAt =
              Date.now();
            state.randomizationState.backgroundColorRandomizationRequestedAt =
              Date.now();
          }
        }),
      );
      return;
    }

    if (
      !controlsAreOpen &&
      randomizationSettings.autoRandomizationEnabled &&
      currentMinutes % randomizationSettings.autoRandomizationInterval === 0 &&
      currentMinutes !== lastRandomizedAtMinutesRef.current
    ) {
      debugConsoleLogger(
        "Randomization triggered",
        lastRandomizedAtMinutesRef.current,
        currentMinutes,
      );
      lastRandomizedAtMinutesRef.current = currentMinutes;
      useSlimeStore.setState(
        produce((state) => {
          state.randomizationState.agentRandomizationRequestedAt = Date.now();
          state.randomizationState.trailRandomizationRequestedAt = Date.now();
          state.randomizationState.proceduralColorPaletteRandomizationRequestedAt =
            Date.now();
          state.randomizationState.backgroundColorRandomizationRequestedAt =
            Date.now();
        }),
      );
    }

    const cappedDelta = Math.min(delta, 0.05);
    uDeltaRef.current = Math.min(cappedDelta * simulationSettings.speed, 0.05);
    uTimeRef.current += uDeltaRef.current;
    uPaletteCycleTimeRef.current +=
      cappedDelta * colorSettings.paletteCycleSpeed;

    // Render the clock.
    gl.setRenderTarget(clockRenderTarget);
    gl.clear();
    gl.render(clockScene, cameraB);

    /**
     * Agent data.
     */
    if (pingPongRef.current) {
      // Update agent data A uniforms.
      agentDataMaterialRefA.current.uniforms.uDelta.value = uDeltaRef.current;
      agentDataMaterialRefA.current.uniforms.uTime.value = uTimeRef.current;
      agentDataMaterialRefA.current.uniforms.uClockTexture.value =
        clockRenderTarget.texture;

      // Render agent data A.
      gl.setRenderTarget(agentDataRenderTargetA);
      gl.clear();
      gl.render(agentDataSceneA, cameraA);

      // Send agent data A texture to relevant materials.
      agentDataMaterialRefB.current.uniforms.uAgentDataTexture.value =
        agentDataRenderTargetA.texture;
      agentPositionsMaterialRef.current.uniforms.uAgentDataTexture.value =
        agentDataRenderTargetA.texture;
    } else {
      // Update agent data B time uniforms.
      agentDataMaterialRefB.current.uniforms.uDelta.value = uDeltaRef.current;
      agentDataMaterialRefB.current.uniforms.uTime.value = uTimeRef.current;
      agentDataMaterialRefB.current.uniforms.uClockTexture.value =
        clockRenderTarget.texture;

      // Render agent data B.
      gl.setRenderTarget(agentDataRenderTargetB);
      gl.clear();
      gl.render(agentDataSceneB, cameraA);

      // Send agent data B texture to relevant materials.
      agentDataMaterialRefA.current.uniforms.uAgentDataTexture.value =
        agentDataRenderTargetB.texture;
      agentPositionsMaterialRef.current.uniforms.uAgentDataTexture.value =
        agentDataRenderTargetB.texture;
    }

    // Render the agent particle positions.
    gl.setRenderTarget(agentPositionsRenderTarget);
    gl.clear();
    gl.render(agentPositionsScene, cameraB);

    if (pingPongRef.current) {
      // Update relevant trail A uniforms.
      trailMaterialRefA.current.uniforms.uDelta.value = uDeltaRef.current;
      trailMaterialRefA.current.uniforms.uTime.value = uTimeRef.current;
      trailMaterialRefA.current.uniforms.uAgentPositionsTexture.value =
        agentPositionsRenderTarget.texture;
      trailMaterialRefA.current.uniforms.uClockTexture.value =
        clockRenderTarget.texture;

      // Render trail A.
      gl.setRenderTarget(trailRenderTargetA);
      gl.clear();
      gl.render(trailSceneA, cameraA);

      // Send trail A texture to relevant materials.
      trailMaterialRefB.current.uniforms.uTrailTexture.value =
        trailRenderTargetA.texture;
      agentDataMaterialRefB.current.uniforms.uTrailTexture.value =
        trailRenderTargetA.texture;
      slimeMoldDisplayPlaneUniforms.uTrailTexture.value =
        trailRenderTargetA.texture;
    } else {
      // Update relevant trail B uniforms.
      trailMaterialRefB.current.uniforms.uDelta.value = uDeltaRef.current;
      trailMaterialRefB.current.uniforms.uTime.value = uTimeRef.current;
      trailMaterialRefB.current.uniforms.uAgentPositionsTexture.value =
        agentPositionsRenderTarget.texture;
      trailMaterialRefB.current.uniforms.uClockTexture.value =
        clockRenderTarget.texture;

      // Render trail B.
      gl.setRenderTarget(trailRenderTargetB);
      gl.clear();
      gl.render(trailSceneB, cameraA);

      // Send trail B texture to relevant materials.
      trailMaterialRefA.current.uniforms.uTrailTexture.value =
        trailRenderTargetB.texture;
      agentDataMaterialRefA.current.uniforms.uTrailTexture.value =
        trailRenderTargetB.texture;
      slimeMoldDisplayPlaneUniforms.uTrailTexture.value =
        trailRenderTargetB.texture;
    }

    // Set render target to return to the default framebuffer (I think?).
    gl.setRenderTarget(null);

    // Update the display plane uniforms.
    slimeMoldDisplayPlaneUniforms.uClockTexture.value =
      clockRenderTarget.texture;
    slimeMoldDisplayPlaneUniforms.uDelta.value = uDeltaRef.current;
    slimeMoldDisplayPlaneUniforms.uTime.value = uTimeRef.current;
    slimeMoldDisplayPlaneUniforms.uPaletteCycleTime.value =
      uPaletteCycleTimeRef.current;

    // Update the gpu texture display uniforms.
    // @ts-expect-error `map` does exist.
    agentDataDisplayPlaneRef.current.material.map =
      agentDataRenderTargetA.texture;
    // @ts-expect-error `map` does exist.
    agentPositionsDisplayPlaneRef.current.material.map =
      agentPositionsRenderTarget.texture;
    // @ts-expect-error `map` does exist.
    trailDisplayPlaneRef.current.material.map = trailRenderTargetA.texture;
    // @ts-expect-error `map` does exist.
    clockDisplayPlaneRef.current.material.map = clockRenderTarget.texture;

    // Ping the pong or pong the ping.
    pingPongRef.current = !pingPongRef.current;
  });

  return (
    <>
      {createPortal(
        <mesh>
          <agentDataMaterial
            ref={agentDataMaterialRefA}
            args={[agentDataUniforms]}
          />
          <bufferGeometry>
            <bufferAttribute
              args={[renderPlanePositions, 3]}
              attach="attributes-position"
              array={renderPlanePositions}
              count={renderPlanePositions.length / 3}
              itemSize={3}
            />
            <bufferAttribute
              args={[renderPlaneUvs, 2]}
              attach="attributes-uv"
              array={renderPlaneUvs}
              count={renderPlaneUvs.length / 2}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        agentDataSceneA,
      )}
      {createPortal(
        <mesh>
          <agentDataMaterial
            ref={agentDataMaterialRefB}
            args={[agentDataUniforms]}
          />
          <bufferGeometry>
            <bufferAttribute
              args={[renderPlanePositions, 3]}
              attach="attributes-position"
              array={renderPlanePositions}
              count={renderPlanePositions.length / 3}
              itemSize={3}
            />
            <bufferAttribute
              args={[renderPlaneUvs, 2]}
              attach="attributes-uv"
              array={renderPlaneUvs}
              count={renderPlaneUvs.length / 2}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        agentDataSceneB,
      )}
      {createPortal(
        <points>
          <agentPositionsMaterial
            ref={agentPositionsMaterialRef}
            args={[agentPositionsUniforms]}
          />
          <bufferGeometry>
            <bufferAttribute
              args={[agentPositionsAttribute, 3]}
              attach="attributes-position"
              array={agentPositionsAttribute}
              count={agentPositionsAttribute.length / 3}
              itemSize={3}
            />
          </bufferGeometry>
        </points>,
        agentPositionsScene,
      )}
      {createPortal(<ClockDisplay />, clockScene)}
      {createPortal(
        <mesh>
          <trailMaterial ref={trailMaterialRefA} args={[trailUniforms]} />
          <bufferGeometry>
            <bufferAttribute
              args={[renderPlanePositions, 3]}
              attach="attributes-position"
              array={renderPlanePositions}
              count={renderPlanePositions.length / 3}
              itemSize={3}
            />
            <bufferAttribute
              args={[renderPlaneUvs, 2]}
              attach="attributes-uv"
              array={renderPlaneUvs}
              count={renderPlaneUvs.length / 2}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        trailSceneA,
      )}
      {createPortal(
        <mesh>
          <trailMaterial ref={trailMaterialRefB} args={[trailUniforms]} />
          <bufferGeometry>
            <bufferAttribute
              args={[renderPlanePositions, 3]}
              attach="attributes-position"
              array={renderPlanePositions}
              count={renderPlanePositions.length / 3}
              itemSize={3}
            />
            <bufferAttribute
              args={[renderPlaneUvs, 2]}
              attach="attributes-uv"
              array={renderPlaneUvs}
              count={renderPlaneUvs.length / 2}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        trailSceneB,
      )}
      <Plane visible={true}>
        <shaderMaterial
          ref={slimeMoldDisplayShaderRef}
          uniforms={slimeMoldDisplayPlaneUniforms}
          vertexShader={displayVertexShader}
          fragmentShader={displayFragmentShader}
          blending={THREE.NormalBlending}
        />
      </Plane>
      <Plane ref={agentDataDisplayPlaneRef} visible={showGpuTextures}>
        <meshBasicMaterial
          attach="material"
          map={agentDataRenderTargetA.texture}
          depthTest={false}
          depthWrite={false}
          onBeforeCompile={(shader) => {
            shader.uniforms.uWindowResolution =
              texturePlaneUniforms.uWindowResolution;
            shader.uniforms.uShowTexture = texturePlaneUniforms.uShowTexture;
            shader.vertexShader = shader.vertexShader.replace(
              "#include <common>",
              /* glsl */ `
              #include <common>
              uniform vec2 uWindowResolution;
              uniform float uShowTexture;
              `,
            );
            shader.vertexShader = shader.vertexShader.replace(
              "#include <project_vertex>",
              /* glsl */ `
              #include <project_vertex>
              gl_Position = vec4(position, 1.0) * vec4(0.4 * (uWindowResolution.y / uWindowResolution.x), 0.4, 1.0, 1.0) + vec4(1.0 - (0.4 * (uWindowResolution.y / uWindowResolution.x)) * 0.5, 0.8, 0.0, 0.0);
              gl_Position += vec4(vec3((1.0 - uShowTexture) * 9999.0), 0.0);
              `,
            );
          }}
        />
      </Plane>
      <Plane ref={agentPositionsDisplayPlaneRef} visible={showGpuTextures}>
        <meshBasicMaterial
          attach="material"
          map={agentPositionsRenderTarget.texture}
          depthTest={false}
          depthWrite={false}
          onBeforeCompile={(shader) => {
            shader.uniforms.uWindowResolution =
              texturePlaneUniforms.uWindowResolution;
            shader.uniforms.uShowTexture = texturePlaneUniforms.uShowTexture;
            shader.vertexShader = shader.vertexShader.replace(
              "#include <common>",
              /* glsl */ `
              #include <common>
              uniform vec2 uWindowResolution;
              uniform float uShowTexture;
              `,
            );
            shader.vertexShader = shader.vertexShader.replace(
              "#include <project_vertex>",
              /* glsl */ `
              #include <project_vertex>
              gl_Position = vec4(position, 1.0) * vec4(0.4 * (uWindowResolution.y / uWindowResolution.x), 0.4, 1.0, 1.0) + vec4(1.0 - (0.4 * (uWindowResolution.y / uWindowResolution.x)) * 0.5, 0.4, 0.0, 0.0);
              gl_Position += vec4(vec3((1.0 - uShowTexture) * 9999.0), 0.0);
              `,
            );
          }}
        />
      </Plane>
      <Plane ref={trailDisplayPlaneRef} visible={showGpuTextures}>
        <meshBasicMaterial
          attach="material"
          map={trailRenderTargetA.texture}
          depthTest={false}
          depthWrite={false}
          onBeforeCompile={(shader) => {
            shader.uniforms.uWindowResolution =
              texturePlaneUniforms.uWindowResolution;
            shader.uniforms.uShowTexture = texturePlaneUniforms.uShowTexture;
            shader.vertexShader = shader.vertexShader.replace(
              "#include <common>",
              /* glsl */ `
              #include <common>
              uniform vec2 uWindowResolution;
              uniform float uShowTexture;
              `,
            );
            shader.vertexShader = shader.vertexShader.replace(
              "#include <project_vertex>",
              /* glsl */ `
              #include <project_vertex>
              gl_Position = vec4(position, 1.0) * vec4(0.4 * (uWindowResolution.y / uWindowResolution.x), 0.4, 1.0, 1.0) + vec4(1.0 - (0.4 * (uWindowResolution.y / uWindowResolution.x)) * 0.5, 0.0, 0.0, 0.0);
              gl_Position += vec4(vec3((1.0 - uShowTexture) * 9999.0), 0.0);
              `,
            );
          }}
        />
      </Plane>
      <Plane ref={clockDisplayPlaneRef} visible={showGpuTextures}>
        <meshBasicMaterial
          attach="material"
          map={clockRenderTarget.texture}
          depthTest={false}
          depthWrite={false}
          onBeforeCompile={(shader) => {
            shader.uniforms.uWindowResolution =
              texturePlaneUniforms.uWindowResolution;
            shader.uniforms.uShowTexture = texturePlaneUniforms.uShowTexture;
            shader.vertexShader = shader.vertexShader.replace(
              "#include <common>",
              /* glsl */ `
              #include <common>
              uniform vec2 uWindowResolution;
              uniform float uShowTexture;
              `,
            );
            shader.vertexShader = shader.vertexShader.replace(
              "#include <project_vertex>",
              /* glsl */ `
              #include <project_vertex>
              gl_Position = vec4(position, 1.0) * vec4(0.4 * (uWindowResolution.y / uWindowResolution.x), 0.4, 1.0, 1.0) + vec4(1.0 - (0.4 * (uWindowResolution.y / uWindowResolution.x)) * 0.5, -0.4, 0.0, 0.0);
              gl_Position += vec4(vec3((1.0 - uShowTexture) * 9999.0), 0.0);
              `,
            );
          }}
        />
      </Plane>
      <ThreeControlDisplay />
    </>
  );
}

export default function NewSlimeClock() {
  // const debugConsoleLogger = useSlimeStore((state) => state.debugConsoleLogger);
  const [displaySlimeClock, setDisplaySlimeClock] = useState(false);

  useEffect(() => {
    const unsub = useSlimeStore.subscribe(
      (state) => state.initialization.slimeClockDisplayStatus,
      (displayStatus) => {
        if (displayStatus === "ready" && !displaySlimeClock) {
          setDisplaySlimeClock(true);
        } else if (displayStatus === "initializing" && displaySlimeClock) {
          setDisplaySlimeClock(false);
        }
      },
    );
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <InitializationHandler />
      <SettingsHistoryListener />
      {displaySlimeClock && (
        <>
          <SlimeClockRenderer />
          <RandomizationListener />
          <UniformListeners />
        </>
      )}
    </>
  );
}
