import { produce } from "immer";
import { useEffect } from "react";
import * as THREE from "three";
import {
  DEFAULT_COLOR_SETTINGS_PRESET_NAME,
  DEFAULT_SIMULATION_SETTINGS_PRESET_NAME,
} from "../../constants/constants.tsx";
import useSlimeStore from "../../stores/useSlimeStore.tsx";
import type {
  AgentDataUniforms,
  AgentPositionsUniforms,
  ColorSettings,
  SimulationSettings,
  SlimeMoldDisplayPlaneUniforms,
  TexturePlaneUniforms,
  TrailUniforms,
} from "../../types/types.tsx";
import * as UTILS from "../../utils/utils.tsx";

function initializeClockSettings() {
  const debugConsoleLogger = useSlimeStore.getState().debugConsoleLogger;

  // We're keeping most of the default clock settings, or whatever settings
  // have been saved in the store. We do need to initialize the "digitLayout"
  // and "size" values if the "digitLayout" is not set.

  const clockSettings = useSlimeStore.getState().clockSettings;
  if (clockSettings.digitLayout === "not set") {
    debugConsoleLogger(
      "initializeClockSettings > digitLayout not set, initializing based on window aspect ratio",
    );
    const windowAspectRatio = window.innerWidth / window.innerHeight;
    const digitLayout = windowAspectRatio > 1 ? "horizontal" : "vertical";
    const size = digitLayout === "horizontal" ? 50 : 25;
    useSlimeStore.setState(
      produce((state) => {
        state.clockSettings.digitLayout = digitLayout;
        state.clockSettings.size = size;
      }),
    );
  }
}
function initializeSimulationSettings() {
  const debugConsoleLogger = useSlimeStore.getState().debugConsoleLogger;
  debugConsoleLogger("initializeSimulationSettings called");

  // We'll keep whatever simulation settings are already set in the store,
  // if they have been set previously. If not, we'll need to initialize
  // them using the default preset settings.
  const simulationSettings = useSlimeStore.getState().simulationSettings;
  if (simulationSettings.settingsSetPreviously) {
    debugConsoleLogger(
      "initializeSimulationSettings > settings already set previously, skipping initialization",
    );
    return;
  }

  debugConsoleLogger(
    "initializeSimulationSettings > settings not set previously, initializing with default preset",
  );
  const presets = useSlimeStore.getState().presets;
  const defaultLoadableSimulationSettings = presets.filter(
    (preset) => preset.name === DEFAULT_SIMULATION_SETTINGS_PRESET_NAME,
  )[0].simulationSettings;
  if (!defaultLoadableSimulationSettings) {
    debugConsoleLogger(
      "initializeSimulationSettings > default preset not found; throwing error",
    );
    throw new Error("Default simulation settings preset not found");
  }

  // Writing these all out to make sure everything is set correctly, and to
  // help identify any special cases that might need to be handled.
  const defaultSimulationSettings: SimulationSettings = {
    settingsSetPreviously: true,

    speed: defaultLoadableSimulationSettings.speed,

    boundaryBehavior: defaultLoadableSimulationSettings.boundaryBehavior,

    agentDensity: defaultLoadableSimulationSettings.agentDensity,
    // gpuTextureWidth and gpuTextureHeight will be set later when we
    // initialize the resolutions. For now, they'll be set to the default
    // values (should be 16).
    gpuTextureWidth: simulationSettings.gpuTextureWidth,
    gpuTextureHeight: simulationSettings.gpuTextureHeight,
    agentStartType: defaultLoadableSimulationSettings.agentStartType,
    agentClockAttraction:
      defaultLoadableSimulationSettings.agentClockAttraction,
    agentClockDepositRate:
      defaultLoadableSimulationSettings.agentClockDepositRate,
    agentBackgroundDepositRate:
      defaultLoadableSimulationSettings.agentBackgroundDepositRate,
    agentSensorDegrees: defaultLoadableSimulationSettings.agentSensorDegrees,
    agentRotationRate: defaultLoadableSimulationSettings.agentRotationRate,
    agentSensorOffset: defaultLoadableSimulationSettings.agentSensorOffset,
    agentSensorWidth: defaultLoadableSimulationSettings.agentSensorWidth,
    agentStepSize: defaultLoadableSimulationSettings.agentStepSize,
    agentCrowdAvoidance: defaultLoadableSimulationSettings.agentCrowdAvoidance,
    agentWanderStrength: defaultLoadableSimulationSettings.agentWanderStrength,

    displayTextureAspectRatio:
      defaultLoadableSimulationSettings.displayTextureAspectRatio,
    displayTextureTargetQuality:
      defaultLoadableSimulationSettings.displayTextureTargetQuality,
    // Similar to the gpuTextureWidth and gpuTextureHeight, these
    // will be set later when we initialize the resolutions.
    displayTextureWidth: simulationSettings.displayTextureWidth,
    displayTextureHeight: simulationSettings.displayTextureHeight,
    trailClockDecayRate: defaultLoadableSimulationSettings.trailClockDecayRate,
    trailClockDiffuseRate:
      defaultLoadableSimulationSettings.trailClockDiffuseRate,
    trailBackgroundDecayRate:
      defaultLoadableSimulationSettings.trailBackgroundDecayRate,
    trailBackgroundDiffuseRate:
      defaultLoadableSimulationSettings.trailBackgroundDiffuseRate,

    showTextureDisplayPlanes: simulationSettings.showTextureDisplayPlanes,
  };

  useSlimeStore.setState(
    produce((state) => {
      state.simulationSettings = defaultSimulationSettings;
    }),
  );
}
function initializeColorSettings() {
  const debugConsoleLogger = useSlimeStore.getState().debugConsoleLogger;
  debugConsoleLogger("initializeColorSettings called");

  // Same as with the simulation settings, we'll keep whatever color
  // settings are already set in the store, if they have been set previously.
  // If not, we'll need to initialize them using the default preset settings.
  const colorSettings = useSlimeStore.getState().colorSettings;
  if (colorSettings.settingsSetPreviously) {
    debugConsoleLogger(
      "initializeColorSettings > settings already set previously, skipping initialization",
    );
    return;
  }

  debugConsoleLogger(
    "initializeColorSettings > settings not set previously, initializing with default preset",
  );
  const presets = useSlimeStore.getState().presets;
  const defaultLoadableColorSettings = presets.filter(
    (preset) => preset.name === DEFAULT_COLOR_SETTINGS_PRESET_NAME,
  )[0].colorSettings;
  if (!defaultLoadableColorSettings) {
    debugConsoleLogger(
      "initializeColorSettings > default preset not found; throwing error",
    );
    throw new Error("Default color settings preset not found");
  }

  // Again, writing these all out to make sure everything is set correctly,
  // and to help identify any special cases that might need to be handled.
  const defaultColorSettings: ColorSettings = {
    settingsSetPreviously: true,
    slimeColorChangedAt: colorSettings.slimeColorChangedAt,

    backgroundColor: defaultLoadableColorSettings.backgroundColor,
    slimeColorMode: defaultLoadableColorSettings.slimeColorMode,
    proceduralColorPalette: defaultLoadableColorSettings.proceduralColorPalette,
    intensitySmoothing: defaultLoadableColorSettings.intensitySmoothing,
    agentDirectionSmoothing:
      defaultLoadableColorSettings.agentDirectionSmoothing,
    agentDirectionColorOffset:
      defaultLoadableColorSettings.agentDirectionColorOffset,
    clockColorOffset: defaultLoadableColorSettings.clockColorOffset,
    xColorOffset: defaultLoadableColorSettings.xColorOffset,
    yColorOffset: defaultLoadableColorSettings.yColorOffset,
    paletteCycleSpeed: defaultLoadableColorSettings.paletteCycleSpeed,
    paletteCycleScale: defaultLoadableColorSettings.paletteCycleScale,
    paletteCycleType: defaultLoadableColorSettings.paletteCycleType,
  };

  useSlimeStore.setState(
    produce((state) => {
      state.colorSettings = defaultColorSettings;
    }),
  );
}

