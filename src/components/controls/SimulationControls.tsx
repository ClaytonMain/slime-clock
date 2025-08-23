import { produce } from "immer";
import { useEffect } from "react";
import {
  AGENT_START_TYPE_DROPDOWN_OPTIONS,
  DISPLAY_TEXTURE_ASPECT_RATIO_OPTIONS,
  SIMULATION_CONTROLS_CONFIGS,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import { type DisplayTextureAspectRatio } from "../../types/types";
import * as UTILS from "../../utils/utils.tsx";
import CodeBlock from "../code-block/CodeBlock";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ButtonControlGroup from "./ButtonControlGroup.tsx";
import HeightScaledPixelValueDisplay from "./HeightScaledPixelValueDisplay";
import SettingsLoadSaveControl from "./SettingsLoadSaveControl.tsx";
import SlimeStoreSelectControl from "./SlimeStoreSelectControl";
import SlimeStoreSliderControl from "./SlimeStoreSliderControl";
import SlimeStoreSwitchControl from "./SlimeStoreSwitchControl";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

export default function SimulationControls() {
  const sortedPresets = useSlimeStore((state) => state.sortedPresets);
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

  // Slider function
  function handleAgentDensityChange(value: number[]) {
    console.log("handleAgentDensityChange", value);
    const displayTextureWidth =
      useSlimeStore.getState().simulationSettings.displayTextureWidth;
    const displayTextureHeight =
      useSlimeStore.getState().simulationSettings.displayTextureHeight;
    if (!displayTextureWidth || !displayTextureHeight) return;
    const gpuTextureSize = Math.floor(
      Math.sqrt(displayTextureWidth * displayTextureHeight * Number(value[0])),
    );
    useSlimeStore.setState(
      produce((state) => {
        state.simulationSettings.agentDensity = Number(value[0]);
        state.simulationSettings.gpuTextureWidth = gpuTextureSize;
        state.simulationSettings.gpuTextureHeight = gpuTextureSize;
        state.simulationSettings.simulationNeedsRestart = true;
      }),
    );
  }

  function handleDisplayTextureAspectRatioChange(value: string) {
    const displayTextureTargetQuality =
      useSlimeStore.getState().simulationSettings.displayTextureTargetQuality;
    const resolution = UTILS.getDisplayTextureResolution(
      value as DisplayTextureAspectRatio,
      displayTextureTargetQuality,
    );
    useSlimeStore.setState(
      produce((state) => {
        state.simulationSettings.displayTextureAspectRatio = value;
        state.simulationSettings.displayTextureWidth = resolution.width;
        state.simulationSettings.displayTextureHeight = resolution.height;
      }),
    );
  }

  // function handleDisplayTextureTargetQualityChange(value: number[]) {
  //   const displayTextureAspectRatio =
  //     useSlimeStore.getState().simulationSettings.displayTextureAspectRatio;
  //   const resolution = UTILS.getDisplayTextureResolution(
  //     displayTextureAspectRatio,
  //     value[0],
  //   );
  //   useSlimeStore.setState(
  //     produce((state) => {
  //       state.simulationSettings.displayTextureTargetQuality = value[0];
  //       state.simulationSettings.displayTextureWidth = resolution.width;
  //       state.simulationSettings.displayTextureHeight = resolution.height;
  //     }),
  //   );
  // }

  return (
    <TabContentContainer tabsValue="simulation-controls">
      <TabContentScrollArea title="Simulation">
        <AccordionControlsWrapper
          accordionId="simulation-controls-accordion"
          type="multiple"
          defaultValue={["quick-settings", "simulation-controls-presets"]}
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
            <ButtonControlGroup
              label="Quick Rand."
              labelHoverTabContentDisplay={[
                "Quick Randomization",
                "Allows you to quickly randomize the simulation settings. You can configure the randomization bounds for each setting in the 'Randomization Controls' tab (the dice icon below).",
              ]}
              buttonConfigs={[
                {
                  label: "Randomize Simulation",
                  baseId: "randomize-simulation-button",
                  onClick: () => {
                    useSlimeStore.setState(
                      produce((state) => {
                        state.randomizationState.agentRandomizationRequestedAt =
                          Date.now();
                        state.randomizationState.trailRandomizationRequestedAt =
                          Date.now();
                      }),
                    );
                  },
                },
                {
                  label: "Randomize Agent Settings",
                  baseId: "randomize-agent-settings-button",
                  onClick: () => {
                    useSlimeStore.setState(
                      produce((state) => {
                        state.randomizationState.agentRandomizationRequestedAt =
                          Date.now();
                      }),
                    );
                  },
                },
                {
                  label: "Randomize Trail Settings",
                  baseId: "randomize-trail-settings-button",
                  onClick: () => {
                    useSlimeStore.setState(
                      produce((state) => {
                        state.randomizationState.trailRandomizationRequestedAt =
                          Date.now();
                      }),
                    );
                  },
                },
              ]}
            />
            <SlimeStoreSwitchControl
              label="Show FPS"
              labelHoverTabContentDisplay={[
                "Show FPS Counter",
                "Enables a small FPS (and other stats) counter at the top-left of the screen. Hidden after a few moments of inaction.",
              ]}
              baseId="simulation-controls-show-fps-switch"
              storePath={["showFPS"]}
            />
          </AccordionControlsItem>

          <AccordionControlsItem
            value="simulation-controls-presets"
            label="Presets"
            labelHoverTabContentDisplay={["Presets"]}
          >
            {sortedPresets["Simulation Only"] &&
              sortedPresets["Simulation Only"].map((preset) => (
                <SettingsLoadSaveControl
                  key={preset.name}
                  label={preset.name}
                  labelHoverTabContentDisplay={[
                    preset.name,
                    <pre className="px-2 py-1 text-[0.6rem] whitespace-pre-wrap">
                      {JSON.stringify(preset, null, 1)}
                    </pre>,
                  ]}
                  settings={preset}
                  controlType="presets"
                />
              ))}
            {sortedPresets["Combination"] &&
              sortedPresets["Combination"].map((preset) => (
                <SettingsLoadSaveControl
                  key={preset.name}
                  label={preset.name}
                  labelHoverTabContentDisplay={[
                    preset.name,
                    <pre className="px-2 py-1 text-[0.6rem] whitespace-pre-wrap">
                      {JSON.stringify(preset, null, 1)}
                    </pre>,
                  ]}
                  settings={preset}
                  controlType="presets"
                />
              ))}
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
            <SlimeStoreSelectControl
              label="Boundary Behavior"
              baseInputId="boundary-behavior-select"
              storePath={["simulationSettings", "boundaryBehavior"]}
              options={[
                { label: "Wrap", value: "0" },
                { label: "Bounce", value: "1" },
              ]}
              valueType="number"
            />
            <SlimeStoreSwitchControl
              label="Auto Rand. Enabled"
              labelHoverTabContentDisplay={[
                "Auto Randomization Enabled",
                'Allows the simulation to randomize certain parameters at set intervals. The randomization interval is set using the "Randomization Interval" slider. Control over which parameters are randomized can be found in the "Randomization Controls" tab. Auto randomization is disabled when the controls are open.',
              ]}
              baseId="auto-randomization-enabled-switch"
              storePath={["randomizationSettings", "autoRandomizationEnabled"]}
            />
            <SlimeStoreSliderControl
              label="Auto Randomization Interval"
              labelHoverTabContentDisplay={[
                "Auto Randomization Interval",
                'Controls how often (in minutes) the simulation randomizes its parameters. Control over which parameters are randomized can be found in the "Randomization Controls" tab. Has no effect when auto randomization is disabled. Auto randomization is disabled when the controls are open.',
              ]}
              baseInputId="auto-randomization-interval-slider"
              min={1}
              max={60}
              step={1}
              storePath={["randomizationSettings", "autoRandomizationInterval"]}
            />
            <SlimeStoreSwitchControl
              label="Auto Restart Enabled"
              labelHoverTabContentDisplay={[
                "Auto Restart Enabled",
                "Allows the simulation to automatically restart at set intervals. Interval is set using the 'Auto Restart Interval' slider.",
              ]}
              baseId="auto-restart-enabled-switch"
              storePath={["randomizationSettings", "autoRestartEnabled"]}
            />
            <SlimeStoreSliderControl
              label="Auto Restart Interval"
              labelHoverTabContentDisplay={[
                "Auto Restart Interval",
                "Controls how often the simulation restarts. Interval is in minutes.",
              ]}
              baseInputId="auto-restart-interval-slider"
              min={1}
              max={60}
              step={1}
              storePath={["randomizationSettings", "autoRestartInterval"]}
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
            <SlimeStoreSliderControl
              label="Density"
              labelHoverTabContentDisplay={[
                "Agent Density",
                "Controls the density of agents in the simulation. Higher values will increase the load on the GPU. Please note: a higher agent density won't always result in a better simulation since the agents need room to move around.",
              ]}
              baseInputId="agent-density-slider"
              min={0.01}
              max={1}
              step={0.01}
              storePath={["simulationSettings", "agentDensity"]}
              onValueChange={handleAgentDensityChange}
              hideSlider={true}
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
                  <li>Display Texture Aspect Ratio</li>
                  <li>Display Texture Target Quality</li>
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
              label="Display Texture Aspect Ratio"
              labelHoverTabContentDisplay={["Display Texture Aspect Ratio"]}
              baseInputId="display-texture-aspect-ratio-select"
              placeholder="Display Texture Aspect Ratio"
              storePath={["simulationSettings", "displayTextureAspectRatio"]}
              options={DISPLAY_TEXTURE_ASPECT_RATIO_OPTIONS}
              onValueChange={handleDisplayTextureAspectRatioChange}
            />
            <SlimeStoreSliderControl
              label="Display Texture Target Quality"
              labelHoverTabContentDisplay={[
                "Display Texture Target Quality",
                <div className="px-2 py-1">
                  Controls the target quality of the trail display texture. The
                  value is essentially the number of megapixels in the display
                  texture. Some loose conversions between these quality values
                  and their corresponding video quality definitions are:
                  <ul className="list-inside list-disc">
                    <li>0.3: 480p</li>
                    <li>0.9: 720p</li>
                    <li>2.1: 1080p</li>
                    <li>3.7: 1440p</li>
                    <li>8.3: 2160p</li>
                  </ul>
                  Unless you've got a beefy GPU, use caution with higher values!
                </div>,
              ]}
              baseInputId="trail-display-texture-target-quality-slider"
              min={SIMULATION_CONTROLS_CONFIGS.displayTextureTargetQuality!.min}
              max={SIMULATION_CONTROLS_CONFIGS.displayTextureTargetQuality!.max}
              step={
                SIMULATION_CONTROLS_CONFIGS.displayTextureTargetQuality!.step
              }
              storePath={["simulationSettings", "displayTextureTargetQuality"]}
              // onValueChange={handleDisplayTextureTargetQualityChange}
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
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
