import { produce } from "immer";
import { useEffect } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import CodeBlock from "../code-block/CodeBlock";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ButtonControlGroup from "./ButtonControlGroup";
import ControlGroup from "./ControlGroup";
import RandomizationPresetLoadSaveControl from "./RandomizationPresetLoadSaveControl";
import SaveRandomizationPresetPopoverButton from "./SaveRandomizationPresetPopoverButton";
import SlimeStoreNumericRangeRandomizationControl from "./SlimeStoreNumericRangeRandomizationControl";
import SlimeStoreSelectControl from "./SlimeStoreSelectControl";
import SlimeStoreSlider from "./SlimeStoreSlider";
import SlimeStoreSwitch from "./SlimeStoreSwitch";
import SlimeStoreSwitchControl from "./SlimeStoreSwitchControl";
import SwitchControlGroup from "./SwitchControlGroup";
import TabContentContainer from "./TabContentContainer";
import TabContentDisplayAreaContentWrapper from "./TabContentDisplayAreaContentWrapper";
import TabContentScrollArea from "./TabContentScrollArea";

export default function RandomizationControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);
  const randomizationPresets = useSlimeStore(
    (state) => state.randomizationPresets,
  );

  const randomizationControlsLabelHoverTabContentDisplay = [
    "Randomization Controls",
    "Controls related to the what can be randomized and when.",
  ];

  useEffect(() => {
    if (selectedTab !== "randomization-controls") return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaContentUpdatedAt = Date.now();
        state.controlsState.tabDefaultDisplayAreaHtmlContent =
          randomizationControlsLabelHoverTabContentDisplay;
        state.controlsState.displayAreaHtmlContent =
          randomizationControlsLabelHoverTabContentDisplay;
        state.controlsState.displayAreaContentName = null;
        state.controlsState.hideDisplayAreaBackground = false;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

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
            case "color":
              state.randomizationState.colorRandomizationRequestedAt =
                Date.now();
              if (randomizationSettings.allowColorRandomization) {
                randomized.push("color");
              } else {
                notRandomized.push("color");
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

  function setAutoLoadOnRandAll(
    value: boolean,
    presetType: "simulation" | "color",
  ) {
    let simulationPresets = [...useSlimeStore.getState().randomizationPresets];
    simulationPresets = simulationPresets.map((preset) => {
      const modifiedPreset = { ...preset };
      if (preset.presetType === presetType) {
        modifiedPreset.enabled = value;
      }
      return modifiedPreset;
    });
    useSlimeStore.setState(
      produce((state) => {
        state.randomizationPresets = simulationPresets;
        state.toast.title = "Auto Load on Rand. Updated";
        state.toast.description = `All ${presetType} randomization presets have been ${value ? "enabled" : "disabled"} for auto load on randomization.`;
        state.toast.type = "info";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
  }

  return (
    <TabContentContainer tabsValue="randomization-controls">
      <TabContentScrollArea title="Randomization">
        <AccordionControlsWrapper
          accordionId="randomization-controls-accordion"
          type="multiple"
          defaultValue={["quick-controls"]}
        >
          <AccordionControlsItem
            value="quick-controls"
            label="Quick Controls"
            labelHoverTabContentDisplay={[
              "Quick Controls",
              "Allows quick access to randomization toggles and buttons.",
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
                  randomization occurs (in minutes).
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
            <ControlGroup
              label="Color Auto Rand."
              labelHoverTabContentDisplay={[
                "Color Auto Randomization",
                <TabContentDisplayAreaContentWrapper>
                  Allows the color settings to randomize certain enabled
                  parameters at set intervals. The{" "}
                  <CodeBlock>enabled</CodeBlock> switch toggles
                  auto-randomization for the color settings. The{" "}
                  <CodeBlock>interval</CodeBlock> slider controls how often the
                  randomization occurs (in minutes).
                </TabContentDisplayAreaContentWrapper>,
              ]}
            >
              <SlimeStoreSwitch
                baseId="rand-controls-color-auto-randomization-enabled-switch"
                storePath={[
                  "randomizationSettings",
                  "colorAutoRandomizationEnabled",
                ]}
                switchLabel="Enabled"
              />
              <div className="flex-grow">
                <SlimeStoreSlider
                  baseInputId="rand-controls-color-auto-randomization-interval-slider"
                  min={1}
                  max={60}
                  step={1}
                  storePath={[
                    "randomizationSettings",
                    "colorAutoRandomizationInterval",
                  ]}
                  sliderLabel="Interval"
                />
              </div>
            </ControlGroup>
            <SlimeStoreSelectControl
              label="Color Auto Rand. Mode"
              labelHoverTabContentDisplay={[
                "Color Auto Randomization Mode",
                <TabContentDisplayAreaContentWrapper>
                  <ul className="list-inside list-disc">
                    <li>
                      <em>Use Random Enabled Randomization Preset: </em>
                      Randomly loads one of the <em>enabled</em> randomization
                      presets from the <em>Simulation Randomization Presets</em>
                      section below prior to randomizing the color settings. The
                      settings in the <em>Color Randomization Settings</em>{" "}
                      section are overwritten by the loaded preset.
                    </li>
                    <li>
                      <em>Use Random Enabled Color Preset: </em>
                      Randomly loads one of the <em>enabled</em> color presets
                      from the <em>Color Presets</em> tab prior to randomizing
                      the color settings.
                    </li>
                    <li>
                      <em>Use Current Randomization Settings: </em>
                      Uses the current randomization settings without loading
                      any presets.
                    </li>
                  </ul>
                </TabContentDisplayAreaContentWrapper>,
              ]}
              baseInputId="rand-controls-color-auto-randomization-mode-select"
              storePath={[
                "randomizationSettings",
                "colorAutoRandomizationMode",
              ]}
              options={[
                {
                  label: "Use Random Enabled Randomization Preset",
                  value: "selectEnabledRandomizationPreset",
                },
                {
                  label: "Use Random Enabled Color Preset",
                  value: "selectEnabledColorPreset",
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
                "Toggles to enable or disable randomization for the simulation's agent, trail, and color settings. This toggles randomization completely - independent of the auto-randomization toggles above. Auto-randomization will only randomize settings that are enabled here.",
              ]}
              switchConfigs={[
                {
                  label: "Agents",
                  baseId: "rand-controls-agent-randomization-switch",
                  storePath: [
                    "randomizationSettings",
                    "allowAgentRandomization",
                  ],
                },
                {
                  label: "Trail",
                  baseId: "rand-controls-trail-randomization-switch",
                  storePath: [
                    "randomizationSettings",
                    "allowTrailRandomization",
                  ],
                },
                {
                  label: "Color Settings",
                  baseId: "rand-controls-color-settings-randomization-switch",
                  storePath: [
                    "randomizationSettings",
                    "allowColorRandomization",
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
                'A set of buttons to quickly randomize various settings or restart the simulation. Only enabled randomizations will be applied (see the "Enabled Rands." section above).',
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
                  label: "Randomize All",
                  baseId: "randomize-all-button",
                  onClick: () => {
                    updateNeededRandomizations(["agents", "trail", "color"]);
                  },
                },
                {
                  label: "Randomize Agents",
                  baseId: "randomize-agents-button",
                  onClick: () => {
                    updateNeededRandomizations(["agents"]);
                  },
                },
                {
                  label: "Randomize Trail",
                  baseId: "randomize-trail-button",
                  onClick: () => {
                    updateNeededRandomizations(["trail"]);
                  },
                },
                {
                  label: "Randomize Color Settings",
                  baseId: "randomize-color-settings-button",
                  onClick: () => {
                    updateNeededRandomizations(["color"]);
                  },
                },
              ]}
            />
            <ControlGroup
              label="Quick Save"
              labelHoverTabContentDisplay={[
                "Quick Save - Randomization Settings",
                "These buttons allow you to save the current simulation or color randomization settings as presets. Clicking a button will open a dialog to enter the preset name prior to saving. You can manage and apply saved presets in the sections below. Preset names must be unique for each preset type.",
              ]}
            >
              <SaveRandomizationPresetPopoverButton randomizationPresetType="simulation" />
              <SaveRandomizationPresetPopoverButton randomizationPresetType="color" />
            </ControlGroup>
          </AccordionControlsItem>
          <AccordionControlsItem
            value="simulation-randomization-setting-presets"
            label="Simulation Randomization Presets"
            labelHoverTabContentDisplay={[
              "Simulation Randomization Presets",
              "Manage and apply simulation randomization settings presets.",
            ]}
          >
            <ControlGroup
              justifyContent="center"
              labelHoverTabContentDisplay={[
                "Save Current Simulation Randomization Settings as Preset",
                "Allows you to save the current simulation randomization settings as a preset. Clicking this button will open a dialog to enter the preset name prior to saving. All simulation randomization preset names must be unique. You can manage and apply your saved presets below. Default presets cannot be overwritten or deleted.",
              ]}
            >
              <SaveRandomizationPresetPopoverButton randomizationPresetType="simulation" />
            </ControlGroup>
            <ButtonControlGroup
              justifyContent="center"
              buttonConfigs={[
                {
                  label: "Enable Auto Load on Rand - All Sim.",
                  baseId: "enable-auto-load-on-rand-all-button",
                  onClick: () => setAutoLoadOnRandAll(true, "simulation"),
                },
                {
                  label: "Disable Auto Load on Rand - All Sim.",
                  baseId: "disable-auto-load-on-rand-all-button",
                  onClick: () => setAutoLoadOnRandAll(false, "simulation"),
                },
              ]}
            />
            {randomizationPresets.map((preset, index) => {
              if (preset.presetType !== "simulation") return null;
              return (
                <RandomizationPresetLoadSaveControl
                  key={preset.name}
                  index={index}
                  label={preset.name}
                  labelHoverTabContentDisplay={[
                    preset.name,
                    <pre className="px-2 py-1 text-[0.6rem] whitespace-pre-wrap">
                      {JSON.stringify(preset, null, 1)}
                    </pre>,
                  ]}
                  preset={preset}
                />
              );
            })}
          </AccordionControlsItem>
          <AccordionControlsItem
            value="agent-randomization-settings"
            label="Agent Randomization Settings"
            labelHoverTabContentDisplay={[
              "Agent Randomization Settings",
              "Controls the randomization settings for agents.",
            ]}
          >
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
            <SlimeStoreNumericRangeRandomizationControl
              label="Clock Attraction"
              baseId="clock-attraction-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentClockAttraction",
              ]}
              settingStorePath={["simulationSettings", "agentClockAttraction"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Clock Deposit Rate"
              baseId="clock-deposit-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentClockDepositRate",
              ]}
              settingStorePath={["simulationSettings", "agentClockDepositRate"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Background Deposit Rate"
              baseId="background-deposit-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentBackgroundDepositRate",
              ]}
              settingStorePath={[
                "simulationSettings",
                "agentBackgroundDepositRate",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Sensor Degrees"
              baseId="sensor-degrees-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentSensorDegrees",
              ]}
              settingStorePath={["simulationSettings", "agentSensorDegrees"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Rotation Rate"
              baseId="rotation-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentRotationRate",
              ]}
              settingStorePath={["simulationSettings", "agentRotationRate"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Sensor Offset"
              baseId="sensor-offset-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentSensorOffset",
              ]}
              settingStorePath={["simulationSettings", "agentSensorOffset"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Sensor Width"
              baseId="sensor-width-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentSensorWidth",
              ]}
              settingStorePath={["simulationSettings", "agentSensorWidth"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Step Size"
              baseId="step-size-randomization-control"
              randomizationSettingsStorePath={["simulation", "agentStepSize"]}
              settingStorePath={["simulationSettings", "agentStepSize"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Crowd Avoidance"
              baseId="crowd-avoidance-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentCrowdAvoidance",
              ]}
              settingStorePath={["simulationSettings", "agentCrowdAvoidance"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Wander Strength"
              baseId="wander-strength-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentWanderStrength",
              ]}
              settingStorePath={["simulationSettings", "agentWanderStrength"]}
            />
          </AccordionControlsItem>
          <AccordionControlsItem
            value="trail-randomization-settings"
            label="Trail Randomization Settings"
            labelHoverTabContentDisplay={[
              "Trail Randomization Settings",
              "Controls the randomization settings for trails.",
            ]}
          >
            <SlimeStoreSwitchControl
              label="Allow Boundary Behavior Rand."
              baseId="allow-boundary-behavior-randomization-switch"
              storePath={[
                "randomizationSettings",
                "allowBoundaryBehaviorRandomization",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Clock Decay Rate"
              baseId="clock-decay-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailClockDecayRate",
              ]}
              settingStorePath={["simulationSettings", "trailClockDecayRate"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Clock Diffuse Rate"
              baseId="clock-diffuse-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailClockDiffuseRate",
              ]}
              settingStorePath={["simulationSettings", "trailClockDiffuseRate"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Background Decay Rate"
              baseId="background-decay-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailBackgroundDecayRate",
              ]}
              settingStorePath={[
                "simulationSettings",
                "trailBackgroundDecayRate",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Background Diffuse Rate"
              baseId="background-diffuse-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailBackgroundDiffuseRate",
              ]}
              settingStorePath={[
                "simulationSettings",
                "trailBackgroundDiffuseRate",
              ]}
            />
          </AccordionControlsItem>
          <AccordionControlsItem
            value="color-randomization-setting-presets"
            label="Color Randomization Presets"
            labelHoverTabContentDisplay={[
              "Color Randomization Presets",
              "Manage and apply presets for color randomization settings.",
            ]}
          >
            <ControlGroup justifyContent="center">
              <SaveRandomizationPresetPopoverButton randomizationPresetType="color" />
            </ControlGroup>
            <ButtonControlGroup
              justifyContent="center"
              buttonConfigs={[
                {
                  label: "Enable Auto Load on Rand - All Colors",
                  baseId: "enable-auto-load-on-rand-all-button",
                  onClick: () => setAutoLoadOnRandAll(true, "color"),
                },
                {
                  label: "Disable Auto Load on Rand - All Colors",
                  baseId: "disable-auto-load-on-rand-all-button",
                  onClick: () => setAutoLoadOnRandAll(false, "color"),
                },
              ]}
            />
            {randomizationPresets.map((preset, index) => {
              if (preset.presetType !== "color") return null;
              return (
                <RandomizationPresetLoadSaveControl
                  key={preset.name}
                  label={preset.name}
                  index={index}
                  labelHoverTabContentDisplay={[
                    preset.name,
                    <pre className="px-2 py-1 text-[0.6rem] whitespace-pre-wrap">
                      {JSON.stringify(preset, null, 1)}
                    </pre>,
                  ]}
                  preset={preset}
                />
              );
            })}
          </AccordionControlsItem>
          <AccordionControlsItem
            value="color-randomization-settings"
            label="Color Randomization Settings"
            labelHoverTabContentDisplay={[
              "Color Randomization Settings",
              "Controls the randomization settings for colors.",
            ]}
          >
            <SlimeStoreSwitchControl
              label="Enable Bg Color Rand."
              baseId="randomization-controls-background-color-enabled-switch"
              storePath={[
                "randomizationSettings",
                "color",
                "backgroundColor",
                "enabled",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Red Y-Offset"
              baseId="red-y-offset-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "r",
                "yOffset",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "r",
                "yOffset",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Red Amplitude"
              baseId="red-amplitude-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "r",
                "amplitude",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "r",
                "amplitude",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Red Frequency"
              baseId="red-frequency-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "r",
                "frequency",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "r",
                "frequency",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Red Phase"
              baseId="red-phase-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "r",
                "phase",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "r",
                "phase",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Green Y-Offset"
              baseId="green-y-offset-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "g",
                "yOffset",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "g",
                "yOffset",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Green Amplitude"
              baseId="green-amplitude-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "g",
                "amplitude",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "g",
                "amplitude",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Green Frequency"
              baseId="green-frequency-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "g",
                "frequency",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "g",
                "frequency",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Green Phase"
              baseId="green-phase-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "g",
                "phase",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "g",
                "phase",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Blue Y-Offset"
              baseId="blue-y-offset-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "b",
                "yOffset",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "b",
                "yOffset",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Blue Amplitude"
              baseId="blue-amplitude-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "b",
                "amplitude",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "b",
                "amplitude",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Blue Frequency"
              baseId="blue-frequency-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "b",
                "frequency",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "b",
                "frequency",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Blue Phase"
              baseId="blue-phase-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "b",
                "phase",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "b",
                "phase",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Intensity Smoothing"
              baseId="randomization-controls-intensity-smoothing-randomization-control"
              randomizationSettingsStorePath={["color", "intensitySmoothing"]}
              settingStorePath={["colorSettings", "intensitySmoothing"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Agent Dir. Smoothing"
              baseId="randomization-controls-agent-direction-smoothing-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "agentDirectionSmoothing",
              ]}
              settingStorePath={["colorSettings", "agentDirectionSmoothing"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Agent Dir. Color Offset"
              baseId="randomization-controls-agent-direction-color-offset-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "agentDirectionColorOffset",
              ]}
              settingStorePath={["colorSettings", "agentDirectionColorOffset"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Clock Color Offset"
              baseId="randomization-controls-clock-color-offset-randomization-control"
              randomizationSettingsStorePath={["color", "clockColorOffset"]}
              settingStorePath={["colorSettings", "clockColorOffset"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="X Color Offset"
              baseId="randomization-controls-x-color-offset-randomization-control"
              randomizationSettingsStorePath={["color", "xColorOffset"]}
              settingStorePath={["colorSettings", "xColorOffset"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Y Color Offset"
              baseId="randomization-controls-y-color-offset-randomization-control"
              randomizationSettingsStorePath={["color", "yColorOffset"]}
              settingStorePath={["colorSettings", "yColorOffset"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Palette Cycle Speed"
              baseId="randomization-controls-palette-cycle-speed-randomization-control"
              randomizationSettingsStorePath={["color", "paletteCycleSpeed"]}
              settingStorePath={["colorSettings", "paletteCycleSpeed"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Palette Cycle Scale"
              baseId="randomization-controls-palette-cycle-scale-randomization-control"
              randomizationSettingsStorePath={["color", "paletteCycleScale"]}
              settingStorePath={["colorSettings", "paletteCycleScale"]}
            />
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
