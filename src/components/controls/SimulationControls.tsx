import { produce } from "immer";
import { useEffect } from "react";
import {
  DISPLAY_TEXTURE_ASPECT_RATIO_OPTIONS,
  SIMULATION_CONTROLS_CONFIGS,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import {
  type DisplayTextureAspectRatio,
  type LoadableSlimeStoreSettings,
} from "../../types/types";
import * as UTILS from "../../utils/utils.tsx";
import CodeBlock from "../code-block/CodeBlock";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ButtonControlGroup from "./ButtonControlGroup.tsx";
import ControlGroup from "./ControlGroup.tsx";
import SaveCurrentSettingsAsPresetPopoverButton from "./SaveCurrentSettingsAsPresetPopoverButton.tsx";
import SimulationPresetLoadSaveControl from "./SimulationPresetLoadSaveControl.tsx";
import SlimeStoreSelectControl from "./SlimeStoreSelectControl";
import SlimeStoreSliderControl from "./SlimeStoreSliderControl";
import SlimeStoreSwitchControl from "./SlimeStoreSwitchControl";
import SwitchControlGroup from "./SwitchControlGroup.tsx";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

export default function SimulationControls() {
  const sortedSimulationPresets = useSlimeStore(
    (state) => state.sortedSimulationPresets,
  );
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
        state.controlsState.displayAreaContentName = null;
        state.controlsState.hideDisplayAreaBackground = false;
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

  function getPresetIndex(preset: LoadableSlimeStoreSettings) {
    const presets = useSlimeStore.getState().simulationPresets;
    return presets.findIndex(
      (p) => p.name === preset.name && p.presetType === preset.presetType,
    );
  }

  function setAutoLoadOnRandAll(value: boolean) {
    let simulationPresets = [...useSlimeStore.getState().simulationPresets];
    simulationPresets = simulationPresets.map((preset) => {
      const modifiedPreset = { ...preset };
      if (["Combination", "Simulation Only"].includes(preset.presetType)) {
        modifiedPreset.enabled = value;
      }
      return modifiedPreset;
    });
    useSlimeStore.setState(
      produce((state) => {
        state.simulationPresets = simulationPresets;
        state.toast.title = "Auto Load on Rand. Updated";
        state.toast.description = `All "simulation" and "combination" presets have been ${value ? "enabled" : "disabled"} for load on auto-randomization.`;
        state.toast.type = "info";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
  }

  function updateNeededRandomizations(settings: string[]) {
    const randomizationSettings =
      useSlimeStore.getState().randomizationSettings;
    const randomized: string[] = [];
    const notRandomized: string[] = [];
    useSlimeStore.setState(
      produce((state) => {
        settings.forEach((setting) => {
          switch (setting) {
            case "agents":
              state.randomizationState.agentRandomizationRequestedAt =
                Date.now();
              if (randomizationSettings.allowAgentRandomization) {
                randomized.push("agents");
              } else {
                notRandomized.push("agents");
              }
              break;
            case "trail":
              state.randomizationState.trailRandomizationRequestedAt =
                Date.now();
              if (randomizationSettings.allowTrailRandomization) {
                randomized.push("trail");
              } else {
                notRandomized.push("trail");
              }
              break;
          }
        });
        if (settings.length === 1) {
          if (randomized.length === 1) {
            state.toast.title = "Randomization Applied";
            state.toast.description = `The ${randomized[0]} settings have been randomized.`;
            state.toast.type = "success";
            state.toast.lastTriggeredAt = Date.now();
          } else if (notRandomized.length === 1) {
            state.toast.title = "Randomization Skipped";
            state.toast.description = `Randomization for ${notRandomized[0]} settings is disabled.`;
            state.toast.type = "error";
            state.toast.lastTriggeredAt = Date.now();
          }
        } else if (settings.length > 1) {
          const descriptionArray: string[] = [];
          if (randomized.length > 0) {
            descriptionArray.push(`Randomized: ${randomized.join(", ")}.`);
          }
          if (notRandomized.length > 0) {
            descriptionArray.push(`Skipped: ${notRandomized.join(", ")}.`);
          }
          let toastType = "info";
          if (randomized.length === settings.length) {
            toastType = "success";
          } else if (notRandomized.length === settings.length) {
            toastType = "error";
          }
          state.toast.title = "Randomization Info";
          state.toast.description = descriptionArray.join("\n");
          state.toast.type = toastType;
          state.toast.lastTriggeredAt = Date.now();
        }
      }),
    );
  }

  return (
    <TabContentContainer tabsValue="simulation-controls">
      <TabContentScrollArea title="Simulation">
        <AccordionControlsWrapper
          accordionId="simulation-controls-accordion"
          type="multiple"
          defaultValue={[
            "quick-controls",
            "randomization-controls",
            "simulation-controls-presets",
          ]}
        >
          <AccordionControlsItem
            value="quick-controls"
            label="Quick Controls"
            labelHoverTabContentDisplay={[
              "Quick Controls",
              <div className="px-2 py-1">
                <ul className="list-inside list-disc">
                  <li>Randomize Simulation</li>
                  <li>Randomize Agent Settings</li>
                  <li>Randomize Trail Settings</li>
                </ul>
              </div>,
            ]}
          >
            <SlimeStoreSwitchControl
              label="Show FPS"
              labelHoverTabContentDisplay={[
                "Show FPS Counter",
                "Enables a small FPS (and other stats) counter at the top-left of the screen. Hidden after a few moments of inactivity.",
              ]}
              baseId="simulation-controls-show-fps-switch"
              storePath={["showFPS"]}
            />
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
            />
          </AccordionControlsItem>
          <AccordionControlsItem
            value="randomization-controls"
            label="Randomization Controls"
            labelHoverTabContentDisplay={[
              "Randomization Controls",
              "A few simulation-related randomization controls. More robust randomization controls can be found in the 'Randomization Controls' tab (the dice icon below).",
            ]}
          >
            <SlimeStoreSwitchControl
              label="Sim. Auto Rand. Enabled"
              labelHoverTabContentDisplay={[
                "Simulation Auto Randomization Enabled",
                'Allows the simulation to randomize certain parameters at set intervals. The randomization interval is set using the \'Randomization Interval\' slider. Control over which parameters are randomized can be found in the "Agent Randomization Settings" and "Trail Randomization Settings" accordions below. Auto randomization is disabled when the controls are open.',
              ]}
              baseId="auto-randomization-enabled-switch"
              storePath={[
                "randomizationSettings",
                "simulationAutoRandomizationEnabled",
              ]}
            />
            <SlimeStoreSliderControl
              label="Sim. Auto Rand. Interval"
              labelHoverTabContentDisplay={[]}
              baseInputId="auto-randomization-interval-slider"
              min={1}
              max={60}
              step={1}
              storePath={[
                "randomizationSettings",
                "simulationAutoRandomizationInterval",
              ]}
            />
            <SlimeStoreSelectControl
              label="Sim. Auto Rand. Mode"
              labelHoverTabContentDisplay={[]}
              baseInputId="randomization-controls-auto-randomization-mode-select"
              storePath={[
                "randomizationSettings",
                "simulationAutoRandomizationMode",
              ]}
              options={[
                {
                  label: "Use Random Enabled Randomization Preset",
                  value: "selectEnabledRandomizationPreset",
                },
                {
                  label: "Use Random Enabled Simulation Preset",
                  value: "selectEnabledSimulationPreset",
                },
                {
                  label: "Use Current Randomization Settings",
                  value: "useCurrentRandomizationSettings",
                },
              ]}
            />
            <SwitchControlGroup
              label="Enabled Rands."
              labelHoverTabContentDisplay={[
                "Enabled Randomizations",
                "Toggles to enable or disable randomization for various setting groups.",
              ]}
              switchConfigs={[
                {
                  label: "Agents",
                  baseId: "agent-randomization-switch",
                  storePath: [
                    "randomizationSettings",
                    "allowAgentRandomization",
                  ],
                },
                {
                  label: "Trail",
                  baseId: "trail-randomization-switch",
                  storePath: [
                    "randomizationSettings",
                    "allowTrailRandomization",
                  ],
                },
              ]}
            />
            <SlimeStoreSwitchControl
              label="Auto Restart Enabled"
              labelHoverTabContentDisplay={[]}
              baseId="auto-restart-enabled-switch"
              storePath={["randomizationSettings", "autoRestartEnabled"]}
            />
            <SlimeStoreSliderControl
              label="Auto Restart Interval"
              labelHoverTabContentDisplay={[]}
              baseInputId="auto-restart-interval-slider"
              min={1}
              max={60}
              step={1}
              storePath={["randomizationSettings", "autoRestartInterval"]}
            />
            <SwitchControlGroup
              label="Enabled Start Types"
              labelHoverTabContentDisplay={[
                "Enabled Start Types",
                "Toggles to enable or disable randomization for various start types. Note: if all start types are disabled, then a random start type will be chosen.",
              ]}
              switchConfigs={[
                {
                  label: "Center",
                  baseId: "start-type-randomization-center-switch",
                  storePath: [
                    "randomizationSettings",
                    "agentStartTypeRandomizationOptions",
                    "options",
                    "Center",
                    "enabled",
                  ],
                },
                {
                  label: "Ring",
                  baseId: "start-type-randomization-ring-switch",
                  storePath: [
                    "randomizationSettings",
                    "agentStartTypeRandomizationOptions",
                    "options",
                    "Ring",
                    "enabled",
                  ],
                },
                {
                  label: "9 Rings",
                  baseId: "start-type-randomization-9-rings-switch",
                  storePath: [
                    "randomizationSettings",
                    "agentStartTypeRandomizationOptions",
                    "options",
                    "9 Rings",
                    "enabled",
                  ],
                },
                {
                  label: "Circle",
                  baseId: "start-type-randomization-circle-switch",
                  storePath: [
                    "randomizationSettings",
                    "agentStartTypeRandomizationOptions",
                    "options",
                    "Circle",
                    "enabled",
                  ],
                },
                {
                  label: "Spiral",
                  baseId: "start-type-randomization-spiral-switch",
                  storePath: [
                    "randomizationSettings",
                    "agentStartTypeRandomizationOptions",
                    "options",
                    "Spiral",
                    "enabled",
                  ],
                },
                {
                  label: "Fill",
                  baseId: "start-type-randomization-fill-switch",
                  storePath: [
                    "randomizationSettings",
                    "agentStartTypeRandomizationOptions",
                    "options",
                    "Fill",
                    "enabled",
                  ],
                },
                {
                  label: "Hexagonal Grid",
                  baseId: "start-type-randomization-hexagonal-grid-switch",
                  storePath: [
                    "randomizationSettings",
                    "agentStartTypeRandomizationOptions",
                    "options",
                    "Hexagonal Grid",
                    "enabled",
                  ],
                },
              ]}
            />
            <ButtonControlGroup
              label="Quick Rand."
              labelHoverTabContentDisplay={[
                "Quick Randomization",
                "Allows you to quickly randomize the simulation settings. You can configure the randomization bounds for each setting in the 'Randomization Controls' tab (the dice icon below).",
              ]}
              buttonConfigs={[
                {
                  label: "Restart Simulation",
                  baseId: "restart-simulation-button",
                  onClick: () => {
                    useSlimeStore.setState(
                      produce((state) => {
                        state.randomizationState.simulationRestartRequestedAt =
                          Date.now();
                        state.toast.title = "Simulation Restarted";
                        state.toast.description =
                          "The simulation has been restarted.";
                        state.toast.type = "info";
                        state.toast.lastTriggeredAt = Date.now();
                      }),
                    );
                  },
                },
                {
                  label: "Randomize Simulation",
                  baseId: "randomize-simulation-button",
                  onClick: () => {
                    updateNeededRandomizations(["agents", "trail"]);
                  },
                },
                {
                  label: "Randomize Agent Settings",
                  baseId: "randomize-agent-settings-button",
                  onClick: () => {
                    updateNeededRandomizations(["agents"]);
                  },
                },
                {
                  label: "Randomize Trail Settings",
                  baseId: "randomize-trail-settings-button",
                  onClick: () => {
                    updateNeededRandomizations(["trail"]);
                  },
                },
              ]}
            />
          </AccordionControlsItem>
          <AccordionControlsItem
            value="simulation-controls-presets"
            label="Presets"
            labelHoverTabContentDisplay={["Presets"]}
          >
            <ControlGroup justifyContent="center">
              <SaveCurrentSettingsAsPresetPopoverButton presetType="Simulation Only" />
            </ControlGroup>
            <ButtonControlGroup
              justifyContent="center"
              buttonConfigs={[
                {
                  label: "Enable Auto Load on Rand - All Presets",
                  baseId: "enable-auto-load-on-rand-all-button",
                  onClick: () => setAutoLoadOnRandAll(true),
                },
                {
                  label: "Disable Auto Load on Rand - All Presets",
                  baseId: "disable-auto-load-on-rand-all-button",
                  onClick: () => setAutoLoadOnRandAll(false),
                },
              ]}
            />
            {sortedSimulationPresets["Simulation Only"] &&
              sortedSimulationPresets["Simulation Only"].map((preset) => (
                <SimulationPresetLoadSaveControl
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
                  index={getPresetIndex(preset)}
                />
              ))}
            {sortedSimulationPresets["Combination"] &&
              sortedSimulationPresets["Combination"].map((preset) => (
                <SimulationPresetLoadSaveControl
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
                  index={getPresetIndex(preset)}
                />
              ))}
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
                "Controls how far each agent's sensors are from their center, in pixels.",
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
                "The width of each agent's sensors, in pixels.",
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
                "The distance each agent moves forward in a single step, in pixels.",
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