// TODO: Using promises or async/await for initialization steps
// seems like it'd be easier to manage, plus could suspend until
// all initialization steps are complete. It's also probably better
// practice anyways.
// TODO: Learn how to make promises...
export default function InitializationHandler() {
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
    debugConsoleLogger("DisplayStatus useEffect triggered");
    useSlimeStore.setState(
      produce((state) => {
        // Update the controlsDisplayStatus once the storeSettings are initialized.
        if (
          initializationStates.storeSettings.initialized &&
          initializationStates.controlsDisplayStatus !== "ready"
        ) {
          state.initialization.lastUpdatedAt = Date.now();
          state.initialization.controlsDisplayStatus = "ready";
        }

        // Check if all initialization steps are complete, then update
        // the appropriate values if necessary.
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
        }
        // Or if the initialization steps are not complete, update the
        // "all > initialized" value to false if it's set to true.
        else if (
          initializationStates.all.initialized &&
          (!initializationStates.storeSettings.initialized ||
            !initializationStates.resolutions.initialized ||
            !initializationStates.uniforms.initialized)
        ) {
          state.initialization.lastUpdatedAt = Date.now();
          // TODO: Check if we should set the "slimeClockDisplayStatus"
          // to "initializing" here.
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
          // Since we're re-initializing "all", we need to update several
          // initialization states.
          state.initialization.lastUpdatedAt = Date.now();

          // Updating the "[...]DisplayStatus" values to "initializing" since
          // we don't want to run the simulation or render the controls until
          // all initialization steps are complete.
          state.initialization.controlsDisplayStatus = "initializing";
          state.initialization.slimeClockDisplayStatus = "initializing";

          state.initialization.all.initialized = false;

          // We always want to initialize the store settings prior to initializing
          // the resolutions and uniforms, so we're setting the "requestedAt"
          // value here, which will trigger the "storeSettings" initialization
          // useEffect to run.
          state.initialization.storeSettings.initialized = false;
          state.initialization.storeSettings.requestedAt = Date.now();

          // The resolutions and uniforms should indicate that they're not initialized,
          // but we're not updating the "requestedAt" values here since we don't want
          // to trigger their initialization just yet.
          state.initialization.resolutions.initialized = false;
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
    debugConsoleLogger("InitializationHandler > initializeStore called");
    initializeClockSettings();
    initializeSimulationSettings();
    initializeColorSettings();
    debugConsoleLogger(
      "InitializationHandler > initializeStore completed",
      "Setting storeSettings to initialized",
    );
    useSlimeStore.setState(
      produce((state) => {
        state.initialization.lastUpdatedAt = Date.now();
        state.initialization.controlsDisplayStatus = "ready";

        state.initialization.storeSettings.initialized = true;
        state.initialization.storeSettings.completedAt = Date.now();

        state.initialization.resolutions.initialized = false;
        state.initialization.resolutions.requestedAt = Date.now();

        state.initialization.uniforms.initialized = false;
      }),
    );
  }
  useEffect(() => {
    if (
      initializationStates.storeSettings.requestedAt >
      initializationStates.storeSettings.completedAt
    ) {
      debugConsoleLogger("InitializationHandler > initializeStore triggered");
      useSlimeStore.setState(
        produce((state) => {
          state.initialization.lastUpdatedAt = Date.now();
          // TODO: Check if we want to update the "controlsDisplayStatus" each time
          // we initialize the store settings.
          state.initialization.controlsDisplayStatus = "initializing";
          state.initialization.slimeClockDisplayStatus = "initializing";

          state.initialization.all.initialized = false;
          state.initialization.storeSettings.initialized = false;

          // TODO: Check if we want to update the "resolutions" and "uniforms"
          // "initialized" values here.
          state.initialization.resolutions.initialized = false;
          state.initialization.uniforms.initialized = false;
        }),
      );
      initializeStore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializationStates.storeSettings.requestedAt]);

  /**
   * Resolutions.
   *
   * Should always initialize after storeSettings and before uniforms.
   */
  function initializeResolutions() {
    debugConsoleLogger("InitializationHandler > initializeResolutions called");
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
      "InitializationHandler > initializeResolutions",
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

        state.initialization.uniforms.initialized = false;
        state.initialization.uniforms.requestedAt = Date.now();
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
          state.initialization.lastUpdatedAt = Date.now();
          state.initialization.slimeClockDisplayStatus = "initializing";

          state.initialization.all.initialized = false;
          state.initialization.resolutions.initialized = false;

          // TODO: Revisit this to see if we always want to do this.
          state.initialization.uniforms.initialized = false;
        }),
      );
      initializeResolutions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializationStates.resolutions.requestedAt]);

  /**
   * Uniforms.
   *
   * Should always initialize after storeSettings and resolutions.
   */
  function initializeUniforms() {
    debugConsoleLogger("InitializationHandler > initializeUniforms called");
    const storeState = useSlimeStore.getState();
    const clockSettings = storeState.clockSettings;
    const simulationSettings = storeState.simulationSettings;
    const colorSettings = storeState.colorSettings;

    const initialAgentDataTextureUniform = new THREE.Uniform(
      UTILS.getAgentDataTexture(
        simulationSettings.gpuTextureWidth,
        simulationSettings.gpuTextureHeight,
        simulationSettings.displayTextureWidth,
        simulationSettings.displayTextureHeight,
        simulationSettings.agentStartType,
      ),
    );
    const initialAgentPositionsTextureUniform = new THREE.Uniform(
      UTILS.getAgentPositionsTexture(
        simulationSettings.displayTextureWidth,
        simulationSettings.displayTextureHeight,
      ),
    );
    const initialTrailTextureUniform = new THREE.Uniform(
      UTILS.getTrailTexture(
        simulationSettings.displayTextureWidth,
        simulationSettings.displayTextureHeight,
      ),
    );
    // The initial clock texture is set to a placeholder texture that will be
    // replaced in the first render loop.
    const initialClockTextureUniform = new THREE.Uniform(new THREE.Texture());

    const initialDisplayTextureResolutionUniform = new THREE.Uniform(
      new THREE.Vector2(
        simulationSettings.displayTextureWidth,
        simulationSettings.displayTextureHeight,
      ),
    );

    const agentDataUniforms: AgentDataUniforms = {
      uAgentDataTexture: initialAgentDataTextureUniform,
      uClockTexture: initialClockTextureUniform,
      uTrailTexture: initialTrailTextureUniform,
      uDisplayTextureResolution: initialDisplayTextureResolutionUniform,
      uClockAttraction: new THREE.Uniform(
        simulationSettings.agentClockAttraction,
      ),
      uSensorAngle: new THREE.Uniform(
        simulationSettings.agentSensorDegrees * (Math.PI / 180),
      ),
      uRotationRate: new THREE.Uniform(simulationSettings.agentRotationRate),
      uSensorOffset: new THREE.Uniform(
        UTILS.getHeightScaledPixelValue(simulationSettings.agentSensorOffset),
      ),
      uSensorWidth: new THREE.Uniform(
        UTILS.getHeightScaledPixelValue(simulationSettings.agentSensorWidth),
      ),
      uStepSize: new THREE.Uniform(
        UTILS.getHeightScaledPixelValue(simulationSettings.agentStepSize),
      ),
      uCrowdAvoidance: new THREE.Uniform(
        simulationSettings.agentCrowdAvoidance,
      ),
      uWanderStrength: new THREE.Uniform(
        simulationSettings.agentWanderStrength,
      ),
      uBoundaryBehavior: new THREE.Uniform(simulationSettings.boundaryBehavior),
      uTime: new THREE.Uniform(0.0),
      uDelta: new THREE.Uniform(0.0),
    };
    const agentPositionsUniforms: AgentPositionsUniforms = {
      uAgentDataTexture: initialAgentDataTextureUniform,
      uDisplayTextureResolution: initialDisplayTextureResolutionUniform,
    };
    const trailUniforms: TrailUniforms = {
      uAgentPositionsTexture: initialAgentPositionsTextureUniform,
      uClockTexture: initialClockTextureUniform,
      uTrailTexture: initialTrailTextureUniform,
      uDisplayTextureResolution: initialDisplayTextureResolutionUniform,
      uClockDepositRate: new THREE.Uniform(
        simulationSettings.agentClockDepositRate,
      ),
      uBackgroundDepositRate: new THREE.Uniform(
        simulationSettings.agentBackgroundDepositRate,
      ),
      uClockDecayRate: new THREE.Uniform(
        simulationSettings.trailClockDecayRate,
      ),
      uClockDiffuseRate: new THREE.Uniform(
        simulationSettings.trailClockDiffuseRate,
      ),
      uBackgroundDecayRate: new THREE.Uniform(
        simulationSettings.trailBackgroundDecayRate,
      ),
      uBackgroundDiffuseRate: new THREE.Uniform(
        simulationSettings.trailBackgroundDiffuseRate,
      ),
      uBoundaryBehavior: new THREE.Uniform(simulationSettings.boundaryBehavior),
      uDelta: new THREE.Uniform(0.0),
      uTime: new THREE.Uniform(0.0),
    };
    const slimeMoldDisplayPlaneUniforms: SlimeMoldDisplayPlaneUniforms = {
      uTrailTexture: initialTrailTextureUniform,
      uClockTexture: initialClockTextureUniform,
      uDisplayTextureResolution: initialDisplayTextureResolutionUniform,
      uDisplayScale: new THREE.Uniform(
        UTILS.getDisplayScaleVector(
          simulationSettings.displayTextureWidth,
          simulationSettings.displayTextureHeight,
        ),
      ),
      uTime: new THREE.Uniform(0.0),
      uDelta: new THREE.Uniform(0.0),
      uPaletteA: new THREE.Uniform(
        new THREE.Vector3(
          colorSettings.proceduralColorPalette.r.yOffset,
          colorSettings.proceduralColorPalette.g.yOffset,
          colorSettings.proceduralColorPalette.b.yOffset,
        ),
      ),
      uPaletteB: new THREE.Uniform(
        new THREE.Vector3(
          colorSettings.proceduralColorPalette.r.amplitude,
          colorSettings.proceduralColorPalette.g.amplitude,
          colorSettings.proceduralColorPalette.b.amplitude,
        ),
      ),
      uPaletteC: new THREE.Uniform(
        new THREE.Vector3(
          colorSettings.proceduralColorPalette.r.frequency,
          colorSettings.proceduralColorPalette.g.frequency,
          colorSettings.proceduralColorPalette.b.frequency,
        ),
      ),
      uPaletteD: new THREE.Uniform(
        new THREE.Vector3(
          colorSettings.proceduralColorPalette.r.phase,
          colorSettings.proceduralColorPalette.g.phase,
          colorSettings.proceduralColorPalette.b.phase,
        ),
      ),
      uShowClockShadow: new THREE.Uniform(
        clockSettings.showClockShadow ? 1 : 0,
      ),
      uClockShadowOpacity: new THREE.Uniform(clockSettings.clockShadowOpacity),
      uClockShadowColor: new THREE.Uniform(
        new THREE.Color(clockSettings.clockShadowColor),
      ),
      uIntensitySmoothing: new THREE.Uniform(colorSettings.intensitySmoothing),
      uAgentDirectionSmoothing: new THREE.Uniform(
        colorSettings.agentDirectionSmoothing,
      ),
      uAgentDirectionColorOffset: new THREE.Uniform(
        colorSettings.agentDirectionColorOffset,
      ),
      uClockColorOffset: new THREE.Uniform(colorSettings.clockColorOffset),
      uXColorOffset: new THREE.Uniform(colorSettings.xColorOffset),
      uYColorOffset: new THREE.Uniform(colorSettings.yColorOffset),
      uPaletteCycleTime: new THREE.Uniform(0.0),
      uPaletteCycleScale: new THREE.Uniform(colorSettings.paletteCycleScale),
      uPaletteCycleType: new THREE.Uniform(colorSettings.paletteCycleType),
    };
    const texturePlaneUniforms: TexturePlaneUniforms = {
      uWindowResolution: new THREE.Uniform(UTILS.getWindowResolutionVector()),
      uShowTexture: new THREE.Uniform(
        simulationSettings.showTextureDisplayPlanes ? 1 : 0,
      ),
    };

    useSlimeStore.setState(
      produce((state) => {
        state.uniforms.agentData = agentDataUniforms;
        state.uniforms.agentPositions = agentPositionsUniforms;
        state.uniforms.trail = trailUniforms;
        state.uniforms.slimeMoldDisplayPlane = slimeMoldDisplayPlaneUniforms;
        state.uniforms.texturePlane = texturePlaneUniforms;

        state.initialization.lastUpdatedAt = Date.now();

        state.initialization.uniforms.initialized = true;
        state.initialization.uniforms.completedAt = Date.now();
      }),
    );
  }
  useEffect(() => {
    if (
      initializationStates.uniforms.requestedAt >
      initializationStates.uniforms.completedAt
    ) {
      debugConsoleLogger("InitializationHandler > initializeUniforms");
      useSlimeStore.setState(
        produce((state) => {
          state.initialization.lastUpdatedAt = Date.now();
          state.initialization.slimeClockDisplayStatus = "initializing";

          state.initialization.all.initialized = false;

          state.initialization.uniforms.initialized = false;
        }),
      );
      initializeUniforms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializationStates.uniforms.requestedAt]);

  return null;
}
