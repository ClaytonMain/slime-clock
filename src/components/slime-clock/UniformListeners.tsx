import { produce } from "immer";
import * as R from "ramda";
import { useEffect } from "react";
import * as THREE from "three";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  AgentDataUniforms,
  AgentPositionsUniforms,
  ClockSettings,
  ColorSettings,
  SimulationSettings,
  SlimeMoldDisplayPlaneUniforms,
  TexturePlaneUniforms,
  TrailUniforms,
} from "../../types/types";
import * as UTILS from "../../utils/utils.tsx";

type ValueStorePathClockSettings = ["clockSettings", keyof ClockSettings];
type ValueStorePathSimulationSettings = [
  "simulationSettings",
  keyof SimulationSettings,
];
type ValueStorePathColorSettings = ["colorSettings", keyof ColorSettings];
type ValueStorePath =
  | ValueStorePathClockSettings
  | ValueStorePathSimulationSettings
  | ValueStorePathColorSettings;

type UniformStorePathAgentData = ["agentData", keyof AgentDataUniforms];
type UniformStorePathAgentPositions = [
  "agentPositions",
  keyof AgentPositionsUniforms,
];
type UniformStorePathTrail = ["trail", keyof TrailUniforms];
type UniformStorePathSlimeMoldDisplayPlane = [
  "slimeMoldDisplayPlane",
  keyof SlimeMoldDisplayPlaneUniforms,
];
type UniformStorePathTexturePlane = [
  "texturePlane",
  keyof TexturePlaneUniforms,
];
type UniformStorePath =
  | UniformStorePathAgentData
  | UniformStorePathAgentPositions
  | UniformStorePathTrail
  | UniformStorePathSlimeMoldDisplayPlane
  | UniformStorePathTexturePlane;

