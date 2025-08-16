import { Plane, useFBO } from "@react-three/drei";
import { createPortal, extend, useFrame } from "@react-three/fiber";
import { produce } from "immer";
import * as R from "ramda";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS,
  SIMULATION_CONTROLS_CONFIGS,
} from "../../constants/constants.tsx";
import useSlimeStore from "../../stores/useSlimeStore.tsx";
import type {
  ProceduralColorPaletteChannel,
  RandomizationSetting,
  SimulationSettings,
} from "../../types/types.tsx";
import * as UTILS from "../../utils/utils.tsx";
import { randBetween, roundToFixed } from "../../utils/utils.tsx";
import SettingsHistoryListener from "../controls/SettingsHistoryListener.tsx";
import ThreeControlDisplay from "../three-control-display/ThreeControlDisplay.tsx";
import AgentDataMaterial from "./AgentDataMaterial.tsx";
import AgentPositionsMaterial from "./AgentPositionsMaterial.tsx";
import ClockDisplay from "./ClockDisplay.tsx";
import TrailMaterial from "./TrailMaterial.tsx";
import { getGaussRandomInControlBounds } from "./constants/constants.tsx";
import displayFragmentShader from "./shaders/display/display.frag";
import displayVertexShader from "./shaders/display/display.vert";
import * as SC_UTILS from "./utils/utils.tsx"; // "Slime Clock Utils"

extend({ AgentDataMaterial, AgentPositionsMaterial, TrailMaterial });

