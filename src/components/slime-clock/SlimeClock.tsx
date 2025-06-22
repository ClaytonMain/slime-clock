import { Plane, useFBO } from "@react-three/drei";
import { createPortal, extend, useFrame, useThree } from "@react-three/fiber";
import * as R from "ramda";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import useSlimeStore from "../../stores/useSlimeStore";
import ProceduralColorPaletteDisplay from "../procedural-color-palette-display/ProceduralColorPaletteDisplay";
import AgentDataMaterial from "./AgentDataMaterial";
import AgentPositionsMaterial from "./AgentPositionsMaterial";
// @ts-expect-error leave me alone :(
import ClockDisplay from "./ClockDisplay";
import TrailMaterial from "./TrailMaterial";
import displayFragmentShader from "./shaders/display/display.frag";
import displayVertexShader from "./shaders/display/display.vert";

extend({ AgentDataMaterial, AgentPositionsMaterial, TrailMaterial });

const texturePlaneUniforms = {
  uResolution: new THREE.Uniform(new THREE.Vector2(800, 800)),
  uShowTexture: new THREE.Uniform(1),
};
const slimeMoldDisplayPlaneUniforms = {
  uTrailTexture: new THREE.Uniform(new THREE.Texture()),
  uAgentPositionsTexture: new THREE.Uniform(new THREE.Texture()),
  uDisplayTextureResolution: new THREE.Uniform(
    new THREE.Vector2(
      useSlimeStore.getState().simulationSettings.displayTextureWidth,
      useSlimeStore.getState().simulationSettings.displayTextureHeight,
    ),
  ),
  uDisplayScale: new THREE.Uniform(new THREE.Vector2(1, 1)),
  uTime: new THREE.Uniform(0.0),
  uDelta: new THREE.Uniform(0.0),
  uPaletteA: new THREE.Uniform(
    new THREE.Vector3(
      useSlimeStore.getState().colorSettings.proceduralColorPalette.r.yOffset,
      useSlimeStore.getState().colorSettings.proceduralColorPalette.g.yOffset,
      useSlimeStore.getState().colorSettings.proceduralColorPalette.b.yOffset,
    ),
  ),
  uPaletteB: new THREE.Uniform(
    new THREE.Vector3(
      useSlimeStore.getState().colorSettings.proceduralColorPalette.r.amplitude,
      useSlimeStore.getState().colorSettings.proceduralColorPalette.g.amplitude,
      useSlimeStore.getState().colorSettings.proceduralColorPalette.b.amplitude,
    ),
  ),
  uPaletteC: new THREE.Uniform(
    new THREE.Vector3(
      useSlimeStore.getState().colorSettings.proceduralColorPalette.r.frequency,
      useSlimeStore.getState().colorSettings.proceduralColorPalette.g.frequency,
      useSlimeStore.getState().colorSettings.proceduralColorPalette.b.frequency,
    ),
  ),
  uPaletteD: new THREE.Uniform(
    new THREE.Vector3(
      useSlimeStore.getState().colorSettings.proceduralColorPalette.r.phase,
      useSlimeStore.getState().colorSettings.proceduralColorPalette.g.phase,
      useSlimeStore.getState().colorSettings.proceduralColorPalette.b.phase,
    ),
  ),
};
const agentDataUniforms = {
  uAgentDataTexture: { value: new THREE.Texture() },
  uAgentPositionsTexture: { value: new THREE.Texture() },
  uTrailTexture: { value: new THREE.Texture() },
  uDisplayTextureResolution: {
    value: new THREE.Vector2(
      useSlimeStore.getState().simulationSettings.displayTextureWidth,
      useSlimeStore.getState().simulationSettings.displayTextureHeight,
    ),
  },
  uSensorAngle: {
    value:
      useSlimeStore.getState().simulationSettings.agentSensorDegrees *
      (Math.PI / 180),
  },
  uRotationRate: {
    value: useSlimeStore.getState().simulationSettings.agentRotationRate,
  },
  uSensorOffset: {
    value: useSlimeStore.getState().simulationSettings.agentSensorOffset,
  },
  uSensorWidth: {
    value: useSlimeStore.getState().simulationSettings.agentSensorWidth,
  },
  uStepSize: {
    value: useSlimeStore.getState().simulationSettings.agentStepSize,
  },
  uCrowdAvoidance: {
    value: useSlimeStore.getState().simulationSettings.agentCrowdAvoidance,
  },
  uWanderStrength: {
    value: useSlimeStore.getState().simulationSettings.agentWanderStrength,
  },
  uBoundaryBehavior: {
    value: useSlimeStore.getState().simulationSettings.boundaryBehavior,
  },
  uTime: { value: 0.0 },
  uDelta: { value: 0.0 },
};
const agentPositionsUniforms = {
  uAgentDataTexture: { value: new THREE.Texture() },
  uDisplayTextureResolution: {
    value: new THREE.Vector2(
      useSlimeStore.getState().simulationSettings.displayTextureWidth,
      useSlimeStore.getState().simulationSettings.displayTextureHeight,
    ),
  },
};
const trailUniforms = {
  uAgentPositionsTexture: { value: new THREE.Texture() },
  uClockTexture: { value: new THREE.Texture() },
  uTrailTexture: { value: new THREE.Texture() },
  uDisplayTextureResolution: {
    value: new THREE.Vector2(
      useSlimeStore.getState().simulationSettings.displayTextureWidth,
      useSlimeStore.getState().simulationSettings.displayTextureHeight,
    ),
  },
  uDepositRate: {
    value: useSlimeStore.getState().simulationSettings.agentDepositRate,
  },
  uTrailDecayRate: {
    value: useSlimeStore.getState().simulationSettings.trailDecayRate,
  },
  uTrailDiffuseRate: {
    value: useSlimeStore.getState().simulationSettings.trailDiffuseRate,
  },
  uTrailTextDecayRate: {
    value: useSlimeStore.getState().simulationSettings.trailTextDecayRate,
  },
  uTrailTextDiffuseRate: {
    value: useSlimeStore.getState().simulationSettings.trailTextDiffuseRate,
  },
  uTrailNegativeSpaceDecayRate: {
    value:
      useSlimeStore.getState().simulationSettings.trailNegativeSpaceDecayRate,
  },
  uTrailNegativeSpaceDiffuseRate: {
    value:
      useSlimeStore.getState().simulationSettings.trailNegativeSpaceDiffuseRate,
  },
  uBoundaryBehavior: {
    value: useSlimeStore.getState().simulationSettings.boundaryBehavior,
  },
  uDelta: { value: 0.0 },
  uTime: { value: 0.0 },
};