function SimpleUniformListener({
  valueStorePath,
  uniformStorePath,
  valueType = "number",
  heightScaled = false,
  factor,
}: {
  valueStorePath: ValueStorePath;
  uniformStorePath: UniformStorePath;
  valueType?: "number" | "boolean" | "color";
  heightScaled?: boolean;
  factor?: number;
}) {
  /**
   * Cannot use `heightScaled` and `factor` together.
   */
  const debugConsoleLogger = useSlimeStore((state) => state.debugConsoleLogger);
  useEffect(() => {
    const unsub = useSlimeStore.subscribe(
      (state) => R.view(R.lensPath(valueStorePath), state),
      (newStoreValue) => {
        let newValue = newStoreValue;
        switch (valueType) {
          case "number":
            if (heightScaled) {
              newValue = UTILS.getHeightScaledPixelValue(newValue);
            } else if (factor) {
              newValue *= factor;
            }
            break;
          case "boolean":
            newValue = newValue ? 1 : 0;
            break;
          default:
            break;
        }
        useSlimeStore.setState(
          R.over(
            R.lensPath(["uniforms", ...uniformStorePath]),
            () => new THREE.Uniform(newValue),
          ),
        );
        debugConsoleLogger(
          "Uniform updated",
          ["uniforms", ...uniformStorePath],
          newValue,
        );
      },
    );
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

// Cannot use `factor` and `heightScaled` together.
const SIMPLE_UNIFORM_LISTENER_CONFIGS: Array<{
  valueStorePath: ValueStorePath;
  uniformStorePath: UniformStorePath;
  valueType?: "number" | "boolean" | "color";
  heightScaled?: boolean;
  factor?: number;
}> = [
  /**
   * agentData
   */
  {
    valueStorePath: ["simulationSettings", "agentClockAttraction"],
    uniformStorePath: ["agentData", "uClockAttraction"],
  },
  {
    valueStorePath: ["simulationSettings", "agentSensorDegrees"],
    uniformStorePath: ["agentData", "uSensorAngle"],
    factor: Math.PI / 180,
  },
  {
    valueStorePath: ["simulationSettings", "agentRotationRate"],
    uniformStorePath: ["agentData", "uRotationRate"],
  },
  {
    valueStorePath: ["simulationSettings", "agentSensorOffset"],
    uniformStorePath: ["agentData", "uSensorOffset"],
    heightScaled: true,
  },
  {
    valueStorePath: ["simulationSettings", "agentSensorWidth"],
    uniformStorePath: ["agentData", "uSensorWidth"],
    heightScaled: true,
  },
  {
    valueStorePath: ["simulationSettings", "agentStepSize"],
    uniformStorePath: ["agentData", "uStepSize"],
    heightScaled: true,
  },
  {
    valueStorePath: ["simulationSettings", "agentCrowdAvoidance"],
    uniformStorePath: ["agentData", "uCrowdAvoidance"],
  },
  {
    valueStorePath: ["simulationSettings", "agentWanderStrength"],
    uniformStorePath: ["agentData", "uWanderStrength"],
  },
  {
    valueStorePath: ["simulationSettings", "boundaryBehavior"],
    uniformStorePath: ["agentData", "uBoundaryBehavior"],
  },

  /**
   * agentPositions
   */

  /**
   * trail
   */
  {
    valueStorePath: ["simulationSettings", "agentClockDepositRate"],
    uniformStorePath: ["trail", "uClockDepositRate"],
  },
  {
    valueStorePath: ["simulationSettings", "agentBackgroundDepositRate"],
    uniformStorePath: ["trail", "uBackgroundDepositRate"],
  },
  {
    valueStorePath: ["simulationSettings", "trailClockDecayRate"],
    uniformStorePath: ["trail", "uClockDecayRate"],
  },
  {
    valueStorePath: ["simulationSettings", "trailClockDiffuseRate"],
    uniformStorePath: ["trail", "uClockDiffuseRate"],
  },
  {
    valueStorePath: ["simulationSettings", "trailBackgroundDecayRate"],
    uniformStorePath: ["trail", "uBackgroundDecayRate"],
  },
  {
    valueStorePath: ["simulationSettings", "trailBackgroundDiffuseRate"],
    uniformStorePath: ["trail", "uBackgroundDiffuseRate"],
  },
  {
    valueStorePath: ["simulationSettings", "boundaryBehavior"],
    uniformStorePath: ["trail", "uBoundaryBehavior"],
  },

  /**
   * slimeMoldDisplayPlane
   */
  {
    valueStorePath: ["clockSettings", "showClockShadow"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uShowClockShadow"],
    valueType: "boolean",
  },
  {
    valueStorePath: ["clockSettings", "clockShadowOpacity"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uClockShadowOpacity"],
  },
  {
    valueStorePath: ["colorSettings", "intensitySmoothing"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uIntensitySmoothing"],
  },
  {
    valueStorePath: ["colorSettings", "agentDirectionSmoothing"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uAgentDirectionSmoothing"],
  },
  {
    valueStorePath: ["colorSettings", "agentDirectionColorOffset"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uAgentDirectionColorOffset"],
  },
  {
    valueStorePath: ["colorSettings", "clockColorOffset"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uClockColorOffset"],
  },
  {
    valueStorePath: ["colorSettings", "xColorOffset"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uXColorOffset"],
  },
  {
    valueStorePath: ["colorSettings", "yColorOffset"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uYColorOffset"],
  },
  {
    valueStorePath: ["colorSettings", "paletteCycleScale"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uPaletteCycleScale"],
  },
  {
    valueStorePath: ["colorSettings", "paletteCycleType"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uPaletteCycleType"],
  },

  /**
   * texturePlane
   */
  {
    valueStorePath: ["simulationSettings", "showTextureDisplayPlanes"],
    uniformStorePath: ["texturePlane", "uShowTexture"],
    valueType: "boolean",
  },
];

function UniformSubscriptionListeners() {
  /**
   * I'm thinking that we should mimic the order in which things are
   * initialized in the `InitializationHandler` component, so:
   *  - storeSettings
   *  - resolutions
   *  - uniforms
   *
   * Contrary to how I was doing this in the original `SlimeClock` component,
   * I think I want to avoid chaining listeners, if practical.
   * For example, if something happens that changes the `gpuTextureWidth`,
   * then any store values depending on that should be updated, the resolutions
   * should be recalculated, and the relevant uniforms should be updated, all
   * within the same update to the store.
   *
   * I'm really just looking to avoid having to jump all over the place to see
   * where things are being updated / triggered.
   */
  // const debugConsoleLogger = useSlimeStore((state) => state.debugConsoleLogger);
  const initializationStates = useSlimeStore((state) => state.initialization);
  // const clockSettings = useSlimeStore((state) => state.clockSettings);
  const simulationSettings = useSlimeStore((state) => state.simulationSettings);
  // const colorSettings = useSlimeStore((state) => state.colorSettings);

  // Any changes that should trigger both the resolutions and uniforms to be
  // re-initialized.
  useEffect(() => {
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

    const agentDataTextureUniform = new THREE.Uniform(
      UTILS.getAgentDataTexture(
        gpuTextureSize,
        gpuTextureSize,
        displayTextureResolution.width,
        displayTextureResolution.height,
        simulationSettings.agentStartType,
      ),
    );
    const agentPositionsTextureUniform = new THREE.Uniform(
      UTILS.getAgentPositionsTexture(
        displayTextureResolution.width,
        displayTextureResolution.height,
      ),
    );
    const trailTextureUniform = new THREE.Uniform(
      UTILS.getTrailTexture(
        displayTextureResolution.width,
        displayTextureResolution.height,
      ),
    );

    const displayTextureResolutionVectorUniform = new THREE.Uniform(
      UTILS.getDisplayTextureResolutionVector(
        displayTextureResolution.width,
        displayTextureResolution.height,
      ),
    );
    const displayScaleVectorUniform = new THREE.Uniform(
      UTILS.getDisplayScaleVector(
        displayTextureResolution.width,
        displayTextureResolution.height,
      ),
    );
    const windowResolutionVectorUniform = new THREE.Uniform(
      UTILS.getWindowResolutionVector(),
    );

    useSlimeStore.setState(
      produce((state) => {
        state.simulationSettings.gpuTextureWidth = gpuTextureSize;
        state.simulationSettings.gpuTextureHeight = gpuTextureSize;

        state.simulationSettings.displayTextureWidth =
          displayTextureResolution.width;
        state.simulationSettings.displayTextureHeight =
          displayTextureResolution.height;

        state.uniforms.agentData.uAgentDataTexture = agentDataTextureUniform;
        state.uniforms.agentData.uTrailTexture = trailTextureUniform;
        state.uniforms.agentData.uDisplayTextureResolution =
          displayTextureResolutionVectorUniform;

        state.uniforms.agentPositions.uAgentDataTexture =
          agentDataTextureUniform;
        state.uniforms.agentPositions.uDisplayTextureResolution =
          displayTextureResolutionVectorUniform;

        state.uniforms.trail.uAgentPositionsTexture =
          agentPositionsTextureUniform;
        state.uniforms.trail.uTrailTexture = trailTextureUniform;
        state.uniforms.trail.uDisplayTextureResolution =
          displayTextureResolutionVectorUniform;

        state.uniforms.slimeMoldDisplayPlane.uTrailTexture =
          trailTextureUniform;
        state.uniforms.slimeMoldDisplayPlane.uDisplayTextureResolution =
          displayTextureResolutionVectorUniform;
        state.uniforms.slimeMoldDisplayPlane.uDisplayScale =
          displayScaleVectorUniform;

        state.uniforms.texturePlane.uWindowResolution =
          windowResolutionVectorUniform;
      }),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    window.innerWidth,
    window.innerHeight,
    simulationSettings.displayTextureAspectRatio,
    simulationSettings.displayTextureTargetQuality,
    simulationSettings.agentDensity,
  ]);

  // // agentData
  // "uAgentDataTexture";
  // "uClockTexture";
  // "uTrailTexture";
  // "uDisplayTextureResolution";

  // // agentPositions
  // "uAgentDataTexture";
  // "uDisplayTextureResolution";

  // // trail
  // "uAgentPositionsTexture";
  // "uClockTexture";
  // "uTrailTexture";
  // "uDisplayTextureResolution";
  // "uDelta";
  // "uTime";

  // // slimeMoldDisplayPlane
  // "uTrailTexture";
  // "uClockTexture";
  // "uDisplayTextureResolution";
  // "uDisplayScale";
  // "uTime";
  // "uDelta";
  // "uPaletteA";
  // "uPaletteB";
  // "uPaletteC";
  // "uPaletteD";
  // "uClockShadowColor";

  // // texturePlane
  // "uWindowResolution";

  return null;
}

export default function UniformListeners() {
  return (
    <>
      <UniformSubscriptionListeners />
      {SIMPLE_UNIFORM_LISTENER_CONFIGS.map((config) => (
        <SimpleUniformListener
          key={config.uniformStorePath.join(".")}
          {...config}
        />
      ))}
    </>
  );
}
