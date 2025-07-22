import { produce } from "immer";
import { useEffect } from "react";
import {
  AGENT_START_TYPE_DROPDOWN_OPTIONS,
  SIMULATION_CONTROLS_CONFIGS,
  SIMULATION_PRESETS,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type { TrailDisplayTextureResolution } from "../../types/types";
import CodeBlock from "../code-block/CodeBlock";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ControlButton from "./ControlButton";
import HeightScaledPixelValueDisplay from "./HeightScaledPixelValueDisplay";
import SlimeStoreRandomizationControl from "./SlimeStoreRandomizationControl";
import SlimeStoreSelectControl from "./SlimeStoreSelectControl";
import SlimeStoreSliderControl from "./SlimeStoreSliderControl";
import SlimeStoreSwitchControl from "./SlimeStoreSwitchControl";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

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

function handleSimulationPresetChange(value: string) {
  const preset = SIMULATION_PRESETS[value];
  if (!preset) return;

  useSlimeStore.setState(
    produce((state) => {
      state.simulationSettings.preset = value;
      Object.entries(preset).forEach(([key, val]) => {
        state.simulationSettings[key] = val;
      });
    }),
  );
}

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
        <AccordionControlsWrapper
          type="multiple"
          defaultValue={["quick-settings"]}
        >
          <AccordionControlsItem
            value="quick-settings"
            label="Quick Settings"
            labelHoverTabContentDisplay={[
              "Quick Settings",
              <div className="px-2 py-1">
                <ul className="list-inside list-disc">
                  <li>Randomize Simulation</li>
                  <li>Randomize Agent Settings</li>
                  <li>Randomize Trail Settings</li>
                </ul>
              </div>,
            ]}
          >
            <SlimeStoreSelectControl
              label="Simulation Presets"
              labelHoverTabContentDisplay={[
                "Simulation Presets",
                "Select a preset to quickly apply a set of simulation settings.",
              ]}
              baseInputId="simulation-presets-select"
              storePath={["simulationSettings", "preset"]}
              options={Object.keys(SIMULATION_PRESETS).map((key) => ({
                value: key,
                label: key,
              }))}
              onValueChange={handleSimulationPresetChange}
            />
            <ControlButton
              label="Randomize Simulation"
              labelHoverTabContentDisplay={[
                "Randomize Simulation",
                "Randomizes simulation settings based on enabled randomization options.",
              ]}
              baseId="randomize-simulation-button"
              onClick={() => {
                useSlimeStore.setState(
                  produce((state) => {
                    state.simulationSettings.agentsNeedRandomization = true;
                    state.simulationSettings.trailNeedsRandomization = true;
                  }),
                );
              }}
            />
            <ControlButton
              label="Randomize Agent Settings"
              labelHoverTabContentDisplay={[
                "Randomize Agent Settings",
                "Randomizes agent settings based on enabled randomization options.",
              ]}
              baseId="randomize-agent-settings-button"
              onClick={() => {
                useSlimeStore.setState(
                  produce((state) => {
                    state.simulationSettings.agentsNeedRandomization = true;
                  }),
                );
              }}
            />
            <ControlButton
              label="Randomize Trail Settings"
              labelHoverTabContentDisplay={[
                "Randomize Trail Settings",
                "Randomizes trail settings based on enabled randomization options.",
              ]}
              baseId="randomize-trail-settings-button"
              onClick={() => {
                useSlimeStore.setState(
                  produce((state) => {
                    state.simulationSettings.trailNeedsRandomization = true;
                  }),
                );
              }}
            />
          </AccordionControlsItem>

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
            <SlimeStoreSliderControl
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
            <SlimeStoreSwitchControl
              label="Rand. Enabled"
              labelHoverTabContentDisplay={[
                "Randomization Enabled",
                "Enables the simulation to randomize its parameters at set intervals. Interval is set using the 'Randomization Interval' slider.",
              ]}
              baseId="randomization-enabled-switch"
              storePath={["simulationSettings", "randomizationEnabled"]}
            />
            <SlimeStoreSliderControl
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
            <SlimeStoreSelectControl
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
            <SlimeStoreSelectControl
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
            <SlimeStoreSliderControl
              label="Clock Attraction"
              labelHoverTabContentDisplay={[
                "Agent Clock Attraction",
                "Controls how strongly the agents are attracted to the clock, even if no pheromones are present.",
              ]}
              baseInputId="agent-clock-attraction-slider"
              min={SIMULATION_CONTROLS_CONFIGS.agentClockAttraction!.min}
              max={SIMULATION_CONTROLS_CONFIGS.agentClockAttraction!.max}
              step={SIMULATION_CONTROLS_CONFIGS.agentClockAttraction!.step}
              storePath={["simulationSettings", "agentClockAttraction"]}
            />
            <SlimeStoreSliderControl
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
            <SlimeStoreSliderControl
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
            <SlimeStoreSliderControl
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
            <SlimeStoreSliderControl
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
            <SlimeStoreSliderControl
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
            <SlimeStoreSliderControl
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
            <SlimeStoreSliderControl
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
            <SlimeStoreSliderControl
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
            <SlimeStoreSliderControl
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
            <SlimeStoreSelectControl
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
            <SlimeStoreSliderControl
              label="Clock Decay Rate"
              baseInputId="trail-clock-decay-rate-slider"
              min={SIMULATION_CONTROLS_CONFIGS.trailClockDecayRate!.min}
              max={SIMULATION_CONTROLS_CONFIGS.trailClockDecayRate!.max}
              step={SIMULATION_CONTROLS_CONFIGS.trailClockDecayRate!.step}
              storePath={["simulationSettings", "trailClockDecayRate"]}
            />
            <SlimeStoreSliderControl
              label="Clock Diffuse Rate"
              baseInputId="trail-clock-diffuse-rate-slider"
              min={SIMULATION_CONTROLS_CONFIGS.trailClockDiffuseRate!.min}
              max={SIMULATION_CONTROLS_CONFIGS.trailClockDiffuseRate!.max}
              step={SIMULATION_CONTROLS_CONFIGS.trailClockDiffuseRate!.step}
              storePath={["simulationSettings", "trailClockDiffuseRate"]}
            />
            <SlimeStoreSliderControl
              label="Background Decay Rate"
              baseInputId="trail-background-decay-rate-slider"
              min={SIMULATION_CONTROLS_CONFIGS.trailBackgroundDecayRate!.min}
              max={SIMULATION_CONTROLS_CONFIGS.trailBackgroundDecayRate!.max}
              step={SIMULATION_CONTROLS_CONFIGS.trailBackgroundDecayRate!.step}
              storePath={["simulationSettings", "trailBackgroundDecayRate"]}
            />
            <SlimeStoreSliderControl
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
          <AccordionControlsWrapper type="multiple">
            <AccordionControlsItem
              value="agent-randomization-settings"
              label="Agent Randomization Settings"
              labelHoverTabContentDisplay={[
                "Agent Randomization Settings",
                "Controls the randomization settings for agents.",
              ]}
            >
              <SlimeStoreRandomizationControl
                label="Clock Attraction"
                labelHoverTabContentDisplay={["Clock Attraction"]}
                baseId="clock-attraction-randomization-control"
                controlName={"agentClockAttraction"}
              />
              <SlimeStoreRandomizationControl
                label="Clock Deposit Rate"
                labelHoverTabContentDisplay={["Clock Deposit Rate"]}
                baseId="clock-deposit-rate-randomization-control"
                controlName={"agentClockDepositRate"}
              />
              <SlimeStoreRandomizationControl
                label="Background Deposit Rate"
                labelHoverTabContentDisplay={["Background Deposit Rate"]}
                baseId="background-deposit-rate-randomization-control"
                controlName={"agentBackgroundDepositRate"}
              />
              <SlimeStoreRandomizationControl
                label="Sensor Degrees"
                labelHoverTabContentDisplay={["Sensor Degrees"]}
                baseId="sensor-degrees-randomization-control"
                controlName={"agentSensorDegrees"}
              />
              <SlimeStoreRandomizationControl
                label="Rotation Rate"
                labelHoverTabContentDisplay={["Rotation Rate"]}
                baseId="rotation-rate-randomization-control"
                controlName={"agentRotationRate"}
              />
              <SlimeStoreRandomizationControl
                label="Sensor Offset"
                labelHoverTabContentDisplay={["Sensor Offset"]}
                baseId="sensor-offset-randomization-control"
                controlName={"agentSensorOffset"}
              />
              <SlimeStoreRandomizationControl
                label="Sensor Width"
                labelHoverTabContentDisplay={["Sensor Width"]}
                baseId="sensor-width-randomization-control"
                controlName={"agentSensorWidth"}
              />
              <SlimeStoreRandomizationControl
                label="Step Size"
                labelHoverTabContentDisplay={["Step Size"]}
                baseId="step-size-randomization-control"
                controlName={"agentStepSize"}
              />
              <SlimeStoreRandomizationControl
                label="Crowd Avoidance"
                labelHoverTabContentDisplay={["Crowd Avoidance"]}
                baseId="crowd-avoidance-randomization-control"
                controlName={"agentCrowdAvoidance"}
              />
              <SlimeStoreRandomizationControl
                label="Wander Strength"
                labelHoverTabContentDisplay={["Wander Strength"]}
                baseId="wander-strength-randomization-control"
                controlName={"agentWanderStrength"}
              />
            </AccordionControlsItem>
          </AccordionControlsWrapper>
          <AccordionControlsWrapper type="multiple">
            <AccordionControlsItem
              value="trail-randomization-settings"
              label="Trail Randomization Settings"
              labelHoverTabContentDisplay={[
                "Trail Randomization Settings",
                "Controls the randomization settings for trails.",
              ]}
            >
              <SlimeStoreRandomizationControl
                label="Clock Decay Rate"
                labelHoverTabContentDisplay={["Clock Decay Rate"]}
                baseId="clock-decay-rate-randomization-control"
                controlName={"trailClockDecayRate"}
              />
              <SlimeStoreRandomizationControl
                label="Clock Diffuse Rate"
                labelHoverTabContentDisplay={["Clock Diffuse Rate"]}
                baseId="clock-diffuse-rate-randomization-control"
                controlName={"trailClockDiffuseRate"}
              />
              <SlimeStoreRandomizationControl
                label="Background Decay Rate"
                labelHoverTabContentDisplay={["Background Decay Rate"]}
                baseId="background-decay-rate-randomization-control"
                controlName={"trailBackgroundDecayRate"}
              />
              <SlimeStoreRandomizationControl
                label="Background Diffuse Rate"
                labelHoverTabContentDisplay={["Background Diffuse Rate"]}
                baseId="background-diffuse-rate-randomization-control"
                controlName={"trailBackgroundDiffuseRate"}
              />
            </AccordionControlsItem>
          </AccordionControlsWrapper>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
