import { produce } from "immer";
import { useEffect } from "react";
import {
  AGENT_START_TYPE_DROPDOWN_OPTIONS,
  SIMULATION_CONTROLS_CONFIGS,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type { TrailDisplayTextureResolution } from "../../types/types";
import CodeBlock from "../code-block/CodeBlock";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import HeightScaledPixelValueDisplay from "./HeightScaledPixelValueDisplay";
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
// type SimulationQualityOption = {
//   value: SimulationQuality;
//   label: string;
// };
// const simulationQualityOptions: SimulationQualityOption[] = [
//   { value: "Very Low", label: "Very Low" },
//   { value: "Low", label: "Low" },
//   { value: "Medium", label: "Medium" },
//   { value: "High", label: "High" },
//   { value: "Very High", label: "Very High" },
//   { value: "Custom", label: "Custom" },
// ] as const;

/**
 * Agent Densities
 */
type AgentDensityOption = {
  value: string;
  label: string;
};
const agentDensityOptions: AgentDensityOption[] = [
  { value: "0.01", label: "1%" },
  { value: "0.05", label: "5%" },
  { value: "0.1", label: "10%" },
  { value: "0.2", label: "20%" },
  { value: "0.25", label: "25%" },
  { value: "0.3", label: "30%" },
  { value: "0.4", label: "40%" },
  { value: "0.5", label: "50%" },
  { value: "0.6", label: "60%" },
  { value: "0.7", label: "70%" },
  { value: "0.8", label: "80%" },
  { value: "0.9", label: "90%" },
];

/**
 * Trail Display Texture Resolution
 */
type TrailDisplayTextureResolutionOption = {
  value: TrailDisplayTextureResolution;
  label: string;
};
const trailDisplayTextureResolutionOptions: TrailDisplayTextureResolutionOption[] =
  [
    { value: "426 x 240", label: "426 x 240" },
    { value: "640 x 360", label: "640 x 360" },
    { value: "854 x 480", label: "854 x 480" },
    { value: "1280 x 720", label: "1280 x 720" },
    { value: "1920 x 1080", label: "1920 x 1080" },
    { value: "2560 x 1440", label: "2560 x 1440" },
    { value: "3840 x 2160", label: "3840 x 2160" },
  ] as const;

export default function SimulationControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);

  const simulationControlsLabelHoverTabContentDisplay = [
    "Simulation Controls",
    "Controls related to the simulation.",
  ];

  useEffect(() => {
    if (selectedTab !== "simulation-controls") return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaHtmlContent =
          simulationControlsLabelHoverTabContentDisplay;
        state.controlsState.displayAreaContentType = "html";
        state.controlsState.displayAreaContentName = null;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  function handleAgentDensityChange(value: string) {
    const displayTextureWidth =
      useSlimeStore.getState().simulationSettings.displayTextureWidth;
    const displayTextureHeight =
      useSlimeStore.getState().simulationSettings.displayTextureHeight;
    if (!displayTextureWidth || !displayTextureHeight) return;
    const gpuTextureSize = Math.floor(
      Math.sqrt(displayTextureWidth * displayTextureHeight * Number(value)),
    );
    useSlimeStore.setState(
      produce((state) => {
        state.simulationSettings.agentDensity = Number(value);
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
          {/* <AccordionControlsItem
            value="quick-settings"
            label="Quick Settings"
            labelHoverTabContentDisplay={[
              "Quick Settings",
              <div className="px-2 py-1">
                <ul className="list-inside list-disc">
                  <li>Simulation Quality</li>
                </ul>
              </div>,
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
          </AccordionControlsItem> */}

          <AccordionControlsItem
            value="simulation-settings"
            label="Simulation Settings"
            labelHoverTabContentDisplay={[
              "Simulation Settings",
              <div className="px-2 py-1">
                <ul className="list-inside list-disc">
                  <li>Simulation Speed</li>
                  <li>Randomization Enabled</li>
                  <li>Randomization Interval</li>
                </ul>
              </div>,
            ]}
          >
            <SlimeStoreSlider
              label="Simulation Speed"
              baseInputId="simulation-speed-slider"
              min={SIMULATION_CONTROLS_CONFIGS.speed!.min}
              max={SIMULATION_CONTROLS_CONFIGS.speed!.max}
              step={SIMULATION_CONTROLS_CONFIGS.speed!.step}
              storePath={["simulationSettings", "speed"]}
              labelHoverTabContentDisplay={[
                "Simulation Speed",
                "Controls the speed of the entire simulation.",
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
              labelHoverTabContentDisplay={[
                "Randomization Interval",
                "Controls how often the simulation randomizes its parameters. Interval is in seconds.",
              ]}
              baseInputId="randomization-interval-slider"
              min={SIMULATION_CONTROLS_CONFIGS.randomizationInterval!.min}
              max={SIMULATION_CONTROLS_CONFIGS.randomizationInterval!.max}
              step={SIMULATION_CONTROLS_CONFIGS.randomizationInterval!.step}
              storePath={["simulationSettings", "randomizationInterval"]}
            />
          </AccordionControlsItem>

          <AccordionControlsItem
            value="agent-settings"
            label="Agent Settings"
            labelHoverTabContentDisplay={[
              "Agent Settings",
              <div className="px-2 py-1">
                <CodeBlock>Agents</CodeBlock> move around within the simulation,
                depositing "pheromones" on the trail layer while sensing and
                reacting to pheromone concentrations left by other agents.
                <br />
                <br />
                This accordian contains the following settings controlling the
                agents:
                <ul className="list-inside list-disc">
                  <li>Density</li>
                  <li>Start Type</li>
                  <li>Deposit Rate</li>
                  <li>Sensor Degrees</li>
                  <li>Rotation Rate</li>
                  <li>Sensor Offset</li>
                  <li>Sensor Width</li>
                  <li>Step Size</li>
                  <li>Crowd Avoidance</li>
                  <li>Wander Strength</li>
                </ul>
              </div>,
            ]}
          >
            <SlimeStoreSelect
              label="Density"
              labelHoverTabContentDisplay={[
                "Agent Density",
                "Controls the density of agents in the simulation. Higher values will increase the load on the GPU. Please note: a higher agent density won't always result in a better simulation since the agents need room to move around.",
              ]}
              baseInputId="agent-density-select"
              placeholder="Agent Density"
              storePath={["simulationSettings", "agentDensity"]}
              options={agentDensityOptions}
              onValueChange={handleAgentDensityChange}
              valueType="number"
            />
            <SlimeStoreSelect
              label="Start Type"
              labelHoverTabContentDisplay={[
                "Agent Start Type",
                'Controls how agents are spawned into the simulation. "Fill" will spawn agents evenly across the display area, which can be good for testing how different settings affect the clock display. Other starting patterns may be more interesting, but may not fill the clock display evenly at first.',
              ]}
              baseInputId="agent-start-type-select"
              placeholder="Agent Start Type"
              storePath={["simulationSettings", "agentStartType"]}
              options={AGENT_START_TYPE_DROPDOWN_OPTIONS}
              valueType="number"
            />
            <SlimeStoreSlider
              label="Clock Deposit Rate"
              labelHoverTabContentDisplay={[
                "Agent Clock Deposit Rate",
                "Controls how much pheromone is deposited by each agent when taking an uncrowded step inside the clock display.",
              ]}
              baseInputId="agent-clock-deposit-rate-slider"
              min={SIMULATION_CONTROLS_CONFIGS.agentClockDepositRate!.min}
              max={SIMULATION_CONTROLS_CONFIGS.agentClockDepositRate!.max}
              step={SIMULATION_CONTROLS_CONFIGS.agentClockDepositRate!.step}
              storePath={["simulationSettings", "agentClockDepositRate"]}
            />
            <SlimeStoreSlider
              label="Background Deposit Rate"
              labelHoverTabContentDisplay={[
                "Agent Background Deposit Rate",
                "Controls how much pheromone is deposited by each agent when taking an uncrowded step outside the clock display.",
              ]}
              baseInputId="agent-background-deposit-rate-slider"
              min={SIMULATION_CONTROLS_CONFIGS.agentBackgroundDepositRate!.min}
              max={SIMULATION_CONTROLS_CONFIGS.agentBackgroundDepositRate!.max}
              step={
                SIMULATION_CONTROLS_CONFIGS.agentBackgroundDepositRate!.step
              }
              storePath={["simulationSettings", "agentBackgroundDepositRate"]}
            />
            <SlimeStoreSlider
              label="Sensor Degrees"
              labelHoverTabContentDisplay={[
                "Agent Sensor Degrees",
                "Controls how far to the left and right each agent's sensors are positioned. TODO: Describe the effect of the min/max values.",
              ]}
              baseInputId="agent-sensor-degrees-slider"
              min={SIMULATION_CONTROLS_CONFIGS.agentSensorDegrees!.min}
              max={SIMULATION_CONTROLS_CONFIGS.agentSensorDegrees!.max}
              step={SIMULATION_CONTROLS_CONFIGS.agentSensorDegrees!.step}
              storePath={["simulationSettings", "agentSensorDegrees"]}
            />
            <SlimeStoreSlider
              label="Rotation Rate"
              labelHoverTabContentDisplay={[
                "Agent Rotation Rate",
                "Controls how quickly each agent can rotate. TODO: Describe the effect of the min/max values.",
              ]}
              baseInputId="agent-rotation-rate-slider"
              min={SIMULATION_CONTROLS_CONFIGS.agentRotationRate!.min}
              max={SIMULATION_CONTROLS_CONFIGS.agentRotationRate!.max}
              step={SIMULATION_CONTROLS_CONFIGS.agentRotationRate!.step}
              storePath={["simulationSettings", "agentRotationRate"]}
            />
            <SlimeStoreSlider
              label="Sensor Offset"
              labelHoverTabContentDisplay={[
                "Agent Sensor Offset",
                <HeightScaledPixelValueDisplay
                  storePath={["simulationSettings", "agentSensorOffset"]}
                  description="Controls how far each agent's sensors are from their center. TODO: Explain what that means. For consistency across resolutions, the slider value is a percentage of the display height."
                />,
              ]}
              baseInputId="agent-sensor-offset-slider"
              min={SIMULATION_CONTROLS_CONFIGS.agentSensorOffset!.min}
              max={SIMULATION_CONTROLS_CONFIGS.agentSensorOffset!.max}
              step={SIMULATION_CONTROLS_CONFIGS.agentSensorOffset!.step}
              storePath={["simulationSettings", "agentSensorOffset"]}
            />
            <SlimeStoreSlider
              label="Sensor Width"
              labelHoverTabContentDisplay={[
                "Agent Sensor Width",
                <HeightScaledPixelValueDisplay
                  storePath={["simulationSettings", "agentSensorWidth"]}
                  description="The width of each agent's sensors. TODO: Explain what that means. For consistency across resolutions, the slider value is a percentage of the display height."
                />,
              ]}
              baseInputId="agent-sensor-width-slider"
              min={SIMULATION_CONTROLS_CONFIGS.agentSensorWidth!.min}
              max={SIMULATION_CONTROLS_CONFIGS.agentSensorWidth!.max}
              step={SIMULATION_CONTROLS_CONFIGS.agentSensorWidth!.step}
              storePath={["simulationSettings", "agentSensorWidth"]}
            />
            <SlimeStoreSlider
              label="Step Size"
              labelHoverTabContentDisplay={[
                "Agent Step Size",
                <HeightScaledPixelValueDisplay
                  storePath={["simulationSettings", "agentStepSize"]}
                  description="The distance each agent moves forward in a single step. For consistency across resolutions, the slider value is a percentage of the display height."
                />,
              ]}
              baseInputId="agent-step-size-slider"
              min={SIMULATION_CONTROLS_CONFIGS.agentStepSize!.min}
              max={SIMULATION_CONTROLS_CONFIGS.agentStepSize!.max}
              step={SIMULATION_CONTROLS_CONFIGS.agentStepSize!.step}
              storePath={["simulationSettings", "agentStepSize"]}
            />
            <SlimeStoreSlider
              label="Crowd Avoidance"
              labelHoverTabContentDisplay={[
                "Agent Crowd Avoidance",
                "Controls how much each agent tries to avoid crowds. TODO: Describe this better; it's an avoidance, but also changes how the pheromones are deposited.",
              ]}
              baseInputId="agent-crowd-avoidance-slider"
              min={SIMULATION_CONTROLS_CONFIGS.agentCrowdAvoidance!.min}
              max={SIMULATION_CONTROLS_CONFIGS.agentCrowdAvoidance!.max}
              step={SIMULATION_CONTROLS_CONFIGS.agentCrowdAvoidance!.step}
              storePath={["simulationSettings", "agentCrowdAvoidance"]}
            />
            <SlimeStoreSlider
              label="Wander Strength"
              labelHoverTabContentDisplay={[
                "Agent Wander Strength",
                "Controls the strength of the random wandering behavior of each agent.",
              ]}
              baseInputId="agent-wander-strength-slider"
              min={SIMULATION_CONTROLS_CONFIGS.agentWanderStrength!.min}
              max={SIMULATION_CONTROLS_CONFIGS.agentWanderStrength!.max}
              step={SIMULATION_CONTROLS_CONFIGS.agentWanderStrength!.step}
              storePath={["simulationSettings", "agentWanderStrength"]}
            />
          </AccordionControlsItem>

          <AccordionControlsItem
            value="trail-settings"
            label="Trail Settings"
            labelHoverTabContentDisplay={[
              "Trail Settings",
              <div className="px-2 py-1">
                The <CodeBlock>trail</CodeBlock> layer is where the agents
                deposit pheromones, which are then sensed by other agents.
                <br />
                <br />
                This accordian contains the following settings controlling the
                trails:
                <ul className="list-inside list-disc">
                  <li>Display Texture Resolution</li>
                  <li>Decay Rate</li>
                  <li>Diffuse Rate</li>
                  <li>Text Decay Rate</li>
                  <li>Text Diffuse Rate</li>
                  <li>Negative Space Decay Rate</li>
                  <li>Negative Space Diffuse Rate</li>
                </ul>
              </div>,
            ]}
          >
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
              label="Clock Decay Rate"
              baseInputId="trail-clock-decay-rate-slider"
              min={SIMULATION_CONTROLS_CONFIGS.trailClockDecayRate!.min}
              max={SIMULATION_CONTROLS_CONFIGS.trailClockDecayRate!.max}
              step={SIMULATION_CONTROLS_CONFIGS.trailClockDecayRate!.step}
              storePath={["simulationSettings", "trailClockDecayRate"]}
            />
            <SlimeStoreSlider
              label="Clock Diffuse Rate"
              baseInputId="trail-clock-diffuse-rate-slider"
              min={SIMULATION_CONTROLS_CONFIGS.trailClockDiffuseRate!.min}
              max={SIMULATION_CONTROLS_CONFIGS.trailClockDiffuseRate!.max}
              step={SIMULATION_CONTROLS_CONFIGS.trailClockDiffuseRate!.step}
              storePath={["simulationSettings", "trailClockDiffuseRate"]}
            />
            <SlimeStoreSlider
              label="Background Decay Rate"
              baseInputId="trail-background-decay-rate-slider"
              min={SIMULATION_CONTROLS_CONFIGS.trailBackgroundDecayRate!.min}
              max={SIMULATION_CONTROLS_CONFIGS.trailBackgroundDecayRate!.max}
              step={SIMULATION_CONTROLS_CONFIGS.trailBackgroundDecayRate!.step}
              storePath={["simulationSettings", "trailBackgroundDecayRate"]}
            />
            <SlimeStoreSlider
              label="Background Diffuse Rate"
              baseInputId="trail-background-diffuse-rate-slider"
              min={SIMULATION_CONTROLS_CONFIGS.trailBackgroundDiffuseRate!.min}
              max={SIMULATION_CONTROLS_CONFIGS.trailBackgroundDiffuseRate!.max}
              step={
                SIMULATION_CONTROLS_CONFIGS.trailBackgroundDiffuseRate!.step
              }
              storePath={["simulationSettings", "trailBackgroundDiffuseRate"]}
            />
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
