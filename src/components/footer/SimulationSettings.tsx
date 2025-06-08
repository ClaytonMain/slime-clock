import { SIMULATION_CONTROLS_BOUNDS } from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  AgentCount,
  AgentStartType,
  SimulationQuality,
  TrailDisplayTextureResolution,
} from "../../types/types";
import SlimeStoreSelect from "../slime-store-select/SlimeStoreSelect";
import SlimeStoreSlider from "../slime-store-slider/SlimeStoreSlider";
import SlimeStoreToggle from "../slime-store-toggle/SlimeStoreToggle";
import FooterTabContent from "./FooterTabContent";

/**
 * Quality
 * Will set multiple settings at once.
 * TODO: Make the quality options dynamic based on the current simulation settings.
 */
type SimulationQualityOption = {
  value: SimulationQuality;
  label: string;
};
const simulationQualityOptions: SimulationQualityOption[] = [
  { value: "Very Low", label: "Very Low" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Very High", label: "Very High" },
  { value: "Custom", label: "Custom" },
] as const;

/**
 * Agent Counts
 */
type AgentCountOption = {
  value: AgentCount;
  label: string;
};
const agentCountOptions: AgentCountOption[] = [
  { value: "16384", label: "16,384" },
  { value: "65536", label: "65,536" },
  { value: "147456", label: "147,456" },
  { value: "262144", label: "262,144" },
  { value: "409600", label: "409,600" },
  { value: "589824", label: "589,824" },
  { value: "802816", label: "802,816" },
  { value: "1048576", label: "1,048,576" },
  { value: "1327104", label: "1,327,104" },
  { value: "1638400", label: "1,638,400" },
  { value: "1982464", label: "1,982,464" },
  { value: "2359296", label: "2,359,296" },
  { value: "2768896", label: "2,768,896" },
  { value: "3211264", label: "3,211,264" },
  { value: "3686400", label: "3,686,400" },
  { value: "4194304", label: "4,194,304" },
] as const;

/**
 * Agent Start Type
 */
type AgentStartTypeOption = {
  value: AgentStartType;
  label: string;
};
const agentStartTypeOptions: AgentStartTypeOption[] = [
  { value: "Random", label: "Random" },
  { value: "Center", label: "Center" },
  { value: "Ring", label: "Ring" },
  { value: "9 Rings", label: "9 Rings" },
  { value: "Circle", label: "Circle" },
  { value: "Spiral", label: "Spiral" },
  { value: "Fill", label: "Fill" },
] as const;

/**
 * Trail Display Texture Resolution
 */
type TrailDisplayTextureResolutionOption = {
  value: TrailDisplayTextureResolution;
  label: string;
};
const trailDisplayTextureResolutionOptions: TrailDisplayTextureResolutionOption[] =
  [
    { value: "640 x 480", label: "640 x 480" },
    { value: "800 x 600", label: "800 x 600" },
    { value: "1280 x 720", label: "1280 x 720" },
    { value: "1920 x 1080", label: "1920 x 1080" },
    { value: "2560 x 1440", label: "2560 x 1440" },
    { value: "3840 x 2160", label: "3840 x 2160" },
  ] as const;

export default function SimulationSettings() {
  const simulationSettings = useSlimeStore((state) => state.simulationSettings);

  return (
    <FooterTabContent tabName="simulation-settings" key="simulation-settings">
      <div className="mx-auto flex h-auto w-full max-w-sm flex-col bg-amber-200 p-1">
        <SlimeStoreSelect
          label="Simulation Quality"
          selectedOptionValue={simulationSettings.quality}
          options={simulationQualityOptions}
          storePath={["simulationSettings", "quality"]}
        />

        <SlimeStoreSlider
          label="Simulation Speed"
          storePath={["simulationSettings", "speed"]}
          min={SIMULATION_CONTROLS_BOUNDS.speed!.min}
          max={SIMULATION_CONTROLS_BOUNDS.speed!.max}
          step={0.1}
        />
        <SlimeStoreToggle
          label="Randomization Enabled"
          storePath={["simulationSettings", "randomizationEnabled"]}
        />
        <SlimeStoreSlider
          label="Randomization Interval (s)"
          storePath={["simulationSettings", "randomizationInterval"]}
          min={SIMULATION_CONTROLS_BOUNDS.randomizationInterval!.min}
          max={SIMULATION_CONTROLS_BOUNDS.randomizationInterval!.max}
          step={10}
        />

        <SlimeStoreSelect
          label="Agent Count"
          selectedOptionValue={simulationSettings.agentCount}
          options={agentCountOptions}
          storePath={["simulationSettings", "agentCount"]}
        />
        <SlimeStoreSelect
          label="Agent Start Type"
          selectedOptionValue={simulationSettings.agentStartType}
          options={agentStartTypeOptions}
          storePath={["simulationSettings", "agentStartType"]}
        />
        <SlimeStoreSlider
          label="Agent Deposit Rate"
          storePath={["simulationSettings", "agentDepositRate"]}
          min={SIMULATION_CONTROLS_BOUNDS.agentDepositRate!.min}
          max={SIMULATION_CONTROLS_BOUNDS.agentDepositRate!.max}
          step={0.1}
        />
        <SlimeStoreSlider
          label="Agent Sensor Degrees"
          storePath={["simulationSettings", "agentSensorDegrees"]}
          min={SIMULATION_CONTROLS_BOUNDS.agentSensorDegrees!.min}
          max={SIMULATION_CONTROLS_BOUNDS.agentSensorDegrees!.max}
          step={1}
        />
        <SlimeStoreSlider
          label="Agent Rotation Rate"
          storePath={["simulationSettings", "agentRotationRate"]}
          min={SIMULATION_CONTROLS_BOUNDS.agentRotationRate!.min}
          max={SIMULATION_CONTROLS_BOUNDS.agentRotationRate!.max}
          step={0.1}
        />
        <SlimeStoreSlider
          label="Agent Sensor Offset"
          storePath={["simulationSettings", "agentSensorOffset"]}
          min={SIMULATION_CONTROLS_BOUNDS.agentSensorOffset!.min}
          max={SIMULATION_CONTROLS_BOUNDS.agentSensorOffset!.max}
          step={0.1}
        />
        <SlimeStoreSlider
          label="Agent Sensor Width"
          storePath={["simulationSettings", "agentSensorWidth"]}
          min={SIMULATION_CONTROLS_BOUNDS.agentSensorWidth!.min}
          max={SIMULATION_CONTROLS_BOUNDS.agentSensorWidth!.max}
          step={0.1}
        />
        <SlimeStoreSlider
          label="Agent Step Size"
          storePath={["simulationSettings", "agentStepSize"]}
          min={SIMULATION_CONTROLS_BOUNDS.agentStepSize!.min}
          max={SIMULATION_CONTROLS_BOUNDS.agentStepSize!.max}
          step={0.1}
        />
        <SlimeStoreSlider
          label="Agent Crowd Avoidance"
          storePath={["simulationSettings", "agentCrowdAvoidance"]}
          min={SIMULATION_CONTROLS_BOUNDS.agentCrowdAvoidance!.min}
          max={SIMULATION_CONTROLS_BOUNDS.agentCrowdAvoidance!.max}
          step={0.01}
        />
        <SlimeStoreSlider
          label="Agent Wander Strength"
          storePath={["simulationSettings", "agentWanderStrength"]}
          min={SIMULATION_CONTROLS_BOUNDS.agentWanderStrength!.min}
          max={SIMULATION_CONTROLS_BOUNDS.agentWanderStrength!.max}
          step={0.1}
        />

        <SlimeStoreSelect
          label="Trail Display Texture Resolution"
          selectedOptionValue={simulationSettings.trailDisplayTextureResolution}
          options={trailDisplayTextureResolutionOptions}
          storePath={["simulationSettings", "trailDisplayTextureResolution"]}
        />
        <SlimeStoreSlider
          label="Trail Decay Rate"
          storePath={["simulationSettings", "trailDecayRate"]}
          min={SIMULATION_CONTROLS_BOUNDS.trailDecayRate!.min}
          max={SIMULATION_CONTROLS_BOUNDS.trailDecayRate!.max}
          step={0.01}
        />
        <SlimeStoreSlider
          label="Trail Diffuse Rate"
          storePath={["simulationSettings", "trailDiffuseRate"]}
          min={SIMULATION_CONTROLS_BOUNDS.trailDiffuseRate!.min}
          max={SIMULATION_CONTROLS_BOUNDS.trailDiffuseRate!.max}
          step={0.1}
        />
        <SlimeStoreSlider
          label="Trail Text Decay Rate"
          storePath={["simulationSettings", "trailTextDecayRate"]}
          min={SIMULATION_CONTROLS_BOUNDS.trailTextDecayRate!.min}
          max={SIMULATION_CONTROLS_BOUNDS.trailTextDecayRate!.max}
          step={0.01}
        />
        <SlimeStoreSlider
          label="Trail Text Diffuse Rate"
          storePath={["simulationSettings", "trailTextDiffuseRate"]}
          min={SIMULATION_CONTROLS_BOUNDS.trailTextDiffuseRate!.min}
          max={SIMULATION_CONTROLS_BOUNDS.trailTextDiffuseRate!.max}
          step={0.1}
        />
        <SlimeStoreSlider
          label="Trail Negative Space Decay Rate"
          storePath={["simulationSettings", "trailNegativeSpaceDecayRate"]}
          min={SIMULATION_CONTROLS_BOUNDS.trailNegativeSpaceDecayRate!.min}
          max={SIMULATION_CONTROLS_BOUNDS.trailNegativeSpaceDecayRate!.max}
          step={0.01}
        />
        <SlimeStoreSlider
          label="Trail Negative Space Diffuse Rate"
          storePath={["simulationSettings", "trailNegativeSpaceDiffuseRate"]}
          min={SIMULATION_CONTROLS_BOUNDS.trailNegativeSpaceDiffuseRate!.min}
          max={SIMULATION_CONTROLS_BOUNDS.trailNegativeSpaceDiffuseRate!.max}
          step={0.1}
        />
      </div>
    </FooterTabContent>
  );
}
