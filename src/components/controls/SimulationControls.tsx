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
import SlimeStoreSlider from "./SlimeStoreSlider.tsx";
import SlimeStoreSliderControl from "./SlimeStoreSliderControl";
import SlimeStoreSwitch from "./SlimeStoreSwitch.tsx";
import SlimeStoreSwitchControl from "./SlimeStoreSwitchControl";
import SwitchControlGroup from "./SwitchControlGroup.tsx";
import TabContentContainer from "./TabContentContainer";
import TabContentDisplayAreaContentWrapper from "./TabContentDisplayAreaContentWrapper.tsx";
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

  function setLoadOnAutoRandAll(value: boolean) {
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
              "A few quick simulation controls.",
            ]}
          >
            <SlimeStoreSwitchControl
              label="Show FPS"
              labelHoverTabContentDisplay={[
                "Show FPS Counter",
                "Enables a small FPS counter at the top-left of the screen. Hidden after a few moments of inactivity.",
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
              labelHoverTabContentDisplay={[
                "Boundary Behavior",
                <TabContentDisplayAreaContentWrapper>
                  Controls how agents behave when they reach the edge of the
                  screen. <em>Wrap</em> causes agents to reappear on the
                  opposite side of the screen. <em>Bounce</em> causes agents to
                  turn around and move back towards the center of the screen.
                </TabContentDisplayAreaContentWrapper>,
              ]}
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
                <TabContentDisplayAreaContentWrapper>
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
                </TabContentDisplayAreaContentWrapper>,
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
            <ControlGroup
              label="Sim. Auto Rand."
              labelHoverTabContentDisplay={[
                "Simulation Auto Randomization",
                <TabContentDisplayAreaContentWrapper>
                  Allows the simulation to randomize certain enabled parameters
                  at set intervals. The <CodeBlock>enabled</CodeBlock> switch
                  toggles auto-randomization for the simulation. The{" "}
                  <CodeBlock>interval</CodeBlock> slider controls how often the
                  randomization occurs (in minutes). Auto-randomization is
                  disabled while the control panel is open.
                </TabContentDisplayAreaContentWrapper>,
              ]}
            >
              <SlimeStoreSwitch
                baseId="rand-controls-simulation-auto-randomization-enabled-switch"
                storePath={[
                  "randomizationSettings",
                  "simulationAutoRandomizationEnabled",
                ]}
                switchLabel="Enabled"
              />
              <div className="flex-grow">
                <SlimeStoreSlider
                  baseInputId="rand-controls-simulation-auto-randomization-interval-slider"
                  min={1}
                  max={60}
                  step={1}
                  storePath={[
                    "randomizationSettings",
                    "simulationAutoRandomizationInterval",
                  ]}
                  sliderLabel="Interval"
                />
              </div>
            </ControlGroup>
            <SlimeStoreSelectControl
              label="Sim. Auto Rand. Mode"
              labelHoverTabContentDisplay={[
                "Simulation Auto Randomization Mode",
                <TabContentDisplayAreaContentWrapper>
                  <ul className="list-inside list-disc">
                    <li>
                      <em>Use Random Enabled Randomization Preset: </em>
                      Randomly loads one of the <em>enabled</em> randomization
                      presets from the <em>Simulation Randomization Presets</em>{" "}
                      section below prior to randomizing the simulation. The
                      settings in the <em>Agent Randomization Settings</em> and{" "}
                      <em>Trail Randomization Settings</em> sections below are
                      overwritten by the loaded preset.
                    </li>
                    <li>
                      <em>Use Random Enabled Simulation Preset: </em>
                      Randomly loads one of the <em>enabled</em> simulation
                      presets from the <em>Simulation Presets</em> tab instead
                      of randomizing the simulation.
                    </li>
                    <li>
                      <em>Use Current Randomization Settings: </em>
                      Uses the current settings in the{" "}
                      <em>Agent Randomization Settings</em> and{" "}
                      <em>Trail Randomization Settings</em> sections below to
                      randomize the simulation.
                    </li>
                  </ul>
                </TabContentDisplayAreaContentWrapper>,
              ]}
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
                "Toggles to enable or disable randomization for the simulation's agent and trail settings. This toggles randomization completely - independent of the auto-randomization toggle above. Auto-randomization will only randomize settings that are enabled here.",
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
            <ControlGroup
              label="Auto Restart"
              labelHoverTabContentDisplay={[
                "Auto Restart",
                <TabContentDisplayAreaContentWrapper>
                  Automatically restarts the simulation at set intervals. The{" "}
                  <CodeBlock>enabled</CodeBlock> switch toggles auto-restarting
                  for the simulation. The <CodeBlock>interval</CodeBlock> slider
                  controls how often the restart occurs (in minutes).
                  Auto-restart is disabled while the control panel is open.
                </TabContentDisplayAreaContentWrapper>,
              ]}
            >
              <SlimeStoreSwitch
                baseId="rand-controls-auto-restart-enabled-switch"
                storePath={["randomizationSettings", "autoRestartEnabled"]}
                switchLabel="Enabled"
              />
              <div className="flex-grow">
                <SlimeStoreSlider
                  baseInputId="rand-controls-auto-restart-interval-slider"
                  min={1}
                  max={60}
                  step={1}
                  storePath={["randomizationSettings", "autoRestartInterval"]}
                  sliderLabel="Interval"
                />
              </div>
            </ControlGroup>
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
                'Allows you to quickly randomize the simulation settings. When a "randomize" button is pressed, only enabled randomizations will be applied (see the "Enabled Rands." section above). You can configure the randomization bounds for each setting in the "Randomization Controls" tab (the dice icon below).',
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
            labelHoverTabContentDisplay={[
              "Presets",
              "Load, save, and manage your simulation presets. Default presets cannot be overwritten or deleted.",
            ]}
          >
            <ControlGroup
              labelHoverTabContentDisplay={[
                "Save Current Settings As Preset",
                "Allows you to save the current simulation settings as a new preset. Clicking this button will open a dialog to enter the preset name prior to saving. All simulation preset names must be unique. You can manage and apply your saved presets below. Default presets cannot be overwritten or deleted.",
              ]}
              justifyContent="center"
            >
              <SaveCurrentSettingsAsPresetPopoverButton presetType="Simulation Only" />
            </ControlGroup>
            <ButtonControlGroup
              labelHoverTabContentDisplay={[
                "Load on Auto Rand. - All Sim. Presets",
                <TabContentDisplayAreaContentWrapper>
                  Enables or disables all simulation presets for load on auto
                  randomization. When the simulation auto-randomization mode is
                  set to <em>Use Random Enabled Simulation Preset</em>, one of
                  the enabled presets will be randomly loaded when the
                  auto-randomization occurs.
                </TabContentDisplayAreaContentWrapper>,
              ]}
              justifyContent="center"
              buttonConfigs={[
                {
                  label: "Enable Load on Auto Rand - All Presets",
                  baseId: "enable-load-on-auto-rand-all-button",
                  onClick: () => setLoadOnAutoRandAll(true),
                },
                {
                  label: "Disable Load on Auto Rand - All Presets",
                  baseId: "disable-load-on-auto-rand-all-button",
                  onClick: () => setLoadOnAutoRandAll(false),
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
              <TabContentDisplayAreaContentWrapper>
                Controls to allow you to modify how the agents behave within the
                simulation. <em>Agents</em> move around within the simulation,
                depositing "pheromones" on the trail layer while sensing and
                reacting to pheromone concentrations left by other agents.
                Agents will (typically) move towards higher pheromone
                concentrations, but they can also be configured to avoid
                overcrowded areas.
              </TabContentDisplayAreaContentWrapper>,
            ]}
          >
            <SlimeStoreSliderControl
              label="Density"
              labelHoverTabContentDisplay={[
                "Agent Density",
                "Controls the density of agents in the simulation. Higher values will dramatically increase the load on the GPU. Please note: a higher agent density won't always result in a better simulation since the agents need room to move around.",
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
                "Controls how much pheromone is deposited by each agent when taking an uncrowded step inside the clock display area.",
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
                "Controls how much pheromone is deposited by each agent when taking an uncrowded step outside the clock display area.",
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
                "Controls how far to the left and right (in degrees) each agent's sensors are positioned.",
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
                "Controls how quickly each agent can rotate. Higher values allow for faster rotation.",
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
                "Controls how much each agent tries to avoid crowds. Agents will not deposit pheromones when taking steps in crowded areas.",
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
              <TabContentDisplayAreaContentWrapper>
                Controls to allow you to modify how the trail layer behaves
                within the simulation. The <em>trail</em> layer is where agents
                deposit "pheromones" as they move around the simulation.
              </TabContentDisplayAreaContentWrapper>,
            ]}
          >
            <SlimeStoreSelectControl
              label="Display Texture Aspect Ratio"
              labelHoverTabContentDisplay={[
                "Display Texture Aspect Ratio",
                'The aspect ratio of the trail display texture. "Window" uses the aspect ratio of your browser window. Changing the aspect ratio will restart the simulation.',
              ]}
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
              labelHoverTabContentDisplay={[
                "Trail Clock Decay Rate",
                "Controls how quickly pheromones in the clock display area decay.",
              ]}
              baseInputId="trail-clock-decay-rate-slider"
              min={SIMULATION_CONTROLS_CONFIGS.trailClockDecayRate!.min}
              max={SIMULATION_CONTROLS_CONFIGS.trailClockDecayRate!.max}
              step={SIMULATION_CONTROLS_CONFIGS.trailClockDecayRate!.step}
              storePath={["simulationSettings", "trailClockDecayRate"]}
            />
            <SlimeStoreSliderControl
              label="Clock Diffuse Rate"
              labelHoverTabContentDisplay={[
                "Trail Clock Diffuse Rate",
                "Controls how quickly pheromones in the clock display area diffuse. More noticeable at lower resolutions, but still an important factor at any resolution.",
              ]}
              baseInputId="trail-clock-diffuse-rate-slider"
              min={SIMULATION_CONTROLS_CONFIGS.trailClockDiffuseRate!.min}
              max={SIMULATION_CONTROLS_CONFIGS.trailClockDiffuseRate!.max}
              step={SIMULATION_CONTROLS_CONFIGS.trailClockDiffuseRate!.step}
              storePath={["simulationSettings", "trailClockDiffuseRate"]}
            />
            <SlimeStoreSliderControl
              label="Background Decay Rate"
              labelHoverTabContentDisplay={[
                "Trail Background Decay Rate",
                "Controls how quickly pheromones in the background area decay.",
              ]}
              baseInputId="trail-background-decay-rate-slider"
              min={SIMULATION_CONTROLS_CONFIGS.trailBackgroundDecayRate!.min}
              max={SIMULATION_CONTROLS_CONFIGS.trailBackgroundDecayRate!.max}
              step={SIMULATION_CONTROLS_CONFIGS.trailBackgroundDecayRate!.step}
              storePath={["simulationSettings", "trailBackgroundDecayRate"]}
            />
            <SlimeStoreSliderControl
              label="Background Diffuse Rate"
              labelHoverTabContentDisplay={[
                "Trail Background Diffuse Rate",
                "Controls how quickly pheromones in the background area diffuse. More noticeable at lower resolutions, but still an important factor at any resolution.",
              ]}
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
