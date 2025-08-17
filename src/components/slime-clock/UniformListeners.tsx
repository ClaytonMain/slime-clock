import * as R from "ramda";
import { useEffect } from "react";
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
}: {
  valueStorePath: ValueStorePath;
  uniformStorePath: UniformStorePath;
  valueType?: "number" | "boolean" | "color";
  heightScaled?: boolean;
}) {
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
            }
            break;
          case "boolean":
            newValue = newValue ? 1 : 0;
            break;
          default:
            break;
        }
        useSlimeStore.setState(
          R.over(R.lensPath(uniformStorePath), () => newValue),
        );
        debugConsoleLogger("Uniform updated", uniformStorePath, newValue);
      },
    );
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

const SIMPLE_UNIFORM_LISTENER_CONFIGS: Array<{
  valueStorePath: ValueStorePath;
  uniformStorePath: UniformStorePath;
  valueType?: "number" | "boolean" | "color";
  heightScaled?: boolean;
}> = [
  /**
   * agentData
   */
  {
    valueStorePath: ["simulationSettings", "agentClockAttraction"],
    uniformStorePath: ["agentData", "uClockAttraction"],
  },
  {
    valueStorePath: ["simulationSettings", "agentRotationRate"],
    uniformStorePath: ["agentData", "uRotationRate"],
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
    valueStorePath: ["colorSettings", "paletteCycleScale"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uPaletteCycleScale"],
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
    valueStorePath: ["colorSettings", "paletteCycleType"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uPaletteCycleType"],
  },
  {
    valueStorePath: ["clockSettings", "clockShadowOpacity"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uClockShadowOpacity"],
  },
  {
    valueStorePath: ["clockSettings", "showClockShadow"],
    uniformStorePath: ["slimeMoldDisplayPlane", "uShowClockShadow"],
    valueType: "boolean",
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

export default function UniformListeners() {
  return (
    <>
      {SIMPLE_UNIFORM_LISTENER_CONFIGS.map((config) => (
        <SimpleUniformListener
          key={config.uniformStorePath.join(".")}
          {...config}
        />
      ))}
    </>
  );
}