const texturePlaneUniforms = {
  uWindowResolution: new THREE.Uniform(new THREE.Vector2()),
  uShowTexture: new THREE.Uniform(0),
};
const slimeMoldDisplayPlaneUniforms = {
  uTrailTexture: new THREE.Uniform(new THREE.Texture()),
  uClockTexture: new THREE.Uniform(new THREE.Texture()),
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
  uShowClockShadow: new THREE.Uniform(
    useSlimeStore.getState().clockSettings.showClockShadow ? 1 : 0,
  ),
  uClockShadowOpacity: new THREE.Uniform(
    useSlimeStore.getState().clockSettings.clockShadowOpacity,
  ),
  uClockShadowColor: new THREE.Uniform(
    new THREE.Color(useSlimeStore.getState().clockSettings.clockShadowColor),
  ),
  uIntensitySmoothing: new THREE.Uniform(
    useSlimeStore.getState().colorSettings.intensitySmoothing,
  ),
  uAgentDirectionSmoothing: new THREE.Uniform(
    useSlimeStore.getState().colorSettings.agentDirectionSmoothing,
  ),
  uAgentDirectionColorOffset: new THREE.Uniform(
    useSlimeStore.getState().colorSettings.agentDirectionColorOffset,
  ),
  uClockColorOffset: new THREE.Uniform(
    useSlimeStore.getState().colorSettings.clockColorOffset,
  ),
  uXColorOffset: new THREE.Uniform(
    useSlimeStore.getState().colorSettings.xColorOffset,
  ),
  uYColorOffset: new THREE.Uniform(
    useSlimeStore.getState().colorSettings.yColorOffset,
  ),
  uPaletteCycleTime: new THREE.Uniform(0.0),
  uPaletteCycleScale: new THREE.Uniform(
    useSlimeStore.getState().colorSettings.paletteCycleScale,
  ),
  uPaletteCycleType: new THREE.Uniform(0),
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

function InitializationHandler() {
  const debugConsoleLogger = useSlimeStore.getState().debugConsoleLogger;
  debugConsoleLogger("InitializationHandler component mounted");
  const initializationStates = useSlimeStore((state) => state.initialization);

  /**
   * General listener.
   *
   * Updates the "initialization > [...]DisplayStatus" values. Also sets
   * the "all > initialized" value to true when all initialization
   * steps are complete.
   */
  useEffect(() => {
    debugConsoleLogger("NewSlimeClock > DisplayStatus useEffect triggered");
    useSlimeStore.setState(
      produce((state) => {
        if (
          initializationStates.storeSettings.initialized &&
          initializationStates.controlsDisplayStatus !== "ready"
        ) {
          state.initialization.lastUpdatedAt = Date.now();
          state.initialization.controlsDisplayStatus = "ready";
        }
        if (
          !initializationStates.all.initialized &&
          initializationStates.storeSettings.initialized &&
          initializationStates.resolutions.initialized &&
          initializationStates.uniforms.initialized
        ) {
          state.initialization.lastUpdatedAt = Date.now();
          state.initialization.slimeClockDisplayStatus = "ready";

          state.initialization.all.initialized = true;
          state.initialization.all.completedAt = Date.now();
        } else if (
          initializationStates.all.initialized &&
          (!initializationStates.storeSettings.initialized ||
            !initializationStates.resolutions.initialized ||
            !initializationStates.uniforms.initialized)
        ) {
          state.initialization.lastUpdatedAt = Date.now();
          state.initialization.all.initialized = false;
        }
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializationStates.lastUpdatedAt]);

  /**
   * All.
   *
   * Updating the "requestedAt" date for "all" should trigger a complete re-initialization.
   */
  useEffect(() => {
    debugConsoleLogger(
      'NewSlimeClock > "all" initialization useEffect triggered',
    );
    if (
      initializationStates.all.requestedAt >
      initializationStates.all.completedAt
    ) {
      debugConsoleLogger('NewSlimeClock > "all" initialization triggered');
      useSlimeStore.setState(
        produce((state) => {
          // Since we're re-initializing "all", we need to update several initialization states.
          state.initialization.lastUpdatedAt = Date.now();
          state.initialization.slimeClockDisplayStatus = "initializing";

          state.initialization.all.initialized = false;

          // Update "store > initialized" and "store > requestedAt" values.
          state.initialization.storeSettings.initialized = false;
          state.initialization.storeSettings.requestedAt = Date.now();

          // Update "resolutions > initialized" value.
          state.initialization.resolutions.initialized = false;

          // Update uniforms "initialized" value.
          state.initialization.uniforms.initialized = false;
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializationStates.all.requestedAt]);

  /**
   * Store Settings.
   *
   * Should always initialize before resolutions and uniforms.
   * Just a bit of a sanity check to ensure all our values are set to
   * what we're expecting prior to trying to initialize or render anything.
   * Ensures that the clockSettings simulationSettings, and colorSettings
   * are set. Checks for selected presets first to ensure the settings
   * we're using are what we expect.
   */
  function initializeStore() {
    debugConsoleLogger(
      "NewSlimeClock > InitializationHandler > initializeStore called",
    );
  }
  useEffect(() => {
    if (
      initializationStates.store.requestedAt >
      initializationStates.store.completedAt
    ) {
      debugConsoleLogger(
        "NewSlimeClock > InitializationHandler > initializeStore triggered",
      );
      useSlimeStore.setState(
        produce((state) => {
          // Update global initialization variables.
          state.initialization.lastUpdatedAt = Date.now();
          state.initialization.slimeClockDisplayStatus = "initializing";

          // Update all "initialized" value.
          state.initialization.all.initialized = false;

          // Update store "initialized" value.
          state.initialization.storeSettings.initialized = false;
        }),
      );
      initializeStore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializationStates.store.requestedAt]);

  /**
   * Resolutions.
   *
   * Should always initialize before uniforms.
   */
  function initializeResolutions() {
    debugConsoleLogger(
      "NewSlimeClock > InitializationHandler > initializeResolutions called",
    );
    const simulationSettings = useSlimeStore.getState().simulationSettings;

    const displayTextureResolution = UTILS.getDisplayTextureResolution(
      simulationSettings.displayTextureAspectRatio,
      simulationSettings.displayTextureTargetQuality,
    );
    const gpuTextureSize = Math.floor(
      Math.sqrt(
        simulationSettings.displayTextureTargetQuality *
          1000000 *
          simulationSettings.agentDensity,
      ),
    );

    debugConsoleLogger(
      "NewSlimeClock > InitializationHandler > initializeResolutions",
      "displayTextureResolution:",
      displayTextureResolution,
      "gpuTextureSize:",
      gpuTextureSize,
    );
    useSlimeStore.setState(
      produce((state) => {
        state.simulationSettings.gpuTextureWidth = gpuTextureSize;
        state.simulationSettings.gpuTextureHeight = gpuTextureSize;

        state.simulationSettings.displayTextureWidth =
          displayTextureResolution.width;
        state.simulationSettings.displayTextureHeight =
          displayTextureResolution.height;

        state.initialization.lastUpdatedAt = Date.now();

        state.initialization.resolutions.initialized = true;
        state.initialization.resolutions.completedAt = Date.now();

        state.initialization.storeSettings.requestedAt = Date.now();
      }),
    );
  }
  useEffect(() => {
    if (
      initializationStates.resolutions.requestedAt >
      initializationStates.resolutions.completedAt
    ) {
      useSlimeStore.setState(
        produce((state) => {
          // Update global initialization variables.
          state.initialization.lastUpdatedAt = Date.now();
          state.initialization.slimeClockDisplayStatus = "initializing";

          // Update all "initialized" value.
          state.initialization.all.initialized = false;

          // Update resolutions "initialized" value.
          state.initialization.resolutions.initialized = false;

          // Update store "initialized" value.
          // TODO: Revisit this to see if we always want to do this.
          state.initialization.storeSettings.initialized = false;

          // Update uniforms "initialized" value.
          // TODO: Revisit this to see if we always want to do this.
          state.initialization.uniforms.initialized = false;
        }),
      );
      initializeResolutions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializationStates.resolutions.requestedAt]);

  return null;
}

export default function NewSlimeClock() {
  return <InitializationHandler />;
}
