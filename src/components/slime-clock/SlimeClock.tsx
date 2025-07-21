import { Plane, useFBO } from "@react-three/drei";
import { createPortal, extend, useFrame } from "@react-three/fiber";
import { produce } from "immer";
import * as R from "ramda";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  DISPLAY_TEXTURE_RESOLUTIONS,
  SIMULATION_CONTROLS_CONFIGS,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  RandomizationSetting,
  SimulationSettings,
  TrailDisplayTextureResolution,
} from "../../types/types";
import { randBetween, roundToFixed } from "../../utils/utils";
import ThreeControlDisplay from "../three-control-display/ThreeControlDisplay";
import AgentDataMaterial from "./AgentDataMaterial";
import AgentPositionsMaterial from "./AgentPositionsMaterial";
import ClockDisplay from "./ClockDisplay";
import TrailMaterial from "./TrailMaterial";
import displayFragmentShader from "./shaders/display/display.frag";
import displayVertexShader from "./shaders/display/display.vert";
import * as UTILS from "./utils/utils";

extend({ AgentDataMaterial, AgentPositionsMaterial, TrailMaterial });

const texturePlaneUniforms = {
  uWindowResolution: new THREE.Uniform(new THREE.Vector2()),
  uShowTexture: new THREE.Uniform(0),
};
const slimeMoldDisplayPlaneUniforms = {
  uTrailTexture: new THREE.Uniform(new THREE.Texture()),
  uAgentPositionsTexture: new THREE.Uniform(new THREE.Texture()),
  uDisplayTextureResolution: new THREE.Uniform(new THREE.Vector2()),
  uDisplayScale: new THREE.Uniform(new THREE.Vector2()),
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
  uClockTexture: { value: new THREE.Texture() },
  uTrailTexture: { value: new THREE.Texture() },
  uDisplayTextureResolution: {
    value: new THREE.Vector2(),
  },
  uClockAttraction: {
    value: useSlimeStore.getState().simulationSettings.agentClockAttraction,
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
    value: new THREE.Vector2(),
  },
};
const trailUniforms = {
  uAgentPositionsTexture: { value: new THREE.Texture() },
  uClockTexture: { value: new THREE.Texture() },
  uTrailTexture: { value: new THREE.Texture() },
  uDisplayTextureResolution: {
    value: new THREE.Vector2(),
  },
  uClockDepositRate: {
    value: useSlimeStore.getState().simulationSettings.agentClockDepositRate,
  },
  uBackgroundDepositRate: {
    value:
      useSlimeStore.getState().simulationSettings.agentBackgroundDepositRate,
  },
  uClockDecayRate: {
    value: useSlimeStore.getState().simulationSettings.trailClockDecayRate,
  },
  uClockDiffuseRate: {
    value: useSlimeStore.getState().simulationSettings.trailClockDiffuseRate,
  },
  uBackgroundDecayRate: {
    value: useSlimeStore.getState().simulationSettings.trailBackgroundDecayRate,
  },
  uBackgroundDiffuseRate: {
    value:
      useSlimeStore.getState().simulationSettings.trailBackgroundDiffuseRate,
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
    ["uClockAttraction", ["agentClockAttraction"]],
    ["uRotationRate", ["agentRotationRate"]],
    ["uCrowdAvoidance", ["agentCrowdAvoidance"]],
    ["uWanderStrength", ["agentWanderStrength"]],
    ["uBoundaryBehavior", ["boundaryBehavior"]],
  ];
  const duTrailUniforms: [
    keyof typeof trailUniforms,
    (keyof typeof simulationSettings)[],
  ][] = [
    ["uClockDepositRate", ["agentClockDepositRate"]],
    ["uBackgroundDepositRate", ["agentBackgroundDepositRate"]],
    ["uClockDecayRate", ["trailClockDecayRate"]],
    ["uClockDiffuseRate", ["trailClockDiffuseRate"]],
    ["uBackgroundDecayRate", ["trailBackgroundDecayRate"]],
    ["uBackgroundDiffuseRate", ["trailBackgroundDiffuseRate"]],
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

  // hs - "height-scaled"
  const hsAgentDataUniforms: [
    keyof typeof agentDataUniforms,
    (keyof typeof simulationSettings)[],
  ][] = [
    ["uSensorOffset", ["agentSensorOffset"]],
    ["uSensorWidth", ["agentSensorWidth"]],
    ["uStepSize", ["agentStepSize"]],
  ];
  const hsTrailUniforms: [
    keyof typeof trailUniforms,
    (keyof typeof simulationSettings)[],
  ][] = [];
  useEffect(() => {
    const textureHeight =
      useSlimeStore.getState().simulationSettings.displayTextureHeight;
    hsAgentDataUniforms.forEach(([uniformName, settingsKeys]) => {
      const storePath = ["simulationSettings", ...settingsKeys];
      const storeValue = R.view(
        R.lensPath(storePath),
        useSlimeStore.getState(),
      );
      const uniformValue = agentDataUniforms[uniformName];
      const scaledValue = roundToFixed(
        ((storeValue as number) / 100) * textureHeight,
        4,
      );
      if (uniformValue.value !== scaledValue) {
        uniformValue.value = scaledValue;
      }
    });
    hsTrailUniforms.forEach(([uniformName, settingsKeys]) => {
      const storePath = ["simulationSettings", ...settingsKeys];
      const storeValue = R.view(
        R.lensPath(storePath),
        useSlimeStore.getState(),
      );
      const uniformValue = trailUniforms[uniformName];
      const scaledValue = roundToFixed(
        (storeValue as number) * textureHeight,
        0,
      );
      if (uniformValue.value !== scaledValue) {
        uniformValue.value = scaledValue;
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
        texturePlaneUniforms.uWindowResolution.value =
          UTILS.getWindowResolutionVector();
        slimeMoldDisplayPlaneUniforms.uDisplayScale.value =
          UTILS.getDisplayScaleVector(
            simulationSettings.displayTextureWidth,
            simulationSettings.displayTextureHeight,
          );
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
        texturePlaneUniforms.uWindowResolution.value =
          UTILS.getWindowResolutionVector();
        slimeMoldDisplayPlaneUniforms.uDisplayScale.value =
          UTILS.getDisplayScaleVector(
            simulationSettings.displayTextureWidth,
            simulationSettings.displayTextureHeight,
          );
      },
    );
    const unsubSlimeColorChangedAt = useSlimeStore.subscribe(
      (state) => state.colorSettings.slimeColorChangedAt,
      () => {
        const palette =
          useSlimeStore.getState().colorSettings.proceduralColorPalette;
        slimeMoldDisplayPlaneUniforms.uPaletteA.value.set(
          palette.r.yOffset,
          palette.g.yOffset,
          palette.b.yOffset,
        );
        slimeMoldDisplayPlaneUniforms.uPaletteB.value.set(
          palette.r.amplitude,
          palette.g.amplitude,
          palette.b.amplitude,
        );
        slimeMoldDisplayPlaneUniforms.uPaletteC.value.set(
          palette.r.frequency,
          palette.g.frequency,
          palette.b.frequency,
        );
        slimeMoldDisplayPlaneUniforms.uPaletteD.value.set(
          palette.r.phase,
          palette.g.phase,
          palette.b.phase,
        );
      },
    );
    return () => {
      unsubDisplayTextureWidth();
      unsubDisplayTextureHeight();
      unsubSlimeColorChangedAt();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function SlimeClock() {
  const simulationSettings = useSlimeStore((state) => state.simulationSettings);
  const resolutionsSet = useSlimeStore((state) => state.resolutionsSet);
  const initialized = useSlimeStore((state) => state.initialized);

  const timeSinceRandomizeRef = useRef(0);

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

  // Anything that should trigger the resolutions to reset.
  useEffect(() => {
    if (!resolutionsSet) return;
    useSlimeStore.setState(
      produce((state) => {
        state.resolutionsSet = false;
        state.initialized = false;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulationSettings.trailDisplayTextureResolution]);

  // Anything that should trigger a re-initialization of the simulation.
  useEffect(() => {
    if (!initialized) return;
    useSlimeStore.setState(
      produce((state) => {
        state.initialized = false;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulationSettings.agentDensity]);

  // Any window resize dependencies.
  useEffect(() => {
    texturePlaneUniforms.uWindowResolution.value =
      UTILS.getWindowResolutionVector();
    slimeMoldDisplayPlaneUniforms.uDisplayScale.value =
      UTILS.getDisplayScaleVector(
        simulationSettings.displayTextureWidth,
        simulationSettings.displayTextureHeight,
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth, window.innerHeight]);

  function setInitialResolutions() {
    const simulationSettings = useSlimeStore.getState().simulationSettings;
    const trailDisplayTextureResolution =
      simulationSettings.trailDisplayTextureResolution;
    // IMPORTANT: DISPLAY_TEXTURE_RESOLUTIONS is ordered from smallest to largest.
    let newDisplayTextureResolution: TrailDisplayTextureResolution =
      DISPLAY_TEXTURE_RESOLUTIONS[0];

    if (trailDisplayTextureResolution === "16 x 9") {
      // Hasn't been set yet; choose appropriate resolution from DISPLAY_TEXTURE_RESOLUTIONS.
      const windowAspect = window.innerWidth / window.innerHeight;
      const scaleTo = windowAspect > 16 / 9 ? "height" : "width";
      DISPLAY_TEXTURE_RESOLUTIONS.every((resolution) => {
        const [width, height] = resolution.split(" x ").map(Number);
        if (scaleTo === "width") {
          if (width >= window.innerWidth) {
            return false;
          }
        } else {
          if (height >= window.innerHeight) {
            return false;
          }
        }
        newDisplayTextureResolution =
          resolution as TrailDisplayTextureResolution;
        return true;
      });
    } else {
      // Has been set; use it.
      newDisplayTextureResolution = trailDisplayTextureResolution;
    }

    const [newDisplayTextureWidth, newDisplayTextureHeight] =
      newDisplayTextureResolution.split(" x ").map(Number);
    const gpuTextureSize = Math.floor(
      Math.sqrt(
        newDisplayTextureWidth *
          newDisplayTextureHeight *
          simulationSettings.agentDensity,
      ),
    );
    useSlimeStore.setState(
      produce((state) => {
        state.simulationSettings.gpuTextureWidth = gpuTextureSize;
        state.simulationSettings.gpuTextureHeight = gpuTextureSize;

        state.simulationSettings.trailDisplayTextureResolution =
          newDisplayTextureResolution;
        state.simulationSettings.displayTextureWidth = newDisplayTextureWidth;
        state.simulationSettings.displayTextureHeight = newDisplayTextureHeight;

        state.resolutionsSet = true;
      }),
    );
  }

  function initializeUniforms() {
    const simulationSettings = useSlimeStore.getState().simulationSettings;

    // Get data textures.
    const agentDataTexture = UTILS.getAgentDataTexture(
      simulationSettings.gpuTextureWidth,
      simulationSettings.gpuTextureHeight,
      simulationSettings.displayTextureWidth,
      simulationSettings.displayTextureHeight,
      simulationSettings.agentStartType,
    );
    const agentPositionsTexture = UTILS.getAgentPositionsTexture(
      simulationSettings.displayTextureWidth,
      simulationSettings.displayTextureHeight,
    );
    const trailTexture = UTILS.getTrailTexture(
      simulationSettings.displayTextureWidth,
      simulationSettings.displayTextureHeight,
    );

    // Get shared uniforms.
    const displayTextureResolutionVector =
      UTILS.getDisplayTextureResolutionVector(
        simulationSettings.displayTextureWidth,
        simulationSettings.displayTextureHeight,
      );
    const displayScaleVector = UTILS.getDisplayScaleVector(
      simulationSettings.displayTextureWidth,
      simulationSettings.displayTextureHeight,
    );
    const windowResolutionVector = UTILS.getWindowResolutionVector();

    // TODO: See if we need to initialize more uniforms here.

    // Get uniforms updates.
    const texturePlaneUniformsUpdates = {
      uWindowResolution: new THREE.Uniform(windowResolutionVector),
    };
    const slimeMoldDisplayPlaneUniformsUpdates = {
      uTrailTexture: new THREE.Uniform(trailTexture),
      uAgentPositionsTexture: new THREE.Uniform(agentPositionsTexture),
      uDisplayTextureResolution: new THREE.Uniform(
        displayTextureResolutionVector,
      ),
      uDisplayScale: new THREE.Uniform(displayScaleVector),
    };
    const agentDataUniformsUpdates = {
      uAgentDataTexture: new THREE.Uniform(agentDataTexture),
      uTrailTexture: new THREE.Uniform(trailTexture),
      uDisplayTextureResolution: new THREE.Uniform(
        displayTextureResolutionVector,
      ),
    };
    const agentPositionsUniformsUpdates = {
      uAgentDataTexture: new THREE.Uniform(agentDataTexture),
      uDisplayTextureResolution: new THREE.Uniform(
        displayTextureResolutionVector,
      ),
    };
    const trailUniformsUpdates = {
      uAgentPositionsTexture: new THREE.Uniform(agentPositionsTexture),
      uTrailTexture: new THREE.Uniform(trailTexture),
      uDisplayTextureResolution: new THREE.Uniform(
        displayTextureResolutionVector,
      ),
    };

    // Apply updates to uniforms.
    Object.assign(texturePlaneUniforms, texturePlaneUniformsUpdates);
    Object.assign(
      slimeMoldDisplayPlaneUniforms,
      slimeMoldDisplayPlaneUniformsUpdates,
    );
    Object.assign(agentDataUniforms, agentDataUniformsUpdates);
    Object.assign(agentPositionsUniforms, agentPositionsUniformsUpdates);
    Object.assign(trailUniforms, trailUniformsUpdates);
  }

  // Initialize everything.
  useEffect(() => {
    if (initialized) return;
    if (!resolutionsSet) {
      setInitialResolutions();
      return;
    }
    initializeUniforms();
    useSlimeStore.setState(
      produce((state) => {
        state.initialized = true;
      }),
    );
  }, [initialized, resolutionsSet]);

  // Randomize agent settings.
  useEffect(() => {
    if (!simulationSettings.agentsNeedRandomization) return;
    const simulationRandomizationSettings =
      useSlimeStore.getState().simulationRandomizationSettings;
    useSlimeStore.setState(
      produce((state) => {
        state.simulationSettings.agentsNeedRandomization = false;
        Object.entries(simulationRandomizationSettings).forEach(
          ([key, value]) => {
            const settingKey = key as keyof SimulationSettings;
            const randConfig = value as RandomizationSetting;
            if (!settingKey.startsWith("agent") || !randConfig.enabled) return;
            let randValue = randBetween(
              randConfig.range[0],
              randConfig.range[1],
            );
            const step = SIMULATION_CONTROLS_CONFIGS[settingKey]!.step;
            if (step) {
              randValue = roundToFixed(Math.round(randValue / step) * step, 4);
            }
            state.simulationSettings[settingKey] = randValue;
          },
        );
      }),
    );
  }, [simulationSettings.agentsNeedRandomization]);

  // Randomize trail settings.
  useEffect(() => {
    if (!simulationSettings.trailNeedsRandomization) return;
    const simulationRandomizationSettings =
      useSlimeStore.getState().simulationRandomizationSettings;
    useSlimeStore.setState(
      produce((state) => {
        state.simulationSettings.trailNeedsRandomization = false;
        Object.entries(simulationRandomizationSettings).forEach(
          ([key, value]) => {
            const settingKey = key as keyof SimulationSettings;
            const randConfig = value as RandomizationSetting;
            if (!settingKey.startsWith("trail") || !randConfig.enabled) return;
            let randValue = randBetween(
              randConfig.range[0],
              randConfig.range[1],
            );
            const step = SIMULATION_CONTROLS_CONFIGS[settingKey]!.step;
            if (step) {
              randValue = roundToFixed(Math.round(randValue / step) * step, 4);
            }
            state.simulationSettings[settingKey] = randValue;
          },
        );
      }),
    );
  }, [simulationSettings.trailNeedsRandomization]);

  const pingPongRef = useRef(true);
  const uDeltaRef = useRef(0.0);
  const uTimeRef = useRef(0.0);

  useFrame(({ gl }, delta) => {
    // Hoo boy, this is a doozy.
    if (!initialized || !resolutionsSet) return;

    timeSinceRandomizeRef.current += delta;
    if (
      simulationSettings.randomizationEnabled &&
      timeSinceRandomizeRef.current >= simulationSettings.randomizationInterval
    ) {
      useSlimeStore.setState(
        produce((state) => {
          state.simulationSettings.agentsNeedRandomization = true;
          state.simulationSettings.trailNeedsRandomization = true;
        }),
      );
      timeSinceRandomizeRef.current = 0;
    }
    uDeltaRef.current = Math.min(delta * simulationSettings.speed, 0.05);
    uTimeRef.current += uDeltaRef.current;

    // Render the clock.
    gl.setRenderTarget(clockRenderTarget);
    gl.clear();
    gl.render(clockScene, cameraB);

    /**
     * Agent data.
     */
    if (pingPongRef.current) {
      // Update agent data A time uniforms.
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

export default SlimeClock;