function UniformSetter() {
  const simulationSettings = useSlimeStore((state) => state.simulationSettings);

  // du - "directly updatable"
  const duAgentDataUniforms: [
    keyof typeof agentDataUniforms,
    (keyof typeof simulationSettings)[],
  ][] = [
    ["uRotationRate", ["agentRotationRate"]],
    ["uSensorOffset", ["agentSensorOffset"]],
    ["uSensorWidth", ["agentSensorWidth"]],
    ["uStepSize", ["agentStepSize"]],
    ["uCrowdAvoidance", ["agentCrowdAvoidance"]],
    ["uWanderStrength", ["agentWanderStrength"]],
    ["uBoundaryBehavior", ["boundaryBehavior"]],
  ];
  const duTrailUniforms: [
    keyof typeof trailUniforms,
    (keyof typeof simulationSettings)[],
  ][] = [
    ["uDepositRate", ["agentDepositRate"]],
    ["uTrailDecayRate", ["trailDecayRate"]],
    ["uTrailDiffuseRate", ["trailDiffuseRate"]],
    ["uTrailTextDecayRate", ["trailTextDecayRate"]],
    ["uTrailTextDiffuseRate", ["trailTextDiffuseRate"]],
    ["uTrailNegativeSpaceDecayRate", ["trailNegativeSpaceDecayRate"]],
    ["uTrailNegativeSpaceDiffuseRate", ["trailNegativeSpaceDiffuseRate"]],
    ["uBoundaryBehavior", ["boundaryBehavior"]],
  ];

  useEffect(() => {
    duAgentDataUniforms.forEach(([uniformName, settingsKeys]) => {
      const storePath = ["simulationSettings", ...settingsKeys];
      const storeValue = R.view(
        R.lensPath(storePath),
        useSlimeStore.getState(),
      );
      const uniformValue = agentDataUniforms[uniformName];
      if (uniformValue.value !== storeValue) {
        uniformValue.value = storeValue;
      }
    });
    duTrailUniforms.forEach(([uniformName, settingsKeys]) => {
      const storePath = ["simulationSettings", ...settingsKeys];
      const storeValue = R.view(
        R.lensPath(storePath),
        useSlimeStore.getState(),
      );
      const uniformValue = trailUniforms[uniformName];
      if (uniformValue !== storeValue) {
        uniformValue.value = storeValue;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulationSettings]);

  // Individual subscriptions.
  useEffect(() => {
    const unsubDisplayTextureWidth = useSlimeStore.subscribe(
      (state) => state.simulationSettings.displayTextureWidth,
      (newValue) => {
        const newResolution = new THREE.Vector2(
          newValue,
          useSlimeStore.getState().simulationSettings.displayTextureHeight,
        );
        slimeMoldDisplayPlaneUniforms.uDisplayTextureResolution.value =
          newResolution;
        agentDataUniforms.uDisplayTextureResolution.value = newResolution;
        agentPositionsUniforms.uDisplayTextureResolution.value = newResolution;
        trailUniforms.uDisplayTextureResolution.value = newResolution;
      },
    );
    const unsubDisplayTextureHeight = useSlimeStore.subscribe(
      (state) => state.simulationSettings.displayTextureHeight,
      (newValue) => {
        const newResolution = new THREE.Vector2(
          useSlimeStore.getState().simulationSettings.displayTextureWidth,
          newValue,
        );
        slimeMoldDisplayPlaneUniforms.uDisplayTextureResolution.value =
          newResolution;
        agentDataUniforms.uDisplayTextureResolution.value = newResolution;
        agentPositionsUniforms.uDisplayTextureResolution.value = newResolution;
        trailUniforms.uDisplayTextureResolution.value = newResolution;
      },
    );
    return () => {
      unsubDisplayTextureWidth();
      unsubDisplayTextureHeight();
    };
  }, []);

  return null;
}

function SlimeClock() {
  const viewport = useThree((state) => state.viewport);
  const simulationSettings = useSlimeStore((state) => state.simulationSettings);

  const timeSinceRandomizeRef = useRef(0);

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

  const gpuTextureWidth = useSlimeStore(
    (state) => state.simulationSettings.gpuTextureWidth,
  );
  const gpuTextureHeight = useSlimeStore(
    (state) => state.simulationSettings.gpuTextureHeight,
  );
  const agentDataRenderTargetA = useFBO(gpuTextureWidth, gpuTextureHeight, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });
  const agentDataRenderTargetB = useFBO(gpuTextureWidth, gpuTextureHeight, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });
  const displayTextureWidth = useSlimeStore(
    (state) => state.simulationSettings.displayTextureWidth,
  );
  const displayTextureHeight = useSlimeStore(
    (state) => state.simulationSettings.displayTextureHeight,
  );
  const agentPositionsRenderTarget = useFBO(
    displayTextureWidth,
    displayTextureHeight,
    {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      type: THREE.FloatType,
    },
  );
  const clockRenderTarget = useFBO(displayTextureWidth, displayTextureHeight, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });
  const trailRenderTargetA = useFBO(displayTextureWidth, displayTextureHeight, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });
  const trailRenderTargetB = useFBO(displayTextureWidth, displayTextureHeight, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  const agentPositionsAttribute = useMemo(() => {
    const length = parseInt(simulationSettings.agentCount, 10);
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
    simulationSettings.agentCount,
  ]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (viewport.width && viewport.height) {
        texturePlaneUniforms.uResolution.value.set(
          viewport.width,
          viewport.height,
        );
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [viewport]);

  useEffect(() => {
    const targetAspect =
      simulationSettings.displayTextureWidth /
      simulationSettings.displayTextureHeight;
    const windowAspect = window.innerWidth / window.innerHeight;

    // If windowAspect > targetAspect scale x, otherwise scale y
    if (windowAspect > targetAspect) {
      slimeMoldDisplayPlaneUniforms.uDisplayScale.value = new THREE.Vector2(
        (targetAspect * 2) / windowAspect,
        2,
      );
    } else {
      slimeMoldDisplayPlaneUniforms.uDisplayScale.value = new THREE.Vector2(
        2,
        (windowAspect * 2) / targetAspect,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    window.innerWidth,
    window.innerHeight,
    simulationSettings.displayTextureWidth,
    simulationSettings.displayTextureHeight,
  ]);

  const pingPongRef = useRef(true);
  const uDeltaRef = useRef(0.0);
  const uTimeRef = useRef(0.0);

  useFrame(({ gl }, delta) => {
    // Hoo boy, this is a doozy.
    timeSinceRandomizeRef.current += delta;
    if (
      simulationSettings.randomizationEnabled &&
      timeSinceRandomizeRef.current >= simulationSettings.randomizationInterval
    ) {
      // TODO: Randomize the simulation
      // randomizeSimulation();
      timeSinceRandomizeRef.current = 0;
    }
    uDeltaRef.current = Math.min(delta * simulationSettings.speed, 0.1);
    uTimeRef.current += uDeltaRef.current;

    /**
     * Agent data.
     */
    if (pingPongRef.current) {
      // Update agent data A time uniforms.
      agentDataMaterialRefA.current.uniforms.uDelta.value = uDeltaRef.current;
      agentDataMaterialRefA.current.uniforms.uTime.value = uTimeRef.current;

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

    // Render the clock.
    gl.setRenderTarget(clockRenderTarget);
    gl.clear();
    gl.render(clockScene, cameraB);

    // console.log(clockRenderTarget.texture);

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
    slimeMoldDisplayPlaneUniforms.uAgentPositionsTexture.value =
      agentPositionsRenderTarget.texture;
    slimeMoldDisplayPlaneUniforms.uDelta.value = uDeltaRef.current;
    slimeMoldDisplayPlaneUniforms.uTime.value = uTimeRef.current;

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
      <UniformSetter />
      {createPortal(
        <mesh>
          <agentDataMaterial
            ref={agentDataMaterialRefA}
            args={[
              simulationSettings.gpuTextureWidth,
              simulationSettings.gpuTextureHeight,
              agentDataUniforms,
              simulationSettings.displayTextureWidth,
              simulationSettings.displayTextureHeight,
              simulationSettings.agentStartType,
            ]}
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
            args={[
              simulationSettings.gpuTextureWidth,
              simulationSettings.gpuTextureHeight,
              agentDataUniforms,
              simulationSettings.displayTextureWidth,
              simulationSettings.displayTextureHeight,
              simulationSettings.agentStartType,
            ]}
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
            args={[
              simulationSettings.displayTextureWidth,
              simulationSettings.displayTextureHeight,
              agentPositionsUniforms,
            ]}
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
          <trailMaterial
            ref={trailMaterialRefA}
            args={[
              simulationSettings.displayTextureWidth,
              simulationSettings.displayTextureHeight,
              trailUniforms,
            ]}
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
        trailSceneA,
      )}
      {createPortal(
        <mesh>
          <trailMaterial
            ref={trailMaterialRefB}
            args={[
              simulationSettings.displayTextureWidth,
              simulationSettings.displayTextureHeight,
              trailUniforms,
            ]}
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
        trailSceneB,
      )}
      <Plane>
        <shaderMaterial
          ref={slimeMoldDisplayShaderRef}
          uniforms={slimeMoldDisplayPlaneUniforms}
          vertexShader={displayVertexShader}
          fragmentShader={displayFragmentShader}
        />
      </Plane>
      <Plane ref={agentDataDisplayPlaneRef} visible={true}>
        <meshBasicMaterial
          attach="material"
          map={agentDataRenderTargetA.texture}
          depthTest={false}
          depthWrite={false}
          onBeforeCompile={(shader) => {
            shader.uniforms.uResolution = texturePlaneUniforms.uResolution;
            shader.uniforms.uShowTexture = texturePlaneUniforms.uShowTexture;
            shader.vertexShader = shader.vertexShader.replace(
              "#include <common>",
              /* glsl */ `
              #include <common>
              uniform vec2 uResolution;
              uniform float uShowTexture;
              `,
            );
            shader.vertexShader = shader.vertexShader.replace(
              "#include <project_vertex>",
              /* glsl */ `
              #include <project_vertex>
              gl_Position = vec4(position, 1.0) * vec4(0.4 * (uResolution.y / uResolution.x), 0.4, 1.0, 1.0) + vec4(1.0 - (0.4 * (uResolution.y / uResolution.x)) * 0.5, 0.8, 0.0, 0.0);
              gl_Position += vec4(vec3((1.0 - uShowTexture) * 9999.0), 0.0);
              `,
            );
          }}
        />
      </Plane>
      <Plane ref={agentPositionsDisplayPlaneRef} visible={true}>
        <meshBasicMaterial
          attach="material"
          map={agentPositionsRenderTarget.texture}
          depthTest={false}
          depthWrite={false}
          onBeforeCompile={(shader) => {
            shader.uniforms.uResolution = texturePlaneUniforms.uResolution;
            shader.uniforms.uShowTexture = texturePlaneUniforms.uShowTexture;
            shader.vertexShader = shader.vertexShader.replace(
              "#include <common>",
              /* glsl */ `
              #include <common>
              uniform vec2 uResolution;
              uniform float uShowTexture;
              `,
            );
            shader.vertexShader = shader.vertexShader.replace(
              "#include <project_vertex>",
              /* glsl */ `
              #include <project_vertex>
              gl_Position = vec4(position, 1.0) * vec4(0.4 * (uResolution.y / uResolution.x), 0.4, 1.0, 1.0) + vec4(1.0 - (0.4 * (uResolution.y / uResolution.x)) * 0.5, 0.4, 0.0, 0.0);
              gl_Position += vec4(vec3((1.0 - uShowTexture) * 9999.0), 0.0);
              `,
            );
          }}
        />
      </Plane>
      <Plane ref={trailDisplayPlaneRef} visible={true}>
        <meshBasicMaterial
          attach="material"
          map={trailRenderTargetA.texture}
          depthTest={false}
          depthWrite={false}
          onBeforeCompile={(shader) => {
            shader.uniforms.uResolution = texturePlaneUniforms.uResolution;
            shader.uniforms.uShowTexture = texturePlaneUniforms.uShowTexture;
            shader.vertexShader = shader.vertexShader.replace(
              "#include <common>",
              /* glsl */ `
              #include <common>
              uniform vec2 uResolution;
              uniform float uShowTexture;
              `,
            );
            shader.vertexShader = shader.vertexShader.replace(
              "#include <project_vertex>",
              /* glsl */ `
              #include <project_vertex>
              gl_Position = vec4(position, 1.0) * vec4(0.4 * (uResolution.y / uResolution.x), 0.4, 1.0, 1.0) + vec4(1.0 - (0.4 * (uResolution.y / uResolution.x)) * 0.5, 0.0, 0.0, 0.0);
              gl_Position += vec4(vec3((1.0 - uShowTexture) * 9999.0), 0.0);
              `,
            );
          }}
        />
      </Plane>
      <Plane ref={clockDisplayPlaneRef} visible={true}>
        <meshBasicMaterial
          attach="material"
          map={clockRenderTarget.texture}
          depthTest={false}
          depthWrite={false}
          onBeforeCompile={(shader) => {
            shader.uniforms.uResolution = texturePlaneUniforms.uResolution;
            shader.uniforms.uShowTexture = texturePlaneUniforms.uShowTexture;
            shader.vertexShader = shader.vertexShader.replace(
              "#include <common>",
              /* glsl */ `
              #include <common>
              uniform vec2 uResolution;
              uniform float uShowTexture;
              `,
            );
            shader.vertexShader = shader.vertexShader.replace(
              "#include <project_vertex>",
              /* glsl */ `
              #include <project_vertex>
              gl_Position = vec4(position, 1.0) * vec4(0.4 * (uResolution.y / uResolution.x), 0.4, 1.0, 1.0) + vec4(1.0 - (0.4 * (uResolution.y / uResolution.x)) * 0.5, -0.4, 0.0, 0.0);
              gl_Position += vec4(vec3((1.0 - uShowTexture) * 9999.0), 0.0);
              `,
            );
          }}
        />
      </Plane>
      <ProceduralColorPaletteDisplay />
    </>
  );
}

export default SlimeClock;
