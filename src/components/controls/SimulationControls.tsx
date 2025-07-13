import { produce } from "immer";
import { useEffect } from "react";
import {
  AGENT_START_TYPE_DROPDOWN_OPTIONS,
  SIMULATION_CONTROLS_BOUNDS,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  AgentCount,
  SimulationQuality,
  TrailDisplayTextureResolution,
} from "../../types/types";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import SlimeStoreSelect from "./SlimeStoreSelect";
import SlimeStoreSlider from "./SlimeStoreSlider";
import SlimeStoreSwitch from "./SlimeStoreSwitch";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

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

export default function SimulationControls() {
  const controlsState = useSlimeStore((state) => state.controlsState);

  const simulationControlsLabelHoverTabContentDisplay = [
    "Simulation Controls",
    "Controls related to the simulation.",
  ];

  useEffect(() => {
    if (controlsState.selectedTab !== "simulation-controls") return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaHtmlContent =
          simulationControlsLabelHoverTabContentDisplay;
        state.controlsState.displayAreaContentType = "html";
        state.controlsState.displayAreaContentName = null;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlsState.selectedTab]);

  function handleAgentCountChange(value: string) {
    useSlimeStore.setState(
      produce((state) => {
        const gpuTextureSize = Math.floor(Math.sqrt(Number(value)));
        state.simulationSettings.agentCount = value;
        state.simulationSettings.gpuTextureWidth = gpuTextureSize;
        state.simulationSettings.gpuTextureHeight = gpuTextureSize;
      }),
    );
  }

  function handleDisplayTextureResolutionChange(value: string) {
    useSlimeStore.setState(
      produce((state) => {
        const [width, height] = value.split(" x ").map(Number);
        state.simulationSettings.trailDisplayTextureResolution = value;
        state.simulationSettings.displayTextureWidth = width;
        state.simulationSettings.displayTextureHeight = height;
      }),
    );
  }
  return (
    <TabContentContainer tabsValue="simulation-controls">
      <TabContentScrollArea title="Simulation">
        <AccordionControlsWrapper type="multiple">
          <AccordionControlsItem
            value="quick-settings"
            label="Quick Settings"
            labelHoverTabContentDisplay={[
              "Quick Settings",
              "Contains quick access to common simulation settings.",
            ]}
          >
            <SlimeStoreSelect
              label="Simulation Quality"
              labelHoverTabContentDisplay={[
                "Simulation Quality",
                "Sets multiple settings at once. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
              ]}
              baseInputId="simulation-quality-select"
              placeholder="Simulation Quality"
              storePath={["simulationSettings", "quality"]}
              options={simulationQualityOptions}
            />
          </AccordionControlsItem>

          <AccordionControlsItem
            value="simulation-settings"
            label="Simulation Settings"
          >
            <SlimeStoreSlider
              label="Simulation Speed"
              baseInputId="simulation-speed-slider"
              min={SIMULATION_CONTROLS_BOUNDS.speed!.min}
              max={SIMULATION_CONTROLS_BOUNDS.speed!.max}
              step={0.1}
              storePath={["simulationSettings", "speed"]}
              labelHoverTabContentDisplay={[
                "Simulation Speed",
                "Controls the speed of the simulation.",
              ]}
            />
            <SlimeStoreSwitch
              label="Rand. Enabled"
              labelHoverTabContentDisplay={[
                "Randomization Enabled",
                "Enables the simulation to randomize its parameters at set intervals. Interval is set using the 'Randomization Interval' slider.",
              ]}
              baseId="randomization-enabled-switch"
              storePath={["simulationSettings", "randomizationEnabled"]}
            />
            <SlimeStoreSlider
              label="Randomization Interval"
              baseInputId="randomization-interval-slider"
              min={SIMULATION_CONTROLS_BOUNDS.randomizationInterval!.min}
              max={SIMULATION_CONTROLS_BOUNDS.randomizationInterval!.max}
              step={10}
              storePath={["simulationSettings", "randomizationInterval"]}
            />
          </AccordionControlsItem>

          <AccordionControlsItem value="agent-settings" label="Agent Settings">
            <SlimeStoreSelect
              label="Count"
              baseInputId="agent-count-select"
              placeholder="Agent Count"
              storePath={["simulationSettings", "agentCount"]}
              options={agentCountOptions}
              onValueChange={handleAgentCountChange}
            />
            <SlimeStoreSelect
              label="Start Type"
              baseInputId="agent-start-type-select"
              placeholder="Agent Start Type"
              storePath={["simulationSettings", "agentStartType"]}
              options={AGENT_START_TYPE_DROPDOWN_OPTIONS}
              valueType="number"
            />
            <SlimeStoreSlider
              label="Deposit Rate"
              baseInputId="agent-deposit-rate-slider"
              min={SIMULATION_CONTROLS_BOUNDS.agentDepositRate!.min}
              max={SIMULATION_CONTROLS_BOUNDS.agentDepositRate!.max}
              step={0.1}
              storePath={["simulationSettings", "agentDepositRate"]}
            />
            <SlimeStoreSlider
              label="Sensor Degrees"
              baseInputId="agent-sensor-degrees-slider"
              min={SIMULATION_CONTROLS_BOUNDS.agentSensorDegrees!.min}
              max={SIMULATION_CONTROLS_BOUNDS.agentSensorDegrees!.max}
              step={1}
              storePath={["simulationSettings", "agentSensorDegrees"]}
            />
            <SlimeStoreSlider
              label="Rotation Rate"
              baseInputId="agent-rotation-rate-slider"
              min={SIMULATION_CONTROLS_BOUNDS.agentRotationRate!.min}
              max={SIMULATION_CONTROLS_BOUNDS.agentRotationRate!.max}
              step={0.1}
              storePath={["simulationSettings", "agentRotationRate"]}
            />
            <SlimeStoreSlider
              label="Sensor Offset"
              baseInputId="agent-sensor-offset-slider"
              min={SIMULATION_CONTROLS_BOUNDS.agentSensorOffset!.min}
              max={SIMULATION_CONTROLS_BOUNDS.agentSensorOffset!.max}
              step={0.1}
              storePath={["simulationSettings", "agentSensorOffset"]}
            />
            <SlimeStoreSlider
              label="Sensor Width"
              baseInputId="agent-sensor-width-slider"
              min={SIMULATION_CONTROLS_BOUNDS.agentSensorWidth!.min}
              max={SIMULATION_CONTROLS_BOUNDS.agentSensorWidth!.max}
              step={0.1}
              storePath={["simulationSettings", "agentSensorWidth"]}
            />
            <SlimeStoreSlider
              label="Step Size"
              baseInputId="agent-step-size-slider"
              min={SIMULATION_CONTROLS_BOUNDS.agentStepSize!.min}
              max={SIMULATION_CONTROLS_BOUNDS.agentStepSize!.max}
              step={0.1}
              storePath={["simulationSettings", "agentStepSize"]}
            />
            <SlimeStoreSlider
              label="Crowd Avoidance"
              baseInputId="agent-crowd-avoidance-slider"
              min={SIMULATION_CONTROLS_BOUNDS.agentCrowdAvoidance!.min}
              max={SIMULATION_CONTROLS_BOUNDS.agentCrowdAvoidance!.max}
              step={0.01}
              storePath={["simulationSettings", "agentCrowdAvoidance"]}
            />
            <SlimeStoreSlider
              label="Wander Strength"
              baseInputId="agent-wander-strength-slider"
              min={SIMULATION_CONTROLS_BOUNDS.agentWanderStrength!.min}
              max={SIMULATION_CONTROLS_BOUNDS.agentWanderStrength!.max}
              step={0.1}
              storePath={["simulationSettings", "agentWanderStrength"]}
            />
          </AccordionControlsItem>

          <AccordionControlsItem value="trail-settings" label="Trail Settings">
            <SlimeStoreSelect
              label="Display Texture Resolution"
              baseInputId="trail-display-texture-resolution-select"
              placeholder="Trail Display Texture Resolution"
              storePath={[
                "simulationSettings",
                "trailDisplayTextureResolution",
              ]}
              options={trailDisplayTextureResolutionOptions}
              onValueChange={handleDisplayTextureResolutionChange}
            />
            <SlimeStoreSlider
              label="Decay Rate"
              baseInputId="trail-decay-rate-slider"
              min={SIMULATION_CONTROLS_BOUNDS.trailDecayRate!.min}
              max={SIMULATION_CONTROLS_BOUNDS.trailDecayRate!.max}
              step={0.01}
              storePath={["simulationSettings", "trailDecayRate"]}
            />
            <SlimeStoreSlider
              label="Diffuse Rate"
              baseInputId="trail-diffuse-rate-slider"
              min={SIMULATION_CONTROLS_BOUNDS.trailDiffuseRate!.min}
              max={SIMULATION_CONTROLS_BOUNDS.trailDiffuseRate!.max}
              step={0.1}
              storePath={["simulationSettings", "trailDiffuseRate"]}
            />
            <SlimeStoreSlider
              label="Text Decay Rate"
              baseInputId="trail-text-decay-rate-slider"
              min={SIMULATION_CONTROLS_BOUNDS.trailTextDecayRate!.min}
              max={SIMULATION_CONTROLS_BOUNDS.trailTextDecayRate!.max}
              step={0.01}
              storePath={["simulationSettings", "trailTextDecayRate"]}
            />
            <SlimeStoreSlider
              label="Text Diffuse Rate"
              baseInputId="trail-text-diffuse-rate-slider"
              min={SIMULATION_CONTROLS_BOUNDS.trailTextDiffuseRate!.min}
              max={SIMULATION_CONTROLS_BOUNDS.trailTextDiffuseRate!.max}
              step={0.1}
              storePath={["simulationSettings", "trailTextDiffuseRate"]}
            />
            <SlimeStoreSlider
              label="Negative Space Decay Rate"
              baseInputId="trail-negative-space-decay-rate-slider"
              min={SIMULATION_CONTROLS_BOUNDS.trailNegativeSpaceDecayRate!.min}
              max={SIMULATION_CONTROLS_BOUNDS.trailNegativeSpaceDecayRate!.max}
              step={0.01}
              storePath={["simulationSettings", "trailNegativeSpaceDecayRate"]}
            />
            <SlimeStoreSlider
              label="Negative Space Diffuse Rate"
              baseInputId="trail-negative-space-diffuse-rate-slider"
              min={
                SIMULATION_CONTROLS_BOUNDS.trailNegativeSpaceDiffuseRate!.min
              }
              max={
                SIMULATION_CONTROLS_BOUNDS.trailNegativeSpaceDiffuseRate!.max
              }
              step={0.1}
              storePath={[
                "simulationSettings",
                "trailNegativeSpaceDiffuseRate",
              ]}
            />
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
