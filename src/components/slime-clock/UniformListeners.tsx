import { produce } from "immer";
import * as R from "ramda";
import { useEffect, useState } from "react";
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
  windowHeightScaled = false,
  displayTextureHeightScaled = false,
  factor,
}: {
  valueStorePath: ValueStorePath;
  uniformStorePath: UniformStorePath;
  valueType?: "number" | "boolean" | "color";
  windowHeightScaled?: boolean;
  displayTextureHeightScaled?: boolean;
  factor?: number;
}) {
  /**
   * Cannot use `[window / displayTexture]HeightScaled` and `factor` together.
   */
  const debugConsoleLogger = useSlimeStore((state) => state.debugConsoleLogger);
  useEffect(() => {
    const unsub = useSlimeStore.subscribe(
      (state) => R.view(R.lensPath(valueStorePath), state),
      (newStoreValue) => {
        let newValue = newStoreValue;
        switch (valueType) {
          case "number":
            if (windowHeightScaled) {
              newValue = UTILS.getWindowHeightScaledValue(newValue);
            } else if (displayTextureHeightScaled) {
              newValue = UTILS.getDisplayTextureHeightScaledValue(newValue);
            } else if (factor) {
              newValue *= factor;
            }
            break;
          case "boolean":
            newValue = newValue ? 1 : 0;
            break;
          case "color":
            newValue = new THREE.Color(newValue);
            break;
          default:
            break;
        }
        debugConsoleLogger(
          "Attempting to update uniform:",
          ["uniforms", ...uniformStorePath],
          "new value:",
          newValue,
          "old value:",
          R.view(
            R.lensPath(["uniforms", ...uniformStorePath]),
            useSlimeStore.getState(),
          ),
        );
        useSlimeStore.setState(
          R.over(
            R.lensPath(["uniforms", ...uniformStorePath]),
            (uniform: THREE.Uniform) => {
              uniform.value = newValue;
              return uniform;
            },
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
  windowHeightScaled?: boolean;
  displayTextureHeightScaled?: boolean;
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
    windowHeightScaled: true,
  },
  {
    valueStorePath: ["simulationSettings", "agentSensorWidth"],
    uniformStorePath: ["agentData", "uSensorWidth"],
    windowHeightScaled: true,
  },
  {
    valueStorePath: ["simulationSettings", "agentStepSize"],
    uniformStorePath: ["agentData", "uStepSize"],
    windowHeightScaled: true,
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
    valueStorePath: ["simulationSettings", "agentSensorWidth"],
    uniformStorePath: ["trail", "uSensorWidth"],
    windowHeightScaled: true,
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
    valueStorePath: ["clockSettings", "clockShadowColor"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uClockShadowColor"],
    valueType: "color",
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
  const debugConsoleLogger = useSlimeStore((state) => state.debugConsoleLogger);
  const initializationStates = useSlimeStore((state) => state.initialization);
  const simulationSettings = useSlimeStore((state) => state.simulationSettings);
  const colorSettings = useSlimeStore((state) => state.colorSettings);
  const simulationRestartRequestedAt = useSlimeStore(
    (state) => state.randomizationState.simulationRestartRequestedAt,
  );
  const [windowResizedAt, setWindowResizedAt] = useState(Date.now());

  function handleWindowResize() {
    setWindowResizedAt(Date.now());
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // Any changes that should trigger both the resolutions and uniforms to be
  // re-initialized.
  useEffect(() => {
    debugConsoleLogger(
      "UniformSubscriptionListeners re-initialization useEffect",
    );
    if (!initializationStates.all.initialized) return;
    debugConsoleLogger(
      "Time since all initialization complete",
      Date.now() - initializationStates.all.completedAt,
    );
    if (Date.now() - initializationStates.all.completedAt < 1000) return;

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

    const displayTextureResolutionVector =
      UTILS.getDisplayTextureResolutionVector(
        displayTextureResolution.width,
        displayTextureResolution.height,
      );
    const displayScaleVector = UTILS.getDisplayScaleVector(
      displayTextureResolution.width,
      displayTextureResolution.height,
    );
    const windowResolutionVector = UTILS.getWindowResolutionVector();

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
        state.uniforms.agentData.uDisplayTextureResolution.value.set(
          displayTextureResolutionVector.x,
          displayTextureResolutionVector.y,
        );

        state.uniforms.agentPositions.uAgentDataTexture =
          agentDataTextureUniform;
        state.uniforms.agentPositions.uDisplayTextureResolution.value.set(
          displayTextureResolutionVector.x,
          displayTextureResolutionVector.y,
        );

        state.uniforms.trail.uAgentPositionsTexture =
          agentPositionsTextureUniform;
        state.uniforms.trail.uTrailTexture = trailTextureUniform;
        state.uniforms.trail.uDisplayTextureResolution.value.set(
          displayTextureResolutionVector.x,
          displayTextureResolutionVector.y,
        );

        state.uniforms.slimeMoldDisplayPlane.uTrailTexture =
          trailTextureUniform;
        state.uniforms.slimeMoldDisplayPlane.uDisplayTextureResolution.value.set(
          displayTextureResolutionVector.x,
          displayTextureResolutionVector.y,
        );
        state.uniforms.slimeMoldDisplayPlane.uDisplayScale.value.set(
          displayScaleVector.x,
          displayScaleVector.y,
        );

        state.uniforms.texturePlane.uWindowResolution.value.set(
          windowResolutionVector.x,
          windowResolutionVector.y,
        );
      }),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    windowResizedAt,
    simulationSettings.displayTextureAspectRatio,
    simulationSettings.displayTextureTargetQuality,
    simulationSettings.agentDensity,
    simulationRestartRequestedAt,
  ]);

  // Update height-scaled values whenever displayTextureHeight or window heigh changes.
  useEffect(() => {
    debugConsoleLogger(
      "SimulationSettings.displayTextureHeight / window.innerHeight useEffect triggered",
    );
    if (!initializationStates.all.initialized) return;
    if (Date.now() - initializationStates.all.completedAt < 1000) return;

    useSlimeStore.setState(
      produce((state) => {
        state.uniforms.agentData.uSensorOffset.value =
          UTILS.getWindowHeightScaledValue(
            simulationSettings.agentSensorOffset,
          );
        state.uniforms.agentData.uStepSize.value =
          UTILS.getWindowHeightScaledValue(simulationSettings.agentStepSize);
        state.uniforms.agentData.uSensorWidth.value =
          UTILS.getWindowHeightScaledValue(simulationSettings.agentSensorWidth);
        state.uniforms.trail.uSensorWidth.value =
          UTILS.getWindowHeightScaledValue(simulationSettings.agentSensorWidth);
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulationSettings.displayTextureHeight, window.innerHeight]);

  useEffect(() => {
    debugConsoleLogger("ColorSettings.slimeColorChangedAt useEffect triggered");
    if (!initializationStates.all.initialized) return;
    if (Date.now() - initializationStates.all.completedAt < 1000) return;

    useSlimeStore.setState(
      produce((state) => {
        state.uniforms.slimeMoldDisplayPlane.uPaletteA.value.set(
          colorSettings.proceduralColorPalette.r.yOffset,
          colorSettings.proceduralColorPalette.g.yOffset,
          colorSettings.proceduralColorPalette.b.yOffset,
        );
        state.uniforms.slimeMoldDisplayPlane.uPaletteB.value.set(
          colorSettings.proceduralColorPalette.r.amplitude,
          colorSettings.proceduralColorPalette.g.amplitude,
          colorSettings.proceduralColorPalette.b.amplitude,
        );
        state.uniforms.slimeMoldDisplayPlane.uPaletteC.value.set(
          colorSettings.proceduralColorPalette.r.frequency,
          colorSettings.proceduralColorPalette.g.frequency,
          colorSettings.proceduralColorPalette.b.frequency,
        );
        state.uniforms.slimeMoldDisplayPlane.uPaletteD.value.set(
          colorSettings.proceduralColorPalette.r.phase,
          colorSettings.proceduralColorPalette.g.phase,
          colorSettings.proceduralColorPalette.b.phase,
        );
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorSettings.slimeColorChangedAt]);

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
